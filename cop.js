document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("Id");
  const apiURLs = [
    "https://sheetdb.io/api/v1/k51vpzir9tfo8",
    "https://sheetdb.io/api/v1/backup_api_1",
    "https://sheetdb.io/api/v1/backup_api_2"
  ];

  // Create style element dynamically
  const style = document.createElement("style");
  style.innerHTML = `
    #notifyBox {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.6);
      z-index: 9999;
      display: flex;
      justify-content: center;
      align-items: center;
      backdrop-filter: blur(6px);
      padding: 20px;
      animation: fadeSlide 0.4s ease-in-out;
    }

    .notification-content {
      background-color: #ff9800;
      padding: 30px;
      border-radius: 14px;
      text-align: center;
      max-width: 500px;
      width: 100%;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
      color: #fff;
      font-size: 1.5rem;
      font-family: 'Segoe UI', sans-serif;
      font-weight: 600;
    }

    .notification-content a {
      color: #fff;
      text-decoration: underline;
      font-weight: bold;
    }

    .notice-timing {
      margin-top: 16px;
      font-size: 1rem;
      color: #ffe;
      font-weight: 400;
      text-align: center;
      font-family: 'Segoe UI', sans-serif;
    }

    @media (max-width: 500px) {
      .notification-content {
        font-size: 1.2rem;
        padding: 20px;
      }

      .notice-timing {
        font-size: 0.9rem;
      }
    }

    @keyframes fadeSlide {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);

  // Create notifyBox element
  const notifyBox = document.createElement("div");
  notifyBox.id = "notifyBox";
  notifyBox.style.display = "none";
  document.body.appendChild(notifyBox);

  function showActivationNotice() {
    notifyBox.style.display = "flex";
    notifyBox.innerHTML = `
      <div class="notification-content">
        <p><strong>Activate your account with ₦200 by 
        <a href="activate.html">clicking here</a>.</strong></p>
      </div>
    `;
  }

  function hideActivationNotice() {
    notifyBox.style.display = "none";
  }

  function getCurrentTimeSlot() {
    const hour = new Date().getHours();
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
        fetchAllData((index + 1) % apiURLs.length, attemptCount + 1);
      });
  }

  function processUserActivation() {
    if (!userId) return showActivationNotice();

    const rawData = localStorage.getItem("copData");
    if (!rawData) return showActivationNotice();

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

      if (now.getHours() < 12) nextCheck = "after 8:00 PM";
      else if (now.getHours() < 20) nextCheck = "tomorrow morning";

      notifyBox.innerHTML += `
        <div class="notice-timing">
          We'll check again automatically ${nextCheck}.
        </div>
      `;
    }
  }
});