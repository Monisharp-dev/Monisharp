document.addEventListener("DOMContentLoaded", () => {
  const balanceKey = "plus-activityBalance";
  const deductionFlag = "plus-activityDeducted";

  console.log("=== Deduction Process Started ===");

  // Get balances
  let balance = parseInt(localStorage.getItem(balanceKey)) || 0;
  console.log("Current balance from localStorage:", balance);

  // Check if already deducted
  if (localStorage.getItem(deductionFlag)) {
    console.log("Deduction flag found → Already deducted before. Skipping...");
    console.log("=== Deduction Process Ended ===");
    return;
  }

  let deduction = 0;

  // Deduction rules (greater than or equal to)
  if (balance >= 11000) {
    deduction = 8000;
    console.log("Rule matched: ≥ ₦11,000 → Deduct ₦8,000");
  } else if (balance >= 10000) {
    deduction = 7000;
    console.log("Rule matched: ≥ ₦10,000 → Deduct ₦7,000");
  } else if (balance >= 9000) {
    deduction = 6000;
    console.log("Rule matched: ≥ ₦9,000 → Deduct ₦6,000");
  } else if (balance >= 8000) {
    deduction = 5000;
    console.log("Rule matched: ≥ ₦8,000 → Deduct ₦5,000");
  } else if (balance >= 7000) {
    deduction = 4000;
    console.log("Rule matched: ≥ ₦7,000 → Deduct ₦4,000");
  } else if (balance >= 6000) {
    deduction = 3000;
    console.log("Rule matched: ≥ ₦6,000 → Deduct ₦3,000");
  } else if (balance >= 5000) {
    deduction = 2000;
    console.log("Rule matched: ≥ ₦5,000 → Deduct ₦2,000");
  } else if (balance >= 4000) {
    deduction = 1000;
    console.log("Rule matched: ≥ ₦4,000 → Deduct ₦1,000");
  } else {
    console.log("No matching rule for balance:", balance);
  }

  // Apply deduction if valid
  if (deduction > 0 && balance >= deduction) {
    const newBalance = balance - deduction;
    localStorage.setItem(balanceKey, newBalance);
    localStorage.setItem(deductionFlag, "true"); // prevent future runs
    console.log(`Deduction applied successfully! -₦${deduction}`);
    console.log("New balance saved:", newBalance);
    console.log("Deduction flag set → Process will not run again.");
  } else {
    console.log("No deduction applied (either rule not matched or balance too low).");
  }

  console.log("=== Deduction Process Ended ===");
});