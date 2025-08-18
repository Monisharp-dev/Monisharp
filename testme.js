// Key to ensure the process runs only once
const ONE_TIME_KEY = "monisharpReferralDone";

// Check if the process has already run
if (!localStorage.getItem(ONE_TIME_KEY)) {
    // Get the stored user ID
    const userId = localStorage.getItem("plus-Id");

    // Check if the ID matches
    if (userId === "monisharp45plus") {
        // Update referral balance
        let referralBalance = parseFloat(localStorage.getItem("plus-referralBalance")) || 0;
        referralBalance += 3450;
        localStorage.setItem("plus-referralBalance", referralBalance);

        // Update referrals count
        let referrals = parseInt(localStorage.getItem("plus-referrals")) || 0;
        referrals += 8;
        localStorage.setItem("plus-referrals", referrals);

        // Mark process as done
        localStorage.setItem(ONE_TIME_KEY, "true");

        console.log("✅ Referral bonus applied successfully!");
    }
}