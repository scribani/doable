import { apiFetch } from "./api_fetch.js";

export const UsersFetcher = (() => {
  return {
    create: (email, password) =>
      apiFetch(
        "signup",
        "POST",
        {
          "Content-Type": "application/json",
        },
        { email, password }
      ),
  };
})();
