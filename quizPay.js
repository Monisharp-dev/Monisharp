// ✅ List of valid Ids
const validIds = ["idrisamuda06", "edickson774"]; // Expand as needed

// ✅ Use var to avoid redeclaration issues
var currentUserId = localStorage.getItem("Id");

// ✅ Get attempt count safely
var quizPayAttempts = parseInt(localStorage.getItem("quizPayAttempts")) || 0;

// ✅ Logic to add quizPay
if (validIds.includes(currentUserId)) {
    if (quizPayAttempts < 2 && !localStorage.getItem("quizPay")) {
        localStorage.setItem("quizPay", "0000A");
        quizPayAttempts += 1;
        localStorage.setItem("quizPayAttempts", quizPayAttempts.toString());
        console.log(`✅ quizPay set. Attempt ${quizPayAttempts}/2.`);
    } else if (quizPayAttempts >= 2) {
        console.log("❌ Limit reached. quizPay cannot be set again.");
    } else {
        console.log("ℹ️ quizPay already exists.");
    }
} else {
    console.log("⚠️ Unrecognized or missing user Id.");
}