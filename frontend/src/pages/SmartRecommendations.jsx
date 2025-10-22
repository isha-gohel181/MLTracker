import { useState, useEffect } from 'react';
import { experimentService } from '../services/experiments';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Lightbulb, 
  TrendingUp, 
  Users, 
  BookOpen,
  Star,
  ThumbsUp,
  Target,
  Zap,
  Filter,
  Sparkles,
  Brain,
  Clock,
  CheckCircle,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { formatDate, formatNumber } from '../lib/utils';
import { toast } from 'react-toastify';

const SmartRecommendations = () => {
  const [experiments, setExperiments] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await experimentService.getExperiments({ limit: 100 });
      setExperiments(response.data);
      generateRecommendations(response.data);
    } catch (error) {
      toast.error('Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = (experimentsData) => {
    const recs = [
      ...generateSimilarExperiments(experimentsData),
      ...generateOptimizationTips(experimentsData),
      ...generateBestPractices(experimentsData),
      ...generateTrendingTechniques(),
      ...generateLearningResources(),
      ...generateCollaborativeRecommendations(experimentsData)
    ];

    // Sort by priority and relevance
    recs.sort((a, b) => b.priority - a.priority);
    setRecommendations(recs);
  };

  const generateSimilarExperiments = (experiments) => {
    const similar = [];
    const recentExperiments = experiments.slice(0, 5);
    
    recentExperiments.forEach(exp => {
      const potentialSimilar = experiments.filter(e => 
        e._id !== exp._id && 
        Math.abs(e.accuracy - exp.accuracy) < 5 &&
        e.tags?.some(tag => exp.tags?.includes(tag))
      ).slice(0, 2);

      if (potentialSimilar.length > 0) {
        similar.push({
          id: `similar-${exp._id}`,
          type: 'similar',
          category: 'experiments',
          title: `Experiments Similar to "${exp.modelName}"`,
          description: `Found ${potentialSimilar.length} experiments with similar performance patterns`,
          priority: 8,
          experiments: potentialSimilar,
          baseExperiment: exp,
          actionText: 'Compare Experiments',
          icon: Target,
          color: 'blue'
        });
      }
    });

    return similar;
  };

  const generateOptimizationTips = (experiments) => {
    const tips = [];
    
    // Find experiments with low accuracy
    const lowAccuracyExps = experiments.filter(exp => exp.accuracy < 80);
    if (lowAccuracyExps.length > 0) {
      tips.push({
        id: 'optimize-accuracy',
        type: 'optimization',
        category: 'performance',
        title: 'Improve Model Accuracy',
        description: `${lowAccuracyExps.length} experiments could benefit from hyperparameter tuning`,
        priority: 9,
        suggestions: [
          'Try different learning rates (0.001, 0.0001)',
          'Increase model complexity or depth',
          'Use data augmentation techniques',
          'Implement batch normalization'
        ],
        experiments: lowAccuracyExps.slice(0, 3),
        actionText: 'View Optimization Guide',
        icon: TrendingUp,
        color: 'green'
      });
    }

    // Find experiments with high loss
    const highLossExps = experiments.filter(exp => exp.loss > 0.5);
    if (highLossExps.length > 0) {
      tips.push({
        id: 'reduce-loss',
        type: 'optimization',
        category: 'performance',
        title: 'Reduce Training Loss',
        description: 'Several experiments show high loss values that could be optimized',
        priority: 7,
        suggestions: [
          'Check for overfitting with validation curves',
          'Reduce learning rate for better convergence',
          'Add regularization techniques (L1/L2, Dropout)',
          'Verify data preprocessing steps'
        ],
        experiments: highLossExps.slice(0, 3),
        actionText: 'Learn More',
        icon: Zap,
        color: 'orange'
      });
    }

    return tips;
  };

  const generateBestPractices = (experiments) => {
    const practices = [];

    // Check for version control
    const experimentsWithVersions = experiments.filter(exp => exp.versions && exp.versions.length > 0);
    if (experimentsWithVersions.length < experiments.length * 0.3) {
      practices.push({
        id: 'version-control',
        type: 'bestpractice',
        category: 'workflow',
        title: 'Implement Better Version Control',
        description: 'Most experiments lack proper version tracking for reproducibility',
        priority: 6,
        tips: [
          'Save model checkpoints at regular intervals',
          'Track hyperparameter changes between versions',
          'Document experiment rationale and results',
          'Use semantic versioning for model releases'
        ],
        actionText: 'Setup Versioning',
        icon: BookOpen,
        color: 'purple'
      });
    }

    // Check for documentation
    const undocumentedExps = experiments.filter(exp => !exp.notes || exp.notes.length < 50);
    if (undocumentedExps.length > experiments.length * 0.5) {
      practices.push({
        id: 'documentation',
        type: 'bestpractice',
        category: 'workflow',
        title: 'Improve Experiment Documentation',
        description: 'Many experiments lack detailed documentation',
        priority: 5,
        tips: [
          'Document model architecture decisions',
          'Record data preprocessing steps',
          'Note challenges and solutions found',
          'Include performance analysis insights'
        ],
        actionText: 'Documentation Guide',
        icon: BookOpen,
        color: 'indigo'
      });
    }

    return practices;
  };

  const generateTrendingTechniques = () => {
    return [
      {
        id: 'attention-mechanisms',
        type: 'trending',
        category: 'techniques',
        title: 'Attention Mechanisms & Transformers',
        description: 'Revolutionary approach showing 15-30% improvement in NLP and Vision tasks',
        priority: 8,
        benefits: [
          'Better long-range dependency modeling',
          'Improved interpretability',
          'State-of-the-art results across domains',
          'Transfer learning capabilities'
        ],
        actionText: 'Explore Transformers',
        icon: Sparkles,
        color: 'pink',
        popularity: 95,
        papers: ['Attention Is All You Need', 'BERT', 'Vision Transformer']
      },
      {
        id: 'contrastive-learning',
        type: 'trending',
        category: 'techniques',
        title: 'Self-Supervised Contrastive Learning',
        description: 'Learn powerful representations without labeled data',
        priority: 7,
        benefits: [
          'Reduced dependency on labeled data',
          'Better feature representations',
          'Improved few-shot learning',
          'Domain adaptation capabilities'
        ],
        actionText: 'Learn Contrastive Methods',
        icon: Brain,
        color: 'cyan',
        popularity: 88,
        papers: ['SimCLR', 'MoCo', 'SwAV']
      }
    ];
  };

  const generateLearningResources = () => {
    return [
      {
        id: 'ml-courses',
        type: 'learning',
        category: 'education',
        title: 'Recommended ML Courses',
        description: 'Curated learning paths based on your experiment patterns',
        priority: 4,
        resources: [
          { name: 'Deep Learning Specialization', provider: 'Coursera', rating: 4.8, duration: '4 months' },
          { name: 'CS231n: CNN for Visual Recognition', provider: 'Stanford', rating: 4.9, duration: '10 weeks' },
          { name: 'Practical Deep Learning', provider: 'fast.ai', rating: 4.7, duration: '8 weeks' }
        ],
        actionText: 'View Courses',
        icon: BookOpen,
        color: 'emerald'
      },
      {
        id: 'research-papers',
        type: 'learning',
        category: 'research',
        title: 'Must-Read Research Papers',
        description: 'Latest papers relevant to your research area',
        priority: 3,
        papers: [
          { title: 'EfficientNet: Rethinking Model Scaling', venue: 'ICML 2019', citations: 2341 },
          { title: 'BERT: Pre-training Deep Bidirectional Transformers', venue: 'NAACL 2019', citations: 8734 },
          { title: 'ResNet: Deep Residual Learning', venue: 'CVPR 2016', citations: 12567 }
        ],
        actionText: 'Read Papers',
        icon: ExternalLink,
        color: 'red'
      }
    ];
  };

  const generateCollaborativeRecommendations = (experiments) => {
    return [
      {
        id: 'team-collaboration',
        type: 'collaboration',
        category: 'team',
        title: 'Collaborate with Similar Researchers',
        description: 'Connect with team members working on related problems',
        priority: 6,
        suggestions: [
          'Share experiment templates and configurations',
          'Create shared model repositories',
          'Set up experiment review sessions',
          'Establish best practices documentation'
        ],
        actionText: 'Setup Collaboration',
        icon: Users,
        color: 'blue'
      }
    ];
  };

  const categories = [
    { value: 'all', label: 'All Recommendations', icon: Lightbulb },
    { value: 'experiments', label: 'Similar Experiments', icon: Target },
    { value: 'performance', label: 'Performance Tips', icon: TrendingUp },
    { value: 'workflow', label: 'Best Practices', icon: BookOpen },
    { value: 'techniques', label: 'Trending Techniques', icon: Sparkles },
    { value: 'education', label: 'Learning', icon: BookOpen },
    { value: 'team', label: 'Collaboration', icon: Users }
  ];

  const filteredRecommendations = selectedCategory === 'all' 
    ? recommendations 
    : recommendations.filter(rec => rec.category === selectedCategory);

  const getRecommendationIcon = (rec) => {
    const IconComponent = rec.icon;
    return <IconComponent className={`h-5 w-5 text-${rec.color}-500`} />;
  };

  const getRecommendationCard = (rec) => {
    switch (rec.type) {
      case 'similar':
        return (
          <Card key={rec.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  {getRecommendationIcon(rec)}
                  <span className="ml-2">{rec.title}</span>
                </span>
                <Badge variant="outline">{rec.experiments.length} similar</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{rec.description}</p>
              
              <div className="space-y-2">
                <h4 className="font-medium">Similar Experiments:</h4>
                {rec.experiments.map(exp => (
                  <div key={exp._id} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                    <span className="font-medium">{exp.modelName}</span>
                    <div className="text-sm text-muted-foreground">
                      {formatNumber(exp.accuracy)}% accuracy
                    </div>
                  </div>
                ))}
              </div>

              <Button className="w-full" variant="outline">
                <ArrowRight className="h-4 w-4 mr-2" />
                {rec.actionText}
              </Button>
            </CardContent>
          </Card>
        );

      case 'optimization':
        return (
          <Card key={rec.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                {getRecommendationIcon(rec)}
                <span className="ml-2">{rec.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{rec.description}</p>
              
              <div className="space-y-2">
                <h4 className="font-medium">Optimization Suggestions:</h4>
                <ul className="space-y-1">
                  {rec.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>

              <Button className="w-full" variant="outline">
                <Lightbulb className="h-4 w-4 mr-2" />
                {rec.actionText}
              </Button>
            </CardContent>
          </Card>
        );

      case 'trending':
        return (
          <Card key={rec.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  {getRecommendationIcon(rec)}
                  <span className="ml-2">{rec.title}</span>
                </span>
                <Badge variant="secondary">
                  {rec.popularity}% popularity
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{rec.description}</p>
              
              <div className="space-y-2">
                <h4 className="font-medium">Key Benefits:</h4>
                <ul className="space-y-1">
                  {rec.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Star className="h-4 w-4 mr-2 text-yellow-500" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {rec.papers && (
                <div className="space-y-2">
                  <h4 className="font-medium">Key Papers:</h4>
                  <div className="flex flex-wrap gap-1">
                    {rec.papers.map((paper, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {paper}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Button className="w-full">
                <Sparkles className="h-4 w-4 mr-2" />
                {rec.actionText}
              </Button>
            </CardContent>
          </Card>
        );

      case 'learning':
        return (
          <Card key={rec.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                {getRecommendationIcon(rec)}
                <span className="ml-2">{rec.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{rec.description}</p>
              
              {rec.resources && (
                <div className="space-y-2">
                  {rec.resources.map((resource, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                      <div>
                        <div className="font-medium">{resource.name}</div>
                        <div className="text-sm text-muted-foreground">{resource.provider}</div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm">{resource.rating}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">{resource.duration}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {rec.papers && (
                <div className="space-y-2">
                  {rec.papers.map((paper, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                      <div>
                        <div className="font-medium text-sm">{paper.title}</div>
                        <div className="text-xs text-muted-foreground">{paper.venue}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {paper.citations} citations
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Button className="w-full" variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                {rec.actionText}
              </Button>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card key={rec.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                {getRecommendationIcon(rec)}
                <span className="ml-2">{rec.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{rec.description}</p>
              
              {rec.suggestions && (
                <ul className="space-y-1">
                  {rec.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}

              <Button className="w-full" variant="outline">
                <ArrowRight className="h-4 w-4 mr-2" />
                {rec.actionText}
              </Button>
            </CardContent>
          </Card>
        );
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Lightbulb className="h-8 w-8 mr-3 text-yellow-500" />
            Smart Recommendations
          </h1>
          <p className="text-muted-foreground">
            AI-powered insights to improve your ML experiments
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                  className="flex items-center"
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  {category.label}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecommendations.map(rec => getRecommendationCard(rec))}
      </div>

      {/* Empty State */}
      {filteredRecommendations.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Lightbulb className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Recommendations</h3>
            <p className="text-muted-foreground">
              No recommendations found for the selected category
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SmartRecommendations;