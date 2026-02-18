const texts = {
  easy: ["Practice typing daily"],
  medium: ["Accuracy comes before speed"],
  hard: ["Professional developers master keyboard efficiency"]
};

let user, timer, startTime, timeLeft;
let chart;

const el = id => document.getElementById(id);

el("loginBtn").onclick = () => {
  user = el("username").value.trim();
  if (!user) return alert("Enter username");
  el("app").classList.remove("hidden");
  loadStats();
};

el("themeToggle").onclick = () => document.body.classList.toggle("dark");

el("startBtn").onclick = startTest;

function startTest() {
  const level = el("difficulty").value;
  const timeMode = +el("timeMode").value;
  const text = texts[level][0];

  el("textDisplay").innerHTML = [...text].map((c,i)=>`<span id="c${i}">${c}</span>`).join("");
  el("input").value = "";
  el("input").disabled = false;
  el("input").focus();

  timeLeft = timeMode;
  el("time").textContent = timeLeft;
  startTime = Date.now();

  timer = setInterval(() => {
    timeLeft--;
    el("time").textContent = timeLeft;
    updateLiveStats(text);
    if (timeLeft <= 0) endTest(text);
  },1000);
}

el("input").oninput = () => updateHighlight();

function updateHighlight() {
  const text = el("textDisplay").innerText;
  const input = el("input").value;

  [...text].forEach((_,i)=>{
    const span = el(`c${i}`);
    span.className = "";
    if (input[i]) span.className = input[i] === text[i] ? "correct" : "incorrect";
    if (i === input.length) span.classList.add("active");
  });
}

function updateLiveStats(text) {
  const input = el("input").value;
  const time = (Date.now()-startTime)/60000;
  el("wpm").textContent = Math.round((input.length/5)/time)||0;
  el("cpm").textContent = input.length;
  el("accuracy").textContent = Math.round(
    ([...input].filter((c,i)=>c===text[i]).length/text.length)*100
  )||0;
}

function endTest(text) {
  clearInterval(timer);
  el("input").disabled = true;

  const wpm = +el("wpm").textContent;
  const acc = +el("accuracy").textContent;

  const data = JSON.parse(localStorage.getItem(user)) || [];
  data.push({ wpm, acc, date:Date.now() });
  localStorage.setItem(user, JSON.stringify(data));
  loadStats();
}

function loadStats() {
  const data = JSON.parse(localStorage.getItem(user)) || [];
  el("history").innerHTML = "";

  let best = 0, total = 0;
  const wpms = [];

  data.forEach((s,i)=>{
    best = Math.max(best,s.wpm);
    total += s.wpm;
    wpms.push(s.wpm);
    el("history").innerHTML += `<li>Session ${i+1}: ${s.wpm} WPM</li>`;
  });

  el("best").textContent = best;
  el("avg").textContent = data.length?Math.round(total/data.length):0;
  el("streak").textContent = data.length;

  drawChart(wpms);
}

function drawChart(data) {
  const ctx = el("chart");
  if (chart) chart.destroy();
  chart = new Chart(ctx,{
    type:"line",
    data:{
      labels:data.map((_,i)=>i+1),
      datasets:[{ label:"WPM Progress", data, borderColor:"blue" }]
    }
  });
}
