const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const tapBtn = document.getElementById('tapBtn');
const startBtn = document.getElementById('startBtn');
const boosterEls = {
  gold: document.getElementById('booster-gold'),
  premium: document.getElementById('booster-premium'),
  local: document.getElementById('booster-local')
};

let score = 0;
let countdown;
const gameKey = 'tapTapScore';
const startKey = 'tapGameEndTime';
const dateKey = 'tapGameStartDate';
const boosterKey = 'purchasedBoosters';
const extraTimeKey = 'extraTimeBoosters';

const baseTime = 2 * 60 * 60 * 1000; // 2 hrs
let currentEndTime = 0;

function getTodayDateStr() {
  return new Date().toISOString().split('T')[0];
}

function parseISODate(iso) {
  return new Date(iso).toISOString().split('T')[0];
}

function customAlert(message, type = 'info') {
  const alertBox = document.createElement('div');
  alertBox.className = `custom-alert ${type}`;
  alertBox.innerHTML = `<span>${message}</span>`;
  Object.assign(alertBox.style, {
    position: "fixed",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "15px 20px",
    backgroundColor: type === 'error' ? '#ff4d4f' : '#4caf50',
    color: '#fff',
    fontSize: '14px',
    borderRadius: '8px',
    zIndex: 9999,
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    transition: 'opacity 0.3s ease',
  });
  document.body.appendChild(alertBox);
  setTimeout(() => alertBox.remove(), 4000);
}

function getBoosterBonusTime() {
  const purchased = JSON.parse(localStorage.getItem(boosterKey)) || {};
  const today = getTodayDateStr();
  let totalBonus = 0;
  let activeBoosters = [];

  // Reset booster active classes
  Object.values(boosterEls).forEach(el => el?.classList.remove('active'));

  if (purchased.gold && parseISODate(purchased.gold.expiresAt) === today) {
    totalBonus += 30 * 60 * 1000;
    activeBoosters.push('🟡 Gold (+30m)');
    boosterEls.gold?.classList.add('active');
  }
  if (purchased.premium && parseISODate(purchased.premium.expiresAt) === today) {
    totalBonus += 20 * 60 * 1000;
    activeBoosters.push('🔵 Premium (+20m)');
    boosterEls.premium?.classList.add('active');
  }
  if (purchased.local && parseISODate(purchased.local.expiresAt) === today) {
    totalBonus += 10 * 60 * 1000;
    activeBoosters.push('🟢 Local (+10m)');
    boosterEls.local?.classList.add('active');
  }

  const extra = parseInt(localStorage.getItem(extraTimeKey)) || 0;
  if (extra > 0) {
    totalBonus += extra * 4 * 60 * 60 * 1000;
    activeBoosters.push(`⏱ Extra Time x${extra} (+${extra * 4}hrs)`);
  }

  return { totalBonus, activeBoosters };
}

function showBoosterNotification(boosters) {
  if (!boosters.length) return;
  const notify = document.createElement("div");
  notify.className = "booster-notice";
  notify.innerHTML = `
    <strong>🔥 Boosters Active:</strong><br>
    ${boosters.map(b => `<span>• ${b}</span>`).join("<br>")}
  `;
  Object.assign(notify.style, {
    position: "fixed",
    top: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#111",
    color: "#fff",
    padding: "15px",
    borderRadius: "10px",
    zIndex: "9999",
    boxShadow: "0 0 12px rgba(0,0,0,0.6)",
    fontSize: "14px",
    textAlign: "left"
  });
  document.body.appendChild(notify);
  setTimeout(() => notify.remove(), 7000);
}

function startGame() {
  const now = Date.now();
  const todayStr = getTodayDateStr();
  const storedDate = localStorage.getItem(dateKey);

  if (storedDate === todayStr) {
    customAlert("You've already started today's game. Come back tomorrow.", 'error');
    return;
  }

  const { totalBonus, activeBoosters } = getBoosterBonusTime();
  currentEndTime = now + baseTime + totalBonus;

  localStorage.setItem(startKey, currentEndTime);
  localStorage.setItem(dateKey, todayStr);

  // Do NOT reset score on new start in the same day
  const existingScore = localStorage.getItem(gameKey);
  score = existingScore ? parseInt(existingScore) : 0;
  scoreEl.textContent = score;

  tapBtn.disabled = false;
  hideStartBtn();
  startCountdown(currentEndTime);

  if (activeBoosters.length) showBoosterNotification(activeBoosters);
  console.log("✅ New game started!");
}

function startCountdown(endTime) {
  clearInterval(countdown);
  currentEndTime = endTime;

  countdown = setInterval(() => {
    const { totalBonus, activeBoosters } = getBoosterBonusTime();
    const now = Date.now();
    const storedDate = localStorage.getItem(dateKey);
    const today = getTodayDateStr();

    if (storedDate !== today) {
      // Day changed or no active game today
      clearInterval(countdown);
      tapBtn.disabled = true;
      timerEl.textContent = '00:00:00';
      showStartBtn();
      return;
    }

    // Recalculate expected start time (end - base - boosters)
    const expectedStartTime = currentEndTime - (baseTime + totalBonus);
    const updatedEnd = expectedStartTime + baseTime + totalBonus;

    // Extend currentEndTime if booster time added dynamically
    if (updatedEnd > currentEndTime) {
      console.log("⏩ Booster added. Extending time.");
      currentEndTime = updatedEnd;
      localStorage.setItem(startKey, currentEndTime);
      showBoosterNotification(activeBoosters);
    }

    const remaining = currentEndTime - now;

    if (remaining <= 0) {
      clearInterval(countdown);
      tapBtn.disabled = true;
      timerEl.textContent = '00:00:00';
      localStorage.removeItem(dateKey);
      customAlert("⏰ Time's up! Buy a booster to revive the game.", 'error');
      showStartBtn();
      return;
    }

    const hrs = String(Math.floor(remaining / (1000 * 60 * 60))).padStart(2, '0');
    const mins = String(Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    const secs = String(Math.floor((remaining % (1000 * 60)) / 1000)).padStart(2, '0');

    timerEl.textContent = `${hrs}:${mins}:${secs}`;
  }, 1000);
}

function hideStartBtn() {
  startBtn.style.display = 'none';
}

function showStartBtn() {
  startBtn.style.display = 'inline-block';
}

function updateScore() {
  score++;
  scoreEl.textContent = score;
  localStorage.setItem(gameKey, score);
}

window.onload = () => {
  const savedScore = localStorage.getItem(gameKey);
  if (savedScore) {
    score = parseInt(savedScore);
    scoreEl.textContent = score;
  }

  const storedEndTime = localStorage.getItem(startKey);
  const storedDate = localStorage.getItem(dateKey);
  const now = Date.now();
  const todayStr = getTodayDateStr();

  if (storedEndTime && storedDate === todayStr) {
    const endTime = parseInt(storedEndTime);
    if (now < endTime) {
      tapBtn.disabled = false;
      hideStartBtn();
      startCountdown(endTime);
    } else {
      tapBtn.disabled = true;
      hideStartBtn();
      timerEl.textContent = '00:00:00';

      // Booster revival after timeout
      const { totalBonus, activeBoosters } = getBoosterBonusTime();
      if (totalBonus > 0) {
        const revivedEnd = now + totalBonus;
        localStorage.setItem(startKey, revivedEnd);
        localStorage.setItem(dateKey, todayStr);
        tapBtn.disabled = false;
        hideStartBtn();
        startCountdown(revivedEnd);
        showBoosterNotification(activeBoosters);
        customAlert("⛑️ Game revived with new booster!", 'success');
      } else {
        showStartBtn();
      }
    }
  } else {
    tapBtn.disabled = true;
    showStartBtn();
  }

  getBoosterBonusTime(); // refresh booster UI
};

tapBtn.addEventListener('click', updateScore);
startBtn.addEventListener('click', startGame);