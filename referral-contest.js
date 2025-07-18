document.addEventListener("DOMContentLoaded", () => {
  const leaderboardData = [
    { name: "Samuel A.", referrals: 6 },
    { name: "Joy M.", referrals: 30 },
    { name: "Daniel O.", referrals: 20 },
    { name: "Happiness K.", referrals: 89},
    { name: "Nathan T.", referrals: 23 },
    { name: "Goodness D.", referrals: 41 }
  ];

  const container = document.getElementById("leaderboard-data");

  // Sort the array in descending order of referrals
  leaderboardData.sort((a, b) => b.referrals - a.referrals);

  leaderboardData.forEach(user => {
    const row = document.createElement("div");
    row.className = "table-row";

    const rewardAmount = user.referrals >= 5 ? user.referrals * 200 : 0;
    const reward = "₦" + rewardAmount;

    // Determine reward color based on amount
    let rewardColor = "#aaa"; // Default gray
    if (rewardAmount >= 4000) rewardColor = "#388e3c";       // Green
    else if (rewardAmount >= 2000) rewardColor = "#1976d2";  // Blue
    else if (rewardAmount >= 1000) rewardColor = "#f57c00";  // Orange

    row.innerHTML = `
      <span><i class="fas fa-user"></i> ${user.name}</span>
      <span><i class="fas fa-users"></i> ${user.referrals}</span>
      <span style="color: ${rewardColor}; font-weight: bold;">
        <i class="fas fa-coins"></i> ${reward}
      </span>
    `;
    container.appendChild(row);
  });

  const copyBtn = document.getElementById("copyBtn");
  const fbLink = document.getElementById("fb-link");
  const notification = document.getElementById("notification");

  copyBtn.addEventListener("click", () => {
    fbLink.select();
    document.execCommand("copy");

    notification.classList.remove("hidden");
    setTimeout(() => {
      notification.classList.add("hidden");
    }, 3000);
  });
});
