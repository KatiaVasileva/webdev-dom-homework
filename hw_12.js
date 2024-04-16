/* Задание
Подключите приложение комментариев к API комментариев, в результате приложение должно получать список комментариев из API 
и добавлять новый комментарий через API.

Условия проверки и выполнения задания:

+ После перезагрузки страницы список комментариев не сбрасывается:
    + при запуске приложение загружает список комментариев из API и выводит его на экран;
    + при добавлении комментария приложение сохраняет комментарий в API, а затем выводит добавленный комментарий в список.
+ Функционал лайков работает локально, то есть можно поставить и снять лайк, но после перезагрузки страницы счетчик лайков сбросится.

Дополнительное задание
Добавление коммента в API занимает некоторое время, и до тех пор, пока запрос не завершится, комментарий в списке еще не появится.
Задача: показать пользователю, что с приложением всё в порядке, просто запрос еще не выполнился. 
Для этого на время загрузки скроем форму добавления, вместо нее покажем текст «Комментарий добавляется»
*/

const commentListElement = document.querySelector('#comment-list');
const removeCommentButtonElement = document.querySelector('#remove-comment-button');
const addFormElement = document.querySelector('.add-form');

// Массив для сохранения комментариев, извлеченных из API
let comments = [];

// Функция с GET-запросом для получения списка комментариев
function getAllComments() {
    fetch(
        "https://wedev-api.sky.pro/api/v1/katia-vasileva/comments",
        {
            method: "GET"
        }
    ).then((response) => {
        response.json().then((responseData) => {
            comments = responseData.comments.map((comment) => {
                return {
                    name: comment.author.name,
                    date: getTime(new Date(comment.date)),
                    text: comment.text,
                    isLiked: comment.isLiked,
                    likes: comment.likes
                }
            });
            renderComments();
        })
    });

};

// Вызов функции с GET-запросом для получения списка комментариев из API
getAllComments();

// Инициализация обработчика события для кнопок лайков: при нажатии на пустое сердечко оно закрашивается и 
// счетчик увеличивается на единицу, при нажатии на закрашенное сердечко оно становится пустым и счетчик уменшается на единицу.
const initLikeButtonListener = () => {
    const likeButtonElements = document.querySelectorAll('.like-button');

    for (const likeButtonElement of likeButtonElements) {
        likeButtonElement.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = likeButtonElement.dataset.index;
            if (comments[index].isLiked === false) {
                comments[index].isLiked = true;
                comments[index].likes++;
            } else {
                comments[index].isLiked = false;
                comments[index].likes--;
            }
            renderComments();
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

// Функция для получения даты и времени в формате: дд.мм.гг чч:мм
function getTime(date) {
    let timeOptions = { hour: '2-digit', minute: '2-digit' };
    let formattedTime = date.toLocaleTimeString('ru-Ru', timeOptions);

    let dateOptions = { day: '2-digit', month: '2-digit', year: '2-digit' };
    let formattedDate = date.toLocaleDateString('ru-Ru', dateOptions);

    return formattedDate + ' ' + formattedTime;
}

// Функция для дезактивирования кнопки "Написать"
const disableButton = () => {
    const addFormButtonElement = document.querySelector('.add-form-button');
    addFormButtonElement.disabled = true;
    addFormButtonElement.classList.add('add-form-button_disabled');
}

// Функция для активирования кнопки "Написать"
const enableButton = () => {
    const addFormButtonElement = document.querySelector('.add-form-button');
    addFormButtonElement.disabled = false;
    addFormButtonElement.classList.remove('add-form-button_disabled');
}

// Рендер-функция, которая отрисовывает список комментариев.
const renderComments = () => {
    const commentHtml = comments.map((comment, index) => {
        return `<li class="comment" data-index="${index}">
        <div class="comment-header">
          <div>${comment.name}</div>
          <div>${comment.date}</div>
        </div>
        <div class="comment-body">
          <div class="comment-text">${comment.text}</div>
        </div>
        <button data-index="${index}" id="edit-comment-button" class="${comment.isEdit === false ? 'edit-comment-button' : 'edit-comment-button_none'}">Редактировать</button>
        <button data-index="${index}" id="save-comment-button" class="${comment.isEdit === true ? 'save-comment-button' : 'save-comment-button_none'}">Сохранить</button>
        <div class="comment-footer">
          <div class="likes">
            <span class="likes-counter">${comment.likes}</span>
            <button data-index="${index}" class="like-button ${comment.isLiked === true ? '-active-like' : 'inherit'}"></button>
          </div>
        </div>
      </li>`
    }).join("");
    commentListElement.innerHTML = commentHtml;

    initLikeButtonListener();
    // initEditButtonListener();
    // initSaveButtonListener();
    // initCommentReplyListener();
}

// Рендер-функция, которая отрисовывает форму ввода комментрия.
const renderInputBox = () => {
    const inputBoxHtml = `
    <input
        id="name-input"
        type="text"
        class="add-form-name"
        placeholder="Введите ваше имя (не менее трех символов)"
    />
    <textarea
        id="comment-input"
        type="textarea"
        class="add-form-text"
        placeholder="Введите ваш комментарий (не менее трех символов)"
        rows="4"
    ></textarea>
    <div class="add-form-row">
        <button id="add-form-button" class="add-form-button">Написать</button>
    </div>`;
    addFormElement.innerHTML = inputBoxHtml;

    initNameInputListener();
    initCommentInputListener();
    initAddFormListener();

    renderComments();

    disableButton();

}

// Вызов рендер-функции для отрисовки списка комментариев
renderComments();

// Вызов рендер-функции для отрисовки формы ввода
renderInputBox();

// Изначально при пустых полях ввода кнопка "Написать" неактивна.
disableButton();

// Валидация полей ввода: кнопка "Написать" активна, только если оба поля ввода заполнены.
// Если, заполнив оба поля, пользователь решил очистить значения в одном из полей, 
// кнопка "Написать" становится неактивной.
function initNameInputListener() {
    const nameInputElement = document.querySelector('#name-input');
    const commentInputElement = document.querySelector('#comment-input');

    nameInputElement.addEventListener('input', (e) => {
        if (e.target.value.trim().length < 3) {
            disableButton();
        }
        if (commentInputElement.value.trim() !== '' && e.target.value.trim().length >= 3) {
            enableButton();
        }
    });
};

function initCommentInputListener() {
    const commentInputElement = document.querySelector('#comment-input');
    const nameInputElement = document.querySelector('#name-input');

    commentInputElement.addEventListener('input', (e) => {
        if (e.target.value.trim().length < 3) {
            disableButton();
        }
        if (nameInputElement.value.trim() !== '' && e.target.value.trim().length >= 3) {
            enableButton();
        }
    });

};

// При нажатии на кнопку "Написать" отправляется POST-запрос для добавления нового комментария в API
// и GET-запрос для получения актуального списка комментариев из API, после чего список комментариев отрисовывается на странице, 
// поля ввода очищаются, кнопка "Написать" дезактивируется.
function initAddFormListener() {
    const addFormButtonElement = document.querySelector('.add-form-button');

    addFormButtonElement.addEventListener('click', () => {

        const nameInputElement = document.querySelector('#name-input');
        const commentInputElement = document.querySelector('#comment-input');

        addFormElement.innerHTML = `
        <div class="comment-add-container">
            <p>Комментарий добавляется...</p>
            <img src="./spinner.svg" class="spinner">
        </div>
        `;

        setTimeout(() => {
            fetch(
                "https://wedev-api.sky.pro/api/v1/katia-vasileva/comments",
                {
                    method: "POST",
                    body: JSON.stringify({
                        text: commentInputElement.value.replaceAll("<", "&lt;").replaceAll(">", "&gt;"),
                        name: nameInputElement.value.replaceAll("<", "&lt;").replaceAll(">", "&gt;")
                            .replaceAll('QUOTE_BEGIN', '<div class="quote">').replaceAll('QUOTE_END', '</div>')
                    })
                }
            ).then((response) => {
                response.json().then((responseData) => {
                    comments = responseData.comments;
                })
            });

            // nameInputElement.value = '';
            // commentInputElement.value = '';

            renderInputBox();

            getAllComments();
        }, 3000);
    });
}


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
    renderComments();
});
