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

// Helpers to check dates
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


// Your custom alert logic goes here
function showCustomAlert(message, callback) {
  const existingAlert = document.querySelector(".custom-alert");
  if (existingAlert) existingAlert.remove(); // Remove any existing alert

  const alertBox = document.createElement("div");
  alertBox.className = "custom-alert";
  alertBox.style.position = "fixed";
  alertBox.style.top = "50%";
  alertBox.style.left = "50%";
  alertBox.style.transform = "translate(-50%, -50%)";
  alertBox.style.backgroundColor = "#fff";
  alertBox.style.color = "#333";
  alertBox.style.padding = "20px 30px";
  alertBox.style.borderRadius = "12px";
  alertBox.style.boxShadow = "0 0 15px rgba(0,0,0,0.2)";
  alertBox.style.zIndex = "9999";
  alertBox.style.textAlign = "center";
  alertBox.innerHTML = `
    <p style="font-size: 16px; font-weight: bold; margin: 0;">${message}</p>
  `;

  document.body.appendChild(alertBox);

  setTimeout(() => {
    alertBox.remove();
    if (typeof callback === "function") callback();
  }, 4000); // stays for 4 seconds
}

// Parse otherData string back into key-value pairs and store in localStorage
function restoreOtherData(otherDataStr) {
  if (!otherDataStr) return;
  try {
    // Expecting format: "[(key1:value1),(key2:value2),...]"
    // Remove wrapping [ ] and split by '),(' after trimming brackets
    const trimmed = otherDataStr.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      const inner = trimmed.slice(1, -1);
      if (inner.length === 0) return;

      const pairs = inner.split("),(").map(s => s.replace(/^?|?$/g, "")); // clean parentheses

      pairs.forEach(pair => {
        const [key, ...rest] = pair.split(":");
        const value = rest.join(":"); // in case value has colon
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

// Store core keys and restore otherData from matched API row into localStorage
function storeAllDataToLocalStorage(row) {
  coreKeys.forEach(key => {
    if (row[key] !== undefined) {
      localStorage.setItem(key, row[key]);
      console.log(`✅ Stored core key: ${key} = ${row[key]}`);
    }
  });
  // Restore otherData
  if (row.otherData) {
    restoreOtherData(row.otherData);
  }
}

// Upload function (with limits)
function uploadData() {
  console.log("⏳ Waiting 20 seconds before starting upload...");

  setTimeout(() => {
    const lastUpload = localStorage.getItem("lastUploadTime");
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    const unlimitedToday = isTodayJune2nd2025();

    // On June 2rd unlimited, else one upload per week
    if (!unlimitedToday && lastUpload && (Date.now() - Number(lastUpload)) < oneWeek) {
      console.log("⛔ Upload blocked: only one request allowed per week (except June 2, 2025).");
      return;
    }

    const rowData = {};
    const otherDataPairs = [];

    console.log("📦 Gathering data from localStorage for upload...");

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);

      if (coreKeys.includes(key)) {
        rowData[key] = value || "";
        console.log(`✅ Core Data: ${key} = ${value}`);
      } else {
        otherDataPairs.push(`(${key}:${value})`);
        console.log(`📂 Added to otherData: (${key}:${value})`);
      }
    }

    rowData.otherData = otherDataPairs.length ? `[${otherDataPairs.join(",")}]` : "";
    console.log("📨 Final rowData prepared:", rowData);

    let success = false;
    let index = 0;

    function tryNextApi() {
      if (index >= API_LIST.length) {
        console.error("❌ All APIs failed. Upload not completed.");
        return;
      }

      const currentAPI = API_LIST[index];
      const checkURL = `${currentAPI}/search?Id=${rowData.Id}`;
      const deleteURL = `${currentAPI}/Id/${rowData.Id}`;

      console.log(`🔍 Checking if Id "${rowData.Id}" exists at API ${currentAPI}...`);

      fetch(checkURL)
        .then(res => res.json())
        .then(existing => {
          if (existing.length > 0) {
            console.log(`♻️ Existing record found. Deleting old record at: ${deleteURL}`);
            return fetch(deleteURL, { method: "DELETE" });
          } else {
            console.log("🆕 No existing record found. Posting new data...");
            return Promise.resolve();
          }
        })
        .then(() => {
          return fetch(currentAPI, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ data: [rowData] })
          });
        })
        .then(res => res.json())
        .then(response => {
          console.log("✅ Upload successful to API:", currentAPI, response);
          localStorage.setItem("lastUploadTime", Date.now().toString());
          // Mark verified with timestamp after upload success
          localStorage.setItem("verified", new Date().toISOString());

          success = true;
          // Notify success and redirect
         showCustomAlert("✅ Verification successful! Redirecting...", () => {
  window.location.href = "index.html";
});
        })
        .catch(err => {
          console.warn("⚠️ API failed:", currentAPI, err);
          index++;
          if (!success) tryNextApi();
        });
    }

    tryNextApi();
  }, 20000); // 20 seconds delay
}

// Download (Get) logic to retrieve data by email or phone
function downloadData() {
  console.log("🔍 Starting download (get) logic...");

  // Limit verification to once per day except June 3rd
  const lastVerification = localStorage.getItem("lastVerificationTime");
  if (!isTodayJune2nd2025() && isSameDay(lastVerification)) {
    console.log("⛔ Verification blocked: only one verification allowed per day.");
    return;
  }

  // Ask user to enter Email or Phone Number
  const identifier = prompt("Please enter your Email or Phone Number for verification:");

  if (!identifier || identifier.trim() === "") {
    alert("Error: You must enter a valid Email or Phone Number.");
    return;
  }

  const trimmedIdentifier = identifier.trim().toLowerCase();

  let found = false;
  let apiIndex = 0;

  function tryNextAPIForDownload() {
    if (apiIndex >= API_LIST.length) {
      if (!found) {
        alert("No matching account found for the provided Email or Phone Number.");
        console.log("❌ No matching account found on all APIs.");
      }
      return;
    }

    const currentAPI = API_LIST[apiIndex];

    // Search by email or phone number (case insensitive)
    const searchByEmail = `${currentAPI}/search?email=${encodeURIComponent(trimmedIdentifier)}`;
    const searchByPhone = `${currentAPI}/search?phoneNumber=${encodeURIComponent(trimmedIdentifier)}`;

    // Try email search first
    fetch(searchByEmail)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          found = true;
          processFoundData(data[0]);
        } else {
          // Try phone number search
          return fetch(searchByPhone)
            .then(res => res.json())
            .then(data2 => {
              if (data2.length > 0) {
                found = true;
                processFoundData(data2[0]);
              } else {
                apiIndex++;
                tryNextAPIForDownload();
              }
            });
        }
      })
      .catch(err => {
        console.warn("⚠️ API error during download search:", currentAPI, err);
        apiIndex++;
        tryNextAPIForDownload();
      });
  }

  function processFoundData(row) {
    console.log("✅ Matching record found:", row);

    // Store all core keys + otherData locally
    storeAllDataToLocalStorage(row);

   // Set verification timestamps
    const now = Date.now();
    localStorage.setItem("lastVerificationTime", now.toString());
    localStorage.setItem("verified", new Date().toISOString());

    showCustomAlert("✅ Verification successful! Redirecting...", () => {
  window.location.href = "index.html";
});
  }

  // Start trying APIs
  tryNextAPIForDownload();
}

// Main execution
(function main() {
  const Id = localStorage.getItem("Id");

  if (Id) {
    console.log(`Id found in localStorage: ${Id}. Proceeding to upload data.`);
    uploadData();
  } else {
    console.log("No Id found in localStorage. Proceeding to download (verification).");
    downloadData();
  }
})();