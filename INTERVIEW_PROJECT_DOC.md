# FinanceIQ Project Document (Interview Version)

## 1) Project Summary
FinanceIQ is a full-stack personal finance tracker that helps users record income/expenses, set category budgets, and view analytics with AI-inspired forecasting. The goal is to give users a clear picture of their financial behavior and provide actionable insights, not just a ledger. The system is built with a React + TypeScript frontend, an Express + TypeScript backend, and a MySQL database.

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
- The AI analysis runs client-side using historical transactions.

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
FinanceIQ includes an AI-inspired forecasting layer. This is not a deployed ML service; it is client-side statistical forecasting designed for explainability.

Pipeline
1) Transactions load into the finance hook.
2) AI hooks watch data changes and debounce analysis.
3) The forecasting engine generates insights and predictions.
4) UI renders forecasts, anomalies, and recommendations.

Baseline Analysis (Fast Engine)
- Moving average and exponential smoothing for baseline spend
- Trend detection via linear regression slope
- Seasonal cycle detection using time grouping
- Anomaly detection with mean + standard deviation thresholds
- Category pattern analysis (frequency, volatility, predictability)

Outputs
- Predicted spend per category
- Trend direction (increasing/decreasing/stable)
- Confidence scores
- Anomaly list with reasons
- Recommendations based on risk and volatility

Advanced Analysis (Ensemble Simulation)
- Neural-network style predictor
- ARIMA-style time series model
- SVR-style regression
- Ensemble weighting across models
- Anomaly scoring with isolation-forest style logic

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
- Move AI processing to backend for larger datasets.

Long term
- Real ML pipeline with training data (Prophet/LSTM/XGBoost).
- Scheduled retraining and model versioning.
- Role-based access and audit logs.

## 11) What This Demonstrates
- Full-stack system design and implementation.
- Strong UX with real-time feedback loops.
- Explainable AI-inspired analytics that produce user-facing insights.
- A foundation that can evolve into a production-grade finance platform.
