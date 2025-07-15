// === CONFIGURATION ===
const targetUserId = "jimohhabeeb2008";
const depositAmount = 100;
const depositKey = "HB100"; // Must be unique (5 chars)
const popupFlagKey = `hasAcceptedDeposit_${targetUserId}`;

// ✅ Function to credit deposit balance
function allotDepositBalance(userId, amount, uniqueKey) {
  if (!userId || typeof amount !== "number" || !uniqueKey || uniqueKey.length !== 5) {
    console.error("❌ Invalid input: userId, amount, or key is missing or incorrectly formatted.");
    return;
  }

  const depositBalanceKey = `depositBalance_${userId}`;
  const usedKeysKey = `usedDepositKeys_${userId}`;
  const usedKeys = JSON.parse(localStorage.getItem(usedKeysKey)) || [];

  if (usedKeys.includes(uniqueKey)) {
    console.warn(`⚠️ Key "${uniqueKey}" has already been used for user "${userId}".`);
    return;
  }

  let currentBalance = parseFloat(localStorage.getItem(depositBalanceKey)) || 0;
  currentBalance += amount;
  localStorage.setItem(depositBalanceKey, currentBalance.toFixed(2));

  usedKeys.push(uniqueKey);
  localStorage.setItem(usedKeysKey, JSON.stringify(usedKeys));

  console.log(`✅ Credited ₦${amount} to user "${userId}". New balance: ₦${currentBalance.toFixed(2)}.`);
}

// ✅ Function to show the popup modal
function showDepositPopup() {
  const overlay = document.createElement("div");
  overlay.id = "depositPopup";
  overlay.style = `
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    background: rgba(0,0,0,0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  `;

  const modal = document.createElement("div");
  modal.style = `
    background: #fff;
    padding: 30px;
    border-radius: 12px;
    text-align: center;
    max-width: 90%;
    box-shadow: 0 0 15px rgba(0,0,0,0.3);
  `;

  modal.innerHTML = `
    <h2 style="margin-bottom: 10px;">🎉 Welcome Bonus</h2>
    <p style="margin-bottom: 20px;">You have ₦100 waiting to be added to your deposit balance.</p>
    <button id="acceptBtn" style="
      padding: 10px 20px;
      background: #2ecc71;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
    ">Accept ₦100</button>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  document.getElementById("acceptBtn").onclick = () => {
    allotDepositBalance(targetUserId, depositAmount, depositKey);
    localStorage.setItem(popupFlagKey, "true");
    document.getElementById("depositPopup").remove();
  };
}

// ✅ MAIN EXECUTION
window.addEventListener("DOMContentLoaded", () => {
  const currentUser = localStorage.getItem("Id")?.trim();
  const hasAccepted = localStorage.getItem(popupFlagKey) === "true";

  if (currentUser === targetUserId && !hasAccepted) {
    showDepositPopup();
  }
});