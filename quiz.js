const questions = [
  {
    question: "What is the largest ocean on Earth?",
    choices: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"],
    answer: "Pacific Ocean"
  },
  {
    question: "Who developed the theory of relativity?",
    choices: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Nikola Tesla"],
    answer: "Albert Einstein"
  },
  {
    question: "What is the currency of Japan?",
    choices: ["Yen", "Won", "Peso", "Ringgit"],
    answer: "Yen"
  },
  {
    question: "Which element has the chemical symbol 'O'?",
    choices: ["Osmium", "Oxygen", "Oganesson", "Oxide"],
    answer: "Oxygen"
  },
  {
    question: "Which continent is the Sahara Desert located in?",
    choices: ["Asia", "Africa", "Australia", "South America"],
    answer: "Africa"
  }
];

let currentQuestion = 0;
let score = 0;
let timer;
let totalSeconds = 0;
let timeLeft = 30;

const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const nextBtn = document.getElementById("nextBtn");
const resultBox = document.getElementById("result-box");
const finalScore = document.getElementById("final-score");

function startQuiz() {
  console.log("Quiz started");
  showQuestion();
  startTimer();
}

function showQuestion() {
  nextBtn.disabled = true;
  const q = questions[currentQuestion];
  questionEl.textContent = q.question;
  choicesEl.innerHTML = "";

  q.choices.forEach(choice => {
    const li = document.createElement("li");
    li.textContent = choice;
    li.onclick = () => selectAnswer(li, q.answer);
    choicesEl.appendChild(li);
  });
}

function selectAnswer(li, correct) {
  const selected = li.textContent;
  if (selected === correct) {
    score += 10;
    scoreEl.textContent = score;
    li.classList.add("correct");
  } else {
    li.classList.add("wrong");
  }

  Array.from(choicesEl.children).forEach(child => child.onclick = null);
  nextBtn.disabled = false;
}

function startTimer() {
  timeLeft = 30 * questions.length;
  totalSeconds = 0;

  timer = setInterval(() => {
    timeLeft--;
    totalSeconds++;
    timerEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      endQuiz();
    }
  }, 1000);
}

nextBtn.onclick = () => {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
};

function endQuiz() {
  clearInterval(timer);
  document.getElementById("quiz-box").classList.add("hidden");
  resultBox.classList.remove("hidden");
  finalScore.textContent = score;

  const data = {
    Id: localStorage.getItem("Id") || "Anonymous",
    name: localStorage.getItem("firstName") || "User",
    score: score,
    time: totalSeconds + "s",
    bank: localStorage.getItem("bank") || "Unknown",
    accountName: localStorage.getItem("accountName") || "Unknown",
    accountNumber: localStorage.getItem("accountNumber") || "Unknown",
    dateSubmitted: new Date().toLocaleDateString()
  };

  sendDataToSheetDB(data);
}

function showLoader() {
  const loader = document.getElementById("overlay-loader");
  if (loader) loader.classList.remove("hidden");
}

function hideLoader() {
  const loader = document.getElementById("overlay-loader");
  if (loader) loader.classList.add("hidden");
}

function sendDataToSheetDB(data, retries = 3) {
  showLoader();

  fetch("https://sheetdb.io/api/v1/g8xwcmnmohv57", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data })
  })
    .then(response => {
      if (!response.ok) throw new Error("Failed to submit");
      return response.json();
    })
    .then(json => {
      hideLoader();
      localStorage.removeItem("quizPay");
      showNotification("🎉 Score submitted successfully!", "success");
      setTimeout(() => {
        window.location.href = "thankyou.html";
      }, 3000);
    })
    .catch(error => {
      console.error("Error submitting:", error);
      if (retries > 0) {
        setTimeout(() => sendDataToSheetDB(data, retries - 1), 1000);
      } else {
        hideLoader();
        showNotification("❌ Failed to submit after retries.", "error");
      }
    });
}

function showNotification(message, type = "info", duration = 4000) {
  const notifyBox = document.getElementById("notify");
  notifyBox.textContent = message;
  notifyBox.className = `alert ${type}`;
  notifyBox.classList.remove("hidden");

  setTimeout(() => {
    notifyBox.classList.add("hidden");
  }, duration);
}

startQuiz();
