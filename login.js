document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
 const apiList = [
  "https://sheetdb.io/api/v1/405z3g0d9avnw",
  "https://sheetdb.io/api/v1/oawvpqtgfg14g",
  "https://sheetdb.io/api/v1/nwaqj66tx0aax",
  "https://sheetdb.io/api/v1/ot1b8mxw83ll6"
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

    const email = document.getElementById("login_email").value.trim();
    const password = document.getElementById("login_password").value.trim();

    if (!email || !password) {
      console.warn("Missing email or password.");
      showNotification("Please fill in all fields.", "error");
      return;
    }

    showNotification("Processing login...", "info", true);

    const alreadyStored = localStorage.getItem("email") && localStorage.getItem("password");

    // First, check local storage match
    if (alreadyStored && email === localStorage.getItem("email") && password === localStorage.getItem("password")) {
      console.log("Login matched from existing local storage.");
      removeNotification();
      showNotification("Login successful. Redirecting...", "success");
      setTimeout(() => window.location.href = "index.html", 2000);
      return;
    }

    // Fetch from APIs
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

    const matchedUser = allUsers.find(
      user => user.email === email && user.password === password
    );

    if (matchedUser) {
      console.log("User match found in fetched data.");

      // Save credentials
      localStorage.setItem("email", matchedUser.email);
      localStorage.setItem("password", matchedUser.password);
      localStorage.setItem("phoneNumber", matchedUser.phoneNumber || "");

      localStorage.removeItem("tempUsers");
      console.log("'tempUsers' removed from localStorage.");

      removeNotification();

      if (!alreadyStored) {
        // First time login
        localStorage.setItem("firstTime", "true");
        console.log("First time login detected. Redirecting to verification.");
        showNotification("First time login. Redirecting for verification...", "info");
        setTimeout(() => window.location.href = "index.html", 2000);
      } else {
        // Returning user
        showNotification("Login successful. Redirecting...", "success");
        setTimeout(() => window.location.href = "index.html", 2000);
      }

    } else {
      console.warn("No match found in API data.");
      removeNotification();
      showNotification("Invalid login credentials. Please try again.", "error");
    }
  });
});