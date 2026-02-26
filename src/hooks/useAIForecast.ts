import { useState, useEffect, useMemo } from 'react';
import { Transaction } from '../types';
import { aiEngine, AIAnalysisResult } from '../utils/aiForecasting';

export const useAIForecast = (transactions: Transaction[]) => {
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysisTime, setLastAnalysisTime] = useState<Date | null>(null);

  // Memoize transaction hash to detect changes
  const transactionHash = useMemo(() => {
    return transactions
      .map(t => `${t.id}-${t.amount}-${t.date.getTime()}`)
      .sort()
      .join('|');
  }, [transactions]);

  // Real-time analysis trigger
  useEffect(() => {
    const performAnalysis = async () => {
      if (transactions.length === 0) {
        setAnalysis(null);
        return;
      }

      setIsAnalyzing(true);
      
      try {
        // Simulate processing time for better UX
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const result = aiEngine.analyzeTransactions(transactions);
        setAnalysis(result);
        setLastAnalysisTime(new Date());
      } catch (error) {
        console.error('AI Analysis failed:', error);
        setAnalysis(null);
      } finally {
        setIsAnalyzing(false);
      }
    };

    // Debounce analysis to avoid excessive computation
    const timeoutId = setTimeout(performAnalysis, 300);
    
    return () => clearTimeout(timeoutId);
  }, [transactionHash]);

  // Real-time updates every 30 seconds if data exists
  useEffect(() => {
    if (transactions.length === 0) return;

    const interval = setInterval(() => {
      if (!isAnalyzing) {
        const result = aiEngine.analyzeTransactions(transactions);
        setAnalysis(result);
        setLastAnalysisTime(new Date());
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [transactions.length, isAnalyzing]);

  return {
    analysis,
    isAnalyzing,
    lastAnalysisTime,
    hasData: transactions.length > 0
  };
};