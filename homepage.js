document.addEventListener("DOMContentLoaded", () => {
  console.log("homepage.js loaded. Waiting for Id...");

  let retries = 0;
  const maxRetries = 4;

  const waitForId = setInterval(() => {
    const Id = localStorage.getItem("Id");
    const email = localStorage.getItem("email");

    if (Id && email) {
      clearInterval(waitForId);
      console.log("✅ Found Id and email:", Id, email);
      runHomepageLogic(Id, email);
    } else {
      retries++;
      console.log(`⏳ Retrying (${retries}/${maxRetries})...`);
      if (retries >= maxRetries) {
        clearInterval(waitForId);
        console.warn("❌ Id or email not found after max retries.");
      }
    }
  }, 200);
});

// Show full-page blocking overlay
function showBlockingOverlay() {
  const overlay = document.createElement("div");
  overlay.id = "blockingOverlay";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  overlay.style.color = "#fff";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = "9999";
  overlay.innerHTML = `
    <div style="text-align: center;">
      <h2>⏳ Please wait...</h2>
      <p>We're verifying and posting your referral code</p>
    </div>
  `;
  document.body.appendChild(overlay);
}

// Hide overlay
function hideBlockingOverlay() {
  const overlay = document.getElementById("blockingOverlay");
  if (overlay) overlay.remove();
}

async function runHomepageLogic(Id, email) {
  const activated = localStorage.getItem("activateStatus");
  const referralPosted = localStorage.getItem("referralPosted");
  let referralCode = localStorage.getItem("referralCode");

  if (!activated || referralCode || referralPosted === "true") {
    console.log("✅ Conditions not met. Skipping posting logic.");
    return;
  }

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

  // Show blocking UI
  showBlockingOverlay();

  // Generate referralCode
  const generateReferralCode = (email) => {
    const name = email.split("@")[0];
    const letters = name.replace(/[^a-z]/gi, '').substring(0, 3).toUpperCase().padEnd(3, 'X');
    const timestamp = Date.now().toString().slice(-6, -3);
    const random = Math.floor(100 + Math.random() * 900);
    return `PL-${letters}-${timestamp}-${random}`;
  };

  referralCode = generateReferralCode(email);
  localStorage.setItem("referralCode", referralCode);
  console.log("🎉 Generated referralCode:", referralCode);

  // Attempt to post
  const payload = { Id, referralCode };
  console.log("📡 Posting referral data...");

  const success = await postWithFallback(referralApis, payload);

  if (success) {
    localStorage.setItem("referralPosted", "true");
    console.log("✅ Referral posted successfully.");
    hideBlockingOverlay();
  } else {
    localStorage.setItem("referralPosted", "false");
    console.warn("❌ Referral not posted. Show overlay permanently.");
    alert("❌ Failed to post referral code.\nPlease notify admin on our Facebook page.");
    // Overlay remains until successful post
  }
}