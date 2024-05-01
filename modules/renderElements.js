import { initLikeButtonListener, initEditButtonListener, initSaveButtonListener, initCommentReplyListener } from "./init.js";
import { disableButton } from "./utilitities.js";
import { initNameInputListener, initCommentInputListener, initAddFormListener } from "./addComments.js";

// Рендер-функция, которая отрисовывает список комментариев.
export function renderComments({ comments }) {
  const commentListElement = document.querySelector('#comment-list');

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

  initLikeButtonListener({ comments });
  // initEditButtonListener({ comments });
  // initSaveButtonListener({ comments });
  initCommentReplyListener({ comments });
}

// Рендер-функция, которая отрисовывает форму ввода комментрия.
export function renderInputBox(name, comment) {
  const addFormElement = document.querySelector('.add-form');

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

  disableButton();

}