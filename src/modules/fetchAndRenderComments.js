import { getAllComments } from "./api.js";
import { sanitizeHtml } from "./utilitities.js";
import {
    renderComments,
    renderLogin,
    renderInputBox,
} from "./renderElements.js";
import { userName } from "./loginRegisterComponent.js";
import { format } from "date-fns";

export function fetchAndRenderComments() {
    const commentBoxElement = document.querySelector("#comment-box");
    commentBoxElement.textContent =
        "Подождите, пожалуйста, комментарии загружаются...";

    if (!localStorage.getItem("token")) {
        getAllComments()
            .then((responseData) => {
                let comments = responseData.comments.map((comment) => {
                    return {
                        name: sanitizeHtml(comment.author.name),
                        date: format(
                            new Date(comment.date),
                            "yyyy-MM-dd HH.mm.ss",
                        ),
                        text: sanitizeHtml(comment.text),
                        isLiked: comment.isLiked,
                        likes: comment.likes,
                    };
                });
                renderComments({ comments });
                return true;
            })
            .then(() => {
                const authLinkElement = document.querySelector(".auth-link");
                authLinkElement.addEventListener("click", () => {
                    renderLogin();
                });
            })
            .catch((error) => {
                console.warn(error);
                if (error.message === "Ошибка сервера") {
                    fetchAndRenderComments();
                } else {
                    alert("Кажется, у вас сломался интернет, попробуйте позже");
                }
            });
    } else {
        fetchAndRenderCommentsAfterLogin();
    }
}

export function fetchAndRenderCommentsAfterLogin() {
    getAllComments()
        .then((responseData) => {
            let comments = responseData.comments.map((comment) => {
                return {
                    name: sanitizeHtml(comment.author.name),
                    date: format(new Date(comment.date), "yyyy-MM-dd HH.mm.ss"),
                    text: sanitizeHtml(comment.text),
                    isLiked: comment.isLiked,
                    likes: comment.likes,
                };
            });
            renderComments({ comments });
            return true;
        })
        .then(() => {
            const authLinkElement = document.querySelector(".auth-link-text");
            authLinkElement.classList.add("hide-auth-link-text");
        })
        .then(() => {
            if (!localStorage.getItem("name")) {
                renderInputBox(userName, "");
            } else {
                renderInputBox(localStorage.getItem("name"), "");
            }
        })
        .catch((error) => {
            console.warn(error);
            if (error.message === "Ошибка сервера") {
                fetchAndRenderCommentsAfterLogin();
            } else {
                alert("Кажется, у вас сломался интернет, попробуйте позже");
            }
        });
}
