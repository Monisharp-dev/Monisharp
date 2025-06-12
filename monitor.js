// 🛠 Auto-fix for incorrect balances due to missing or 0 referrals
(function fixFakeBalances() {
  const referrals = localStorage.getItem("referrals");
  const mainBalance = localStorage.getItem("mainBalance");
  const referralBalance = localStorage.getItem("referralBalance");

  console.log("🔍 Checking referral data...");

  if (referrals === null || referrals === "0") {
    console.log("⚠️ No referrals found (value is null or 0).");

    // Fix mainBalance if wrong
    if (mainBalance !== "0") {
      localStorage.setItem("mainBalance", "0");
      console.log(`✅ mainBalance corrected to ₦0`);
    } else {
      console.log(`✅ mainBalance already correct (₦0)`);
    }

    // Fix referralBalance if wrong
    if (referralBalance !== "0") {
      localStorage.setItem("referralBalance", "0");
      console.log(`✅ referralBalance corrected to ₦0`);
    } else {
      console.log(`✅ referralBalance already correct (₦0)`);
    }
  } else {
    console.log(`✅ Referrals detected (${referrals}). Balances left untouched.`);
  }
})();