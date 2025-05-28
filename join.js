// Wait for page load to check profile and existing payment
window.addEventListener("DOMContentLoaded", () => {
  const id = localStorage.getItem("Id");
  const payQuizStatus = localStorage.getItem("payQuiz");

  // Check profile fields
  const bank = localStorage.getItem("bank");
  const accountName = localStorage.getItem("accountName");
  const accountNumber = localStorage.getItem("accountNumber");

  // Get button references
  const payTaskBtn = document.getElementById("payTask");
  const payBankBtn = document.getElementById("payBank");
  const proceedBtn = document.getElementById("proceedBtn");

  // If any profile data is missing, block access
  if (!bank || !accountName || !accountNumber) {
    console.log("❌ Incomplete profile detected. Disabling buttons.");
    showNotification("🚨 Please complete your profile (bank details) to proceed.", "error");

    // Disable all buttons
    if (payTaskBtn) payTaskBtn.disabled = true;
    if (payBankBtn) payBankBtn.disabled = true;
    if (proceedBtn) proceedBtn.disabled = true;
    return;
  }

  if (payQuizStatus === "present") {
    console.log("✅ User has already paid. Showing proceed button.");
    showProceedButton();
  } else {
    console.log("ℹ️ No previous payment. User must choose a payment method.");
  }

  // Proceed button click
  if (proceedBtn) {
    proceedBtn.addEventListener("click", () => {
      console.log("➡️ Proceed button clicked. Redirecting to quiz.html...");
      window.location.href = "quiz.html";
    });
  }
});

// Show styled notification
function showNotification(message, type) {
  const notification = document.getElementById("notification");
  notification.className = `alert ${type}`; // CSS should support 'alert success', 'alert error', etc.
  notification.textContent = message;
  notification.style.display = "block";
  console.log("🔔 Notification:", message);
}

// Show Proceed section and scroll
function showProceedButton() {
  const proceedSection = document.getElementById("proceedSection");
  proceedSection.classList.remove("hidden");
  proceedSection.scrollIntoView({ behavior: "smooth" });
}

// Task balance payment
document.getElementById("payTask").addEventListener("click", () => {
  const id = localStorage.getItem("Id");
  if (!id) {
    showNotification("User ID not found. Please log in again.", "error");
    console.log("❌ Missing user ID");
    return;
  }

  if (localStorage.getItem("payQuiz") === "present") {
    showNotification("✅ You've already paid. Proceed below.", "info");
    console.log("⚠️ Duplicate payment attempt blocked.");
    return;
  }

  const taskBalanceKey = `taskBalance_${id}`;
  const balanceStr = localStorage.getItem(taskBalanceKey);
  const currentBalance = parseFloat(balanceStr) || 0;

  console.log(`💰 Current balance for ${taskBalanceKey}: ₦${currentBalance}`);

  if (currentBalance >= 50) {
    const newBalance = currentBalance - 50;
    localStorage.setItem(taskBalanceKey, newBalance.toString());
    localStorage.setItem("payQuiz", "present");

    console.log("✅ ₦50 deducted. New balance:", newBalance);
    showNotification("₦50 deducted! ✅ You can now proceed to the quiz.", "success");

    setTimeout(() => {
      showProceedButton();
    }, 1500);
  } else {
    console.log("❌ Insufficient balance.");
    showNotification("❌ Insufficient balance. Please fund your task balance.", "error");
  }
});

// Bank payment redirect
document.getElementById("payBank").addEventListener("click", () => {
  console.log("➡️ Redirecting to bank payment page (quizDed.html)...");
  showNotification("Redirecting to bank payment page...", "info");
  setTimeout(() => {
    window.location.href = "quizDed.html";
  }, 1000);
});