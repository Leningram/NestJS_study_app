# Прогресс обучения

Текущий этап: 4. PostgreSQL (в процессе)

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
- Частичное обновление через `PATCH /tasks/:id`: `UpdateTaskDto` на основе `PartialType`, возврат обновлённой задачи и `404` для отсутствующего ID.
- Удаление через `DELETE /tasks/:id`: ответ `204`, `404` для отсутствующего ID.
- E2E-тесты маршрутов через Jest и Supertest: проверка тела ответа и HTTP-статусов, включая `404` после удаления; приложение создаётся для каждого теста.
- Понимание тестовой структуры Jest: `it` описывает сценарий, а `testRegex` в конфигурации выбирает файлы `*.e2e-spec.ts`.
- E2E-проверка глобального `ValidationPipe`: невалидный `POST`/`PATCH`, лишние поля и нечисловой ID возвращают `400`.
- Частичное обновление валидируется по полям DTO; при обновлении применяются только переданные значения, `null` отклоняется для non-nullable полей.
- Базовый NestJS CRUD с DTO, dependency injection, исключениями и e2e-тестами пройден; мини-проверка по потоку `PATCH` успешно выполнена.

## Вызывает трудности / повторить
- Перевести TasksService с массива на параметризованные PostgreSQL-запросы.
- Настроить автоматический запуск и учёт применённых SQL-миграций.

## Последняя сессия
- Дата: 2026-11-15
- Что делали: завершили этап NestJS и перешли к PostgreSQL. Установили локальный PostgreSQL 18, создали роль `tasks_app` и БД `tasks_api`; SQL-файл `database/migrations/001_create_tasks.sql` применён вручную через `psql`. В Nest созданы `DatabaseModule` и `DatabaseService`; подключены `pg.Pool` и `@nestjs/config`, добавлены lifecycle hooks для проверки соединения через `SELECT 1` и закрытия пула, а также метод `query(sql, values)`.
- С чего продолжить: использовать `DatabaseService` в `TasksService` и заменить хранение задач в памяти на параметризованные запросы; затем добавить автоматический запуск и учёт миграций.

## Контекст проекта
- Стек: Node.js 22, NestJS 11, TypeScript, PostgreSQL 18; локальная БД `tasks_api`, роль приложения `tasks_app`; перенос CRUD с памяти на PostgreSQL начат.
- Цель: REST API для управления задачами и практического изучения NestJS.
- Курс и модуль: учебный план Node.js → Express → NestJS → PostgreSQL → Auth → Redis → Docker/Linux → production → Go → архитектура.
