import DOMHandler from "./scripts/dom_handler.js";
import Login from "./scripts/pages/login.js";
import Main from "./scripts/pages/main.js";
import { LOGIN } from "./scripts/constants.js";
import STORE from "./scripts/store.js";

(async function () {
  if (sessionStorage.getItem("token")) {
    try {
      await STORE.setInitialData();
      DOMHandler.render(Main);
    } catch (e) {
      console.log(e);
      alert("You need to log in");
      sessionStorage.clear();
      STORE.currentSection = LOGIN;
      DOMHandler.render(Login);
    }
  } else {
    DOMHandler.render(Login);
  }
})();
