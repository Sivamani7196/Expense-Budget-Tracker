// Advanced Machine Learning Models for Financial Forecasting
import { Transaction, TransactionCategory } from '../types';

export interface MLPrediction {
  value: number;
  confidence: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  seasonality: number;
  volatility: number;
}

export interface MLModelResult {
  predictions: Record<TransactionCategory, MLPrediction>;
  modelAccuracy: number;
  featureImportance: Record<string, number>;
  anomalies: Array<{
    date: Date;
    amount: number;
    category: TransactionCategory;
    anomalyScore: number;
    reason: string;
  }>;
}

// Neural Network Implementation for Time Series Forecasting
export class NeuralNetworkForecaster {
  private weights: number[][];
  private biases: number[];
  private learningRate: number = 0.01;
  private epochs: number = 100;

  constructor(inputSize: number = 10, hiddenSize: number = 20, outputSize: number = 1) {
    // Initialize weights and biases with Xavier initialization
    this.weights = [
      this.initializeWeights(inputSize, hiddenSize),
      this.initializeWeights(hiddenSize, outputSize)
    ];
    this.biases = [
      new Array(hiddenSize).fill(0).map(() => Math.random() * 0.1 - 0.05),
      new Array(outputSize).fill(0).map(() => Math.random() * 0.1 - 0.05)
    ];
  }

  private initializeWeights(inputSize: number, outputSize: number): number[] {
    const weights = [];
    const limit = Math.sqrt(6 / (inputSize + outputSize));
    for (let i = 0; i < inputSize * outputSize; i++) {
      weights.push(Math.random() * 2 * limit - limit);
    }
    return weights;
  }

  private sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, x))));
  }

  private relu(x: number): number {
    return Math.max(0, x);
  }

  private forwardPass(input: number[]): { hidden: number[]; output: number[] } {
    // Hidden layer
    const hidden = [];
    for (let i = 0; i < this.biases[0].length; i++) {
      let sum = this.biases[0][i];
      for (let j = 0; j < input.length; j++) {
        sum += input[j] * this.weights[0][j * this.biases[0].length + i];
      }
      hidden.push(this.relu(sum));
    }

    // Output layer
    const output = [];
    for (let i = 0; i < this.biases[1].length; i++) {
      let sum = this.biases[1][i];
      for (let j = 0; j < hidden.length; j++) {
        sum += hidden[j] * this.weights[1][j * this.biases[1].length + i];
      }
      output.push(sum);
    }

    return { hidden, output };
  }

  train(trainingData: { input: number[]; target: number }[]): void {
    for (let epoch = 0; epoch < this.epochs; epoch++) {
      let totalLoss = 0;
      
      for (const data of trainingData) {
        const { hidden, output } = this.forwardPass(data.input);
        const loss = Math.pow(output[0] - data.target, 2);
        totalLoss += loss;

        // Backpropagation (simplified)
        const outputError = 2 * (output[0] - data.target);
        
        // Update output layer weights
        for (let i = 0; i < hidden.length; i++) {
          const weightIndex = i * this.biases[1].length;
          this.weights[1][weightIndex] -= this.learningRate * outputError * hidden[i];
        }
        this.biases[1][0] -= this.learningRate * outputError;
      }

      // Adaptive learning rate
      if (epoch > 0 && epoch % 20 === 0) {
        this.learningRate *= 0.95;
      }
    }
  }

  predict(input: number[]): number {
    const { output } = this.forwardPass(input);
    return Math.max(0, output[0]);
  }
}

// ARIMA Model Implementation
export class ARIMAModel {
  private p: number; // AR order
  private d: number; // Differencing order
  private q: number; // MA order
  private arCoeffs: number[] = [];
  private maCoeffs: number[] = [];
  private residuals: number[] = [];

  constructor(p: number = 2, d: number = 1, q: number = 2) {
    this.p = p;
    this.d = d;
    this.q = q;
  }

  private difference(data: number[], order: number): number[] {
    let result = [...data];
    for (let i = 0; i < order; i++) {
      const newResult = [];
      for (let j = 1; j < result.length; j++) {
        newResult.push(result[j] - result[j - 1]);
      }
      result = newResult;
    }
    return result;
  }

  private calculateAutoCorrelation(data: number[], lag: number): number {
    const n = data.length;
    const mean = data.reduce((sum, val) => sum + val, 0) / n;
    
    let numerator = 0;
    let denominator = 0;
    
    for (let i = 0; i < n - lag; i++) {
      numerator += (data[i] - mean) * (data[i + lag] - mean);
    }
    
    for (let i = 0; i < n; i++) {
      denominator += Math.pow(data[i] - mean, 2);
    }
    
    return numerator / denominator;
  }

  fit(data: number[]): void {
    // Difference the data
    const diffData = this.difference(data, this.d);
    
    // Estimate AR coefficients using Yule-Walker equations
    const autocorrs = [];
    for (let i = 0; i <= this.p; i++) {
      autocorrs.push(this.calculateAutoCorrelation(diffData, i));
    }
    
    // Solve Yule-Walker equations (simplified)
    this.arCoeffs = [];
    for (let i = 1; i <= this.p; i++) {
      this.arCoeffs.push(autocorrs[i] / autocorrs[0]);
    }
    
    // Calculate residuals for MA estimation
    this.residuals = [];
    for (let i = this.p; i < diffData.length; i++) {
      let predicted = 0;
      for (let j = 0; j < this.p; j++) {
        predicted += this.arCoeffs[j] * diffData[i - j - 1];
      }
      this.residuals.push(diffData[i] - predicted);
    }
    
    // Estimate MA coefficients
    this.maCoeffs = [];
    for (let i = 1; i <= this.q; i++) {
      const corr = this.calculateAutoCorrelation(this.residuals, i);
      this.maCoeffs.push(corr * 0.5); // Simplified estimation
    }
  }

  forecast(steps: number = 1): number[] {
    const forecasts = [];
    const lastResiduals = this.residuals.slice(-this.q);
    
    for (let step = 0; step < steps; step++) {
      let forecast = 0;
      
      // AR component
      for (let i = 0; i < this.arCoeffs.length; i++) {
        if (forecasts.length > i) {
          forecast += this.arCoeffs[i] * forecasts[forecasts.length - 1 - i];
        }
      }
      
      // MA component
      for (let i = 0; i < this.maCoeffs.length && i < lastResiduals.length; i++) {
        forecast += this.maCoeffs[i] * lastResiduals[lastResiduals.length - 1 - i];
      }
      
      forecasts.push(Math.max(0, forecast));
    }
    
    return forecasts;
  }
}

// Support Vector Regression for Non-linear Patterns
export class SVRModel {
  private supportVectors: number[][] = [];
  private alphas: number[] = [];
  private bias: number = 0;
  private gamma: number = 0.1;
  private C: number = 1.0;

  private rbfKernel(x1: number[], x2: number[]): number {
    let sum = 0;
    for (let i = 0; i < x1.length; i++) {
      sum += Math.pow(x1[i] - x2[i], 2);
    }
    return Math.exp(-this.gamma * sum);
  }

  fit(X: number[][], y: number[]): void {
    // Simplified SMO algorithm for SVR
    const n = X.length;
    this.alphas = new Array(n).fill(0);
    this.supportVectors = [...X];
    
    // Iterative optimization (simplified)
    for (let iter = 0; iter < 100; iter++) {
      for (let i = 0; i < n; i++) {
        const prediction = this.predict(X[i]);
        const error = prediction - y[i];
        
        if (Math.abs(error) > 0.1) {
          const oldAlpha = this.alphas[i];
          this.alphas[i] = Math.max(0, Math.min(this.C, 
            oldAlpha - 0.01 * Math.sign(error)));
        }
      }
    }
    
    // Calculate bias
    let biasSum = 0;
    let count = 0;
    for (let i = 0; i < n; i++) {
      if (this.alphas[i] > 0 && this.alphas[i] < this.C) {
        biasSum += y[i] - this.predictWithoutBias(X[i]);
        count++;
      }
    }
    this.bias = count > 0 ? biasSum / count : 0;
  }

  private predictWithoutBias(x: number[]): number {
    let result = 0;
    for (let i = 0; i < this.supportVectors.length; i++) {
      if (this.alphas[i] !== 0) {
        result += this.alphas[i] * this.rbfKernel(x, this.supportVectors[i]);
      }
    }
    return result;
  }

  predict(x: number[]): number {
    return Math.max(0, this.predictWithoutBias(x) + this.bias);
  }
}

// Ensemble Model combining multiple ML approaches
export class EnsembleForecaster {
  private neuralNet: NeuralNetworkForecaster;
  private arima: ARIMAModel;
  private svr: SVRModel;
  private weights: { nn: number; arima: number; svr: number } = { nn: 0.4, arima: 0.3, svr: 0.3 };

  constructor() {
    this.neuralNet = new NeuralNetworkForecaster();
    this.arima = new ARIMAModel();
    this.svr = new SVRModel();
  }

  private prepareFeatures(transactions: Transaction[], category: TransactionCategory): {
    timeSeries: number[];
    features: number[][];
    targets: number[];
  } {
    const categoryTransactions = transactions
      .filter(t => t.category === category && t.type === 'expense')
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    if (categoryTransactions.length < 10) {
      return { timeSeries: [], features: [], targets: [] };
    }

    // Create time series
    const timeSeries = categoryTransactions.map(t => t.amount);
    
    // Create features for ML models
    const features: number[][] = [];
    const targets: number[] = [];
    const windowSize = 7;

    for (let i = windowSize; i < timeSeries.length; i++) {
      const feature = [];
      
      // Historical values
      for (let j = 0; j < windowSize; j++) {
        feature.push(timeSeries[i - windowSize + j]);
      }
      
      // Statistical features
      const window = timeSeries.slice(i - windowSize, i);
      const mean = window.reduce((sum, val) => sum + val, 0) / window.length;
      const std = Math.sqrt(window.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / window.length);
      
      feature.push(mean, std);
      
      // Trend feature
      const trend = (window[window.length - 1] - window[0]) / window.length;
      feature.push(trend);
      
      features.push(feature);
      targets.push(timeSeries[i]);
    }

    return { timeSeries, features, targets };
  }

  trainModels(transactions: Transaction[], category: TransactionCategory): void {
    const { timeSeries, features, targets } = this.prepareFeatures(transactions, category);
    
    if (features.length === 0) return;

    try {
      // Train Neural Network
      const nnTrainingData = features.map((feature, i) => ({
        input: feature,
        target: targets[i]
      }));
      this.neuralNet.train(nnTrainingData);

      // Train ARIMA
      this.arima.fit(timeSeries);

      // Train SVR
      this.svr.fit(features, targets);
    } catch (error) {
      console.warn('Model training error:', error);
    }
  }

  predict(transactions: Transaction[], category: TransactionCategory): MLPrediction {
    const { timeSeries, features } = this.prepareFeatures(transactions, category);
    
    if (features.length === 0) {
      return {
        value: 0,
        confidence: 0.1,
        trend: 'stable',
        seasonality: 0,
        volatility: 0
      };
    }

    try {
      const lastFeature = features[features.length - 1];
      
      // Get predictions from each model
      const nnPrediction = this.neuralNet.predict(lastFeature);
      const arimaPrediction = this.arima.forecast(1)[0] || 0;
      const svrPrediction = this.svr.predict(lastFeature);

      // Ensemble prediction
      const ensemblePrediction = 
        nnPrediction * this.weights.nn +
        arimaPrediction * this.weights.arima +
        svrPrediction * this.weights.svr;

      // Calculate confidence based on model agreement
      const predictions = [nnPrediction, arimaPrediction, svrPrediction];
      const mean = predictions.reduce((sum, p) => sum + p, 0) / predictions.length;
      const variance = predictions.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / predictions.length;
      const confidence = Math.max(0.1, Math.min(0.95, 1 - (Math.sqrt(variance) / mean)));

      // Determine trend
      const recentValues = timeSeries.slice(-5);
      const trend = this.calculateTrend(recentValues);

      // Calculate seasonality and volatility
      const seasonality = this.calculateSeasonality(timeSeries);
      const volatility = this.calculateVolatility(timeSeries);

      return {
        value: Math.max(0, ensemblePrediction),
        confidence: isNaN(confidence) ? 0.5 : confidence,
        trend,
        seasonality,
        volatility
      };
    } catch (error) {
      console.warn('Prediction error:', error);
      return {
        value: 0,
        confidence: 0.1,
        trend: 'stable',
        seasonality: 0,
        volatility: 0
      };
    }
  }

  private calculateTrend(values: number[]): 'increasing' | 'decreasing' | 'stable' {
    if (values.length < 2) return 'stable';
    
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    
    const firstMean = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondMean = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
    
    const change = (secondMean - firstMean) / firstMean;
    
    if (change > 0.1) return 'increasing';
    if (change < -0.1) return 'decreasing';
    return 'stable';
  }

  private calculateSeasonality(values: number[]): number {
    if (values.length < 12) return 0;
    
    // Simple seasonality detection using autocorrelation
    const seasonalLags = [7, 30, 90]; // Weekly, monthly, quarterly
    let maxSeasonality = 0;
    
    for (const lag of seasonalLags) {
      if (lag < values.length) {
        const correlation = this.calculateAutocorrelation(values, lag);
        maxSeasonality = Math.max(maxSeasonality, Math.abs(correlation));
      }
    }
    
    return maxSeasonality;
  }

  private calculateVolatility(values: number[]): number {
    if (values.length < 2) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    
    return Math.sqrt(variance) / mean;
  }

  private calculateAutocorrelation(data: number[], lag: number): number {
    const n = data.length;
    const mean = data.reduce((sum, val) => sum + val, 0) / n;
    
    let numerator = 0;
    let denominator = 0;
    
    for (let i = 0; i < n - lag; i++) {
      numerator += (data[i] - mean) * (data[i + lag] - mean);
    }
    
    for (let i = 0; i < n; i++) {
      denominator += Math.pow(data[i] - mean, 2);
    }
    
    return denominator === 0 ? 0 : numerator / denominator;
  }
}

// Anomaly Detection using Isolation Forest
export class IsolationForest {
  private trees: IsolationTree[] = [];
  private numTrees: number = 100;
  private subsampleSize: number = 256;

  fit(data: number[][]): void {
    this.trees = [];
    
    for (let i = 0; i < this.numTrees; i++) {
      // Random subsample
      const subsample = this.randomSubsample(data, this.subsampleSize);
      const tree = new IsolationTree();
      tree.fit(subsample);
      this.trees.push(tree);
    }
  }

  anomalyScore(point: number[]): number {
    const pathLengths = this.trees.map(tree => tree.pathLength(point));
    const avgPathLength = pathLengths.reduce((sum, len) => sum + len, 0) / pathLengths.length;
    
    // Normalize score
    const c = this.subsampleSize > 1 ? 
      2 * (Math.log(this.subsampleSize - 1) + 0.5772156649) - (2 * (this.subsampleSize - 1) / this.subsampleSize) : 1;
    
    return Math.pow(2, -avgPathLength / c);
  }

  private randomSubsample(data: number[][], size: number): number[][] {
    const shuffled = [...data].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(size, data.length));
  }
}

class IsolationTree {
  private root: TreeNode | null = null;
  private maxDepth: number = Math.ceil(Math.log2(256));

  fit(data: number[][]): void {
    this.root = this.buildTree(data, 0);
  }

  pathLength(point: number[]): number {
    return this.getPathLength(point, this.root, 0);
  }

  private buildTree(data: number[][], depth: number): TreeNode | null {
    if (data.length <= 1 || depth >= this.maxDepth) {
      return new TreeNode(data.length, true);
    }

    // Random feature and split
    const featureIndex = Math.floor(Math.random() * data[0].length);
    const values = data.map(row => row[featureIndex]);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    
    if (minVal === maxVal) {
      return new TreeNode(data.length, true);
    }

    const splitValue = Math.random() * (maxVal - minVal) + minVal;
    
    const leftData = data.filter(row => row[featureIndex] < splitValue);
    const rightData = data.filter(row => row[featureIndex] >= splitValue);

    const node = new TreeNode(data.length, false);
    node.featureIndex = featureIndex;
    node.splitValue = splitValue;
    node.left = this.buildTree(leftData, depth + 1);
    node.right = this.buildTree(rightData, depth + 1);

    return node;
  }

  private getPathLength(point: number[], node: TreeNode | null, depth: number): number {
    if (!node || node.isLeaf) {
      return depth + (node ? this.c(node.size) : 0);
    }

    if (point[node.featureIndex!] < node.splitValue!) {
      return this.getPathLength(point, node.left, depth + 1);
    } else {
      return this.getPathLength(point, node.right, depth + 1);
    }
  }

  private c(n: number): number {
    if (n <= 1) return 0;
    return 2 * (Math.log(n - 1) + 0.5772156649) - (2 * (n - 1) / n);
  }
}

class TreeNode {
  size: number;
  isLeaf: boolean;
  featureIndex?: number;
  splitValue?: number;
  left?: TreeNode | null;
  right?: TreeNode | null;

  constructor(size: number, isLeaf: boolean) {
    this.size = size;
    this.isLeaf = isLeaf;
  }
}