// /* ---------- LOGIN ---------- */
// document.getElementById("loginBtn").onclick = () => {
//   const u = document.getElementById("user").value.trim();
//   const p = document.getElementById("pass").value.trim();
//   if (u === "admin" && p === "admin123") {
//     document.getElementById("loginBox").classList.add("hidden");
//     document.getElementById("builder").classList.remove("hidden");
//     document.getElementById("history").classList.remove("hidden");
//   } else {
//     document.getElementById("loginErr").textContent = "Invalid credentials";
//   }
// };

// /* ---------- QUESTION BUILDER HELPERS ---------- */
// const qsDiv = document.getElementById("questions");
// let qCount = 0;

// function makeQBlock(data = {}) {
//   qCount++;
//   const div = document.createElement("div");
//   div.className = "mb-3 border p-3 rounded";
//   div.innerHTML = `
//     <label class="form-label fw-bold">Question ${qCount}</label>
//     <input type="text" class="form-control mb-2" value="${data.question || ""}" placeholder="Question">
//     <input type="text" class="form-control mb-1" value="${data.a || ""}" placeholder="Option A">
//     <input type="text" class="form-control mb-1" value="${data.b || ""}" placeholder="Option B">
//     <input type="text" class="form-control mb-1" value="${data.c || ""}" placeholder="Option C">
//     <input type="text" class="form-control mb-1" value="${data.d || ""}" placeholder="Option D">
//     <select class="form-select">
//       <option disabled ${!data.correct ? "selected" : ""}>Correct Answer</option>
//       <option value="a" ${data.correct === "a" ? "selected" : ""}>A</option>
//       <option value="b" ${data.correct === "b" ? "selected" : ""}>B</option>
//       <option value="c" ${data.correct === "c" ? "selected" : ""}>C</option>
//       <option value="d" ${data.correct === "d" ? "selected" : ""}>D</option>
//     </select>`;
//   return div;
// }

// document.getElementById("addQ").onclick = () => qsDiv.appendChild(makeQBlock());

// /* ---------- PASTE‑TEXT → GENERATE ---------- */
// document.getElementById("generateBtn").onclick = () => {
//   const raw = document.getElementById("quizText").value.trim();
//   if (!raw) return alert("Paste quiz text first.");

//   const parsed = parseQuizText(raw);
//   if (!parsed.length) return alert("No valid questions detected!");

//   qsDiv.innerHTML = ""; qCount = 0;
//   parsed.forEach(q => qsDiv.appendChild(makeQBlock(q)));
//   document.getElementById("saveMsg").textContent = `✅ Loaded ${parsed.length} questions!`;
// };

// /* ---------- SAVE QUIZ ---------- */
// document.getElementById("saveQ").onclick = () => {
//   const title = document.getElementById("quizTitle").value.trim();
//   const start = document.getElementById("startDate").value;
//   const end   = document.getElementById("endDate").value;
//   const blocks= qsDiv.querySelectorAll(".border");

//   if (!title || !start || !end || !blocks.length) { alert("Complete all fields"); return; }
//   if (new Date(start) >= new Date(end)) { alert("Start must be before End"); return; }

//   const questions = [...blocks].map(b => {
//     const i = b.querySelectorAll("input");
//     const s = b.querySelector("select");
//     return { question:i[0].value, a:i[1].value, b:i[2].value, c:i[3].value, d:i[4].value, correct:s.value };
//   });
//   if (questions.some(q => Object.values(q).some(v => !v))) { alert("Fill every question completely"); return; }

//   const code = Math.random().toString(36).substring(2,7).toUpperCase();
//   localStorage.setItem("quiz_"+code, JSON.stringify({ title, questions, startAt:start, endAt:end }));
//   document.getElementById("saveMsg").textContent = "Quiz saved! Code: " + code;
// };

// /* ---------- HISTORY WITH UPDATE FEATURE ---------- */
// function loadQuizHistory() {
//   const list = document.getElementById("quizList");
//   list.innerHTML = "";
//   Object.keys(localStorage)
//     .filter(k => k.startsWith("quiz_"))
//     .forEach(k => {
//       const q = JSON.parse(localStorage.getItem(k));
//       const code = k.slice(5);

//       list.innerHTML += `
//         <div class="border rounded p-3 mb-3">
//           <strong>${q.title}</strong><br>
//           Code: <code>${code}</code><br>
//           <label class="form-label mt-2">Start Time:</label>
//           <input type="datetime-local" id="start_${code}" class="form-control mb-2" value="${q.startAt}">
          
//           <label class="form-label">End Time:</label>
//           <input type="datetime-local" id="end_${code}" class="form-control mb-2" value="${q.endAt}">
          
//           <button class="btn btn-sm btn-success" onclick="updateQuizTime('${code}')">Update Time</button>
//         </div>
//       `;
//     });
// }

// function updateQuizTime(code) {
//   const startInput = document.getElementById(`start_${code}`);
//   const endInput = document.getElementById(`end_${code}`);

//   const newStart = startInput.value;
//   const newEnd = endInput.value;

//   if (!newStart || !newEnd) {
//     alert("Please enter both start and end time.");
//     return;
//   }
//   if (new Date(newStart) >= new Date(newEnd)) {
//     alert("Start time must be before end time.");
//     return;
//   }

//   const key = "quiz_" + code;
//   const quiz = JSON.parse(localStorage.getItem(key));
//   quiz.startAt = newStart;
//   quiz.endAt = newEnd;

//   localStorage.setItem(key, JSON.stringify(quiz));
//   alert("✅ Time updated successfully!");
// }

// /* ---------- PARSER ---------- */
// function parseQuizText(raw){
//   const lines = raw.split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
//   const out=[], regexQ=/^\d+\.\s+(.*)/, regexAns=/^Correct Answer:\s*([A-D])$/i;
//   let cur=null;

//   lines.forEach(l=>{
//     if (regexQ.test(l)){ if(cur) out.push(cur); cur={question:l.replace(regexQ,'$1'),a:"",b:"",c:"",d:"",correct:""}; }
//     else if (/^A\.\s+/i.test(l) && cur) cur.a = l.slice(2).trim();
//     else if (/^B\.\s+/i.test(l) && cur) cur.b = l.slice(2).trim();
//     else if (/^C\.\s+/i.test(l) && cur) cur.c = l.slice(2).trim();
//     else if (/^D\.\s+/i.test(l) && cur) cur.d = l.slice(2).trim();
//     else {
//       const m = l.match(regexAns);
//       if (m && cur) cur.correct = m[1].toLowerCase();
//     }
//   });
//   if(cur) out.push(cur);
//   return out.filter(q=>q.question&&q.a&&q.b&&q.c&&q.d&&q.correct);
// }
// ---------- LOGIN ----------
document.getElementById("loginBtn").onclick = () => {
  const u = document.getElementById("user").value.trim();
  const p = document.getElementById("pass").value.trim();
  if (u === "admin" && p === "admin123") {
    sessionStorage.setItem("isAdmin", "true");
    document.getElementById("loginBox").classList.add("hidden");
    document.getElementById("builder").classList.remove("hidden");
    document.getElementById("history").classList.remove("hidden");
  } else {
    document.getElementById("loginErr").textContent = "Invalid credentials";
  }
};

// ---------- QUESTION BUILDER HELPERS ----------
const qsDiv = document.getElementById("questions");
let qCount = 0;

function makeQBlock(data = {}) {
  qCount++;
  const div = document.createElement("div");
  div.className = "mb-3 border p-3 rounded";
  div.innerHTML = `
    <label class="form-label fw-bold">Question ${qCount}</label>
    <input type="text" class="form-control mb-2" value="${data.question || ""}" placeholder="Question">
    <input type="text" class="form-control mb-1" value="${data.a || ""}" placeholder="Option A">
    <input type="text" class="form-control mb-1" value="${data.b || ""}" placeholder="Option B">
    <input type="text" class="form-control mb-1" value="${data.c || ""}" placeholder="Option C">
    <input type="text" class="form-control mb-1" value="${data.d || ""}" placeholder="Option D">
    <select class="form-select">
      <option disabled ${!data.correct ? "selected" : ""}>Correct Answer</option>
      <option value="a" ${data.correct === "a" ? "selected" : ""}>A</option>
      <option value="b" ${data.correct === "b" ? "selected" : ""}>B</option>
      <option value="c" ${data.correct === "c" ? "selected" : ""}>C</option>
      <option value="d" ${data.correct === "d" ? "selected" : ""}>D</option>
    </select>`;
  return div;
}

document.getElementById("addQ").onclick = () => qsDiv.appendChild(makeQBlock());

// ---------- PASTE TEXT → GENERATE ----------
document.getElementById("generateBtn").onclick = () => {
  const raw = document.getElementById("quizText").value.trim();
  if (!raw) return alert("Paste quiz text first.");

  const parsed = parseQuizText(raw);
  if (!parsed.length) return alert("No valid questions detected!");

  qsDiv.innerHTML = ""; qCount = 0;
  parsed.forEach(q => qsDiv.appendChild(makeQBlock(q)));
  document.getElementById("saveMsg").textContent = `✅ Loaded ${parsed.length} questions!`;
};

// ---------- SAVE QUIZ ----------
document.getElementById("saveQ").onclick = () => {
  const title = document.getElementById("quizTitle").value.trim();
  const start = document.getElementById("startDate").value;
  const end   = document.getElementById("endDate").value;
  const blocks= qsDiv.querySelectorAll(".border");

  if (!title || !start || !end || !blocks.length) {
    alert("Complete all fields");
    return;
  }
  if (new Date(start) >= new Date(end)) {
    alert("Start must be before End");
    return;
  }

  const questions = [...blocks].map(b => {
    const i = b.querySelectorAll("input");
    const s = b.querySelector("select");
    return {
      question: i[0].value,
      a: i[1].value,
      b: i[2].value,
      c: i[3].value,
      d: i[4].value,
      correct: s.value
    };
  });

  if (questions.some(q => Object.values(q).some(v => !v))) {
    alert("Fill every question completely");
    return;
  }

  const code = Math.random().toString(36).substring(2, 7).toUpperCase();
  localStorage.setItem("quiz_" + code, JSON.stringify({ title, questions, startAt: start, endAt: end }));
  document.getElementById("saveMsg").textContent = "Quiz saved! Code: " + code;
};

// ---------- LOAD QUIZ HISTORY + ATTEMPT VIEWER ----------
function loadQuizHistory() {
  const list = document.getElementById("quizList");
  list.innerHTML = "";
  Object.keys(localStorage)
    .filter(k => k.startsWith("quiz_"))
    .forEach(k => {
      const q = JSON.parse(localStorage.getItem(k));
      const code = k.slice(5);

      list.innerHTML += `
        <div class="border rounded p-3 mb-3">
          <strong>${q.title}</strong><br>
          Code: <code>${code}</code><br>

          <label class="form-label mt-2">Start Time:</label>
          <input type="datetime-local" id="start_${code}" class="form-control mb-2" value="${q.startAt}">
          
          <label class="form-label">End Time:</label>
          <input type="datetime-local" id="end_${code}" class="form-control mb-2" value="${q.endAt}">

          <button class="btn btn-sm btn-success" onclick="updateQuizTime('${code}')">Update Time</button>
          <button class="btn btn-sm btn-warning" onclick="viewAttempts('${code}')">View Attempts</button>
          <div id="attempts_${code}" class="mt-3 hidden"></div>
        </div>
      `;
    });
}

// ---------- UPDATE QUIZ TIME ----------
function updateQuizTime(code) {
  const startInput = document.getElementById(`start_${code}`);
  const endInput = document.getElementById(`end_${code}`);
  const newStart = startInput.value;
  const newEnd = endInput.value;

  if (!newStart || !newEnd) return alert("Please enter both start and end time.");
  if (new Date(newStart) >= new Date(newEnd)) return alert("Start time must be before end time.");

  const key = "quiz_" + code;
  const quiz = JSON.parse(localStorage.getItem(key));
  quiz.startAt = newStart;
  quiz.endAt = newEnd;

  localStorage.setItem(key, JSON.stringify(quiz));
  alert("✅ Time updated successfully!");
}

// ---------- VIEW ATTEMPT LIST ----------
function viewAttempts(code) {
  const div = document.getElementById(`attempts_${code}`);
  div.classList.toggle("hidden");
  div.innerHTML = "<strong>Attempts:</strong><ul class='list-group mt-2'>";

  const keys = Object.keys(localStorage).filter(k => k.startsWith(`attempt_${code}_`));
  if (!keys.length) {
    div.innerHTML += "<li class='list-group-item'>No attempts yet.</li></ul>";
    return;
  }

  keys.forEach(k => {
    const student = k.split("_").slice(2).join("_");
    div.innerHTML += `
      <li class='list-group-item d-flex justify-content-between align-items-center'>
        ${student}
        <button class="btn btn-sm btn-danger" onclick="removeAttempt('${code}', '${student}')">Allow Reattempt</button>
      </li>`;
  });

  div.innerHTML += "</ul>";
}

// ---------- REMOVE ATTEMPT FOR REATTEMPT ----------
function removeAttempt(code, student) {
  const key = `attempt_${code}_${student}`;
  localStorage.removeItem(key);
  alert(`✅ ${student} can now reattempt quiz ${code}`);
  viewAttempts(code); // refresh UI
}

// ---------- PARSER ----------
function parseQuizText(raw){
  const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const out = [], regexQ = /^\d+\.\s+(.*)/, regexAns = /^Correct Answer:\s*([A-D])$/i;
  let cur = null;

  lines.forEach(l => {
    if (regexQ.test(l)) {
      if (cur) out.push(cur);
      cur = { question: l.replace(regexQ, '$1'), a: "", b: "", c: "", d: "", correct: "" };
    } else if (/^A\.\s+/i.test(l) && cur) cur.a = l.slice(2).trim();
    else if (/^B\.\s+/i.test(l) && cur) cur.b = l.slice(2).trim();
    else if (/^C\.\s+/i.test(l) && cur) cur.c = l.slice(2).trim();
    else if (/^D\.\s+/i.test(l) && cur) cur.d = l.slice(2).trim();
    else {
      const m = l.match(regexAns);
      if (m && cur) cur.correct = m[1].toLowerCase();
    }
  });
  if (cur) out.push(cur);
  return out.filter(q => q.question && q.a && q.b && q.c && q.d && q.correct);
}
