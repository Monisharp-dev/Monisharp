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