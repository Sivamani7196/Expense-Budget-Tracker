# MySQL Authentication Setup Guide

This application now uses **MySQL** for authentication instead of Supabase. No email confirmation is required.

## Prerequisites

- **MySQL Server** (v5.7+ or v8.0+) installed on your machine
- **Node.js** (v16+)

## Quick Setup

### 1. Install MySQL

**Windows:**
- Download from [MySQL Official Website](https://dev.mysql.com/downloads/installer/)
- Run the installer and set a root password

**macOS:**
```bash
brew install mysql
brew services start mysql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
```

### 2. Create Database

Open MySQL command line:
```bash
mysql -u root -p
```

Run the schema file:
```sql
source database/schema.sql;
```

Or manually create the database:
```sql
CREATE DATABASE financeiq;
USE financeiq;
-- Then copy and paste contents from database/schema.sql
```

### 3. Configure Environment Variables

Update `.env.local` with your MySQL credentials:

```env
VITE_DB_HOST=localhost
VITE_DB_PORT=3306
VITE_DB_USER=root
VITE_DB_PASSWORD=your_mysql_password
VITE_DB_NAME=financeiq
VITE_JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the Application

```bash
npm run dev
```

## Features

✅ **Email & Password Authentication** - No external providers needed  
✅ **No Email Confirmation** - Users can sign in immediately after signup  
✅ **Password Hashing** - Secure bcrypt encryption  
✅ **Session Management** - localStorage-based sessions  
✅ **MySQL Database** - Full control over your data  

## Database Schema

The application creates three tables:

- **users** - Stores user credentials (email, hashed password, name)
- **transactions** - Financial transactions for each user
- **budgets** - Budget categories for each user

## Security Notes

1. **Change JWT Secret** - Update `VITE_JWT_SECRET` in production
2. **Secure MySQL** - Use strong passwords and limit remote access
3. **HTTPS Required** - Always use HTTPS in production
4. **Password Requirements** - Minimum 6 characters enforced

## Troubleshooting

### MySQL Connection Failed

Check if MySQL is running:
```bash
# Windows
services.msc (look for MySQL)

# macOS
brew services list

# Linux
sudo systemctl status mysql
```

### Can't Create Database

Ensure you have proper permissions:
```sql
GRANT ALL PRIVILEGES ON financeiq.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### Authentication Errors

1. Clear localStorage: Open DevTools → Application → Local Storage → Clear All
2. Check MySQL credentials in `.env.local`
3. Verify database is created and tables exist

## Migration from Supabase

If you were previously using Supabase, all authentication now happens through MySQL. You'll need to:

1. Export any existing user data from Supabase
2. Re-register users in the new MySQL system
3. Update any stored credentials

## Development

- Authentication logic: `src/hooks/useAuth.ts`
- Database connection: `src/lib/mysql.ts`
- Database schema: `database/schema.sql`
