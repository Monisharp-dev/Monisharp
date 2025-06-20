// upload.js

const API_LISTTWO = [
  "https://sheetdb.io/api/v1/3fhj4vu7fak0u",
  "https://sheetdb.io/api/v1/xsn258gcncwv8",         
  "https://sheetdb.io/api/v1/a60myauvx0ay1",
  "https://sheetdb.io/api/v1/n5g98bqmjh72j"
];

const coreKeysTwo = [
  "Id", "ProfileData", "lastName", "withdrawalHistory", "firstName", "age",
  "profileImage", "category", "gender", "email", "quickBrainNewSeen",
  "lastApiRequest", "bank", "hasSubmitted", "apiData", "referrals",
  "password", "localData", "mainBalance", "referralBalance", "accountName",
  "activateStatus", "withdrawRequest", "lastReferralCount", "firstTime",
  "lastUploadTime", "lastSeedDeposit", "lastClaimDate", "accountNumber",
  "dailyRewardSeen", "phoneNumber"
];

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
    .custom-alert.success {
      background-color: #4CAF50;
      color: white;
    }
    .custom-alert.error {
      background-color: #f44336;
      color: white;
    }
  `;
  document.head.appendChild(style);
}

function showCustomAlert(message, type = "success", callback) {
  const existingAlert = document.querySelector(".custom-alert");
  if (existingAlert) existingAlert.remove();

  const alertBox = document.createElement("div");
  alertBox.className = "custom-alert " + (type === "success" ? "success" : "error");
  alertBox.textContent = message;

  document.body.appendChild(alertBox);

  setTimeout(() => {
    alertBox.remove();
    if (typeof callback === "function") callback();
  }, 4000);
}

function gatherDataForUpload() {
  let dataObj = {};
  coreKeysTwo.forEach(key => {
    const val = localStorage.getItem(key);
    if (val !== null) {
      dataObj[key] = val;
      console.log(`📥 Upload data key: ${key} = ${val}`);
    }
  });
  return dataObj;
}

async function tryUploadToAPI(apiUrl, data) {
  try {
    const payload = { data: [data] };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    console.log(`✅ Upload success to API: ${apiUrl}`, json);
    return true;
  } catch (error) {
    console.warn(`⚠️ Upload failed for API: ${apiUrl}`, error);
    return false;
  }
}

async function uploadData() {
  console.log("⬆️ Starting upload logic...");

  const dataToUpload = gatherDataForUpload();

  for (const apiUrl of API_LISTTWO) {
    const success = await tryUploadToAPI(apiUrl, dataToUpload);
    if (success) {
      showCustomAlert("✅ Upload successful! Redirecting...", "success", () => {
        window.location.href = "index.html";
      });
      return;
    }
  }

  // If all fail
  showCustomAlert("❌ Upload failed. Please check your connection and try again.", "error", () => {
    window.location.href = "index.html";
  });
}

// Run upload only if firstTime key NOT present
if (!localStorage.getItem("firstTime")) {
  injectStyles();
  window.addEventListener("load", () => {
    setTimeout(() => {
      uploadData();
    }, 20000); // 20 seconds delay after page load
  });
} else {
  console.log("firstTime key exists, skipping upload.js.");
}