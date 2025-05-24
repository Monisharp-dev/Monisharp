// Get user info from localStorage
const userId = localStorage.getItem("Id") || "Guest";
const profileImage = localStorage.getItem("profileImage") || "logo.png";

// Badge logic
const newFeatureKey = "dailyRewardSeen";
const newFeatureDuration = 3; // days

function shouldShowNewBadge() {
  const seenDate = localStorage.getItem(newFeatureKey);
  if (!seenDate) {
    localStorage.setItem(newFeatureKey, new Date().toISOString());
    return true;
  }
  const seen = new Date(seenDate);
  const now = new Date();
  const diffDays = Math.floor((now - seen) / (1000 * 60 * 60 * 24));
  return diffDays < newFeatureDuration;
}

// Insert Navigation Bar, Sidebar, and Overlay into the DOM
const newBadge = shouldShowNewBadge() ? `<span class="new-badge">NEW</span>` : ``;

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
    <nav class="nav-links">
      <a href="index.html"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
      <a href="post.html"><i class="fas fa-bullhorn"></i> Sponsored Posts</a>
      <a href="task.html"><i class="fas fa-tasks"></i> Task</a>
      <a href="daily.html"><i class="fas fa-gift"></i> Daily Reward ${newBadge}</a>
      <a href="Taskwithdrawal.html"><i class="fas fa-wallet"></i> Task Withdrawal</a>
      <a href="withdraw.html"><i class="fas fa-hand-holding-usd"></i> Withdraw</a>
      <a href="withdrawHistory.html"><i class="fas fa-history"></i> Withdrawal History</a>
      <a href="seed.html"><i class="fas fa-seedling"></i> Plant a Seed</a>
      <a href="seedHarvest.html"><i class="fas fa-leaf"></i> Harvest</a>
      <a href="about.html"><i class="fas fa-envelope"></i> About Us</a>
      <a href="contact.html"><i class="fas fa-phone-alt"></i> Contact Us</a>
    </nav>
  </div>

  <div class="overlay" id="overlay" onclick="toggleSidebar()"></div>
`;

// Inject into the beginning of body
document.body.insertAdjacentHTML('afterbegin', navbarSidebarHTML);

// Sidebar toggle function
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  sidebar.classList.toggle("active");
  overlay.classList.toggle("active");
}