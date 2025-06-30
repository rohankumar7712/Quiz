// js/student.js

const startBtn = document.getElementById('startBtn');
const codeErr  = document.getElementById('codeErr');

startBtn.addEventListener("click", () => {
  const name = document.getElementById("name").value.trim();
  const code = document.getElementById("code").value.trim().toUpperCase();

  if (name === "" || code.length !== 5) {
    codeErr.textContent = "Enter your name and a 5-letter quiz code.";
    return;
  }

  const raw = localStorage.getItem('quiz_' + code);
  if (!raw) {
    codeErr.textContent = 'Quiz not found – check the code!';
    return;
  }

  const quiz = JSON.parse(raw);
  const now = Date.now();
  const open  = new Date(quiz.startAt).getTime();
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
});
