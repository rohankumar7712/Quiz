// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getFirestore, collection, doc, setDoc, addDoc, updateDoc, deleteDoc, getDoc, getDocs, onSnapshot
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
    listenToQuizHistory();
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

function listenToQuizHistory() {
  const output = document.getElementById("quizList");
  const quizRef = collection(db, "quizzes");

  onSnapshot(quizRef, async (snapshot) => {
    output.innerHTML = "";

    for (const docSnap of snapshot.docs) {
      const quiz = docSnap.data();
      const code = docSnap.id;

      // ✅ Get the leaderboard document instead of a subcollection
      const leaderboardRef = doc(db, "leaderboards", code);
      const leaderboardSnap = await getDoc(leaderboardRef);

      let reviews = [];
      if (leaderboardSnap.exists()) {
        reviews = leaderboardSnap.data().entries || [];
      }

      // ✅ Sort by score descending
      reviews.sort((a, b) => b.score - a.score);

      let reviewHTML = "";
      reviews.forEach((rev, index) => {
        reviewHTML += `
          <div class="d-flex justify-content-between align-items-center px-2 py-1 border-top">
            <div>${index + 1}. ${rev.name} - ${rev.score}</div>
            <a href="review.html?code=${code}&student=${encodeURIComponent(rev.name)}" class="btn btn-sm btn-outline-secondary">Review</a>
          </div>
        `;
      });

      output.innerHTML += `
        <div class="border rounded mb-3 p-3 bg-light">
          <div class="mb-2"><strong>${quiz.title}</strong> <br> Code: <span class="text-danger">${code}</span></div>
          <div class="mb-2">Start: <input type="datetime-local" value="${quiz.startAt}" id="start_${code}" class="form-control" /></div>
          <div class="mb-2">End: <input type="datetime-local" value="${quiz.endAt}" id="end_${code}" class="form-control" /></div>
          <div class="mb-3">
            <button class="btn btn-sm btn-success me-2" onclick="updateQuizTime('${code}')">Update Time</button>
            <button class="btn btn-sm btn-danger me-2" onclick="deleteQuiz('${code}')">Delete</button>
          </div>
          <div class="bg-white p-2 rounded">
            <h6 class="mb-2">Leaderboard:</h6>
            ${reviewHTML || "<i>No student attempts yet.</i>"}
          </div>
        </div>
      `;
    }
  });
}



window.updateQuizTime = async (code) => {
  const start = document.getElementById("start_" + code).value;
  const end = document.getElementById("end_" + code).value;
  await updateDoc(doc(db, "quizzes", code), { startAt: start, endAt: end });
  alert("Updated.");
};

window.deleteQuiz = async (code) => {
  if (confirm("Delete this quiz?")) {
    await deleteDoc(doc(db, "quizzes", code));
  }
};
