import React from 'react';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { Transaction, TransactionCategory } from '../types';
import { formatCurrency, categories } from '../utils/finance';
import { Trash2, Filter } from 'lucide-react';

interface TransactionsProps {
  transactions: Transaction[];
  onAdd: (transaction: {
    amount: number;
    description: string;
    category: TransactionCategory;
    type: 'income' | 'expense';
    date: Date;
  }) => void;
  onDelete: (id: string) => void;
}

export const Transactions: React.FC<TransactionsProps> = ({ transactions, onAdd, onDelete }) => {
  const sortedTransactions = transactions.sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Transactions</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Track and manage your income and expenses</p>
        </div>
        <TransactionForm onAdd={onAdd} />
      </div>

      {sortedTransactions.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <div className="text-6xl mb-6 opacity-50">📊</div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No transactions yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">Start tracking your financial activity by adding your first transaction.</p>
          <TransactionForm onAdd={onAdd} />
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">All Transactions</h3>
              <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 border border-gray-200 dark:border-gray-600">
                <Filter className="h-4 w-4" />
                <span className="font-medium">Filter</span>
              </button>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedTransactions.map((transaction) => {
              const category = categories.find(c => c.value === transaction.category);
              return (
                <div key={transaction.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{category?.icon}</div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-lg">{transaction.description}</h4>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{category?.label}</span>
                          <span className="text-sm text-gray-400 dark:text-gray-500">•</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                            {transaction.date.toLocaleDateString()}
                          </span>
                          <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                            transaction.type === 'income' 
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                              : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                          }`}>
                            {transaction.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className={`text-xl font-bold ${
                          transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </p>
                      </div>
                      <button
                        onClick={() => onDelete(transaction.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};