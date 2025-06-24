document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const inputs = document.querySelectorAll("input");
  const submitBtn = document.querySelector(".submit-btn");

  if (!form || inputs.length === 0 || !submitBtn) {
    console.error("Form or inputs not found. Aborting script.");
    return;
  }

  const apiList = [
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

  const existingEmail = localStorage.getItem("email");
  const existingPassword = localStorage.getItem("password");

  if (existingEmail && existingPassword) {
    console.log("Account already exists on this device.");
    inputs.forEach(input => input.disabled = true);
    submitBtn.disabled = true;

    showNotification("An account already exists on this device. Redirecting to login...", "info", true);

    setTimeout(() => {
      removeNotification();
      window.location.href = "login.html";
    }, 4000);
    return;
  }

  // Utility: Send to first working API in the list
  const sendToFirstAvailableApi = async (data, timeout = 5000) => {
    for (let api of apiList) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeout);

        const res = await fetch(api, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data }),
          signal: controller.signal
        });

        clearTimeout(timer);

        if (res.ok) {
          console.log(`✅ Success: Data sent to ${api}`);
          return true;
        } else {
          console.warn(`❌ Error: ${api} responded with status ${res.status}`);
        }
      } catch (err) {
        console.warn(`⚠️ Failed to connect to ${api}`, err.message);
      }
    }
    return false;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstName")?.value.trim();
    const lastName = document.getElementById("lastName")?.value.trim();
    const phone = document.getElementById("phoneNumber")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value.trim();
    const referee = document.getElementById("referral")?.value.trim();

    if (!firstName || !lastName || !phone || !email || !password) {
      showNotification("All fields are required.", "error");
      return;
    }

    if (!/@gmail\.com$/.test(email)) {
      showNotification("Email must be a Gmail address.", "error");
      return;
    }

    if (!/^(?:\+234|080|081|070|071|090|091)/.test(phone)) {
      showNotification("Phone must start with +234, 080, 081, 070, 071, 090 or 091.", "error");
      return;
    }

    if (
      firstName === localStorage.getItem("firstName") &&
      lastName === localStorage.getItem("lastName") &&
      phone === localStorage.getItem("phoneNumber") &&
      email === localStorage.getItem("email") &&
      password === localStorage.getItem("password")
    ) {
      showNotification("Duplicate user data found. Please clear local storage.", "error");
      return;
    }

    const userData = {
      firstName,
      lastName,
      phoneNumber: phone,
      email,
      password
    };

    showNotification("Processing your registration...", "info", true);
    console.log("⏳ Attempting to send data...");

    const sent = await sendToFirstAvailableApi(userData);

    removeNotification();

    if (sent) {
      localStorage.setItem("firstName", firstName);
      localStorage.setItem("lastName", lastName);
      localStorage.setItem("phoneNumber", phone);
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);
      localStorage.setItem("refereeCode", referee);

      showNotification("Signup successful! Redirecting...", "success");
      setTimeout(() => window.location.href = "index.html", 2000);
    } else {
      showNotification("Signup failed. All servers unreachable. Try again later.", "error");
    }
  });
});