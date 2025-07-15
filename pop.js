const adPopupHTML = `
  <style>
    .ad-popup {
      position: fixed;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #4e00c2, #8e2de2);
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

    .ad-popup i {
      font-size: 44px;
      animation: bounce 1.5s infinite;
      margin-top: 6px;
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

    .ad-popup .cta-btn {
      display: inline-block;
      padding: 10px 20px;
      background: #fff;
      color: #6e00ff;
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
      color: #6e00ff;
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

      .ad-popup i {
        font-size: 36px;
      }

      .ad-popup .content h4 {
        font-size: 20px;
      }

      .ad-popup .content p {
        font-size: 15px;
      }
    }
  </style>

  <div class="ad-popup" id="adPopup">
    <i class="fas fa-chart-line"></i>
    <div class="content">
      <h4>📈 Boost Your Socials Instantly</h4>
      <p>
        Get <strong>likes</strong>, <strong>followers</strong>, <strong>subscribers</strong>, and <strong>views</strong> for as low as <strong>₦4</strong>.<br>
        ⚡ Superfast delivery from <strong>just 1 hour</strong> to a maximum of <strong>5 days</strong>.<br>
        💡 100% automatic, reliable, and <strong>very affordable</strong>.<br>
        Say goodbye to waiting weeks — start seeing results today!
      </p>
      <a href="social.html" class="cta-btn"><i class="fas fa-rocket"></i> Boost Now</a>
    </div>
    <button class="close-btn" onclick="document.getElementById('adPopup').remove()">×</button>
  </div>
`;

setTimeout(() => {
  document.body.insertAdjacentHTML("beforeend", adPopupHTML);
}, 4000); // Show after 4 seconds