// ✅ Function to allot deposit balance to a user
function allotDepositBalance(userId, amount, uniqueKey) {
  // Validate input
  if (!userId || typeof amount !== "number" || !uniqueKey || uniqueKey.length !== 5) {
    console.error("Missing or invalid userId, amount, or key.");
    return;
  }

  // Keys for user-specific localStorage items
  const depositBalanceKey = `depositBalance_${userId}`;
  const usedKeysKey = `usedDepositKeys_${userId}`;

  // Get or initialize used keys list for this user
  let usedKeys = JSON.parse(localStorage.getItem(usedKeysKey)) || [];

  // Prevent reuse of the same key by the same user
  if (usedKeys.includes(uniqueKey)) {
    console.log(`Key "${uniqueKey}" already used for user ${userId}.`);
    return;
  }

  // Get current balance or default to 0
  let currentBalance = parseFloat(localStorage.getItem(depositBalanceKey)) || 0;

  // Add deposit amount
  currentBalance += amount;

  // Save updated balance
  localStorage.setItem(depositBalanceKey, currentBalance.toFixed(2));

  // Update used keys and save
  usedKeys.push(uniqueKey);
  localStorage.setItem(usedKeysKey, JSON.stringify(usedKeys));

  // Log success
  console.log(`User ${userId} credited ₦${amount} to deposit (Key: ${uniqueKey}).`);
}

// ✅ Example usage: allot deposit to different users
allotDepositBalance("johnsongideonoshla1", 100, "0000A");    // New key for johnson
allotDepositBalance("jemeelsalawu291", 200, "0000B");       // New key for jemeel
allotDepositBalance("Goodluckn673", 200,"0000B");
allotDepositBalance("blessingsalami081", 100,"0000B");
allotDepositBalance("isrealsolomon629", 200,"0000B");
allotDepositBalance("edickson774",200,"0000C");
