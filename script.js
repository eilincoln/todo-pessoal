const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

// Carrega tarefas salvas
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Salva no localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Renderiza tarefas na tela
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    if (task.done) li.classList.add("done");

    const left = document.createElement("div");
    left.classList.add("task-left");

    const checkbox = document.createElement("div");
    checkbox.classList.add("checkbox");

    const span = document.createElement("span");
    span.textContent = task.text;

    left.appendChild(checkbox);
    left.appendChild(span);

    li.addEventListener("click", () => {
      tasks[index].done = !tasks[index].done;
      saveTasks();
      renderTasks();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✕";
    deleteBtn.classList.add("delete-btn");

    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    li.appendChild(left);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

// Adiciona nova tarefa
addTaskBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  if (!taskText) return;

  tasks.push({ text: taskText, done: false });
  saveTasks();
  renderTasks();

  taskInput.value = "";
});

// Renderiza ao abrir a página
renderTasks();
