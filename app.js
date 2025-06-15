let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const taskList = document.getElementById("task-list");
const taskInput = document.getElementById("new-task-input");

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks(filter = "all") {
  taskList.innerHTML = "";

  let filtered = tasks;
  if (filter === "active") filtered = tasks.filter(t => !t.completed);
  if (filter === "completed") filtered = tasks.filter(t => t.completed);

  filtered.forEach((task, index) => {
    const taskCard = document.createElement("div");
    taskCard.className = "bg-gray-100 p-4 rounded-xl flex justify-between items-center";

    const left = document.createElement("div");
    left.className = "flex items-center space-x-2";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.className = "h-5 w-5";
    checkbox.onchange = () => toggleComplete(index);

    const taskText = document.createElement("span");
    taskText.textContent = task.text;
    taskText.className = `text-md ${task.completed ? "line-through text-gray-500" : ""}`;

    left.appendChild(checkbox);
    left.appendChild(taskText);

    const right = document.createElement("div");
    right.className = "space-x-2";

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.onclick = () => editTask(index);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.onclick = () => deleteTask(index);

    right.appendChild(editBtn);
    right.appendChild(deleteBtn);

    taskCard.appendChild(left);
    taskCard.appendChild(right);
    taskList.appendChild(taskCard);
  });

  updateCounts();
}

function addTask() {
  const text = taskInput.value.trim();
  if (text === "") return;

  tasks.push({ text, completed: false });
  taskInput.value = "";
  saveTasks();
  renderTasks();
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function editTask(index) {
  const newText = prompt("Edit your task:", tasks[index].text);
  if (newText !== null && newText.trim() !== "") {
    tasks[index].text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

function clearCompleted() {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
}

function updateCounts() {
  document.getElementById("task-count").textContent = tasks.length;
  document.getElementById("all-count").textContent = tasks.length;
  document.getElementById("active-count").textContent = tasks.filter(t => !t.completed).length;
  document.getElementById("completed-count").textContent = tasks.filter(t => t.completed).length;
}

function filterTasks(filterType) {
  if (filterType === "all" || filterType === "today" || filterType === "recently" || filterType === "upcoming" || filterType === "later") {
    renderTasks(filterType === "today" ? "active" : filterType === "later" ? "completed" : "all");
  }
}

renderTasks();
