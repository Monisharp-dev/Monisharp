// === Welcome Notification Box JS (All-in-One) ===

(function () {
  // Inject full CSS styles
  const style = document.createElement("style");
  style.textContent = `
    #welcome-notification {
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #00b894, #0984e3);
      color: white;
      border-radius: 14px;
      box-shadow: 0 8px 20px rgba(0,0,0,0.25);
      padding: 16px 20px;
      display: flex;
      align-items: flex-start;
      z-index: 9999;
      max-width: 340px;
      animation: fadeIn 0.4s ease;
      font-family: 'Segoe UI', sans-serif;
      line-height: 1.4;
    }

    #welcome-notification .notif-icon {
      font-size: 22px;
      margin-right: 12px;
      margin-top: 4px;
    }

    #welcome-notification .notif-content {
      flex: 1;
      font-size: 15px;
    }

    #welcome-notification .notif-close {
      font-size: 22px;
      margin-left: 12px;
      cursor: pointer;
      font-weight: bold;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-15px); }
      to { opacity: 1; transform: translateY(0); }
    }

    #welcome-notification a {
      color: #fff;
      text-decoration: underline;
      font-weight: bold;
    }
  `;
  document.head.appendChild(style);

  // Function to show the notification box
  window.showWelcomeNotification = function (htmlContent, duration = 8000) {
    // Remove existing notification
    const existing = document.getElementById("welcome-notification");
    if (existing) existing.remove();

    // Create container
    const box = document.createElement("div");
    box.id = "welcome-notification";
    box.innerHTML = `
      <div class="notif-icon"><i class="fas fa-bullhorn"></i></div>
      <div class="notif-content">${htmlContent}</div>
      <div class="notif-close" onclick="this.parentElement.remove()">&times;</div>
    `;
    document.body.appendChild(box);

    // Auto-dismiss
    setTimeout(() => {
      box.remove();
    }, duration);
  };

  // Load Font Awesome if not already loaded
  if (!document.querySelector('link[href*="font-awesome"]')) {
    const fa = document.createElement("link");
    fa.rel = "stylesheet";
    fa.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
    document.head.appendChild(fa);
  }
})();
showWelcomeNotification(`
  <strong>🎉 Welcome Back!</strong><br>
  New Tasks have been added ✅. Go to <a href="task.html"> TASK PAGE</a> and perfom tasks 🤸</strong>!
`);