# FinanceIQ - Setup Instructions

## Architecture

The application uses a **client-server architecture**:
- **Frontend**: React + Vite (port 5173)
- **Backend**: Express.js API (port 5000)
- **Database**: MySQL

## Prerequisites

1. **MySQL Server** installed and running
2. **Node.js** (v16+) installed
3. Database created with schema

## Quick Start

### 1. Database Setup

**If not done yet, create the database:**

```bash
mysql -u root -p < database/schema.sql
```

Or manually:
```sql
CREATE DATABASE financeiq;
USE financeiq;
-- Copy contents from database/schema.sql
```

### 2. Configure Environment

Create `.env.local` from `.env.example`, then update with your MySQL credentials:

```env
VITE_DB_HOST=localhost
VITE_DB_PORT=3306
VITE_DB_USER=root
VITE_DB_PASSWORD=your_password
VITE_DB_NAME=financeiq
VITE_API_URL=http://localhost:5000/api
SERVER_PORT=5000
VITE_JWT_SECRET=change-this-in-production
```

### 3. Start Frontend + Backend

Open **Terminal 1**:
```bash
npm run dev
```

Expected output:
```
🚀 Server running on http://localhost:5000
✅ MySQL connected successfully
➜  Local:   http://localhost:5173/
```

### 5. Access the App

Open your browser and go to:
```
http://localhost:5173
```

### Optional: Start Backend only

```bash
npm run server:tsx
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - Login with email/password

### Transactions  
- `GET /api/transactions/:userId` - Get user's transactions
- `POST /api/transactions` - Create transaction
- `DELETE /api/transactions/:transactionId` - Delete transaction

### Budgets
- `GET /api/budgets/:userId` - Get user's budgets
- `POST /api/budgets` - Create budget

## Features

✅ Email & Password authentication
✅ No email confirmation required
✅ Full MySQL control
✅ RESTful API
✅ Password hashing with bcrypt
✅ Session management via localStorage

## Troubleshooting

### "Cannot connect to MySQL"
- Check if MySQL is running
- Verify credentials in `.env.local`
- Ensure database `financeiq` exists

### "Connection refused on port 5000"
- Check if backend server is running
- Try a different port: `npm run server:tsx -- --port 5001`

### "API requests failing"
- Check backend console for errors
- Verify `VITE_API_URL` in `.env.local`
- Check browser Network tab for response details

### Port 3000 already in use
```bash
npm run dev -- --port 3001
```

## Development

- Backend code: [server.ts](server.ts)
- Frontend hooks: [src/hooks/](src/hooks/)
- Database schema: [database/schema.sql](database/schema.sql)
- Configuration: [.env.local](.env.local)

## Production Deployment

1. Build frontend: `npm run build`
2. Deploy `dist/` folder to a static hosting service
3. Deploy `server.ts` to a Node.js hosting service
4. Update `VITE_API_URL` to point to production API
5. Change `VITE_JWT_SECRET` to a secure random string

For a concrete hosted setup using Vercel (frontend) + Render (backend), follow:
- [DEPLOYMENT_VERCEL_RENDER.md](DEPLOYMENT_VERCEL_RENDER.md)
