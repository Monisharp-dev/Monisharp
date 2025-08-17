// ==============================
// HTML & STYLE FOR DATA POPUP
// ==============================
const adPopupHTML = `
  <style>
    .ad-popup {
      position: fixed;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #0f2027, #2c5364);
      color: white;
      width: 90%;
      max-width: 850px;
      padding: 24px 28px 20px;
      border-radius: 18px;
      box-shadow: 0 12px 30px rgba(0,0,0,0.25);
      z-index: 9999;
      display: flex;
      align-items: flex-start;
      gap: 20px;
      font-family: 'Segoe UI', sans-serif;
      animation: slideUp 0.6s ease forwards;
      flex-wrap: wrap;
    }

    .ad-popup i.main-icon {
      font-size: 50px;
      animation: bounce 1.5s infinite;
      margin-top: 6px;
      color: #FFD700;
    }

    .ad-popup .content {
      flex: 1;
    }

    .ad-popup .content h4 {
      margin: 0 0 10px;
      font-size: 24px;
      font-weight: bold;
    }

    .ad-popup .content p {
      margin: 0 0 14px;
      font-size: 16px;
      line-height: 1.6;
    }

    .ad-popup .highlight {
      font-weight: bold;
      color: #00ffcc;
    }

    .ad-popup .cta-btn {
      display: inline-block;
      padding: 10px 20px;
      background: #fff;
      color: #0f2027;
      font-weight: bold;
      border-radius: 10px;
      text-decoration: none;
      box-shadow: 0 5px 14px rgba(0,0,0,0.2);
      transition: transform 0.2s ease, background 0.3s;
    }

    .ad-popup .cta-btn:hover {
      background: #f2f2f2;
      transform: scale(1.06);
    }

    .ad-popup .close-btn {
      background: white;
      color: #0f2027;
      border: none;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
      transition: background 0.2s;
    }

    .ad-popup .close-btn:hover {
      background: #e0e0e0;
    }

    @keyframes slideUp {
      from { transform: translate(-50%, 100px); opacity: 0; }
      to { transform: translate(-50%, 0); opacity: 1; }
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }

    @media (max-width: 768px) {
      .ad-popup {
        width: 95%;
        flex-direction: column;
        align-items: flex-start;
      }

      .ad-popup i.main-icon {
        font-size: 40px;
      }

      .ad-popup .content h4 {
        font-size: 20px;
      }

      .ad-popup .content p {
        font-size: 15px;
      }
    }
  </style>

  <!-- AD CONTENT -->
  <div class="ad-popup" id="adPopup">
    <i class="fas fa-sim-card main-icon"></i>
    <div class="content">
      <h4>🔥 Weekly Data Deals on Monisharp!</h4>
      <p>
        📶 Every week you can grab amazing <span class="highlight">MTN Data</span>:<br>
        👉 <b>Plus Users</b> (Non-Students): <span class="highlight">1GB for ₦50</span><br>
        👉 <b>Students Package</b>: <span class="highlight">110MB for ₦10</span><br><br>
        ⏳ Hurry! Slots are limited.
      </p>
      <a href="data.html" class="cta-btn"><i class="fas fa-bolt"></i> Book Now</a>
    </div>
    <button class="close-btn" onclick="document.getElementById('adPopup').remove()">×</button>
  </div>
`;

// ==============================
// INJECT POPUP AFTER DELAY
// ==============================
setTimeout(() => {
  document.body.insertAdjacentHTML("beforeend", adPopupHTML);
}, 4000); // Show after 4 seconds