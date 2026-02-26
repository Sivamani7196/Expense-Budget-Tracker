import React from 'react';
import { ForecastCard } from '../components/forecast/ForecastCard';
import { Transaction } from '../types';
import { useAdvancedAI } from '../hooks/useAdvancedAI';
import { AdvancedAIInsights } from '../components/forecast/AdvancedAIInsights';
import { Brain, TrendingUp, Loader2, Zap, Cpu, BarChart3 } from 'lucide-react';

interface ForecastProps {
  transactions: Transaction[];
}

export const Forecast: React.FC<ForecastProps> = ({ transactions }) => {
  const { analysis, isAnalyzing, lastAnalysisTime, hasData, trainingProgress, modelAccuracy } = useAdvancedAI(transactions);

  if (!hasData) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Advanced AI/ML Forecast</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Neural Networks, ARIMA, and Ensemble ML models for financial predictions</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-8 text-center shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="text-6xl mb-6">🤖</div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Advanced ML-Powered Financial Intelligence</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
            Our ensemble of Neural Networks, ARIMA models, and Support Vector Regression analyze your spending patterns, 
            detect anomalies using Isolation Forest, and provide intelligent forecasts. Add transactions to unlock advanced ML!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <Cpu className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Neural Networks</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Deep learning models with backpropagation training</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <BarChart3 className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">ARIMA & SVR</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Time series analysis and support vector regression</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <Zap className="h-12 w-12 text-yellow-600 dark:text-yellow-400 mx-auto mb-4" />
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Ensemble Learning</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Combines multiple ML models for superior accuracy</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isAnalyzing && !analysis) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Advanced AI/ML Forecast</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Neural Networks, ARIMA, and Ensemble ML models for financial predictions</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Cpu className="h-16 w-16 text-purple-600 dark:text-purple-400 animate-pulse" />
              <Loader2 className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin absolute -top-2 -right-2" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">ML Models Training...</h3>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Neural Networks, ARIMA, and SVR models are training on your transaction patterns.
          </p>
          
          {/* Training Progress */}
          {trainingProgress > 0 && (
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Training Progress</span>
                <span>{trainingProgress.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-300" 
                     style={{ width: `${trainingProgress}%` }}></div>
              </div>
            </div>
          )}
          
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Advanced AI/ML Forecast</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Neural Networks, ARIMA, and Ensemble ML models for financial predictions</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <div className="text-6xl mb-6 opacity-50">🤖</div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">AI Analysis Unavailable</h3>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Unable to generate AI insights at the moment. Please try again or add more transaction data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Advanced AI/ML Forecast</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Neural Networks, ARIMA, and Ensemble ML models for financial predictions</p>
        </div>
        {isAnalyzing && (
          <div className="flex items-center space-x-2 bg-purple-100 dark:bg-purple-900/30 px-4 py-2 rounded-xl">
            <Loader2 className="h-4 w-4 animate-spin text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Updating...</span>
          </div>
        )}
      </div>

      {/* Advanced AI Insights Section */}
      <AdvancedAIInsights 
        analysis={analysis} 
        isAnalyzing={isAnalyzing} 
        lastAnalysisTime={lastAnalysisTime}
      />

      {/* Forecasts Grid */}
      {analysis.forecasts.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <div className="text-6xl mb-6 opacity-50">📊</div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Training ML Models</h3>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Add more transactions across different categories to train accurate ML models for forecasting.
          </p>
        </div>
      ) : (
        <>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Cpu className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-3" />
              ML-Powered Predictions
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              These forecasts are generated using an ensemble of Neural Networks, ARIMA time series models, and Support Vector Regression 
              that analyze spending patterns, seasonal trends, and transaction frequency with {((analysis?.modelAccuracy || 0) * 100).toFixed(1)}% accuracy.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analysis.forecasts.map((forecast) => (
              <ForecastCard key={forecast.category} forecast={forecast} isMLPowered={true} />
            ))}
          </div>
        </>
      )}

      {/* AI Technology Info */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <span className="text-2xl mr-3">⚡</span>
          How Our ML Models Work
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Machine Learning Models</h4>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>• Neural Networks with backpropagation training</li>
              <li>• ARIMA models for time series forecasting</li>
              <li>• Support Vector Regression for non-linear patterns</li>
              <li>• Isolation Forest for anomaly detection</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Model Performance</h4>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>• Accuracy: {((analysis?.modelAccuracy || 0) * 100).toFixed(1)}%</li>
              <li>• Ensemble learning for superior predictions</li>
              <li>• Real-time model retraining</li>
              <li>• Feature importance analysis</li>
            </ul>
          </div>
        </div>
        <div className="mt-6">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Real-time Features</h4>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>• Instant analysis on data changes</li>
              <li>• Multi-model confidence scoring</li>
              <li>• Automated hyperparameter tuning</li>
              <li>• Continuous model improvement</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};