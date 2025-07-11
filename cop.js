document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("Id");
  const apiURLs = [
    "https://sheetdb.io/api/v1/c144vqnly26t5",
    "https://sheetdb.io/api/v1/k51vpzir9tfo8",
    "https://sheetdb.io/api/v1/backup_api_1",
    "https://sheetdb.io/api/v1/backup_api_2"
  ];

  // Inject styles
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
    .notice-timing {
      margin-top: 16px;
      font-size: 1rem;
      color: #ffe;
      font-weight: 400;
    }
    button#redirectBtn {
      margin-top: 16px;
      padding: 10px 20px;
      font-size: 1rem;
      border: none;
      border-radius: 8px;
      background-color: #333;
      color: #fff;
      cursor: not-allowed;
      opacity: 0.5;
      display: none;
      transition: all 0.3s ease;
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

  // Create notification box
  const notifyBox = document.createElement("div");
  notifyBox.id = "notifyBox";
  notifyBox.style.display = "none";
  document.body.appendChild(notifyBox);

  function showCountdown() {
    notifyBox.style.display = "flex";
    notifyBox.innerHTML = `
      <div class="notification-content">
        <p>Activate your account with ₦300!
        <br>Please hold on while we initialize the app...</p>
        <div class="notice-timing">
          <span id="countdown">20</span> seconds remaining
        </div>
        <button id="redirectBtn">Proceed</button>
      </div>
    `;

    const countdownEl = document.getElementById("countdown");
    const redirectBtn = document.getElementById("redirectBtn");
    redirectBtn.disabled = true;

    let remaining = 20;
    const timer = setInterval(() => {
      remaining--;
      countdownEl.textContent = remaining;
      if (remaining <= 0) {
        clearInterval(timer);
        redirectBtn.disabled = false;
        redirectBtn.style.cursor = "pointer";
        redirectBtn.style.opacity = "1";
        redirectBtn.style.display = "inline-block";
      }
    }, 1000);

    redirectBtn.addEventListener("click", () => {
      window.location.href = "activate.html"; // Only on user click
    });
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
    if (!userId) return showCountdown();

    const rawData = localStorage.getItem("copData");
    if (!rawData) return showCountdown();

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
        showCountdown();
      }
    } else {
      showCountdown();
    }
  }

  // Constantly check activateStatus locally every 2 seconds
  setInterval(() => {
    if (localStorage.getItem("activateStatus") === "present") {
      hideActivationNotice();
    }
  }, 2000);

  // Controller logic
  if (localStorage.getItem("activateStatus") === "present") {
    hideActivationNotice();
  } else {
    showCountdown();
    if (shouldFetchData()) {
      fetchAllData();
    }
  }
});