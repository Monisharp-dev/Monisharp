// Admin.js

// Function to generate a 5-character unique ID (optional utility)
function generateUniqueId() {
    return Math.random().toString(36).substring(2, 7).toUpperCase();
}

// Main function to add seed balance
function addSeedBalance(userId, amount, uniqueId) {
    // Get all existing transactions from localStorage
    let allTransactions = JSON.parse(localStorage.getItem("seedTransactions")) || {};

    // If this user already has transactions, initialize
    if (!allTransactions[userId]) {
        allTransactions[userId] = {
            usedIds: [],
            seedBalance: 0
        };
    }

    // Prevent duplicate transaction
    if (allTransactions[userId].usedIds.includes(uniqueId)) {
        console.warn("Duplicate transaction. ID already used.");
        return false;
    }

    // Update user's seed balance
    allTransactions[userId].seedBalance += amount;

    // Record the unique ID
    allTransactions[userId].usedIds.push(uniqueId);

    // Save updated data to localStorage
    localStorage.setItem("seedTransactions", JSON.stringify(allTransactions));

    // Optional: if the user is the currently logged-in one, update their localStorage directly
    if (localStorage.getItem("Id") === userId) {
        localStorage.setItem("seedBalance", allTransactions[userId].seedBalance);
    }

    console.log(`₦${amount} added to ${userId}. New seed balance: ₦${allTransactions[userId].seedBalance}`);
    return true;
}

// === Example Usage ===
// Adds ₦1400 to user with Id 'tydggd56' using unique ID 'A1B2C'
addSeedBalance("thehacker190261", 100, "0000B");

// Try again with the same ID to see the duplicate prevention
addSeedBalance("tydggd56", 1400, "A1B2C"); // This should log a warning and not add again