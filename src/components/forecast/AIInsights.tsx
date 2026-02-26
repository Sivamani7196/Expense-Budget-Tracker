import React from 'react';
import { Brain, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { AIAnalysisResult } from '../../utils/aiForecasting';

interface AIInsightsProps {
  analysis: AIAnalysisResult;
  isAnalyzing: boolean;
  lastAnalysisTime: Date | null;
}

export const AIInsights: React.FC<AIInsightsProps> = ({ analysis, isAnalyzing, lastAnalysisTime }) => {
  const getRiskIcon = () => {
    switch (analysis.insights.riskLevel) {
      case 'high':
        return <AlertTriangle className="h-6 w-6 text-red-500" />;
      case 'medium':
        return <TrendingUp className="h-6 w-6 text-yellow-500" />;
      default:
        return <CheckCircle className="h-6 w-6 text-green-500" />;
    }
  };

  const getRiskColor = () => {
    switch (analysis.insights.riskLevel) {
      case 'high':
        return 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800';
      case 'medium':
        return 'from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-800';
      default:
        return 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800';
    }
  };

  const getPatternIcon = () => {
    switch (analysis.insights.spendingPattern) {
      case 'trending_up':
        return <TrendingUp className="h-5 w-5 text-red-500" />;
      case 'trending_down':
        return <TrendingDown className="h-5 w-5 text-green-500" />;
      case 'seasonal':
        return <span className="text-lg">🔄</span>;
      case 'irregular':
        return <span className="text-lg">📊</span>;
      default:
        return <span className="text-lg">📈</span>;
    }
  };

  const formatPattern = (pattern: string) => {
    return pattern.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      {/* AI Status Header */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-xl">
              <Brain className={`h-6 w-6 text-purple-600 dark:text-purple-400 ${isAnalyzing ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {isAnalyzing ? 'AI Analyzing...' : 'AI Analysis Complete'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isAnalyzing ? 'Processing your financial data' : 'Real-time insights powered by machine learning'}
              </p>
            </div>
          </div>
          {lastAnalysisTime && (
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span>Updated {lastAnalysisTime.toLocaleTimeString()}</span>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <span className="text-lg">🎯</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Overall Confidence</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {(analysis.confidence.overall * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                {getPatternIcon()}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Spending Pattern</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatPattern(analysis.insights.spendingPattern)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                {getRiskIcon()}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Risk Level</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                  {analysis.insights.riskLevel}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className={`bg-gradient-to-r ${getRiskColor()} rounded-2xl p-6 border`}>
        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <span className="text-2xl mr-3">🤖</span>
          AI Recommendations
        </h4>
        <div className="space-y-3">
          {analysis.insights.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-3 bg-white/50 dark:bg-gray-800/50 rounded-xl p-4">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              <p className="text-gray-800 dark:text-gray-200 font-medium">{recommendation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Anomalies Detection */}
      {analysis.insights.anomalies.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 text-orange-500 mr-3" />
            Unusual Spending Detected
          </h4>
          <div className="space-y-3">
            {analysis.insights.anomalies.slice(0, 5).map((anomaly, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">⚠️</div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ${anomaly.amount.toFixed(2)} - {anomaly.category}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{anomaly.reason}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {anomaly.date.toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confidence by Category */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <span className="text-2xl mr-3">📊</span>
          Prediction Confidence by Category
        </h4>
        <div className="space-y-3">
          {Object.entries(analysis.confidence.byCategory).map(([category, confidence]) => (
            <div key={category} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <span className="font-semibold text-gray-900 dark:text-white capitalize">
                {category.replace('_', ' ')}
              </span>
              <div className="flex items-center space-x-3">
                <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${confidence * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-gray-600 dark:text-gray-400 w-12">
                  {(confidence * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};