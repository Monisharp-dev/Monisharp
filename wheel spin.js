const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");

// ===========================
// ✅ Reward definitions
const rewards = [
  { label: "+1 Million Points", chance: 1, action: () => addToTapScore(1000000) },
  { label: "Free Spin", chance: 6, action: () => trackFreeSpin() },
  { label: "\u20A6250", chance: 0.1, action: () => addToTaskBalance(250) },
  { label: "\u20A6100", chance: 0.9, action: () => addToTaskBalance(100) },
  { label: "\u20A650", chance: 5, action: () => addToTaskBalance(50) },
  { label: "\u20A65", chance: 78, action: () => addToTaskBalance(5) },
];

const equalSegments = new Array(rewards.length).fill(1);
const pieColors = ["#4CAF50", "#03A9F4", "#FF5722", "#FFC107", "#9C27B0", "#795548"];

// ===========================
// 🎯 Chart setup
let myChart = new Chart(wheel, {
  plugins: [ChartDataLabels],
  type: "pie",
  data: {
    labels: rewards.map(r => r.label),
    datasets: [{
      backgroundColor: pieColors,
      data: equalSegments,
    }],
  },
  options: {
    responsive: true,
    animation: { duration: 0 },
    rotation: 0,
    plugins: {
      tooltip: false,
      legend: { display: false },
      datalabels: {
        color: "#fff",
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label.length > 10 ? label.replace(" ", "\n") : label;
        },
        font: { size: 12, weight: 'bold' },
        textAlign: 'center',
        anchor: 'center',
        align: 'center',
      },
    },
  },
});

// ===========================
// 📦 Storage Helpers
const getId = () => localStorage.getItem("Id");
const getDeposit = () => Number(localStorage.getItem(`depositBalance_${getId()}`)) || 0;
const getTaskBalance = () => Number(localStorage.getItem(`taskBalance_${getId()}`)) || 0;
const getTapScore = () => Number(localStorage.getItem("tapScore")) || 0;

const setDeposit = val => localStorage.setItem(`depositBalance_${getId()}`, val);
const setTaskBalance = val => localStorage.setItem(`taskBalance_${getId()}`, val);
const setTapScore = val => localStorage.setItem("tapScore", val);

// ===========================
// 💬 Styled Alerts
const showAlert = (msg, type = "info") => {
  const alertBox = document.createElement("div");
  alertBox.textContent = msg;
  alertBox.className = `custom-alert ${type}`;
  document.body.appendChild(alertBox);
  setTimeout(() => alertBox.remove(), 2500);
};

const injectAlertStyles = () => {
  const style = document.createElement("style");
  style.textContent = `
    .custom-alert {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      padding: 12px 20px;
      background: #2196F3;
      color: #fff;
      font-family: Poppins, sans-serif;
      font-size: 14px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      z-index: 9999;
      animation: fadeInOut 3s ease-in-out;
    }
    .custom-alert.success { background: #4CAF50; }
    .custom-alert.error { background: #F44336; }
    .custom-alert.info { background: #2196F3; }
    @keyframes fadeInOut {
      0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
      10% { opacity: 1; transform: translateX(-50%) translateY(0); }
      90% { opacity: 1; }
      100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    }
  `;
  document.head.appendChild(style);
};
injectAlertStyles();

// Show initial alert about the ₦10 charge
window.addEventListener("load", () => {
  setTimeout(() => {
    showAlert("⚠️ Each spin costs ₦10 from Deposit or Task Balance", "info");
  }, 500);
});

// ===========================
// 🎁 Reward Handlers
const addToTaskBalance = amount => {
  const current = getTaskBalance();
  setTaskBalance(current + amount);
  showAlert(`You won \u20A6${amount}!`, "success");
};

const addToTapScore = amount => {
  const score = getTapScore();
  setTapScore(score + amount);
  showAlert(`🔥 +${amount.toLocaleString()} Tap Points!`, "success");
};

const trackFreeSpin = () => {
  let count = Number(localStorage.getItem("freeSpins") || 0) + 1;
  localStorage.setItem("freeSpins", count);
  showAlert(`🎉 You got a Free Spin! (${count} total)`, "success");
};

// ===========================
// 🎲 Weighted Reward Selection
const getWeightedReward = () => {
  const total = rewards.reduce((sum, r) => sum + r.chance, 0);
  const rand = Math.random() * total;
  let cumulative = 0;
  for (const r of rewards) {
    cumulative += r.chance;
    if (rand <= cumulative) return r;
  }
  return rewards[rewards.length - 1];
};

// ===========================
// 🌀 Spin Logic
let spinning = false;
spinBtn.addEventListener("click", () => {
  if (spinning) return;

  const spinCost = 10;
  let deposit = getDeposit();
  let taskBal = getTaskBalance();

  let freeSpins = Number(localStorage.getItem("freeSpins") || 0);

if (freeSpins > 0) {
  freeSpins -= 1;
  localStorage.setItem("freeSpins", freeSpins);
  showAlert(`🆓 Free Spin used! (${freeSpins} left)`, "success");
} else if (deposit >= spinCost) {
  setDeposit(deposit - spinCost);
  showAlert(`₦${spinCost} deducted from Deposit`, "info");
} else if (taskBal >= spinCost) {
  setTaskBalance(taskBal - spinCost);
  showAlert(`₦${spinCost} deducted from Task Balance`, "info");
} else {
  showAlert("❌ Insufficient balance for spin!", "error");
  return;
}

  spinning = true;
  spinBtn.disabled = true;
  finalValue.innerHTML = `<p>Spinning...</p>`;

  const reward = getWeightedReward();
  const idx = rewards.findIndex(r => r.label === reward.label);
  const sliceAngle = 360 / rewards.length;
  const randomAngle = Math.random() * sliceAngle;
  const targetAngle = 360 * 6 + (360 - (idx * sliceAngle + sliceAngle / 2) + randomAngle); // Extra spins + precision

  let currentAngle = 0;
  let lastTimestamp = null;

  const animate = timestamp => {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const delta = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    const speed = 10;
    currentAngle += speed * delta;

    if (currentAngle >= targetAngle) {
      myChart.options.rotation = targetAngle % 360;
      myChart.update();
      finalValue.innerHTML = `<p>You won: <strong>${reward.label}</strong></p>`;
      reward.action();
      spinning = false;
      spinBtn.disabled = false;
      return;
    }

    myChart.options.rotation = currentAngle % 360;
    myChart.update();
    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
});