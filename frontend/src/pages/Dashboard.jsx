import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { experimentService } from '../services/experiments';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import ExperimentCard from '../components/ExperimentCard';
import ExperimentForm from '../components/ExperimentForm';
import { 
  Plus, 
  Search, 
  Filter, 
  TrendingUp, 
  Target, 
  TrendingDown,
  Beaker,
  RefreshCw
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { toast } from 'react-toastify';
import { formatNumber } from '../lib/utils';

const Dashboard = () => {
  const [experiments, setExperiments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [editingExperiment, setEditingExperiment] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    fetchExperiments();
    fetchStats();
  }, [searchTerm, selectedTags, sortBy, sortOrder]);

  const fetchExperiments = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        tags: selectedTags === 'all' ? '' : selectedTags,
        sortBy,
        sortOrder,
        limit: 50
      };

      const response = await experimentService.getExperiments(params);
      setExperiments(response.data);
      
      // Extract unique tags
      const tags = new Set();
      response.data.forEach(exp => {
        exp.tags?.forEach(tag => tags.add(tag));
      });
      setAvailableTags(Array.from(tags));
      
    } catch (error) {
      toast.error('Failed to fetch experiments');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await experimentService.getExperimentStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this experiment?')) return;
    
    try {
      await experimentService.deleteExperiment(id);
      toast.success('Experiment deleted successfully');
      fetchExperiments();
      fetchStats();
    } catch (error) {
      toast.error('Failed to delete experiment');
    }
  };

  const handleEdit = (experiment) => {
    setEditingExperiment(experiment);
    setShowForm(true);
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editingExperiment) {
        await experimentService.updateExperiment(editingExperiment._id, data);
        toast.success('Experiment updated successfully');
      } else {
        await experimentService.createExperiment(data);
        toast.success('Experiment created successfully');
      }
      
      setShowForm(false);
      setEditingExperiment(null);
      fetchExperiments();
      fetchStats();
    } catch (error) {
      toast.error(`Failed to ${editingExperiment ? 'update' : 'create'} experiment`);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingExperiment(null);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Track and manage your ML experiments
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          New Experiment
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Experiments</CardTitle>
              <Beaker className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overview.totalExperiments}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Accuracy</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(stats.overview.avgAccuracy)}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Loss</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(stats.overview.avgLoss)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Accuracy</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(stats.overview.maxAccuracy)}%
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search experiments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedTags} onValueChange={setSelectedTags}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All tags</SelectItem>
                {availableTags
                  .filter(tag => typeof tag === 'string' && tag.trim() !== '')
                  .map(tag => {
                    const cleanTag = tag.trim();
                    return (
                      <SelectItem key={cleanTag} value={cleanTag}>
                        {cleanTag}
                      </SelectItem>
                    );
                  })}
              </SelectContent>
            </Select> 

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Date Created</SelectItem>
                <SelectItem value="accuracy">Accuracy</SelectItem>
                <SelectItem value="loss">Loss</SelectItem>
                <SelectItem value="modelName">Model Name</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger>
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchExperiments}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            
            {stats?.topTags && stats.topTags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">Top tags:</span>
                {stats.topTags.slice(0, 3).map(tag => (
                  <Badge
                    key={tag._id}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => setSelectedTags(tag._id)}
                  >
                    {tag._id} ({tag.count})
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Experiments Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Experiments ({experiments.length})
          </h2>
          <Link to="/experiments/compare">
            <Button variant="outline">
              Compare Experiments
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : experiments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {experiments.map((experiment) => (
              <ExperimentCard
                key={experiment._id}
                experiment={experiment}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Beaker className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No experiments found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || (selectedTags && selectedTags !== 'all')
                  ? 'Try adjusting your filters or search terms'
                  : 'Get started by creating your first experiment'
                }
              </p>
              {!searchTerm && (!selectedTags || selectedTags === 'all') && (
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Experiment
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Experiment Form Modal */}
      {showForm && (
        <ExperimentForm
          experiment={editingExperiment}
          onSubmit={handleFormSubmit}
          onClose={handleFormClose}
          availableTags={availableTags}
        />
      )}
    </div>
  );
};

export default Dashboard;