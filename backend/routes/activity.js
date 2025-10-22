const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Mock activity data structure - in a real app, you'd have an Activity model
const generateMockActivities = (userId, params = {}) => {
  const { search, type, dateRange, page = 1, limit = 20 } = params;
  
  // Base activities template
  const activityTemplates = [
    {
      type: 'experiment_created',
      title: 'Created new experiment',
      description: 'Image Classification with CNN',
      status: 'running',
      metadata: {
        experimentId: 'exp_001',
        model: 'ResNet-50',
        dataset: 'CIFAR-10'
      }
    },
    {
      type: 'experiment_completed',
      title: 'Experiment completed',
      description: 'NLP Sentiment Analysis',
      status: 'completed',
      metadata: {
        experimentId: 'exp_002',
        accuracy: '94.2%',
        duration: '2h 35m'
      }
    },
    {
      type: 'model_shared',
      title: 'Shared model',
      description: 'Shared "Customer Churn Predictor" with team',
      status: 'shared',
      metadata: {
        recipients: ['john.doe', 'jane.smith'],
        modelId: 'model_003'
      }
    },
    {
      type: 'experiment_failed',
      title: 'Experiment failed',
      description: 'Object Detection Training',
      status: 'failed',
      metadata: {
        experimentId: 'exp_004',
        error: 'Out of memory',
        duration: '45m'
      }
    },
    {
      type: 'data_uploaded',
      title: 'Dataset uploaded',
      description: 'Medical Images Dataset (500MB)',
      status: 'completed',
      metadata: {
        datasetId: 'dataset_005',
        size: '500MB',
        samples: 10000
      }
    },
    {
      type: 'experiment_viewed',
      title: 'Viewed experiment',
      description: 'Reviewed Time Series Forecasting results',
      status: 'viewed',
      metadata: {
        experimentId: 'exp_006',
        viewDuration: '15m'
      }
    },
    {
      type: 'model_deployed',
      title: 'Model deployed',
      description: 'Deployed Fraud Detection Model to production',
      status: 'deployed',
      metadata: {
        modelId: 'model_007',
        environment: 'production',
        version: 'v2.1'
      }
    },
    {
      type: 'experiment_edited',
      title: 'Modified experiment',
      description: 'Updated hyperparameters for Deep Learning model',
      status: 'modified',
      metadata: {
        experimentId: 'exp_008',
        changes: ['learning_rate', 'batch_size']
      }
    }
  ];

  // Generate activities with timestamps
  const activities = activityTemplates.map((template, index) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30)); // Random date within last 30 days
    date.setHours(date.getHours() - Math.floor(Math.random() * 24));
    
    return {
      id: index + 1,
      userId: userId,
      ...template,
      timestamp: date.toISOString()
    };
  });

  // Apply filters
  let filteredActivities = activities;

  if (search) {
    filteredActivities = filteredActivities.filter(activity =>
      activity.title.toLowerCase().includes(search.toLowerCase()) ||
      activity.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (type && type !== 'all') {
    filteredActivities = filteredActivities.filter(activity =>
      activity.type.includes(type)
    );
  }

  if (dateRange && dateRange !== 'all') {
    const now = new Date();
    let filterDate = new Date();
    
    switch (dateRange) {
      case 'day':
        filterDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
    }
    
    filteredActivities = filteredActivities.filter(activity =>
      new Date(activity.timestamp) >= filterDate
    );
  }

  // Sort by timestamp (newest first)
  filteredActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedActivities = filteredActivities.slice(startIndex, endIndex);

  return {
    activities: paginatedActivities,
    totalCount: filteredActivities.length,
    currentPage: page,
    totalPages: Math.ceil(filteredActivities.length / limit),
    hasMore: endIndex < filteredActivities.length
  };
};

// @route   GET /api/activity
// @desc    Get user activities with filtering and pagination
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { search, type, dateRange, page = 1, limit = 20 } = req.query;
    
    // In a real app, you'd query your Activity model here
    const result = generateMockActivities(req.user.id, {
      search,
      type,
      dateRange,
      page: parseInt(page),
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/activity/stats
// @desc    Get activity statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    // Generate mock stats based on user activities
    const allActivities = generateMockActivities(req.user.id).activities;
    
    const stats = [
      {
        label: 'Total Activities',
        value: allActivities.length,
        icon: 'ActivityIcon',
        color: 'text-blue-600'
      },
      {
        label: 'Experiments Run',
        value: allActivities.filter(a => a.type.includes('experiment')).length,
        icon: 'Target',
        color: 'text-green-600'
      },
      {
        label: 'Models Shared',
        value: allActivities.filter(a => a.type === 'model_shared').length,
        icon: 'Share2',
        color: 'text-purple-600'
      },
      {
        label: 'This Week',
        value: allActivities.filter(a => {
          const activityDate = new Date(a.timestamp);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return activityDate > weekAgo;
        }).length,
        icon: 'TrendingUp',
        color: 'text-orange-600'
      }
    ];

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching activity stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/activity/breakdown
// @desc    Get activity breakdown by type
// @access  Private
router.get('/breakdown', auth, async (req, res) => {
  try {
    const { dateRange = 'month' } = req.query;
    const allActivities = generateMockActivities(req.user.id).activities;
    
    const breakdown = [
      {
        type: 'Experiments',
        count: allActivities.filter(a => a.type.includes('experiment')).length,
        color: 'bg-blue-500'
      },
      {
        type: 'Models',
        count: allActivities.filter(a => a.type.includes('model')).length,
        color: 'bg-green-500'
      },
      {
        type: 'Data Operations',
        count: allActivities.filter(a => a.type.includes('data')).length,
        color: 'bg-purple-500'
      },
      {
        type: 'Views',
        count: allActivities.filter(a => a.type.includes('viewed')).length,
        color: 'bg-gray-500'
      }
    ];

    res.json({
      success: true,
      data: breakdown
    });
  } catch (error) {
    console.error('Error fetching activity breakdown:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/activity/trends
// @desc    Get activity trends
// @access  Private
router.get('/trends', auth, async (req, res) => {
  try {
    const allActivities = generateMockActivities(req.user.id).activities;
    
    // Calculate trends
    const experimentActivities = allActivities.filter(a => a.type.includes('experiment'));
    const completedExperiments = experimentActivities.filter(a => a.type === 'experiment_completed');
    const failedExperiments = experimentActivities.filter(a => a.type === 'experiment_failed');
    
    const successRate = experimentActivities.length > 0 
      ? Math.round((completedExperiments.length / experimentActivities.length) * 100)
      : 0;

    // Mock trend data
    const trends = {
      mostActiveDay: 'Yesterday',
      peakTime: '2:30 PM',
      avgExperimentsPerDay: '3.2',
      successRate: successRate
    };

    res.json({
      success: true,
      data: trends
    });
  } catch (error) {
    console.error('Error fetching activity trends:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/activity/:id
// @desc    Get specific activity details
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const activityId = parseInt(req.params.id);
    const allActivities = generateMockActivities(req.user.id).activities;
    const activity = allActivities.find(a => a.id === activityId);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    res.json({
      success: true,
      data: activity
    });
  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/activity/:id/view
// @desc    Mark activity as viewed
// @access  Private
router.post('/:id/view', auth, async (req, res) => {
  try {
    const activityId = req.params.id;
    
    // In a real app, you'd update the activity in the database
    // For now, just return success
    
    res.json({
      success: true,
      message: 'Activity marked as viewed'
    });
  } catch (error) {
    console.error('Error marking activity as viewed:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/activity/log
// @desc    Log custom activity
// @access  Private
router.post('/log', auth, async (req, res) => {
  try {
    const { type, title, description, metadata } = req.body;
    
    // In a real app, you'd create a new Activity record
    const newActivity = {
      id: Date.now(), // Mock ID
      userId: req.user.id,
      type,
      title,
      description,
      status: 'logged',
      metadata: metadata || {},
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'Activity logged successfully',
      data: newActivity
    });
  } catch (error) {
    console.error('Error logging activity:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;