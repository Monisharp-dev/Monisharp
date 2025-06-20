// ✅ Helper function to check if user has paid
function isQuizPaid() {
  const status = localStorage.getItem("quizPay");
  return status === "present" || status === "0000A";
}

// ✅ Wait for page load to check profile and existing payment
window.addEventListener("DOMContentLoaded", () => {
  const id = localStorage.getItem("Id");

  // Profile fields
  const bank = localStorage.getItem("bank");
  const accountName = localStorage.getItem("accountName");
  const accountNumber = localStorage.getItem("accountNumber");

  // Buttons
  const payTaskBtn = document.getElementById("payTask");
  const payBankBtn = document.getElementById("payBank");
  const proceedBtn = document.getElementById("proceedBtn");

  // Incomplete profile = block access
  if (!bank || !accountName || !accountNumber) {
    console.log("❌ Incomplete profile detected. Disabling buttons.");
    showNotification("🚨 Please complete your profile (bank details) to proceed.", "error");
    if (payTaskBtn) payTaskBtn.disabled = true;
    if (payBankBtn) payBankBtn.disabled = true;
    if (proceedBtn) proceedBtn.disabled = true;
    return;
  }

  // ✅ User has already paid?
  if (isQuizPaid()) {
    console.log("✅ User has already paid. Showing proceed button.");
    showProceedButton();
  } else {
    console.log("ℹ️ No previous payment. User must choose a payment method.");
  }

  // Proceed click
  if (proceedBtn) {
    proceedBtn.addEventListener("click", () => {
      console.log("➡️ Proceed button clicked. Redirecting to quiz.html...");
      window.location.href = "quiz.html";
    });
  }
});

// ✅ Styled notification
function showNotification(message, type) {
  const notification = document.getElementById("notification");
  notification.className = `alert ${type}`;
  notification.textContent = message;
  notification.style.display = "block";
  console.log("🔔 Notification:", message);
}

// ✅ Show proceed section and disable both payment buttons
function showProceedButton() {
  const proceedSection = document.getElementById("proceedSection");
  proceedSection.classList.remove("hidden");
  proceedSection.scrollIntoView({ behavior: "smooth" });

  const payTaskBtn = document.getElementById("payTask");
  const payBankBtn = document.getElementById("payBank");

  if (payTaskBtn) payTaskBtn.disabled = true;
  if (payBankBtn) payBankBtn.disabled = true;

  console.log("✅ Payment buttons disabled after successful payment.");
}

// ✅ Task balance payment logic
document.getElementById("payTask").addEventListener("click", () => {
  const id = localStorage.getItem("Id");
  if (!id) {
    showNotification("User ID not found. Please log in again.", "error");
    console.log("❌ Missing user ID");
    return;
  }

  if (isQuizPaid()) {
    showNotification("✅ You've already paid. Proceed below.", "info");
    console.log("⚠️ Duplicate payment attempt blocked.");
    return;
  }

  const taskBalanceKey = `taskBalance_${id}`;
  const balanceStr = localStorage.getItem(taskBalanceKey);
  const currentBalance = parseFloat(balanceStr) || 0;

  console.log(`💰 Current Task Balance: ₦${currentBalance}`);

  if (currentBalance >= 50) {
    const newBalance = currentBalance - 50;
    localStorage.setItem(taskBalanceKey, newBalance.toString());
    localStorage.setItem("quizPay", "present");

    console.log("✅ ₦50 deducted from task balance.");
    showNotification("₦50 deducted from task balance! ✅ You can now proceed to the quiz.", "success");

    setTimeout(() => {
      showProceedButton();
    }, 1500);
  } else {
    showNotification("❌ Insufficient task balance.", "error");
  }
});

// ✅ Deposit balance payment logic
document.getElementById("payBank").addEventListener("click", () => {
  const id = localStorage.getItem("Id");
  if (!id) {
    showNotification("User ID not found. Please log in again.", "error");
    return;
  }

  if (isQuizPaid()) {
    showNotification("✅ You've already paid. Proceed below.", "info");
    return;
  }

  const depositKey = `depositBalance_${id}`;
  const balanceStr = localStorage.getItem(depositKey);
  const currentBalance = parseFloat(balanceStr) || 0;

  console.log(`💰 Current Deposit Balance: ₦${currentBalance}`);

  if (currentBalance >= 50) {
    const newBalance = currentBalance - 50;
    localStorage.setItem(depositKey, newBalance.toString());
    localStorage.setItem("quizPay", "present");

    console.log("✅ ₦50 deducted from deposit balance.");
    showNotification("₦50 deducted from deposit balance! ✅ You can now proceed to the quiz.", "success");

    setTimeout(() => {
      showProceedButton();
    }, 1500);
  } else {
    showNotification("❌ Insufficient deposit balance.", "error");
  }
});