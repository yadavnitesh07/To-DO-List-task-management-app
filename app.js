
// ✅ Check if user is logged in
const loggedInUser = localStorage.getItem("username");
if (!loggedInUser) {
  window.location.href = "index.html"; // redirect to login if not logged in
}

// ✅ Show username in greeting & sidebar
document.getElementById("greeting").textContent = `Hello, ${loggedInUser}!`;
document.getElementById("userDisplayName").textContent = loggedInUser;



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

    // ✅ Priority label
const priorityLabel = document.createElement("span");
priorityLabel.textContent = `[${task.priority}]`;
priorityLabel.className = `${getPriorityColor(task.priority)} text-xs ml-2`;
left.appendChild(priorityLabel);

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
  const dueDate = document.getElementById("due-date").value;
  const priority = document.getElementById("priority").value;

  if (text === "") return;

  tasks.push({
    text,
    completed: false,
    dueDate,
    priority
  });

  taskInput.value = "";
  document.getElementById("due-date").value = "";
  document.getElementById("priority").value = "Normal";

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

function getPriorityColor(priority) {
  switch (priority) {
    case "High":
      return "text-red-600 font-semibold";
    case "Normal":
      return "text-yellow-600 font-medium";
    case "Low":
      return "text-green-600 font-medium";
    default:
      return "text-gray-500";
  }
}
renderTasks();

// 🔍 Search functionality
const searchInput = document.querySelector('input[placeholder="Search something..."]');
searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();
  const filtered = tasks.filter(task => task.text.toLowerCase().includes(keyword));
  renderSearchedTasks(filtered);
});

function renderSearchedTasks(filteredTasks) {
  taskList.innerHTML = "";

  filteredTasks.forEach((task, index) => {
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

// 🕒 Project Timer
let timerInterval = null;
let seconds = 0;

const timerButton = document.getElementById("startTimerBtn");

timerButton.addEventListener("click", () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    timerButton.textContent = "▶"; // Start
  } else {
    timerInterval = setInterval(() => {
      seconds++;
      displayTime();
    }, 1000);
    timerButton.textContent = "⏸️"; // Pause
  }
});

function displayTime() {
  const timeDisplay = document.getElementById("timeDisplay");
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  timeDisplay.textContent = `${hrs}:${mins}:${secs}`;
}



//logout logic
function logout() {
  localStorage.removeItem("username");
  window.location.href = "index.html";
}

// 📱 Toggle dashboard dropdown menu on small screens
document.getElementById("dashboardToggle").addEventListener("click", () => {
  if (window.innerWidth < 768) {
    document.getElementById("dashboardMenu").classList.toggle("hidden");
  }
});

