// ✅ Function to get the currently logged-in user's ID from localStorage
function getCurrentUserId() {
  const userId = localStorage.getItem("Id");
  if (!userId) {
    console.error("❌ No user is currently logged in.");
    return null;
  }
  return userId;
}

// ✅ Function to allocate deposit balance to a user
function allotDepositBalance(userId, amount, uniqueKey) {
  if (!userId || typeof amount !== "number" || !uniqueKey || uniqueKey.length !== 5) {
    console.error("❌ Invalid input: userId, amount, or key is missing or incorrectly formatted.");
    return;
  }

  const depositBalanceKey = `depositBalance_${userId}`;
  const usedKeysKey = `usedDepositKeys_${userId}`;

  const usedKeys = JSON.parse(localStorage.getItem(usedKeysKey)) || [];

  if (usedKeys.includes(uniqueKey)) {
    console.warn(`⚠️ Key "${uniqueKey}" has already been used for user "${userId}".`);
    return;
  }

  let currentBalance = parseFloat(localStorage.getItem(depositBalanceKey)) || 0;
  currentBalance += amount;

  localStorage.setItem(depositBalanceKey, currentBalance.toFixed(2));
  usedKeys.push(uniqueKey);
  localStorage.setItem(usedKeysKey, JSON.stringify(usedKeys));

  console.log(`✅ Credited ₦${amount} to user "${userId}" (Key: ${uniqueKey}). New balance: ₦${currentBalance.toFixed(2)}.`);
}

// ✅ Allotments to specific users (manual and direct)
allotDepositBalance("edickson774", 600, "2S7KL");
allotDepositBalance("jimohhabeeb2008", 200, "000VB");
allotDepositBalance("ibehaugustine933", 300, "000AA");

// ✅ Optional: Credit the currently logged-in user (if any)
const loggedInUserId = getCurrentUserId();
if (loggedInUserId) {
  allotDepositBalance(loggedInUserId, 0, "00PJA");
}