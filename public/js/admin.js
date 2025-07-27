import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getFirestore, collection, doc, setDoc, updateDoc, deleteDoc, getDoc, onSnapshot
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC_lvF65P7vaKYnKEMrpHfJroMe-vh3w4U",
  authDomain: "quizapp-f370d.firebaseapp.com",
  projectId: "quizapp-f370d",
  storageBucket: "quizapp-f370d.appspot.com",
  messagingSenderId: "822956185807",
  appId: "1:822956185807:web:3d2244d53f9bb61ec33fba"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Admin login
document.getElementById("loginBtn").onclick = () => {
  const user = document.getElementById("user").value.trim();
  const pass = document.getElementById("pass").value.trim();
  const errBox = document.getElementById("loginErr");

  if (user === "admin" && pass === "admin123") {
    document.getElementById("loginBox").classList.add("hidden");
    document.getElementById("builder").classList.remove("hidden");
    document.getElementById("history").classList.remove("hidden");
    listenToQuizHistory(); // Real-time loading
  } else {
    errBox.textContent = "Invalid username or password!";
  }
};

// Add question block
document.getElementById("addQ").onclick = () => {
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

// Save quiz
document.getElementById("saveQ").onclick = async () => {
  const title = document.getElementById("quizTitle").value.trim();
  const start = document.getElementById("startDate").value;
  const end = document.getElementById("endDate").value;
  const blocks = document.querySelectorAll("#questions .mb-3");

  if (!title || !start || !end || blocks.length === 0) {
    alert("Fill all details and add at least one question.");
    return;
  }

  const questions = [];
  blocks.forEach(block => {
    const inputs = block.querySelectorAll("input");
    const select = block.querySelector("select");
    questions.push({
      question: inputs[0].value,
      a: inputs[1].value,
      b: inputs[2].value,
      c: inputs[3].value,
      d: inputs[4].value,
      correct: select.value
    });
  });

  const code = Math.random().toString(36).substring(2, 7).toUpperCase();

  await setDoc(doc(db, "quizzes", code), {
    title,
    questions,
    startAt: start,
    endAt: end,
    createdAt: new Date().toISOString()
  });

  document.getElementById("saveMsg").textContent = "Quiz saved! Code: " + code;
};

// Parse quiz text
document.getElementById("parseTextBtn").onclick = () => {
  const rawText = document.getElementById("quizText").value.trim();
  const blocks = rawText.split(/\n\s*\n/);
  const target = document.getElementById("questions");
  target.innerHTML = "";

  blocks.forEach((block, index) => {
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
    target.appendChild(div);
  });

  if (target.innerHTML === "") {
    alert("No valid questions found.");
  }
};

// Real-time quiz display
function listenToQuizHistory() {
  const output = document.getElementById("quizList");
  const quizRef = collection(db, "quizzes");

  onSnapshot(quizRef, snapshot => {
    output.innerHTML = "";
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
  });
}

// Update time
window.updateQuizTime = async (code) => {
  const start = document.getElementById("start_" + code).value;
  const end = document.getElementById("end_" + code).value;
  await updateDoc(doc(db, "quizzes", code), { startAt: start, endAt: end });
  alert("Updated.");
};

// Delete quiz
window.deleteQuiz = async (code) => {
  if (confirm("Delete this quiz?")) {
    await deleteDoc(doc(db, "quizzes", code));
  }
};

// View leaderboard
window.viewLeaderboard = async (code) => {
  const ref = doc(db, "leaderboards", code);
  const snap = await getDoc(ref);
  const entries = snap.exists() ? snap.data().entries || [] : [];

  if (entries.length === 0) {
    alert("No students have taken this quiz.");
    return;
  }

  entries.sort((a, b) => b.score - a.score);
  let msg = "Leaderboard:\n\n";
  entries.forEach((e, i) => {
    msg += `${i + 1}. ${e.name} - ${e.score}\n`;
  });

  alert(msg);
};
