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

    // initLikeButtonListener();
    // initEditButtonListener();
    // initSaveButtonListener();
    // initCommentReplyListener();
}