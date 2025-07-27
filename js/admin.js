// js/admin.js

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

document.getElementById("saveQ").onclick = function () {
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
  localStorage.setItem("quiz_" + code, JSON.stringify({
    title: title,
    questions: questions,
    startAt: start,
    endAt: end,
    createdAt: new Date().toISOString()
  }));

  document.getElementById("saveMsg").textContent = "Quiz saved! Code: " + code;
};

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

function loadQuizHistory() {
  const output = document.getElementById("quizList");
  output.innerHTML = "";

  for (let key in localStorage) {
    if (key.startsWith("quiz_")) {
      const quiz = JSON.parse(localStorage.getItem(key));

      output.innerHTML += `
        <div class="border p-2 rounded mb-2">
          <strong>${quiz.title}</strong><br>
          Code: <code>${key.slice(5)}</code><br>
          Start: <input type="datetime-local" value="${quiz.startAt}" id="start_${key}" class="form-control mb-1" />
          End: <input type="datetime-local" value="${quiz.endAt}" id="end_${key}" class="form-control mb-1" />
          <button class="btn btn-sm btn-success me-2" onclick="updateQuizTime('${key}')">Update Time</button>
          <button class="btn btn-sm btn-danger me-2" onclick="deleteQuiz('${key}')">Delete</button>
          <button class="btn btn-sm btn-primary" onclick="viewLeaderboard('${key}')">Leaderboard</button>
        </div>
      `;
    }
  }
}

function updateQuizTime(key) {
  const start = document.getElementById("start_" + key).value;
  const end = document.getElementById("end_" + key).value;
  const quiz = JSON.parse(localStorage.getItem(key));
  quiz.startAt = start;
  quiz.endAt = end;
  localStorage.setItem(key, JSON.stringify(quiz));
  alert("Quiz time updated successfully.");
}

function deleteQuiz(key) {
  if (confirm("Are you sure you want to delete this quiz?")) {
    localStorage.removeItem(key);
    loadQuizHistory();
  }
}

function viewLeaderboard(key) {
  const code = key.slice(5); // remove 'quiz_' prefix
  const board = JSON.parse(localStorage.getItem("leaderboard_" + code)) || [];

  if (board.length === 0) {
    alert("No student data for this quiz yet.");
    return;
  }

  board.sort((a, b) => b.score - a.score);
  let message = "Leaderboard:\n\n";
  board.forEach((entry, i) => {
    message += `${i + 1}. ${entry.name} - ${entry.score}\n`;
  });

  alert(message);
}

