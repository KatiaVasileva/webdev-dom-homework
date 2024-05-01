/* Задание
Разбейте ваше приложение с лентой комментариев на модули.
- main.js должен стать главным модулем, точкой входа. В нем должны остаться только импорты других модулей, а также код, который необходим для их работы.
- При разбиении проекта учтите главные принципы создания модулей и постарайтесь сделать их универсальными.

Критерии для самопроверки
 
- В проекте отсутствуют дублирования кода, повторяющиеся части вынесены в отдельные модули.
- Приложение запускается и работает без ошибок в консоли.
- Сохранена логика предыдущего функционала (лайки, цитаты).
- Только один файл скрипта (main.js) подключен в HTML-разметку.
- В проекте есть модули для работы с API и отрисовки задач.
- Проект очищен от неиспользуемого кода (объемные комментарии, неиспользуемые переменные и т. д.).
*/

import { fetchAndRenderComments } from "./modules/fetchAndRenderComments.js";
import { renderInputBox } from "./modules/renderElements.js";
import { disableButton } from "./modules/utilitities.js";

// Вызов функции с GET-запросом для получения списка комментариев из API
fetchAndRenderComments();

// Вызов рендер-функции для отрисовки формы ввода
renderInputBox("", "");

// Изначально при пустых полях ввода кнопка "Написать" неактивна.
disableButton();

// Добавление комментария на страницу по нажатию Enter
const inputFormElement = document.querySelector('#input-form');

inputFormElement.addEventListener('keyup', (e) => {
    const addFormButtonElement = document.querySelector('.add-form-button');

    if (e.key === 'Enter') {
        addFormButtonElement.click();
    }
});

