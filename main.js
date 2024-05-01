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
import { renderComments } from "./modules/renderComments.js";

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
                    text: comment.text,
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

// Инициализация обработчика события для кнопок лайков: при нажатии на пустое сердечко оно закрашивается и 
// счетчик увеличивается на единицу, при нажатии на закрашенное сердечко оно становится пустым и счетчик уменшается на единицу.
const initLikeButtonListener = () => {
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
const initEditButtonListener = () => {
    const editButtonElements = document.querySelectorAll('.edit-comment-button');

    for (const editButtonElement of editButtonElements) {
        editButtonElement.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = editButtonElement.dataset.index;
            if (comments[index].isEdit === false) {
                comments[index].isEdit = true;
            }
            renderComments();
        });
    }
}

// Инициализация обработчика событий для кнопок сохранения отредактированного комментария: при нажатии на кнопку "Сохранить" поля ввода заменяется
// на отредактированный комментарий, который сохраняется в массиве JS, а кнопка "Сохранить" заменяется на кнопку "Редактировать".
const initSaveButtonListener = () => {
    const saveButtonElements = document.querySelectorAll('.save-comment-button');

    for (const saveButtonElement of saveButtonElements) {
        saveButtonElement.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = saveButtonElement.dataset.index;
            if (comments[index].isEdit === true) {
                comments[index].isEdit = false;
                comments[index].text = document.querySelectorAll('.edit-comment-form-text')[index].value;
            }
            renderComments();
        });
    }
}

// Инициализация обработчика события по клику на комментарий для ответа на комментарий: 
// не должен срабатывать при нажатии на лайк и на кнопки "Редактировать/Сохранить"
const initCommentReplyListener = () => {
    const commentElements = document.querySelectorAll('.comment');

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

// Функция для имитации запросов в API
function delay(interval) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, interval);
    });
}
