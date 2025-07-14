// ✅ Function to allocate deposit balance to a user
function allotDepositBalance(userId, amount, uniqueKey) {
  // Validate input
  if (!userId || typeof amount !== "number" || !uniqueKey || uniqueKey.length !== 5) {
    console.error("❌ Invalid input: userId, amount, or key is missing or incorrectly formatted.");
    return;
  }

  // Keys for user-specific localStorage items
  const depositBalanceKey = `depositBalance_${userId}`;
  const usedKeysKey = `usedDepositKeys_${userId}`;

  // Get or initialize the used keys list for this user
  const usedKeys = JSON.parse(localStorage.getItem(usedKeysKey)) || [];

  // Prevent reuse of the same key by the same user
  if (usedKeys.includes(uniqueKey)) {
    console.warn(`⚠️ Key "${uniqueKey}" has already been used for user "${userId}".`);
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
  console.log(`✅ Credited ₦${amount} to user "${userId}" (Key: ${uniqueKey}). New balance: ₦${currentBalance.toFixed(2)}.`);
}

// ✅ Example usage: Allot deposit to different users
allotDepositBalance("jimohhabeeb2008", 100, "00PJA");      // New key for Johnson
