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

## Вызывает трудности / повторить
- Закрепить модули, контроллеры, сервисы и DI на собственном CRUD-приложении; перед продолжением CRUD исправить повторяющиеся ID тестовых задач.

## Последняя сессия
- Дата: 2026-11-12
- Что делали: разобрали `AppModule`, роли `controllers` и `providers`, `NestFactory.create` и `bootstrap`; создали модуль задач, контроллер, сервис и `GET /tasks`; вынесли тип `Task` в отдельный feature-local интерфейс. Устранили устаревшие TypeScript-диагностики Jest перезапуском TypeScript Server.
- С чего продолжить: исправить повторяющиеся ID тестовых задач, затем добавить создание задач и продолжить CRUD в памяти; SQLite подключить после освоения основных CRUD-маршрутов.

## Контекст проекта
- Стек: Node.js 22, NestJS 11, TypeScript; хранение данных пока в памяти, SQLite запланирована позже.
- Цель: REST API для управления задачами и практического изучения NestJS.
- Курс и модуль: учебный план Node.js → Express → NestJS → PostgreSQL → Auth → Redis → Docker/Linux → production → Go → архитектура.
