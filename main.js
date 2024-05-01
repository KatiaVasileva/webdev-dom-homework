/* Задание
Разбейте ваше приложение с лентой комментариев на модули.
- main.js должен стать главным модулем, точкой входа. В нем должны остаться только импорты других модулей, а также код, который необходим для их работы.
- При разбиении проекта учтите главные принципы создания модулей и постарайтесь сделать их универсальными.

Критерии для самопроверки
 
- В проекте отсутствуют дублирования кода, повторяющиеся части вынесены в отдельные модули.
- Приложение запускается и работает без ошибок в консоли.
- Сохранена логика предыдущего функционала (лайки, цитаты).
- Только один файл скрипта (main.js) подключен в HTML-разметку.
- В проекте есть модули для работы с API и отрисовки задач.
- Проект очищен от неиспользуемого кода (объемные комментарии, неиспользуемые переменные и т. д.).
*/

import { addComment, getAllComments } from "./modules/api.js";
import { getTime, disableButton, enableButton } from "./modules/utilitities.js";
import { renderComments } from "./modules/renderElements.js";

const removeCommentButtonElement = document.querySelector('#remove-comment-button');
const addFormElement = document.querySelector('.add-form');
const commentLoaderElement = document.querySelector('.comment-loader');

// Массив для сохранения комментариев, извлеченных из API
let comments = [];

// Функция с GET-запросом для получения списка комментариев
// В случае 500-го ответа выполняется автоматический повторный запрос в API.
// В случае отсутствия интернета выводится alert.
const fetchAndRenderComments = () => {

    getAllComments()
        .then((responseData) => {
            comments = responseData.comments.map((comment) => {
                return {
                    name: comment.author.name,
                    date: getTime(new Date(comment.date)),
                    text: comment.text.replaceAll("<", "&lt;").replaceAll(">", "&gt;")
                        .replaceAll('QUOTE_BEGIN', '<div class="quote">').replaceAll('QUOTE_END', '</div>'),
                    isLiked: comment.isLiked,
                    likes: comment.likes
                }
            });
            commentLoaderElement.classList.add('hide-comment-loader');
            renderComments({ comments });
            return true;
        })
        .catch((error) => {
            console.warn(error);
            if (error.message === "Ошибка сервера") {
                fetchAndRenderComments();
            } else {
                alert("Кажется, у вас сломался интернет, попробуйте позже");
            };
        });
};

// Вызов функции с GET-запросом для получения списка комментариев из API
fetchAndRenderComments();

// Рендер-функция, которая отрисовывает форму ввода комментрия.
const renderInputBox = (name, comment) => {

    const inputBoxHtml = `
    <input
        id="name-input"
        type="text"
        class="add-form-name"
        placeholder="Введите ваше имя (не менее трех символов)"
        value="${name}"
    />
    <textarea
        id="comment-input"
        type="textarea"
        class="add-form-text"
        placeholder="Введите ваш комментарий (не менее трех символов)"
        rows="4"
    >${comment}</textarea>
    <div class="add-form-row">
        <button id="add-form-button" class="add-form-button">Написать</button>
    </div>`;
    addFormElement.innerHTML = inputBoxHtml;

    initNameInputListener();
    initCommentInputListener();
    initAddFormListener();

    renderComments({ comments });

    disableButton();

}

// Вызов рендер-функции для отрисовки формы ввода
renderInputBox("", "");

// Изначально при пустых полях ввода кнопка "Написать" неактивна.
disableButton();

// Переменные для хранения текста, введенного пользователем
let nameInput = "";
let commentInput = "";

// Валидация полей ввода: кнопка "Написать" активна, только если оба поля ввода заполнены.
// Если, заполнив оба поля, пользователь решил очистить значения в одном из полей, 
// кнопка "Написать" становится неактивной.
function initNameInputListener() {
    const nameInputElement = document.querySelector('#name-input');
    const commentInputElement = document.querySelector('#comment-input');

    nameInputElement.addEventListener('input', (e) => {
        if (e.target.value.trim().length === 0) {
            disableButton();
        }
        if (commentInputElement.value.trim() !== '' && e.target.value.trim().length > 0) {
            enableButton();
        }
        nameInput = e.target.value;
    });
};

function initCommentInputListener() {
    const commentInputElement = document.querySelector('#comment-input');
    const nameInputElement = document.querySelector('#name-input');

    commentInputElement.addEventListener('input', (e) => {
        if (e.target.value.trim().length === 0) {
            disableButton();
        }
        if (nameInputElement.value.trim() !== '' && e.target.value.trim().length > 0) {
            enableButton();
        }
        commentInput = e.target.value;
    });

};

// Функция с POST-запросом для добавления нового комментария в API и GET-запросом для получения актуального списка комментариев из API
// В случае 500-го ответа выполняется автоматический повторный запрос в API.
// В случае 400-го ответа выводится alert, форма не очищается.
// В случае отсутствия интернета выводится alert.
const fetchAndPostComment = (name, comment) => {

    addComment({ name, comment })
        .then(() => {
            return fetchAndRenderComments();
        })
        .then(() => {
            renderInputBox("", "");
        })
        .catch((error) => {
            renderInputBox(nameInput, commentInput);

            console.warn(error);

            if (error.message === "Ошибка сервера") {
                fetchAndPostComment(name, comment);
            } else if (error.message === "Плохой запрос") {
                alert("Имя и комментарий должны быть не короче трех символов");
            } else {
                alert("Кажется, у вас сломался интернет, попробуйте позже");
                enableButton();
            }
        });
};

// При нажатии на кнопку "Написать" отправляется POST-запрос для добавления нового комментария в API
// и GET-запрос для получения актуального списка комментариев из API, после чего список комментариев отрисовывается на странице, 
// поля ввода очищаются, кнопка "Написать" дезактивируется.
function initAddFormListener() {
    const addFormButtonElement = document.querySelector('.add-form-button');

    const commentInputElement = document.querySelector('#comment-input');
    const nameInputElement = document.querySelector('#name-input');

    addFormButtonElement.addEventListener('click', () => {

        fetchAndPostComment(nameInputElement.value, commentInputElement.value);

    });
};

// Добавление комментария на страницу по нажатию Enter
const inputFormElement = document.querySelector('#input-form');

inputFormElement.addEventListener('keyup', (e) => {
    const addFormButtonElement = document.querySelector('.add-form-button');

    if (e.key === 'Enter') {
        addFormButtonElement.click();
    }
});

// Удаление последнего комментария через JS массив
removeCommentButtonElement.addEventListener('click', () => {
    let index = comments.length - 1;
    comments.splice(index, 1);
    renderComments({ comments });
});
