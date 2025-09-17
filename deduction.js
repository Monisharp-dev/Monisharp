document.addEventListener("DOMContentLoaded", () => {
  console.log("🔍 Checking localStorage for Id...");

  const userId = localStorage.getItem("Id");
  console.log("📦 Found Id:", userId);

  const deductionFlag = "deductionDone"; // ✅ Key to mark one-time deduction

  if (userId === "sisfathia120") {
    console.log("✅ Id matched: sisfathia120");

    if (!localStorage.getItem(deductionFlag)) {
      const gameKey = "gameBalance";
      let gameBalance = parseInt(localStorage.getItem(gameKey)) || 0;
      console.log("💰 Current gameBalance:", gameBalance);

      if (gameBalance >= 600) {
        gameBalance -= 600;
        localStorage.setItem(gameKey, gameBalance);
        localStorage.setItem(deductionFlag, "true"); // ✅ mark as deducted
        console.log("➖ Deducted 600 successfully (one-time).");
        console.log("💳 New gameBalance:", gameBalance);
      } else {
        console.log("❌ Insufficient balance. Deduction not possible.");
      }
    } else {
      console.log("⚠️ Deduction already done earlier. No further action.");
    }
  } else {
    console.log("❌ Id not found or does not match 'sisfathia120'.");
  }
});