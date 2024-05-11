// Функция для дезактивирования кнопки "Написать"
export function disableButton() {
    const addFormButtonElement = document.querySelector('.add-form-button');
    addFormButtonElement.disabled = true;
    addFormButtonElement.classList.add('add-form-button_disabled');
}

// Функция для активирования кнопки "Написать"
export function enableButton() {
    const addFormButtonElement = document.querySelector('.add-form-button');
    addFormButtonElement.disabled = false;
    addFormButtonElement.classList.remove('add-form-button_disabled');
}

// Функция для обработки пользовательского ввода
export function sanitizeHtml(text) {
    return text.replaceAll("<", "&lt;").replaceAll(">", "&gt;")
        .replaceAll('QUOTE_BEGIN', '<div class="quote">').replaceAll('QUOTE_END', '</div>');
}