// ✅ Function to get the currently logged-in user's ID from localStorage (using "plus-Id")
function getCurrentUserId() {
  const userId = localStorage.getItem("plus-Id");
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

  const depositBalanceKey = `plus-depositBalance_${userId}`;
  const usedKeysKey = `plus-usedDepositKeys_${userId}`;

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
allotDepositBalance("etokwudogplus", 600, "2S7KL");
allotDepositBalance("destinysylvanus74", 200, "000VB");
allotDepositBalance("udejiobinna305", 300, "000AA");
allotDepositBalance("akpesiriedward5", 98, "000AB");
allotDepositBalance("greatnessedet8plus", 300,"000FG")
// ✅ Optional: Credit the currently logged-in user (if any)
const loggedInUserId = getCurrentUserId();
if (loggedInUserId) {
  allotDepositBalance(loggedInUserId, 0, "00PJA");
}
