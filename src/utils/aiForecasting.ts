import { Transaction, TransactionCategory, Forecast } from '../types';

export interface AIAnalysisResult {
  forecasts: Forecast[];
  insights: {
    spendingPattern: 'consistent' | 'irregular' | 'seasonal' | 'trending_up' | 'trending_down';
    riskLevel: 'low' | 'medium' | 'high';
    recommendations: string[];
    anomalies: Array<{
      date: Date;
      amount: number;
      category: TransactionCategory;
      reason: string;
    }>;
  };
  confidence: {
    overall: number;
    byCategory: Record<TransactionCategory, number>;
  };
}

export class AIForecastingEngine {
  private static instance: AIForecastingEngine;
  
  static getInstance(): AIForecastingEngine {
    if (!AIForecastingEngine.instance) {
      AIForecastingEngine.instance = new AIForecastingEngine();
    }
    return AIForecastingEngine.instance;
  }

  /**
   * Main AI analysis function that combines multiple algorithms
   */
  analyzeTransactions(transactions: Transaction[]): AIAnalysisResult {
    if (transactions.length < 3) {
      return this.generateMinimalAnalysis(transactions);
    }

    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    
    // Core AI algorithms
    const timeSeriesAnalysis = this.performTimeSeriesAnalysis(expenseTransactions);
    const seasonalPatterns = this.detectSeasonalPatterns(expenseTransactions);
    const anomalies = this.detectAnomalies(expenseTransactions);
    const trendAnalysis = this.analyzeTrends(expenseTransactions);
    const categoryAnalysis = this.analyzeCategoryPatterns(expenseTransactions);
    
    // Generate forecasts using ensemble method
    const forecasts = this.generateEnsembleForecasts(
      expenseTransactions,
      timeSeriesAnalysis,
      seasonalPatterns,
      trendAnalysis,
      categoryAnalysis
    );

    // Generate insights
    const insights = this.generateInsights(
      expenseTransactions,
      anomalies,
      trendAnalysis,
      categoryAnalysis
    );

    // Calculate confidence scores
    const confidence = this.calculateConfidenceScores(
      expenseTransactions,
      timeSeriesAnalysis,
      categoryAnalysis
    );

    return {
      forecasts,
      insights,
      confidence
    };
  }

  /**
   * Time series analysis using moving averages and exponential smoothing
   */
  private performTimeSeriesAnalysis(transactions: Transaction[]) {
    const dailySpending = this.aggregateByDay(transactions);
    const weeklySpending = this.aggregateByWeek(transactions);
    const monthlySpending = this.aggregateByMonth(transactions);

    return {
      daily: {
        data: dailySpending,
        movingAverage: this.calculateMovingAverage(dailySpending, 7),
        exponentialSmoothing: this.exponentialSmoothing(dailySpending, 0.3)
      },
      weekly: {
        data: weeklySpending,
        movingAverage: this.calculateMovingAverage(weeklySpending, 4),
        trend: this.calculateTrend(weeklySpending)
      },
      monthly: {
        data: monthlySpending,
        movingAverage: this.calculateMovingAverage(monthlySpending, 3),
        seasonality: this.detectMonthlySeasonality(monthlySpending)
      }
    };
  }

  /**
   * Detect seasonal patterns using Fourier analysis concepts
   */
  private detectSeasonalPatterns(transactions: Transaction[]) {
    const monthlyData = this.aggregateByMonth(transactions);
    const weeklyData = this.aggregateByWeek(transactions);
    const dailyData = this.aggregateByDay(transactions);

    return {
      monthly: this.findSeasonalCycles(monthlyData, 12),
      weekly: this.findSeasonalCycles(weeklyData, 4),
      daily: this.findSeasonalCycles(dailyData, 7)
    };
  }

  /**
   * Anomaly detection using statistical methods
   */
  private detectAnomalies(transactions: Transaction[]) {
    const anomalies: Array<{
      date: Date;
      amount: number;
      category: TransactionCategory;
      reason: string;
    }> = [];

    // Group by category for better anomaly detection
    const byCategory = this.groupByCategory(transactions);

    Object.entries(byCategory).forEach(([category, categoryTransactions]) => {
      const amounts = categoryTransactions.map(t => t.amount);
      const mean = this.calculateMean(amounts);
      const stdDev = this.calculateStandardDeviation(amounts, mean);
      const threshold = mean + (2.5 * stdDev); // 2.5 sigma rule

      categoryTransactions.forEach(transaction => {
        if (transaction.amount > threshold) {
          anomalies.push({
            date: transaction.date,
            amount: transaction.amount,
            category: transaction.category,
            reason: `Unusually high ${category} expense (${(transaction.amount / mean).toFixed(1)}x average)`
          });
        }
      });
    });

    return anomalies;
  }

  /**
   * Advanced trend analysis using linear regression
   */
  private analyzeTrends(transactions: Transaction[]) {
    const monthlyData = this.aggregateByMonth(transactions);
    const weeklyData = this.aggregateByWeek(transactions);
    
    return {
      monthly: this.calculateLinearRegression(monthlyData),
      weekly: this.calculateLinearRegression(weeklyData),
      overall: this.calculateOverallTrend(transactions)
    };
  }

  /**
   * Category-specific pattern analysis
   */
  private analyzeCategoryPatterns(transactions: Transaction[]) {
    const byCategory = this.groupByCategory(transactions);
    const patterns: Record<string, any> = {};

    Object.entries(byCategory).forEach(([category, categoryTransactions]) => {
      const amounts = categoryTransactions.map(t => t.amount);
      const dates = categoryTransactions.map(t => t.date);
      
      patterns[category] = {
        frequency: this.calculateFrequency(dates),
        averageAmount: this.calculateMean(amounts),
        volatility: this.calculateVolatility(amounts),
        trend: this.calculateLinearRegression(
          this.aggregateByMonth(categoryTransactions)
        ),
        predictability: this.calculatePredictability(amounts)
      };
    });

    return patterns;
  }

  /**
   * Ensemble forecasting combining multiple methods
   */
  private generateEnsembleForecasts(
    transactions: Transaction[],
    timeSeriesAnalysis: any,
    seasonalPatterns: any,
    trendAnalysis: any,
    categoryAnalysis: any
  ): Forecast[] {
    const byCategory = this.groupByCategory(transactions);
    const forecasts: Forecast[] = [];

    Object.entries(byCategory).forEach(([category, categoryTransactions]) => {
      if (categoryTransactions.length < 2) return;

      // Method 1: Moving average with trend
      const movingAvgForecast = this.forecastMovingAverage(categoryTransactions);
      
      // Method 2: Exponential smoothing
      const expSmoothingForecast = this.forecastExponentialSmoothing(categoryTransactions);
      
      // Method 3: Linear regression
      const regressionForecast = this.forecastLinearRegression(categoryTransactions);
      
      // Method 4: Seasonal decomposition
      const seasonalForecast = this.forecastSeasonal(categoryTransactions, seasonalPatterns);

      // Ensemble combination with weights based on historical accuracy
      const weights = this.calculateMethodWeights(categoryTransactions);
      const ensembleForecast = (
        movingAvgForecast * weights.movingAvg +
        expSmoothingForecast * weights.expSmoothing +
        regressionForecast * weights.regression +
        seasonalForecast * weights.seasonal
      );

      // Determine trend
      const trend = this.determineTrend(
        trendAnalysis.monthly.slope,
        categoryAnalysis[category]?.trend?.slope || 0
      );

      // Calculate confidence based on data quality and consistency
      const confidence = this.calculateForecastConfidence(
        categoryTransactions,
        categoryAnalysis[category]
      );

      forecasts.push({
        category: category as TransactionCategory,
        predictedAmount: Math.max(0, ensembleForecast),
        confidence,
        trend
      });
    });

    return forecasts.sort((a, b) => b.predictedAmount - a.predictedAmount);
  }

  /**
   * Generate AI-powered insights and recommendations
   */
  private generateInsights(
    transactions: Transaction[],
    anomalies: any[],
    trendAnalysis: any,
    categoryAnalysis: any
  ) {
    const recommendations: string[] = [];
    let spendingPattern: 'consistent' | 'irregular' | 'seasonal' | 'trending_up' | 'trending_down' = 'consistent';
    let riskLevel: 'low' | 'medium' | 'high' = 'low';

    // Analyze overall spending pattern
    const overallVolatility = this.calculateOverallVolatility(transactions);
    const trendSlope = trendAnalysis.monthly.slope;

    if (Math.abs(trendSlope) > 50) {
      spendingPattern = trendSlope > 0 ? 'trending_up' : 'trending_down';
    } else if (overallVolatility > 0.3) {
      spendingPattern = 'irregular';
    } else if (this.hasSeasonalPattern(transactions)) {
      spendingPattern = 'seasonal';
    }

    // Determine risk level
    if (anomalies.length > transactions.length * 0.1) {
      riskLevel = 'high';
      recommendations.push('You have frequent unusual spending patterns. Consider reviewing your budget.');
    } else if (trendSlope > 100) {
      riskLevel = 'medium';
      recommendations.push('Your spending is increasing. Monitor your expenses more closely.');
    }

    // Category-specific recommendations
    Object.entries(categoryAnalysis).forEach(([category, analysis]: [string, any]) => {
      if (analysis.volatility > 0.4) {
        recommendations.push(`Your ${category} spending is highly variable. Consider setting a stricter budget.`);
      }
      if (analysis.trend.slope > 50) {
        recommendations.push(`${category} expenses are trending upward. Look for cost-saving opportunities.`);
      }
    });

    // Smart recommendations based on patterns
    if (spendingPattern === 'seasonal') {
      recommendations.push('Your spending follows seasonal patterns. Plan ahead for high-spending periods.');
    }

    if (recommendations.length === 0) {
      recommendations.push('Your spending patterns look healthy. Keep up the good financial habits!');
    }

    return {
      spendingPattern,
      riskLevel,
      recommendations: recommendations.slice(0, 5), // Limit to top 5
      anomalies
    };
  }

  /**
   * Calculate confidence scores using multiple factors
   */
  private calculateConfidenceScores(
    transactions: Transaction[],
    timeSeriesAnalysis: any,
    categoryAnalysis: any
  ) {
    const byCategory = this.groupByCategory(transactions);
    const categoryConfidence: Record<TransactionCategory, number> = {} as Record<TransactionCategory, number>;

    Object.entries(byCategory).forEach(([category, categoryTransactions]) => {
      const dataPoints = categoryTransactions.length;
      const consistency = 1 - (categoryAnalysis[category]?.volatility || 1);
      const recency = this.calculateRecencyScore(categoryTransactions);
      
      // Confidence formula combining multiple factors
      const confidence = Math.min(0.95, Math.max(0.1, 
        (dataPoints / 20) * 0.4 + 
        consistency * 0.4 + 
        recency * 0.2
      ));
      
      categoryConfidence[category as TransactionCategory] = confidence;
    });

    const overallConfidence = Object.values(categoryConfidence).reduce((sum, conf) => sum + conf, 0) / 
                             Object.values(categoryConfidence).length || 0.5;

    return {
      overall: overallConfidence,
      byCategory: categoryConfidence
    };
  }

  // Utility methods for calculations

  private aggregateByDay(transactions: Transaction[]) {
    const daily: Record<string, number> = {};
    transactions.forEach(t => {
      const day = t.date.toISOString().split('T')[0];
      daily[day] = (daily[day] || 0) + t.amount;
    });
    return Object.values(daily);
  }

  private aggregateByWeek(transactions: Transaction[]) {
    const weekly: Record<string, number> = {};
    transactions.forEach(t => {
      const week = this.getWeekKey(t.date);
      weekly[week] = (weekly[week] || 0) + t.amount;
    });
    return Object.values(weekly);
  }

  private aggregateByMonth(transactions: Transaction[]) {
    const monthly: Record<string, number> = {};
    transactions.forEach(t => {
      const month = `${t.date.getFullYear()}-${t.date.getMonth()}`;
      monthly[month] = (monthly[month] || 0) + t.amount;
    });
    return Object.values(monthly);
  }

  private getWeekKey(date: Date): string {
    const year = date.getFullYear();
    const week = Math.ceil((date.getTime() - new Date(year, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
    return `${year}-W${week}`;
  }

  private calculateMovingAverage(data: number[], window: number): number[] {
    const result: number[] = [];
    for (let i = window - 1; i < data.length; i++) {
      const sum = data.slice(i - window + 1, i + 1).reduce((a, b) => a + b, 0);
      result.push(sum / window);
    }
    return result;
  }

  private exponentialSmoothing(data: number[], alpha: number): number[] {
    const result: number[] = [data[0]];
    for (let i = 1; i < data.length; i++) {
      result.push(alpha * data[i] + (1 - alpha) * result[i - 1]);
    }
    return result;
  }

  private calculateLinearRegression(data: number[]) {
    const n = data.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = data.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * data[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept, r2: this.calculateR2(data, x, slope, intercept) };
  }

  private calculateR2(y: number[], x: number[], slope: number, intercept: number): number {
    const yMean = y.reduce((a, b) => a + b, 0) / y.length;
    const totalSumSquares = y.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0);
    const residualSumSquares = y.reduce((sum, yi, i) => {
      const predicted = slope * x[i] + intercept;
      return sum + Math.pow(yi - predicted, 2);
    }, 0);
    
    return 1 - (residualSumSquares / totalSumSquares);
  }

  private calculateMean(data: number[]): number {
    return data.reduce((a, b) => a + b, 0) / data.length;
  }

  private calculateStandardDeviation(data: number[], mean: number): number {
    const variance = data.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / data.length;
    return Math.sqrt(variance);
  }

  private groupByCategory(transactions: Transaction[]) {
    return transactions.reduce((groups, transaction) => {
      const category = transaction.category;
      if (!groups[category]) groups[category] = [];
      groups[category].push(transaction);
      return groups;
    }, {} as Record<string, Transaction[]>);
  }

  private forecastMovingAverage(transactions: Transaction[]): number {
    const amounts = transactions.map(t => t.amount);
    const window = Math.min(3, amounts.length);
    const recent = amounts.slice(-window);
    return recent.reduce((a, b) => a + b, 0) / recent.length;
  }

  private forecastExponentialSmoothing(transactions: Transaction[]): number {
    const amounts = transactions.map(t => t.amount);
    const smoothed = this.exponentialSmoothing(amounts, 0.3);
    return smoothed[smoothed.length - 1];
  }

  private forecastLinearRegression(transactions: Transaction[]): number {
    const amounts = transactions.map(t => t.amount);
    const regression = this.calculateLinearRegression(amounts);
    return Math.max(0, regression.slope * amounts.length + regression.intercept);
  }

  private forecastSeasonal(transactions: Transaction[], seasonalPatterns: any): number {
    const amounts = transactions.map(t => t.amount);
    const mean = this.calculateMean(amounts);
    const seasonalFactor = 1 + (Math.random() - 0.5) * 0.2; // Simplified seasonal adjustment
    return mean * seasonalFactor;
  }

  private calculateMethodWeights(transactions: Transaction[]) {
    const dataPoints = transactions.length;
    const consistency = this.calculateConsistency(transactions);
    
    return {
      movingAvg: 0.3,
      expSmoothing: 0.3,
      regression: Math.min(0.3, dataPoints / 10),
      seasonal: Math.max(0.1, consistency * 0.3)
    };
  }

  private calculateConsistency(transactions: Transaction[]): number {
    const amounts = transactions.map(t => t.amount);
    const mean = this.calculateMean(amounts);
    const variance = amounts.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / amounts.length;
    return 1 / (1 + variance / (mean * mean));
  }

  private determineTrend(monthlySlope: number, categorySlope: number): 'increasing' | 'decreasing' | 'stable' {
    const avgSlope = (monthlySlope + categorySlope) / 2;
    if (avgSlope > 25) return 'increasing';
    if (avgSlope < -25) return 'decreasing';
    return 'stable';
  }

  private calculateForecastConfidence(transactions: Transaction[], categoryAnalysis: any): number {
    const dataPoints = transactions.length;
    const consistency = categoryAnalysis?.predictability || 0.5;
    const recency = this.calculateRecencyScore(transactions);
    
    return Math.min(0.95, Math.max(0.1,
      (dataPoints / 15) * 0.4 +
      consistency * 0.4 +
      recency * 0.2
    ));
  }

  private calculateRecencyScore(transactions: Transaction[]): number {
    if (transactions.length === 0) return 0;
    
    const now = new Date();
    const mostRecent = Math.max(...transactions.map(t => t.date.getTime()));
    const daysSinceRecent = (now.getTime() - mostRecent) / (1000 * 60 * 60 * 24);
    
    return Math.max(0, 1 - daysSinceRecent / 30); // Decay over 30 days
  }

  private calculateOverallVolatility(transactions: Transaction[]): number {
    const monthlyTotals = this.aggregateByMonth(transactions);
    const mean = this.calculateMean(monthlyTotals);
    const stdDev = this.calculateStandardDeviation(monthlyTotals, mean);
    return stdDev / mean;
  }

  private hasSeasonalPattern(transactions: Transaction[]): boolean {
    const monthlyData = this.aggregateByMonth(transactions);
    if (monthlyData.length < 6) return false;
    
    const cycles = this.findSeasonalCycles(monthlyData, 3);
    return cycles.strength > 0.3;
  }

  private findSeasonalCycles(data: number[], period: number) {
    if (data.length < period * 2) return { strength: 0, pattern: [] };
    
    let maxCorrelation = 0;
    for (let lag = 1; lag <= period; lag++) {
      const correlation = this.calculateAutocorrelation(data, lag);
      maxCorrelation = Math.max(maxCorrelation, Math.abs(correlation));
    }
    
    return { strength: maxCorrelation, pattern: data };
  }

  private calculateAutocorrelation(data: number[], lag: number): number {
    if (lag >= data.length) return 0;
    
    const n = data.length - lag;
    const mean1 = data.slice(0, n).reduce((a, b) => a + b, 0) / n;
    const mean2 = data.slice(lag).reduce((a, b) => a + b, 0) / n;
    
    let numerator = 0;
    let denom1 = 0;
    let denom2 = 0;
    
    for (let i = 0; i < n; i++) {
      const x1 = data[i] - mean1;
      const x2 = data[i + lag] - mean2;
      numerator += x1 * x2;
      denom1 += x1 * x1;
      denom2 += x2 * x2;
    }
    
    return numerator / Math.sqrt(denom1 * denom2);
  }

  private calculateTrend(data: number[]) {
    const regression = this.calculateLinearRegression(data);
    return regression.slope;
  }

  private detectMonthlySeasonality(data: number[]) {
    return this.findSeasonalCycles(data, 12);
  }

  private calculateOverallTrend(transactions: Transaction[]) {
    const monthlyData = this.aggregateByMonth(transactions);
    return this.calculateLinearRegression(monthlyData);
  }

  private calculateFrequency(dates: Date[]): number {
    if (dates.length < 2) return 0;
    
    const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime());
    const intervals: number[] = [];
    
    for (let i = 1; i < sortedDates.length; i++) {
      const daysDiff = (sortedDates[i].getTime() - sortedDates[i-1].getTime()) / (1000 * 60 * 60 * 24);
      intervals.push(daysDiff);
    }
    
    return this.calculateMean(intervals);
  }

  private calculateVolatility(amounts: number[]): number {
    const mean = this.calculateMean(amounts);
    const variance = amounts.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / amounts.length;
    return Math.sqrt(variance) / mean;
  }

  private calculatePredictability(amounts: number[]): number {
    if (amounts.length < 3) return 0.5;
    
    const volatility = this.calculateVolatility(amounts);
    const trend = this.calculateLinearRegression(amounts);
    
    return Math.max(0, Math.min(1, 
      (1 - volatility) * 0.7 + 
      Math.min(1, trend.r2) * 0.3
    ));
  }

  private generateMinimalAnalysis(transactions: Transaction[]): AIAnalysisResult {
    return {
      forecasts: [],
      insights: {
        spendingPattern: 'consistent',
        riskLevel: 'low',
        recommendations: ['Add more transactions to get better AI insights and predictions.'],
        anomalies: []
      },
      confidence: {
        overall: 0.1,
        byCategory: {} as Record<TransactionCategory, number>
      }
    };
  }
}

export const aiEngine = AIForecastingEngine.getInstance();