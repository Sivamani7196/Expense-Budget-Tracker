import React from 'react';
import { Budget, Transaction } from '../../types';
import { formatCurrency, categories, calculateBudgetUsage } from '../../utils/finance';

interface BudgetListProps {
  budgets: Budget[];
  transactions: Transaction[];
}

export const BudgetList: React.FC<BudgetListProps> = ({ budgets, transactions }) => {
  const budgetUsage = calculateBudgetUsage(budgets, transactions);

  if (budgets.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
          Your Budgets
        </h3>
        <div className="text-center py-12">
          <div className="text-6xl mb-4 opacity-50">🎯</div>
          <p className="text-gray-500 dark:text-gray-400">No budgets set yet. Create your first budget to start tracking your spending!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
        Your Budgets
      </h3>
      <div className="space-y-4">
        {budgets.map((budget) => {
          const category = categories.find(c => c.value === budget.category);
          const usage = budgetUsage[budget.id];
          const progressPercentage = Math.min(usage?.percentage || 0, 100);
          const isOverBudget = (usage?.percentage || 0) > 100;

          return (
            <div key={budget.id} className="border border-gray-200 dark:border-gray-600 rounded-xl p-5 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{category?.icon}</div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">{category?.label}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize font-medium">{budget.period} budget</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white text-lg">
                    {formatCurrency(usage?.used || 0)} / {formatCurrency(budget.amount)}
                  </p>
                  <p className={`text-sm font-semibold ${isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    {(usage?.percentage || 0).toFixed(1)}% used
                  </p>
                </div>
              </div>

              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 shadow-inner">
                <div
                  className={`h-3 rounded-full transition-all duration-500 shadow-sm ${
                    isOverBudget ? 'bg-gradient-to-r from-red-500 to-red-600' : 
                    progressPercentage > 75 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 
                    'bg-gradient-to-r from-green-500 to-emerald-500'
                  }`}
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>

              {isOverBudget && (
                <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-700 dark:text-red-400 font-semibold">
                    ⚠️ Over budget by {formatCurrency((usage?.used || 0) - budget.amount)}
                  </p>
                </div>
              )}

              {!isOverBudget && progressPercentage > 75 && (
                <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-700 dark:text-yellow-400 font-semibold">
                    ⚡ Approaching budget limit
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};