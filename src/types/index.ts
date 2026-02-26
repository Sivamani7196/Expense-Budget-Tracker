export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  description: string;
  category: TransactionCategory;
  type: 'income' | 'expense';
  date: Date;
  createdAt: Date;
}

export interface Budget {
  id: string;
  userId: string;
  category: TransactionCategory;
  amount: number;
  period: 'monthly' | 'yearly';
  createdAt: Date;
}

export interface Forecast {
  category: TransactionCategory;
  predictedAmount: number;
  confidence: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export type TransactionCategory = 
  | 'food'
  | 'transportation'
  | 'entertainment'
  | 'shopping'
  | 'bills'
  | 'healthcare'
  | 'education'
  | 'travel'
  | 'income'
  | 'other';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface FinanceData {
  transactions: Transaction[];
  budgets: Budget[];
  totalIncome: number;
  totalExpenses: number;
  savings: number;
}