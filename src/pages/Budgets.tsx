import React from 'react';
import { BudgetForm } from '../components/budgets/BudgetForm';
import { BudgetList } from '../components/budgets/BudgetList';
import { Budget, Transaction, TransactionCategory } from '../types';

interface BudgetsProps {
  budgets: Budget[];
  transactions: Transaction[];
  onAdd: (budget: {
    category: TransactionCategory;
    amount: number;
    period: 'monthly' | 'yearly';
  }) => void;
}

export const Budgets: React.FC<BudgetsProps> = ({ budgets, transactions, onAdd }) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Budgets</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Set spending limits and track your progress</p>
        </div>
        <BudgetForm onAdd={onAdd} />
      </div>

      <BudgetList budgets={budgets} transactions={transactions} />

      {budgets.length === 0 && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-8 text-center shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="text-6xl mb-6">🎯</div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Take control of your spending</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-8 text-lg">
            Create budgets for different categories to stay on track with your financial goals.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="text-3xl mb-4">📝</div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Set Limits</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Define spending limits for each category</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="text-3xl mb-4">📊</div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Track Progress</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Monitor your spending against budgets</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="text-3xl mb-4">⚠️</div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Get Alerts</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Receive warnings when approaching limits</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};