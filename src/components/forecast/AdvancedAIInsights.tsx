import React from 'react';
import { Brain, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, Cpu, BarChart3, Zap } from 'lucide-react';
import { AdvancedAIAnalysis } from '../../utils/advancedAI';

interface AdvancedAIInsightsProps {
  analysis: AdvancedAIAnalysis;
  isAnalyzing: boolean;
  lastAnalysisTime: Date | null;
}

export const AdvancedAIInsights: React.FC<AdvancedAIInsightsProps> = ({ 
  analysis, 
  isAnalyzing, 
  lastAnalysisTime 
}) => {
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
      {/* ML Model Status Header */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-xl">
              <Cpu className={`h-6 w-6 text-purple-600 dark:text-purple-400 ${isAnalyzing ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {isAnalyzing ? 'ML Models Training...' : 'ML Analysis Complete'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isAnalyzing ? 'Neural Networks, ARIMA & SVR processing' : 'Ensemble learning with real-time insights'}
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
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Model Accuracy</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {(analysis.modelAccuracy * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <span className="text-lg">🎯</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Confidence</p>
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
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Pattern</p>
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

      {/* Feature Importance */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <Zap className="h-5 w-5 text-yellow-500 mr-3" />
          ML Feature Importance
        </h4>
        <div className="space-y-3">
          {Object.entries(analysis.featureImportance).map(([feature, importance]) => (
            <div key={feature} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <span className="font-semibold text-gray-900 dark:text-white">{feature}</span>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${importance * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-gray-600 dark:text-gray-400 w-12">
                  {(importance * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ML Recommendations */}
      <div className={`bg-gradient-to-r ${getRiskColor()} rounded-2xl p-6 border`}>
        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <span className="text-2xl mr-3">🤖</span>
          ML-Powered Recommendations
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

      {/* Advanced Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="text-2xl mr-3">📊</span>
            Volatility Analysis
          </h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Volatility Index</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {(analysis.insights.volatilityIndex * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  analysis.insights.volatilityIndex > 0.5 ? 'bg-red-500' :
                  analysis.insights.volatilityIndex > 0.3 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(100, analysis.insights.volatilityIndex * 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {analysis.insights.volatilityIndex > 0.5 ? 'High volatility detected' :
               analysis.insights.volatilityIndex > 0.3 ? 'Moderate volatility' : 'Low volatility - stable spending'}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="text-2xl mr-3">🔄</span>
            Seasonality Strength
          </h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Seasonal Pattern</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {(analysis.insights.seasonalityStrength * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${analysis.insights.seasonalityStrength * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {analysis.insights.seasonalityStrength > 0.3 ? 'Strong seasonal patterns detected' :
               analysis.insights.seasonalityStrength > 0.1 ? 'Moderate seasonality' : 'No clear seasonal patterns'}
            </p>
          </div>
        </div>
      </div>

      {/* Anomaly Detection Results */}
      {analysis.anomalies.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 text-orange-500 mr-3" />
            ML Anomaly Detection
          </h4>
          <div className="space-y-3">
            {analysis.anomalies.slice(0, 5).map((anomaly, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">⚠️</div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ₹{anomaly.amount.toFixed(2)} - {anomaly.category}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{anomaly.reason}</p>
                    <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                      Anomaly Score: {anomaly.anomalyScore.toFixed(2)}
                    </p>
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

      {/* Model Confidence by Category */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <span className="text-2xl mr-3">📊</span>
          ML Model Confidence by Category
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
                    className={`h-2 rounded-full transition-all duration-500 ${
                      confidence > 0.8 ? 'bg-green-500' :
                      confidence > 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
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