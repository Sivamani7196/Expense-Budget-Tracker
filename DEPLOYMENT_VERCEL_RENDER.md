# Deployment Guide (Vercel + Render) for Expense Budget Tracker

This guide is for this exact repository:
- Frontend: Vite React app (served by Vercel)
- Backend: Express API in `server.ts` (served by Render)
- Database: MySQL (Render PostgreSQL is not compatible with this code)

## 10-Minute Checklist

### 0) Prerequisites (1 min)
- GitHub repo is pushed: `https://github.com/Sivamani7196/Expense-Budget-Tracker`
- Database schema file is ready: `database/schema.sql`

### 1) Create production MySQL database (2 min)
Use one of these:
- Railway MySQL
- PlanetScale MySQL
- Aiven MySQL

Then run schema:
- Import `database/schema.sql`

Collect DB values:
- `VITE_DB_HOST`
- `VITE_DB_PORT`
- `VITE_DB_USER`
- `VITE_DB_PASSWORD`
- `VITE_DB_NAME`

### 2) Deploy backend on Render (3 min)
1. Go to Render -> New -> Web Service
2. Connect GitHub repo: `Sivamani7196/Expense-Budget-Tracker`
3. Configure:
   - Name: `expense-budget-api`
   - Environment: `Node`
   - Root Directory: leave empty
   - Build Command: `npm install`
   - Start Command: `npm run server:tsx`
4. Add Environment Variables in Render:
   - `PORT=10000` (Render sets this automatically; optional)
   - `SERVER_PORT=10000` (optional fallback)
   - `VITE_DB_HOST=<your_host>`
   - `VITE_DB_PORT=<your_port>`
   - `VITE_DB_USER=<your_user>`
   - `VITE_DB_PASSWORD=<your_password>`
   - `VITE_DB_NAME=<your_db_name>`
   - `FRONTEND_URL=https://<your-vercel-domain>`
5. Deploy and copy backend URL:
   - Example: `https://expense-budget-api.onrender.com`

Health check:
- Open `https://<render-domain>/api/health`
- Expect: `{ "status": "ok" }`

### 3) Deploy frontend on Vercel (2 min)
1. Go to Vercel -> Add New Project
2. Import same GitHub repo
3. Configure project:
   - Framework Preset: `Vite`
   - Root Directory: `.`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add Environment Variable:
   - `VITE_API_URL=https://<render-domain>/api`
5. Deploy and open your Vercel URL

### 4) Validate end-to-end (2 min)
- Open app on Vercel
- Sign up a new user
- Create a transaction
- Create a budget
- Refresh and confirm data persists

## Environment Variable Matrix

### Render (Backend)
- `VITE_DB_HOST`
- `VITE_DB_PORT`
- `VITE_DB_USER`
- `VITE_DB_PASSWORD`
- `VITE_DB_NAME`
- `FRONTEND_URL`
- `PORT` or `SERVER_PORT`

### Vercel (Frontend)
- `VITE_API_URL`

## Troubleshooting

### CORS error in browser
- Ensure Render has:
  - `FRONTEND_URL=https://<your-vercel-domain>`
- If using custom domain, include that exact URL.
- Multiple domains are supported as comma-separated values:
  - `FRONTEND_URL=https://app.example.com,https://www.app.example.com`

### Backend not starting on Render
- Confirm Start Command is exactly: `npm run server:tsx`
- Check Render logs for missing env values.

### 500 on API calls
- Verify MySQL credentials and network access from Render.
- Confirm tables exist by importing `database/schema.sql`.

### Frontend still calls localhost
- In Vercel, set `VITE_API_URL` to Render API URL and redeploy.

## Recommended Production Hardening (next step)
- Restrict CORS to production domains only (already supported via `FRONTEND_URL`)
- Use strong DB credentials
- Enable automated backups on DB provider
- Add monitoring/alerts on Render and Vercel
