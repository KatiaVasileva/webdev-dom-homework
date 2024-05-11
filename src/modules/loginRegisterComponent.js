import { setToken, login, register } from "./api.js";
import { renderLogin, renderRegister } from "./renderElements.js";
import {
    fetchAndRenderComments,
    fetchAndRenderCommentsAfterLogin,
} from "./fetchAndRenderComments.js";
import _ from "lodash";

// Переменная для сохранения имени авторизованного пользователя
export let userName;

// Инициализация обработчика события по клику на кнопку "Войти" в форме авторизации
export function initLoginButtonListener() {
    const loginButtonElement = document.querySelector("#login-button");
    const loginInputElement = document.querySelector("#login-input");
    const passwordInputElement = document.querySelector("#password-input");

    loginButtonElement.addEventListener("click", () => {
        login({
            login: loginInputElement.value,
            password: passwordInputElement.value,
        })
            .then((responseData) => {
                setToken(responseData.user.token);
                userName = responseData.user.name;
                localStorage.setItem("token", responseData.user.token);
                localStorage.setItem("name", responseData.user.name);
            })
            .then(() => {
                loginButtonElement.textContent = "Выполняется авторизация";
                loginButtonElement.classList.add(
                    "login-form-button_text-color",
                );
            })
            .then(() => {
                fetchAndRenderCommentsAfterLogin();
                return true;
            })
            .catch((error) => {
                if (error.message === "Плохой запрос") {
                    alert("Вы ввели неправильные данные");
                }
            });
    });
}

// Инициализация обработчика события по клику на ссылку "Зарегистрироваться" в форме авторизации
export function initRegisterLinkListener() {
    const registerLinkElement = document.querySelector("#register-link");

    registerLinkElement.addEventListener("click", () => {
        renderRegister();
    });
}

// Инициализация обработчика события по клику на кнопку "Зарегистрироваться" в форме регистрации
export function initRegisterButtonListener() {
    const registerButtonElement = document.querySelector("#register-button");
    const registerNameInputElement = document.querySelector(
        "#register-name-input",
    );
    const registerLoginInputElement = document.querySelector(
        "#register-login-input",
    );
    const registerPasswordInputElement = document.querySelector(
        "#register-password-input",
    );

    registerButtonElement.addEventListener("click", () => {
        register({
            login: registerLoginInputElement.value,
            name: _.capitalize(registerNameInputElement.value),
            password: registerPasswordInputElement.value,
        })
            .then(() => {
                registerButtonElement.textContent = "Выполняется регистрация";
                registerButtonElement.classList.add(
                    "register-form-button_text-color",
                );
            })
            .then(() => {
                renderLogin();
                return true;
            })
            .catch((error) => {
                if (error.message === "Пользователь уже существует") {
                    alert("Такой пользователь уже существует");
                }
            });
    });
}

// Инициализация обработчика события по клику на ссылку "Войти" в форме регистрации
export function initLoginLinkListener() {
    const loginLinkElement = document.querySelector("#login-link");

    loginLinkElement.addEventListener("click", () => {
        renderLogin();
    });
}

// Инициализация обработчика события по клику на кнопку "Выйти" в форме регистрации
export function initLogoutButtonListener() {
    const logoutButtonElement = document.querySelector("#logout-button");
    const inpuFormBoxElement = document.querySelector("#input-form-box");

    logoutButtonElement.addEventListener("click", () => {
        localStorage.clear();
        fetchAndRenderComments();
        inpuFormBoxElement.innerHTML = "";
    });
}
