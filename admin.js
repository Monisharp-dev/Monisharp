function allotTaskBalance(userId, amount, uniqueKey) {
  if (!userId || typeof amount !== "number" || !uniqueKey || uniqueKey.length !== 5) {
    console.error("Missing or invalid userId, amount, or key.");
    return;
  }

  const taskBalanceKey = `taskBalance_${userId}`;
  const usedKeysKey = `usedTaskKeys_${userId}`;

  let usedKeys = JSON.parse(localStorage.getItem(usedKeysKey)) || [];

  if (usedKeys.includes(uniqueKey)) {
    console.log(`Key "${uniqueKey}" already used for user ${userId}.`);
    return;
  }

  let currentBalance = parseFloat(localStorage.getItem(taskBalanceKey)) || 0;
  currentBalance += amount;

  localStorage.setItem(taskBalanceKey, currentBalance.toFixed(2));
  usedKeys.push(uniqueKey);
  localStorage.setItem(usedKeysKey, JSON.stringify(usedKeys));

  console.log(`User ${userId} credited ₦${amount} (Key: ${uniqueKey}).`);
}

// Allotting task balances to multiple users
allotTaskBalance("etokwudog", 150, "0000B");
allotTaskBalance("favyjay28", 100, "XYZ89");
allotTaskBalance("opalekesoromdayo", 100,"0000A");
allotTaskBalance("ajaniisraelojasope11", 50, "0000A");
allotTaskBalance("gomoarukhe", 50, "0000A");

