// Get user info from localStorage
const userId = localStorage.getItem("Id") || "Guest";
const profileImage = localStorage.getItem("profileImage") || "logo.png";

// Insert Navigation Bar, Sidebar, and Overlay into the DOM
const navbarSidebarHTML = `
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
      <a href="Taskwithdrawal.html"><i class="fas fa-wallet"></i> Task Withdrawal</a>
      <a href="withdraw.html"><i class="fas fa-hand-holding-usd"></i> Withdraw</a>
      <a href="withdrawHistory.html"><i class="fas fa-history"></i> Withdrawal History</a>
      <a href="seed.html"><i class="fas fa-seedling"></i> Plant a Seed</a> <!-- New Menu -->
      <a href="seedHarvest.html"><i class="fas fa-leaf"></i> Harvest</a> <!-- New Menu -->
      <a href="about.html"><i class="fas fa-envelope"></i> About Us</a>
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