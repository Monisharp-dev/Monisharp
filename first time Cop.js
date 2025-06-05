// MoniSharp Account Verification Logic
const MoniSharpcurrentuserId = localStorage.getItem("Id");
const firstTime = localStorage.getItem("firstTime");
const isVerified = localStorage.getItem("verified");
const activateStatus = localStorage.getItem("activateStatus");

// Only proceed if activateStatus is present
if (activateStatus) {
  // Show notification only if firstTime is present, Id exists, and verified is not set
  if (firstTime && MoniSharpcurrentuserId && !isVerified) {
    // Inject CSS
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

    // Inject HTML
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
}