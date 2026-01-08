const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const errorMessage = document.getElementById("errorMessage");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    const span = document.createElement("span");
    span.textContent = task.title;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    taskList.appendChild(li);
  });
}

addTaskBtn.addEventListener("click", () => {
  const title = taskInput.value.trim();
  if (!title) return;

  tasks.push({
    title,
    completed: false,
    date: new Date().toISOString().split("T")[0],
  });

  taskInput.value = "";
  saveTasks();
  renderTasks();
});

function addTask() {
  const title = taskInput.value.trim();

  if (!title) {
    errorMessage.classList.remove("hidden");
    taskInput.classList.add("error-input");
    taskInput.focus();
    return;
  }

  errorMessage.classList.add("hidden");
  taskInput.classList.remove("error-input");

  tasks.push({
    title,
    completed: false,
    date: new Date().toISOString().split("T")[0],
  });

  taskInput.value = "";
  saveTasks();
  renderTasks();
  taskInput.focus();
}

// Botão
addTaskBtn.addEventListener("click", addTask);

// Enter no input
taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});

renderTasks();

taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTask();
  }

  if (event.key === "Escape") {
    taskInput.value = "";
    taskInput.classList.remove("error-input");
    errorMessage.classList.add("hidden");
  }
});
