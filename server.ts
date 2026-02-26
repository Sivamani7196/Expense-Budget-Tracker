import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = Number(process.env.PORT || process.env.SERVER_PORT || 5000);
const FRONTEND_URL = process.env.FRONTEND_URL || '*';
const corsOrigins = FRONTEND_URL
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Middleware
app.use(cors({ origin: corsOrigins.includes('*') ? true : corsOrigins }));
app.use(express.json());

// MySQL Pool
const pool = mysql.createPool({
  host: process.env.VITE_DB_HOST || 'localhost',
  port: parseInt(process.env.VITE_DB_PORT || '3306'),
  user: process.env.VITE_DB_USER || 'root',
  password: process.env.VITE_DB_PASSWORD || '',
  database: process.env.VITE_DB_NAME || 'financeiq',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
pool.getConnection()
  .then(connection => {
    console.log('✅ MySQL connected successfully');
    connection.release();
  })
  .catch(error => {
    console.error('❌ MySQL connection failed:', error.message);
  });

// AUTH ENDPOINTS

// Sign Up
app.post('/api/auth/signup', async (req, res) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    const name = String(req.body?.name || '').trim();

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const connection = await pool.getConnection();

    // Check if user exists
    const [existingUsers] = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    ) as any;

    if (existingUsers.length > 0) {
      connection.release();
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userId = uuidv4();
    await connection.query(
      'INSERT INTO users (id, email, name, password) VALUES (?, ?, ?, ?)',
      [userId, email, name, hashedPassword]
    );

    connection.release();

    res.json({
      success: true,
      user: {
        id: userId,
        email,
        name,
        createdAt: new Date(),
      }
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    res.status(500).json({ error: error.message || 'Signup failed' });
  }
});

// Sign In
app.post('/api/auth/signin', async (req, res) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const connection = await pool.getConnection();

    // Find user
    const [rows] = await connection.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    ) as any;

    if (rows.length === 0) {
      connection.release();
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = rows[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      connection.release();
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    connection.release();

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.created_at,
      }
    });
  } catch (error: any) {
    console.error('Signin error:', error);
    res.status(500).json({ error: error.message || 'Signin failed' });
  }
});

// TRANSACTIONS ENDPOINTS

// Get transactions
app.get('/api/transactions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const connection = await pool.getConnection();

    const [transactions] = await connection.query(
      'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC',
      [userId]
    ) as any;

    connection.release();
    res.json(transactions);
  } catch (error: any) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add transaction
app.post('/api/transactions', async (req, res) => {
  try {
    const { userId, amount, description, category, type, date } = req.body;

    const connection = await pool.getConnection();
    const transactionId = uuidv4();

    await connection.query(
      'INSERT INTO transactions (id, user_id, amount, description, category, type, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [transactionId, userId, amount, description, category, type, date]
    );

    connection.release();
    res.json({ success: true, id: transactionId });
  } catch (error: any) {
    console.error('Add transaction error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete transaction
app.delete('/api/transactions/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;
    const connection = await pool.getConnection();

    await connection.query(
      'DELETE FROM transactions WHERE id = ?',
      [transactionId]
    );

    connection.release();
    res.json({ success: true });
  } catch (error: any) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ error: error.message });
  }
});

// BUDGETS ENDPOINTS

// Get budgets
app.get('/api/budgets/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const connection = await pool.getConnection();

    const [budgets] = await connection.query(
      'SELECT * FROM budgets WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    ) as any;

    connection.release();
    res.json(budgets);
  } catch (error: any) {
    console.error('Get budgets error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add budget
app.post('/api/budgets', async (req, res) => {
  try {
    const { userId, category, amount, period } = req.body;
    const connection = await pool.getConnection();
    const budgetId = uuidv4();

    await connection.query(
      'INSERT INTO budgets (id, user_id, category, amount, period) VALUES (?, ?, ?, ?, ?)',
      [budgetId, userId, category, amount, period]
    );

    connection.release();
    res.json({ success: true, id: budgetId });
  } catch (error: any) {
    console.error('Add budget error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌐 CORS origins: ${corsOrigins.join(', ')}`);
});
