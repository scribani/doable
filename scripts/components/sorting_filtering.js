import { AZ, IMPORTANT, DATE } from "../constants.js";
import DOMHandler from "../dom_handler.js";
import Main from "../pages/main.js";
import STORE from "../store.js";

function onSortTasks(e) {
  switch (e.target.value) {
    case DATE:
      STORE.orderBy = DATE;
      STORE.sortByDate();
      break;
    case IMPORTANT:
      STORE.orderBy = IMPORTANT;
      STORE.sortByImportance();
      break;
    default:
      STORE.orderBy = AZ;
      STORE.sortByAlphabet();
      break;
  }

  DOMHandler.render(Main);
}

function onFilterPending(e) {
  e.preventDefault();
  STORE.onlyPending = !STORE.onlyPending;
  DOMHandler.render(Main);
}

function onFilterImportant(e) {
  e.preventDefault();
  STORE.onlyImportant = !STORE.onlyImportant;
  DOMHandler.render(Main);
}

const SortFilterComponent = (function () {
  let order;

  return {
    toString: () => {
      order = STORE.orderBy;

      return `
      <div class="inline__input mt-12">
        <p class="label">Sort</p>

        <select class="js-sort select__input">
          <option
            value=${AZ}
            ${order === AZ ? "selected" : ""}
          >
            Alphabetical (a-z)
          </option>
          <option
            value=${DATE}
            ${order === DATE ? "selected" : ""}
          >
            Due date
          </option>
          <option
            value=${IMPORTANT}
            ${order === IMPORTANT ? "selected" : ""}
          >
            Importance
          </option>
        </select>
      </div>

      <div class="inline__input">
        <p class="label">Show</p>

        <div class="checkbox__container">
          <div class="checkbox">
            <input
              type="checkbox"
              id="pending"
              class="js-pending checkbox__input"
              ${STORE.onlyPending ? "checked" : ""}
            />
            <label for="pending">Only pending</label>
          </div>

          <div class="checkbox">
            <input
              type="checkbox"
              id="important"
              class="js-important checkbox__input"
              ${STORE.onlyImportant ? "checked" : ""}
            />
            <label for="important">Only important</label>
          </div>
        </div>
      </div>
      `;
    },
    initListeners: () => {
      const sortSelect = document.querySelector(".js-sort");
      const pendingCheckbox = document.querySelector(".js-pending");
      const importantCheckbox = document.querySelector(".js-important");

      sortSelect.addEventListener("change", onSortTasks);
      pendingCheckbox.addEventListener("click", onFilterPending);
      importantCheckbox.addEventListener("click", onFilterImportant);
    },
  };
})();

export default SortFilterComponent;
