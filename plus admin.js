function allotTaskBalance(userId, amount, uniqueKey) {
  const loggedInPlusId = localStorage.getItem("plus-Id")?.trim();

  // ✅ Only credit if this is the logged-in premium user
  if (loggedInPlusId !== userId) {
    console.warn(`⛔ Skipped: Logged-in user (${loggedInPlusId}) does not match target user (${userId}).`);
    return;
  }

  // ✅ Basic validation
  if (!userId || typeof amount !== "number" || !uniqueKey || uniqueKey.length !== 5) {
    console.error("❌ Invalid userId, amount, or key format.");
    return;
  }

  const taskBalanceKey = `taskBalance_${userId}`;
  const usedKeysKey = `usedTaskKeys_${userId}`;
  const usedKeys = JSON.parse(localStorage.getItem(usedKeysKey)) || [];

  if (usedKeys.includes(uniqueKey)) {
    console.log(`⚠️ Key "${uniqueKey}" already used for user ${userId}.`);
    return;
  }

  let currentBalance = parseFloat(localStorage.getItem(taskBalanceKey)) || 0;
  currentBalance += amount;

  localStorage.setItem(taskBalanceKey, currentBalance.toFixed(2));
  usedKeys.push(uniqueKey);
  localStorage.setItem(usedKeysKey, JSON.stringify(usedKeys));

  console.log(`✅ Task balance of ₦${amount} credited to ${userId} (Key: ${uniqueKey}).`);
}
// These all run, but only the one matching localStorage.getItem("plus-Id") will get credited
allotTaskBalance("realearners01plus", 50, "O7JMD");
allotTaskBalance("mubaraqmichaelplus", 100, "ERZBM");
allotTaskBalance("theyplus", 600, "FZMLC");
allotTaskBalance("tayefacebook2521plus", 350, "FD56T");
allotTaskBalance("petersonroland57plus", 350, "DMXLC");
allotTaskBalance("petersonroland57plus", 500, "GUTXG");
allotTaskBalance("tayefacebook2521plus", 500, "GM66T");
allotTaskBalance("pinodetommaso184plus", 500, "GMTID");
allotTaskBalance("yope7028plus", 500, "DT665");
allotTaskBalance("yope7028plus", 2000, "DBY45");
 allotTaskBalance("mohammedmanyisa9680plus", 250, "FMT70");
allotTaskBalance("tayefacebook2521plus", 500, "FWM56");
allotTaskBalance("shikemiopeyemi0plus", 100, "GNM56");
allotTaskBalance("tayefacebook2521plus", 150, "HTM76");
allotTaskBalance("tayefacebook2521plus", 150, "FHA89");
allotTaskBalance("mubaraqmichaelplus", 100, "DVH90");
allotTaskBalance("yope7028plus", 50, "IJVED");
allotTaskBalance("anigedavid9plus", 50, "DVE56");
allotTaskBalance("pinodetommaso184plus", 250, "FUX76");
allotTaskBalance("etokwudogplus", 250, "PTX90");
allotTaskBalance("divineblandy009plus", 100, "HTX45");
allotTaskBalance("etokwudogplus", 100, "TXL76");
allotTaskBalance("tayefacebook2521plus", 100, "PGM89");
allotTaskBalance("freshnessjunior1plus", 550, "FNL06");
allotTaskBalance("anigedavid9plus", 350, "DLN23");
allotTaskBalance("shikemiopeyemi0plus", 150, "BTX78");
allotTaskBalance("anigedavid9plus", 50, "DHT89");
allotTaskBalance("petersonroland57plus", 300, "FLN90");
allotTaskBalance("freshnessjunior1plus", 200, "XML63");
allotTaskBalance("mohammedmanyisa9680plus", 200, "HTL78");
allotTaskBalance("etokwudogplus", 100, "NTG67");
allotTaskBalance("anigedavid9plus", 100, "GTM76");
allotTaskBalance("omurogo9plus", 250, "MRT70");
allotTaskBalance("shikemiopeyemi0plus", 100, "BTH76");
allotTaskBalance("folarinagbesoyin19plus", 550, "XNT90");
allotTaskBalance("gfame682plus", 550, "GVT89");
allotTaskBalance("winnerchukwuemeka70plus", 150, "MTU56");
allotTaskBalance("iedidiong33plus", 500, "GFP99");
allotTaskBalance("chizzeechisomplus", 50, "GZT09");
allotTaskBalance("victoruduak2009plus", 550, "DHT70");
allotTaskBalance("shanegray017plus", 350, "MGH89");
allotTaskBalance("iedidiong33plus", 100, "DHM89");
allotTaskBalance("shikemiopeyemi0plus", 100, "PLT70");
allotTaskBalance("anigedavid9plus", 10, "MFN89");
allotTaskBalance("miracle222fegaplus", 50, "HTM97");
allotTaskBalance("alexanderifenabohplus", 50, "AHT90");
allotTaskBalance("greatnessedet8plus", 1400, "AGM90");
allotTaskBalance("shikemiopeyemi0plus", 70, "GTM60");




