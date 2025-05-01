let current = 0;
let questions = [];
fetch('question.json')
  .then(res => res.json())
  .then(data => {
    questions = data;
    renderQuestion(current);
  });

function renderQuestion(index) {
  const container = document.getElementById('question-container');
  const q = questions[index];
  let html = `<h2>Q${index + 1}: ${q.question}</h2>`;
  q.options.forEach((opt, i) => {
    html += `<div><input type="radio" name="option" id="opt${i}" value="${opt}"><label for="opt${i}">${opt}</label></div>`;
  });
  container.innerHTML = html;
}

function prevQuestion() {
  if (current > 0) renderQuestion(--current);
}
function nextQuestion() {
  if (current < questions.length - 1) renderQuestion(++current);
}

document.getElementById('theme-toggle').onclick = () => {
  document.body.classList.toggle('dark');
};
