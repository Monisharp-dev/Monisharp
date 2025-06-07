const balanceKey = "mainBalance";
const boosterKey = "purchasedBoosters"; // stores boosters purchased (gold, premium, local)
const extraTimeKey = "extraTimeBoosters"; // stores count of extra 4hr boosters

function getBalance() {
  return parseInt(localStorage.getItem(balanceKey)) || 0;
}

function setBalance(value) {
  localStorage.setItem(balanceKey, value);
  document.getElementById("mainBalance").textContent = value;
}

function notifyUser(message, success = true) {
  const box = document.getElementById("notificationBox");
  const icon = document.getElementById("notifIcon");
  const text = document.getElementById("notifMessage");

  text.textContent = message;

  box.className = `notification-box show ${success ? "success" : "error"}`;
  icon.className = `bi ${success ? "bi-check-circle-fill" : "bi-x-circle-fill"}`;

  // Auto-hide after 4 seconds
  setTimeout(() => {
    box.classList.remove("show");
  }, 4000);
}

function purchase(boosterType, price) {
  let balance = getBalance();

  if (balance < price) {
    notifyUser("Insufficient balance. Please fund your account.", false);
    return;
  }

  const oneTimeBoosters = ["gold", "premium", "local"];

  if (oneTimeBoosters.includes(boosterType)) {
    let purchased = JSON.parse(localStorage.getItem(boosterKey)) || {};

    if (purchased[boosterType]) {
      notifyUser(`You've already purchased the ${boosterType} booster today.`, false);
      return;
    }

    // Deduct and store booster
    balance -= price;
    setBalance(balance);

    purchased[boosterType] = {
      time: new Date().toISOString(),
      expiresAt: getEndOfDayISO()
    };

    localStorage.setItem(boosterKey, JSON.stringify(purchased));
    notifyUser(`${boosterType.charAt(0).toUpperCase() + boosterType.slice(1)} Booster purchased successfully!`);

  } else if (boosterType === "extra4hrs") {
    // Multiple purchases allowed for extra 4-hour time
    balance -= price;
    setBalance(balance);

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

// Initialize balance on load
window.onload = () => {
  setBalance(getBalance());
};