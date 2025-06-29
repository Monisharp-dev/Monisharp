(async function ensureReferralsStored() {
  const referralKey = "plus-referrals";
  const syncKey = "plus-referralFetched";
  const userId = localStorage.getItem("plus-Id");
  const isActivated = localStorage.getItem("plusActivated"); // DO NOT CHANGE PREFIX HERE
  const lastSyncKey = "plus-lastReferralSync";
  const oneDay = 24 * 60 * 60 * 1000;

  const apiLink = [
    "https://sheetdb.io/api/v1/nl6j5kit103gh",
    "https://sheetdb.io/api/v1/npvktjn37lk2v",
    "https://sheetdb.io/api/v1/ceh2avnf98hi1"
  ];

  if (!userId || !isActivated) {
    console.warn("❌ Missing 'plus-Id' or 'plusActivated'. Sync aborted.");
    updateReferralDisplay();
    return;
  }

  const lastSync = localStorage.getItem(lastSyncKey);
  const now = Date.now();

  if (lastSync && now - parseInt(lastSync) < oneDay) {
    console.log("⏳ Skipping referral sync: last sync was within 24 hours.");
    updateReferralDisplay();
    return;
  }

  console.log("🔄 Attempting referral sync...");

  let synced = false;

  for (let url of apiLink) {
    try {
      const response = await fetch(url);
      const data = await response.json();

      const user = data.find(u => u.Id === userId);
      if (user) {
        const referralCount = parseInt(user.referrals || "0");
        const previousCount = parseInt(localStorage.getItem(referralKey) || "0");

        if (referralCount !== previousCount) {
          localStorage.setItem(referralKey, referralCount);
          localStorage.setItem(syncKey, "yes");

          if (referralCount > previousCount) {
            console.log("✅ Referral count increased to:", referralCount);
          } else {
            console.log("⚠️ Referral count decreased or unchanged:", referralCount);
          }
        } else {
          console.log("ℹ️ Referral count unchanged. No update needed.");
        }

        localStorage.setItem(lastSyncKey, now.toString());
        synced = true;
        break;
      }
    } catch (err) {
      console.error("❌ Failed fetching referral data from:", url, err);
    }
  }

  if (!synced) {
    console.warn("⚠️ Referral data not found or all API calls failed.");
  }

  updateReferralDisplay();
})();

// Display referral count from localStorage
function updateReferralDisplay() {
  const referralDisplay = document.getElementById("referralNumber");
  const count = localStorage.getItem("plus-referrals") || "0";

  if (referralDisplay) {
    referralDisplay.textContent = count;
    console.log("📦 Displayed referral count:", count);
  } else {
    console.warn("⚠️ Element #referralNumber not found.");
  }
}