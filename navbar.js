const userId = localStorage.getItem("Id") || "Guest";
const profileImage = localStorage.getItem("profileImage") || "logo.png";

const badgeKeys = {
  dailyReward: "dailyRewardSeen",
  quickBrainNew: "quickBrainNewSeen",
  tapSeen: "tapseen",
  createTaskSeen: "createTaskSeen", // ✅ NEW
};

const badgeDurations = {
  dailyReward: 3,
  quickBrainNew: 5,
  tapSeen: 5,
  createTaskSeen: 5, // ✅ NEW
};

function shouldShowBadge(key, duration) {
  const seenDate = localStorage.getItem(key);
  if (!seenDate) {
    localStorage.setItem(key, new Date().toISOString());
    return true;
  }
  const seen = new Date(seenDate);
  const now = new Date();
  const diffDays = Math.floor((now - seen) / (1000 * 60 * 60 * 24));
  return diffDays < duration;
}


const createTaskBadge = shouldShowBadge(badgeKeys.createTaskSeen, badgeDurations.createTaskSeen)
  ? `<span class="new-badge">NEW</span>`
  : ``;


const dailyBadge = shouldShowBadge(badgeKeys.dailyReward, badgeDurations.dailyReward)
  ? `<span class="new-badge">NEW</span>`
  : ``;

const quickBrainBadge = shouldShowBadge(badgeKeys.quickBrainNew, badgeDurations.quickBrainNew)
  ? `<span class="new-badge">NEW</span>`
  : ``;

const tapBadge = shouldShowBadge(badgeKeys.tapSeen, badgeDurations.tapSeen)
  ? `<span class="new-badge">NEW</span>`
  : ``;

const navbarSidebarHTML = `
  <style>
    .new-badge {
      background: red;
      color: white;
      font-size: 10px;
      font-weight: bold;
      padding: 2px 6px;
      margin-left: 6px;
      border-radius: 8px;
      animation: pulse 1s infinite;
    }
    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.4; }
      100% { opacity: 1; }
    }

    .sidebar {
      width: 250px;
      background: #fff;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      transform: translateX(-100%);
      transition: transform 0.3s ease;
      z-index: 1000;
      box-shadow: 2px 0 5px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
    }

    .sidebar.active {
      transform: translateX(0);
    }

    .sidebar .scrollable-content {
      overflow-y: auto;
      max-height: 50vh;
      padding-bottom: 20px;
    }

    .sidebar-section {
      margin: 20px 0 10px 15px;
      font-weight: bold;
      color: #555;
      text-transform: uppercase;
      font-size: 12px;
      letter-spacing: 1px;
    }

    .nav-links a {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 15px;
      color: #222;
      text-decoration: none;
      font-size: 14px;
      border-radius: 4px;
      transition: background 0.2s;
    }

    .nav-links a:hover {
      background: #f0f0f0;
    }

    .profile {
      display: flex;
      align-items: center;
      padding: 10px 15px;
    }

    .profile img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 10px;
    }

    .navbar {
      background: white;
      color: #222;
      padding: 10px 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #ccc;
    }

    .menu-icon {
      font-size: 22px;
      cursor: pointer;
    }

    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.4);
      display: none;
      z-index: 999;
    }

    .overlay.active {
      display: block;
    }
  </style>

  <header class="navbar">
    <div class="logo"><b>MONI<i>SHARP</i></b></div>
    <div class="menu-icon" onclick="toggleSidebar()">☰</div>
  </header>

  <div class="sidebar" id="sidebar">
    <div class="profile">
      <img src="${profileImage}" alt="Avatar" />
      <div>
        <strong>@${userId}</strong><br />
        <span class="plan">Valid User</span>
      </div>
    </div>

    <div class="scrollable-content">
      <div class="sidebar-section">TASK</div>
      <nav class="nav-links">
          <a href="createTask.html"><i class="fas fa-plus-circle"></i> Create Task ${createTaskBadge}</a>
          <a href="ad history.html"><i class="fas fa-history"></i> Task Creation History ${createTaskBadge}</a>
        <a href="task.html"><i class="fas fa-tasks"></i> Task</a>
        <a href="Taskwithdrawal.html"><i class="fas fa-wallet"></i> Task Withdrawal</a>
        <a href="withdraw.html"><i class="fas fa-hand-holding-usd"></i> Withdraw</a>
        <a href="withdrawHistory.html"><i class="fas fa-history"></i> Withdrawal History</a>
      </nav>

      <div class="sidebar-section">QUIZZES</div>
      <nav class="nav-links">
        <a href="intro.html"><i class="fas fa-brain"></i> What's QuickBrain Mini ${quickBrainBadge}</a>
        <a href="join.html"><i class="fas fa-sign-in-alt"></i> Join QuickBrain Mini ${quickBrainBadge}</a>
        <a href="leaderboard.html"><i class="fas fa-trophy"></i> Leaderboard ${quickBrainBadge}</a>
      </nav>

      <div class="sidebar-section">TAP TO EARN</div>
      <nav class="nav-links">
        <a href="taptaptapintro.html"><i class="fas fa-play-circle"></i> Tap Intro ${tapBadge}</a>
        <a href="shop.html"><i class="fas fa-store"></i> Tap Shop ${tapBadge}</a>
        <a href="tap winners.html"><i class="fas fa-users"></i> Tap Game Scoreboard</a>
      </nav>

      <div class="sidebar-section">GAMES</div>
      <nav class="nav-links">
        <a href="wheelspin.html"><i class="fas fa-bullseye"></i> Spin & Win Game</a>
      </nav>

      <div class="sidebar-section">INFORMATION</div>
      <nav class="nav-links">
        <a href="howtoearn.html"><i class="fas fa-coins"></i> How to Earn ${quickBrainBadge}</a>
        <a href="about.html"><i class="fas fa-envelope"></i> About Us</a>
        <a href="contact.html"><i class="fas fa-phone-alt"></i> Contact Us</a>
        <a href="Help.html"><i class="fas fa-question-circle"></i> Help</a>
      </nav>
    </div>
  </div>

  <div class="overlay" id="overlay" onclick="toggleSidebar()"></div>
`;

document.body.insertAdjacentHTML("afterbegin", navbarSidebarHTML);

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  sidebar.classList.toggle("active");
  overlay.classList.toggle("active");
}
// Inject tooltip style
const tooltipStyle = document.createElement("style");
tooltipStyle.textContent = `
  .menu-tooltip {
    position: absolute;
    background: #111;
    color: #fff;
    font-size: 12px;
    padding: 6px 10px;
    border-radius: 6px;
    box-shadow: 0 3px 8px rgba(0,0,0,0.2);
    z-index: 2000;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }
  .menu-tooltip.show {
    opacity: 1;
  }
`;
document.head.appendChild(tooltipStyle);

// Inject tooltip element into the DOM
const tooltipDiv = document.createElement("div");
tooltipDiv.id = "menu-tooltip";
tooltipDiv.className = "menu-tooltip";
tooltipDiv.innerText = "Tap this ☰ Menu to explore features!";
document.body.appendChild(tooltipDiv);

// Function to show tooltip
function showTooltip() {
  const menuIcon = document.querySelector(".menu-icon");
  const tooltip = document.getElementById("menu-tooltip");

  if (!menuIcon || !tooltip) return;

  const rect = menuIcon.getBoundingClientRect();
  tooltip.style.top = `${rect.bottom + 10 + window.scrollY}px`;
  tooltip.style.left = `${rect.left + rect.width / 2 - 60}px`; // center tooltip
  tooltip.classList.add("show");

  setTimeout(() => {
    tooltip.classList.remove("show");
  }, 3000); // show for 3 seconds
}

// Show the tooltip every 30 seconds
const tooltipInterval = setInterval(showTooltip, 30000);

// Also show it immediately once after 1 second
setTimeout(showTooltip, 1000);
