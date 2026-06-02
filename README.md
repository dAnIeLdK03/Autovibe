<p align="center">
  <img src="frontend/public/AutovibeDoc.png" alt="Autovibe" width="560" />
</p>

# Autovibe

Full-stack car listings app — .NET API + React (Vite). Auth, CRUD, image uploads, favorites, soft-delete with admin restore/hard-delete.

**Stack:** ASP.NET Core, EF Core + Pomelo (MySQL), JWT, FluentValidation, Mapster on the backend. React 19, Redux (`@autovibe/app-state`), RHF, Axios, Tailwind on the frontend. Optional Expo app under `mobile/`.

If the banner image above breaks after you rename files, point the `<img src>` at whatever you committed (paths are relative to repo root).

## Contents

- [Features](#features)
- [What you need installed](#what-you-need-installed)
- [Layout](#layout)
- [Backend](#backend)
- [Tests (backend)](#tests-backend)
- [Frontend](#frontend)
- [Mobile (optional)](#mobile-optional)
- [Running locally](#running-locally)
- [Production](#production)
- [When something’s wrong](#when-somethings-wrong)

## Features

- Register / login (JWT), profile update, change password
- Browse, filter, and paginate car listings; car details with seller info (when logged in)
- Create / edit / soft-delete your listings; image upload
- Favorites (add, remove, paginated list)
- **Admin:** user list & details, block/unblock, role toggle, view any user’s cars
- **Admin:** soft-deleted cars — list, details, restore, permanent hard-delete

## What you need installed

.NET 8 SDK, Node 18+, MySQL running somewhere. `dotnet-ef` only if you want migrations instead of importing the SQL script: `dotnet tool install --global dotnet-ef`.

## Layout

```
backend/Autovibe.API/   — API, migrations, setup_database.sql
backend/Autovibe.API.Tests/ — integration + smoke tests
frontend/               — Vite + React web app
mobile/                 — Expo app (optional)
packages/app-state/     — shared Redux store (web + mobile)
```

The repo root is an **npm workspace** — from the root you can run `npm install` once to wire up `frontend`, `mobile`, and `packages/*`.

If you cloned into a folder that already contains another copy of the same repo, don’t edit the nested duplicate by mistake.

## Backend

Secrets aren’t in `appsettings.json` — set connection string + JWT key via user secrets (or env in prod). From `backend/Autovibe.API`:

```bash
dotnet user-secrets init   # once
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=...;Database=autovibe;..."
dotnet user-secrets set "Jwt:Key" "<long random string>"
```

See `backend/Autovibe.API/UserSecrets.example.json` for the expected structure.

MS docs: https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets

CORS for local dev is `Cors:AllowedOrigins` in `appsettings.json` (defaults to `http://localhost:5173`). Bump it if Vite isn’t on 5173.

**DB:** create database + user, then either import `setup_database.sql` with mysql client, or `dotnet ef database update` from `backend/Autovibe.API`.

Soft-deleted cars are hidden from normal queries (EF global filter). Favorites tied to deleted cars are soft-deleted too and come back on restore.

### First admin user

Users have a `Role` in the DB (`user` / `admin`, stored lowercase). Register normally, then promote yourself and log in again for a fresh JWT:

```sql
UPDATE Users SET Role = 'admin' WHERE Email = 'your@email.com';
```

Enum in code: `Admin` = 0, `User` = 1. JWT role claim uses `Admin` (case-insensitive check).

### API overview

Base path: `/api`. Most routes need `Authorization: Bearer <token>` unless marked anonymous.

| Area | Method | Path | Notes |
|------|--------|------|--------|
| Auth | POST | `/auth/register` | Anonymous, rate-limited |
| Auth | POST | `/auth/login` | Returns `{ token, user }` |
| User | GET | `/user` | Current user (`GET /user` in frontend) |
| User | PUT | `/user/{id}` | Own profile only |
| User | PUT | `/user/change-password` | |
| User | DELETE | `/user/{id}` | Own account only |
| Cars | GET | `/cars` | Anonymous, filters + `PageResponse` |
| Cars | GET | `/cars/{id}` | Anonymous, `CarDetailsDto` |
| Cars | GET | `/cars/my-cars` | Owner’s listings |
| Cars | POST | `/cars` | Create — returns `201 Created` with `Location` header |
| Cars | PUT | `/cars/{id}` | Owner or admin |
| Cars | DELETE | `/cars/{id}` | Soft-delete; owner or admin |
| Cars | POST | `/cars/upload-image` | Multipart, max 5 MB, rate-limited |
| Favorites | GET | `/favorites` | Paginated `CarListDto` |
| Favorites | POST | `/favorites/{carId}` | |
| Favorites | DELETE | `/favorites/{carId}` | |

`PageResponse<T>` shape: `{ items, totalPages, pageNumber, pageSize, totalItems }`.

**`CarDetailsDto`** includes seller fields, `imageUrls`, and moderation fields: `isDeleted`, `deletedAt` (camelCase in JSON).

**`CarListDto`** includes `shortDescription`, `isDeleted`, `deletedAt`, `userId`, `imageUrls`.

### Admin API (`AdminOnly` policy)

All routes under `/api/Admin` require JWT with **Admin** role.

| Method | Path | `{id}` / params | Description |
|--------|------|-----------------|-------------|
| GET | `/Admin` | Query: `pageNumber`, `pageSize`, optional `email` | Paged users (`UserDto`) |
| GET | `/Admin/{id}` | User id | Single user |
| PATCH | `/Admin/{id}/role` | User id. Body: `{ "role": 0 \| 1 }` | Cannot demote self or last admin |
| PATCH | `/Admin/{userId}/status` | User id. Block: `{ "isBlocked", "blockedUntil", "blockReason" }` | Reason required when blocking |
| GET | `/Admin/{userId}/cars` | User id. `pageNumber`, `pageSize` | That user’s active listings |
| GET | `/Admin/deleted` | `pageNumber`, `pageSize` | Paged soft-deleted cars (`CarListDto`) |
| GET | `/Admin/{id}/deleted` | **Car** id | Deleted car details (`CarDetailsDto`, includes `isDeleted`) |
| PATCH | `/Admin/{id}/restore` | **Car** id | Undo soft-delete (+ related favorites). `200` + `true` |
| DELETE | `/Admin/{id}` | **Car** id | **Hard** delete (only if already soft-deleted). `204` |

**Moderation on live listings:** admin may also `PUT` / `DELETE` `/api/cars/{id}` like the owner. Use `/Admin/deleted` + restore/hard-delete for removed listings.

Swagger (`/swagger` in Development): use **Authorize** with the raw JWT, or test with Postman/curl.

- JWT secret was rotated and secrets were removed from repo config — make sure you set `Jwt:*` via user-secrets / env.
- Rate limiting was adjusted to work behind proxies.
- FluentValidation auto-validation adapters were removed; validators are registered via DI and `JwtSettings` is validated on startup.
- Read-only queries (`AdminService`, `CarService`, `FavoriteService`, `UserService`) use `AsNoTracking()` for better EF Core performance.
- All timestamps use `DateTime.UtcNow` for consistency.
- Role strings in controllers use `AppRoles` constants (`Constants/AppRoles.cs`) instead of hardcoded strings — no magic strings in `[Authorize(Roles = ...)]`.
- **Mapster 7.4.0** added for object mapping — `UserListDto` and other mappings use `.Adapt<T>()` instead of manual property assignment.

## Tests (backend)

From repo root:

```bash
dotnet test backend/Autovibe.API.Tests/Autovibe.API.Tests.csproj -c Release
```

Notes:
- **Integration tests** use `WebApplicationFactory` + **EF InMemory DB** (see `backend/Autovibe.API.Tests/CustomWebApplicationFactory.cs`).
- There is an **end-to-end smoke test** that hits every controller at least once: `AllEndpointsSmokeTests`.
- The smoke test exercises `POST /api/cars/upload-image` with a tiny PNG; it can create files under `backend/Autovibe.API/wwwroot/images/cars/` if your test host runs with a real webroot. If you see untracked PNGs, don’t commit them.

## Frontend

You need `VITE_API_URL` or the app dies on startup (see `frontend/src/api/api.ts`). Copy `frontend/.env.example` to `frontend/.env` and fill in the value:

```env
VITE_API_URL=http://localhost:5258
```

No `/api` at the end — the axios instance adds `/api`. Vite dev server proxies `/api` to that host (`vite.config.ts`).

```bash
# from repo root (recommended)
npm install

# or only frontend
cd frontend && npm install && npm run dev
```

Opens on **5173** by default. JWT is stored in `localStorage` under `token`.

### Routes

| Path | Description |
|------|-------------|
| `/` | Home |
| `/login`, `/register` | Auth |
| `/cars` | List + filters |
| `/cars/:id` | Car details |
| `/cars/new`, `/cars/:id/edit` | Create / edit (owner) |
| `/cars/my` | My listings |
| `/favorites` | Saved cars |
| `/profile` | Profile & password |
| `/admin/users` | Admin user list |
| `/admin/users/:userId` | User details, block, role, their cars |
| `/admin/deleted` | Soft-deleted cars |
| `/admin/deleted/:id` | Deleted car details — **Restore** / hard-delete (admin menu: **DeletedCars**) |

**Admin UI:** account menu shows **Users** and **DeletedCars** when `user.role === 0` (Admin). API calls return **403** without admin role; pages show permission errors.

Restore button on deleted details requires `car.isDeleted` from the API (included in `CarDetailsDto` since the DTO/mapping update).

Routes are protected by `ProtectedRoute` (requires login) and `AdminRoute` (requires admin role) guards — unauthenticated users are redirected to `/login`, non-admins to `/`.

Image uploads are validated on the frontend before the request is sent — only `image/*` types and files under 5 MB are accepted (`useCarCreate`, `useCarEdit`).

## Mobile (optional)

Expo app under `mobile/` — same API and shared Redux store (`@autovibe/app-state`) as the web app.

Create `mobile/.env` with the API origin (no `/api` suffix):

```env
# Android emulator → host machine
EXPO_PUBLIC_API_URL=http://10.0.2.2:5258

# Physical device on same Wi‑Fi — use your machine's LAN IP instead
# EXPO_PUBLIC_API_URL=http://192.168.x.x:5258
```

From repo root (after `npm install`):

```bash
cd mobile && npm run start
```

Then press `a` (Android) or `i` (iOS) in the Expo CLI, or scan the QR code with Expo Go. The API must be running and reachable from the device/emulator.

## Running locally

1. MySQL up, schema applied.
2. User secrets set for API.
3. `frontend/.env` exists with `VITE_API_URL`.

Then:
- Terminal 1: `cd backend/Autovibe.API && dotnet run` → API (usually **5258**, check launch settings if it differs).
- Terminal 2: `cd frontend && npm run dev` (or `npm run dev --workspace=frontend` from root).

## Random commands

`npm run build` / `npm run lint` — frontend. `dotnet publish -c Release` — API. After model changes: `dotnet ef migrations add Whatever` from the API project.

## Images

Authenticated upload: `POST /api/cars/upload-image`. Files go under `wwwroot/images/cars/`, API returns paths like `/images/cars/...`. Frontend builds full URLs with `getImageUrl` + same base as `VITE_API_URL` — if images 404, that’s usually the first place to check.

**Cleanup:** `CarImageCleanupWorker` runs nightly as a hosted background service. It scans `wwwroot/images/cars/` and physically deletes any image files that no longer exist in the database, preventing orphaned files from accumulating on disk.

## Production

Publish API, `npm run build` for frontend (`frontend/dist/`). Set real connection string + JWT in your host’s env/secret store. Build the frontend with `VITE_API_URL` pointing at your **public** API URL. Fix CORS for your real frontend origin.

## When something’s wrong

- **Blank error on app load** — missing `VITE_API_URL`.
- **401** — not logged in or token expired; log in again.
- **403 on admin pages** — user is not admin, or old token before role change (re-login).
- **Restore button missing** — `GET /api/Admin/{id}/deleted` must return `isDeleted: true`; admin role required in UI.
- **CORS** — origin in backend config doesn’t match where you opened the app.
- **Images broken** — wrong base URL or static files not served from `wwwroot`.
