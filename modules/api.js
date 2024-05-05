import { sanitizeHtml } from "./utilitities.js";

const baseUrl = "https://wedev-api.sky.pro/api/v2/";
const userUrl = "https://wedev-api.sky.pro/api/user";

export let token;

export function setToken(newToken) {
    token = newToken;
}

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
            headers: {
                Authorization: `Bearer ${token}`
            },
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
            if (response.status === 401) {
                console.log(response);
                throw new Error("Нет авторизации");
            }
            return response.json();
        });
}

export function login({ login, password }) {

    return fetch(
        userUrl + "/login",
        {
            method: "POST",
            body: JSON.stringify({
                login,
                password
            })
        }
    )
    .then((response) => {
        if (response.status === 400) {
            console.log(response);
            throw new Error("Плохой запрос");
        }
        return response.json();
    });
}