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
allotTaskBalance("etokwudog", 15, "B8RRR");
allotTaskBalance("opalekesoromdayo", 20, "FZILC");
allotTaskBalance("ajaniisraelojasope11", 50, "0000A");
allotTaskBalance("gomoarukhe", 30, "EP92I");
allotTaskBalance("muslimatkehinde05", 20, "0000A");
allotTaskBalance("imajerry1819", 30, "0000B");
allotTaskBalance("destinysylvanus74", 20, "MIGP7");
allotTaskBalance("chukwukajames131", 30, "0000F");
allotTaskBalance("femigodslove069", 10, "IOBK6");
allotTaskBalance("etokwudog", 10, "0000L");
allotTaskBalance("idrisamuda06", 10, "0000C");
allotTaskBalance("damilolaabolade332", 30, "2EWWN");
allotTaskBalance("whizzyboss67", 10, "0000C");
allotTaskBalance("ed9583378", 10, "0000D");
allotTaskBalance("sunsuwaamagai2020", 10, "0000B");
allotTaskBalance("usohisrael2", 20, "0000A");
allotTaskBalance("imajerry1819", 10, "0000A");
allotTaskBalance("ayomidemilekan23", 40, "0000A");
allotTaskBalance("gyess12ee", 10, "0000C");
allotTaskBalance("unwanaidiong2008", 20, "ZB4RO");
allotTaskBalance("akinoye7600", 20, "919I9");
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
allotTaskBalance("adewoyedavid873", 20, "HVTS8");
allotTaskBalance("akatinjames409", 20, "OBDUW");
allotTaskBalance("bolashakiratafeez", 20, "SP6BR");
allotTaskBalance("fortuneokon23", 65, "IS911");
allotTaskBalance("sarchibong92", 25, "LSID2");
allotTaskBalance("buchiflex13", 30, "NCY43");
allotTaskBalance("taiwoolamilekan890", 40, "3FDPU");
allotTaskBalance("favourboy817", 30, "6OL3B");
allotTaskBalance("umohaniekeme42", 10, "CX2WQ");
allotTaskBalance("johnsongideonoshla1", 40, "ACTRV");
allotTaskBalance("yakubuhanifat202", 10, "E47OD");
allotTaskBalance("adebisivictor901", 40, "C0628");
allotTaskBalance("inansdaniel", 30, "ENMO7");
allotTaskBalance("judeephraim2007", 20, "3QX8A");
allotTaskBalance("godwinyaki3", 60, "4RBYZ");
allotTaskBalance("omoizehappy", 20, "O6CWA");
allotTaskBalance("persismakama", 10, "3C0WH");
allotTaskBalance("rutie7omare", 65, "DEFH7");
allotTaskBalance("miraclegloryudoh", 10, "1CXRY");
allotTaskBalance("hamidilias70", 40, "EATGI");
allotTaskBalance("olakunleoyetolasunday2021", 30, "J7VZ1");
allotTaskBalance("Emmanuelomoruyi14", 10, "ZCEBU");
allotTaskBalance("justicejonathan07", 10, "ICXDN");
allotTaskBalance("itzrealussey", 10, "SR4RG");
allotTaskBalance("omojesu087", 30, "5USNY");
allotTaskBalance("akowelucky52", 50, "RH6BE");
allotTaskBalance("mc8188016", 70, "JP579");
allotTaskBalance("matthewtempo161", 1, "DQ00E");
allotTaskBalance("ea7332759", 20, "YCUW4");
allotTaskBalance("paulchisom34", 30, "7OZ8D");
allotTaskBalance("Magunte4", 95, "LFOE8");
allotTaskBalance("nnaemekapraise5", 35, "NMTP9");
allotTaskBalance("etukubonganthony", 50, "ZUYMS");
allotTaskBalance("chiemeriedavid54", 30, "3JIFP");
allotTaskBalance("rukeachu", 10, "XWFZ3");
allotTaskBalance("Goodluckn673", 40, "ETK48");