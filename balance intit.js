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
  const referralDone = localStorage.getItem("referralDone"); // NEW flag

  // Step 6: Show modal logic
  if (activateStatus && refereeCode && !referralDone) {
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
          <p id="redirect-msg" style="margin-top: 20px; font-weight: bold; color: #0d6efd;"></p>
          <button id="done-btn" style="display:none; margin-top:20px; padding:10px 20px; background:#0d6efd; color:white; border:none; border-radius:6px; cursor:pointer;">
            ✅ I have done it
          </button>
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
          transition: opacity 0.8s ease, visibility 0.8s ease;
        }
        #referral-block-modal.fade-out {
          opacity: 0;
          visibility: hidden;
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
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      </style>
    `;

    document.body.appendChild(modal);

    const msg = document.getElementById("redirect-msg");
    const doneBtn = document.getElementById("done-btn");
    const modalEl = document.getElementById("referral-block-modal");

    // If it's the first time → redirect
    if (!localStorage.getItem("referralRedirected")) {
      msg.textContent = "Preparing to redirect...";
      setTimeout(() => {
        msg.textContent = "Redirecting to referral page so you can copy your code...";
        localStorage.setItem("referralRedirected", "true"); // flag first redirect
        setTimeout(() => {
          window.location.href = "refer.html";
        }, 4000);
      }, 3000);

    } else {
      // If user already came back → show button
      msg.textContent = "Once you’ve completed the step, confirm below:";
      doneBtn.style.display = "inline-block";

      doneBtn.addEventListener("click", () => {
        doneBtn.disabled = true;
        doneBtn.textContent = "⏳ Processing...";
        setTimeout(() => {
          localStorage.setItem("referralDone", "true"); // never show again
          modalEl.classList.add("fade-out");
          setTimeout(() => modalEl.remove(), 800); // remove after fade-out
        }, 6000);
      });
    }
  }
});