// DEC.JS
document.addEventListener("DOMContentLoaded", function () {
  const API_LISTTWO = [
    "https://sheetdb.io/api/v1/3fhj4vu7fak0u",
    "https://sheetdb.io/api/v1/xsn258gcncwv8",
    "https://sheetdb.io/api/v1/a60myauvx0ay1",
    "https://sheetdb.io/api/v1/n5g98bqmjh72j"
  ];

  function showPopup(message, success = false, allowLink = false) {
    console.log("[Popup]", message);
    let popup = document.getElementById("retrieve-popup");
    if (!popup) {
      popup = document.createElement("div");
      popup.id = "retrieve-popup";
      popup.style.position = "fixed";
      popup.style.top = "20px";
      popup.style.left = "50%";
      popup.style.transform = "translateX(-50%)";
      popup.style.padding = "15px 20px";
      popup.style.borderRadius = "10px";
      popup.style.fontSize = "14px";
      popup.style.color = "#fff";
      popup.style.zIndex = "99999";
      popup.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
      document.body.appendChild(popup);
    }
    popup.style.background = success ? "#4caf50" : "#2196f3";

    if (allowLink) {
      popup.innerHTML = `${message}<br><a href="https://wa.me/2348146054930" target="_blank" style="color:yellow;text-decoration:underline;">Contact Admin on WhatsApp</a>`;
    } else {
      popup.innerText = message;
    }

    popup.style.display = "block";
    setTimeout(() => (popup.style.display = "none"), 6000);
  }

  const userId = localStorage.getItem("plus-Id");
  if (!userId) {
    console.error("[Error] No plus-Id in localStorage.");
    showPopup("❌ No User ID found.", false, true);
    return; // stop script
  }

  console.log("[Process] Found userId:", userId);

  async function fetchAllRecords() {
    let allData = [];
    for (const api of API_LISTTWO) {
      try {
        console.log("[SheetDB] Fetching from:", api);
        const res = await fetch(api);
        const data = await res.json();
        const arr = Array.isArray(data) ? data : [data];
        console.log(`[SheetDB] Retrieved ${arr.length} records from ${api}`);
        allData = allData.concat(arr);
      } catch (err) {
        console.error("[Error] Fetch failed:", api, err);
      }
    }
    localStorage.setItem("temp-sheetdb-data", JSON.stringify(allData));
    console.log("[Temp] Stored API data temporarily.");
    return allData;
  }

  function findRecord(allData, userId) {
    const record = allData.find(
      (row) => String(row.Id).trim() === String(userId).trim()
    ) || null;
    if (record) {
      console.log("[Match] Found record:", record);
    } else {
      console.warn("[Match] No record for userId:", userId);
    }
    return record;
  }

  function isValidBase64(str) {
    if (!str) return false;
    const sanitized = str.replace(/[^A-Za-z0-9+/=]/g, "");
    return sanitized.length % 4 === 0;
  }

  function restoreLocalStorage(base64Data) {
    try {
      console.log("[Decode] Raw base64 string length:", base64Data.length);

      if (!isValidBase64(base64Data)) {
        console.error("[Decode Error] qrCode field is NOT valid base64:", base64Data.slice(0, 50) + "...");
        showPopup("❌ Invalid Base64 data from API.", false);
        return;
      }

      const sanitized = base64Data.replace(/\s/g, ""); // remove whitespace
      const jsonString = atob(sanitized);
      console.log("[Decode] Decoded JSON string:", jsonString.slice(0, 100) + "...");

      const data = JSON.parse(jsonString);
      console.log("[Restore] Parsed object:", data);

      for (let key in data) {
        localStorage.setItem(key, data[key]);
        console.log(`[Restore] Restored ${key} = ${data[key]}`);
      }

      localStorage.removeItem("temp-sheetdb-data");
      console.log("[Cleanup] Removed temp data.");
      showPopup("✅ Data restored successfully!", true);
    } catch (err) {
      console.error("[Error] Failed to decode/restore:", err);
      showPopup("❌ Decode failed.", false);
    }
  }

  (async function runRestore() {
    try {
      showPopup("🔄 Restoring...");
      const allData = await fetchAllRecords();
      const record = findRecord(allData, userId);

      if (!record || !record.qrCode) {
        console.error("[Error] No qrCode field in record.");
        showPopup("❌ No saved data.", false);
        return;
      }

      restoreLocalStorage(record.qrCode);
    } catch (err) {
      console.error("[Error] Main process failed:", err);
      showPopup("❌ Process failed.", false);
    }
  })();
});