document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const inputs = document.querySelectorAll("input");
  const submitBtn = document.querySelector(".submit-btn");

  if (!form || inputs.length === 0 || !submitBtn) {
    console.error("Form or inputs not found. Aborting script.");
    return;
  }

  const apiList = [
    "https://sheetdb.io/api/v1/405z3g0d9avnw",
    "https://sheetdb.io/api/v1/oawvpqtgfg14g",
    "https://sheetdb.io/api/v1/alt_api2"
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

  // Check if email and password already exist
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

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstName")?.value.trim();
    const lastName = document.getElementById("lastName")?.value.trim();
    const phone = document.getElementById("phoneNumber")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value.trim();
    const referee = document.getElementById("referral")?.value.trim();

    console.log("Form submitted. Starting validation...");

    // Validate all fields
    if (!firstName || !lastName || !phone || !email || !password) {
      console.warn("Validation failed: All fields are required.");
      showNotification("All fields are required.", "error");
      return;
    }

    // Validate email
    if (!/@gmail\.com$/.test(email)) {
      console.warn("Invalid email domain.");
      showNotification("Email must be a Gmail address.", "error");
      return;
    }

    // Validate phone number prefix
    if (!/^(?:\+234|080|081|070|071|090|091)/.test(phone)) {
      console.warn("Invalid phone number prefix.");
      showNotification("Phone must start with +234, 080, 081, 070, 071, 090 or 091.", "error");
      return;
    }

    // Check for duplicate user data
    if (
      firstName === localStorage.getItem("firstName") &&
      lastName === localStorage.getItem("lastName") &&
      phone === localStorage.getItem("phoneNumber") &&
      email === localStorage.getItem("email") &&
      password === localStorage.getItem("password")
    ) {
      console.warn("Duplicate user data detected.");
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

    let success = false;

    showNotification("Processing your registration...", "info", true);
    console.log("Sending data to API...");

    for (let api of apiList) {
      try {
        const res = await fetch(api, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: userData })
        });

        if (res.ok) {
          console.log(`Successfully sent data to API: ${api}`);
          success = true;
          break;
        } else {
          console.warn(`Server responded with error on: ${api}`);
        }
      } catch (err) {
        console.warn(`API request failed: ${api}`, err);
      }
    }

    removeNotification();

    if (success) {
      localStorage.setItem("firstName", firstName);
      localStorage.setItem("lastName", lastName);
      localStorage.setItem("phoneNumber", phone);
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);
      localStorage.setItem("refereeCode", referee);

      console.log("Registration complete. Redirecting to dashboard...");
      showNotification("Signup successful! Redirecting...", "success");
      setTimeout(() => window.location.href = "index.html", 2000);
    } else {
      console.error("All API servers failed.");
      showNotification("Signup failed. All servers unreachable. Try again later.", "error");
    }
  });
});



