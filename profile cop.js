// Inject CSS dynamically
(function injectStyles() {
  const style = document.createElement("style");
  style.textContent = `
    /* Overlay covers entire screen and disables background interaction */
    #profileCopOverlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.45);
      z-index: 9998;
      pointer-events: auto; /* captures clicks to block background */
    }

    /* Notification box centered on screen */
    #profileCopNotify {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #4caf50, #2e7d32);
      color: white;
      padding: 30px 40px;
      border-radius: 15px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 20px;
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.3);
      z-index: 9999;
      max-width: 400px;
      text-align: center;
      animation: slideFadeIn 0.5s ease forwards;
    }

    #profileCopNotify a {
      color: #c8facc;
      font-weight: 600;
      text-decoration: underline;
      cursor: pointer;
      margin-left: 10px;
      transition: color 0.3s ease;
    }
    #profileCopNotify a:hover {
      color: #e0ffe5;
    }

    /* Simple slide and fade in animation */
    @keyframes slideFadeIn {
      0% {
        opacity: 0;
        transform: translate(-50%, -60%);
      }
      100% {
        opacity: 1;
        transform: translate(-50%, -50%);
      }
    }
  `;
  document.head.appendChild(style);
})();

function profileCopCheck() {
  const requiredFields = ["bank", "accountName", "accountNumber"];
  const missingFields = requiredFields.filter(field => !localStorage.getItem(field) || localStorage.getItem(field).trim() === "");

  if (missingFields.length > 0) {
    // Avoid duplicates
    if (document.getElementById("profileCopNotify")) return;

    // Create overlay to block background interaction
    const overlay = document.createElement("div");
    overlay.id = "profileCopOverlay";
    document.body.appendChild(overlay);

    // Create notification box
    const notifyBox = document.createElement("div");
    notifyBox.id = "profileCopNotify";
    notifyBox.innerHTML = `
      ⚠️ Your profile is incomplete.<br>
      Please 
      <a href="profile.html" id="updateProfileLink">click here to update your profile</a> 
      to proceed with any activity.
    `;
    document.body.appendChild(notifyBox);

    // Clicking the link removes notification and overlay (optional)
    document.getElementById("updateProfileLink").addEventListener("click", () => {
      notifyBox.remove();
      overlay.remove();
    });
  } else {
    // Clean up if profile is complete
    const existingNotify = document.getElementById("profileCopNotify");
    const existingOverlay = document.getElementById("profileCopOverlay");
    if (existingNotify) existingNotify.remove();
    if (existingOverlay) existingOverlay.remove();
  }
}

document.addEventListener("DOMContentLoaded", profileCopCheck);