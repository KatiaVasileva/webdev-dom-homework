/* Задание

1) Реализовать указанный ниже пользовательский сценарий:
Сценарий «Ответы на комментарии»
Я, как пользователь, могу ответить на комментарий. 
Когда я кликаю на комментарий в списке, в форму добавления комментария подставляется текст и имя автора этого комментария. 
Я могу продолжить этот текст, и, таким образом, я отвечу на комментарий.

2) Исправить уязвимость:
После добавления комментария введенные теги не должны срабатывать, то есть имя и текст должны отображаться так, как их ввел пользователь: 
`<strong> Глеб </strong>` и <h1> Коммент </h1>.

Условия проверки и выполнения задания
+ Работает сценарий ответа на комментарий:
    + ответ подставляется при клике на карточку комментария в списке;
    + ответ не подставляется при клике на лайк.
+ Исправлена уязвимость про HTML-теги, при отправке HTML-кода в имени или тексте он должен выводиться как текст.

Дополнительное задание:
+ Сделайте так, чтобы текст и имя автора комментария, на который отвечает пользователь, находились внутри блока «Цитаты»
*/


const commentListElement = document.querySelector('#comment-list');
const addFormButtonElement = document.querySelector('#add-form-button');
const nameInputElement = document.querySelector('#name-input');
const commentInputElement = document.querySelector('#comment-input');
const inputFormElement = document.querySelector('#input-form');
const removeCommentButtonElement = document.querySelector('#remove-comment-button');
const likeButtonElements = document.querySelectorAll('.like-button');

// Массив для хранения комментариев
const comments = [
    {
        name: "Глеб Фокин",
        date: "12.02.22 12:18",
        text: "Это будет первый комментарий на этой странице",
        isLiked: false,
        likes: 3,
        isEdit: false
    },
    {
        name: "Варвара Н.",
        date: "13.02.22 19:22",
        text: "Мне нравится как оформлена эта страница! ❤",
        isLiked: true,
        likes: 75,
        isEdit: false
    }
];

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
            const index = commentElement.dataset.index;
            commentInputElement.value = `QUOTE_BEGIN ${comments[index].name}: \n ${comments[index].text}QUOTE_END \n \n`;
        });
    }
}

// Инициализация обработчика события по клику на поле ввода редактирования комментария
// для предотвращения всплытия события по клику на комментарий 
// (чтобы при редактировании комментария не срабатывала событие ответа на комментарий)
const initEditCommentListener = () => {
    const editCommentElements = document.querySelectorAll('.edit-comment-form');
    for (const editCommentElement of editCommentElements) {
        editCommentElement.addEventListener('click', (e) => {
             e.stopPropagation();
        });
    }
}

// Рендер-функция, которая отрисовывает список комментариев.
const renderComments = () => {
    const commentHtml = comments.map((comment, index) => {
        return `<li class="comment" data-index="${index}">
        <div class="comment-header">
          <div>${comment.name}</div>
          <div>${comment.date}</div>
        </div>
        <div class="${comment.isEdit === false ? 'comment-body' : 'comment-body_none'}">
          <div class="comment-text">${comment.text}</div>
        </div>
        <div class="${comment.isEdit === true ? 'edit-comment-form' : 'edit-comment-form_none'}">
            <textarea
                id="comment-input"
                type="textarea"
                class="edit-comment-form-text"
                placeholder="Введите ваш комментарий"
                rows="4"
                data-index="${index}"
            >${comment.text}</textarea>
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
    initEditButtonListener();
    initSaveButtonListener();
    initCommentReplyListener();
    initEditCommentListener();
}

// Вызов рендер-функции для отрисовки списка комментариев
renderComments();

// Функция для получения даты и времени в формате: дд.мм.гг чч:мм
const getTime = () => {
    let date = new Date();

    let timeOptions = { hour: '2-digit', minute: '2-digit' };
    let formattedTime = date.toLocaleTimeString('ru-Ru', timeOptions);

    let dateOptions = { day: '2-digit', month: '2-digit', year: '2-digit' };
    let formattedDate = date.toLocaleDateString('ru-Ru', dateOptions);

    return formattedDate + ' ' + formattedTime;
}

// Функция для дезактивирования кнопки "Написать"
const disableButton = () => {
    addFormButtonElement.disabled = true;
    addFormButtonElement.classList.add('add-form-button_disabled');
}

// Функция для активирования кнопки "Написать"
const enableButton = () => {
    addFormButtonElement.disabled = false;
    addFormButtonElement.classList.remove('add-form-button_disabled');
}

// Изначально при пустых полях ввода кнопка "Написать" неактивна.
disableButton();

// Валидация полей ввода: кнопка "Написать" активна, только если оба поля ввода заполнены.
// Если, заполнив оба поля, пользователь решил очистить значения в одном из полей, 
// кнопка "Написать" становится неактивной.
nameInputElement.addEventListener('input', (e) => {
    if (e.target.value.trim() === '') {
        disableButton();
    }
    if (e.target.value.trim() !== '' && commentInputElement.value.trim() !== '') {
        enableButton();
    }
});

commentInputElement.addEventListener('input', (e) => {
    if (e.target.value.trim() === '') {
        disableButton();
    }
    if (e.target.value.trim() !== '' && nameInputElement.value.trim() !== '') {
        enableButton();
    }
});

// При нажатии на кнопку "Написать": комментарий сохраняется в массиве JS и отрисовывается на странице, поля ввода очищаются,
// кнопка "Написать" дезактивируется.
addFormButtonElement.addEventListener('click', () => {
    comments.push({
        name: nameInputElement.value.replaceAll("<", "&lt;").replaceAll(">", "&gt;"),
        date: getTime(),
        text: commentInputElement.value.replaceAll("<", "&lt;").replaceAll(">", "&gt;")
            .replaceAll('QUOTE_BEGIN', '<div class="quote">').replaceAll('QUOTE_END', '</div>'),
        isLiked: false,
        likes: 0,
        isEdit: false
    });

    renderComments();

    nameInputElement.value = '';
    commentInputElement.value = '';

    disableButton();
});

// Добавление комментария на страницу по нажатию Enter
inputFormElement.addEventListener('keyup', (e) => {
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
