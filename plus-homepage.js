document.addEventListener("DOMContentLoaded", () => {
  const isActivated = localStorage.getItem("plusActivated");
  if (!isActivated) {
    console.log("⛔ Not activated. Script skipped.");
    return;
  }

  const Id = localStorage.getItem("plus-Id");
  const email = localStorage.getItem("plus-email");

  if (Id && email) {
    console.log("✅ User activated and info found:", Id, email);
    runHomepageLogic(Id, email);
  } else {
    console.warn("⚠️ Activated but missing Id or email.");
  }
});

function showReferralNotification() {
  // Inject styles
  const style = document.createElement("style");
  style.textContent = `
    .referral-overlay {
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.75);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .referral-popup-box {
      background-color: #1e3a8a;
      color: #ffffff;
      padding: 20px 30px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 500;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
      animation: fadeIn 0.3s ease;
      max-width: 90%;
      text-align: center;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement("div");
  overlay.className = "referral-overlay";

  const popup = document.createElement("div");
  popup.className = "referral-popup-box";
  popup.textContent = "⏳ Please wait while your account is being validated...";

  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  // Return a function to update status
  return (status) => {
    if (status === "success") {
      popup.textContent = "✅ Referral posted successfully!";
      setTimeout(() => overlay.remove(), 1800);
    } else {
      popup.textContent = "⚠️ Failed to post referral. Please notify admin.";
      alert("⚠️ Could not complete referral posting. Please contact admin on Facebook immediately.");
      // Overlay remains until manual reload or retry
    }
  };
}

async function runHomepageLogic(Id, email) {
  const referralApis = [
    "https://sheetdb.io/api/v1/ceh2avnf98hi1",
    "https://sheetdb.io/api/v1/npvktjn37lk2v"
  ];

  const postWithFallback = async (apiList, data) => {
    for (const api of apiList) {
      try {
        const res = await fetch(api, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          console.log(`✅ Successfully posted to API: ${api}`);
          return true;
        } else {
          console.warn(`⚠️ Failed to post to ${api}. Status: ${res.status}`);
        }
      } catch (err) {
        console.error(`❌ Error posting to ${api}:`, err);
      }
    }
    return false;
  };

  let referralCode = localStorage.getItem("plus-referralCode");
  const hidePopup = showReferralNotification();

  if (!referralCode) {
    const generatePlusReferralCode = (email) => {
      const name = email.split("@")[0];
      const letters = name.replace(/[^a-z]/gi, '').substring(0, 3).toUpperCase().padEnd(3, 'X');
      const timestamp = Date.now().toString().slice(-6, -3); // middle 3 digits of timestamp
      const random = Math.floor(100 + Math.random() * 900);  // 3-digit random
      return `PL-${letters}-${timestamp}-${random}`;
    };

    referralCode = generatePlusReferralCode(email);
    localStorage.setItem("plus-referralCode", referralCode);
    console.log("🎉 Generated Plus referralCode:", referralCode);
  } else {
    console.log("ℹ️ referralCode already exists:", referralCode);
  }

  if (localStorage.getItem("plus-referralPosted") === "true") {
    console.log("✅ Referral already posted. Skipping...");
    hidePopup("success");
    return;
  }

  const payload = { Id, referralCode };
  console.log("📡 Posting referral data...");

  const success = await postWithFallback(referralApis, payload);

  if (success) {
    localStorage.setItem("plus-referralPosted", "true");
    console.log("✅ Referral data posted and flag saved.");
    hidePopup("success");
  } else {
    localStorage.setItem("plus-referralPosted", "false");
    console.warn("❌ Failed to post referral data.");
    hidePopup("error"); // keeps overlay visible and alerts user
  }
}