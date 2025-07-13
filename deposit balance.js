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
allotDepositBalance("johnsongideonoshla1", 100, "0000A");      // New key for Johnson
allotDepositBalance("jemeelsalawu291", 200, "0000B");          // New key for Jemeel
allotDepositBalance("jimohhabeeb2008", 100, "000KC");          // Reuse or invalid — will be blocked
allotDepositBalance("blessingsalami081", 100, "0000F");        // Reuse or invalid — will be blocked
allotDepositBalance("isrealsolomon629", 200, "0000C");         // Reuse or invalid — will be blocked
allotDepositBalance("danieljubril50", 200, "0000A");           // Reuse — will be blocked
allotDepositBalance("paulchisom34", 300, "0000B");             // Reuse — will be blocked
allotDepositBalance("udejiobinna305", 200, "0000C");           // Reuse — will be blocked
allotDepositBalance("oduduabasibassey608", 100, "0000C");      // Reuse — will be blocked
allotDepositBalance("surpriseoyelayo", 200, "0000C");          // Reuse — will be blocked
allotDepositBalance("inansdaniel", 100, "0000C");              // Reuse — will be blocked
allotDepositBalance("mbamisaacchibuike", 200, "0000B");        // Reuse — will be blocked
allotDepositBalance("realearners01", 100, "0000L");            // New key
allotDepositBalance("gift36385", 400, "0000F");                // Reuse — will be blocked
allotDepositBalance("omololaoluwakemipop", 200, "0000C");      // Reuse — will be blocked
allotDepositBalance("ngoziblessingawah", 200, "0000D");        // New key
allotDepositBalance("femigodslove069", 500, "0000N");          // New key
allotDepositBalance("hammadumar346", 300, "0000K");            // New key
allotDepositBalance("markadepoju1", 100, "P000Z");             // New key