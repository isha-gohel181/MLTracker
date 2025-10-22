import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { activityService } from '../services/activity';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  Activity as ActivityIcon, 
  Calendar,
  Clock,
  Search,
  Filter,
  TrendingUp,
  Target,
  Brain,
  GitBranch,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  Eye,
  Edit,
  Share2,
  Download,
  Loader2,
  RefreshCw,
  Award
} from 'lucide-react';

const Activity = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState('week');
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState([]);
  const [breakdown, setBreakdown] = useState([]);
  const [trends, setTrends] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Load data on component mount and when filters change
  useEffect(() => {
    loadActivityData();
  }, []);

  useEffect(() => {
    loadActivities();
  }, [searchTerm, filterType, dateRange, currentPage]);

  const loadActivityData = async () => {
    try {
      setLoading(true);
      const [statsResponse, breakdownResponse, trendsResponse] = await Promise.all([
        activityService.getActivityStats(),
        activityService.getActivityBreakdown(dateRange),
        activityService.getActivityTrends()
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      if (breakdownResponse.success) {
        setBreakdown(breakdownResponse.data);
      }

      if (trendsResponse.success) {
        setTrends(trendsResponse.data);
      }

      // Load initial activities
      await loadActivities();
    } catch (error) {
      console.error('Error loading activity data:', error);
      // Set fallback data
      setStats([
        { label: 'Total Activities', value: 0, icon: 'ActivityIcon', color: 'text-blue-600' },
        { label: 'Experiments Run', value: 0, icon: 'Target', color: 'text-green-600' },
        { label: 'Models Shared', value: 0, icon: 'Share2', color: 'text-purple-600' },
        { label: 'This Week', value: 0, icon: 'TrendingUp', color: 'text-orange-600' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadActivities = async (page = 1, append = false) => {
    try {
      if (!append) setLoading(true);
      
      const response = await activityService.getActivities({
        search: searchTerm,
        type: filterType,
        dateRange: dateRange,
        page: page,
        limit: 20
      });

      if (response.success) {
        const newActivities = response.data.activities || [];
        
        if (append) {
          setActivities(prev => [...prev, ...newActivities]);
        } else {
          setActivities(newActivities);
        }

        setCurrentPage(response.data.currentPage || 1);
        setTotalPages(response.data.totalPages || 1);
        setHasMore(response.data.hasMore || false);
      }
    } catch (error) {
      console.error('Error loading activities:', error);
      if (!append) {
        setActivities([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setCurrentPage(1);
    await loadActivityData();
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      loadActivities(currentPage + 1, true);
    }
  };

  const handleActivityView = async (activityId) => {
    try {
      await activityService.markAsViewed(activityId);
      // Optionally update the activity in the local state
    } catch (error) {
      console.error('Error marking activity as viewed:', error);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'experiment_created':
        return <Target className="h-4 w-4 text-blue-600" />;
      case 'experiment_completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'experiment_failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'experiment_viewed':
        return <Eye className="h-4 w-4 text-gray-600" />;
      case 'experiment_edited':
        return <Edit className="h-4 w-4 text-orange-600" />;
      case 'model_shared':
        return <Share2 className="h-4 w-4 text-purple-600" />;
      case 'model_deployed':
        return <Play className="h-4 w-4 text-green-600" />;
      case 'data_uploaded':
        return <Download className="h-4 w-4 text-blue-600" />;
      default:
        return <ActivityIcon className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      running: { color: 'bg-blue-100 text-blue-800', text: 'Running' },
      completed: { color: 'bg-green-100 text-green-800', text: 'Completed' },
      failed: { color: 'bg-red-100 text-red-800', text: 'Failed' },
      shared: { color: 'bg-purple-100 text-purple-800', text: 'Shared' },
      deployed: { color: 'bg-green-100 text-green-800', text: 'Deployed' },
      viewed: { color: 'bg-gray-100 text-gray-800', text: 'Viewed' },
      modified: { color: 'bg-orange-100 text-orange-800', text: 'Modified' }
    };

    const config = statusConfig[status] || statusConfig.viewed;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const formatTimeAgo = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  // Convert icon strings to actual icons
  const getIconComponent = (iconName) => {
    const iconMap = {
      'ActivityIcon': ActivityIcon,
      'Target': Target,
      'Share2': Share2,
      'TrendingUp': TrendingUp,
      'Award': Award,
      // Handle direct component references too
      ActivityIcon: ActivityIcon,
      Target: Target,
      Share2: Share2,
      TrendingUp: TrendingUp,
      Award: Award
    };
    return iconMap[iconName] || ActivityIcon;
  };

  const displayStats = stats.map(stat => ({
    ...stat,
    icon: getIconComponent(stat.icon) || ActivityIcon
  }));

  if (loading && activities.length === 0) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading activities...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Activity</h1>
            <p className="text-muted-foreground">Track your experiments, models, and project activities</p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value || 0}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Filters and Search */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="all">All Activities</option>
                <option value="experiment">Experiments</option>
                <option value="model">Models</option>
                <option value="data">Data</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="day">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Activity Timeline */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">Recent Activity</h2>
          
          {activities.length === 0 ? (
            <div className="text-center py-12">
              <ActivityIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No activities found</h3>
              <p className="text-muted-foreground">
                {searchTerm || filterType !== 'all' ? 
                  'Try adjusting your search or filter criteria' : 
                  'Start creating experiments to see your activity here'
                }
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 border border-border rounded-lg hover:bg-accent/30 transition-colors">
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-sm font-medium text-foreground">{activity.title}</h3>
                          {getStatusBadge(activity.status)}
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{formatTimeAgo(activity.timestamp)}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                      
                      {/* Metadata */}
                      {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {Object.entries(activity.metadata).map(([key, value]) => (
                            <span key={key} className="text-xs bg-muted px-2 py-1 rounded">
                              <span className="font-medium">{key}:</span> {Array.isArray(value) ? value.join(', ') : value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-shrink-0">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleActivityView(activity.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center mt-6">
                  <Button
                    onClick={handleLoadMore}
                    disabled={loading}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <span>Load More</span>
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </Card>

        {/* Activity Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Types */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Activity Breakdown</h3>
            <div className="space-y-3">
              {breakdown.length > 0 ? breakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${item.color || 'bg-blue-500'}`}></div>
                    <span className="text-sm text-foreground">{item.type}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{item.count}</span>
                </div>
              )) : (
                <div className="text-center py-4">
                  <span className="text-sm text-muted-foreground">No data available</span>
                </div>
              )}
            </div>
          </Card>

          {/* Recent Trends */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Trends</h3>
            <div className="space-y-4">
              {Object.keys(trends).length > 0 ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Most Active Day</span>
                    <span className="text-sm font-medium text-foreground">{trends.mostActiveDay || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Peak Activity Time</span>
                    <span className="text-sm font-medium text-foreground">{trends.peakTime || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Avg. Experiments/Day</span>
                    <span className="text-sm font-medium text-foreground">{trends.avgExperimentsPerDay || '0'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Success Rate</span>
                    <span className={`text-sm font-medium ${(trends.successRate >= 80) ? 'text-green-600' : (trends.successRate >= 60) ? 'text-yellow-600' : 'text-red-600'}`}>
                      {trends.successRate ? `${trends.successRate}%` : 'N/A'}
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <span className="text-sm text-muted-foreground">No trend data available</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Activity;