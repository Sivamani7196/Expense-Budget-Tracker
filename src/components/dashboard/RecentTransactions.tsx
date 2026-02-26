import React from 'react';
import { Transaction } from '../../types';
import { formatCurrency, categories } from '../../utils/finance';
import { Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface RecentTransactionsProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions, onDelete }) => {
  const recentTransactions = transactions
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  if (recentTransactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
          Recent Transactions
        </h3>
        <div className="text-center py-12">
          <div className="text-6xl mb-4 opacity-50">📊</div>
          <p className="text-gray-500 dark:text-gray-400">No transactions yet. Add your first transaction to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
        Recent Transactions
      </h3>
      <div className="space-y-3">
        {recentTransactions.map((transaction) => {
          const category = categories.find(c => c.value === transaction.category);
          return (
            <div key={transaction.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 group border border-gray-100 dark:border-gray-600">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="text-2xl">{category?.icon}</div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${
                    transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {transaction.type === 'income' ? 
                      <ArrowUpRight className="w-2.5 h-2.5 text-white" /> : 
                      <ArrowDownRight className="w-2.5 h-2.5 text-white" />
                    }
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{transaction.description}</p>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{category?.label}</span>
                    <span className="text-sm text-gray-400 dark:text-gray-500">•</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {transaction.date.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className={`text-lg font-bold ${transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                </div>
                <button
                  onClick={() => onDelete(transaction.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};