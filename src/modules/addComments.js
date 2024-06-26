import { addComment } from "./api.js";
import { renderInputBox, renderLogin } from "./renderElements.js";
import { enableButton, disableButton } from "./utilitities.js";
import { fetchAndRenderCommentsAfterLogin } from "./fetchAndRenderComments.js";
import { userName } from "./loginRegisterComponent.js";

// Переменные для хранения текста, введенного пользователем
// eslint-disable-next-line no-unused-vars
let nameInput = "";
let commentInput = "";

// Валидация полей ввода: кнопка "Написать" активна, только если оба поля ввода заполнены. Если, заполнив оба поля, пользователь решил очистить значения в одном из полей,
// кнопка "Написать" становится неактивной.
export function initNameInputListener() {
    const nameInputElement = document.querySelector("#name-input");
    const commentInputElement = document.querySelector("#comment-input");

    nameInputElement.addEventListener("input", (e) => {
        if (e.target.value.trim().length === 0) {
            disableButton();
        }
        if (
            commentInputElement.value.trim() !== "" &&
            e.target.value.trim().length > 0
        ) {
            enableButton();
        }
        nameInput = e.target.value;
    });
}

export function initCommentInputListener() {
    const commentInputElement = document.querySelector("#comment-input");
    const nameInputElement = document.querySelector("#name-input");

    commentInputElement.addEventListener("input", (e) => {
        if (e.target.value.trim().length === 0) {
            disableButton();
        }
        if (
            nameInputElement.value.trim() !== "" &&
            e.target.value.trim().length > 0
        ) {
            enableButton();
        }
        commentInput = e.target.value;
    });
}

// Функция с POST-запросом для добавления нового комментария в API и GET-запросом для получения актуального списка комментариев из API
// В случае 500-го ответа выполняется автоматический повторный запрос в API.
// В случае 400-го ответа выводится alert, форма не очищается.
// В случае отсутствия интернета выводится alert.
export function fetchAndPostComment(name, comment) {
    const inpuFormBoxElement = document.querySelector("#input-form-box");

    addComment({ name, comment })
        .then(() => {
            inpuFormBoxElement.innerHTML = `
                <div class="comment-add-container">
                    <p>Комментарий добавляется...</p>
                    <img src="./spinner.svg" class="spinner">
                </div>
            `;
            return fetchAndRenderCommentsAfterLogin();
        })
        .catch((error) => {
            renderInputBox(userName, commentInput);

            console.warn(error);

            if (error.message === "Ошибка сервера") {
                fetchAndPostComment(name, comment);
            } else if (error.message === "Плохой запрос") {
                alert("Имя и комментарий должны быть не короче трех символов");
            } else if (error.message === "Нет авторизации") {
                alert("Вы не авторизованы");
                renderLogin();
            } else {
                alert("Кажется, у вас сломался интернет, попробуйте позже");
                enableButton();
            }
        });
}

// При нажатии на кнопку "Написать" отправляется POST-запрос для добавления нового комментария в API
// и GET-запрос для получения актуального списка комментариев из API, после чего список комментариев отрисовывается на странице,
// поля ввода очищаются, кнопка "Написать" дезактивируется.
export function initAddFormListener() {
    const addFormButtonElement = document.querySelector(".add-form-button");

    const commentInputElement = document.querySelector("#comment-input");
    const nameInputElement = document.querySelector("#name-input");

    addFormButtonElement.addEventListener("click", () => {
        fetchAndPostComment(nameInputElement.value, commentInputElement.value);
    });

    const inputFormElement = document.querySelector("#input-form");

    // Обратчик события ввода комментария по Enter
    inputFormElement.addEventListener("keyup", (e) => {
        const addFormButtonElement = document.querySelector(".add-form-button");

        if (e.key === "Enter") {
            addFormButtonElement.click();
        }
    });
}
