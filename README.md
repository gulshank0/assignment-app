# JobTracker App

A production-ready full-stack **Job Application Tracker** built with React, Node.js, TypeScript, Prisma, and PostgreSQL.

## Tech Stack

| Layer      | Technology                                      |
| ---------- | ----------------------------------------------- |
| Frontend   | React 19 + Vite + Tailwind CSS                  |
| Backend    | Node.js + Express + TypeScript                  |
| ORM        | Prisma                                          |
| Database   | PostgreSQL                                      |
| Auth       | JWT (access + refresh tokens, httpOnly cookies) |
| Validation | Zod (shared frontend & backend)                 |

---

## Features

- ✅ **Authentication** – Signup, Login, Logout with JWT (access token in memory, refresh token in httpOnly cookie)
- ✅ **Persistent sessions** – Silent token refresh on app load
- ✅ **Job Application CRUD** – Create, read, update, delete applications
- ✅ **Filtering & Search** – Filter by status, search by company/position
- ✅ **Dashboard stats** – Cards showing totals by status
- ✅ **Grid/List toggle** – Switch between card grid and list views
- ✅ **Role-based** – USER / ADMIN roles
- ✅ **Responsive** – Mobile-first dark UI

---

## Project Structure

```
deknek/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── src/
│       ├── controllers/    # auth.controller.ts, application.controller.ts
│       ├── middleware/     # auth, validate, error
│       ├── prisma/         # Prisma client singleton
│       ├── routes/         # auth.routes.ts, application.routes.ts
│       ├── services/       # auth.service.ts, application.service.ts
│       ├── types/          # Shared types
│       ├── app.ts          # Express app factory
│       └── index.ts        # Entry point
├── frontend/
│   └── src/
│       ├── api/            # axiosInstance.ts, auth.api.ts, applications.api.ts
│       ├── components/     # Navbar, JobCard, JobModal, StatusBadge, StatsCard, etc.
│       ├── context/        # AuthContext.tsx
│       ├── pages/          # LoginPage, SignupPage, DashboardPage
│       └── types/          # Shared TypeScript types
├── docker-compose.yml      # Local PostgreSQL
└── README.md
```

---

## Local Development Setup

### Prerequisites

- Node.js ≥ 18
- Docker (for the local database) OR a PostgreSQL 14+ instance

### 1. Clone & install

```bash
git clone <repo-url>
cd deknek

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Start PostgreSQL

```bash
# From the project root:
docker compose up -d
```

Or provide your own `DATABASE_URL` in the next step.

### 3. Configure environment

```bash
cp backend/.env.example backend/.env
# Edit backend/.env if needed (DATABASE_URL, JWT secrets)
```

### 4. Run Prisma migrations & seed

```bash
cd backend

# Generate Prisma client
npm run db:generate

# Create tables
npm run db:migrate
# (or for a quick push without migration files: npm run db:push)

# Seed demo data (optional)
npm run db:seed
```

Demo credentials after seeding:

- **Email:** `demo@jobtracker.com` | **Password:** `Demo1234!`
- **Email:** `admin@jobtracker.com` | **Password:** `Admin1234!`

### 5. Start backend

```bash
cd backend
npm run dev
# → http://localhost:5000
```

### 6. Start frontend

```bash
cd frontend
npm run dev
# → http://localhost:5173
```

---

## API Endpoints

### Auth (`/api/auth`)

| Method | Route      | Auth      | Description    |
| ------ | ---------- | --------- | -------------- |
| POST   | `/signup`  | ❌        | Create account |
| POST   | `/login`   | ❌        | Login          |
| POST   | `/refresh` | 🍪 cookie | Rotate tokens  |
| POST   | `/logout`  | 🍪 cookie | Logout         |
| GET    | `/me`      | ✅        | Current user   |

### Applications (`/api/applications`) — all protected

| Method | Route  | Description                        |
| ------ | ------ | ---------------------------------- |
| GET    | `/`    | List (supports `?status=&search=`) |
| POST   | `/`    | Create                             |
| GET    | `/:id` | Get one                            |
| PATCH  | `/:id` | Update                             |
| DELETE | `/:id` | Delete                             |

---

## Deployment Guide

### Database — Neon / Supabase / Railway

1. Create a PostgreSQL database on your chosen provider
2. Copy the connection string into your backend `DATABASE_URL` env var
3. Run `npm run db:migrate --production` (or `npm run db:push`) against the remote DB

### Backend — Render / Railway / Fly.io

**Render example:**

1. New Web Service → connect your repo
2. Root directory: `backend`
3. Build command: `npm install && npm run db:generate && npm run build`
4. Start command: `npm start`
5. Add environment variables:
   ```
   DATABASE_URL=<neon/supabase connection string>
   JWT_ACCESS_SECRET=<random 64-char string>
   JWT_REFRESH_SECRET=<different random 64-char string>
   JWT_ACCESS_EXPIRES=15m
   JWT_REFRESH_EXPIRES=7d
   NODE_ENV=production
   CLIENT_URL=https://your-frontend-domain.vercel.app
   ```

### Frontend — Vercel / Netlify

**Vercel example:**

1. Import the repo → set root directory to `frontend`
2. Build command: `npm run build` (already configured)
3. Add environment variable:
   ```
   VITE_API_URL=   # leave empty — the Vite proxy handles dev; set to backend URL for production
   ```
4. Update `vite.config.ts` proxy → for production, set the full backend URL as the base URL in `axiosInstance.ts`:
   ```ts
   // src/api/axiosInstance.ts
   baseURL: import.meta.env.VITE_API_URL || '/api',
   ```

### Generate secure secrets

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Environment Variables Reference

### Backend (`.env`)

```env
DATABASE_URL=postgresql://user:pass@host:5432/jobtracker
JWT_ACCESS_SECRET=<64-char random string>
JWT_REFRESH_SECRET=<different 64-char random string>
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Frontend (optional `.env.local`)

```env
VITE_API_URL=http://localhost:5000  # Only needed if not using Vite proxy
```
