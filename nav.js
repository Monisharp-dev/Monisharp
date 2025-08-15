// Detect homepage and set dynamic navbar color
const homepageFile = "plus-index.html"; // homepage file name
let navBgColor = "#1e293b"; // default navbar color

if (window.location.pathname.split("/").pop() === homepageFile) {
  const bodyBg = window.getComputedStyle(document.body).backgroundColor;
  if (bodyBg && bodyBg !== "rgba(0, 0, 0, 0)" && bodyBg !== "transparent") {
    navBgColor = bodyBg;
  }
}

// Inject NAVBAR CSS
const navStyle = document.createElement("style");
navStyle.innerHTML = `
  :root {
    --accent: #10b981;
    --bg: ${navBgColor};
    --text: #cbd5e1;
    --active-bg: #0f172a;
  }

  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: var(--bg);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 30px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    z-index: 9999;
    animation: slideDown 0.4s ease;
  }

  .nav-brand {
    font-size: 1.4em;
    font-weight: bold;
    color: var(--accent);
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .nav-toggle {
    display: none;
    flex-direction: column;
    cursor: pointer;
    gap: 5px;
    position: relative;
  }

  .nav-toggle span {
    width: 24px;
    height: 3px;
    background: var(--text);
    border-radius: 3px;
  }

  .nav-links {
    display: flex;
    gap: 25px;
  }

  .nav-links a {
    color: var(--text);
    text-decoration: none;
    font-size: 0.95em;
    position: relative;
    transition: color 0.3s ease;
    padding: 5px 10px;
    border-radius: 6px;
  }

  .nav-links a::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -6px;
    width: 0%;
    height: 2px;
    background: var(--accent);
    transition: width 0.3s ease;
  }

  .nav-links a:hover {
    color: #fff;
  }

  .nav-links a:hover::after {
    width: 100%;
  }

  .nav-links a.active {
    background-color: var(--active-bg);
    color: #ffffff;
    font-weight: bold;
  }

  @media (max-width: 768px) {
    .nav-toggle {
      display: flex;
    }

    .nav-links {
      display: none;
      position: absolute;
      top: 60px;
      right: 20px;
      flex-direction: column;
      background: #0f172a;
      border: 1px solid #334155;
      padding: 16px;
      border-radius: 10px;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
      animation: fadeIn 0.3s ease-out;
    }

    .nav-links.show {
      display: flex;
    }

    .nav-links a {
      padding: 10px;
    }
  }

  /* Tooltip styling */
  .tooltip {
    position: absolute;
    top: 40px;
    right: 0;
    background: #fff;
    color: #333;
    padding: 10px 14px;
    font-size: 0.9em;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    animation: fadeIn 0.4s ease-out;
    z-index: 10000;
    max-width: 180px;
    text-align: center;
    font-weight: 500;
  }

  .tooltip::after {
    content: "";
    position: absolute;
    top: -6px;
    right: 12px;
    border-width: 6px;
    border-style: solid;
    border-color: transparent transparent #fff transparent;
  }

  @keyframes slideDown {
    from { transform: translateY(-100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }

  body {
    padding-top: 70px !important;
  }
`;
document.head.appendChild(navStyle);

// Inject NAVBAR HTML
const navBar = document.createElement("div");
navBar.className = "navbar";
navBar.innerHTML = `
  <div class="nav-brand">
    <i class="fas fa-bolt"></i> MoniSharp
  </div>

  <div class="nav-toggle" id="navToggle">
    <span></span>
    <span></span>
    <span></span>
  </div>

  <div class="nav-links" id="navLinks">
    <a href="plus-index.html">🏠 Dashboard</a>
    <a href="plus-daily.html">🎁 Claim Daily Reward</a>
    <a href="plus-task.html">📝 Tasks</a>
    <a href="plus-referral.html">👥 Referrals</a>
    <a href="plus-deposit.html">💳 Deposit</a>
    <a href="plus-withdrawal.html">💸 Withdraw</a>
    <a href="info.html">🚪 Logout</a> 
  </div>
`;
document.body.prepend(navBar);

// Hamburger toggle logic & tooltip
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  toggle.addEventListener("click", () => {
    links.classList.toggle("show");
  });

  // Highlight active link
  const currentPage = window.location.pathname.split("/").pop();
  document.querySelectorAll(".nav-links a").forEach(link => {
    if (link.getAttribute("href").split("/").pop() === currentPage) {
      link.classList.add("active");
    }
  });

  // Show tooltip only once
  if (!localStorage.getItem("navTooltipShown")) {
    const tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    tooltip.textContent = "💡 Tip: Tap here to see more features!";
    toggle.appendChild(tooltip);

    const hideTooltip = () => {
      tooltip.remove();
      localStorage.setItem("navTooltipShown", "true");
      document.removeEventListener("click", hideTooltip);
    };

    setTimeout(() => {
      document.addEventListener("click", hideTooltip);
    }, 100); // Slight delay to avoid instant close
  }
});
