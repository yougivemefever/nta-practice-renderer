let questions = [];
let currentIndex = 0;
let selectedOptionIndex = null;
let revealed = false;

async function loadQuestions() {
  const res = await fetch("data/questions.json");
  questions = await res.json();
  renderQuestion();
}

function renderQuestion() {
  const question = questions[currentIndex];
  const questionText = document.getElementById("question-text");
  const optionsList = document.getElementById("options-list");

  selectedOptionIndex = null;
  revealed = false;

  questionText.textContent = `${currentIndex + 1}. ${question.q}`;
  optionsList.innerHTML = "";

  question.options.forEach((opt, index) => {
    const li = document.createElement("li");
    li.textContent = opt;

    li.addEventListener("click", () => {
      selectedOptionIndex = index;
      document.querySelectorAll("#options-list li").forEach(el => el.classList.remove("selected"));
      li.classList.add("selected");
    });

    optionsList.appendChild(li);
  });
}

document.getElementById("next-btn").addEventListener("click", () => {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    renderQuestion();
  }
});

document.getElementById("prev-btn").addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
});

document.getElementById("reveal-btn").addEventListener("click", () => {
  if (!revealed) {
    const correct = questions[currentIndex].answer;
    const options = document.querySelectorAll("#options-list li");
    options.forEach((li, i) => {
      if (i === correct) {
        li.style.borderColor = "limegreen";
      }
    });
    revealed = true;
  }
});

window.onload = loadQuestions;
