const balanceKeyPrefix = "depositBalance_";  // prefix for deposit balance keys
const boosterKey = "purchasedBoosters"; // stores boosters purchased (gold, premium, local)
const extraTimeKey = "extraTimeBoosters"; // stores count of extra 4hr boosters

// Get current user Id from localStorage
function getCurrentUserId() {
  return localStorage.getItem("Id") || null;
}

// Get deposit balance for current user
function getDepositBalance() {
  const userId = getCurrentUserId();
  if (!userId) return 0; // no user Id found

  const key = balanceKeyPrefix + userId;
  return parseFloat(localStorage.getItem(key)) || 0;
}

// Set deposit balance for current user and update UI element if exists
function setDepositBalance(value) {
  const userId = getCurrentUserId();
  if (!userId) return;

  const key = balanceKeyPrefix + userId;
  localStorage.setItem(key, value.toFixed(2));

  // Optional: Update UI element if you have one with id 'depositBalanceDisplay'
  const depositBalanceDisplay = document.getElementById("depositBalanceDisplay");
  if (depositBalanceDisplay) {
    depositBalanceDisplay.textContent = value.toFixed(2);
  }
}

function notifyUser(message, success = true) {
  const box = document.getElementById("notificationBox");
  const icon = document.getElementById("notifIcon");
  const text = document.getElementById("notifMessage");

  text.textContent = message;

  box.className = `notification-box show ${success ? "success" : "error"}`;
  icon.className = `bi ${success ? "bi-check-circle-fill" : "bi-x-circle-fill"}`;

  setTimeout(() => {
    box.classList.remove("show");
  }, 4000);
}

function purchase(boosterType, price) {
  let balance = getDepositBalance();

  if (balance < price) {
    notifyUser("Insufficient deposit balance. Please fund your account.", false);
    return;
  }

  const oneTimeBoosters = ["gold", "premium", "local"];

  if (oneTimeBoosters.includes(boosterType)) {
    let purchased = JSON.parse(localStorage.getItem(boosterKey)) || {};

    if (purchased[boosterType]) {
      notifyUser(`You've already purchased the ${boosterType} booster today.`, false);
      return;
    }

    balance -= price;
    setDepositBalance(balance);

    purchased[boosterType] = {
      time: new Date().toISOString(),
      expiresAt: getEndOfDayISO()
    };

    localStorage.setItem(boosterKey, JSON.stringify(purchased));
    notifyUser(`${boosterType.charAt(0).toUpperCase() + boosterType.slice(1)} Booster purchased successfully!`);

  } else if (boosterType === "extra4hrs") {
    balance -= price;
    setDepositBalance(balance);

    let extra = parseInt(localStorage.getItem(extraTimeKey)) || 0;
    extra++;
    localStorage.setItem(extraTimeKey, extra);

    notifyUser("4-Hour Extra Time Booster purchased successfully! Total: " + extra);
  }
}

function getEndOfDayISO() {
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  return now.toISOString();
}

// Initialize deposit balance on load
window.onload = () => {
  const depositBalance = getDepositBalance();
  setDepositBalance(depositBalance);
};