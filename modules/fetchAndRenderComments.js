import { getAllComments } from "./api.js";
import { getTime } from "./utilitities.js";
import { renderComments } from "./renderElements.js";

export function fetchAndRenderComments() {

    const commentLoaderElement = document.querySelector('.comment-loader');

    getAllComments()
        .then((responseData) => {
            let comments = responseData.comments.map((comment) => {
                return {
                    name: comment.author.name,
                    date: getTime(new Date(comment.date)),
                    text: comment.text.replaceAll("<", "&lt;").replaceAll(">", "&gt;")
                        .replaceAll('QUOTE_BEGIN', '<div class="quote">').replaceAll('QUOTE_END', '</div>'),
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
}