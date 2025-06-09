// Main elements & globals setup
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
const roundCountKey = 'tapGameRoundCount';
const usedBoostersKey = 'tapUsedBoosters';

const baseTime = 2 * 60 * 60 * 1000; // 2 hrs
let currentEndTime = 0;

// Helpers
function getTodayDateStr() {
  return new Date().toISOString().split('T')[0];
}

function parseISODate(iso) {
  return new Date(iso).toISOString().split('T')[0];
}

function customAlert(message, type = 'info') {
  const box = document.createElement('div');
  box.className = `custom-alert ${type}`;
  box.innerHTML = `<span>${message}</span>`;
  Object.assign(box.style, {
    position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
    backgroundColor: type === 'error' ? '#ff4d4f' : '#4caf50',
    color: '#fff', padding: '15px 20px', borderRadius: '8px',
    fontSize: '14px', zIndex: 9999, boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
  });
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 4000);
}

function showBoosterNotification(boosters) {
  if (!boosters.length) return;
  const note = document.createElement('div');
  note.className = 'booster-notice';
  note.innerHTML = `<strong>🔥 Boosters Active:</strong><br>${boosters.map(b=>`<span>• ${b}</span>`).join('<br>')}`;
  Object.assign(note.style, {
    position: 'fixed', top: '10px', left: '50%', transform: 'translateX(-50%)',
    background: '#111', color: '#fff', padding: '15px', borderRadius: '10px',
    zIndex: 9999, boxShadow: '0 0 12px rgba(0,0,0,0.6)', fontSize: '14px'
  });
  document.body.appendChild(note);
  setTimeout(() => note.remove(), 7000);
}

// Booster logic with round tracking
function getBoosterBonusTime() {
  const purchased = JSON.parse(localStorage.getItem(boosterKey)) || {};
  const used = JSON.parse(localStorage.getItem(usedBoostersKey)) || {};
  const today = getTodayDateStr();

  let totalBonus = 0;
  const activeBoosters = [];
  Object.values(boosterEls).forEach(el => el?.classList.remove('active'));

  // Gold
  if (purchased.gold && parseISODate(purchased.gold.expiresAt) === today) {
    if (!used.gold) {
      totalBonus += 30 * 60 * 1000;
      used.gold = true;
    }
    activeBoosters.push('🟡 Gold (+30m, x3)');
    boosterEls.gold?.classList.add('active');
    purchased.gold.rounds = (purchased.gold.rounds || 0) + 1;
    if (purchased.gold.rounds >= 6) delete purchased.gold;
  }

  // Premium
  if (purchased.premium && parseISODate(purchased.premium.expiresAt) === today) {
    if (!used.premium) {
      totalBonus += 20 * 60 * 1000;
      used.premium = true;
    }
    activeBoosters.push('🔵 Premium (+20m, x2)');
    boosterEls.premium?.classList.add('active');
    purchased.premium.rounds = (purchased.premium.rounds || 0) + 1;
    if (purchased.premium.rounds >= 3) delete purchased.premium;
  }

  // Local
  if (purchased.local && parseISODate(purchased.local.expiresAt) === today) {
    if (!used.local) {
      totalBonus += 10 * 60 * 1000;
      used.local = true;
    }
    activeBoosters.push('🟢 Local (+10m, x1)');
    boosterEls.local?.classList.add('active');
    purchased.local.rounds = (purchased.local.rounds || 0) + 1;
    if (purchased.local.rounds >= 1) delete purchased.local;
  }

  // Extra Time
  const extra = parseInt(localStorage.getItem(extraTimeKey)) || 0;
  const usedExtra = parseInt(localStorage.getItem('extraTimeUsed')) || 0;
  const bonusExtra = Math.max(0, Math.min(2 - usedExtra, extra));
  if (bonusExtra > 0) {
    totalBonus += bonusExtra * 4 * 60 * 60 * 1000;
    localStorage.setItem('extraTimeUsed', usedExtra + bonusExtra);
    activeBoosters.push(`⏱ Extra Time x${bonusExtra} (+${bonusExtra * 4}hrs)`);
  }

  localStorage.setItem(boosterKey, JSON.stringify(purchased));
  localStorage.setItem(usedBoostersKey, JSON.stringify(used));
  return { totalBonus, activeBoosters };
}

function getMultiplier() {
  const boosters = JSON.parse(localStorage.getItem(boosterKey)) || {};
  const today = getTodayDateStr();
  if (boosters.gold && parseISODate(boosters.gold.expiresAt) === today) return 3;
  if (boosters.premium && parseISODate(boosters.premium.expiresAt) === today) return 2;
  return 1;
}

function getAllowedRounds() {
  const boosters = JSON.parse(localStorage.getItem(boosterKey)) || {};
  const today = getTodayDateStr();
  if (boosters.gold && parseISODate(boosters.gold.expiresAt) === today) return 6;
  if (boosters.premium && parseISODate(boosters.premium.expiresAt) === today) return 3;
  if (boosters.local && parseISODate(boosters.local.expiresAt) === today) return 1;
  return 1;
}

// Game flow
function startGame() {
  const todayStr = getTodayDateStr();
  const rounds = JSON.parse(localStorage.getItem(roundCountKey)) || {};
  const usedRounds = rounds[todayStr] || 0;
  const maxRounds = getAllowedRounds();

  if (usedRounds >= maxRounds) {
    customAlert("⛔ No more rounds left for today.", 'error');
    return;
  }

  const { totalBonus, activeBoosters } = getBoosterBonusTime();
  currentEndTime = Date.now() + baseTime + totalBonus;
  localStorage.setItem(startKey, currentEndTime);
  localStorage.setItem(dateKey, todayStr);

  rounds[todayStr] = usedRounds + 1;
  localStorage.setItem(roundCountKey, JSON.stringify(rounds));

  score = parseInt(localStorage.getItem(gameKey)) || 0;
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
    const now = Date.now();
    const remaining = currentEndTime - now;

    if (remaining <= 0) {
      clearInterval(countdown);
      tapBtn.disabled = true;
      timerEl.textContent = '00:00:00';
      localStorage.removeItem(dateKey);
      customAlert("⏰ Time's up!", 'error');
      showStartBtn();
      return;
    }

    const hrs = String(Math.floor(remaining / 3600000)).padStart(2, '0');
    const mins = String(Math.floor((remaining % 3600000) / 60000)).padStart(2, '0');
    const secs = String(Math.floor((remaining % 60000) / 1000)).padStart(2, '0');
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
  const mul = getMultiplier();
  score += mul;
  scoreEl.textContent = score;
  localStorage.setItem(gameKey, score);
}

window.onload = () => {
  score = parseInt(localStorage.getItem(gameKey)) || 0;
  scoreEl.textContent = score;

  const storedEnd = parseInt(localStorage.getItem(startKey));
  const storedDate = localStorage.getItem(dateKey);
  const now = Date.now();

  if (storedEnd && storedDate === getTodayDateStr() && now < storedEnd) {
    tapBtn.disabled = false;
    hideStartBtn();
    startCountdown(storedEnd);
  } else {
    tapBtn.disabled = true;
    showStartBtn();
  }
};

tapBtn.addEventListener('click', updateScore);
startBtn.addEventListener('click', startGame);