document.addEventListener("DOMContentLoaded", () => {
  const taskBalanceEl = document.getElementById("taskBalance");
  if (!taskBalanceEl) return; // Exit if no display element

  const userId = localStorage.getItem("Id"); // Get the logged-in user's ID
  if (!userId) {
    taskBalanceEl.textContent = "₦0.00";
    return;
  }

  // Construct the user-specific task balance key
  const taskBalanceKey = `taskBalance_${userId}`;

  // Get task balance for this user
  const taskBalance = parseFloat(localStorage.getItem(taskBalanceKey)) || 0;

  // Display formatted balance
  taskBalanceEl.textContent = `₦${taskBalance.toLocaleString(undefined, {
    minimumFractionDigits: 2
  })}`;
});