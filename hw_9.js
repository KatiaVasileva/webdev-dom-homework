/* Задание
Целевой сценарий продукта: «Я как пользователь могу ввести свое имя и комментарий, 
нажать кнопку „Написать”, и мой комментарий появится на странице».

Условия проверки и выполнения задания
- Работает целевой сценарий.
- Кнопка добавляет комментарий в список.
- У полей «Имя» и «Комментарий» есть валидация: нельзя добавить комментарий, не указав своего имени или текста комментария.
- При добавлении комментария в списке подставляются текущая дата и время.
- Новые комментарии появляются с 0 лайков.

Дополнительные задания:
- Расширенная валидация:
Сделайте так, чтобы кнопка «Написать» выключалась (становится некликабельной, красится в серый цвет), если имя или текст в форме незаполненные.
- Добавление элемента в список по нажатию Enter
Целевой сценарий продукта: «Я как пользователь могу набрать в поле ввода имя и текст, нажать клавишу Enter, и комментарий добавится в список».
Нажатие клавиши Enter должно вызывать ту же логику, которая срабатывает при клике на кнопку «Добавить».
- Удаление последнего элемента
Добавьте на страницу кнопку «Удалить последний комментарий», при клике на которую из списка удаляется последний комментарий.
*/

const commentListElement = document.getElementById('comment-list');
const addFormButtonElement = document.getElementById('add-form-button');
const nameInputElement = document.getElementById('name-input');
const commentInputElement = document.getElementById('comment-input');
const inputFormElement = document.getElementById('input-form');
const removeCommentButtonElement = document.getElementById('remove-comment-button');

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

// При нажатии на кнопку "Написать": комментарий повляется на странице, поля ввода очищаются,
// кнопка "Написать" дезактивируется.
addFormButtonElement.addEventListener('click', () => {
  commentListElement.innerHTML = commentListElement.innerHTML + `<li class="comment">
    <div class="comment-header">
      <div>${nameInputElement.value}</div>
      <div>${getTime()}</div>
    </div>
    <div class="comment-body">
      <div class="comment-text">
        ${commentInputElement.value}
      </div>
    </div>
    <div class="comment-footer">
      <div class="likes">
        <span class="likes-counter">0</span>
        <button class="like-button"></button>
      </div>
    </div>
  </li>`;
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

// Удаление последнего комментария 
removeCommentButtonElement.addEventListener('click', () => {
  let index = commentListElement.innerHTML.lastIndexOf('<li class="comment">');
  commentListElement.innerHTML = commentListElement.innerHTML.substring(0, index);
});



 




