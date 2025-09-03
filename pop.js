// ==============================
// HTML & STYLE FOR GAME POPUP
// ==============================
const gamePopupHTML = `
  <style>
    .game-popup {
      position: fixed;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #ff512f, #dd2476);
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

    .game-popup i.main-icon {
      font-size: 52px;
      animation: bounce 1.5s infinite;
      margin-top: 6px;
      color: #FFD700;
    }

    .game-popup .content {
      flex: 1;
    }

    .game-popup .content h4 {
      margin: 0 0 10px;
      font-size: 24px;
      font-weight: bold;
    }

    .game-popup .content p {
      margin: 0 0 14px;
      font-size: 16px;
      line-height: 1.6;
    }

    .game-popup .highlight {
      font-weight: bold;
      color: #00ffcc;
    }

    .game-popup .cta-btn {
      display: inline-block;
      padding: 10px 20px;
      background: #fff;
      color: #dd2476;
      font-weight: bold;
      border-radius: 10px;
      text-decoration: none;
      box-shadow: 0 5px 14px rgba(0,0,0,0.2);
      transition: transform 0.2s ease, background 0.3s;
    }

    .game-popup .cta-btn:hover {
      background: #f2f2f2;
      transform: scale(1.06);
    }

    .game-popup .close-btn {
      background: white;
      color: #dd2476;
      border: none;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
      transition: background 0.2s;
    }

    .game-popup .close-btn:hover {
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
      .game-popup {
        width: 95%;
        flex-direction: column;
        align-items: flex-start;
      }

      .game-popup i.main-icon {
        font-size: 44px;
      }

      .game-popup .content h4 {
        font-size: 20px;
      }

      .game-popup .content p {
        font-size: 15px;
      }
    }
  </style>

  <!-- GAME AWARENESS POPUP -->
  <div class="game-popup" id="gamePopup">
    <i class="fas fa-coins main-icon"></i>
    <div class="content">
      <h4>💥 New Tap Game is Here!</h4>
      <p>
        🕹️ Get <span class="highlight">50 seconds</span> to collect as many coins as possible.<br>
        💰 <span class="highlight">100 coins = ₦20 (Students)</span><br>
        💰 <span class="highlight">100 coins = ₦25 (Non-Students)</span><br><br>
        🚀 Avoid bombs, grab coins & cash out directly to your Game Balance!
      </p>
      <a href="tapGame.html" class="cta-btn"><i class="fas fa-play"></i> Try Free Today</a>
    </div>
    <button class="close-btn" onclick="document.getElementById('gamePopup').remove()">×</button>
  </div>
`;

// ==============================
// INJECT POPUP AFTER DELAY
// ==============================
setTimeout(() => {
  document.body.insertAdjacentHTML("beforeend", gamePopupHTML);
}, 4000); // Show after 4 seconds