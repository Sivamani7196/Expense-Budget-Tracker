# FinanceIQ (Previous Version) - Statistical Forecasting Edition

## Overview
This document describes the earlier version of FinanceIQ before real AI/ML models and datasets were introduced.

The previous version was a full-stack personal finance tracker with:
- React + TypeScript frontend
- Express + TypeScript backend
- MySQL database
- Client-side statistical forecasting (no Python ML service)

## What This Version Includes
- User signup/signin with bcrypt password hashing
- Transaction management (add, list, delete)
- Budget management by category and period
- Dashboard totals and charts
- Statistical forecasting and explainable insights generated in the frontend

## What This Version Does Not Include
- No external AI/ML training dataset
- No backend model training pipeline
- No Python-based inference service
- No RandomForest, IsolationForest, LSTM, XGBoost, or similar deployed models

## Statistical Forecasting Approach
The previous version used deterministic statistical methods inside the frontend forecasting engine.

Core methods:
- Moving average smoothing
- Exponential smoothing
- Linear regression slope for trend detection
- Seasonal cycle checks through grouped time windows
- Sigma-rule anomaly detection by category (mean + standard deviation threshold)
- Ensemble-style weighted combination of statistical predictions

### Forecast and Insight Outputs
- Predicted spending per category
- Trend direction: increasing, decreasing, stable
- Confidence score per category and overall
- Spending pattern classification: consistent, irregular, seasonal, trending up, trending down
- Risk level classification: low, medium, high
- Human-readable recommendations
- Anomaly list with reasons

## Previous Architecture
1. Frontend fetched transactions and budgets from Express APIs.
2. Forecast hooks watched transaction changes with debouncing.
3. Statistical engine analyzed transaction history in the browser.
4. UI rendered forecasts, anomalies, confidence, and recommendations.

## Important Source Files (Previous Version Logic)
- Statistical engine: src/utils/aiForecasting.ts
- Forecast hook: src/hooks/useAIForecast.ts
- Forecast page: src/pages/Forecast.tsx
- Forecast UI cards: src/components/forecast/ForecastCard.tsx
- Insight components: src/components/forecast/AIInsights.tsx

## Setup (Previous Version)
Use these steps for the original non-ML workflow.

### 1. Install dependencies
npm install

### 2. Configure environment
Create .env.local with:
VITE_DB_HOST=localhost
VITE_DB_PORT=3306
VITE_DB_USER=root
VITE_DB_PASSWORD=your_password
VITE_DB_NAME=financeiq
VITE_API_URL=http://localhost:5000/api
SERVER_PORT=5000

### 3. Initialize database
mysql -u root -p < database/schema.sql

### 4. Run app
npm run dev

### 5. Open application
Frontend UI: http://localhost:5173
Backend API health: http://localhost:5000/api/health

## API Scope in Previous Version
Authentication:
- POST /api/auth/signup
- POST /api/auth/signin

Transactions:
- GET /api/transactions/:userId
- POST /api/transactions
- DELETE /api/transactions/:transactionId

Budgets:
- GET /api/budgets/:userId
- POST /api/budgets

## Notes for Interview Context
If you are presenting the previous version, frame it as:
- Explainable statistical forecasting
- Fast, client-side analysis
- Strong baseline analytics without model-serving infrastructure
- Foundation suitable for later migration to real AI/ML pipelines
