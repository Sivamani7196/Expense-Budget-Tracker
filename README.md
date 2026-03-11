# Expense & Budget Tracker (Previous Version)

## Version Focus
This README documents the previous version of the project, before real AI/ML models and datasets were added.

This version uses only statistical forecasting methods.

## Stack
- Frontend: React + TypeScript + Vite + Tailwind
- Backend: Express + TypeScript
- Database: MySQL
- Forecasting: Client-side statistical engine (no Python model service)

## Core Features
- User authentication (signup/signin)
- Transaction CRUD flows (add/list/delete)
- Budget setup by category and period
- Dashboard with totals and analytics visuals
- Forecast insights using statistical methods

## Statistical Models Used (No Real ML Training)
- Moving averages
- Exponential smoothing
- Linear regression trend estimation
- Seasonal pattern checks from time-grouped series
- Category-level anomaly detection using sigma threshold rules
- Weighted ensemble of statistical outputs for final prediction

## Forecast Output
- Predicted spend per category
- Trend status: increasing, decreasing, stable
- Confidence scores
- Spending pattern and risk level
- Recommendations and anomaly reasons

## Setup
1. Install dependencies
npm install

2. Configure environment in .env.local
VITE_DB_HOST=localhost
VITE_DB_PORT=3306
VITE_DB_USER=root
VITE_DB_PASSWORD=your_password
VITE_DB_NAME=financeiq
VITE_API_URL=http://localhost:5000/api
SERVER_PORT=5000

3. Create database tables
mysql -u root -p < database/schema.sql

4. Start frontend and backend
npm run dev

5. Open
- Frontend: http://localhost:5173
- API health: http://localhost:5000/api/health

## API Endpoints
Authentication
- POST /api/auth/signup
- POST /api/auth/signin

Transactions
- GET /api/transactions/:userId
- POST /api/transactions
- DELETE /api/transactions/:transactionId

Budgets
- GET /api/budgets/:userId
- POST /api/budgets

## Previous Version Source Pointers
- Statistical forecasting engine: src/utils/aiForecasting.ts
- Forecast hook: src/hooks/useAIForecast.ts
- Forecast page UI: src/pages/Forecast.tsx
- Insight component: src/components/forecast/AIInsights.tsx

## Extended Notes
For a longer previous-version description, see README_PREVIOUS_VERSION.md.
