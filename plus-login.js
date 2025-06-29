document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const apiList = [
    "https://sheetdb.io/api/v1/okda0ptyi2lt1",
    "https://sheetdb.io/api/v1/nwaqj66tx0aax",
    "https://sheetdb.io/api/v1/405z3g0d9avnw",
    "https://sheetdb.io/api/v1/oawvpqtgfg14g",
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

  // Helper to get/set plus-prefixed keys
  const setPlus = (key, value) => localStorage.setItem(`plus-${key}`, value);
  const getPlus = (key) => localStorage.getItem(`plus-${key}`);
  const removePlus = (key) => localStorage.removeItem(`plus-${key}`);

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

    const storedEmail = getPlus("email");
    const storedPassword = getPlus("password");

    if (storedEmail && storedPassword && email === storedEmail && password === storedPassword) {
      console.log("Credentials match found in local storage. Skipping API request.");
      showNotification("Login successful. Redirecting...", "success");
      setTimeout(() => window.location.href = "plus-index.html", 2000);
      return;
    }

    showNotification("Processing login...", "info", true);

    let matchedUser = null;

    for (let api of apiList) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const res = await fetch(api, { signal: controller.signal });
        clearTimeout(timeout);

        if (res.ok) {
          const data = await res.json();
          console.log(`✅ Success from ${api}: ${data.length} users fetched.`);

          matchedUser = data.find(
            user => user.email === email && user.password === password
          );

          if (matchedUser) {
            console.log("🎯 Match found. Stopping further API checks.");
            break;
          } else {
            console.log(`🔍 No match in data from ${api}`);
          }
        } else {
          console.warn(`❌ API ${api} responded with status ${res.status}`);
        }
      } catch (err) {
        console.warn(`⚠️ API ${api} failed or was too slow:`, err.message);
      }
    }

    removeNotification();

    if (matchedUser) {
      console.log("Login successful via API. Saving credentials...");

      setPlus("email", matchedUser.email);
      setPlus("password", matchedUser.password);
      setPlus("phoneNumber", matchedUser.phoneNumber || "");

      removePlus("tempUsers");
      console.log("'plus-tempUsers' removed from localStorage.");

      const isFirstLogin = !(storedEmail && storedPassword);
      if (isFirstLogin) {
        setPlus("firstTime", "true");
        showNotification("First time login. Redirecting for verification...", "info");
      } else {
        showNotification("Login successful. Redirecting...", "success");
      }

      setTimeout(() => window.location.href = "plus-index.html", 2000);
    } else {
      console.warn("No match found from any API.");
      showNotification("Invalid login credentials. Please try again.", "error");
    }
  });
});