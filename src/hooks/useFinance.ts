import { useState, useEffect } from 'react';
import { Transaction, Budget, FinanceData } from '../types';
import { calculateTotalByType } from '../utils/finance';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useFinance = (userId: string | undefined) => {
  const [financeData, setFinanceData] = useState<FinanceData>({
    transactions: [],
    budgets: [],
    totalIncome: 0,
    totalExpenses: 0,
    savings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    loadData();
  }, [userId]);

  const loadData = async () => {
    if (!userId) return;

    try {
      setLoading(true);

      // Fetch transactions
      const transRes = await fetch(`${API_URL}/transactions/${userId}`);
      const transactionsData = transRes.ok ? await transRes.json() : [];

      // Fetch budgets
      const budRes = await fetch(`${API_URL}/budgets/${userId}`);
      const budgetsData = budRes.ok ? await budRes.json() : [];

      // Transform data to match our types
      const transactions: Transaction[] = (transactionsData || []).map((t: any) => ({
        id: t.id,
        userId: t.user_id,
        amount: Number(t.amount),
        description: t.description,
        category: t.category as any,
        type: t.type,
        date: new Date(t.date),
        createdAt: new Date(t.created_at),
      }));

      const budgets: Budget[] = (budgetsData || []).map((b: any) => ({
        id: b.id,
        userId: b.user_id,
        category: b.category as any,
        amount: Number(b.amount),
        period: b.period,
        createdAt: new Date(b.created_at),
      }));

      const totalIncome = calculateTotalByType(transactions, 'income');
      const totalExpenses = calculateTotalByType(transactions, 'expense');
      const savings = totalIncome - totalExpenses;

      setFinanceData({
        transactions,
        budgets,
        totalIncome,
        totalExpenses,
        savings,
      });
    } catch (error) {
      console.error('Error loading finance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => {
    if (!userId) return;

    try {
      const response = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          amount: transaction.amount,
          description: transaction.description,
          category: transaction.category,
          type: transaction.type,
          date: transaction.date.toISOString().split('T')[0],
        }),
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const addBudget = async (budget: Omit<Budget, 'id' | 'userId' | 'createdAt'>) => {
    if (!userId) return;

    try {
      const response = await fetch(`${API_URL}/budgets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          category: budget.category,
          amount: budget.amount,
          period: budget.period,
        }),
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error('Error adding budget:', error);
    }
  };

  const deleteTransaction = async (transactionId: string) => {
    try {
      const response = await fetch(`${API_URL}/transactions/${transactionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  return {
    ...financeData,
    loading,
    addTransaction,
    addBudget,
    deleteTransaction,
  };
};