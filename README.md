<p align="center">
  <img src="frontend/public/AutovibeDoc.png" alt="Autovibe" width="560" />
</p>

# Autovibe

Small full-stack thing for car listings — .NET API + React (Vite). Auth, CRUD, image uploads. Nothing fancy.

**Stack:** ASP.NET Core, EF Core + Pomelo (MySQL), JWT, FluentValidation on the backend. React 19, Redux, RHF, Axios on the frontend.

If the banner image above breaks after you rename files, point the `<img src>` at whatever you committed (paths are relative to repo root).

## What you need installed

.NET 8 SDK, Node 18+, MySQL running somewhere. `dotnet-ef` only if you want migrations instead of importing the SQL script: `dotnet tool install --global dotnet-ef`.

## Layout

```
backend/Autovibe.API/   — API, migrations, setup_database.sql
frontend/             — Vite app
```

If you cloned into a folder that already contains another copy of the same repo, don’t edit the nested duplicate by mistake.

## Backend

Secrets aren’t in `appsettings.json` — set connection string + JWT key via user secrets (or env in prod). From `backend/Autovibe.API`:

```bash
dotnet user-secrets init   # once
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=...;Database=autovibe;..."
dotnet user-secrets set "Jwt:Key" "<long random string>"
```

MS docs: https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets

CORS for local dev is `Cors:AllowedOrigins` in `appsettings.json` (defaults to `http://localhost:5173`). Bump it if Vite isn’t on 5173.

**DB:** create database + user, then either import `setup_database.sql` with mysql client, or `dotnet ef database update` from `backend/Autovibe.API`.

## Frontend

You need `VITE_API_URL` or the app dies on startup (see `frontend/src/services/api.ts`). Example `frontend/.env`:

```env
VITE_API_URL=http://localhost:5258
```

No `/api` at the end — the axios instance adds `/api`. Vite dev server proxies `/api` to that host (`vite.config.ts`).

```bash
cd frontend && npm install && npm run dev
```

Opens on **5173** by default.

## Running locally

1. MySQL up, schema applied.
2. User secrets set for API.
3. `frontend/.env` exists with `VITE_API_URL`.

Then:
- Terminal 1: `cd backend/Autovibe.API && dotnet run` → API (usually **5258**, check launch settings if it differs).
- Terminal 2: `cd frontend && npm run dev`.

## Random commands

`npm run build` / `npm run lint` — frontend. `dotnet publish -c Release` — API. After model changes: `dotnet ef migrations add Whatever` from the API project.

## Images

Authenticated upload: `POST /api/cars/upload-image`. Files go under `wwwroot/images/cars/`, API returns paths like `/images/cars/...`. Frontend builds full URLs with `getImageUrl` + same base as `VITE_API_URL` — if images 404, that’s usually the first place to check.

## Production

Publish API, `npm run build` for frontend (`frontend/dist/`). Set real connection string + JWT in your host’s env/secret store. Build the frontend with `VITE_API_URL` pointing at your **public** API URL. Fix CORS for your real frontend origin.

## When something’s wrong

- **Blank error on app load** — missing `VITE_API_URL`.
- **401** — not logged in or token expired.
- **CORS** — origin in backend config doesn’t match where you opened the app.
- **Images broken** — wrong base URL or static files not served from `wwwroot`.
