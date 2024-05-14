/* Задание
+ Подключите библиотеку date-fns к вашему приложению. С ее помощью отформатируйте дату в формате 
yyyy-MM-dd hh.mm.ss (это шведский формат отображения даты).
+ Создайте в проекте файл .gitignore и добавьте туда папку node_modules.

Дополнительное задание
- Подключите к проекту prettier, отформатируйте все файлы проекта через prettier
- Подключите к проекту eslint, исправьте ошибки которые подсвечивает eslint (используйте пресет eslint:recommended)
- Настройте автоматическу проверку eslint на precommit хук через husky
*/

import { fetchAndRenderComments } from "./modules/fetchAndRenderComments.js";

// Вызов функции с GET-запросом для получения списка комментариев из API и ссылкой на форму авторизации
fetchAndRenderComments();
