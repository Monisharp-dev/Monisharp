(function () {
  // ▓▓▓▓ CONFIG ▓▓▓▓
  const copiedKey = "referralCodeCopied";
  const copiedAtKey = "referralCodeCopiedAt";
  const savedAuthKey = "savedAuthCode";
  const delay = 10 * 60 * 1000; // 10 minutes

  const referralCode = localStorage.getItem("referralCode");
  const refereeCode = localStorage.getItem("refereeCode");

  // ▓▓▓▓ EXIT EARLY IF NOTHING TO DO ▓▓▓▓
  if (!refereeCode || localStorage.getItem(copiedKey)) return;

  // ▓▓▓▓ STYLES ▓▓▓▓
  const style = document.createElement("style");
  style.textContent = `
    #referralPopup {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.75);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
    }
    #referralPopup .popup-content {
      background: white;
      padding: 25px 30px;
      border-radius: 12px;
      max-width: 420px;
      width: 90%;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      text-align: center;
      font-family: 'Segoe UI', sans-serif;
    }
    #referralPopup p {
      margin-bottom: 15px;
      font-size: 15px;
      color: #333;
    }
    #referralPopup p span {
      color: red;
      font-weight: bold;
    }
    #referralPopup #generatedCode {
      background: #f1f1f1;
      padding: 10px;
      font-weight: bold;
      border-radius: 8px;
      word-break: break-word;
      margin: 10px 0;
    }
    #referralPopup button {
      background: #007BFF;
      color: white;
      border: none;
      padding: 10px 20px;
      font-size: 15px;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.2s ease;
    }
    #referralPopup button:active {
      background: #0056b3;
    }
  `;
  document.head.appendChild(style);

  // ▓▓▓▓ POPUP DOM ▓▓▓▓
  const popup = document.createElement("div");
  popup.id = "referralPopup";
  popup.innerHTML = `
    <div class="popup-content">
      <p><strong>NOTICE:</strong> You were referred by someone.</p>
      <p>Please send this code to the person who invited you or your account will be <span>BLOCKED</span>.</p>
      <div id="generatedCode">Generating code...</div>
      <button id="copyReferralCode">Copy Code</button>
    </div>
  `;
  document.body.appendChild(popup);

  // ▓▓▓▓ CODE GENERATION ▓▓▓▓
  function generateAuthCode(referral, referee) {
    const payload = `${referral}:${referee}`;
    const base64 = btoa(payload);
    return base64;
  }

  // ▓▓▓▓ HANDLE POPUP LOGIC ▓▓▓▓
  const authCode = generateAuthCode(referralCode, refereeCode);
  const codeBox = document.getElementById("generatedCode");
  const copyBtn = document.getElementById("copyReferralCode");

  codeBox.textContent = authCode;

  copyBtn.onclick = () => {
    navigator.clipboard.writeText(authCode)
      .then(() => {
        copyBtn.textContent = "Copied!";
        copyBtn.disabled = true;

        // Save copied state and start timer
        localStorage.setItem(copiedKey, "true");
        localStorage.setItem(copiedAtKey, Date.now().toString());

        // Countdown to remove popup and clear refereeCode
        setTimeout(() => {
          localStorage.setItem(savedAuthKey, authCode);
          localStorage.removeItem("refereeCode");
          popup.remove();
        }, delay);
      });
  };

  // ▓▓▓▓ Auto cleanup if already copied but time not expired ▓▓▓▓
  const copiedAt = localStorage.getItem(copiedAtKey);
  if (copiedAt && Date.now() - parseInt(copiedAt) < delay) {
    const timeLeft = delay - (Date.now() - parseInt(copiedAt));
    setTimeout(() => {
      popup.remove();
      localStorage.removeItem("refereeCode");
    }, timeLeft);
  }
})();