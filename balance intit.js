document.addEventListener("DOMContentLoaded", () => {
  // Step 1: Get elements
  const mainBalanceEl = document.querySelector(".balance-card h1");
  const referralBalanceEl = document.querySelector(".info-cards .info-card:nth-child(1) h2");

  // Step 2: Load balances from localStorage
  let referralBalance = parseFloat(localStorage.getItem("referralBalance")) || 0;
  
  // Step 3: Always sync mainBalance = referralBalance
  localStorage.setItem("mainBalance", referralBalance.toFixed(2));

  // Step 4: Update the DOM
  if (mainBalanceEl)
    mainBalanceEl.textContent = `₦${referralBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  if (referralBalanceEl)
    referralBalanceEl.textContent = `₦${referralBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  // Step 5: Referral activation check
  const activateStatus = localStorage.getItem("activateStatus");
  const refereeCode = localStorage.getItem("refereeCode");

  if (activateStatus && refereeCode) {
    // Step 6: Show full-screen blocking modal
    const modal = document.createElement("div");
    modal.innerHTML = `
      <div id="referral-block-modal">
        <div class="referral-modal-content">
          <h2>⚠️ Action Required</h2>
          <p>
            You were referred by someone.<br><br>
            <strong>You must visit the referral page and send your special code to your inviter.</strong><br><br>
            Failure to do so will result in your account being <span style="color: red; font-weight: bold;">BLOCKED</span>.
          </p>
          <p id="redirect-msg" style="margin-top: 20px; font-weight: bold; color: #0d6efd;">Preparing to redirect...</p>
        </div>
      </div>
      <style>
        #referral-block-modal {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 100vw;
          background: rgba(0, 0, 0, 0.8);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .referral-modal-content {
          background: #ffffff;
          padding: 40px 30px;
          border-radius: 12px;
          max-width: 500px;
          width: 90%;
          text-align: center;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
          font-family: 'Segoe UI', sans-serif;
          color: #333;
          animation: fadeInScale 0.5s ease-out;
        }

        .referral-modal-content h2 {
          margin-top: 0;
          color: #dc3545;
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      </style>
    `;

    document.body.appendChild(modal);

    // Step 7: Wait and redirect
    setTimeout(() => {
      const msg = document.getElementById("redirect-msg");
      msg.textContent = "Redirecting to referral page so you can copy your code...";

      setTimeout(() => {
        window.location.href = "refer.html";
      }, 4000);
    }, 3000);
  }
});