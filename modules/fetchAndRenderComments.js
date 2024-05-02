import { getAllComments } from "./api.js";
import { getTime, sanitizeHtml } from "./utilitities.js";
import { renderComments } from "./renderElements.js";
import { renderInputBox } from "./renderElements.js";

export function fetchAndRenderComments() {

    const addFormElement = document.querySelector('.add-form');
    const commentLoaderElement = document.querySelector('.comment-loader');

    addFormElement.innerHTML = `
            <div class="comment-add-container">
                <p>Комментарий добавляется...</p>
                <img src="./spinner.svg" class="spinner">
            </div>
        `;

    getAllComments()
        .then((responseData) => {
            let comments = responseData.comments.map((comment) => {
                return {
                    name: sanitizeHtml(comment.author.name),
                    date: getTime(new Date(comment.date)),
                    text: sanitizeHtml(comment.text),
                    isLiked: comment.isLiked,
                    likes: comment.likes
                }
            });
            commentLoaderElement.classList.add('hide-comment-loader');
            renderComments({ comments });
            return true;
        })
        .then(() => {
            renderInputBox("", "");
        })
        .catch((error) => {
            console.warn(error);
            if (error.message === "Ошибка сервера") {
                fetchAndRenderComments();
            } else {
                alert("Кажется, у вас сломался интернет, попробуйте позже");
            };
        });
}