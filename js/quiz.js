// js/quiz.js (Firebase Version)

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC_lvF65P7vaKYnKEMrpHfJroMe-vh3w4U",
  authDomain: "quizapp-f370d.firebaseapp.com",
  projectId: "quizapp-f370d",
  storageBucket: "quizapp-f370d.firebasestorage.app",
  messagingSenderId: "822956185807",
  appId: "1:822956185807:web:3d2244d53f9bb61ec33fba"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const query = new URLSearchParams(window.location.search);
const code = query.get("code");
const studentName = sessionStorage.getItem("studentName") || "Anonymous";

let quizData;
let currentQ = 0;
let score = 0;
let timeLeft;
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
const leaderboardBody = document.getElementById("leaderboard-body");

studentInfo.textContent = studentName;

async function loadQuiz() {
  try {
    const quizSnap = await getDoc(doc(db, "quizzes", code));
    if (!quizSnap.exists()) {
      alert("Quiz not found");
      return;
    }
    quizData = quizSnap.data();
    titleBox.textContent = quizData.title;
    timeLeft = quizData.questions.length * 30; // 30 sec per question
    loadQuestion();
    startTimer();
  } catch (err) {
    console.error("Failed to load quiz", err);
    alert("Failed to load quiz");
  }
}

function loadQuestion() {
  const q = quizData.questions[currentQ];
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
  saveToLeaderboard();
  displayLeaderboard();
}

submitBtn.onclick = () => {
  const selected = [...answers].find(ans => ans.checked);
  if (!selected) return;

  const correct = quizData.questions[currentQ].correct;
  if (selected.id === correct) score++;

  currentQ++;
  if (currentQ < quizData.questions.length) {
    loadQuestion();
  } else {
    clearInterval(timerInterval);
    handleQuizEnd();
  }
};

finishBtn.onclick = () => {
  clearInterval(timerInterval);
  window.location.href = "student.html";
};

async function saveToLeaderboard() {
  const leaderboardRef = doc(db, "leaderboards", code);
  const existing = await getDoc(leaderboardRef);

  let entries = [];
  if (existing.exists()) {
    entries = existing.data().entries || [];
  }
  entries.push({ name: studentName, score });
  entries.sort((a, b) => b.score - a.score);

  await setDoc(leaderboardRef, { entries: entries.slice(0, 20) });
}

async function displayLeaderboard() {
  const leaderboardRef = doc(db, "leaderboards", code);
  const snap = await getDoc(leaderboardRef);
  leaderboardBody.innerHTML = "";
  if (!snap.exists()) return;

  const board = snap.data().entries || [];
  board.forEach((entry, index) => {
    leaderboardBody.innerHTML += `<tr><td>${index + 1}</td><td>${entry.name}</td><td>${entry.score}</td></tr>`;
  });
  document.getElementById("leaderboard").classList.remove("hidden");
}

loadQuiz();
