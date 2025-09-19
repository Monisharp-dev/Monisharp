document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("Id");
  if (!userId) return; // no user logged in

  const balanceKey = `depositBalance_${userId}`;

  // Show banner
  function showBanner() {
    if (document.getElementById("lowBalanceOverlay")) return; // already visible

    // Disable background scroll + clicks
    document.body.style.overflow = "hidden";
    document.body.style.pointerEvents = "none";

    const overlay = document.createElement("div");
    overlay.id = "lowBalanceOverlay";
    overlay.style = `
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.85);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 999999;
      font-family: Arial, sans-serif;
      color: #fff;
      text-align: center;
      padding: 20px;
      pointer-events: auto; /* allow clicks inside overlay */
    `;

    const message = document.createElement("div");
    message.innerHTML = `
      <h2 style="margin-bottom: 15px; font-size: 22px;">
        🚨 Deposit Balance Low
      </h2>
      <p style="margin-bottom: 20px; font-size: 18px;">
        Your deposit balance is below ₦800.<br>
        Please deposit to continue using the platform.
      </p>
    `;

    const button = document.createElement("button");
    button.textContent = "Top Up Now";
    button.style = `
      background: #ffcc00;
      color: #000;
      padding: 12px 25px;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
    `;
    button.onclick = () => {
      window.location.href = "deposit.html";
    };

    overlay.appendChild(message);
    overlay.appendChild(button);
    document.body.appendChild(overlay);
  }

  // Remove banner
  function hideBanner() {
    const overlay = document.getElementById("lowBalanceOverlay");
    if (overlay) overlay.remove();

    // Re-enable background interactions
    document.body.style.overflow = "";
    document.body.style.pointerEvents = "";
  }

  // Check balance
  function checkBalance() {
    const depositBalance = parseFloat(localStorage.getItem(balanceKey)) || 0;
    if (depositBalance < 800) {
      showBanner();
    } else {
      hideBanner();
    }
  }

  // Run immediately
  checkBalance();

  // Re-check every 5 seconds
  setInterval(checkBalance, 5000);
});