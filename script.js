const introPage = document.getElementById("intro-page");
const introForm = document.getElementById("intro-form");
const userNameInput = document.getElementById("user-name");
const userPurposeInput = document.getElementById("user-purpose");
const app = document.getElementById("app");
const welcomeText = document.getElementById("welcome-text");
const purposeSubtitle = document.getElementById("purpose-subtitle");
const changeProfileBtn = document.getElementById("change-profile");
const statsEl = document.getElementById("stats");

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const clearCompletedButton = document.getElementById("clear-completed");

const STORAGE_KEY = "simple-todo-tasks";
const USER_KEY = "simple-todo-user";

let tasks = [];
let currentFilter = "all"; // "all" | "active" | "completed"

// ---- Intro / before page ----
function loadUser() {
  const saved = localStorage.getItem(USER_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

function saveUser(name, purpose) {
  localStorage.setItem(USER_KEY, JSON.stringify({ name: name.trim(), purpose: purpose.trim() }));
}

function clearUser() {
  localStorage.removeItem(USER_KEY);
}

function showApp(user) {
  introPage.classList.add("hidden");
  app.classList.remove("hidden");

  const name = user && user.name ? user.name : "there";
  welcomeText.textContent = name ? `${name}'s To Do List` : "To Do List";

  if (purposeSubtitle) {
    if (user && user.purpose) {
      purposeSubtitle.textContent = `For: ${user.purpose}`;
      purposeSubtitle.classList.remove("hidden");
    } else {
      purposeSubtitle.textContent = "";
      purposeSubtitle.classList.add("hidden");
    }
  }

  input.focus();
}

function initPages() {
  const user = loadUser();
  if (user && user.name) {
    showApp(user);
  } else {
    introPage.classList.remove("hidden");
    app.classList.add("hidden");
  }
}

introForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const name = userNameInput.value.trim();
  const purpose = userPurposeInput.value.trim();
  if (!name) return;
  saveUser(name, purpose);
  showApp({ name, purpose });
  renderTasks();
});

changeProfileBtn.addEventListener("click", function () {
  clearUser();
  app.classList.add("hidden");
  introPage.classList.remove("hidden");
  userNameInput.value = "";
  userPurposeInput.value = "";
  userNameInput.focus();
});

// ---- Filters ----
document.querySelectorAll(".filter-tab").forEach((tab) => {
  tab.addEventListener("click", function () {
    document.querySelectorAll(".filter-tab").forEach((t) => t.classList.remove("active"));
    this.classList.add("active");
    currentFilter = this.dataset.filter;
    renderTasks();
  });
});

function getFilteredTasks() {
  if (currentFilter === "active") return tasks.filter((t) => !t.completed);
  if (currentFilter === "completed") return tasks.filter((t) => t.completed);
  return tasks;
}

// ---- To-do logic ----
loadTasksFromStorage();
initPages();
renderTasks();

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const text = input.value.trim();
  if (text === "") return;

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

// Inline edit: double-click task text
list.addEventListener("dblclick", function (event) {
  const textEl = event.target.closest(".todo-text");
  if (!textEl || textEl.closest(".todo-item[data-editing]")) return;

  const item = textEl.closest(".todo-item");
  const id = Number(item.dataset.id);
  const task = tasks.find((t) => t.id === id);
  if (!task || task.completed) return;

  item.dataset.editing = "true";
  const currentText = task.text;
  const inputEl = document.createElement("input");
  inputEl.type = "text";
  inputEl.className = "todo-edit-input";
  inputEl.value = currentText;
  textEl.replaceWith(inputEl);
  inputEl.focus();
  inputEl.select();

  function finishEdit() {
    const newText = inputEl.value.trim();
    const finalText = newText || currentText;
    item.removeAttribute("data-editing");
    const span = document.createElement("span");
    span.className = "todo-text";
    span.textContent = finalText;
    inputEl.replaceWith(span);
    if (newText !== currentText && newText !== "") {
      updateTaskText(id, finalText);
    } else if (newText === "" && currentText) {
      updateTaskText(id, currentText);
    }
  }

  inputEl.addEventListener("blur", finishEdit);
  inputEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      inputEl.blur();
    }
    if (e.key === "Escape") {
      inputEl.value = currentText;
      inputEl.blur();
    }
  });
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

function updateTaskText(id, text) {
  tasks = tasks.map((task) => (task.id === id ? { ...task, text } : task));
  saveTasksToStorage();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasksToStorage();
  renderTasks();
}

function getEmptyMessage() {
  const user = loadUser();
  const purpose = user && user.purpose ? user.purpose : "this list";
  if (currentFilter === "completed") return "No completed tasks yet.";
  if (currentFilter === "active") return "No active tasks. Add one or check completed.";
  return `No tasks for ${purpose} yet. Add your first one!`;
}

function getStatsMessage() {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const active = total - completed;

  if (total === 0) return "";
  if (completed === total && total > 0) return "All done!";
  return `${active} left`;
}

function renderTasks() {
  const filtered = getFilteredTasks();
  list.innerHTML = "";

  // Stats
  if (statsEl) {
    const msg = getStatsMessage();
    statsEl.textContent = msg;
    statsEl.className = "stats" + (msg === "All done!" ? " stats-done" : "");
  }

  if (filtered.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = getEmptyMessage();
    empty.className = "empty-state";
    list.appendChild(empty);
    clearCompletedButton.disabled = tasks.filter((t) => t.completed).length === 0;
    return;
  }

  clearCompletedButton.disabled = tasks.filter((t) => t.completed).length === 0;

  filtered.forEach((task) => {
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
      <button class="delete-button" type="button" aria-label="Delete task">Delete</button>
    `;

    list.appendChild(li);
  });
}

function saveTasksToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasksFromStorage() {
  const saved = localStorage.getItem(STORAGE_KEY);
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
