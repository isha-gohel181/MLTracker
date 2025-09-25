import { useState, useEffect } from 'react';
import { experimentService } from '../services/experiments';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  TrendingDown,
  Beaker,
  Calendar,
  Tag
} from 'lucide-react';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { formatNumber } from '../lib/utils';
import { toast } from 'react-toastify';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsResponse, experimentsResponse] = await Promise.all([
        experimentService.getExperimentStats(),
        experimentService.getExperiments({ limit: 100 })
      ]);
      
      setStats(statsResponse.data);
      setExperiments(experimentsResponse.data);
    } catch (error) {
      toast.error('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  const getTagsChartData = () => {
    if (!stats?.topTags || stats.topTags.length === 0) return null;

    const colors = [
      'rgba(59, 130, 246, 0.8)',
      'rgba(16, 185, 129, 0.8)',
      'rgba(245, 101, 101, 0.8)',
      'rgba(251, 191, 36, 0.8)',
      'rgba(139, 92, 246, 0.8)',
      'rgba(236, 72, 153, 0.8)',
      'rgba(20, 184, 166, 0.8)',
      'rgba(239, 68, 68, 0.8)',
    ];

    return {
      labels: stats.topTags.map(tag => tag._id),
      datasets: [
        {
          data: stats.topTags.map(tag => tag.count),
          backgroundColor: colors.slice(0, stats.topTags.length),
          borderColor: colors.slice(0, stats.topTags.length).map(color => color.replace('0.8', '1')),
          borderWidth: 2,
        },
      ],
    };
  };

  const getAccuracyDistributionData = () => {
    if (experiments.length === 0) return null;

    const ranges = {
      '90-100%': 0,
      '80-89%': 0,
      '70-79%': 0,
      '60-69%': 0,
      'Below 60%': 0,
    };

    experiments.forEach(exp => {
      const accuracy = exp.accuracy;
      if (accuracy >= 90) ranges['90-100%']++;
      else if (accuracy >= 80) ranges['80-89%']++;
      else if (accuracy >= 70) ranges['70-79%']++;
      else if (accuracy >= 60) ranges['60-69%']++;
      else ranges['Below 60%']++;
    });

    return {
      labels: Object.keys(ranges),
      datasets: [
        {
          label: 'Number of Experiments',
          data: Object.values(ranges),
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(251, 191, 36, 0.8)',
            'rgba(245, 101, 101, 0.8)',
            'rgba(239, 68, 68, 0.8)',
          ],
          borderColor: [
            'rgb(34, 197, 94)',
            'rgb(59, 130, 246)',
            'rgb(251, 191, 36)',
            'rgb(245, 101, 101)',
            'rgb(239, 68, 68)',
          ],
          borderWidth: 2,
        },
      ],
    };
  };

  const getTimelineData = () => {
    if (experiments.length === 0) return null;

    // Group experiments by month
    const monthlyData = {};
    experiments.forEach(exp => {
      const date = new Date(exp.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
    });

    const sortedMonths = Object.keys(monthlyData).sort();
    
    return {
      labels: sortedMonths.map(month => {
        const [year, monthNum] = month.split('-');
        return new Date(year, monthNum - 1).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short' 
        });
      }),
      datasets: [
        {
          label: 'Experiments Created',
          data: sortedMonths.map(month => monthlyData[month]),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const tagsData = getTagsChartData();
  const accuracyData = getAccuracyDistributionData();
  const timelineData = getTimelineData();

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center">
          <BarChart3 className="h-8 w-8 mr-3 text-primary" />
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground">
          Insights and trends from your ML experiments
        </p>
      </div>

      {/* Overview Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Experiments</CardTitle>
              <Beaker className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overview.totalExperiments}</div>
              <p className="text-xs text-muted-foreground">
                All time experiments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Accuracy</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatNumber(stats.overview.avgAccuracy)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Across all experiments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Accuracy</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatNumber(stats.overview.maxAccuracy)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Personal best
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lowest Loss</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatNumber(stats.overview.minLoss)}
              </div>
              <p className="text-xs text-muted-foreground">
                Best loss achieved
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tags Distribution */}
        {tagsData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                Popular Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Doughnut data={tagsData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Accuracy Distribution */}
        {accuracyData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Accuracy Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Bar data={accuracyData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Timeline */}
        {timelineData && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Experiment Creation Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Line data={timelineData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Insights */}
      {experiments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm">Most productive month</span>
                <span className="font-semibold">
                  {(() => {
                    const monthCounts = {};
                    experiments.forEach(exp => {
                      const month = new Date(exp.createdAt).toLocaleDateString('en-US', { month: 'long' });
                      monthCounts[month] = (monthCounts[month] || 0) + 1;
                    });
                    return Object.entries(monthCounts).reduce((a, b) => monthCounts[a[1]] > monthCounts[b[1]] ? a : b)[0];
                  })()}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm">Experiments with 90%+ accuracy</span>
                <span className="font-semibold text-green-600">
                  {experiments.filter(exp => exp.accuracy >= 90).length}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm">Average versions per experiment</span>
                <span className="font-semibold">
                  {formatNumber(
                    experiments.reduce((sum, exp) => sum + (exp.versions?.length || 0) + 1, 0) / experiments.length
                  )}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {experiments
                  .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                  .slice(0, 5)
                  .map((exp) => (
                    <div key={exp._id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm truncate max-w-[200px]">
                          {exp.modelName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(exp.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {formatNumber(exp.accuracy)}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Loss: {formatNumber(exp.loss)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Analytics;