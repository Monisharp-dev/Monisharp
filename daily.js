(function() {
  // ✅ Only run if activateStatus exists
  if (!localStorage.getItem("activateStatus")) return;

  const today = new Date().toISOString().split('T')[0];
  const userId = localStorage.getItem("Id") || "testUser";
  const taskKey = `taskBalance_${userId}`;
  const scoreKey = `tapScore`;
  const lastDateKey = `lastCheckinDate_${userId}`;
  const currentDayKey = `checkinDay_${userId}`;

  const rewards = [
    { label: "₦5", type: "money", amount: 5 },
    { label: "₦5", type: "money", amount: 5 },
    { label: "₦5", type: "money", amount: 5 },
    { label: "₦5", type: "money", amount: 5 },
    { label: "₦10", type: "money", amount: 10 },
    { label: "₦10", type: "money", amount: 10 },
    { label: "₦10", type: "money", amount: 10 }
  ];

  const lastClaim = localStorage.getItem(lastDateKey);
  const currentDay = parseInt(localStorage.getItem(currentDayKey)) || 0;
  const missed = lastClaim && lastClaim !== today;

  if (missed) {
    localStorage.setItem(currentDayKey, 0);
  }

  if (lastClaim !== today) {
    showCheckinPopup(currentDay);
  }

  function showCheckinPopup(dayIndex) {
    const overlay = document.createElement("div");
    overlay.id = "checkinOverlay";
    overlay.innerHTML = `
      <div class="popupBox">
        <h2>🎁 Daily Check-In</h2>
        <div class="calendar">
          ${rewards.map((r, i) => `
            <div class="day ${i === dayIndex ? 'active' : ''}">
              <span class="day-num">Day ${i + 1}</span>
              <span class="reward">${r.label} ${r.type === 'money' ? '💰' : '✨'}</span>
            </div>
          `).join('')}
        </div>
        <button id="claimReward">✅ Claim Reward</button>
      </div>
    `;
    document.body.appendChild(overlay);

    const style = document.createElement("style");
    style.textContent = `
      #checkinOverlay {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: rgba(0, 0, 0, 0.7);
        display: flex; justify-content: center; align-items: center;
        z-index: 9999;
        font-family: Arial, sans-serif;
      }
      .popupBox {
        background: white;
        padding: 20px;
        border-radius: 16px;
        box-shadow: 0 0 20px rgba(0,0,0,0.3);
        text-align: center;
        width: 90%;
        max-width: 400px;
        animation: fadeIn 0.4s ease;
      }
      @keyframes fadeIn {
        from { transform: scale(0.9); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      .calendar {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        margin: 20px 0;
      }
      .day {
        background: #f1f1f1;
        padding: 10px;
        border-radius: 10px;
        transition: 0.3s;
      }
      .day.active {
        background: #4caf50;
        color: white;
        transform: scale(1.05);
      }
      .day-num {
        font-weight: bold;
        font-size: 14px;
      }
      .reward {
        font-size: 16px;
        margin-top: 4px;
        display: block;
      }
      #claimReward {
        padding: 10px 20px;
        background: #007bff;
        color: white;
        font-size: 16px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: 0.2s;
      }
      #claimReward:hover {
        background: #0056b3;
      }

      /* Custom alert box */
      #customAlert {
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: #323232;
        color: white;
        padding: 14px 20px;
        border-radius: 10px;
        font-size: 16px;
        z-index: 9999;
        opacity: 0;
        animation: slideFade 4s ease forwards;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      }

      @keyframes slideFade {
        0% { bottom: 0; opacity: 0; }
        10% { bottom: 30px; opacity: 1; }
        90% { bottom: 30px; opacity: 1; }
        100% { bottom: 60px; opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    document.getElementById("claimReward").onclick = () => {
      const reward = rewards[dayIndex];
      if (reward.type === "money") {
        const current = parseInt(localStorage.getItem(taskKey)) || 0;
        localStorage.setItem(taskKey, current + reward.amount);
      } else {
        const current = parseInt(localStorage.getItem(scoreKey)) || 0;
        localStorage.setItem(scoreKey, current + reward.amount);
      }
      localStorage.setItem(lastDateKey, today);
      const nextDay = (dayIndex + 1) % 7;
      localStorage.setItem(currentDayKey, nextDay);
      document.getElementById("checkinOverlay").remove();
      showCustomAlert(`${reward.label} ${reward.type === "money" ? "added to Task Balance 💰" : "added to Tap Score ✨"}`);
    };
  }

  function showCustomAlert(message) {
    const alertBox = document.createElement("div");
    alertBox.id = "customAlert";
    alertBox.textContent = message;
    document.body.appendChild(alertBox);
    setTimeout(() => alertBox.remove(), 4000);
  }
})();
