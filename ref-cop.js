(function () {
  const referralCode = localStorage.getItem("referralCode") || "N/A";
  const popupCountKey = "referralPopupCount";
  let count = parseInt(localStorage.getItem(popupCountKey)) || 0;

  // Stop showing popup if count >= 5
  if (count >= 5) return;

  // Increment and save count
  localStorage.setItem(popupCountKey, count + 1);

  // ▓▓▓▓ INJECT POPUP STYLES ▓▓▓▓
  const style = document.createElement("style");
  style.textContent = `
    #referralPopup {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
      font-family: 'Segoe UI', sans-serif;
    }
    #referralPopup .popup-content {
      background: #ffffff;
      padding: 25px 30px;
      border-radius: 14px;
      max-width: 400px;
      width: 90%;
      text-align: center;
      box-shadow: 0 10px 25px rgba(0,0,0,0.25);
      animation: fadeIn 0.3s ease-out;
    }
    #referralPopup h2 { margin-bottom: 10px; font-size: 18px; color: #222; }
    #referralPopup p { font-size: 15px; margin-bottom: 15px; color: #444; }
    #referralPopup #generatedCode {
      background: #f3f4f6;
      padding: 12px;
      margin: 10px 0 20px;
      font-weight: bold;
      border-radius: 8px;
      word-break: break-word;
      font-size: 16px;
      color: #111;
    }
    #referralPopup .btn-group { display: flex; gap: 10px; justify-content: center; }
    #referralPopup button {
      flex: 1;
      background: #007BFF;
      color: white;
      border: none;
      padding: 10px 0;
      font-size: 15px;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s ease;
    }
    #referralPopup button:active { background: #0056b3; }
    #referralPopup button#okBtn { background: #28a745; }
    #referralPopup button#okBtn:active { background: #1e7e34; }
    @keyframes fadeIn { from {opacity: 0; transform: scale(0.95);} to {opacity: 1; transform: scale(1);} }
  `;
  document.head.appendChild(style);

  // ▓▓▓▓ BUILD POPUP ▓▓▓▓
  const popup = document.createElement("div");
  popup.id = "referralPopup";
  popup.innerHTML = `
    <div class="popup-content">
      <h2>Referral Notice</h2>
      <p>Please send your referral code to the person that invited you.</p>
      <div id="generatedCode">${referralCode}</div>
      <div class="btn-group">
        <button id="copyReferralCode">Copy</button>
        <button id="okBtn">Ok</button>
      </div>
    </div>
  `;
  document.body.appendChild(popup);

  // ▓▓▓▓ BUTTON HANDLERS ▓▓▓▓
  const copyBtn = document.getElementById("copyReferralCode");
  const okBtn = document.getElementById("okBtn");

  copyBtn.onclick = () => {
    navigator.clipboard.writeText(referralCode).then(() => {
      copyBtn.textContent = "Copied!";
      copyBtn.disabled = true;
      setTimeout(() => {
        copyBtn.textContent = "Copy";
        copyBtn.disabled = false;
      }, 2000);
    });
  };

  okBtn.onclick = () => {
    popup.remove();
  };
})();