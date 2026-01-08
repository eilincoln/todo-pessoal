const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

// Carrega tarefas salvas
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const dailyTasks = [
  "Estudar programação",
  "Treinar / atividade física",
  "Revisar tarefas do dia",
  "Ler algo útil",
];

function resetDailyTasksIfNeeded() {
  const today = new Date().toDateString();
  const lastAccess = localStorage.getItem("lastAccess");

  if (lastAccess !== today) {
    // Remove tarefas diárias antigas
    tasks = tasks.filter((task) => !task.daily);

    // Adiciona tarefas diárias novamente
    dailyTasks.forEach((text) => {
      tasks.push({
        text,
        done: false,
        daily: true,
      });
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

  tasks.forEach((task, index) => {
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
      tasks[index].done = !tasks[index].done;
      saveTasks();
      renderTasks();
      renderStreak();
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
