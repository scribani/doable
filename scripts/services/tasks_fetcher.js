import { apiFetch } from "./api_fetch.js";

export const tasksFetcher = (() => {
  return {
    index: () =>
      apiFetch("tasks", "GET", {
        Authorization: `Token token=${sessionStorage.getItem("token")}`,
      }),

    create: (newTask) =>
      apiFetch(
        "tasks",
        "POST",
        {
          "Content-Type": "application/json",
          Authorization: `Token token=${sessionStorage.getItem("token")}`,
        },
        newTask
      ),
    edit: (id, updatedTask) =>
      apiFetch(
        `tasks/${id}`,
        "PATCH",
        {
          "Content-Type": "application/json",
          Authorization: `Token token=${sessionStorage.getItem("token")}`,
        },
        updatedTask
      ),
  };
})();
