const apiUrls = [
  "https://sheetdb.io/api/v1/nl6j5kit103gh",
  "https://sheetdb.io/api/v1/npvktjn37lk2v",
  "https://sheetdb.io/api/v1/ceh2avnf98hi1"
];

const referralCode = localStorage.getItem("referralCode");
const refereeCode = localStorage.getItem("refereeCode");
const referralDisplay = document.getElementById("referralCode");
const notification = document.getElementById("notification");

console.log("Referral Page Loaded");

// Display referral code from localStorage
if (referralCode) {
  console.log("Referral code found:", referralCode);
  referralDisplay.textContent = referralCode;
  showNotification("You're a Valid User");
  showToast("Welcome back, valid user!");

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

// Allow all requests on 20 June 2025 and reset timer
function shouldMakeApiRequest() {
  const today = new Date();
  const isJune20 = today.getFullYear() === 2025 && today.getMonth() === 5 && today.getDate() === 20;

  if (isJune20) {
    console.log("Bypassing 24hr check: Today is 20 June 2025");
    localStorage.removeItem("lastApiRequest");
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

// Update referGroup when refereeCode is used
async function updateReferrals(refereeCode) {
  if (!localStorage.getItem("activateStatus")) {
    showToast("Account not activated. Please activate to update referrals.");
    console.warn("activateStatus not found. Blocking referral update.");
    return;
  }

  if (!referralCode) {
    console.warn("No referralCode found. Cannot update referGroup.");
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

        // Handle referGroup array
        let referGroup = [];
        try {
          if (user.referGroup) {
            referGroup = JSON.parse(user.referGroup);
            if (!Array.isArray(referGroup)) referGroup = [];
          }
        } catch {
          referGroup = [];
        }

        if (!referGroup.includes(referralCode)) {
          referGroup.push(referralCode);
        }

        // Update referGroup only
        await fetch(`${url}/referralCode/${refereeCode}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: {
              referGroup: JSON.stringify(referGroup)
            }
          })
        });

        localStorage.setItem(`referGroup_${refereeCode}`, JSON.stringify(referGroup));
        showToast("ReferGroup updated!");
        console.log("Updated referGroup stored locally:", referGroup);

        localStorage.removeItem("refereeCode");
        console.log("Referee code removed from localStorage.");

        break;
      } else {
        console.log("No matching user found in this API.");
      }
    } catch (err) {
      console.error("API error while updating referral data:", err);
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



