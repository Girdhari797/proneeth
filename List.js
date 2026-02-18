const taskInput = document.getElementById("taskInput");
const dueDateInput = document.getElementById("dueDateInput");
const categoryInput = document.getElementById("categoryInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const progressBar = document.getElementById("progressBar");
const themeToggle = document.getElementById("themeToggle");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let darkMode = JSON.parse(localStorage.getItem("darkMode")) || false;

if (darkMode) document.body.classList.add("dark");

addTaskBtn.onclick = addTask;
themeToggle.onclick = toggleTheme;

function addTask() {
  if (!taskInput.value.trim()) return;

  tasks.push({
    text: taskInput.value,
    due: dueDateInput.value,
    category: categoryInput.value,
    completed: false
  });

  taskInput.value = "";
  dueDateInput.value = "";
  saveAndRender();
}

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.draggable = true;

    if (task.completed) li.classList.add("completed");

    li.addEventListener("dragstart", () => li.classList.add("dragging"));
    li.addEventListener("dragend", () => {
      li.classList.remove("dragging");
      updateOrder();
    });

    const info = document.createElement("div");
    info.className = "task-info";

    const text = document.createElement("span");
    text.textContent = task.text;
    text.onclick = () => toggleComplete(index);

    const category = document.createElement("span");
    category.className = "category";
    category.textContent = task.category;

    const due = document.createElement("span");
    due.className = "due";
    due.textContent = task.due ? `Due: ${task.due}` : "";

    info.append(text, category, due);

    const actions = document.createElement("div");
    actions.className = "actions";

    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑";
    delBtn.onclick = () => deleteTask(index);

    actions.appendChild(delBtn);
    li.append(info, actions);
    taskList.appendChild(li);
  });

  updateProgress();
}

taskList.addEventListener("dragover", e => {
  e.preventDefault();
  const dragging = document.querySelector(".dragging");
  const after = [...taskList.children].find(
    item => e.clientY < item.offsetTop + item.offsetHeight / 2
  );
  taskList.insertBefore(dragging, after);
});

function updateOrder() {
  const newTasks = [];
  [...taskList.children].forEach(li => {
    const text = li.querySelector("span").textContent;
    newTasks.push(tasks.find(t => t.text === text));
  });
  tasks = newTasks;
  save();
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveAndRender();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveAndRender();
}

function updateProgress() {
  if (!tasks.length) {
    progressBar.style.width = "0%";
    return;
  }
  const completed = tasks.filter(t => t.completed).length;
  progressBar.style.width = `${(completed / tasks.length) * 100}%`;
}

function toggleTheme() {
  darkMode = !darkMode;
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", darkMode);
}

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function saveAndRender() {
  save();
  renderTasks();
}

renderTasks();
