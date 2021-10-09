import { AZ, LOGIN } from "./constants.js";
import { tasksFetcher } from "./services/tasks_fetcher.js";

async function setInitialData() {
  const unorderedTasks = await tasksFetcher.index();
  this.tasks = unorderedTasks.sort((a, b) => a.title > b.title);
}

function clear() {
  this.tasks = [];
  this.onlyPending = false;
  this.onlyImportant = false;
  this.orderBy = AZ;
  this.currentSection = LOGIN;
}

function getFilteredTasks() {
  const pending = this.onlyPending ? "pending" : "";
  const important = this.onlyImportant ? "important" : "";
  const status = `${pending} | ${important}`;

  switch (status) {
    case "pending | important":
      return this.tasks.filter((task) => task.important && !task.completed);
    case "pending | ":
      return this.tasks.filter((task) => !task.completed);
    case " | important":
      return this.tasks.filter((task) => task.important);
    default:
      return this.tasks;
  }
}

function getTask(id) {
  return this.tasks.find((task) => task.id === id);
}

function createTask(createdTask) {
  this.tasks = [...this.tasks, createdTask];
}

function updateTask(id, updatedData) {
  this.tasks = this.tasks.map((task) => {
    if (task.id === id) {
      return { ...task, ...updatedData };
    }

    return task;
  });
}

function sortByAlphabet() {
  this.tasks = this.tasks.sort((a, b) => a.title > b.title);
}

function sortByDate() {
  this.tasks = this.tasks.sort(
    (a, b) => new Date(a.due_date) > new Date(b.due_date) || a.title > b.title
  );
}

function sortByImportance() {
  this.tasks = this.tasks.sort(
    (a, b) => a.important < b.important || a.title > b.title
  );
}

const STORE = {
  tasks: [],
  onlyPending: false,
  onlyImportant: false,
  orderBy: AZ,
  currentSection: LOGIN,
  getFilteredTasks,
  getTask,
  createTask,
  updateTask,
  sortByAlphabet,
  sortByDate,
  sortByImportance,
  setInitialData,
  clear,
};

export default STORE;
