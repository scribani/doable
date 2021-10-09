import { LOGIN, SIGN_UP } from "../constants.js";
import DOMHandler from "../dom_handler.js";
import { SessionsFetcher } from "../services/sessions_fetcher.js";
import { UsersFetcher } from "../services/users_fetcher.js";
import STORE from "../store.js";
import Main from "./main.js";

function getComponent() {
  const loginComponent = {
    submit: "Login",
    link: "Create account",
    href: "/signup",
  };
  const signupComponent = {
    submit: "Create account",
    link: "Login",
    href: "/login",
  };
  return STORE.currentSection === LOGIN ? loginComponent : signupComponent;
}

async function onFormSubmit(e) {
  e.preventDefault();
  const section = STORE.currentSection;

  try {
    const { email, password } = e.target;
    let response;

    if (section === LOGIN) {
      response = await SessionsFetcher.login(email.value, password.value);
    } else {
      response = await UsersFetcher.create(email.value, password.value);
    }

    sessionStorage.setItem("token", response.token);
    await STORE.setInitialData();
    DOMHandler.render(Main);
  } catch (e) {
    console.log(e);
    alert(e);
  }
}

function onFollowLink(e) {
  e.preventDefault();
  STORE.currentSection = STORE.currentSection === LOGIN ? SIGN_UP : LOGIN;
  DOMHandler.render(Login);
}

const Login = (function () {
  let component;

  return {
    render: function () {
      component = getComponent();
      return `
      <form class="js-form login-form">
        <div class="input">
          <label for="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="you@example.com"
            class="input__content"
            required
          />
        </div>

        <div class="input">
          <label for="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="******"
            class="input__content"
            required
          />
        </div>

        <button type="submit">${component.submit}</button>
      </form>

      <a href="${component.href}" class="js-link link">${component.link}</a>
      `;
    },
    initListeners: () => {
      const form = document.querySelector(".js-form");
      const link = document.querySelector(".js-link");
      form.addEventListener("submit", onFormSubmit);
      link.addEventListener("click", onFollowLink);
    },
  };
})();

export default Login;
