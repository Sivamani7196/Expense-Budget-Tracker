import { useState, useEffect, useMemo } from 'react';
import { Transaction } from '../types';
import { AdvancedAIAnalysis } from '../utils/advancedAI';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
        // Simulate model progress while waiting for backend inference.
        const progressInterval = setInterval(() => {
          setTrainingProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + Math.random() * 15;
          });
        }, 200);

        const payload = transactions.map((tx) => ({
          amount: tx.amount,
          category: tx.category,
          type: tx.type,
          date: tx.date.toISOString(),
        }));

        const response = await fetch(`${API_URL}/ai/advanced-forecast`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ transactions: payload }),
        });

        if (!response.ok) {
          throw new Error('Backend AI forecast request failed');
        }

        const rawResult = await response.json();
        const result: AdvancedAIAnalysis = {
          ...rawResult,
          anomalies: Array.isArray(rawResult?.anomalies)
            ? rawResult.anomalies.map((item: any) => ({
                ...item,
                date: new Date(item.date),
              }))
            : [],
        };
        
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
          const payload = transactions.map((tx) => ({
            amount: tx.amount,
            category: tx.category,
            type: tx.type,
            date: tx.date.toISOString(),
          }));

          const response = await fetch(`${API_URL}/ai/advanced-forecast`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ transactions: payload }),
          });

          if (!response.ok) {
            throw new Error('Backend AI refresh request failed');
          }

          const rawResult = await response.json();
          const result: AdvancedAIAnalysis = {
            ...rawResult,
            anomalies: Array.isArray(rawResult?.anomalies)
              ? rawResult.anomalies.map((item: any) => ({
                  ...item,
                  date: new Date(item.date),
                }))
              : [],
          };

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
    isTraining: isAnalyzing
  };
};