// // js/quiz.js

// const query = new URLSearchParams(window.location.search);
// const code = query.get("code");
// const data = JSON.parse(localStorage.getItem("quiz_" + code));
// const studentName = sessionStorage.getItem("studentName") || "Anonymous";

// let currentQ = 0;
// let score = 0;

// const titleBox = document.getElementById("quizTitle");
// const questionBox = document.getElementById("question");
// const options = {
//   a: document.getElementById("a_text"),
//   b: document.getElementById("b_text"),
//   c: document.getElementById("c_text"),
//   d: document.getElementById("d_text")
// };
// const answers = document.querySelectorAll(".answer");
// const submitBtn = document.getElementById("submit");
// const finishBtn = document.getElementById("finish");

// titleBox.textContent = data.title;

// function loadQuestion() {
//   const q = data.questions[currentQ];
//   questionBox.textContent = q.question;
//   options.a.textContent = q.a;
//   options.b.textContent = q.b;
//   options.c.textContent = q.c;
//   options.d.textContent = q.d;
//   answers.forEach(ans => ans.checked = false);
// }
// loadQuestion();

// submitBtn.onclick = () => {
//   const selected = [...answers].find(ans => ans.checked);
//   if (!selected) return;

//   if (selected.id === data.questions[currentQ].correct) score++;

//   currentQ++;
//   if (currentQ < data.questions.length) {
//     loadQuestion();
//   } else {
//     document.getElementById("quiz-body").classList.add("hidden");
//     submitBtn.classList.add("hidden");
//     finishBtn.classList.remove("hidden");
//   }
// };

// finishBtn.onclick = () => {
//   saveToLeaderboard(code, studentName, score);
//   displayLeaderboard(code);
// };

// function saveToLeaderboard(code, name, score){
//   const key = `leaderboard_${code}`;
//   const board = JSON.parse(localStorage.getItem(key)) || [];
//   board.push({ name, score });
//   board.sort((a,b)=>b.score - a.score);
//   localStorage.setItem(key, JSON.stringify(board.slice(0, 20)));
// }

// function displayLeaderboard(code){
//   const key = `leaderboard_${code}`;
//   const board = JSON.parse(localStorage.getItem(key)) || [];
//   const tbody = document.getElementById("leaderboard-body");
//   tbody.innerHTML = "";
//   board.forEach((entry, index) => {
//     const row = `<tr><td>${index + 1}</td><td>${entry.name}</td><td>${entry.score}</td></tr>`;
//     tbody.innerHTML += row;
//   });
//   document.getElementById("leaderboard").classList.remove("hidden");
// }

// js/quiz.js

const query = new URLSearchParams(window.location.search);
const code = query.get("code");
const data = JSON.parse(localStorage.getItem("quiz_" + code));
const studentName = sessionStorage.getItem("studentName") || "Anonymous";

let currentQ = 0;
let score = 0;
let timePerQuestion = 30; // seconds per question
let questionTimer;
let quizEndTime = new Date(data.endAt).getTime();
const attemptKey = `attempt_${code}_${studentName}`;

// Prevent re-attempt
if (localStorage.getItem(attemptKey)) {
  alert("You have already attempted this quiz!");
  location.href = "student.html";
}

const titleBox = document.getElementById("quizTitle");
const questionBox = document.getElementById("question");
const questionNum = document.getElementById("questionNum");
const options = {
  a: document.getElementById("a_text"),
  b: document.getElementById("b_text"),
  c: document.getElementById("c_text"),
  d: document.getElementById("d_text")
};
const answers = document.querySelectorAll(".answer");
const submitBtn = document.getElementById("submit");
const finishBtn = document.getElementById("finish");
const timerBox = document.getElementById("timer");

titleBox.textContent = data.title;

function loadQuestion() {
  if (currentQ >= data.questions.length) return finishQuiz();

  const q = data.questions[currentQ];
  questionBox.textContent = q.question;
  questionNum.textContent = `Q${currentQ + 1} of ${data.questions.length}`;
  options.a.textContent = q.a;
  options.b.textContent = q.b;
  options.c.textContent = q.c;
  options.d.textContent = q.d;
  answers.forEach(ans => ans.checked = false);
  startQuestionTimer();
}

function startQuestionTimer() {
  clearInterval(questionTimer);
  let secondsLeft = timePerQuestion;
  timerBox.textContent = `⏰ Time left: ${secondsLeft}s`;

  questionTimer = setInterval(() => {
    secondsLeft--;
    timerBox.textContent = `⏰ Time left: ${secondsLeft}s`;
    if (secondsLeft <= 0) {
      clearInterval(questionTimer);
      nextQuestion();
    }
  }, 1000);
}

function nextQuestion() {
  currentQ++;
  if (currentQ < data.questions.length) {
    loadQuestion();
  } else {
    finishQuiz();
  }
}

function finishQuiz() {
  clearInterval(questionTimer);
  localStorage.setItem(attemptKey, true);
  document.getElementById("quiz-body").classList.add("hidden");
  submitBtn.classList.add("hidden");
  finishBtn.classList.remove("hidden");
  saveToLeaderboard(code, studentName, score);
  displayLeaderboard(code);
}

submitBtn.onclick = () => {
  const selected = [...answers].find(ans => ans.checked);
  if (!selected) return alert("Please select an answer.");

  const answer = selected.id;
  if (answer === data.questions[currentQ].correct) score++;

  nextQuestion();
};

finishBtn.onclick = () => {
  location.href = "student.html";
};

function saveToLeaderboard(code, name, score) {
  const key = `leaderboard_${code}`;
  const board = JSON.parse(localStorage.getItem(key)) || [];
  board.push({ name, score });
  board.sort((a, b) => b.score - a.score);
  localStorage.setItem(key, JSON.stringify(board.slice(0, 20)));
}

function displayLeaderboard(code) {
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

function checkQuizAvailability() {
  const now = Date.now();
  if (now < new Date(data.startAt).getTime()) {
    alert("Quiz hasn't started yet!");
    location.href = "student.html";
  } else if (now > quizEndTime) {
    alert("Quiz has expired.");
    location.href = "student.html";
  } else {
    loadQuestion();
  }
}

checkQuizAvailability();

