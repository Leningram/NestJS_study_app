# Прогресс обучения

Текущий этап: 3. NestJS (в процессе)

## Освоено
- Node.js — этап отмечен как пройденный в учебном плане.
- Express: REST API для пользователей, маршрутизация, middleware, контроллеры, сервисы, обработка ошибок.
- SQLite: подключение к БД и работа с параметризованными запросами.
- Миграции БД: загрузка файлов, сортировка по версии, проверка `PRAGMA user_version`, запуск только ожидающих миграций.
- Транзакционное выполнение миграций: `BEGIN`, `COMMIT`, `ROLLBACK` при ошибке.
- Архитектура backend-приложения: route → controller → service → DB, плюс глобальный error middleware.
- NestJS: назначение корневого `AppModule`, роли `controllers` и `providers`, запуск через `NestFactory.create` и функция `bootstrap`.
- Базовый путь запроса в NestJS: controller вызывает service; DI-контейнер предоставляет service через конструктор.
- Созданы `TasksModule`, `TasksController` и `TasksService`; добавлен маршрут `GET /tasks` с временным хранением данных в памяти.
- Интерфейс `Task` вынесен в `src/tasks/interfaces/task.interface.ts`; для него используются type-only imports.
- Создание задач через `POST /tasks`: DTO-класс с правилами `class-validator`, глобальный `ValidationPipe`, отклонение невалидных и лишних полей.
- Получение задачи через `GET /tasks/:id`: `@Param`, `ParseIntPipe` и `NotFoundException` для ответа `404`, если задача не найдена.

## Вызывает трудности / повторить
- Добавить поведенческие тесты для маршрутов; продолжить закреплять CRUD и обработку ошибок в NestJS.

## Последняя сессия
- Дата: 2026-11-12
- Что делали: разобрали `AppModule`, роли `controllers` и `providers`, `NestFactory.create` и `bootstrap`; создали модуль задач, контроллер и сервис; реализовали `GET /tasks`, `POST /tasks` с DTO и runtime-валидацией, `GET /tasks/:id` с преобразованием параметра и `404` для отсутствующей задачи. Проверили HTTP-валидацию вручную; TypeScript-проверка и все 3 unit-теста прошли.
- С чего продолжить: добавить обновление и удаление задач (`PATCH` и `DELETE`) в памяти, затем покрыть поведение маршрутов тестами; SQLite подключить после освоения основных CRUD-маршрутов.

## Контекст проекта
- Стек: Node.js 22, NestJS 11, TypeScript; хранение данных пока в памяти, SQLite запланирована позже.
- Цель: REST API для управления задачами и практического изучения NestJS.
- Курс и модуль: учебный план Node.js → Express → NestJS → PostgreSQL → Auth → Redis → Docker/Linux → production → Go → архитектура.
