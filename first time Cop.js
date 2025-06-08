// MoniSharp Account Verification Logic
const MoniSharpcurrentuserId = localStorage.getItem("Id");
const firstTime = localStorage.getItem("firstTime");
const isVerified = localStorage.getItem("verified");
const activateStatus = localStorage.getItem("activateStatus");

// Only proceed if activateStatus is present
if (activateStatus) {
  // Show verification notification if firstTime is present, Id exists, and verified is not set
  if (firstTime && MoniSharpcurrentuserId && !isVerified) {
    // Inject CSS for verification box
    const style = document.createElement("style");
    style.innerHTML = `
      .verify-overlay {
        position: fixed;
        top: 0; left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.75);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
      }

      .verify-box {
        background: #ffffff;
        padding: 35px 45px;
        max-width: 420px;
        border-radius: 20px;
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        text-align: center;
        animation: fadeIn 0.5s ease;
      }

      .verify-box h2 {
        font-size: 1.6rem;
        color: #2e7d32;
        margin-bottom: 15px;
      }

      .verify-box p {
        font-size: 1rem;
        color: #555;
        margin-bottom: 20px;
      }

      .verify-box a {
        display: inline-block;
        background: #2e7d32;
        color: #fff;
        padding: 12px 25px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: bold;
        transition: background 0.3s ease;
      }

      .verify-box a:hover {
        background: #1b5e20;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
    `;
    document.head.appendChild(style);

    // Inject HTML for verification popup
    const overlay = document.createElement("div");
    overlay.className = "verify-overlay";
    overlay.innerHTML = `
      <div class="verify-box">
        <h2>Account Verification Required</h2>
        <p>Please verify your account to continue using our services.</p>
        <a href="verification.html">Verify Now</a>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  // ==============================
  // Show Weekend Popup for Verified Users
  // ==============================
  if (isVerified) {
    const today = new Date();
    const day = today.getDay(); // Sunday = 0, Saturday = 6
    const isWeekend = (day === 0 || day === 6);
    const todayStr = today.toISOString().split("T")[0]; // Format: YYYY-MM-DD
    const weekendPopupDate = localStorage.getItem("weekendPopupDate");

    if (isWeekend && weekendPopupDate !== todayStr) {
      // Inject CSS for weekend popup
      const style2 = document.createElement("style");
      style2.innerHTML = `
        .weekend-popup {
          position: fixed;
          top: 0; left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10000;
        }
        .popup-box {
          background: white;
          padding: 30px 40px;
          border-radius: 16px;
          text-align: center;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
          font-family: 'Segoe UI', sans-serif;
          animation: fadeIn 0.4s ease;
        }
        .popup-box h2 {
          margin-bottom: 10px;
          font-size: 1.5rem;
          color: #1e88e5;
        }
        .popup-box p {
          margin-bottom: 20px;
          font-size: 1rem;
          color: #444;
        }
        .popup-box button {
          padding: 10px 20px;
          background: #1e88e5;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `;
      document.head.appendChild(style2);

      // Inject HTML for weekend popup
      const popup = document.createElement("div");
      popup.className = "weekend-popup";
      popup.innerHTML = `
        <div class="popup-box">
          <h2>🎉 Happy Weekend!</h2>
          <p>Don’t forget to check out our weekend bonuses and events!</p>
          <button onclick="redirectToVerification()">Got it</button>
        </div>
      `;
      document.body.appendChild(popup);

      // Mark as shown for today
      localStorage.setItem("weekendPopupDate", todayStr);

      // Redirect function
      window.redirectToVerification = function () {
        window.location.href = "verification.html";
      };
    }
  }
}