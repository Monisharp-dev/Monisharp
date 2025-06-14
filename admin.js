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
allotTaskBalance("etokwudog", 15, "KIVHH");
allotTaskBalance("opalekesoromdayo", 100, "0000A");
allotTaskBalance("ajaniisraelojasope11", 50, "0000A");
allotTaskBalance("gomoarukhe", 50, "0000A");
allotTaskBalance("muslimatkehinde05", 20, "0000A");
allotTaskBalance("imajerry1819", 30, "0000B");
allotTaskBalance("destinysylvanus74", 20, "MIGP7");
allotTaskBalance("chukwukajames131", 30, "0000F");
allotTaskBalance("femigodslove069", 40, "F41FA");
allotTaskBalance("etokwudog", 10, "0000L");
allotTaskBalance("idrisamuda06", 10, "0000C");
allotTaskBalance("damilolaabolade332", 30, "AJ1HT");
allotTaskBalance("whizzyboss67", 10, "0000C");
allotTaskBalance("ed9583378", 10, "0000D");
allotTaskBalance("sunsuwaamagai2020", 10, "0000B");
allotTaskBalance("usohisrael2", 20, "0000A");
allotTaskBalance("imajerry1819", 10, "0000A");
allotTaskBalance("ayomidemilekan23", 40, "0000A");
allotTaskBalance("gyess12ee", 10, "0000C");
allotTaskBalance("unwanaidiong2008", 10, "D57KP");
allotTaskBalance("akinoye7600", 40, "CXG47");
allotTaskBalance("victorumoren113", 20, "DRIOI");
allotTaskBalance("hesabasi", 20, "0000A");
allotTaskBalance("usohisrael2", 10, "0000B");
allotTaskBalance("adarikucecilia2", 10, "DVXUO");
allotTaskBalance("aademola1630", 20, "54UMK");
allotTaskBalance("ojetunbiseun", 10, "8T3PX");
allotTaskBalance("mophaserbeolokun", 10, "OB9YD");
allotTaskBalance("diyoabdulgafar24", 10, "KIAUU");
allotTaskBalance("danielakpan5050", 20, "H0EP7");
allotTaskBalance("simonejembi783", 40, "FIJYC");
allotTaskBalance("chrisfaith323", 10, "ND3G4");
allotTaskBalance("idongesitfriday84", 60, "U3LPS");
allotTaskBalance("adewoyedavid873", 10, "WIG6P");
allotTaskBalance("akatinjames409", 20, "OBDUW");
allotTaskBalance("bolashakiratafeez", 20, "SP6BR");
allotTaskBalance("fortuneokon23", 65, "IS911");
allotTaskBalance("sarchibong92", 10, "RM1S5");