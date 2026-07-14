# Underwood Payload

Сайт и CMS питомника Underwood на Next.js и Payload CMS.

## Локальный запуск

```bash
cp .env.example .env
corepack enable
pnpm install
pnpm dev
```

Для `PAYLOAD_SECRET` используйте случайное значение, например:

```bash
openssl rand -hex 32
```

Админка доступна по адресу `http://localhost:3000/admin`. В development значения
`CMS_SEED_ADMIN_EMAIL` и `CMS_SEED_ADMIN_PASSWORD` только предзаполняют форму — вход всё равно
нужно подтвердить вручную.

## Создание администратора

Укажите в `.env`:

```dotenv
CMS_SEED_ADMIN_EMAIL=admin@example.com
CMS_SEED_ADMIN_PASSWORD=replace-with-a-strong-password
```

Затем создайте пользователя без сброса остального контента:

```bash
pnpm seed:admin
```

После создания пользователя эти две переменные не нужны приложению в production и могут быть
удалены из production `.env`. Повторный запуск команды существующего пользователя не изменяет.

## Production

Обязательные runtime-переменные:

```dotenv
NODE_ENV=production
DATABASE_URL=file:./data/underwood-payload.db
PAYLOAD_SECRET=<случайный секрет минимум из 24 символов>
PAYLOAD_PUBLIC_SERVER_URL=https://underwood.by
PORT=3005
```

Production должен работать только за HTTPS. Auth-cookie имеет `Secure`, `HttpOnly` и
`SameSite=Lax`; Payload принимает cookie-запросы только от `PAYLOAD_PUBLIC_SERVER_URL`.

Сборка Docker использует сжатый SQLite-снимок как BuildKit secret: база нужна Next.js для
генерации публичных страниц, но не попадает в build context или image layer. По умолчанию берётся
`./data/underwood-payload.db`; путь можно переопределить через `BUILD_DATABASE_PATH`.

```bash
pnpm build:docker
docker compose -f docker-compose.prod.yml up -d
```

Runtime-секрет `PAYLOAD_SECRET` и пароль администратора не передаются как Docker build arguments.
Каталоги `data/` и `media/` подключаются как постоянные volumes и должны попадать в резервные
копии.

После деплоя откройте `https://underwood.by/admin` и войдите по email и паролю созданного
пользователя. Автоматический вход в production отключён.

## Проверки

```bash
pnpm exec tsc --noEmit
pnpm test:int
pnpm build
```
