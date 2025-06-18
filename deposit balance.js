// ✅ Function to allot deposit balance to a user
function allotDepositBalance(userId, amount, uniqueKey) {
  // Validate input
  if (!userId || typeof amount !== "number" || !uniqueKey || uniqueKey.length !== 5) {
    console.error("❌ Invalid input: userId, amount, or key is missing or incorrect.");
    return;
  }

  // Keys for user-specific localStorage items
  const depositBalanceKey = `depositBalance_${userId}`;
  const usedKeysKey = `usedDepositKeys_${userId}`;

  // Get or initialize used keys list for this user
  const usedKeys = JSON.parse(localStorage.getItem(usedKeysKey)) || [];

  // Prevent reuse of the same key by the same user
  if (usedKeys.includes(uniqueKey)) {
    console.warn(`⚠️ Key "${uniqueKey}" already used for user "${userId}".`);
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
allotDepositBalance("johnsongideonoshla1", 100, "0000A");       // New key for Johnson
allotDepositBalance("jemeelsalawu291", 200, "0000B");           // New key for Jemeel
allotDepositBalance("Goodluckn673", 200, "0000B");              // Reuse of key — will be blocked
allotDepositBalance("blessingsalami081", 100, "0000F");         // Reuse of key — will be blocked
allotDepositBalance("isrealsolomon629", 200, "0000B");          // Reuse of key — will be blocked
allotDepositBalance("danieljubril50", 200, "0000A");               // New key for Edickson
allotDepositBalance("paulchisom34", 200,"0000A");
allotDepositBalance("udejiobinna305", 200,"0000C");