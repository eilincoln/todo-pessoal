const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const dailyCheckbox = document.getElementById("dailyCheckbox");
const areaSelect = document.getElementById("areaSelect");

// Carrega tarefas salvas
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function resetDailyTasksIfNeeded() {
  const today = new Date().toDateString();
  const lastAccess = localStorage.getItem("lastAccess");

  if (lastAccess !== today) {
    tasks.forEach((task) => {
      if (task.daily) {
        task.done = false;
      }
    });

    saveTasks();
    localStorage.setItem("lastAccess", today);
  }
}

// Salva no localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Renderiza tarefas na tela
function renderTasks() {
  taskList.innerHTML = "";

  let currentArea = "";

  getOrderedTasks().forEach((task, index) => {
    if (task.area !== currentArea) {
      currentArea = task.area;
      const areaTitle = document.createElement("h3");
      areaTitle.textContent = currentArea;
      areaTitle.style.margin = "15px 0 5px";
      taskList.appendChild(areaTitle);
    }

    const li = document.createElement("li");
    if (task.done) li.classList.add("done");
    if (task.daily) li.classList.add("daily");

    const left = document.createElement("div");
    left.classList.add("task-left");

    const checkbox = document.createElement("div");
    checkbox.classList.add("checkbox");

    const span = document.createElement("span");
    span.textContent = task.text;

    left.appendChild(checkbox);
    left.appendChild(span);

    li.addEventListener("click", () => {
      task.done = !task.done;
      saveTasks();
      renderTasks();
      renderStreak();
    });

    // ✏️ botão editar
    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.classList.add("delete-btn");

    editBtn.addEventListener("click", (e) => {
      e.stopPropagation();

      const newText = prompt("Editar tarefa:", task.text);
      if (newText !== null) task.text = newText;

      const isDaily = confirm("Essa tarefa é diária?");
      task.daily = isDaily;

      const newArea = prompt(
        "Área (Estudo, Trabalho, Saúde, Pessoal):",
        task.area
      );
      if (newArea) task.area = newArea;

      saveTasks();
      renderTasks();
      renderStreak();
    });

    // ❌ excluir
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✕";
    deleteBtn.classList.add("delete-btn");

    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      tasks.splice(tasks.indexOf(task), 1);
      saveTasks();
      renderTasks();
      renderStreak();
    });

    li.appendChild(left);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

// Adiciona nova tarefa
addTaskBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  if (!taskText) return;

  tasks.push({
    text: taskText,
    done: false,
    daily: dailyCheckbox.checked,
    area: areaSelect.value,
  });

  saveTasks();
  renderTasks();
  renderStreak();

  taskInput.value = "";
  dailyCheckbox.checked = false;
});

function allDailyTasksDone() {
  const daily = tasks.filter((task) => task.daily);
  return daily.length > 0 && daily.every((task) => task.done);
}

function updateStreak() {
  const today = new Date().toDateString();
  const lastCompletedDay = localStorage.getItem("lastCompletedDay");
  let streak = Number(localStorage.getItem("streak")) || 0;

  if (allDailyTasksDone()) {
    if (lastCompletedDay !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastCompletedDay === yesterday.toDateString()) {
        streak++;
      } else {
        streak = 1;
      }

      localStorage.setItem("streak", streak);
      localStorage.setItem("lastCompletedDay", today);
    }
  }

  return streak;
}

function renderStreak() {
  const streakEl = document.getElementById("streak");
  const streak = updateStreak();

  if (streak > 0) {
    streakEl.textContent = `🔥 Sequência atual: ${streak} dia(s)`;
  } else {
    streakEl.textContent = "Nenhuma sequência ainda.";
  }
}

// Renderiza ao abrir a página
resetDailyTasksIfNeeded();
renderTasks();
renderStreak();

function getOrderedTasks() {
  return [...tasks].sort((a, b) => {
    if (a.daily && !b.daily) return -1;
    if (!a.daily && b.daily) return 1;
    return a.area.localeCompare(b.area);
  });
}

taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTaskBtn.click();
  }
});
