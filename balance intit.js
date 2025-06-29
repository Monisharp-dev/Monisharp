document.addEventListener("DOMContentLoaded", () => {
  const mainBalanceEl = document.querySelector(".balance-card h1");
  const referralBalanceEl = document.querySelector(".info-cards .info-card:nth-child(1) h2");
  const depositBalanceEl = document.getElementById("depositBalance");

  const userId = localStorage.getItem("Id");
  const depositBalanceKey = `depositBalance_${userId}`;

  // Step 1: Initialize balances for new users
  if (!localStorage.getItem("hasInitializedBalances")) {
    localStorage.setItem("mainBalance", "0");
    localStorage.setItem("referralBalance", "0");
    localStorage.setItem("referrals", "0");
    localStorage.setItem("hasInitializedBalances", "true");
  }

  // Step 2: Load balances from localStorage
  const referralsRaw = localStorage.getItem("referrals");
  const referrals = referralsRaw !== null ? parseInt(referralsRaw) : 0;
  const bonusPerReferral = 150;
  const referralBalance = referrals * bonusPerReferral;
  const mainBalance = referralBalance;

  // Step 3: Store balances
  localStorage.setItem("mainBalance", mainBalance.toFixed(2));
  localStorage.setItem("referralBalance", referralBalance.toFixed(2));

  // Step 4: Display balances
  if (mainBalanceEl)
    mainBalanceEl.textContent = `₦${mainBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  if (referralBalanceEl)
    referralBalanceEl.textContent = `₦${referralBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  const depositBalance = parseFloat(localStorage.getItem(depositBalanceKey)) || 0;
  if (depositBalanceEl)
    depositBalanceEl.textContent = `₦${depositBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  // Debug Logs
  console.log("✅ Referrals:", referrals);
  console.log("✅ Referral Balance:", referralBalance);
  console.log("✅ Main Balance (synced to referrals):", mainBalance);
  console.log("✅ Deposit Balance:", depositBalance);

  // Step 5: Redirect if balance conditions are met
  if (mainBalance > 5000 || referralBalance > 5000) {
    const popup = document.createElement("div");
    popup.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #0d6efd;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        font-size: 16px;
        z-index: 9999;
        animation: popIn 0.3s ease;
      ">
        Please visit the referral page for validation. Redirecting...
      </div>
    `;
    document.body.appendChild(popup);

    setTimeout(() => {
      popup.remove();
      window.location.href = "refer.html";
    }, 8000);
  }
});
