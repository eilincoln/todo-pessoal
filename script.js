const sectionsData = [
  { id: "manha", title: "🌅 Antes de ir trabalhar", daily: true },
  { id: "estudos", title: "💻 Estudos – Programação", daily: true },
  { id: "ingles", title: "🇺🇸 Inglês", daily: true },
  { id: "treino", title: "🥋 Treino", daily: true },
];

let data = JSON.parse(localStorage.getItem("routine")) || {};

function save() {
  localStorage.setItem("routine", JSON.stringify(data));
}

function resetDailyIfNeeded() {
  const today = new Date().toDateString();
  const last = localStorage.getItem("lastDay");

  if (today !== last) {
    sectionsData.forEach((s) => {
      if (s.daily && data[s.id]) {
        data[s.id].forEach((t) => (t.done = false));
      }
    });
    localStorage.setItem("lastDay", today);
    save();
  }
}

function render() {
  const container = document.getElementById("sections");
  container.innerHTML = "";

  sectionsData.forEach((section) => {
    if (!data[section.id]) data[section.id] = [];

    const div = document.createElement("div");
    div.className = "section";

    div.innerHTML = `<h2>${section.title}</h2>`;

    data[section.id].forEach((task) => {
      const taskEl = document.createElement("div");
      taskEl.className = "task" + (task.done ? " done" : "");

      taskEl.innerHTML = `
        <div class="checkbox"></div>
        <span>${task.text}</span>
      `;

      taskEl.onclick = () => {
        task.done = !task.done;
        save();
        render();
        updateStreak();
      };

      div.appendChild(taskEl);
    });

    const addDiv = document.createElement("div");
    addDiv.className = "add-task";

    const input = document.createElement("input");
    input.placeholder = "Adicionar tarefa...";
    const btn = document.createElement("button");
    btn.textContent = "+";

    btn.onclick = () => {
      if (!input.value.trim()) return;
      data[section.id].push({ text: input.value, done: false });
      input.value = "";
      save();
      render();
    };

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") btn.click();
    });

    addDiv.appendChild(input);
    addDiv.appendChild(btn);
    div.appendChild(addDiv);

    container.appendChild(div);
  });
}

function updateStreak() {
  const today = new Date().toDateString();
  const lastDone = localStorage.getItem("lastDone");
  let streak = Number(localStorage.getItem("streak")) || 0;

  const allDone = sectionsData.every(
    (s) => !s.daily || (data[s.id] && data[s.id].every((t) => t.done))
  );

  if (allDone && lastDone !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    streak = lastDone === yesterday.toDateString() ? streak + 1 : 1;
    localStorage.setItem("streak", streak);
    localStorage.setItem("lastDone", today);
  }

  document.getElementById("streak").textContent = streak
    ? `🔥 ${streak} dia(s) seguidos`
    : "Um dia de cada vez.";
}

resetDailyIfNeeded();
render();
updateStreak();
