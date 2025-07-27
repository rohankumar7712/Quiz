// js/admin.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getFirestore, collection, doc, setDoc, getDoc, getDocs,
  deleteDoc, updateDoc
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

// Admin login
document.getElementById("loginBtn").onclick = function () {
  const user = document.getElementById("user").value.trim();
  const pass = document.getElementById("pass").value.trim();
  const errBox = document.getElementById("loginErr");

  if (user === "admin" && pass === "admin123") {
    document.getElementById("loginBox").classList.add("hidden");
    document.getElementById("builder").classList.remove("hidden");
    document.getElementById("history").classList.remove("hidden");
  } else {
    errBox.textContent = "Invalid username or password!";
  }
};

// Add a new empty question block
document.getElementById("addQ").onclick = function () {
  const div = document.createElement("div");
  div.classList.add("mb-3");
  const qIndex = document.querySelectorAll("#questions .mb-3").length + 1;
  div.innerHTML = `
    <label class="form-label fw-bold">Question ${qIndex}</label>
    <input type="text" class="form-control mb-2" placeholder="Question" />
    <input type="text" class="form-control mb-1" placeholder="Option A" />
    <input type="text" class="form-control mb-1" placeholder="Option B" />
    <input type="text" class="form-control mb-1" placeholder="Option C" />
    <input type="text" class="form-control mb-1" placeholder="Option D" />
    <select class="form-select">
      <option selected disabled>Select correct answer</option>
      <option value="a">A</option>
      <option value="b">B</option>
      <option value="c">C</option>
      <option value="d">D</option>
    </select>
    <hr />
  `;
  document.getElementById("questions").appendChild(div);
};

// Save quiz to Firestore
document.getElementById("saveQ").onclick = async function () {
  console.log("🔄 Save button clicked");

  const title = document.getElementById("quizTitle")?.value.trim();
  const start = document.getElementById("startDate")?.value;
  const end = document.getElementById("endDate")?.value;
  const blocks = document.querySelectorAll("#questions .mb-3");

  console.log({ title, start, end, blockCount: blocks.length });

  if (!title || !start || !end || blocks.length === 0) {
    alert("Fill all details and add at least one question.");
    return;
  }

  const questions = [];
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const inputs = block.querySelectorAll("input");
    const select = block.querySelector("select");
    const question = inputs[0]?.value.trim();
    const a = inputs[1]?.value.trim();
    const b = inputs[2]?.value.trim();
    const c = inputs[3]?.value.trim();
    const d = inputs[4]?.value.trim();
    const correct = select?.value;

    console.log(`Q${i+1}`, { question, a, b, c, d, correct });

    if (!question || !a || !b || !c || !d || !["a","b","c","d"].includes(correct)) {
      alert(`Fill all fields & select correct answer in question ${i+1}.`);
      return;
    }

    questions.push({ question, a, b, c, d, correct });
  }

  const code = Math.random().toString(36).substring(2,7).toUpperCase();
  console.log("Generated quiz code:", code);

  try {
    await setDoc(doc(db, "quizzes", code), {
      title,
      questions,
      startAt: new Date(start).toISOString(),
      endAt: new Date(end).toISOString(),
      createdAt: new Date().toISOString()
    });
    document.getElementById("saveMsg").textContent = "Quiz saved! Code: " + code;
    console.log("Quiz written to Firestore ✔️");
  } catch (err) {
    console.error("Error writing quiz:", err);
    alert("Failed to save quiz. Check console for details.");
  }
};



// Parse raw text input to generate questions
document.getElementById("parseTextBtn").onclick = function () {
  const rawText = document.getElementById("quizText").value.trim();
  const questionBlocks = rawText.split(/\n\s*\n/);
  const questionsDiv = document.getElementById("questions");
  questionsDiv.innerHTML = "";

  questionBlocks.forEach((block, index) => {
    const lines = block.trim().split("\n").map(l => l.trim());
    if (lines.length < 6) return;

    const qText = lines[0].replace(/^Q:\s*/i, "");
    const options = {
      a: lines[1].replace(/^A\)\s*/i, ""),
      b: lines[2].replace(/^B\)\s*/i, ""),
      c: lines[3].replace(/^C\)\s*/i, ""),
      d: lines[4].replace(/^D\)\s*/i, "")
    };
    const correct = lines[5].match(/Answer:\s*([ABCD])/i);
    if (!correct) return;
    const correctAns = correct[1].toLowerCase();

    const div = document.createElement("div");
    div.classList.add("mb-3");
    div.innerHTML = `
      <label class="form-label fw-bold">Question ${index + 1}</label>
      <input type="text" class="form-control mb-2" value="${qText}" />
      <input type="text" class="form-control mb-1" value="${options.a}" />
      <input type="text" class="form-control mb-1" value="${options.b}" />
      <input type="text" class="form-control mb-1" value="${options.c}" />
      <input type="text" class="form-control mb-1" value="${options.d}" />
      <select class="form-select">
        <option disabled>Select correct answer</option>
        <option value="a" ${correctAns === "a" ? "selected" : ""}>A</option>
        <option value="b" ${correctAns === "b" ? "selected" : ""}>B</option>
        <option value="c" ${correctAns === "c" ? "selected" : ""}>C</option>
        <option value="d" ${correctAns === "d" ? "selected" : ""}>D</option>
      </select>
      <hr />
    `;
    questionsDiv.appendChild(div);
  });

  if (questionsDiv.innerHTML === "") {
    alert("No valid questions found. Make sure the format is correct.");
  }
};

// Load all quizzes from Firestore
window.loadQuizHistory = async function () {
  const output = document.getElementById("quizList");
  output.innerHTML = "";

  const snapshot = await getDocs(collection(db, "quizzes"));
  snapshot.forEach(docSnap => {
    const quiz = docSnap.data();
    const code = docSnap.id;

    output.innerHTML += `
      <div class="border p-2 rounded mb-2">
        <strong>${quiz.title}</strong><br>
        Code: <code>${code}</code><br>
        Start: <input type="datetime-local" value="${quiz.startAt}" id="start_${code}" class="form-control mb-1" />
        End: <input type="datetime-local" value="${quiz.endAt}" id="end_${code}" class="form-control mb-1" />
        <button class="btn btn-sm btn-success me-2" onclick="updateQuizTime('${code}')">Update Time</button>
        <button class="btn btn-sm btn-danger me-2" onclick="deleteQuiz('${code}')">Delete</button>
        <button class="btn btn-sm btn-primary" onclick="viewLeaderboard('${code}')">Leaderboard</button>
      </div>
    `;
  });
};

// Update quiz start/end time
window.updateQuizTime = async function (code) {
  const start = document.getElementById("start_" + code).value;
  const end = document.getElementById("end_" + code).value;
  await updateDoc(doc(db, "quizzes", code), {
    startAt: start,
    endAt: end
  });
  alert("Quiz time updated.");
};

// Delete quiz
window.deleteQuiz = async function (code) {
  if (confirm("Are you sure you want to delete this quiz?")) {
    await deleteDoc(doc(db, "quizzes", code));
    loadQuizHistory();
  }
};

// View leaderboard from Firestore
window.viewLeaderboard = async function (code) {
  const leaderboardSnap = await getDoc(doc(db, "leaderboards", code));
  if (!leaderboardSnap.exists()) {
    alert("No student data yet.");
    return;
  }

  const board = leaderboardSnap.data().entries || [];
  board.sort((a, b) => b.score - a.score);

  let msg = "Leaderboard:\n\n";
  board.forEach((entry, i) => {
    msg += `${i + 1}. ${entry.name} - ${entry.score}\n`;
  });
  alert(msg);
};
