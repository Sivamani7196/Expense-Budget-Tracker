import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Transaction } from '../../types';
import { calculateCategorySpending, categories, formatCurrency } from '../../utils/finance';

interface ExpenseChartProps {
  transactions: Transaction[];
}

const COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green  
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#F97316', // Orange
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#EC4899', // Pink
  '#6B7280', // Gray
];

export const ExpenseChart: React.FC<ExpenseChartProps> = ({ transactions }) => {
  const categorySpending = calculateCategorySpending(transactions);
  
  const chartData = categories
    .filter(cat => cat.value !== 'income' && categorySpending[cat.value] > 0)
    .map((cat, index) => ({
      name: cat.label,
      value: categorySpending[cat.value],
      color: COLORS[index % COLORS.length],
      icon: cat.icon,
    }))
    .sort((a, b) => b.value - a.value);

  if (chartData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
          Spending by Category
        </h3>
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <div className="text-6xl mb-4 opacity-50">📊</div>
            <p>No expense data to display</p>
          </div>
        </div>
      </div>
    );
  }

  const totalSpending = chartData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / totalSpending) * 100).toFixed(1);
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border rounded-xl shadow-xl border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">{data.payload.icon}</span>
            <p className="font-semibold text-gray-900 dark:text-white">{data.name}</p>
          </div>
          <p className="text-blue-600 dark:text-blue-400 font-medium">{formatCurrency(data.value)}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // Don't show labels for slices less than 5%
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="600"
        style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
        Spending by Category
      </h3>
      
      <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-6">
        {/* Donut Chart */}
        <div className="relative h-80 w-80 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={CustomLabel}
                outerRadius={120}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                stroke="white"
                strokeWidth={3}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center Content */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center bg-white dark:bg-gray-800 rounded-full p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalSpending)}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Spent</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 min-w-0">
          <div className="space-y-3">
            {chartData.map((item, index) => {
              const percentage = ((item.value / totalSpending) * 100).toFixed(1);
              return (
                <div key={index} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-100 dark:border-gray-600">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                    <span className="font-semibold text-gray-900 dark:text-white truncate">{item.name}</span>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="font-bold text-gray-900 dark:text-white">{formatCurrency(item.value)}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{percentage}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};