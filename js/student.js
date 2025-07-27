// js/student.js (Firebase Version)

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc
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

const startBtn = document.getElementById("startBtn");
const codeErr = document.getElementById("codeErr");

startBtn.addEventListener("click", async () => {
  const name = document.getElementById("name").value.trim();
  const code = document.getElementById("code").value.trim().toUpperCase();

  if (name === "" || code === "") {
  codeErr.textContent = "Enter your name and quiz code.";
  return;
}

  try {
    const quizRef = doc(db, "quizzes", code);
    const quizSnap = await getDoc(quizRef);

    if (!quizSnap.exists()) {
      codeErr.textContent = "Quiz not found – check the code!";
      return;
    }

    const quiz = quizSnap.data();
    const now = Date.now();
    const open = new Date(quiz.startAt).getTime();
    const close = new Date(quiz.endAt).getTime();

    if (now < open) {
      codeErr.textContent = `Quiz opens at ${new Date(open).toLocaleString()}`;
    } else if (now > close) {
      codeErr.textContent = `Quiz closed on ${new Date(close).toLocaleString()}`;
    } else {
      sessionStorage.setItem("studentName", name);
      sessionStorage.setItem("quizCode", code);
      location.href = `quiz.html?code=${code}`;
    }
  } catch (error) {
    console.error("Error checking quiz:", error);
    codeErr.textContent = "Something went wrong. Please try again later.";
  }
});
