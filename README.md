# Autovibe

Проект с .NET API (backend) и React + Vite (frontend).

## Изисквания

- **.NET 8+** (или .NET 10) SDK
- **Node.js 18+**
- **MySQL** с база `autovibe` и потребител (по подразбиране: `daniel` / `123456`)

## База данни

1. Стартирай MySQL.
2. Създай база и потребител (или използвай съществуващите от `appsettings.json`):
   - База: `autovibe`
   - Потребител/парола: виж `backend/Autovibe.API/appsettings.json` → `ConnectionStrings:DefaultConnection`
3. Приложи схемата:
   ```bash
   mysql -u daniel -p autovibe < backend/Autovibe.API/setup_database.sql
   ```
   Или пусни миграциите с EF:
   ```bash
   cd backend/Autovibe.API && dotnet ef database update
   ```

## Стартиране

### Backend (API)

```bash
cd backend/Autovibe.API
dotnet run
```

API-то ще е на **http://localhost:5258**.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend-ът ще е на **http://localhost:5173**.

Отвори в браузър: http://localhost:5173

## Билд за production

```bash
# Backend
cd backend/Autovibe.API && dotnet publish -c Release

# Frontend
cd frontend && npm run build
```

Файловете за статичен сайт са в `frontend/dist/`.
