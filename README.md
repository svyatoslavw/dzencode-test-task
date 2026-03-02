# Orders & Products

https://dzencode.statter.space/

Тестовий застосунок для керування приходами та продуктами з авторизацією, статистикою, WebSocket-сесіями та SQLite.

## Стек і чому саме він

- `React 19 + TypeScript`  
  Фундамент.
- `Next.js 16 (App Router)`  
  SSR/route handlers, зручна структура для фіч та API в одному проєкті.
- `SQLite + better-sqlite3`  
  Легка локальна БД без окремого сервера, швидко для тестового/демо-сценарію.
- `TanStack Query`  
  Кешування, інвалідація та синхронізація списків після мутацій.
- `React Hook Form + Zod`  
  Продуктивні форми та єдина схема валідації на клієнті/сервері.
- `ws + custom server.mjs`  
  WebSocket для live-показу кількості активних сесій.
- `Bootstrap 5`  
  Швидка базова верстка без зайвого boilerplate.
- `Paraglide (inlang)`  
  i18n з type-safe ключами повідомлень.
- `Docker (multi-stage)`  
  Відтворювана прод-збірка і простий запуск на сервері.

## Вимоги

- `Node.js 22.x`
- `npm 10+`
- Для Docker-сценарію: `Docker` + `Docker Compose`

## Локальний запуск

1. Встановити залежності:

```bash
npm install
```

2. Запустити застосунок:

```bash
npm run dev
```

3. Відкрити:

- [http://localhost:3000](http://localhost:3000)

Опційно, запуск у production-режимі локально:

```bash
npm run build
npm run start
```

## Запуск через Docker

Збірка образу:

```bash
npm run docker:build
```

Перезбірка без кешу:

```bash
npm run docker:rebuild
```

Старт контейнера:

```bash
npm run docker:up
```

Зупинка:

```bash
npm run docker:down
```

За замовчуванням застосунок доступний на:

- [http://localhost:3000](http://localhost:3000)

Дані БД зберігаються у volume:

- `./data:/app/data`

## Seeder (заповнення БД)

Скрипт:

- `scripts/seed.mjs`

База:

- `data/app.db`

Локально:

```bash
npm run seed
```

Більший обсяг даних:

```bash
npm run seed:big
```

Кастомні параметри:

```bash
node scripts/seed.mjs --orders 300 --min-products 3 --max-products 12 --seed 2026
```

У Docker-контейнері:

```bash
docker compose exec app npm run seed
docker compose exec app npm run seed:big
```

Кастомні параметри в Docker:

```bash
docker compose exec app node scripts/seed.mjs --orders 300 --min-products 3 --max-products 12 --seed 2026
```

## Корисні команди

```bash
npm run lint
npm run test
npm run build
```
