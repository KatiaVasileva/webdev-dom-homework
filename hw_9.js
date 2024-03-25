/* Задание
Целевой сценарий продукта: «Я как пользователь могу ввести свое имя и комментарий, 
нажать кнопку „Написать”, и мой комментарий появится на странице».

Условия проверки и выполнения задания
- Работает целевой сценарий.
- Кнопка добавляет комментарий в список.
- У полей «Имя» и «Комментарий» есть валидация: нельзя добавить комментарий, не указав своего имени или текста комментария.
- При добавлении комментария в списке подставляются текущая дата и время.
- Новые комментарии появляются с 0 лайков.
*/

const commentListElement = document.getElementById('comment-list');
const addFormButtonElement = document.getElementById('add-form-button');
const nameInputElement = document.getElementById('name-input');
const commentInputElement = document.getElementById('comment-input');

const getTime = () => {
    let date = new Date();

    let timeOptions = { hour: '2-digit', minute: '2-digit' };
    let formattedTime = date.toLocaleTimeString('ru-Ru', timeOptions);

    let dateOptions = { day: '2-digit', month: '2-digit', year: '2-digit' };
    let formattedDate = date.toLocaleDateString('ru-Ru', dateOptions);

    return formattedDate + ' ' + formattedTime;
}

addFormButtonElement.addEventListener('click', () => {
    let existingComments = commentListElement.innerHTML;
    let name = nameInputElement.value;
    let date = getTime();
    let comment = commentInputElement.value;

    nameInputElement.classList.remove('error');
    commentInputElement.classList.remove('error');

    if (name === '') {
        nameInputElement.classList.add('error');
        return;
    }
    if (comment === '') {
        commentInputElement.classList.add('error');
        return;
    }
    commentListElement.innerHTML = existingComments + `<li class="comment">
    <div class="comment-header">
      <div>${name}</div>
      <div>${date}</div>
    </div>
    <div class="comment-body">
      <div class="comment-text">
        ${comment}
      </div>
    </div>
    <div class="comment-footer">
      <div class="likes">
        <span class="likes-counter">0</span>
        <button class="like-button"></button>
      </div>
    </div>
  </li>`;
});


