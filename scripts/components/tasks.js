import DOMHandler from "../dom_handler.js";
import Main from "../pages/main.js";
import { tasksFetcher } from "../services/tasks_fetcher.js";
import STORE from "../store.js";

async function onCompleteTask(e) {
  e.preventDefault();

  if (e.target.classList.contains("js-completed")) {
    const taskEl = e.target.closest(".js-task");
    const id = parseInt(taskEl.dataset.id);
    const task = STORE.getTask(id);
    const updatedData = { completed: !task.completed };

    try {
      await tasksFetcher.edit(id, updatedData);
      STORE.updateTask(id, updatedData);
      DOMHandler.render(Main);
    } catch (e) {
      console.log(e);
      alert(e);
    }
  }
}

async function onImportantTask(e) {
  const icon = e.target.closest(".icon");

  if (icon) {
    const taskEl = e.target.closest(".js-task");
    const id = parseInt(taskEl.dataset.id);
    const task = STORE.getTask(id);
    const updatedData = { important: !task.important };

    try {
      await tasksFetcher.edit(id, updatedData);
      STORE.updateTask(id, updatedData);
      DOMHandler.render(Main);
    } catch (e) {
      console.log(e);
      alert(e);
    }
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

function generateTaskTemplate(task) {
  const completedTask = task.completed ? "completed" : "";
  const dueDate = task.due_date
    ? `<p class="task__date ${completedTask}">${formatDate(task.due_date)}</p>`
    : "";

  let importance;
  if (task.important && task.completed) {
    importance = "important-completed";
  } else if (task.important) {
    importance = "important";
  } else {
    importance = "not-important";
  }

  return `
  <li data-id=${task.id} class="js-task task__container">
    <input
      type="checkbox"
      id="complete-${task.id}"
      class="js-completed checkbox__input mt-4"
      ${task.completed ? "checked" : ""}
    />

    <div class="task__details">
      <label for="complete-${
        task.id
      }" class="js-completed js-title task__title ${completedTask}"
        >${task.title}</label
      >
      ${dueDate}
    </div>

    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      class="js-important ${importance} icon mt-4"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM9 12C9 12.5523 8.55229 13 8 13C7.44772 13 7 12.5523 7 12C7 11.4477 7.44772 11 8 11C8.55229 11 9 11.4477 9 12ZM8 3C7.44772 3 7 3.44772 7 4V8C7 8.55228 7.44772 9 8 9C8.55229 9 9 8.55228 9 8V4C9 3.44772 8.55229 3 8 3Z"
      />
    </svg>
  </li>
  `;
}

const TasksComponent = (function () {
  let tasks;

  return {
    toString: () => {
      tasks = STORE.getFilteredTasks();

      return `
      <ul class="js-tasks-list tasks__list">
        ${tasks.map((task) => generateTaskTemplate(task)).join("")}
      </ul>
      `;
    },
    initListeners: () => {
      const tasksList = document.querySelector(".js-tasks-list");

      tasksList.addEventListener("click", onCompleteTask);
      tasksList.addEventListener("click", onImportantTask);
    },
  };
})();

export default TasksComponent;
