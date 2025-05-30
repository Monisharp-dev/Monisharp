document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const apiList = [
    "https://sheetdb.io/api/v1/405z3g0d9avnw",
    "https://sheetdb.io/api/v1/alt_login_api1",
    "https://sheetdb.io/api/v1/alt_login_api2"
  ];

  const showNotification = (message, status = "info", persistent = false) => {
    const existing = document.querySelector(".notify");
    if (existing) existing.remove();

    const box = document.createElement("div");
    box.className = `notify ${status}`;
    box.textContent = message;
    document.body.appendChild(box);

    if (!persistent) {
      setTimeout(() => box.remove(), 5000);
    }
  };

  const removeNotification = () => {
    const existing = document.querySelector(".notify");
    if (existing) existing.remove();
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Login attempt started.");

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      console.warn("Missing email or password.");
      showNotification("Please fill in all fields.", "error");
      return;
    }

    showNotification("Processing login...", "info", true);

    // Local check
    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");

    if (email === storedEmail && password === storedPassword) {
      console.log("Login matched from existing local storage.");
      removeNotification();
      showNotification("Login successful. Redirecting...", "success");
      setTimeout(() => window.location.href = "index.html", 2000);
      return;
    }

    // Fetch from APIs and store temporarily
    let allUsers = [];

    for (let api of apiList) {
      try {
        const res = await fetch(api);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            console.log(`Data fetched from ${api}: ${data.length} users.`);
            allUsers = allUsers.concat(data);
          }
        } else {
          console.warn(`Failed to fetch from ${api}: Status ${res.status}`);
        }
      } catch (err) {
        console.error(`Error fetching from ${api}`, err);
      }
    }

    if (allUsers.length === 0) {
      removeNotification();
      console.warn("No data fetched from any API.");
      showNotification("Login failed. Try again later.", "error");
      return;
    }

    localStorage.setItem("tempUsers", JSON.stringify(allUsers));
    console.log("User data stored temporarily in localStorage under 'tempUsers'.");

    const matchedUser = allUsers.find(
      user => user.email === email && user.password === password
    );

    if (matchedUser) {
      console.log("User match found in fetched data.");
      localStorage.setItem("email", matchedUser.email);
      localStorage.setItem("password", matchedUser.password);
      localStorage.setItem("phoneNumber", matchedUser.phoneNumber || "");
      console.log("User credentials saved permanently to localStorage.");

      localStorage.removeItem("tempUsers");
      console.log("'tempUsers' removed from localStorage.");

      removeNotification();
      showNotification("Login successful. Redirecting...", "success");
      setTimeout(() => window.location.href = "index.html", 2000);
    } else {
      console.warn("No match found in API data.");
      removeNotification();
      showNotification("Invalid login credentials. Please try again.", "error");
    }
  });
});