import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { 
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Eye,
  Settings,
  RefreshCw,
  Download,
  Filter,
  Calendar,
  BarChart3,
  Zap,
  CheckCircle,
  XCircle,
  Clock,
  Database,
  Target,
  AlertCircle,
  Activity,
  Search
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DataDriftDetection = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedModel, setSelectedModel] = useState('all');
  const [timeRange, setTimeRange] = useState('7d');
  const [driftAlerts, setDriftAlerts] = useState([]);
  const [driftMetrics, setDriftMetrics] = useState({});
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    loadDriftData();
  }, [selectedModel, timeRange]);

  const loadDriftData = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setDriftAlerts([
        {
          id: 1,
          modelName: 'Customer Churn Predictor',
          severity: 'high',
          type: 'feature_drift',
          metric: 'KL Divergence',
          value: 0.85,
          threshold: 0.5,
          timestamp: '2024-10-21T10:30:00Z',
          description: 'Significant drift detected in age feature distribution',
          status: 'active'
        },
        {
          id: 2,
          modelName: 'Fraud Detection Model',
          severity: 'medium',
          type: 'concept_drift',
          metric: 'PSI',
          value: 0.3,
          threshold: 0.25,
          timestamp: '2024-10-21T08:15:00Z',
          description: 'Moderate concept drift in transaction patterns',
          status: 'investigating'
        },
        {
          id: 3,
          modelName: 'Image Classifier',
          severity: 'low',
          type: 'data_quality',
          metric: 'Missing Values %',
          value: 5.2,
          threshold: 5.0,
          timestamp: '2024-10-21T06:45:00Z',
          description: 'Slight increase in missing values',
          status: 'resolved'
        }
      ]);

      setModels([
        { id: 'all', name: 'All Models', status: 'active' },
        { id: 'model_1', name: 'Customer Churn Predictor', status: 'drift_detected' },
        { id: 'model_2', name: 'Fraud Detection Model', status: 'monitoring' },
        { id: 'model_3', name: 'Image Classifier', status: 'healthy' },
        { id: 'model_4', name: 'Recommendation Engine', status: 'healthy' }
      ]);

      setDriftMetrics({
        driftScore: 0.67,
        modelsWithDrift: 2,
        totalModels: 4,
        alertsToday: 3,
        averageResponseTime: '12m'
      });

      setLoading(false);
    }, 1000);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-100 border-blue-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'investigating': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getModelStatusColor = (status) => {
    switch (status) {
      case 'drift_detected': return 'text-red-600';
      case 'monitoring': return 'text-yellow-600';
      case 'healthy': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  // Chart data for drift trends
  const driftTrendData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Drift Score',
        data: [0.2, 0.3, 0.45, 0.6, 0.67, 0.58, 0.52],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.1,
      },
      {
        label: 'Threshold',
        data: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
        borderColor: 'rgb(156, 163, 175)',
        backgroundColor: 'rgba(156, 163, 175, 0.1)',
        borderDash: [5, 5],
        tension: 0,
      }
    ],
  };

  const featureDriftData = {
    labels: ['Age', 'Income', 'Credit Score', 'Transaction Amount', 'Location'],
    datasets: [
      {
        label: 'Drift Score',
        data: [0.85, 0.45, 0.32, 0.67, 0.23],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',   // High drift
          'rgba(245, 158, 11, 0.8)',  // Medium drift
          'rgba(34, 197, 94, 0.8)',   // Low drift
          'rgba(239, 68, 68, 0.8)',   // High drift
          'rgba(34, 197, 94, 0.8)',   // Low drift
        ],
        borderColor: [
          'rgb(239, 68, 68)',
          'rgb(245, 158, 11)',
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
          'rgb(34, 197, 94)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
      },
    },
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'alerts', name: 'Alerts', icon: AlertTriangle },
    { id: 'models', name: 'Models', icon: Database },
    { id: 'analysis', name: 'Analysis', icon: Target },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overall Drift Score</p>
              <p className="text-2xl font-bold text-red-600">{driftMetrics.driftScore}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-red-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Models with Drift</p>
              <p className="text-2xl font-bold text-foreground">
                {driftMetrics.modelsWithDrift}/{driftMetrics.totalModels}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Alerts Today</p>
              <p className="text-2xl font-bold text-foreground">{driftMetrics.alertsToday}</p>
            </div>
            <Activity className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
              <p className="text-2xl font-bold text-foreground">{driftMetrics.averageResponseTime}</p>
            </div>
            <Clock className="h-8 w-8 text-green-600" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Drift Trend (7 Days)</h3>
          <div className="h-64">
            <Line data={driftTrendData} options={chartOptions} />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Feature Drift Analysis</h3>
          <div className="h-64">
            <Bar data={featureDriftData} options={barChartOptions} />
          </div>
        </Card>
      </div>

      {/* Recent Alerts Summary */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Recent Critical Alerts</h3>
          <Button variant="outline" size="sm" onClick={() => setActiveTab('alerts')}>
            View All Alerts
          </Button>
        </div>
        <div className="space-y-3">
          {driftAlerts.slice(0, 3).map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(alert.status)}
                <div>
                  <p className="font-medium text-foreground">{alert.modelName}</p>
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(alert.severity)}`}>
                  {alert.severity.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search alerts..."
                className="pl-10 w-80"
              />
            </div>
            <select className="px-3 py-2 border border-border rounded-md bg-background text-foreground">
              <option value="all">All Severities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={loadDriftData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </Card>

      {/* Alerts List */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Active Drift Alerts</h3>
        <div className="space-y-4">
          {driftAlerts.map((alert) => (
            <div key={alert.id} className="border border-border rounded-lg p-4 hover:bg-accent/30 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(alert.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-foreground">{alert.modelName}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(alert.severity)}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>Type: {alert.type.replace('_', ' ').toUpperCase()}</span>
                      <span>Metric: {alert.metric}</span>
                      <span>Value: {alert.value} (Threshold: {alert.threshold})</span>
                      <span>Time: {new Date(alert.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderModels = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Model Drift Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {models.filter(model => model.id !== 'all').map((model) => (
            <Card key={model.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-foreground">{model.name}</h4>
                <span className={`text-sm font-medium ${getModelStatusColor(model.status)}`}>
                  {model.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Check:</span>
                  <span className="text-foreground">2 hours ago</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Drift Score:</span>
                  <span className="text-foreground">0.45</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Data Points:</span>
                  <span className="text-foreground">1.2M</span>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Settings className="h-3 w-3 mr-1" />
                  Configure
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderAnalysis = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Drift Analysis Report</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-foreground mb-3">Feature Importance in Drift</h4>
            <div className="space-y-3">
              {[
                { feature: 'Age Distribution', impact: 0.85, change: '+23%' },
                { feature: 'Transaction Amount', impact: 0.67, change: '+15%' },
                { feature: 'Income Range', impact: 0.45, change: '+8%' },
                { feature: 'Credit Score', impact: 0.32, change: '+5%' },
                { feature: 'Location', impact: 0.23, change: '+3%' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{item.feature}</p>
                    <p className="text-sm text-muted-foreground">Impact: {item.impact}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-red-600">{item.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-foreground mb-3">Recommended Actions</h4>
            <div className="space-y-3">
              {[
                { action: 'Retrain Customer Churn Model', priority: 'High', eta: '2 days' },
                { action: 'Update Feature Preprocessing', priority: 'Medium', eta: '1 day' },
                { action: 'Review Data Sources', priority: 'Medium', eta: '3 days' },
                { action: 'Adjust Alert Thresholds', priority: 'Low', eta: '1 hour' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{item.action}</p>
                    <p className="text-sm text-muted-foreground">ETA: {item.eta}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      item.priority === 'High' ? 'bg-red-100 text-red-800' :
                      item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {item.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Drift Detection Settings</h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-foreground mb-3">Alert Thresholds</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="highThreshold">High Severity Threshold</Label>
                <Input
                  id="highThreshold"
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  defaultValue="0.7"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="mediumThreshold">Medium Severity Threshold</Label>
                <Input
                  id="mediumThreshold"
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  defaultValue="0.5"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-3">Monitoring Frequency</h4>
            <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground">
              <option value="realtime">Real-time</option>
              <option value="hourly">Every Hour</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-3">Notification Settings</h4>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm text-foreground">Email notifications for high severity alerts</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm text-foreground">Slack notifications for critical drift</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="rounded" />
                <span className="text-sm text-foreground">SMS notifications for model failures</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <Button>Save Settings</Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'alerts': return renderAlerts();
      case 'models': return renderModels();
      case 'analysis': return renderAnalysis();
      case 'settings': return renderSettings();
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Data Drift Detection</h1>
            <p className="text-muted-foreground">Monitor and detect data drift across your ML models</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              {models.map(model => (
                <option key={model.id} value={model.id}>{model.name}</option>
              ))}
            </select>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="1d">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Card className="p-4">
          <nav className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </Card>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            <span>Loading drift data...</span>
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
};

export default DataDriftDetection;