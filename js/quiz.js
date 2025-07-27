const query = new URLSearchParams(window.location.search);
const code = query.get("code");
const data = JSON.parse(localStorage.getItem("quiz_" + code));
const studentName = sessionStorage.getItem("studentName") || "Anonymous";

let currentQ = 0;
let score = 0;
let timeLeft = 2 * 60; // 2 minutes in seconds
let timerInterval;

const titleBox = document.getElementById("quizTitle");
const questionBox = document.getElementById("question");
const options = {
  a: document.getElementById("a_text"),
  b: document.getElementById("b_text"),
  c: document.getElementById("c_text"),
  d: document.getElementById("d_text")
};
const answers = document.querySelectorAll(".answer");
const submitBtn = document.getElementById("submit");
const finishBtn = document.getElementById("finish");
const timerDisplay = document.getElementById("timer");
const studentInfo = document.getElementById("windowInfo");

titleBox.textContent = data.title;
studentInfo.textContent = studentName;

function loadQuestion() {
  const q = data.questions[currentQ];
  questionBox.textContent = q.question;
  options.a.textContent = q.a;
  options.b.textContent = q.b;
  options.c.textContent = q.c;
  options.d.textContent = q.d;
  answers.forEach(ans => ans.checked = false);
}

function startTimer() {
  timerInterval = setInterval(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `Time left: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    timeLeft--;

    if (timeLeft < 0) {
      clearInterval(timerInterval);
      handleQuizEnd();
      alert("⏰ Time's up!");
    }
  }, 1000);
}

function handleQuizEnd() {
  document.getElementById("quiz-body").classList.add("hidden");
  submitBtn.classList.add("hidden");
  finishBtn.classList.remove("hidden");

  saveToLeaderboard(code, studentName, score);
  displayLeaderboard(code);
}

submitBtn.onclick = () => {
  const selected = [...answers].find(ans => ans.checked);
  if (!selected) return;

  if (selected.id === data.questions[currentQ].correct) score++;

  currentQ++;
  if (currentQ < data.questions.length) {
    loadQuestion();
  } else {
    clearInterval(timerInterval);
    handleQuizEnd();
  }
};

finishBtn.onclick = () => {
  clearInterval(timerInterval);
  saveToLeaderboard(code, studentName, score);
  window.location.href = "student.html"; // 👈 Update this with your actual dashboard file path
};

function saveToLeaderboard(code, name, score){
  const key = `leaderboard_${code}`;
  const board = JSON.parse(localStorage.getItem(key)) || [];
  board.push({ name, score });
  board.sort((a,b) => b.score - a.score);
  localStorage.setItem(key, JSON.stringify(board.slice(0, 20)));
}

function displayLeaderboard(code){
  const key = `leaderboard_${code}`;
  const board = JSON.parse(localStorage.getItem(key)) || [];
  const tbody = document.getElementById("leaderboard-body");
  tbody.innerHTML = "";
  board.forEach((entry, index) => {
    const row = `<tr><td>${index + 1}</td><td>${entry.name}</td><td>${entry.score}</td></tr>`;
    tbody.innerHTML += row;
  });
  document.getElementById("leaderboard").classList.remove("hidden");
}

// Init
loadQuestion();
startTimer();
