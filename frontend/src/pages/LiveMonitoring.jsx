import { useState, useEffect, useRef } from 'react';
import { experimentService } from '../services/experiments';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  TrendingDown,
  Zap,
  Wifi,
  WifiOff,
  Bell,
  BellOff,
  Pause,
  Play,
  RefreshCw
} from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { formatDateTime, formatNumber } from '../lib/utils';
import { toast } from 'react-toastify';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LiveMonitoring = () => {
  const [isLive, setIsLive] = useState(true);
  const [experiments, setExperiments] = useState([]);
  const [liveMetrics, setLiveMetrics] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchInitialData();
    if (isLive) {
      startLiveUpdates();
    }
    return () => stopLiveUpdates();
  }, [isLive]);

  const fetchInitialData = async () => {
    try {
      const response = await experimentService.getExperiments({ limit: 20 });
      setExperiments(response.data);
      generateMockLiveMetrics(response.data);
    } catch (error) {
      toast.error('Failed to fetch monitoring data');
    }
  };

  const generateMockLiveMetrics = (experimentsData) => {
    const metrics = {};
    experimentsData.forEach(exp => {
      metrics[exp._id] = {
        status: Math.random() > 0.8 ? 'training' : Math.random() > 0.6 ? 'validating' : 'idle',
        currentEpoch: Math.floor(Math.random() * 100),
        totalEpochs: 100,
        eta: Math.floor(Math.random() * 3600), // seconds
        gpuUsage: Math.floor(Math.random() * 100),
        memoryUsage: Math.floor(Math.random() * 100),
        liveAccuracy: exp.accuracy + (Math.random() - 0.5) * 2,
        liveLoss: exp.loss + (Math.random() - 0.5) * 0.1,
        lastUpdate: new Date(),
        dataPoints: generateDataPoints()
      };
    });
    setLiveMetrics(metrics);
  };

  const generateDataPoints = () => {
    return Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (19 - i) * 30000), // 30 second intervals
      accuracy: 85 + Math.random() * 10,
      loss: 0.1 + Math.random() * 0.3
    }));
  };

  const startLiveUpdates = () => {
    intervalRef.current = setInterval(() => {
      updateLiveMetrics();
      checkForAlerts();
    }, 5000); // Update every 5 seconds
  };

  const stopLiveUpdates = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const updateLiveMetrics = () => {
    setLiveMetrics(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(expId => {
        const metric = updated[expId];
        if (metric.status === 'training') {
          // Simulate training progress
          metric.currentEpoch = Math.min(metric.currentEpoch + 1, metric.totalEpochs);
          metric.liveAccuracy += (Math.random() - 0.5) * 0.5;
          metric.liveLoss = Math.max(0.01, metric.liveLoss + (Math.random() - 0.7) * 0.02);
          metric.gpuUsage = 80 + Math.random() * 20;
          metric.memoryUsage = 70 + Math.random() * 25;
          
          // Update data points
          const newPoint = {
            time: new Date(),
            accuracy: metric.liveAccuracy,
            loss: metric.liveLoss
          };
          metric.dataPoints = [...metric.dataPoints.slice(1), newPoint];
        }
        metric.lastUpdate = new Date();
      });
      return updated;
    });
    setConnectionStatus('connected');
  };

  const checkForAlerts = () => {
    const newAlerts = [];
    Object.entries(liveMetrics).forEach(([expId, metrics]) => {
      const exp = experiments.find(e => e._id === expId);
      if (!exp) return;

      // High memory usage alert
      if (metrics.memoryUsage > 90) {
        newAlerts.push({
          id: `memory-${expId}`,
          type: 'warning',
          experiment: exp.modelName,
          message: `High memory usage: ${metrics.memoryUsage}%`,
          timestamp: new Date()
        });
      }

      // Performance degradation alert
      if (metrics.status === 'training' && metrics.liveAccuracy < exp.accuracy - 5) {
        newAlerts.push({
          id: `perf-${expId}`,
          type: 'error',
          experiment: exp.modelName,
          message: `Performance degradation detected`,
          timestamp: new Date()
        });
      }

      // Training completion alert
      if (metrics.currentEpoch >= metrics.totalEpochs) {
        newAlerts.push({
          id: `complete-${expId}`,
          type: 'success',
          experiment: exp.modelName,
          message: `Training completed successfully`,
          timestamp: new Date()
        });
      }
    });

    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev].slice(0, 10));
      if (notificationsEnabled) {
        newAlerts.forEach(alert => {
          toast[alert.type === 'error' ? 'error' : alert.type === 'warning' ? 'warning' : 'success'](
            `${alert.experiment}: ${alert.message}`
          );
        });
      }
    }
  };

  const toggleLiveUpdates = () => {
    setIsLive(!isLive);
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'training': return 'bg-green-500';
      case 'validating': return 'bg-yellow-500';
      case 'idle': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getChartData = (dataPoints) => ({
    labels: dataPoints.map(p => p.time.toLocaleTimeString()),
    datasets: [
      {
        label: 'Accuracy',
        data: dataPoints.map(p => p.accuracy),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
      },
      {
        label: 'Loss',
        data: dataPoints.map(p => p.loss * 100), // Scale for visibility
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.1,
        yAxisID: 'y1',
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        title: { display: true, text: 'Accuracy (%)' }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: { display: true, text: 'Loss (scaled)' },
        grid: { drawOnChartArea: false },
      },
    },
    plugins: {
      legend: { position: 'top' },
    },
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Live Monitoring</h1>
          <p className="text-muted-foreground flex items-center">
            {connectionStatus === 'connected' ? (
              <>
                <Wifi className="h-4 w-4 mr-1 text-green-500" />
                Real-time monitoring active
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 mr-1 text-red-500" />
                Connection lost
              </>
            )}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={toggleNotifications}
            className={notificationsEnabled ? 'text-blue-600' : ''}
          >
            {notificationsEnabled ? <Bell className="h-4 w-4 mr-2" /> : <BellOff className="h-4 w-4 mr-2" />}
            Alerts
          </Button>
          <Button
            variant={isLive ? "default" : "outline"}
            onClick={toggleLiveUpdates}
          >
            {isLive ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause Live Updates
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Resume Live Updates
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
              Recent Alerts ({alerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-2 bg-muted rounded">
                  <div className="flex items-center space-x-2">
                    {getAlertIcon(alert.type)}
                    <span className="font-medium">{alert.experiment}</span>
                    <span className="text-sm text-muted-foreground">{alert.message}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDateTime(alert.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Live Experiments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {experiments.filter(exp => liveMetrics[exp._id]).map((experiment) => {
          const metrics = liveMetrics[experiment._id];
          if (!metrics) return null;

          return (
            <Card key={experiment._id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(metrics.status)}`} />
                    {experiment.modelName}
                  </CardTitle>
                  <Badge variant={metrics.status === 'training' ? 'default' : 'secondary'}>
                    {metrics.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Progress */}
                {metrics.status === 'training' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{metrics.currentEpoch}/{metrics.totalEpochs} epochs</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(metrics.currentEpoch / metrics.totalEpochs) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Live Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {formatNumber(metrics.liveAccuracy)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Live Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {formatNumber(metrics.liveLoss)}
                    </div>
                    <div className="text-sm text-muted-foreground">Live Loss</div>
                  </div>
                </div>

                {/* Resource Usage */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>GPU Usage</span>
                      <span>{metrics.gpuUsage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          metrics.gpuUsage > 90 ? 'bg-red-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${metrics.gpuUsage}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Memory</span>
                      <span>{metrics.memoryUsage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          metrics.memoryUsage > 90 ? 'bg-red-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${metrics.memoryUsage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Mini Chart */}
                <div className="h-32">
                  <Line 
                    key={`live-${experiment._id}-${metrics.lastUpdate?.getTime()}`}
                    data={getChartData(metrics.dataPoints)} 
                    options={chartOptions} 
                  />
                </div>

                {/* Last Update */}
                <div className="text-xs text-muted-foreground flex items-center justify-between">
                  <span>Last update: {formatDateTime(metrics.lastUpdate)}</span>
                  {isLive && <RefreshCw className="h-3 w-3 animate-spin" />}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {experiments.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Active Experiments</h3>
            <p className="text-muted-foreground">
              Start some experiments to see live monitoring data
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LiveMonitoring;