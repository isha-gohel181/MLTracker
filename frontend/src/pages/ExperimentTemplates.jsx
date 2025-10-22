import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { experimentService } from '../services/experiments';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { 
  Layers,
  Camera,
  MessageSquare,
  BarChart3,
  Music,
  Gamepad2,
  Database,
  TrendingUp,
  Star,
  Clock,
  Users,
  Zap,
  Brain,
  Sparkles,
  ChevronRight,
  Search,
  Filter,
  BookOpen,
  Play
} from 'lucide-react';
import { toast } from 'react-toastify';

const ExperimentTemplates = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    initializeTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [selectedCategory, searchTerm, templates]);

  const initializeTemplates = () => {
    const templateData = [
      {
        id: 'image-classification',
        name: 'Image Classification',
        description: 'CNN-based image classification with transfer learning capabilities',
        category: 'computer-vision',
        icon: Camera,
        difficulty: 'Beginner',
        estimatedTime: '2-4 hours',
        popularity: 95,
        uses: 1247,
        tags: ['CNN', 'Transfer Learning', 'ResNet', 'ImageNet'],
        config: {
          modelName: 'Image Classification Model',
          architecture: 'ResNet-50',
          framework: 'PyTorch',
          dataset: 'Custom Image Dataset',
          batchSize: 32,
          learningRate: 0.001,
          epochs: 50,
          optimizer: 'Adam',
          lossFunction: 'CrossEntropyLoss',
          metrics: ['Accuracy', 'Top-5 Accuracy', 'F1-Score']
        },
        steps: [
          'Load and preprocess image dataset',
          'Initialize pre-trained ResNet-50 model',
          'Replace final classification layer',
          'Set up data augmentation pipeline',
          'Configure training loop with validation',
          'Implement early stopping and checkpointing'
        ],
        codeSnippet: `# Image Classification Template
import torch
import torchvision
from torchvision import transforms

# Data preprocessing
transform = transforms.Compose([
    transforms.Resize(224),
    transforms.RandomHorizontalFlip(),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# Model setup
model = torchvision.models.resnet50(pretrained=True)
model.fc = torch.nn.Linear(model.fc.in_features, num_classes)`,
        expectedResults: {
          accuracy: '85-95%',
          trainingTime: '2-4 hours',
          memoryUsage: '6-8 GB GPU'
        }
      },
      {
        id: 'nlp-sentiment',
        name: 'Sentiment Analysis',
        description: 'BERT-based sentiment classification for text data',
        category: 'nlp',
        icon: MessageSquare,
        difficulty: 'Intermediate',
        estimatedTime: '3-6 hours',
        popularity: 88,
        uses: 892,
        tags: ['BERT', 'Transformers', 'NLP', 'Sentiment'],
        config: {
          modelName: 'Sentiment Analysis Model',
          architecture: 'BERT-base',
          framework: 'HuggingFace',
          dataset: 'Custom Text Dataset',
          batchSize: 16,
          learningRate: 0.00002,
          epochs: 3,
          optimizer: 'AdamW',
          lossFunction: 'BCEWithLogitsLoss',
          metrics: ['Accuracy', 'Precision', 'Recall', 'F1-Score']
        },
        steps: [
          'Preprocess and tokenize text data',
          'Load pre-trained BERT model',
          'Add classification head',
          'Set up fine-tuning configuration',
          'Implement training with learning rate scheduling',
          'Evaluate on validation set'
        ],
        codeSnippet: `# Sentiment Analysis Template
from transformers import BertTokenizer, BertForSequenceClassification
from transformers import Trainer, TrainingArguments

# Model setup
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertForSequenceClassification.from_pretrained(
    'bert-base-uncased', 
    num_labels=2
)

# Training configuration
training_args = TrainingArguments(
    output_dir='./results',
    num_train_epochs=3,
    per_device_train_batch_size=16,
    learning_rate=2e-5,
)`,
        expectedResults: {
          accuracy: '88-94%',
          trainingTime: '3-6 hours',
          memoryUsage: '8-12 GB GPU'
        }
      },
      {
        id: 'time-series',
        name: 'Time Series Forecasting',
        description: 'LSTM-based time series prediction with multiple features',
        category: 'time-series',
        icon: TrendingUp,
        difficulty: 'Advanced',
        estimatedTime: '4-8 hours',
        popularity: 76,
        uses: 634,
        tags: ['LSTM', 'Time Series', 'Forecasting', 'Sequence'],
        config: {
          modelName: 'Time Series Forecasting Model',
          architecture: 'Bidirectional LSTM',
          framework: 'TensorFlow',
          dataset: 'Time Series Dataset',
          batchSize: 64,
          learningRate: 0.001,
          epochs: 100,
          optimizer: 'Adam',
          lossFunction: 'MeanSquaredError',
          metrics: ['RMSE', 'MAE', 'MAPE']
        },
        steps: [
          'Prepare and normalize time series data',
          'Create sliding window sequences',
          'Build LSTM architecture with attention',
          'Implement training with validation split',
          'Add early stopping and model checkpoints',
          'Evaluate forecasting accuracy'
        ],
        codeSnippet: `# Time Series Forecasting Template
import tensorflow as tf
from tensorflow.keras.layers import LSTM, Dense, Dropout

# Model architecture
model = tf.keras.Sequential([
    LSTM(50, return_sequences=True, input_shape=(timesteps, features)),
    Dropout(0.2),
    LSTM(50, return_sequences=False),
    Dropout(0.2),
    Dense(25),
    Dense(1)
])

model.compile(optimizer='adam', loss='mse', metrics=['mae'])`,
        expectedResults: {
          accuracy: 'RMSE < 0.1',
          trainingTime: '4-8 hours',
          memoryUsage: '4-6 GB GPU'
        }
      },
      {
        id: 'anomaly-detection',
        name: 'Anomaly Detection',
        description: 'Autoencoder-based anomaly detection for unsupervised learning',
        category: 'unsupervised',
        icon: Zap,
        difficulty: 'Intermediate',
        estimatedTime: '2-4 hours',
        popularity: 82,
        uses: 567,
        tags: ['Autoencoder', 'Anomaly Detection', 'Unsupervised'],
        config: {
          modelName: 'Anomaly Detection Model',
          architecture: 'Deep Autoencoder',
          framework: 'PyTorch',
          dataset: 'Tabular/Time Series Data',
          batchSize: 128,
          learningRate: 0.001,
          epochs: 200,
          optimizer: 'Adam',
          lossFunction: 'MSELoss',
          metrics: ['Reconstruction Error', 'Precision', 'Recall']
        },
        steps: [
          'Preprocess and normalize input data',
          'Design encoder-decoder architecture',
          'Train autoencoder on normal data',
          'Calculate reconstruction thresholds',
          'Implement anomaly scoring system',
          'Validate on test data with known anomalies'
        ],
        codeSnippet: `# Anomaly Detection Template
import torch
import torch.nn as nn

class Autoencoder(nn.Module):
    def __init__(self, input_dim):
        super().__init__()
        self.encoder = nn.Sequential(
            nn.Linear(input_dim, 128),
            nn.ReLU(),
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Linear(64, 32)
        )
        self.decoder = nn.Sequential(
            nn.Linear(32, 64),
            nn.ReLU(),
            nn.Linear(64, 128),
            nn.ReLU(),
            nn.Linear(128, input_dim)
        )`,
        expectedResults: {
          accuracy: '85-92% Detection Rate',
          trainingTime: '2-4 hours',
          memoryUsage: '2-4 GB GPU'
        }
      },
      {
        id: 'recommendation',
        name: 'Recommendation System',
        description: 'Collaborative filtering with neural networks for personalized recommendations',
        category: 'recommendation',
        icon: Star,
        difficulty: 'Advanced',
        estimatedTime: '6-10 hours',
        popularity: 71,
        uses: 423,
        tags: ['Collaborative Filtering', 'Neural Networks', 'Embeddings'],
        config: {
          modelName: 'Neural Recommendation Model',
          architecture: 'Neural Collaborative Filtering',
          framework: 'TensorFlow',
          dataset: 'User-Item Interaction Data',
          batchSize: 256,
          learningRate: 0.001,
          epochs: 50,
          optimizer: 'Adam',
          lossFunction: 'BinaryCrossentropy',
          metrics: ['Precision@K', 'Recall@K', 'NDCG']
        },
        steps: [
          'Process user-item interaction data',
          'Create user and item embeddings',
          'Build neural collaborative filtering model',
          'Implement negative sampling strategy',
          'Train with implicit feedback optimization',
          'Evaluate recommendation quality'
        ],
        codeSnippet: `# Recommendation System Template
import tensorflow as tf
from tensorflow.keras.layers import Embedding, Dense, Concatenate

# Neural Collaborative Filtering Model
user_input = tf.keras.Input(shape=(), name='user_id')
item_input = tf.keras.Input(shape=(), name='item_id')

user_embedding = Embedding(num_users, embedding_dim)(user_input)
item_embedding = Embedding(num_items, embedding_dim)(item_input)

concat = Concatenate()([user_embedding, item_embedding])
dense1 = Dense(128, activation='relu')(concat)
output = Dense(1, activation='sigmoid')(dense1)`,
        expectedResults: {
          accuracy: 'NDCG@10: 0.75+',
          trainingTime: '6-10 hours',
          memoryUsage: '8-12 GB GPU'
        }
      },
      {
        id: 'object-detection',
        name: 'Object Detection',
        description: 'YOLO-based real-time object detection and localization',
        category: 'computer-vision',
        icon: Camera,
        difficulty: 'Advanced',
        estimatedTime: '8-12 hours',
        popularity: 89,
        uses: 756,
        tags: ['YOLO', 'Object Detection', 'Computer Vision', 'Real-time'],
        config: {
          modelName: 'Object Detection Model',
          architecture: 'YOLOv8',
          framework: 'Ultralytics',
          dataset: 'COCO/Custom Dataset',
          batchSize: 16,
          learningRate: 0.01,
          epochs: 100,
          optimizer: 'SGD',
          lossFunction: 'YOLO Loss',
          metrics: ['mAP@0.5', 'mAP@0.5:0.95', 'Precision', 'Recall']
        },
        steps: [
          'Prepare annotated dataset in YOLO format',
          'Configure YOLOv8 model architecture',
          'Set up data augmentation pipeline',
          'Initialize training with pre-trained weights',
          'Monitor training metrics and validation',
          'Export model for inference deployment'
        ],
        codeSnippet: `# Object Detection Template
from ultralytics import YOLO

# Load pre-trained YOLOv8 model
model = YOLO('yolov8n.pt')

# Train the model
results = model.train(
    data='dataset.yaml',
    epochs=100,
    imgsz=640,
    batch=16,
    lr0=0.01,
    device=0
)

# Validate the model
metrics = model.val()`,
        expectedResults: {
          accuracy: 'mAP@0.5: 0.6+',
          trainingTime: '8-12 hours',
          memoryUsage: '10-16 GB GPU'
        }
      }
    ];

    setTemplates(templateData);
    setFilteredTemplates(templateData);
  };

  const filterTemplates = () => {
    let filtered = templates;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredTemplates(filtered);
  };

  const categories = [
    { value: 'all', label: 'All Templates', icon: Layers },
    { value: 'computer-vision', label: 'Computer Vision', icon: Camera },
    { value: 'nlp', label: 'Natural Language', icon: MessageSquare },
    { value: 'time-series', label: 'Time Series', icon: TrendingUp },
    { value: 'unsupervised', label: 'Unsupervised', icon: Brain },
    { value: 'recommendation', label: 'Recommendation', icon: Star }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUseTemplate = async (template) => {
    try {
      // Create new experiment with template configuration
      const experimentData = {
        modelName: template.config.modelName,
        notes: `Created from ${template.name} template\n\n${template.description}\n\nSteps:\n${template.steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}`,
        tags: [...template.tags, 'template', template.category],
        // Initialize with template defaults
        accuracy: 0,
        loss: 0,
        templateId: template.id,
        templateConfig: template.config
      };

      const response = await experimentService.createExperiment(experimentData);
      toast.success(`Experiment created from ${template.name} template!`);
      navigate(`/experiments/${response.data._id}`);
    } catch (error) {
      toast.error('Failed to create experiment from template');
    }
  };

  const handlePreviewTemplate = (template) => {
    setSelectedTemplate(template);
    setShowCreateModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Layers className="h-8 w-8 mr-3 text-purple-500" />
            Experiment Templates
          </h1>
          <p className="text-muted-foreground">
            Quick-start your ML projects with pre-configured templates
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search templates, tags, or technologies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
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
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const IconComponent = template.icon;
          return (
            <Card key={template.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-purple-500 group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <IconComponent className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{template.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getDifficultyColor(template.difficulty)}>
                      {template.difficulty}
                    </Badge>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Star className="h-3 w-3 mr-1 text-yellow-500" />
                      {template.popularity}%
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{template.description}</p>
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                    <span>{template.estimatedTime}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-3 w-3 mr-1 text-muted-foreground" />
                    <span>{template.uses} uses</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {template.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {template.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{template.tags.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* Expected Results */}
                <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                  <h4 className="text-xs font-medium text-muted-foreground">Expected Results:</h4>
                  <p className="text-xs">Accuracy: {template.expectedResults.accuracy}</p>
                  <p className="text-xs">Training: {template.expectedResults.trainingTime}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreviewTemplate(template)}
                    className="flex-1"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleUseTemplate(template)}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Layers className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Templates Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </CardContent>
        </Card>
      )}

      {/* Template Preview Modal */}
      {showCreateModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <selectedTemplate.icon className="h-6 w-6 mr-2 text-purple-600" />
                  {selectedTemplate.name} Template
                </CardTitle>
                <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-muted-foreground">{selectedTemplate.description}</p>
              </div>

              {/* Configuration */}
              <div>
                <h3 className="font-medium mb-2">Default Configuration</h3>
                <div className="grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                  {Object.entries(selectedTemplate.config).map(([key, value]) => (
                    <div key={key} className="text-sm">
                      <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="ml-2 text-muted-foreground">{Array.isArray(value) ? value.join(', ') : value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Steps */}
              <div>
                <h3 className="font-medium mb-2">Implementation Steps</h3>
                <ol className="space-y-2">
                  {selectedTemplate.steps.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-sm">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Code Snippet */}
              <div>
                <h3 className="font-medium mb-2">Sample Code</h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                  {selectedTemplate.codeSnippet}
                </pre>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                >
                  Close Preview
                </Button>
                <Button
                  onClick={() => {
                    handleUseTemplate(selectedTemplate);
                    setShowCreateModal(false);
                  }}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Use This Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ExperimentTemplates;