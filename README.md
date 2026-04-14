# FocusHub Backend

Docker-first setup guide for running this API on a brand new machine.

## Services started by Docker Compose

- `postgres` (PostgreSQL 16)
- `api` (NestJS API in watch mode)
- `prisma-studio` (Prisma Studio UI)

## Prerequisites

1. Docker Desktop (latest stable) with Docker Compose v2 enabled
2. Git
3. Ports available on your machine:
   - `3002` (API)
   - `5432` (PostgreSQL)
   - `5555` (Prisma Studio)

Node.js is not required for the Docker workflow below.

## 1) Clone the repository

```bash
git clone <your-repo-url>
cd swiftnine-dashboard-backend
```

## 2) Create environment file

From the project root:

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

### macOS / Linux

```bash
cp .env.example .env
```

Edit `.env` if needed. At minimum, replace JWT secrets for real environments.

## 3) Build and start containers

```bash
docker compose up --build -d
```

This starts database, API, and Prisma Studio.

## 4) Apply database migrations

Run this once after first startup (and after pulling new migrations):

```bash
docker compose exec api npx prisma migrate deploy
```

## 5) Verify everything is running

### Check container status

```bash
docker compose ps
```

### Check API health endpoint

Open:

- `http://localhost:3002/api/v1/health`

Expected response example:

```json
{
  "status": "ok",
  "database": "connected"
}
```

### Open API docs (Swagger)

- `http://localhost:3002/api/docs`

### Open Prisma Studio

- `http://localhost:5555`

## Daily commands

### Start (detached)

```bash
docker compose up -d
```

### Stream logs

```bash
docker compose logs -f api
```

### Stop containers

```bash
docker compose down
```

### Stop and remove database volume (full reset)

```bash
docker compose down -v
```

Then start again and re-run migrations:

```bash
docker compose up --build -d
docker compose exec api npx prisma migrate deploy
```

## Troubleshooting

### Port already in use

- Update `PORT`, `DB_PORT`, or `PRISMA_STUDIO_PORT` in `.env`.
- Restart containers:

```bash
docker compose down
docker compose up -d
```

### API cannot connect to database

1. Check DB is healthy:

```bash
docker compose ps
```

2. Check API logs:

```bash
docker compose logs -f api
```

3. Re-run migrations:

```bash
docker compose exec api npx prisma migrate deploy
```

### Fresh reset when local state gets broken

```bash
docker compose down -v
docker compose up --build -d
docker compose exec api npx prisma migrate deploy
```

## Environment summary

Main values from `.env.example`:

- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
- `DB_PORT` (host port for PostgreSQL)
- `PORT` (host port for API, default `3002`)
- `PRISMA_STUDIO_PORT` (default `5555`)
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`
- Google OAuth variables (only required if you use Google auth flow)
