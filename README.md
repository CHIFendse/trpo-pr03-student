# Практическая работа 3

Панель статуса на Bootstrap 5.

## Запуск

Открыть `index.html` через Live Server в VS Code, иначе `fetch` не прочитает JSON.

## Dataset

- `dashboard.json` — 4 карточки и таблица
- `notifications.json` — уведомления в offcanvas и текст toast
- `avatar.svg` — аватар в navbar

## Компоненты Bootstrap

navbar, grid, card, table, form, modal, offcanvas, alert, toast.

## Bootstrap JS и app.js

Bootstrap JS открывает и закрывает меню, modal, offcanvas и toast через `data-bs-*`.

app.js загружает JSON, проверяет поле (`is-invalid` / `is-valid`), добавляет строку в таблицу, обновляет счётчик, скрывает таблицу и показывает toast через `getOrCreateInstance`.

Шаг 5: таблица в `table-responsive`, на телефоне прокручивается только она.
