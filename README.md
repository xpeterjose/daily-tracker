# LifeTrack 📋

A full-stack daily task management app with Google OAuth authentication.

**Stack:** React + Vite + Tailwind CSS (frontend) · NestJS + TypeORM + SQLite (backend)

---

## Quick Start

### 1. Set Up Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project (or use existing)
3. Enable **Google+ API** or **Google Identity**
4. Create **OAuth 2.0 Client ID** → Web Application
5. Add Authorized redirect URI: `http://localhost:3001/auth/google/callback`
6. Copy your **Client ID** and **Client Secret**

### 2. Configure Backend

```bash
cd server
# Edit .env — fill in GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
# Generate a strong JWT_SECRET too
```

### 🚀 Production Deployment

This application is ready for deployment using **Render** (Backend) and **Vercel** (Frontend).

### 1. Database Setup
- Provision a **Postgres** terminal on Render or Railway.
- Copy the **Internal Database URL** (or External if required).

### 2. Backend Deployment (Render)
- Create a new **Web Service**.
- Select the `server` directory (or use the root and set `rootDirectory: server`).
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start:prod`
- **Environment Variables**:
  - `NODE_ENV`: `production`
  - `DATABASE_URL`: `[Your-Postgres-URL]`
  - `JWT_SECRET`: `[Long-Random-String]`
  - `GOOGLE_CLIENT_ID`: `[Your-ID]`
  - `GOOGLE_CLIENT_SECRET`: `[Your-Secret]`
  - `GOOGLE_CALLBACK_URL`: `https://your-backend.onrender.com/auth/google/callback`
  - `CLIENT_URL`: `https://your-frontend.vercel.app`

### 3. Frontend Deployment (Vercel)
- Import your repository.
- Select the `client` directory as the project root.
- **Environment Variables**:
  - `VITE_API_URL`: `https://your-backend.onrender.com`

### 4. Google OAuth Final Step
Add your production callback URL to the **Authorized Redirect URIs** in the [Google Cloud Console](https://console.cloud.google.com/apis/credentials):
`https://your-backend.onrender.com/auth/google/callback`

### 3. Start the Backend

```bash
cd server
npm run start:dev
```

Server runs at **http://localhost:3001**

### 4. Start the Frontend

```bash
cd client
npm run dev
```

App runs at **http://localhost:5173**

---

## Project Structure

```
daily-tracker/
├── client/                  # React + Vite + Tailwind CSS
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── pages/           # Login, Dashboard, AuthCallback
│       ├── store/           # Zustand auth store
│       ├── lib/             # Axios API client
│       └── types/           # TypeScript interfaces
└── server/                  # NestJS backend
    └── src/
        ├── auth/            # Google OAuth + JWT
        ├── users/           # User entity + service
        └── tasks/           # Task CRUD
```

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/auth/google` | — | Initiate Google OAuth |
| GET | `/auth/google/callback` | — | OAuth callback |
| GET | `/auth/me` | JWT | Get current user |
| GET | `/tasks?date=YYYY-MM-DD` | JWT | Get tasks for date |
| POST | `/tasks` | JWT | Create task |
| PATCH | `/tasks/:id` | JWT | Update task |
| DELETE | `/tasks/:id` | JWT | Delete task |
