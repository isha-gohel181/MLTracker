import { useState, useEffect } from 'react';
import { experimentService } from '../services/experiments';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Zap, 
  AlertCircle,
  CheckCircle,
  Clock,
  Sparkles,
  Lightbulb,
  BarChart3,
  Settings
} from 'lucide-react';
import { Line, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { formatNumber } from '../lib/utils';
import { toast } from 'react-toastify';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

const PredictionEngine = () => {
  const [experiments, setExperiments] = useState([]);
  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    modelType: 'CNN',
    datasetSize: 10000,
    epochs: 50,
    batchSize: 32,
    learningRate: 0.001,
    optimizer: 'Adam',
    targetAccuracy: 90
  });

  useEffect(() => {
    fetchExperiments();
  }, []);

  const fetchExperiments = async () => {
    try {
      const response = await experimentService.getExperiments({ limit: 100 });
      setExperiments(response.data);
    } catch (error) {
      toast.error('Failed to fetch experiments');
    }
  };

  const generatePredictions = async () => {
    setLoading(true);
    try {
      // Simulate AI prediction based on historical data
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      const predictions = generateMockPredictions();
      setPredictionData(predictions);
      toast.success('Predictions generated successfully!');
    } catch (error) {
      toast.error('Failed to generate predictions');
    } finally {
      setLoading(false);
    }
  };

  const generateMockPredictions = () => {
    const { modelType, datasetSize, epochs, batchSize, learningRate, targetAccuracy } = formData;
    
    // Mock AI logic for predictions
    const baseAccuracy = 75 + Math.random() * 15;
    const baseLoss = 0.3 + Math.random() * 0.2;
    
    const datasetSizeFactor = Math.log(datasetSize) / Math.log(100000);
    const epochsFactor = Math.min(epochs / 100, 1);
    const learningRateFactor = learningRate < 0.01 ? 1 : 0.8;
    
    const predictedAccuracy = Math.min(95, baseAccuracy + (datasetSizeFactor * 5) + (epochsFactor * 8) + (learningRateFactor * 3));
    const predictedLoss = Math.max(0.05, baseLoss - (datasetSizeFactor * 0.1) - (epochsFactor * 0.15));
    
    const confidence = Math.min(95, 60 + (datasetSizeFactor * 15) + (epochsFactor * 20));
    const estimatedTime = Math.ceil((epochs * datasetSize) / (batchSize * 1000)); // hours
    
    const similar = experiments
      .filter(exp => Math.abs(exp.accuracy - predictedAccuracy) < 10)
      .slice(0, 3);

    const recommendations = generateRecommendations(formData, predictedAccuracy);
    
    return {
      predictedAccuracy,
      predictedLoss,
      confidence,
      estimatedTime,
      similar,
      recommendations,
      riskFactors: generateRiskFactors(formData),
      optimizationSuggestions: generateOptimizationSuggestions(formData),
      comparisonData: generateComparisonData(formData),
      convergenceData: generateConvergenceData(formData)
    };
  };

  const generateRecommendations = (data, accuracy) => {
    const recommendations = [];
    
    if (data.learningRate > 0.01) {
      recommendations.push({
        type: 'warning',
        title: 'Learning Rate Optimization',
        description: 'Consider reducing learning rate to 0.001 for better convergence',
        impact: '+2-5% accuracy'
      });
    }
    
    if (data.batchSize < 64 && data.datasetSize > 50000) {
      recommendations.push({
        type: 'info',
        title: 'Batch Size Increase',
        description: 'Increase batch size to 64 or 128 for faster training on large datasets',
        impact: '-30% training time'
      });
    }
    
    if (accuracy < data.targetAccuracy) {
      recommendations.push({
        type: 'error',
        title: 'Target Not Achievable',
        description: 'Consider data augmentation or a more complex model architecture',
        impact: `+${data.targetAccuracy - accuracy}% needed`
      });
    }
    
    recommendations.push({
      type: 'success',
      title: 'Early Stopping',
      description: 'Implement early stopping to prevent overfitting',
      impact: 'Improved generalization'
    });
    
    return recommendations;
  };

  const generateRiskFactors = (data) => [
    {
      factor: 'Overfitting Risk',
      level: data.epochs > 100 ? 'High' : data.epochs > 50 ? 'Medium' : 'Low',
      description: 'Monitor validation loss closely'
    },
    {
      factor: 'Training Time',
      level: data.datasetSize > 100000 ? 'High' : 'Medium',
      description: 'Large dataset may require significant compute time'
    },
    {
      factor: 'Memory Usage',
      level: data.batchSize > 128 ? 'High' : 'Low',
      description: 'Batch size may exceed GPU memory limits'
    }
  ];

  const generateOptimizationSuggestions = (data) => [
    {
      parameter: 'Learning Rate',
      current: data.learningRate,
      suggested: data.learningRate > 0.01 ? 0.001 : data.learningRate * 0.5,
      reason: 'Better convergence and stability'
    },
    {
      parameter: 'Batch Size',
      current: data.batchSize,
      suggested: Math.min(128, data.batchSize * 2),
      reason: 'Improved gradient estimation'
    },
    {
      parameter: 'Epochs',
      current: data.epochs,
      suggested: Math.ceil(data.epochs * 0.8),
      reason: 'Prevent overfitting with early stopping'
    }
  ];

  const generateComparisonData = (data) => ({
    labels: ['Accuracy', 'Training Speed', 'Memory Efficiency', 'Generalization', 'Convergence'],
    datasets: [
      {
        label: 'Current Configuration',
        data: [75, 60, 70, 65, 80],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
      },
      {
        label: 'Optimized Configuration',
        data: [85, 80, 85, 90, 95],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
      },
    ],
  });

  const generateConvergenceData = (data) => {
    const points = [];
    for (let i = 0; i <= data.epochs; i += 5) {
      const progress = i / data.epochs;
      const accuracy = 30 + (50 * progress) - (10 * Math.pow(progress - 0.8, 2));
      const loss = 2 - (1.5 * progress) + (0.3 * Math.pow(progress - 0.7, 2));
      points.push({ epoch: i, accuracy: Math.max(0, accuracy), loss: Math.max(0.01, loss) });
    }
    return points;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Lightbulb className="h-4 w-4 text-blue-500" />;
    }
  };

  const convergenceChartData = predictionData ? {
    labels: predictionData.convergenceData.map(p => `Epoch ${p.epoch}`),
    datasets: [
      {
        label: 'Predicted Accuracy',
        data: predictionData.convergenceData.map(p => p.accuracy),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Predicted Loss',
        data: predictionData.convergenceData.map(p => p.loss * 30), // Scale for visibility
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        yAxisID: 'y1',
      },
    ],
  } : null;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Brain className="h-8 w-8 mr-3 text-purple-500" />
            AI Prediction Engine
          </h1>
          <p className="text-muted-foreground">
            Predict experiment outcomes and optimize hyperparameters using AI
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Experiment Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="modelType">Model Type</Label>
              <select
                id="modelType"
                value={formData.modelType}
                onChange={(e) => handleInputChange('modelType', e.target.value)}
                className="w-full mt-1 p-2 border rounded-md bg-background"
              >
                <option value="CNN">CNN</option>
                <option value="RNN">RNN</option>
                <option value="Transformer">Transformer</option>
                <option value="ResNet">ResNet</option>
                <option value="LSTM">LSTM</option>
              </select>
            </div>

            <div>
              <Label htmlFor="datasetSize">Dataset Size</Label>
              <Input
                id="datasetSize"
                type="number"
                value={formData.datasetSize}
                onChange={(e) => handleInputChange('datasetSize', parseInt(e.target.value))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="epochs">Epochs</Label>
              <Input
                id="epochs"
                type="number"
                value={formData.epochs}
                onChange={(e) => handleInputChange('epochs', parseInt(e.target.value))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="batchSize">Batch Size</Label>
              <Input
                id="batchSize"
                type="number"
                value={formData.batchSize}
                onChange={(e) => handleInputChange('batchSize', parseInt(e.target.value))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="learningRate">Learning Rate</Label>
              <Input
                id="learningRate"
                type="number"
                step="0.0001"
                value={formData.learningRate}
                onChange={(e) => handleInputChange('learningRate', parseFloat(e.target.value))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="targetAccuracy">Target Accuracy (%)</Label>
              <Input
                id="targetAccuracy"
                type="number"
                value={formData.targetAccuracy}
                onChange={(e) => handleInputChange('targetAccuracy', parseInt(e.target.value))}
                className="mt-1"
              />
            </div>

            <Button
              onClick={generatePredictions}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
            >
              {loading ? (
                <>
                  <Brain className="h-4 w-4 mr-2 animate-pulse" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Predictions
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {predictionData ? (
            <>
              {/* Prediction Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Target className="h-4 w-4 mr-2 text-green-500" />
                      Predicted Accuracy
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {formatNumber(predictionData.predictedAccuracy)}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Confidence: {formatNumber(predictionData.confidence)}%
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2 text-red-500" />
                      Predicted Loss
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {formatNumber(predictionData.predictedLoss)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Final convergence
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-blue-500" />
                      Estimated Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {predictionData.estimatedTime}h
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Training duration
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {predictionData.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                      {getRecommendationIcon(rec.type)}
                      <div className="flex-1">
                        <h4 className="font-medium">{rec.title}</h4>
                        <p className="text-sm text-muted-foreground">{rec.description}</p>
                        <Badge variant="outline" className="mt-1">
                          {rec.impact}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Optimization Comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Configuration Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <Radar 
                        key={`radar-${Date.now()}`}
                        data={predictionData.comparisonData} 
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            r: {
                              beginAtZero: true,
                              max: 100
                            }
                          }
                        }} 
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Predicted Convergence</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      {convergenceChartData && (
                        <Line 
                          key={`line-${Date.now()}`}
                          data={convergenceChartData} 
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                              y: { beginAtZero: true, title: { display: true, text: 'Accuracy (%)' }},
                              y1: {
                                type: 'linear',
                                display: true,
                                position: 'right',
                                title: { display: true, text: 'Loss (scaled)' },
                                grid: { drawOnChartArea: false },
                              },
                            },
                          }} 
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Similar Experiments */}
              {predictionData.similar.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Similar Historical Experiments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {predictionData.similar.map((exp) => (
                        <div key={exp._id} className="p-3 border rounded-lg">
                          <h4 className="font-medium">{exp.modelName}</h4>
                          <div className="flex justify-between text-sm text-muted-foreground mt-2">
                            <span>Accuracy: {formatNumber(exp.accuracy)}%</span>
                            <span>Loss: {formatNumber(exp.loss)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Brain className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">AI Prediction Engine</h3>
                <p className="text-muted-foreground mb-4">
                  Configure your experiment parameters and let AI predict the outcomes
                </p>
                <p className="text-sm text-muted-foreground">
                  Get insights on expected accuracy, training time, and optimization suggestions
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictionEngine;