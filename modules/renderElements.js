import { initLikeButtonListener, initEditButtonListener, initSaveButtonListener, initCommentReplyListener, initLoginButtonListener } from "./init.js";
import { disableButton } from "./utilitities.js";
import { initNameInputListener, initCommentInputListener, initAddFormListener } from "./addComments.js";

// Рендер-функция, которая отрисовывает список комментариев.
export function renderComments({ comments }) {
  const commentBoxElement = document.querySelector("#comment-box");

  const commentHtml = comments.map((comment, index) => {
    return `
    <li class="comment" data-index="${index}">
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

  const commentBoxHtml = `
    <ul id="comment-list" class="comments">${commentHtml}</ul>
    <p class="auth-link-text">Чтобы добавить комментарий, <a href="#" class="auth-link"> авторизуйтесь</a></p>
  `;

  commentBoxElement.innerHTML = commentBoxHtml;

  // initLikeButtonListener({ comments });
  // initEditButtonListener({ comments });
  // initSaveButtonListener({ comments });
  // initCommentReplyListener({ comments });
}

// Рендер-функция, которая отрисовывает форму ввода комментрия.
export function renderInputBox(name, comment) {
  const inpuFormBoxElement = document.querySelector("#input-form-box");

  const inputBoxHtml = `
    <div id="input-form" class="add-form">
    <input
      id="name-input"
      type="text"
      class="add-form-name"
      placeholder="Введите ваше имя (не менее трех символов)"
      value="${name}"
      readonly
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
    </div>
  </div>
  `;
  inpuFormBoxElement.innerHTML = inputBoxHtml;

  initNameInputListener();
  initCommentInputListener();
  initAddFormListener();

  disableButton();
}

// Рендер-функция, которая отрисовывает форму ввода логина и пароля
export function renderLogin() {
  const commentBoxElement = document.querySelector("#comment-box");

  const loginHtml = `
    <div class="login-form" id="login-form">
      <h3 class="login-form__title">Форма входа</h3>
      <input type="text" class="login-form-input" id="login-input" placeholder="Введите логин">
      <input type="text" class="login-form-input" id="password-input" placeholder="Введитие пароль">
      <div class="login-form-row">
        <button class="login-form-button" id="login-button">Войти</button>
      </div>
      <div class="register-link">
        <a href="#" class="register-link__title">Зарегистрироваться</a>
      </div>
    </div>
  `;

  commentBoxElement.innerHTML = loginHtml;

  initLoginButtonListener();
}