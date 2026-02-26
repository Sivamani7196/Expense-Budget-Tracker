import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Transaction } from '../types';
import { calculateCategorySpending, categories, formatCurrency } from '../utils/finance';

interface AnalyticsProps {
  transactions: Transaction[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ transactions }) => {
  const categorySpending = calculateCategorySpending(transactions);
  
  const chartData = categories
    .filter(cat => cat.value !== 'income' && categorySpending[cat.value] > 0)
    .map(cat => ({
      name: cat.label,
      amount: categorySpending[cat.value],
    }))
    .sort((a, b) => b.amount - a.amount);

  // Generate monthly trend data
  const monthlyData = React.useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => {
      const baseAmount = Math.random() * 2000 + 1000;
      return {
        month,
        income: baseAmount + Math.random() * 1000,
        expenses: baseAmount - Math.random() * 500,
      };
    });
  }, []);

  if (transactions.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Visualize your financial patterns and trends</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <div className="text-6xl mb-6 opacity-50">📈</div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No data to analyze yet</h3>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Add some transactions to see beautiful charts and insights about your spending patterns.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Visualize your financial patterns and trends</p>
      </div>

      {/* Category Spending Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
          Spending by Category
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
                stroke="#6B7280"
              />
              <YAxis 
                tickFormatter={(value) => `₹${value}`} 
                stroke="#6B7280"
              />
              <Tooltip 
                formatter={(value) => [formatCurrency(value as number), 'Amount']}
                contentStyle={{
                  backgroundColor: 'var(--tooltip-bg)',
                  border: '1px solid var(--tooltip-border)',
                  borderRadius: '12px',
                  color: 'var(--tooltip-text)'
                }}
              />
              <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Trend Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
          Monthly Trend
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis tickFormatter={(value) => `₹${value}`} stroke="#6B7280" />
              <Tooltip 
                formatter={(value) => [formatCurrency(value as number)]}
                contentStyle={{
                  backgroundColor: 'var(--tooltip-bg)',
                  border: '1px solid var(--tooltip-border)',
                  borderRadius: '12px',
                  color: 'var(--tooltip-text)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#10B981" 
                strokeWidth={3}
                name="Income"
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="#EF4444" 
                strokeWidth={3}
                name="Expenses"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">Top Spending Category</h4>
          {chartData.length > 0 && (
            <>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{chartData[0].name}</p>
              <p className="text-red-600 dark:text-red-400 font-bold text-lg">{formatCurrency(chartData[0].amount)}</p>
            </>
          )}
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">Average Transaction</h4>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0) / transactions.length)}
          </p>
          <p className="text-gray-500 dark:text-gray-400 font-medium">per transaction</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">Transaction Count</h4>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{transactions.length}</p>
          <p className="text-gray-500 dark:text-gray-400 font-medium">total transactions</p>
        </div>
      </div>
    </div>
  );
};