document.addEventListener("DOMContentLoaded", () => {
    const userId = localStorage.getItem("Id") || "guest";

    // List of refunds: {userId: amount}
    const refunds = {
        "sisfathia120": 270, // example from before
        "user456": 1000,
        "user789": 250
         };

    // Key to track if refund has been applied
    const refundAppliedKey = `refundApplied_${userId}`;
    
    // Only process if refund exists and hasn't been applied before
    if(refunds[userId] && !localStorage.getItem(refundAppliedKey)) {
        const gameBalanceKey = `gameBalance_${userId}`;

        // Get current balance or set to 0
        let currentBalance = parseFloat(localStorage.getItem(gameBalanceKey)) || 0;

        // Add refund amount
        currentBalance += refunds[userId];

        // Save back to localStorage
        localStorage.setItem(gameBalanceKey, currentBalance);

        // Mark refund as applied
        localStorage.setItem(refundAppliedKey, "true");

        console.log(`Refund applied! ${refunds[userId]} added to ${userId}. New balance: ${currentBalance}`);
    } else {
        console.log("No refund to apply or already applied.");
    }
});