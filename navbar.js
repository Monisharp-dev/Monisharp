const userId = localStorage.getItem("Id") || "Guest";
const profileImage = localStorage.getItem("profileImage") || "logo.png";

const badgeKeys = {
  dailyReward: "dailyRewardSeen",
  quickBrainNew: "quickBrainNewSeen",
  tapSeen: "tapseen",
  createTaskSeen: "createTaskSeen",
  referralSeen: "referralSeen",
  referralContestSeen: "referralContestSeen",
  claimCodeSeen: "claimCodeSeen",   // ✅ EXISTING
  dataCouponSeen: "dataCouponSeen", // ✅ NEW
  automaticTaskSeen: "automaticTaskSeen" // ✅ NEW
};

const badgeDurations = {
  dailyReward: 3,
  quickBrainNew: 5,
  tapSeen: 5,
  createTaskSeen: 5,
  referralSeen: 5,
  referralContestSeen: 5,
  claimCodeSeen: 5,   // ✅ EXISTING
  dataCouponSeen: 5,  // ✅ NEW
  automaticTaskSeen: 5 // ✅ NEW
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

// Badges
const referralBadge = shouldShowBadge(badgeKeys.referralSeen, badgeDurations.referralSeen) ? `<span class="new-badge">NEW</span>` : ``;
const referralContestBadge = shouldShowBadge(badgeKeys.referralContestSeen, badgeDurations.referralContestSeen) ? `<span class="new-badge">NEW</span>` : ``;
const createTaskBadge = shouldShowBadge(badgeKeys.createTaskSeen, badgeDurations.createTaskSeen) ? `<span class="new-badge">NEW</span>` : ``;
const dailyBadge = shouldShowBadge(badgeKeys.dailyReward, badgeDurations.dailyReward) ? `<span class="new-badge">NEW</span>` : ``;
const quickBrainBadge = shouldShowBadge(badgeKeys.quickBrainNew, badgeDurations.quickBrainNew) ? `<span class="new-badge">NEW</span>` : ``;
const tapBadge = shouldShowBadge(badgeKeys.tapSeen, badgeDurations.tapSeen) ? `<span class="new-badge">NEW</span>` : ``;
const claimCodeBadge = shouldShowBadge(badgeKeys.claimCodeSeen, badgeDurations.claimCodeSeen) ? `<span class="new-badge">NEW</span>` : ``;
const dataCouponBadge = shouldShowBadge(badgeKeys.dataCouponSeen, badgeDurations.dataCouponSeen) ? `<span class="new-badge">NEW</span>` : ``;
const automaticTaskBadge = shouldShowBadge(badgeKeys.automaticTaskSeen, badgeDurations.automaticTaskSeen) ? `<span class="new-badge">NEW</span>` : ``;

const navbarSidebarHTML = `
  <style>
    /* Modern "NEW" Badge */
    .new-badge {
      background: linear-gradient(135deg, #ff416c, #ff4b2b);
      color: #fff;
      font-size: 11px;
      font-weight: 600;
      padding: 2px 7px;
      margin-left: 6px;
      border-radius: 12px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      animation: pulse 1.2s infinite;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.1); opacity: 0.7; }
    }

    /* Sidebar */
    .sidebar {
      width: 270px;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(12px);
      border-right: 1px solid rgba(255,255,255,0.3);
      position: fixed;
      top: 0; left: 0; bottom: 0;
      transform: translateX(-100%);
      transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      box-shadow: 4px 0 15px rgba(0,0,0,0.1);
    }
    .sidebar.active { transform: translateX(0); }

    .sidebar .scrollable-content {
      overflow-y: auto;
      padding: 15px 0 25px;
      flex: 1;
    }

    .sidebar-section {
      margin: 18px 0 8px 20px;
      font-weight: 700;
      color: #444;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 1.2px;
      opacity: 0.7;
    }

    /* Nav Links */
    .nav-links a {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 20px;
      color: #222;
      text-decoration: none;
      font-size: 15px;
      font-weight: 500;
      border-radius: 8px;
      transition: all 0.25s ease;
    }
    .nav-links a i {
      font-size: 16px;
      color: #666;
      transition: color 0.25s ease;
    }
    .nav-links a:hover {
      background: linear-gradient(135deg, #74ebd5, #ACB6E5);
      color: #fff;
      transform: translateX(4px);
    }
    .nav-links a:hover i { color: #fff; }

    /* Profile */
    .profile {
      display: flex;
      align-items: center;
      padding: 18px 20px;
      border-bottom: 1px solid rgba(0,0,0,0.05);
      background: linear-gradient(135deg, #f6d365, #fda085);
    }
    .profile img {
      width: 55px;
      height: 55px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 12px;
      border: 2px solid rgba(255,255,255,0.7);
    }
    .profile strong {
      font-size: 15px;
      color: #222;
    }
    .profile .plan {
      font-size: 12px;
      color: #333;
      opacity: 0.8;
    }

    /* Navbar */
    .navbar {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 12px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
      font-size: 18px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .navbar .logo {
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .menu-icon {
      font-size: 24px;
      cursor: pointer;
      transition: transform 0.25s ease;
    }
    .menu-icon:hover { transform: rotate(90deg); }

    /* Overlay */
    .overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.5);
      backdrop-filter: blur(3px);
      display: none;
      z-index: 999;
    }
    .overlay.active { display: block; }
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
      <div class="sidebar-section">REFER & EARN</div>
      <nav class="nav-links">
        <a href="refer.html"><i class="fas fa-link"></i> Refer Friends ${referralBadge}</a>
      </nav>

      <div class="sidebar-section">TASK</div>
      <nav class="nav-links">
        <a href="Create Tasks.html"><i class="fas fa-plus-circle"></i> Create Task ${createTaskBadge}</a>
        <a href="ad history.html"><i class="fas fa-history"></i> Task Creation History ${createTaskBadge}</a>
        <a href="task.html"><i class="fas fa-tasks"></i> Task</a>
        <a href="automaticTask.html"><i class="fas fa-robot"></i> Automatic Tasks ${automaticTaskBadge}</a>
        <a href="Taskwithdrawal.html"><i class="fas fa-wallet"></i> Task Withdrawal</a>
        <a href="withdraw.html"><i class="fas fa-hand-holding-usd"></i> Withdraw</a>
        <a href="withdrawHistory.html"><i class="fas fa-history"></i> Withdrawal History</a>
      </nav>
      
      <div class="sidebar-section">REWARDS</div>
      <nav class="nav-links">
        <a href="claimCode.html"><i class="fas fa-gift"></i> Claim Code ${claimCodeBadge}</a>
        <a href="data.html"><i class="fas fa-sim-card"></i> Data Coupon ${dataCouponBadge}</a>
      </nav>

      <div class="sidebar-section">QUIZZES</div>
      <nav class="nav-links">
        <a href="intro.html"><i class="fas fa-brain"></i> What's QuickBrain Mini ${quickBrainBadge}</a>
        <a href="join.html"><i class="fas fa-sign-in-alt"></i> Join QuickBrain Mini ${quickBrainBadge}</a>
        <a href="leaderboard.html"><i class="fas fa-trophy"></i> Leaderboard ${quickBrainBadge}</a>
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
        <a href="info.html"><i class="fas fa-sign-out-alt"></i> Logout</a>
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