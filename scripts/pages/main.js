import SortFilterComponent from "../components/sorting_filtering.js";
import TasksComponent from "../components/tasks.js";
import DOMHandler from "../dom_handler.js";
import { SessionsFetcher } from "../services/sessions_fetcher.js";
import { tasksFetcher } from "../services/tasks_fetcher.js";
import STORE from "../store.js";
import Login from "./login.js";

async function onLogout(e) {
  e.preventDefault();

  try {
    await SessionsFetcher.logout();
    STORE.clear();
    e.target.classList.add("d-none");
    DOMHandler.render(Login);
  } catch (e) {
    console.log(e);
    alert(e);
  }
}

async function onFormSubmit(e) {
  e.preventDefault();
  const { title, due_date } = e.target;
  try {
    const newTask = {
      title: title.value,
      due_date: due_date.value,
    };
    const createdTask = await tasksFetcher.create(newTask);
    STORE.createTask(createdTask);
    DOMHandler.render(Main);
  } catch (e) {
    console.log(e);
    alert(e);
  }
}

const Main = (function () {
  let inputs;
  let tasks;

  return {
    render: function () {
      inputs = SortFilterComponent;
      tasks = TasksComponent;
      const minDate = new Date().toISOString().replace(/T.+/, "");

      return `
      ${inputs}

      ${tasks}

      <form class="js-form task__form">
        <input
          type="text"
          name="title"
          placeholder="do the dishes..."
          class="input__content"
          required
        />
        <input
          type="date"
          name="due_date"
          min=${minDate}
          class="input__content"
        />
        <button type="submit">Add Task</button>
      </form>
      `;
    },
    initListeners: () => {
      const logout = document.querySelector(".js-logout");
      const form = document.querySelector(".js-form");

      logout.classList.remove("d-none");
      logout.addEventListener("click", onLogout);
      form.addEventListener("submit", onFormSubmit);

      inputs.initListeners();
      tasks.initListeners();
    },
  };
})();

export default Main;
