// Функция для получения даты и времени в формате: дд.мм.гг чч:мм
export function getTime(date) {
    let timeOptions = { hour: '2-digit', minute: '2-digit' };
    let formattedTime = date.toLocaleTimeString('ru-Ru', timeOptions);

    let dateOptions = { day: '2-digit', month: '2-digit', year: '2-digit' };
    let formattedDate = date.toLocaleDateString('ru-Ru', dateOptions);

    return formattedDate + ' ' + formattedTime;
}

// Функция для дезактивирования кнопки "Написать"
export function disableButton () {
    const addFormButtonElement = document.querySelector('.add-form-button');
    addFormButtonElement.disabled = true;
    addFormButtonElement.classList.add('add-form-button_disabled');
}

// Функция для активирования кнопки "Написать"
export function enableButton () {
    const addFormButtonElement = document.querySelector('.add-form-button');
    addFormButtonElement.disabled = false;
    addFormButtonElement.classList.remove('add-form-button_disabled');
}