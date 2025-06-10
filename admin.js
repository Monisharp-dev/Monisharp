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
allotTaskBalance("emmakani234", 70, "0000D");
allotTaskBalance("etokwudog", 35, "0000R");
allotTaskBalance("opalekesoromdayo", 100, "0000A");
allotTaskBalance("ajaniisraelojasope11", 50, "0000A");
allotTaskBalance("gomoarukhe", 50, "0000A");
allotTaskBalance("muslimatkehinde05", 20, "0000A");
allotTaskBalance("imajerry1819", 30, "0000B");
allotTaskBalance("destinysylvanus74", 20, "0000A");
allotTaskBalance("chukwukajames131", 30, "0000F");
allotTaskBalance("femigodslove069", 40, "0000D");
allotTaskBalance("etokwudog", 10, "0000L");
allotTaskBalance("idrisamuda06", 10, "0000C");
allotTaskBalance("damilolaabolade332", 10, "05CT6");
allotTaskBalance("whizzyboss67", 10, "0000C");
allotTaskBalance("ed9583378", 10, "0000D");
allotTaskBalance("sunsuwaamagai2020", 10, "0000B");
allotTaskBalance("usohisrael2", 20, "0000A");
allotTaskBalance("imajerry1819", 10, "0000A");
allotTaskBalance("ayomidemilekan23", 40, "0000A");
allotTaskBalance("gyess12ee", 10, "0000C");
allotTaskBalance("unwanaidiong2008", 60, "LIWJV");
allotTaskBalance("akinoye7600", 60, "0000B");
allotTaskBalance("victorumoren113", 10, "1NAPZ");
allotTaskBalance("hesabasi", 20, "0000A");
allotTaskBalance("usohisrael2", 10, "0000B");
allotTaskBalance("adarikucecilia2", 10, "DVXUO")