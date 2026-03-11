# FinanceIQ Project Document (Interview Version)

## 1) Project Summary
FinanceIQ is a full-stack personal finance tracker that helps users record income/expenses, set category budgets, and view analytics with real ML forecasting. The goal is to give users a clear picture of their financial behavior and provide actionable insights, not just a ledger. The system is built with a React + TypeScript frontend, an Express + TypeScript backend, a Python ML service, and a MySQL database.

## 2) Problem Statement and Motivation
Most finance apps stop at expense logging and do not explain patterns or future risk. FinanceIQ addresses this by combining core bookkeeping features (transactions, budgets) with a lightweight forecasting engine. It surfaces trend direction, confidence scores, anomaly alerts, and recommendations to help users make better decisions.

## 3) Tech Stack and Rationale
Frontend
- React: component-based architecture is ideal for dashboards and reusable cards.
- TypeScript: strict typing reduces bugs in data-heavy flows.
- Vite: fast dev server and build pipeline with minimal config.
- Tailwind: rapid, consistent UI styling without heavy CSS boilerplate.

Backend
- Express: lightweight REST API framework, fast to build and easy to scale.
- TypeScript: shared typing mindset across frontend and backend.

Database
- MySQL: relational schema fits users, transactions, and budgets; good local setup and predictable performance.

## 4) System Architecture
The architecture follows a classic client-server model:
- React frontend calls the REST API.
- Express server handles authentication, transactions, and budgets.
- MySQL stores all persistent data.
- A Python ML service performs model training and inference using a dataset plus user transactions.

## 5) Data Model (MySQL)
Three core tables:
- users: id, email, name, password hash, created_at
- transactions: id, user_id, amount, description, category, type, date
- budgets: id, user_id, category, amount, period

This schema enables:
- Fast filtering by user and date
- Category-based analysis for budgets and forecasting
- Referential integrity via foreign keys

## 6) Core Features
Authentication
- Email + password signup/signin
- Passwords hashed with bcrypt
- Client session stored in localStorage

Transactions
- Create, list, and delete
- Categorized by type (income/expense) and category

Budgets
- Monthly or yearly category limits
- Usage calculated against transactions

Analytics Dashboard
- Totals (income, expenses, savings)
- Charts for category spending
- Recent transactions feed

## 7) AI/Forecasting Feature (Implementation Overview)
FinanceIQ includes a real backend ML forecasting layer. The backend calls a Python model service that trains and predicts from both historical dataset rows and user transaction history.

Pipeline
1) Transactions load into the finance hook.
2) Advanced AI hook sends normalized transactions to `POST /api/ai/advanced-forecast`.
3) Express invokes `ml/ai_forecast_service.py`.
4) Python merges `ml/datasets/finance_spending_dataset.csv` with user-derived supervised samples.
5) Models return forecasts, anomalies, confidence, and recommendations.
6) UI renders model outputs in real time.

Modeling Details
- RandomForestRegressor per category for next-amount forecasting
- IsolationForest for anomaly detection
- Calendar + amount features (`amount`, `day_of_week`, `day_of_month`, `month`, `is_weekend`)
- Confidence scoring from MAE-to-variance ratio
- Trend and risk scoring from volatility and slope signals

Outputs
- Predicted spend per category
- Trend direction (increasing/decreasing/stable)
- Confidence scores (overall + by category)
- Anomaly list with anomaly score and reason
- Recommendations based on risk, volatility, and pattern type

## 8) Example AI Output (Interview-Friendly)
If Food expenses were 2000, 2200, 2500, 2900 in recent months:
- Moving average gives a baseline around 2400 to 2500.
- Trend slope is positive, so trend is increasing.
- A 6000 expense would be flagged as an anomaly (>2.5 sigma).
- Forecast might predict next month around 2700 to 3000 with moderate confidence.
- Recommendation could be: "Food spending is trending up; set a stricter budget."

## 9) Security and Constraints
- Passwords stored using bcrypt hashing.
- No JWT-based auth or server-side session yet (MVP scope).
- API trusts userId in requests, which is acceptable for MVP but not production.

## 10) Future Improvements
Short term
- Add JWT auth middleware and route protection.
- Validate request payloads with a schema validator (Zod or Joi).
- Add model cache so retraining is avoided on each request.

Long term
- Real ML pipeline with training data (Prophet/LSTM/XGBoost).
- Scheduled retraining and model versioning.
- Role-based access and audit logs.

## 11) What This Demonstrates
- Full-stack system design and implementation.
- Strong UX with real-time feedback loops.
- Explainable AI-inspired analytics that produce user-facing insights.
- A foundation that can evolve into a production-grade finance platform.
