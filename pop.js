const adPopupHTML = `
  <style>
    .ad-popup {
      position: fixed;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #00c6ff, #0072ff);
      color: white;
      width: 85%;
      max-width: 850px;
      padding: 25px 25px 20px;
      border-radius: 22px;
      box-shadow: 0 12px 30px rgba(0,0,0,0.25);
      z-index: 9999;
      display: flex;
      align-items: flex-start;
      gap: 18px;
      font-family: 'Segoe UI', sans-serif;
      animation: slideUp 0.6s ease forwards;
      flex-wrap: wrap;
    }

    .ad-popup i {
      font-size: 44px;
      animation: bounce 1.2s infinite;
      margin-top: 4px;
    }

    .ad-popup .content {
      flex: 1;
    }

    .ad-popup .content h4 {
      margin: 0 0 10px;
      font-size: 22px;
      font-weight: bold;
    }

    .ad-popup .content p {
      margin: 0 0 12px;
      font-size: 16px;
      line-height: 1.5;
    }

    .ad-popup .cta-btn {
      display: inline-block;
      padding: 10px 18px;
      background: white;
      color: #0072ff;
      font-weight: bold;
      border-radius: 8px;
      text-decoration: none;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      transition: transform 0.2s ease, background 0.3s;
    }

    .ad-popup .cta-btn:hover {
      background: #f0f0f0;
      transform: scale(1.05);
    }

    .ad-popup .close-btn {
      background: white;
      color: #0072ff;
      border: none;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      transition: background 0.2s;
    }

    .ad-popup .close-btn:hover {
      background: #ddd;
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
        width: 92%;
        flex-direction: column;
        align-items: flex-start;
      }

      .ad-popup i {
        font-size: 34px;
      }

      .ad-popup .content h4 {
        font-size: 18px;
      }

      .ad-popup .content p {
        font-size: 15px;
      }
    }
  </style>

  <div class="ad-popup" id="adPopup">
    <i class="fas fa-bullhorn"></i>
    <div class="content">
      <h4>🚀 Want to reach more people?</h4>
      <p>You can now <strong>advertise</strong> or <strong>create exciting tasks</strong> right here on our platform!<br>
      📲 Open the ☰ menu or click below to get started now.</p>
      <a href="Create Tasks.html" class="cta-btn"><i class="fas fa-plus-circle"></i> Create a Task</a>
    </div>
    <button class="close-btn" onclick="document.getElementById('adPopup').remove()">×</button>
  </div>
`;

setTimeout(() => {
  document.body.insertAdjacentHTML("beforeend", adPopupHTML);
}, 4000); // Show after 4 seconds