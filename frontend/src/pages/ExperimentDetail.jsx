import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { experimentService } from '../services/experiments';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import ExperimentForm from '../components/ExperimentForm';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar,
  Target,
  TrendingDown,
  History,
  BarChart3,
  Brain,
  Loader2
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
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
import { formatDate, formatDateTime, formatNumber, getAccuracyColor, getLossColor } from '../lib/utils';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ExperimentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [experiment, setExperiment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [insights, setInsights] = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(false);

  useEffect(() => {
    fetchExperiment();
  }, [id]);

  const fetchExperiment = async () => {
    try {
      setLoading(true);
      const response = await experimentService.getExperiment(id);
      setExperiment(response.data);
    } catch (error) {
      toast.error('Failed to fetch experiment details');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchInsights = async () => {
    try {
      setInsightsLoading(true);
      const response = await experimentService.getExperimentInsights(id);
      setInsights(response.data);
    } catch (error) {
      toast.error('Failed to generate AI insights');
    } finally {
      setInsightsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this experiment?')) return;
    
    try {
      await experimentService.deleteExperiment(id);
      toast.success('Experiment deleted successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to delete experiment');
    }
  };

  const handleUpdate = async (data) => {
    try {
      await experimentService.updateExperiment(id, data);
      toast.success('Experiment updated successfully');
      setShowEditForm(false);
      fetchExperiment();
    } catch (error) {
      toast.error('Failed to update experiment');
    }
  };

  const getChartData = () => {
    if (!experiment || !experiment.versions || experiment.versions.length === 0) {
      return null;
    }

    const allVersions = [...experiment.versions, {
      accuracy: experiment.accuracy,
      loss: experiment.loss,
      updatedAt: experiment.updatedAt
    }];

    const labels = allVersions.map((version, index) => 
      `v${index + 1} (${formatDate(version.updatedAt)})`
    );

    return {
      labels,
      datasets: [
        {
          label: 'Accuracy (%)',
          data: allVersions.map(v => v.accuracy),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          yAxisID: 'y',
        },
        {
          label: 'Loss',
          data: allVersions.map(v => v.loss),
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          yAxisID: 'y1',
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Versions'
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Accuracy (%)'
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Loss'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Accuracy & Loss Trend Across Versions'
      },
    },
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!experiment) {
    return (
      <div className="container mx-auto px-4 py-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Experiment Not Found</h1>
        <Link to="/dashboard">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const chartData = getChartData();

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{experiment.modelName}</h1>
            <p className="text-muted-foreground flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Created {formatDate(experiment.createdAt)}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowEditForm(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getAccuracyColor(experiment.accuracy)}`}>
              {formatNumber(experiment.accuracy)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loss</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getLossColor(experiment.loss)}`}>
              {formatNumber(experiment.loss)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Versions</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {experiment.versions ? experiment.versions.length + 1 : 1}
            </div>
            <p className="text-xs text-muted-foreground">
              Last updated {formatDate(experiment.updatedAt)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          {chartData && <TabsTrigger value="trends">Trends</TabsTrigger>}
          {experiment.versions && experiment.versions.length > 0 && (
            <TabsTrigger value="history">Version History</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Details */}
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Model Name</h4>
                  <p className="font-medium">{experiment.modelName}</p>
                </div>
                
                {experiment.notes && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Notes</h4>
                    <p className="text-sm">{experiment.notes}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Created</h4>
                  <p className="text-sm">{formatDateTime(experiment.createdAt)}</p>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Last Updated</h4>
                  <p className="text-sm">{formatDateTime(experiment.updatedAt)}</p>
                </div>

                {experiment.user && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Created By</h4>
                    <p className="text-sm">{experiment.user.username}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                {experiment.tags && experiment.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {experiment.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No tags added</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  AI-Powered Insights
                </span>
                <Button 
                  onClick={fetchInsights} 
                  disabled={insightsLoading}
                  variant="outline"
                >
                  {insightsLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Generate Insights
                    </>
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {insights ? (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown
                        components={{
                          h1: ({ children }) => (
                            <h1 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-3 flex items-center">
                              <Brain className="h-5 w-5 mr-2 text-blue-600" />
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2 mt-4">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-md font-medium text-blue-700 dark:text-blue-300 mb-2 mt-3">
                              {children}
                            </h3>
                          ),
                          p: ({ children }) => (
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                              {children}
                            </p>
                          ),
                          ul: ({ children }) => (
                            <ul className="space-y-2 mb-4">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="space-y-2 mb-4 list-decimal list-inside">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="flex items-start">
                              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                              <span className="text-gray-700 dark:text-gray-300">{children}</span>
                            </li>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-semibold text-blue-900 dark:text-blue-100 bg-blue-100 dark:bg-blue-900/30 px-1 py-0.5 rounded">
                              {children}
                            </strong>
                          ),
                          code: ({ children }) => (
                            <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-sm font-mono">
                              {children}
                            </code>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-blue-400 pl-4 italic text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-950/20 py-2 rounded-r">
                              {children}
                            </blockquote>
                          )
                        }}
                      >
                        {insights.insights}
                      </ReactMarkdown>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                    <div className="flex items-center">
                      <Brain className="h-4 w-4 mr-2 text-blue-500" />
                      <span>AI-Generated Analysis</span>
                    </div>
                    <span>Generated on {formatDateTime(insights.generatedAt)}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <Brain className="h-12 w-12 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                    Unlock AI-Powered Insights
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    Get intelligent analysis, performance recommendations, and actionable insights 
                    for your machine learning experiment using advanced AI.
                  </p>
                  <Button 
                    onClick={fetchInsights} 
                    disabled={insightsLoading}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2"
                    size="lg"
                  >
                    {insightsLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Analyzing Your Experiment...
                      </>
                    ) : (
                      <>
                        <Brain className="h-5 w-5 mr-2" />
                        Generate AI Insights
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {chartData && (
          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {experiment.versions && experiment.versions.length > 0 && (
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="h-5 w-5 mr-2" />
                  Version History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Current Version */}
                  <div className="border rounded-lg p-4 bg-primary/5">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Current Version</h4>
                      <Badge>Current</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Accuracy:</span>
                        <p className={`font-medium ${getAccuracyColor(experiment.accuracy)}`}>
                          {formatNumber(experiment.accuracy)}%
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Loss:</span>
                        <p className={`font-medium ${getLossColor(experiment.loss)}`}>
                          {formatNumber(experiment.loss)}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Updated:</span>
                        <p className="font-medium">{formatDateTime(experiment.updatedAt)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Previous Versions */}
                  {experiment.versions.map((version, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">Version {experiment.versions.length - index}</h4>
                        <Badge variant="outline">Historical</Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Accuracy:</span>
                          <p className={`font-medium ${getAccuracyColor(version.accuracy)}`}>
                            {formatNumber(version.accuracy)}%
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Loss:</span>
                          <p className={`font-medium ${getLossColor(version.loss)}`}>
                            {formatNumber(version.loss)}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Updated:</span>
                          <p className="font-medium">{formatDateTime(version.updatedAt)}</p>
                        </div>
                      </div>
                      {version.notes && (
                        <div className="mt-2">
                          <span className="text-muted-foreground text-sm">Notes:</span>
                          <p className="text-sm mt-1">{version.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Edit Form Modal */}
      {showEditForm && (
        <ExperimentForm
          experiment={experiment}
          onSubmit={handleUpdate}
          onClose={() => setShowEditForm(false)}
        />
      )}
    </div>
  );
};

export default ExperimentDetail;