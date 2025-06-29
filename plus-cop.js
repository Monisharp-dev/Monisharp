
// Check if 'plusActivated' is NOT in localStorage
if (!localStorage.getItem("plusActivated")) {
  // Inject CSS styles
  const style = document.createElement("style");
  style.textContent = `
    .plus-overlay {
      position: fixed;
      inset: 0;
      background: linear-gradient(135deg, rgba(0,0,0,0.8), rgba(0,0,0,0.6)), url('https://www.transparenttextures.com/patterns/black-paper.png');
      backdrop-filter: blur(6px);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Segoe UI', sans-serif;
    }

    .plus-card {
      background: #fff;
      padding: 2rem 2.5rem;
      border-radius: 1rem;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      max-width: 400px;
      animation: fadeIn 0.6s ease-in-out;
    }

    .plus-card h2 {
      font-size: 1.5rem;
      color: #222;
      margin-bottom: 0.5rem;
    }

    .plus-card p {
      color: #555;
      font-size: 1rem;
      margin-bottom: 1.5rem;
    }

    .plus-card .cta-btn {
      background-color: #2563eb;
      color: white;
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      text-decoration: none;
      transition: background-color 0.3s ease;
    }

    .plus-card .cta-btn:hover {
      background-color: #1d4ed8;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }

    .plus-card .icon {
      font-size: 3rem;
      color: #f59e0b;
      margin-bottom: 1rem;
    }
  `;
  document.head.appendChild(style);

  // Inject HTML
  const overlay = document.createElement("div");
  overlay.className = "plus-overlay";
  overlay.innerHTML = `
    <div class="plus-card">
      <div class="icon">⚠️</div>
      <h2>Account Not Activated</h2>
      <p>Your account has not been activated.<br>Please click the button below to proceed with the activation payment of <strong>₦750</strong>.</p>
      <a href="plus-activate.html" class="cta-btn">Activate Now</a>
    </div>
  `;
  document.body.appendChild(overlay);
}

