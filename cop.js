document.addEventListener("DOMContentLoaded", () => {
  const notifyBox = document.getElementById("notifyBox");
  const userId = localStorage.getItem("Id");
  const apiURLs = [
    "https://sheetdb.io/api/v1/k51vpzir9tfo8",
    "https://sheetdb.io/api/v1/backup_api_1",
    "https://sheetdb.io/api/v1/backup_api_2"
  ];

  function showActivationNotice() {
    notifyBox.style.display = "flex";
    notifyBox.innerHTML = `
      <div class="notification-content">
        <p><strong>Activate your account with ₦200 by 
        <a href="activate.html" style="color: #fff; text-decoration: underline;">clicking here</a>.</strong></p>
      </div>
    `;
  }

  function hideActivationNotice() {
    notifyBox.style.display = "none";
  }

  function getCurrentTimeSlot() {
    const now = new Date();
    const hour = now.getHours();

    if (hour < 12) return "morning";
    if (hour >= 20) return "evening";
    return null;
  }

  function shouldFetchData() {
    if (localStorage.getItem("activateStatus") === "present") return false;

    const slot = getCurrentTimeSlot();
    if (!slot) return false;

    const today = new Date().toISOString().split("T")[0];
    const lastCheckKey = `lastCheck_${slot}`;
    const lastCheckDate = localStorage.getItem(lastCheckKey);

    if (lastCheckDate !== today) {
      localStorage.setItem(lastCheckKey, today);
      return true;
    }
    return false;
  }

  function fetchAllData(index = 0, attemptCount = 1) {
    if (attemptCount > 16) {
      console.error("Max API attempts reached.");
      return;
    }

    const url = apiURLs[index];
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`API ${index + 1} failed`);
        return res.json();
      })
      .then(data => {
        localStorage.setItem("copData", JSON.stringify(data));
        processUserActivation();
      })
      .catch(() => {
        fetchAllData(index + 1, attemptCount + 1);
      });
  }

  function processUserActivation() {
    if (!userId) {
      showActivationNotice();
      return;
    }

    const rawData = localStorage.getItem("copData");
    if (!rawData) {
      showActivationNotice();
      return;
    }

    const users = JSON.parse(rawData);
    const user = users.find(item => item.Id === userId);

    if (user) {
      const activateStatus = user.activateStatus?.toLowerCase();
      if (activateStatus === "yes") {
        localStorage.setItem("activateStatus", "present");
        if (user.mainBalance) {
          localStorage.setItem("mainBalance", user.mainBalance);
        }
        localStorage.removeItem("copData");
        hideActivationNotice();
      } else {
        showActivationNotice();
      }
    } else {
      showActivationNotice();
    }
  }

  // Controller logic
  if (localStorage.getItem("activateStatus") === "present") {
    hideActivationNotice();
  } else {
    showActivationNotice(); // Show it first

    if (shouldFetchData()) {
      fetchAllData();
    } else {
      const now = new Date();
      let nextCheck = "later today";

      if (now.getHours() < 12) {
        nextCheck = "after 8:00 PM";
      } else if (now.getHours() < 20) {
        nextCheck = "tomorrow morning";
      }

      notifyBox.innerHTML += `
        <div class="notice-timing" style="margin-top: 10px; color: #ffc; font-size: 14px;">
          We'll check again automatically ${nextCheck}.
        </div>
      `;
    }
  }
});