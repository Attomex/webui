# What to do
### Excel/выгрузка отчётов
- При скачивании отчёта с сайта в формате Excel:
    -  ✔️ СДЕЛАНО ✔️  При скачивании файла, отчёта, в Excel формате, добавить модульное окно, в котором можно будет выбрать, какие именно уязвимости скачивать, по уровням, либо все
    - Как вариант добавить возможность скачивать отчёты по определённому ПК, за определённые даты, если вообще имеются отчёты.
    - ✔️ СДЕЛАНО ✔️ Как вариант, можно при выгрузке Excel на разных страницах писать по разным уровням уязвимости. То есть на 1 странице - только критические, на другой - только высоки и тд
    - Когда скачиваешь отчёт, в Excel добавить краткое описание, по уровням ошибок (НЕ ПОНЯЛ САМ)
    - В Excel-файл автоматически добавлять метаданные, такие как: Дата генерации отчёта. Версия ScanOVAL. Имя пользователя, который загрузил отчёт.
    - Добавить динамически создаваемые графики при выгрузке в Excel: к примеру, по разным уровням уязвимостей
    -  ✔️ СДЕЛАНО ✔️  Добавить возможность скачивать отчёт только по определённым параметрам (столбцы в общем. Условно мне необходима только краткая информация об уязвимости и ее код. На этом все.)
- При сравнении отчётов
    - Как вариант добавить выгрузку отчёта при сравнении. Но там уже делить страницы на такие - Информация, Новые уязвимости, Исправленные уязвимости, Оставшиеся уязвимости. Если это делать, тогда необходимо так же добавить колонку - уровни уязвимостей и красить ячейки в соответствии с уровнями.
### Контроллеры
- Зарефакторить ReportController.php
- Сделать ссылки на /api/
### Остальные задачи
- UI(с частичным функционалом)
    - Изменить просмотр отчётов. Карточки поменять на таблицу. На странице со сравнением отчётов - добавить поле, и сверху будут некие закладки с названиями "Появившиеся уязвимости", "Исправленные уязвимости", "Оставшиеся уязвимости". И там уже делать таблицу. 
    - Добавить страницы у таблицы. Показывать по определенному кол-ву.
    - Уведомление на главной странице об обновлении баз уязвимостей
    - Генерация графиков по определенному пк за промежуток - КУДА ЗАСУНУТЬ НЕЯСНО
    - На главной странице что-то придумать с графиками. Дашборд с метриками по уязвимостям.
- Функционал
    - ✔️ СДЕЛАНО ✔️ Сделать загрузку отчёта на сервер в виде транзакции
    - ✔️ СДЕЛАНО ✔️ Добавить удаление отчета при ошибочной загрузке
    - Сделать мульти загрузку отчётов
    - Система фильтров и поиска на странице просмотра отчёта
    - ...продолжение верхнего: При показе отчёта, просмотр, показывать после описания, до карточек, количество ошибок по уровням. Это будет как некий фильтр, галочки. Изначально должно показывать вообще все, и при выборе показывать то, что выбрали. Так же добавить поддержку мульти выбора.
    - Добавить на главной странице сайта поиск. Чуть ниже под полем поиска должно быть 2 радио-кнопки: поиск по названию PC(id), поиск по дате. Так же все отчёты должны открываться при нажатии на дату - аккордеон в общем сделать.
    - Как вариант добавить комментарии для каждой уязвимости. Ее будет вводить пользователь. Когда будет вводить - при загрузке отчета, или после загрузки во время просмотра - неизвестно. Ну а при показе отчёта - в отдельном столбце выводить комментарий. Если нет, то "-"
- Логирование
    - Логирование действий администрации: когда зашел в админ панель, кто загрузил отчёт, какой отчёт(название, к какому PC принадлежит), когда посмотрел отчет и какой админ, кто и когда сравнивал отчёты и какие, кто и когда удалял отчёты, кто и когда скачивал отчёты, какой и когда администратор вышел из сети(разлогинился)
- Под вопросом
    - Отдельная целая страница поиска
    - Excel - Автоматически выделять цветом ячейки, содержащие уровни риска, чтобы упростить визуальное восприятие. - если будут разные листы - нужно ли это? Возможно, добавить разную загрузку, к примеру выбрать - раздельное(на разных листах разные уровни) или общую - тогда есть смысл красить цветом ячейки, и добавлять отдельный столбец - уровни уязвимостей.




<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com/)**
- **[Tighten Co.](https://tighten.co)**
- **[WebReinvent](https://webreinvent.com/)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel/)**
- **[Cyber-Duck](https://cyber-duck.co.uk)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Jump24](https://jump24.co.uk)**
- **[Redberry](https://redberry.international/laravel/)**
- **[Active Logic](https://activelogic.com)**
- **[byte5](https://byte5.de)**
- **[OP.GG](https://op.gg)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
# webui_pub
