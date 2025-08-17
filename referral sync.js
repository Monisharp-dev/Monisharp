(async function ensureReferralsStored() {
  const referralKey = "referrals";
  const syncKey = "referralFetched";
  const userId = localStorage.getItem("Id");
  const isActivated = localStorage.getItem("activateStatus");
  const lastSyncKey = "lastReferralSync"; 
  const oneDay = 24 * 60 * 60 * 1000; 

  const apiLink = [
    "https://sheetdb.io/api/v1/nl6j5kit103gh",
    "https://sheetdb.io/api/v1/npvktjn37lk2v",
    "https://sheetdb.io/api/v1/ceh2avnf98hi1"
  ];

  // ✅ Clean bad values
  let storedReferrals = parseInt(localStorage.getItem(referralKey) || "0");
  if (isNaN(storedReferrals) || storedReferrals < 0) {
    localStorage.setItem(referralKey, "0");
    storedReferrals = 0;
  }

  // Stop if no user
  if (!userId || !isActivated) {
    console.warn("Missing Id or activateStatus. Sync aborted.");
    updateReferralDisplay();
    return;
  }

  // Rate limit: 24h
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

        // ✅ Always overwrite with server
        localStorage.setItem(referralKey, referralCount.toString());
        localStorage.setItem(syncKey, "yes");
        localStorage.setItem(lastSyncKey, now.toString());

        console.log("✅ Referral count synced from server:", referralCount);
        synced = true;
        break;
      }
    } catch (err) {
      console.error("❌ Error syncing referrals:", err);
    }
  }

  // ✅ If nothing synced, force reset to 0
  if (!synced) {
    console.warn("⚠️ No referral data found. Resetting referrals to 0.");
    localStorage.setItem(referralKey, "0");
    localStorage.setItem(syncKey, "no");
  }

  updateReferralDisplay();
})();

// === Display referral count from localStorage === //
function updateReferralDisplay() {
  const referralDisplay = document.getElementById("referralNumber");
  const count = localStorage.getItem("referrals") || "0";
  if (referralDisplay) {
    referralDisplay.textContent = count;
    console.log("📦 Displayed referral count:", count);
  } else {
    console.warn("Element #referralNumber not found in DOM.");
  }
}