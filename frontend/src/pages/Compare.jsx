import { useState, useEffect } from 'react';
import { experimentService } from '../services/experiments';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import ExperimentCard from '../components/ExperimentCard';
import { 
  GitCompare, 
  Target, 
  TrendingDown, 
  Calendar,
  X,
  BarChart3
} from 'lucide-react';
import { formatDate, formatNumber, getAccuracyColor, getLossColor } from '../lib/utils';
import { toast } from 'react-toastify';

const Compare = () => {
  const [experiments, setExperiments] = useState([]);
  const [selectedExperiments, setSelectedExperiments] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiments();
  }, []);

  useEffect(() => {
    if (selectedExperiments.length > 0) {
      fetchComparisonData();
    } else {
      setComparisonData([]);
    }
  }, [selectedExperiments]);

  const fetchExperiments = async () => {
    try {
      setLoading(true);
      const response = await experimentService.getExperiments({ limit: 100 });
      setExperiments(response.data);
    } catch (error) {
      toast.error('Failed to fetch experiments');
    } finally {
      setLoading(false);
    }
  };

  const fetchComparisonData = async () => {
    try {
      const response = await experimentService.getExperimentsForComparison(selectedExperiments);
      setComparisonData(response.data);
    } catch (error) {
      toast.error('Failed to fetch comparison data');
    }
  };

  const handleSelectExperiment = (experimentId) => {
    setSelectedExperiments(prev => {
      if (prev.includes(experimentId)) {
        return prev.filter(id => id !== experimentId);
      } else if (prev.length < 4) {
        return [...prev, experimentId];
      } else {
        toast.warning('You can compare up to 4 experiments at once');
        return prev;
      }
    });
  };

  const handleRemoveFromComparison = (experimentId) => {
    setSelectedExperiments(prev => prev.filter(id => id !== experimentId));
  };

  const clearSelection = () => {
    setSelectedExperiments([]);
    setComparisonData([]);
  };

  const getBestMetric = (experiments, metric) => {
    if (experiments.length === 0) return null;
    
    if (metric === 'accuracy') {
      return Math.max(...experiments.map(exp => exp.accuracy));
    } else if (metric === 'loss') {
      return Math.min(...experiments.map(exp => exp.loss));
    }
  };

  const isWinner = (experiment, metric) => {
    const bestValue = getBestMetric(comparisonData, metric);
    if (metric === 'accuracy') {
      return experiment.accuracy === bestValue;
    } else if (metric === 'loss') {
      return experiment.loss === bestValue;
    }
    return false;
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <GitCompare className="h-8 w-8 mr-3 text-primary" />
            Compare Experiments
          </h1>
          <p className="text-muted-foreground">
            Select up to 4 experiments to compare their performance side by side
          </p>
        </div>
        
        {selectedExperiments.length > 0 && (
          <Button variant="outline" onClick={clearSelection}>
            Clear Selection
          </Button>
        )}
      </div>

      {/* Selection Status */}
      {selectedExperiments.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">
              Selected for Comparison ({selectedExperiments.length}/4)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {comparisonData.map((exp) => (
                <Badge
                  key={exp._id}
                  variant="secondary"
                  className="flex items-center gap-2 px-3 py-2"
                >
                  {exp.modelName}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => handleRemoveFromComparison(exp._id)}
                  />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comparison Table */}
      {comparisonData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Comparison Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Metric</th>
                    {comparisonData.map((exp) => (
                      <th key={exp._id} className="text-left p-4 font-medium min-w-[200px]">
                        <div className="space-y-1">
                          <p className="font-semibold truncate">{exp.modelName}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(exp.createdAt)}
                          </p>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-medium flex items-center">
                      <Target className="h-4 w-4 mr-2" />
                      Accuracy (%)
                    </td>
                    {comparisonData.map((exp) => (
                      <td key={exp._id} className="p-4">
                        <div className={`font-semibold ${getAccuracyColor(exp.accuracy)} ${
                          isWinner(exp, 'accuracy') ? 'text-green-600 dark:text-green-400' : ''
                        }`}>
                          {formatNumber(exp.accuracy)}%
                          {isWinner(exp, 'accuracy') && (
                            <Badge className="ml-2 text-xs bg-green-600">Best</Badge>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                  
                  <tr className="border-b">
                    <td className="p-4 font-medium flex items-center">
                      <TrendingDown className="h-4 w-4 mr-2" />
                      Loss
                    </td>
                    {comparisonData.map((exp) => (
                      <td key={exp._id} className="p-4">
                        <div className={`font-semibold ${getLossColor(exp.loss)} ${
                          isWinner(exp, 'loss') ? 'text-green-600 dark:text-green-400' : ''
                        }`}>
                          {formatNumber(exp.loss)}
                          {isWinner(exp, 'loss') && (
                            <Badge className="ml-2 text-xs bg-green-600">Best</Badge>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>

                  <tr className="border-b">
                    <td className="p-4 font-medium flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Created
                    </td>
                    {comparisonData.map((exp) => (
                      <td key={exp._id} className="p-4 text-sm">
                        {formatDate(exp.createdAt)}
                      </td>
                    ))}
                  </tr>

                  <tr className="border-b">
                    <td className="p-4 font-medium">Versions</td>
                    {comparisonData.map((exp) => (
                      <td key={exp._id} className="p-4 text-sm">
                        {exp.versions ? exp.versions.length + 1 : 1}
                      </td>
                    ))}
                  </tr>

                  <tr className="border-b">
                    <td className="p-4 font-medium">Tags</td>
                    {comparisonData.map((exp) => (
                      <td key={exp._id} className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {exp.tags && exp.tags.length > 0 ? (
                            exp.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">No tags</span>
                          )}
                          {exp.tags && exp.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{exp.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-4 font-medium">Notes</td>
                    {comparisonData.map((exp) => (
                      <td key={exp._id} className="p-4">
                        <div className="text-sm max-w-xs">
                          {exp.notes ? (
                            <p className="line-clamp-3">{exp.notes}</p>
                          ) : (
                            <span className="text-muted-foreground">No notes</span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Experiment Selection Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          Select Experiments to Compare
        </h2>

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
                onSelect={handleSelectExperiment}
                isSelected={selectedExperiments.includes(experiment._id)}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <GitCompare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No experiments found</h3>
              <p className="text-muted-foreground">
                Create some experiments first to compare them
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Compare;