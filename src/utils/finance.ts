import { Transaction, Budget, Forecast, TransactionCategory } from '../types';

export const categories: { value: TransactionCategory; label: string; icon: string }[] = [
  { value: 'food', label: 'Food & Dining', icon: '🍽️' },
  { value: 'transportation', label: 'Transportation', icon: '🚗' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎬' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️' },
  { value: 'bills', label: 'Bills & Utilities', icon: '💡' },
  { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
  { value: 'education', label: 'Education', icon: '📚' },
  { value: 'travel', label: 'Travel', icon: '✈️' },
  { value: 'income', label: 'Income', icon: '💰' },
  { value: 'other', label: 'Other', icon: '📦' },
];

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

export const calculateTotalByType = (transactions: Transaction[], type: 'income' | 'expense'): number => {
  return transactions
    .filter(t => t.type === type)
    .reduce((sum, t) => sum + t.amount, 0);
};

export const calculateCategorySpending = (transactions: Transaction[]): Record<TransactionCategory, number> => {
  const spending: Record<TransactionCategory, number> = {} as Record<TransactionCategory, number>;
  
  categories.forEach(cat => {
    spending[cat.value] = transactions
      .filter(t => t.category === cat.value && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  });
  
  return spending;
};

// Legacy function - kept for backward compatibility
// Real AI forecasting is now handled by aiForecasting.ts
export const generateForecasts = (transactions: Transaction[]): Forecast[] => {
  console.warn('Using legacy forecast generation. Consider using AI-powered forecasting instead.');
  
  const categorySpending = calculateCategorySpending(transactions);
  const recentTransactions = transactions.filter(t => {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return t.date >= threeMonthsAgo;
  });

  return categories
    .filter(cat => cat.value !== 'income')
    .map(cat => {
      const categoryTransactions = recentTransactions.filter(t => t.category === cat.value && t.type === 'expense');
      const currentSpending = categorySpending[cat.value];
      
      // Simple trend analysis
      const monthlyAverage = currentSpending / 3;
      const randomVariation = (Math.random() - 0.5) * 0.2; // ±10% variation
      const predictedAmount = monthlyAverage * (1 + randomVariation);
      
      const trend: 'increasing' | 'decreasing' | 'stable' = 
        randomVariation > 0.05 ? 'increasing' : 
        randomVariation < -0.05 ? 'decreasing' : 'stable';
      
      return {
        category: cat.value,
        predictedAmount,
        confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
        trend,
      };
    });
};

export const calculateBudgetUsage = (budgets: Budget[], transactions: Transaction[]): Record<string, { used: number; percentage: number }> => {
  const usage: Record<string, { used: number; percentage: number }> = {};
  
  budgets.forEach(budget => {
    const categorySpending = transactions
      .filter(t => t.category === budget.category && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    usage[budget.id] = {
      used: categorySpending,
      percentage: (categorySpending / budget.amount) * 100,
    };
  });
  
  return usage;
};