import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { StatsCard } from '../components/dashboard/StatsCard';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { ExpenseChart } from '../components/charts/ExpenseChart';
import { FinanceData } from '../types';
import { formatCurrency } from '../utils/finance';

interface DashboardProps {
  financeData: FinanceData;
  onDeleteTransaction: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ financeData, onDeleteTransaction }) => {
  const { transactions, totalIncome, totalExpenses, savings } = financeData;

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Income"
          value={formatCurrency(totalIncome)}
          icon={TrendingUp}
          trend={{ value: '+12.3% from last month', isPositive: true }}
          color="green"
        />
        <StatsCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          icon={TrendingDown}
          trend={{ value: '-5.2% from last month', isPositive: true }}
          color="red"
        />
        <StatsCard
          title="Net Savings"
          value={formatCurrency(savings)}
          icon={PiggyBank}
          trend={{ value: savings >= 0 ? 'On track' : 'Need attention', isPositive: savings >= 0 }}
          color={savings >= 0 ? 'green' : 'red'}
        />
        <StatsCard
          title="Transactions"
          value={transactions.length.toString()}
          icon={DollarSign}
          color="blue"
        />
      </div>

      {/* Charts and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ExpenseChart transactions={transactions} />
        <RecentTransactions transactions={transactions} onDelete={onDeleteTransaction} />
      </div>

      {/* Welcome Message */}
      {transactions.length === 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 text-center shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Welcome to FinanceIQ!</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-8 text-lg">
            Start your financial journey by adding your first transaction or setting up budgets.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-3"></div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Track Spending</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Add transactions to monitor your financial activity</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-3"></div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Set Budgets</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Create budgets for better financial control</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="w-3 h-3 bg-purple-500 rounded-full mx-auto mb-3"></div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">AI Insights</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Get intelligent spending predictions</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};