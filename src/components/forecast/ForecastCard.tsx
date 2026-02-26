import React from 'react';
import { Forecast } from '../../types';
import { formatCurrency, categories } from '../../utils/finance';
import { TrendingUp, TrendingDown, Minus, Cpu } from 'lucide-react';

interface ForecastCardProps {
  forecast: Forecast;
  isMLPowered?: boolean;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ forecast, isMLPowered = true }) => {
  const category = categories.find(c => c.value === forecast.category);
  
  const getTrendIcon = () => {
    switch (forecast.trend) {
      case 'increasing':
        return <TrendingUp className="h-6 w-6 text-red-500 dark:text-red-400" />;
      case 'decreasing':
        return <TrendingDown className="h-6 w-6 text-green-500 dark:text-green-400" />;
      default:
        return <Minus className="h-6 w-6 text-gray-500 dark:text-gray-400" />;
    }
  };

  const getTrendColor = () => {
    switch (forecast.trend) {
      case 'increasing':
        return 'text-red-600 dark:text-red-400';
      case 'decreasing':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const confidenceLevel = forecast.confidence >= 0.9 ? 'Very High' : 
                         forecast.confidence >= 0.8 ? 'High' :
                         forecast.confidence >= 0.7 ? 'Medium' : 
                         forecast.confidence >= 0.5 ? 'Low' : 'Very Low';

  const getConfidenceColor = () => {
    if (forecast.confidence >= 0.9) return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
    if (forecast.confidence >= 0.8) return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
    if (forecast.confidence >= 0.7) return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
    if (forecast.confidence >= 0.5) return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30';
    return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
  };

  const getGradientBorder = () => {
    if (forecast.confidence >= 0.9) return 'from-green-400 to-emerald-500';
    if (forecast.confidence >= 0.8) return 'from-blue-400 to-indigo-500';
    if (forecast.confidence >= 0.7) return 'from-yellow-400 to-orange-500';
    return 'from-gray-400 to-gray-500';
  };

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
      {/* ML Badge */}
      {isMLPowered && (
        <div className="absolute top-4 right-4 flex items-center space-x-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold">
          <Cpu className="h-3 w-3" />
          <span>ML</span>
        </div>
      )}

      {/* Confidence Border */}
      <div className={`absolute inset-0 bg-gradient-to-r ${getGradientBorder()} opacity-20 rounded-2xl`}></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">{category?.icon}</div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-xl">{category?.label}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Next month prediction</p>
            </div>
          </div>
          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl shadow-inner">
            {getTrendIcon()}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
              {formatCurrency(forecast.predictedAmount)}
            </p>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-semibold ${getTrendColor()}`}>
                Trend: {forecast.trend}
              </span>
              {forecast.trend === 'increasing' && (
                <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded-full font-semibold">
                  ↗ Rising
                </span>
              )}
              {forecast.trend === 'decreasing' && (
                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full font-semibold">
                  ↘ Falling
                </span>
              )}
            </div>
          </div>

          {/* Enhanced Confidence Display */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">AI Confidence</span>
              <span className={`text-sm font-bold px-3 py-1 rounded-full ${getConfidenceColor()}`}>
                {confidenceLevel}
              </span>
            </div>
            
            {/* Confidence Bar */}
            <div className="relative">
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 shadow-inner">
                <div
                  className={`h-3 rounded-full transition-all duration-1000 shadow-sm bg-gradient-to-r ${getGradientBorder()}`}
                  style={{ width: `${forecast.confidence * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>0%</span>
                <span className="font-bold">{(forecast.confidence * 100).toFixed(1)}%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* AI Insight */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 p-1 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <Cpu className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium leading-relaxed">
                  {forecast.confidence >= 0.8 ? (
                    <>Our ML ensemble is <strong>highly confident</strong> in this prediction based on Neural Network, ARIMA, and SVR analysis of {category?.label.toLowerCase()}.</>
                  ) : forecast.confidence >= 0.6 ? (
                    <>This prediction has <strong>moderate confidence</strong>. ML models detected some variability in {category?.label.toLowerCase()} spending patterns.</>
                  ) : (
                    <>This prediction has <strong>lower confidence</strong> due to irregular patterns detected by our ML models. Consider this as a rough estimate.</>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};