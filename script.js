const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const clearCompletedButton = document.getElementById("clear-completed");

let tasks = [];

loadTasksFromStorage();
renderTasks();

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const text = input.value.trim();
  if (text === "") {
    return;
  }

  const newTask = {
    id: Date.now(),
    text: text,
    completed: false,
  };

  tasks.push(newTask);
  saveTasksToStorage();
  renderTasks();

  input.value = "";
  input.focus();
});

list.addEventListener("click", function (event) {
  const item = event.target.closest(".todo-item");
  if (!item) return;

  const id = Number(item.dataset.id);

  if (event.target.matches(".todo-checkbox")) {
    toggleTaskCompleted(id, event.target.checked);
  }

  if (event.target.matches(".delete-button")) {
    deleteTask(id);
  }
});

clearCompletedButton.addEventListener("click", function () {
  tasks = tasks.filter((task) => !task.completed);
  saveTasksToStorage();
  renderTasks();
});

function toggleTaskCompleted(id, completed) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: completed } : task
  );
  saveTasksToStorage();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasksToStorage();
  renderTasks();
}

function renderTasks() {
  list.innerHTML = "";

  if (tasks.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "No tasks yet. Add your first one!";
    empty.style.color = "#6b7280";
    empty.style.fontSize = "0.9rem";
    list.appendChild(empty);
    clearCompletedButton.disabled = true;
    clearCompletedButton.style.opacity = "0.6";
    return;
  }

  clearCompletedButton.disabled = false;
  clearCompletedButton.style.opacity = "1";

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "todo-item";
    li.dataset.id = task.id;

    li.innerHTML = `
      <div class="todo-left">
        <input
          type="checkbox"
          class="todo-checkbox"
          ${task.completed ? "checked" : ""}
        />
        <span class="todo-text ${
          task.completed ? "completed" : ""
        }">${escapeHtml(task.text)}</span>
      </div>
      <button class="delete-button" type="button">Delete</button>
    `;

    list.appendChild(li);
  });
}

function saveTasksToStorage() {
  localStorage.setItem("simple-todo-tasks", JSON.stringify(tasks));
}

function loadTasksFromStorage() {
  const saved = localStorage.getItem("simple-todo-tasks");
  if (!saved) return;

  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) {
      tasks = parsed;
    }
  } catch (error) {
    console.error("Could not read saved tasks:", error);
  }
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

