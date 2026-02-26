import { useState, useEffect, useMemo } from 'react';
import { Transaction } from '../types';
import { advancedAI, AdvancedAIAnalysis } from '../utils/advancedAI';

export const useAdvancedAI = (transactions: Transaction[]) => {
  const [analysis, setAnalysis] = useState<AdvancedAIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysisTime, setLastAnalysisTime] = useState<Date | null>(null);
  const [trainingProgress, setTrainingProgress] = useState(0);

  // Memoize transaction hash to detect changes
  const transactionHash = useMemo(() => {
    return transactions
      .map(t => `${t.id}-${t.amount}-${t.date.getTime()}`)
      .sort()
      .join('|');
  }, [transactions]);

  // Advanced AI analysis with progress tracking
  useEffect(() => {
    const performAdvancedAnalysis = async () => {
      if (transactions.length === 0) {
        setAnalysis(null);
        return;
      }

      setIsAnalyzing(true);
      setTrainingProgress(0);
      
      try {
        // Simulate training progress
        const progressInterval = setInterval(() => {
          setTrainingProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + Math.random() * 15;
          });
        }, 200);

        // Perform actual AI analysis
        const result = await advancedAI.analyzeTransactions(transactions);
        
        clearInterval(progressInterval);
        setTrainingProgress(100);
        
        // Small delay to show completion
        setTimeout(() => {
          setAnalysis(result);
          setLastAnalysisTime(new Date());
          setTrainingProgress(0);
        }, 500);
        
      } catch (error) {
        console.error('Advanced AI Analysis failed:', error);
        setAnalysis(null);
        setTrainingProgress(0);
      } finally {
        setIsAnalyzing(false);
      }
    };

    // Debounce analysis to avoid excessive computation
    const timeoutId = setTimeout(performAdvancedAnalysis, 500);
    
    return () => clearTimeout(timeoutId);
  }, [transactionHash]);

  // Real-time model updates every 60 seconds
  useEffect(() => {
    if (transactions.length === 0) return;

    const interval = setInterval(async () => {
      if (!isAnalyzing && analysis) {
        try {
          const result = await advancedAI.analyzeTransactions(transactions);
          setAnalysis(result);
          setLastAnalysisTime(new Date());
        } catch (error) {
          console.warn('Background AI update failed:', error);
        }
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [transactions.length, isAnalyzing, analysis]);

  return {
    analysis,
    isAnalyzing,
    lastAnalysisTime,
    trainingProgress,
    hasData: transactions.length > 0,
    modelAccuracy: analysis?.modelAccuracy || 0,
    isTraining: advancedAI.isCurrentlyTraining()
  };
};