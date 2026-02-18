const quizData = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Lisbon"],
    answer: "Paris"
  },
  {
    question: "Which language runs in a web browser?",
    options: ["Java", "C", "Python", "JavaScript"],
    answer: "JavaScript"
  },
  {
    question: "What does CSS stand for?",
    options: ["Cascading Style Sheets", "Creative Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"],
    answer: "Cascading Style Sheets"
  },
  {
    question: "Which HTML element do we use for links?",
    options: ["<a>", "<link>", "<href>", "<url>"],
    answer: "<a>"
  }
];

let currentQuiz = 0;
let score = 0;

const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const nextBtn = document.getElementById('next-btn');
const resultEl = document.getElementById('result');
const quizEl = document.getElementById('quiz');
const scoreEl = document.getElementById('score');
const totalEl = document.getElementById('total');
const restartBtn = document.getElementById('restart-btn');

function loadQuiz() {
  const currentQuizData = quizData[currentQuiz];
  questionEl.innerText = currentQuizData.question;
  optionsEl.innerHTML = '';
  currentQuizData.options.forEach(option => {
    const li = document.createElement('li');
    li.innerText = option;
    li.addEventListener('click', selectOption);
    optionsEl.appendChild(li);
  });
}

function selectOption(e) {
  const selected = e.target;
  const currentAnswer = quizData[currentQuiz].answer;

  Array.from(optionsEl.children).forEach(option => option.removeEventListener('click', selectOption));

  if (selected.innerText === currentAnswer) {
    selected.classList.add('correct');
    score++;
  } else {
    selected.classList.add('wrong');
    Array.from(optionsEl.children).forEach(option => {
      if(option.innerText === currentAnswer) option.classList.add('correct');
    });
  }

  nextBtn.style.display = 'block';
}

nextBtn.addEventListener('click', () => {
  currentQuiz++;
  nextBtn.style.display = 'none';
  if(currentQuiz < quizData.length) {
    loadQuiz();
  } else {
    showResult();
  }
});

function showResult() {
  quizEl.classList.add('hide');
  resultEl.classList.remove('hide');
  scoreEl.innerText = score;
  totalEl.innerText = quizData.length;
}

restartBtn.addEventListener('click', () => {
  currentQuiz = 0;
  score = 0;
  quizEl.classList.remove('hide');
  resultEl.classList.add('hide');
  loadQuiz();
  nextBtn.style.display = 'none';
});

loadQuiz();
nextBtn.style.display = 'none';
