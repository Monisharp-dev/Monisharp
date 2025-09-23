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
allotTaskBalance("mohammedmanyisa9680plus", 50, "AUG87");
allotTaskBalance("shikemiopeyemi0plus", 50, "EOZBS");
allotTaskBalance("folarinagbesoyin19plus", 50, "EOZBS");
allotTaskBalance("paulmaureen408plus", 20, "EOZBS");
allotTaskBalance("olasunkanmiomotayo2", 18, "FZMLC");
allotTaskBalance("baloguntaiwo0001", 21, "SEPTE");
allotTaskBalance("etokwudogplus", 10, "SFTTS");
allotTaskBalance("inaplus", 20, "FZSSC");
allotTaskBalance("alexanderifenabohplus", 100, "FSTTV");
allotTaskBalance("freshnessjunior1plus", 40, "SFTTS");
allotTaskBalance("shikemiopeyemi0plus", 60, "SFTTS");
allotTaskBalance("	amopeadeganiyatplus", 70, "SFTTS");
allotTaskBalance("danemmanuel692plus", 40, "SFTTS");
allotTaskBalance("richesosimejom", 50, "KEY01");
allotTaskBalance("anigedavid9plus", 50, "KEY02");
allotTaskBalance("toyosiakinboluresamuel", 50, "KEY03");
allotTaskBalance("okaforrichard21", 50, "KEY04");
allotTaskBalance("alaopaul211", 50, "KEY05");
    
}
