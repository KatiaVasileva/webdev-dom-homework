import { sanitizeHtml } from "./utilitities.js";

const baseUrl = "https://wedev-api.sky.pro/api/v1/";

export function getAllComments() {

    return fetch(
        baseUrl + "katia-vasileva/comments",
        {
            method: "GET"
        })
        .then((response) => {
            if (response.status === 500) {
                throw new Error("Ошибка сервера");
            }
            return response.json();
        });
}

export function addComment({ name, comment }) {

    return fetch(
        baseUrl + "katia-vasileva/comments",
        {
            method: "POST",
            body: JSON.stringify({
                text: sanitizeHtml(comment),
                name: sanitizeHtml(name),
                forceError: false
            })
        }
    )
        .then((response) => {
            if (response.status === 500) {
                throw new Error("Ошибка сервера");
            }

            if (response.status === 400) {
                console.log(response);
                throw new Error("Плохой запрос");
            }
            return response.json();
        });
}