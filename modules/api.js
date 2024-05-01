export function getAllComments() {
    return fetch(
        "https://wedev-api.sky.pro/api/v1/katia-vasileva/comments",
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
    const addFormElement = document.querySelector('.add-form');

    return fetch(
        "https://wedev-api.sky.pro/api/v1/katia-vasileva/comments",
        {
            method: "POST",
            body: JSON.stringify({
                text: comment.replaceAll("<", "&lt;").replaceAll(">", "&gt;"),
                name: name.replaceAll("<", "&lt;").replaceAll(">", "&gt;")
                    .replaceAll('QUOTE_BEGIN', '<div class="quote">').replaceAll('QUOTE_END', '</div>'),
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