// === CONFIGURATION ===
const primaryAPI = "https://sheetdb.io/api/v1/qyn13nrtm1um7";
const fallbackAPIs = [
  "https://sheetdb.io/api/v1/your-backup-api-1",
  "https://sheetdb.io/api/v1/your-backup-api-2"
];
const LOCAL_KEY = "tap_leaderboard_data";
const REFRESH_KEY = "tap_refresh_count";
const FETCH_DATE_KEY = "tap_last_fetch_date";
const MAX_REFRESHES = 2;
const REWARDS = ["₦2500", "₦2000", "₦1500", "₦1000", "₦500", "₦300", "₦150", "₦100"];

const leaderboardBody = document.getElementById("leaderboard-body");
const refreshBtn = document.getElementById("refreshBtn");

// === UTILITY FUNCTIONS ===

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function canRefreshToday() {
  const stored = JSON.parse(localStorage.getItem(REFRESH_KEY)) || {};
  return (stored[getToday()] || 0) < MAX_REFRESHES;
}

function incrementRefreshCount() {
  const stored = JSON.parse(localStorage.getItem(REFRESH_KEY)) || {};
  const today = getToday();
  stored[today] = (stored[today] || 0) + 1;
  localStorage.setItem(REFRESH_KEY, JSON.stringify(stored));
}

// === ALERT FUNCTION ===

function showAlert(message, type = "info") {
  const existing = document.querySelector(".custom-alert");
  if (existing) existing.remove();

  const div = document.createElement("div");
  div.className = `custom-alert ${type}`;
  div.innerHTML = `
    <span class="alert-icon">${
      type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️"
    }</span>
    <span>${message}</span>
  `;

  Object.assign(div.style, {
    position: "fixed",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor:
      type === "success"
        ? "#00b894"
        : type === "error"
        ? "#d63031"
        : "#0984e3",
    color: "white",
    padding: "12px 24px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    fontSize: "1rem",
    zIndex: "10000",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  });

  document.body.appendChild(div);
  setTimeout(() => div.remove(), 6000);
}

// === API FETCHING ===

async function fetchWithFallback(apis) {
  for (let url of [primaryAPI, ...apis]) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        console.log(`✅ Data fetched from: ${url}`);
        return data;
      }
    } catch (err) {
      console.warn(`⚠️ Failed: ${url}`);
    }
  }
  throw new Error("All APIs failed.");
}

// === LOCAL STORAGE ===

function saveToLocal(data) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
  localStorage.setItem(FETCH_DATE_KEY, getToday());
  console.log("💾 Data saved locally.");
}

function loadFromLocal() {
  const data = JSON.parse(localStorage.getItem(LOCAL_KEY)) || [];
  console.log("📂 Data loaded from localStorage.");
  return data;
}

function fetchedToday() {
  return localStorage.getItem(FETCH_DATE_KEY) === getToday();
}

// === DATA CLEANING ===

function extractnameAndscoreOnly(data) {
  const clean = data
    .map(d => ({
      name: d.name?.trim() || "Unnamed",
      score: d.score && !isNaN(Number(d.score)) ? Number(d.score) : null,
    }))
    .filter(d => d.score !== null);
  console.log("🔍 Extracted clean entries:", clean);
  return clean;
}

// === SORT AND SELECT ===

function getTopscorers(data) {
  const cleanData = extractnameAndscoreOnly(data);
  return cleanData
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}

// === UI UPDATE ===

function updateLeaderboardUI(data) {
  leaderboardBody.innerHTML = "";
  data.forEach((row, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.name}</td>
      <td>${row.score}</td>
      <td>${REWARDS[index] || "₦0"}</td>
    `;
    leaderboardBody.appendChild(tr);
  });
  console.log("📊 Leaderboard updated in UI.");
}

// === INITIAL LOAD ===

async function initialLoad() {
  const local = loadFromLocal();
  if (local.length > 0) {
    updateLeaderboardUI(getTopscorers(local));
  }

  if (!fetchedToday()) {
    try {
      const fresh = await fetchWithFallback(fallbackAPIs);
      saveToLocal(fresh);
      updateLeaderboardUI(getTopscorers(fresh));
      showAlert("🔄 Auto-updated with fresh data today.", "success");
    } catch (err) {
      showAlert("❌ Failed to fetch new data.", "error");
    }
  } else {
    console.log("✅ Data already fetched today. Using cached data.");
  }
}

// === REFRESH BUTTON ===

refreshBtn.addEventListener("click", async () => {
  if (!canRefreshToday()) {
    showAlert("❌ You can only refresh results twice a day.", "error");
    return;
  }

  try {
    refreshBtn.disabled = true;
    refreshBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Refreshing...`;

    const fresh = await fetchWithFallback(fallbackAPIs);
    saveToLocal(fresh);
    updateLeaderboardUI(getTopscorers(fresh));
    incrementRefreshCount();

    showAlert("✅ Results updated successfully!", "success");
  } catch (err) {
    showAlert("❌ Failed to refresh. Try again later.", "error");
  } finally {
    refreshBtn.disabled = false;
    refreshBtn.innerHTML = `<i class="fas fa-sync-alt"></i> Refresh Results`;
    checkButtonState();
  }
});

// === BUTTON STATE ===

function checkButtonState() {
  if (!canRefreshToday()) {
    refreshBtn.disabled = true;
    refreshBtn.setAttribute("data-tooltip", "You’ve used your 2 refreshes for today.");
    console.log("🚫 Refresh limit reached for today.");
  }
}

// === ON LOAD ===

window.addEventListener("DOMContentLoaded", async () => {
  checkButtonState();
  await initialLoad();
});











<!-- https://sheetdb.io/api/v1/qyn13nrtm1um7 -->