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
    endAt: end
  }));

  document.getElementById("saveMsg").textContent = "Quiz saved! Code: " + code;
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
          Start: ${quiz.startAt}<br>
          End: ${quiz.endAt}
        </div>
      `;
    }
  }
}
