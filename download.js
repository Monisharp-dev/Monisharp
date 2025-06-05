// download.js

const coreKeys = [
  "Id", "ProfileData", "lastName", "withdrawalHistory", "firstName", "age",
  "profileImage", "category", "gender", "email", "quickBrainNewSeen",
  "lastApiRequest", "bank", "hasSubmitted", "apiData", "referrals",
  "password", "localData", "mainBalance", "referralBalance", "accountName",
  "activateStatus", "withdrawRequest", "lastReferralCount", "firstTime",
  "lastUploadTime", "lastSeedDeposit", "lastClaimDate", "accountNumber",
  "dailyRewardSeen", "phoneNumber"
];

const API_LIST = [
  "https://sheetdb.io/api/v1/3fhj4vu7fak0u",
  "https://sheetdb.io/api/v1/xsn258gcncwv8",
];

function isTodayJune2nd2025() {
  const today = new Date();
  return today.getFullYear() === 2025 && today.getMonth() === 5 && today.getDate() === 2;
}

function isSameDay(timestamp) {
  if (!timestamp) return false;
  const d1 = new Date(Number(timestamp));
  const d2 = new Date();
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

// Inject CSS for custom alerts and overlays dynamically
function injectStyles() {
  if (document.getElementById("custom-styles")) return;

  const style = document.createElement("style");
  style.id = "custom-styles";
  style.textContent = `
    .custom-alert {
      position: fixed;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      color: #333;
      padding: 20px 30px;
      border-radius: 12px;
      box-shadow: 0 0 15px rgba(0,0,0,0.2);
      z-index: 9999;
      text-align: center;
      font-family: Arial, sans-serif;
      font-size: 16px;
      font-weight: bold;
    }
  `;
  document.head.appendChild(style);
}

function showCustomAlert(message, callback) {
  const existingAlert = document.querySelector(".custom-alert");
  if (existingAlert) existingAlert.remove();

  const alertBox = document.createElement("div");
  alertBox.className = "custom-alert";
  alertBox.textContent = message;

  document.body.appendChild(alertBox);

  setTimeout(() => {
    alertBox.remove();
    if (typeof callback === "function") callback();
  }, 4000);
}

function restoreOtherData(otherDataStr) {
  if (!otherDataStr) return;
  try {
    const trimmed = otherDataStr.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      const inner = trimmed.slice(1, -1);
      if (inner.length === 0) return;

      const pairs = inner.split("),(").map(s => s.replace(/^?|?$/g, ""));
      pairs.forEach(pair => {
        const [key, ...rest] = pair.split(":");
        const value = rest.join(":");
        if (key && value !== undefined) {
          localStorage.setItem(key, value);
          console.log(`🔄 Restored otherData: ${key} = ${value}`);
        }
      });
    }
  } catch (e) {
    console.warn("⚠️ Failed to parse otherData:", e);
  }
}

function storeAllDataToLocalStorage(row) {
  coreKeys.forEach(key => {
    if (row[key] !== undefined) {
      localStorage.setItem(key, row[key]);
      console.log(`✅ Stored core key: ${key} = ${row[key]}`);
    }
  });
  if (row.otherData) {
    restoreOtherData(row.otherData);
  }
}

function processFoundData(row) {
  console.log("✅ Matching record found:", row);

  storeAllDataToLocalStorage(row);

  const now = Date.now();
  localStorage.setItem("lastVerificationTime", now.toString());
  localStorage.setItem("verified", new Date().toISOString());

  // Remove firstTime so next time upload.js runs
  localStorage.removeItem("firstTime");

  showCustomAlert("✅ Verification successful! Redirecting...", () => {
    window.location.href = "index.html";
  });
}

function downloadData() {
  console.log("🔍 Starting download (get) logic...");

  const lastVerification = localStorage.getItem("lastVerificationTime");
  if (!isTodayJune2nd2025() && isSameDay(lastVerification)) {
    console.log("⛔ Verification blocked: only one verification allowed per day.");
    return;
  }

  injectStyles();

  // Get email from localStorage ONLY
  const email = localStorage.getItem("email");
  if (!email) {
    showCustomAlert("⚠️ No email found in local storage. Cannot verify.");
    return;
  }
  const trimmedEmail = email.trim().toLowerCase();

  let found = false;
  let apiIndex = 0;

  function tryNextAPIForDownload() {
    if (apiIndex >= API_LIST.length) {
      if (!found) {
        showCustomAlert("No matching account found for your email.");
        console.log("❌ No matching account found on all APIs.");
      }
      return;
    }

    const currentAPI = API_LIST[apiIndex];
    const searchByEmail = `${currentAPI}/search?email=${encodeURIComponent(trimmedEmail)}`;

    fetch(searchByEmail)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          found = true;
          processFoundData(data[0]);
        } else {
          apiIndex++;
          tryNextAPIForDownload();
        }
      })
      .catch(error => {
        console.error("Fetch error:", error);
        apiIndex++;
        tryNextAPIForDownload();
      });
  }

  tryNextAPIForDownload();
}

// Run only if firstTime exists in localStorage
if (localStorage.getItem("firstTime")) {
  downloadData();
} else {
  console.log("No 'firstTime' key in localStorage. Download.js will not run.");
}