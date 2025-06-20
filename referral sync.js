(async function ensureReferralsStored() {
  const referralKey = "referrals";
  const syncKey = "referralFetched";
  const userId = localStorage.getItem("Id");
  const isActivated = localStorage.getItem("activateStatus");
  const lastSyncKey = "lastReferralSync"; // Store the last sync timestamp here
  const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  const apiLink = [
    "https://sheetdb.io/api/v1/nl6j5kit103gh",
    "https://sheetdb.io/api/v1/npvktjn37lk2v",
    "https://sheetdb.io/api/v1/ceh2avnf98hi1"
  ];

  // Stop if missing user ID or activation status
  if (!userId || !isActivated) {
    console.warn("Missing Id or activateStatus. Sync aborted.");
    updateReferralDisplay(); // Still show stored value
    return;
  }

  // Check if last sync was within 24 hours
  const lastSync = localStorage.getItem(lastSyncKey);
  const now = Date.now();
  if (lastSync && now - parseInt(lastSync) < oneDay) {
    console.log("⏳ Referral sync skipped (within 24 hours).");
    updateReferralDisplay();
    return;
  }

  console.log("🔄 Starting referral sync...");
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
            console.log("✅ Referral updated. New count is higher:", referralCount);
          } else {
            console.warn("⚠️ Referral updated. New count is LOWER:", referralCount);
          }
        } else {
          console.log("ℹ️ Referral count unchanged. Skipping update.");
        }

        localStorage.setItem(lastSyncKey, now.toString()); // ✅ Update the sync time
        synced = true;
        break;
      }
    } catch (err) {
      console.error("❌ Error syncing referrals:", err);
    }
  }

  if (!synced) {
    console.warn("⚠️ Referral data not found or all API calls failed.");
  }

  updateReferralDisplay(); // Call this at the end
})();

// Display referral count from localStorage
function updateReferralDisplay() {
  const referralDisplay = document.getElementById("referralNumber");
  const count = localStorage.getItem("referrals") || "0";
  if (referralDisplay) {
    referralDisplay.textContent = count;
    console.log("📦 Displayed referral count from localStorage:", count);
  } else {
    console.warn("Element #referralNumber not found in DOM.");
  }
}