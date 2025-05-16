const apiUrls = [
  "https://sheetdb.io/api/v1/ceh2avnf98hi1"
];

const referralCode = localStorage.getItem("referralCode");
const refereeCode = localStorage.getItem("refereeCode");
const referralDisplay = document.getElementById("referralCode");
const referralNumber = document.getElementById("referralNumber");
const notification = document.getElementById("notification");

console.log("Referral Page Loaded");

// Display referral number from localStorage directly
referralNumber.textContent = localStorage.getItem("referrals") || "0";

// Check if referral code exists
if (referralCode) {
  console.log("Referral code found:", referralCode);
  referralDisplay.textContent = referralCode;
  showNotification("You're a Valid User");
  showToast("Welcome back, valid user!");

  // Sync referrals from API and store locally
  syncReferralsFromAPI();

  // Check if a request should be made
  if (shouldMakeApiRequest()) {
    if (refereeCode) {
      console.log("Referee code found:", refereeCode);
      updateReferrals(refereeCode);
    } else {
      console.log("No referee code found. Skipping referral update.");
    }
  } else {
    console.log("API request already made within the past 24 hours.");
  }
} else {
  console.warn("No referral code found in local storage.");
  referralDisplay.textContent = "No code found";
  referralNumber.textContent = "0";
  showToast("No referral code detected.");
}

// Copy button logic
document.getElementById("copyBtn").onclick = () => {
  if (referralCode) {
    navigator.clipboard.writeText(referralCode).then(() => {
      console.log("Referral code copied to clipboard.");
      showToast("Referral code copied!");
    });
  } else {
    showToast("Nothing to copy.");
  }
};

// Modified: Allow all requests on 12 May 2025 and reset timer
function shouldMakeApiRequest() {
  const today = new Date();
  const isMay12 = today.getFullYear() === 2025 && today.getMonth() === 4 && today.getDate() === 12; // May is month 4

  if (isMay12) {
    console.log("Bypassing 24hr check: Today is 12 May 2025");
    localStorage.removeItem("lastApiRequest"); // Reset timer to allow early request on May 13
    return true;
  }

  const lastRequestTime = localStorage.getItem("lastApiRequest");
  const currentTime = Date.now();

  if (!lastRequestTime) {
    localStorage.setItem("lastApiRequest", currentTime);
    return true;
  }

  const timeDiff = currentTime - lastRequestTime;
  const oneDay = 24 * 60 * 60 * 1000;

  if (timeDiff >= oneDay) {
    localStorage.setItem("lastApiRequest", currentTime);
    return true;
  }

  return false;
}

// Referral update function
async function updateReferrals(refereeCode) {
  if (!localStorage.getItem("activateStatus")) {
    showToast("Account not activated. Please activate to update referrals.");
    console.warn("activateStatus not found. Blocking referral update.");
    return;
  }

  for (let url of apiUrls) {
    console.log("Checking API:", url);
    try {
      const response = await fetch(`${url}/search?referralCode=${refereeCode}`);
      const data = await response.json();

      if (data.length > 0) {
        console.log("User found in database.");
        const user = data[0];
        const previousReferrals = parseInt(user.referrals || "0");
        const newCount = (previousReferrals + 1).toString();
        console.log("Previous referral count:", user.referrals);
        console.log("Updating referral count to:", newCount);

        await fetch(`${url}/referralCode/${refereeCode}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: { referrals: newCount } })
        });

        referralNumber.textContent = newCount;
        localStorage.setItem("referrals", newCount);
        showToast("Referral count updated!");

        localStorage.removeItem("refereeCode");
        console.log("Referee code removed from localStorage.");

        break;
      } else {
        console.log("No matching user found in this API.");
      }
    } catch (err) {
      console.error("API error:", url, err);
    }
  }
}

// Sync current user's referrals
async function syncReferralsFromAPI() {
  if (!localStorage.getItem("activateStatus")) {
    showToast("Account not activated. Please activate to sync data.");
    console.warn("activateStatus not found. Blocking sync.");
    return;
  }

  const userId = localStorage.getItem("Id");
  if (!userId) {
    console.warn("UserID not found in localStorage.");
    return;
  }

  for (let url of apiUrls) {
    try {
      const response = await fetch(url);
      const data = await response.json();

      const user = data.find(u => u.Id === userId);
      if (user) {
        const referrals = parseInt(user.referrals || "0");
        localStorage.setItem("referrals", referrals);
        referralNumber.textContent = referrals;
        console.log("Referrals synced and stored:", referrals);
      } else {
        console.warn("No user found with this ID.");
      }

      break;
    } catch (err) {
      console.error("Failed to sync referral data:", err);
    }
  }
}

// Toast alert
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Notification banner
function showNotification(message) {
  notification.textContent = message;
  notification.classList.remove("hidden");
  notification.style.display = "block";
}