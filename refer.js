// === CONFIGURATION === //
const apiUrls = [
  "https://sheetdb.io/api/v1/nl6j5kit103gh",
  "https://sheetdb.io/api/v1/npvktjn37lk2v",
  "https://sheetdb.io/api/v1/ceh2avnf98hi1"
];

// === FETCH LOCALSTORAGE KEYS === //
const referralCode = localStorage.getItem("referralCode");
const activateStatus = localStorage.getItem("activateStatus");
const localReferGroup = JSON.parse(localStorage.getItem("referGroup") || "[]");

// === DOM ELEMENT REFERENCES (WITH GUARDS) === //
const referralDisplay = document.getElementById("referralCode");
const notification = document.getElementById("notification");
const copyBtn = document.getElementById("copyBtn");
const toast = document.getElementById("toast");

// === LOGS === //
console.log("Referral Page Loaded");
console.log("Referral Code:", referralCode);
console.log("Plus Referral Code:", localStorage.getItem("plus-referralCode"));

// === DISPLAY REFERRAL CODE IF AVAILABLE === //
if (referralCode && referralDisplay) {
  referralDisplay.textContent = referralCode;
  showNotification("You're a Valid User");
  showToast("Welcome back, valid user!");

  // Check if update needed
  if (shouldMakeApiRequest()) {
    updateReferGroupToSheetDB();
  }
} else if (referralDisplay) {
  referralDisplay.textContent = "No code found";
  showToast("No referral code detected.");
  console.warn("No referral code in local storage.");
}

// === COPY BUTTON HANDLER === //
if (copyBtn) {
  copyBtn.onclick = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode)
        .then(() => {
          console.log("Referral code copied.");
          showToast("Referral code copied!");
        });
    } else {
      showToast("Nothing to copy.");
    }
  };
}

// === API CALL TIMING CONTROL === //
function shouldMakeApiRequest() {
  const today = new Date();
  const isJune20 = today.getFullYear() === 2025 && today.getMonth() === 5 && today.getDate() === 20;

  if (isJune20) {
    console.log("Bypassing 24hr check (June 20).");
    localStorage.removeItem("lastApiRequest");
    return true;
  }

  const lastRequest = parseInt(localStorage.getItem("lastApiRequest"), 10);
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  if (!lastRequest || (now - lastRequest >= day)) {
    localStorage.setItem("lastApiRequest", now.toString());
    return true;
  }

  return false;
}

// === PUSH REFERGROUP IF NEW === //
async function updateReferGroupToSheetDB() {
  if (!referralCode || !activateStatus) {
    console.warn("Referral code or activation status missing.");
    return;
  }

  for (const url of apiUrls) {
    try {
      const response = await fetch(`${url}/search?referralCode=${referralCode}`);
      const data = await response.json();

      if (data.length === 0) {
        console.log("User not found on this API endpoint.");
        continue;
      }

      const user = data[0];
      let remoteGroup = [];

      try {
        if (user.referGroup) {
          remoteGroup = JSON.parse(user.referGroup);
          if (!Array.isArray(remoteGroup)) remoteGroup = [];
        }
      } catch {
        remoteGroup = [];
      }

      // Compare groups and update only if needed
      const newEntries = localReferGroup.filter(code => !remoteGroup.includes(code));
      if (newEntries.length === 0) {
        console.log("No new referral group entries to update.");
        return;
      }

      const updatedGroup = [...new Set([...remoteGroup, ...localReferGroup])];

      await fetch(`${url}/referralCode/${referralCode}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { referGroup: JSON.stringify(updatedGroup) } })
      });

      showToast("ReferGroup updated to server!");
      console.log("Updated group posted:", updatedGroup);
      break;

    } catch (err) {
      console.error("ReferGroup update failed:", err);
    }
  }
}

// === TOAST UI FEEDBACK === //
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

// === BANNER NOTIFICATION === //
function showNotification(message) {
  if (!notification) return;
  notification.textContent = message;
  notification.classList.remove("hidden");
  notification.style.display = "block";
}