import { setToken, login } from "./api.js";
import { renderComments } from "./renderElements.js";

// Инициализация обработчика события для кнопок лайков: при нажатии на пустое сердечко оно закрашивается и 
// счетчик увеличивается на единицу, при нажатии на закрашенное сердечко оно становится пустым и счетчик уменшается на единицу.
export function initLikeButtonListener({ comments }) {
    const likeButtonElements = document.querySelectorAll('.like-button');

    for (const likeButtonElement of likeButtonElements) {
        likeButtonElement.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = likeButtonElement.dataset.index;

            likeButtonElement.classList.add('-loading-like');

            delay(2000)
                .then(() => {
                    comments[index].likes = comments[index].isLiked
                        ? comments[index].likes - 1
                        : comments[index].likes + 1;
                    comments[index].isLiked = !comments[index].isLiked;
                    likeButtonElement.classList.remove('-loading-like');
                    renderComments({ comments });
                });
        });

    }
}

// Инициализация обработчика событий для кнопок редактирования комментария: при нажатии на кнопку "Редактировать" текст комментария заменяется
// на поле ввода, в которое подставлен текущий текст комментария, а кнопка "Редактировать" заменяется на кнопку "Сохранить".
// TODO Проверить работу функции после реализации кнопки редактирования
export function initEditButtonListener({ comments }) {
    const editButtonElements = document.querySelectorAll('.edit-comment-button');

    for (const editButtonElement of editButtonElements) {
        editButtonElement.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = editButtonElement.dataset.index;
            if (comments[index].isEdit === false) {
                comments[index].isEdit = true;
            }
            renderComments({ comments });
        });
    }
}

// Инициализация обработчика событий для кнопок сохранения отредактированного комментария: при нажатии на кнопку "Сохранить" поля ввода заменяется
// на отредактированный комментарий, который сохраняется в массиве JS, а кнопка "Сохранить" заменяется на кнопку "Редактировать".
// TODO Проверить работу функции после реализации кнопки сохранения
export function initSaveButtonListener({ comments }) {
    const saveButtonElements = document.querySelectorAll('.save-comment-button');

    for (const saveButtonElement of saveButtonElements) {
        saveButtonElement.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = saveButtonElement.dataset.index;
            if (comments[index].isEdit === true) {
                comments[index].isEdit = false;
                comments[index].text = document.querySelectorAll('.edit-comment-form-text')[index].value;
            }
            renderComments({ comments });
        });
    }
}

// Инициализация обработчика события по клику на комментарий для ответа на комментарий: 
// не должен срабатывать при нажатии на лайк и на кнопки "Редактировать/Сохранить"
export function initCommentReplyListener({ comments }) {
    const commentElements = document.querySelectorAll('.comment');
    const commentInputElement = document.querySelector('#comment-input');

    for (const commentElement of commentElements) {
        commentElement.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-comment-form-text')) {
                return;
            }
            const index = commentElement.dataset.index;
            commentInputElement.value = `QUOTE_BEGIN ${comments[index].name}: \n ${comments[index].text}QUOTE_END \n \n`;
        });
    }
}

// Инициализация обработчика события по клику на кнопку "Войти" в форме авторизации
export function initLoginButtonListener() {
    const loginButtonElement = document.querySelector("#login-button");
    const loginInputElement = document.querySelector("#login-input");
    const passwordInputElement = document.querySelector("#password-input");

    loginButtonElement.addEventListener("click", () => {
        login(
            {
                login: loginInputElement.value,
                password: passwordInputElement.value
            }
        )
        .then((responseData) => {
            setToken(responseData.user.token);
        })
        .catch((error) => {
            if (error.message === "Плохой запрос") {
                alert("Вы ввели неправильные данные");
            }
        });

        loginInputElement.value = "";
        passwordInputElement.value = "";
    });
}

// Функция для имитации запросов в API
function delay(interval) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, interval);
    });
}