/* Задача
Вам нужно «оживить» кнопку и счетчик лайков у каждого комментария.
Целевые сценарии:
Я (как пользователь) могу лайкнуть понравившийся комментарий. Сердечко лайка станет закрашенным, а счетчик лайков увеличится на 1.
Я (как пользователь) могу убрать лайк, который поставил по ошибке. Сердечко лайка станет пустым, а счетчик лайков уменьшится на 1.

Критерии выполнения задания:

+ Работают оба целевых сценария, связанных с кнопкой лайка. Они работают для каждого комментария в ленте.
+ Информация о комментариях должна быть предварительно сохранена в массиве. Когда страница загружается, 
JavaScript должен использовать этот массив для создания HTML-разметки каждого комментария.
+ Для каждого комментария в массиве данных должно быть свойство, отвечающее за информацию о том, лайкнул ли кто-то этот комментарий.
+ Для изменения состояния кнопки «лайк» нельзя использовать методы classList.add и classList.remove для добавления или удаления класса активности. 
Нужно воспользоваться булевым значением, которое и будет сигнализировать о том, нужна ли отрисовка класса в разметке.
+ Изменение количества лайков не должно происходить путем изменения свойства innerHTM. Нужно работать только с исходным массивом данных.
+ При добавлении нового комментария кнопки лайков продолжают работать корректно.
+ В коде реализована рендер-функция, которая отрисовывает список комментариев.

Дополнительное задание:
Реализуйте дополнительный функционал ленты комментариев: возможность редактировать любые комментарии.
Вот целевой сценарий: «Я (как пользователь) могу отредактировать любой уже написанный комментарий».

Критерии выполнения задания:
+ Пользователь должен иметь возможность отредактировать любой уже написанный комментарий.
+ Для этого под каждым комментарием должна появиться кнопка «Редактировать».
+ При клике на кнопку «Редактировать» текст комментария должен замениться полем ввода в формате textarea, 
а кнопка «Редактировать» должна быть заменена на кнопку «Сохранить».
+ В поле ввода должен быть автоматически подставлен текущий текст комментария для удобного редактирования.
+ Пользователь может внести изменения в текст комментария, используя поле ввода.
+ При клике на кнопку «Сохранить» введенные изменения должны быть сохранены в массив данных, а интерфейс должен вернуться в исходное состояние.
*/

const commentListElement = document.getElementById('comment-list');
const addFormButtonElement = document.getElementById('add-form-button');
const nameInputElement = document.getElementById('name-input');
const commentInputElement = document.getElementById('comment-input');
const inputFormElement = document.getElementById('input-form');
const removeCommentButtonElement = document.getElementById('remove-comment-button');
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
        likeButtonElement.addEventListener('click', function (e) {
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
            const index = editButtonElement.dataset.index;
            if (comments[index].isEdit === false) {
                comments[index].isEdit = true;
            }
            renderComments();
        })
    }
}

// Инициализация обработчика событий для кнопок сохранения отредактированного комментария: при нажатии на кнопку "Сохранить" поля ввода заменяется
// на отредактированный комментарий, который сохраняется в массиве JS, а кнопка "Сохранить" заменяется на кнопку "Редактировать".
const initSaveButtonListener = () => {
    const saveButtonElements = document.querySelectorAll('.save-comment-button');
    for (const saveButtonElement of saveButtonElements) {
        saveButtonElement.addEventListener('click', (e) => {
            const index = saveButtonElement.dataset.index;
            if (comments[index].isEdit === true) {
                comments[index].isEdit = false;
                comments[index].text = document.querySelectorAll('.edit-comment-form-text')[index].value;
            }
            renderComments();
        })
    }
}

// Рендер-функция, которая отрисовывает список комментариев.
const renderComments = () => {
    const commentHtml = comments.map((comment, index) => {
        return `<li class="comment">
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
        name: nameInputElement.value,
        date: getTime(),
        text: commentInputElement.value,
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








