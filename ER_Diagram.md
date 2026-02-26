# FinanceIQ Database - Entity Relationship Diagram

## Database Schema Overview

This ER diagram represents the database structure for the FinanceIQ personal finance management application.

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           FinanceIQ Database ER Diagram                             │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────┐
│         USERS           │
├─────────────────────────┤
│ PK  id (uuid)          │
│     email (text) UNIQUE │
│     name (text)         │
│     created_at (timestamptz) │
└─────────────────────────┘
            │
            │ 1
            │
            │ has many
            │
            ▼ *
┌─────────────────────────┐         ┌─────────────────────────┐
│      TRANSACTIONS       │         │        BUDGETS          │
├─────────────────────────┤         ├─────────────────────────┤
│ PK  id (uuid)          │         │ PK  id (uuid)          │
│ FK  user_id (uuid)     │◄────────┤ FK  user_id (uuid)     │
│     amount (numeric)    │         │     category (text)     │
│     description (text)  │         │     amount (numeric)    │
│     category (text)     │         │     period (text)       │
│     type (text)         │         │     created_at (timestamptz) │
│     date (date)         │         └─────────────────────────┘
│     created_at (timestamptz) │              │ *
└─────────────────────────┘                  │
            │                                │ 1
            │                                │
            │ *                              │ belongs to
            │                                │
            │ belongs to                     ▼ 1
            │                    ┌─────────────────────────┐
            │                    │         USERS           │
            │                    │    (same as above)      │
            │                    └─────────────────────────┘
            │ 1
            │
            ▼ 1
┌─────────────────────────┐
│         USERS           │
│    (same as above)      │
└─────────────────────────┘
```

## Detailed Entity Descriptions

### 1. USERS Entity
```
┌─────────────────────────────────────────────────────────────┐
│                         USERS                               │
├─────────────────────────────────────────────────────────────┤
│ Attribute      │ Type           │ Constraints               │
├────────────────┼────────────────┼───────────────────────────┤
│ id             │ uuid           │ PRIMARY KEY, DEFAULT      │
│ email          │ text           │ NOT NULL, UNIQUE          │
│ name           │ text           │ NOT NULL                  │
│ created_at     │ timestamptz    │ DEFAULT now()             │
└─────────────────────────────────────────────────────────────┘

Business Rules:
- Each user must have a unique email address
- User ID is auto-generated UUID
- Created timestamp is automatically set
- RLS (Row Level Security) enabled
```

### 2. TRANSACTIONS Entity
```
┌─────────────────────────────────────────────────────────────┐
│                      TRANSACTIONS                           │
├─────────────────────────────────────────────────────────────┤
│ Attribute      │ Type           │ Constraints               │
├────────────────┼────────────────┼───────────────────────────┤
│ id             │ uuid           │ PRIMARY KEY, DEFAULT      │
│ user_id        │ uuid           │ FOREIGN KEY → users(id)   │
│ amount         │ numeric(10,2)  │ NOT NULL                  │
│ description    │ text           │ NOT NULL                  │
│ category       │ text           │ NOT NULL                  │
│ type           │ text           │ CHECK (income/expense)    │
│ date           │ date           │ NOT NULL                  │
│ created_at     │ timestamptz    │ DEFAULT now()             │
└─────────────────────────────────────────────────────────────┘

Business Rules:
- Each transaction belongs to exactly one user
- Amount stored with 2 decimal precision
- Type must be either 'income' or 'expense'
- Category represents spending/income category
- Date represents when transaction occurred
- RLS enabled - users can only access their own transactions
- Cascade delete when user is deleted
```

### 3. BUDGETS Entity
```
┌─────────────────────────────────────────────────────────────┐
│                        BUDGETS                              │
├─────────────────────────────────────────────────────────────┤
│ Attribute      │ Type           │ Constraints               │
├────────────────┼────────────────┼───────────────────────────┤
│ id             │ uuid           │ PRIMARY KEY, DEFAULT      │
│ user_id        │ uuid           │ FOREIGN KEY → users(id)   │
│ category       │ text           │ NOT NULL                  │
│ amount         │ numeric(10,2)  │ NOT NULL                  │
│ period         │ text           │ CHECK (monthly/yearly)    │
│ created_at     │ timestamptz    │ DEFAULT now()             │
└─────────────────────────────────────────────────────────────┘

Business Rules:
- Each budget belongs to exactly one user
- Budget amount stored with 2 decimal precision
- Period must be either 'monthly' or 'yearly'
- Category represents the spending category being budgeted
- RLS enabled - users can only access their own budgets
- Cascade delete when user is deleted
```

## Relationships

### 1. Users ↔ Transactions (One-to-Many)
```
USERS (1) ────────── (*) TRANSACTIONS
  │                        │
  │ id                     │ user_id
  └────────────────────────┘

- One user can have many transactions
- Each transaction belongs to exactly one user
- Foreign key: transactions.user_id → users.id
- Cascade delete: When user deleted, all transactions deleted
```

### 2. Users ↔ Budgets (One-to-Many)
```
USERS (1) ────────── (*) BUDGETS
  │                     │
  │ id                  │ user_id
  └─────────────────────┘

- One user can have many budgets
- Each budget belongs to exactly one user
- Foreign key: budgets.user_id → users.id
- Cascade delete: When user deleted, all budgets deleted
```

## Indexes

### Performance Optimization Indexes
```
┌─────────────────────────────────────────────────────────────┐
│                        INDEXES                              │
├─────────────────────────────────────────────────────────────┤
│ Table         │ Index Name              │ Columns          │
├───────────────┼─────────────────────────┼──────────────────┤
│ users         │ users_pkey              │ id (PRIMARY)     │
│ users         │ users_email_key         │ email (UNIQUE)   │
│ transactions  │ transactions_pkey       │ id (PRIMARY)     │
│ transactions  │ transactions_user_id_idx│ user_id          │
│ transactions  │ transactions_date_idx   │ date             │
│ transactions  │ transactions_category_idx│ category        │
│ budgets       │ budgets_pkey            │ id (PRIMARY)     │
│ budgets       │ budgets_user_id_idx     │ user_id          │
│ budgets       │ budgets_category_idx    │ category         │
└─────────────────────────────────────────────────────────────┘
```

## Security (Row Level Security)

### RLS Policies
```
┌─────────────────────────────────────────────────────────────┐
│                    RLS POLICIES                             │
├─────────────────────────────────────────────────────────────┤
│ Table         │ Operation │ Policy Description              │
├───────────────┼───────────┼─────────────────────────────────┤
│ users         │ SELECT    │ Users can read own data         │
│ users         │ INSERT    │ Authenticated users can insert  │
│ users         │ UPDATE    │ Users can update own data       │
│ transactions  │ SELECT    │ Users can read own transactions │
│ transactions  │ INSERT    │ Users can insert own trans.     │
│ transactions  │ UPDATE    │ Users can update own trans.     │
│ transactions  │ DELETE    │ Users can delete own trans.     │
│ budgets       │ SELECT    │ Users can read own budgets      │
│ budgets       │ INSERT    │ Users can insert own budgets    │
│ budgets       │ UPDATE    │ Users can update own budgets    │
│ budgets       │ DELETE    │ Users can delete own budgets    │
└─────────────────────────────────────────────────────────────┘
```

## Data Types & Constraints

### Category Enumerations
```
Transaction Categories:
- food (Food & Dining)
- transportation (Transportation)
- entertainment (Entertainment)
- shopping (Shopping)
- bills (Bills & Utilities)
- healthcare (Healthcare)
- education (Education)
- travel (Travel)
- income (Income)
- other (Other)

Transaction Types:
- income
- expense

Budget Periods:
- monthly
- yearly
```

## Application Logic Flow

### Data Flow Diagram
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    User     │───▶│ Transaction │───▶│  Analytics  │
│ Management  │    │ Management  │    │ & Forecast  │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Budget    │    │  Dashboard  │    │ AI Insights │
│ Management  │    │  Overview   │    │ & Reports   │
└─────────────┘    └─────────────┘    └─────────────┘
```

This ER diagram represents a well-normalized database design that supports:
- User authentication and data isolation
- Comprehensive transaction tracking
- Budget management and monitoring
- Performance optimization through strategic indexing
- Security through Row Level Security policies
- Scalability for future enhancements