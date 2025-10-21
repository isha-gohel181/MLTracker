const Experiment = require('../models/Experiment');

// Get all experiments for the authenticated user
const getExperiments = async (req, res) => {
  try {
    const { 
      search, 
      tags, 
      minAccuracy, 
      maxAccuracy, 
      sortBy, 
      sortOrder,
      page = 1,
      limit = 10 
    } = req.query;

    // Build query
    let query = { user: req.user._id, isActive: true };

    // Search functionality
    if (search) {
      query.$or = [
        { modelName: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Filter by tags
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    // Filter by accuracy range
    if (minAccuracy || maxAccuracy) {
      query.accuracy = {};
      if (minAccuracy) query.accuracy.$gte = parseFloat(minAccuracy);
      if (maxAccuracy) query.accuracy.$lte = parseFloat(maxAccuracy);
    }

    // Build sort object
    let sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1; // Default sort by newest
    }

    const experiments = await Experiment.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'username email');

    const total = await Experiment.countDocuments(query);

    res.json({
      success: true,
      data: experiments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get experiments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching experiments',
      error: error.message
    });
  }
};

// Get single experiment
const getExperiment = async (req, res) => {
  try {
    const experiment = await Experiment.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true
    }).populate('user', 'username email');

    if (!experiment) {
      return res.status(404).json({
        success: false,
        message: 'Experiment not found'
      });
    }

    res.json({
      success: true,
      data: experiment
    });
  } catch (error) {
    console.error('Get experiment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching experiment',
      error: error.message
    });
  }
};

// Create new experiment
const createExperiment = async (req, res) => {
  try {
    const { modelName, accuracy, loss, notes, tags } = req.body;

    const experiment = await Experiment.create({
      user: req.user._id,
      modelName,
      accuracy,
      loss,
      notes,
      tags: tags || []
    });

    const populatedExperiment = await Experiment.findById(experiment._id)
      .populate('user', 'username email');

    res.status(201).json({
      success: true,
      message: 'Experiment created successfully',
      data: populatedExperiment
    });
  } catch (error) {
    console.error('Create experiment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating experiment',
      error: error.message
    });
  }
};

// Update experiment (creates new version)
const updateExperiment = async (req, res) => {
  try {
    const { modelName, accuracy, loss, notes, tags } = req.body;

    const experiment = await Experiment.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true
    });

    if (!experiment) {
      return res.status(404).json({
        success: false,
        message: 'Experiment not found'
      });
    }

    // Save current state to versions array
    experiment.versions.push({
      modelName: experiment.modelName,
      accuracy: experiment.accuracy,
      loss: experiment.loss,
      notes: experiment.notes,
      updatedAt: experiment.updatedAt
    });

    // Update with new values
    experiment.modelName = modelName || experiment.modelName;
    experiment.accuracy = accuracy !== undefined ? accuracy : experiment.accuracy;
    experiment.loss = loss !== undefined ? loss : experiment.loss;
    experiment.notes = notes !== undefined ? notes : experiment.notes;
    experiment.tags = tags || experiment.tags;

    await experiment.save();

    const updatedExperiment = await Experiment.findById(experiment._id)
      .populate('user', 'username email');

    res.json({
      success: true,
      message: 'Experiment updated successfully',
      data: updatedExperiment
    });
  } catch (error) {
    console.error('Update experiment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating experiment',
      error: error.message
    });
  }
};

// Delete experiment (soft delete)
const deleteExperiment = async (req, res) => {
  try {
    const experiment = await Experiment.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true
    });

    if (!experiment) {
      return res.status(404).json({
        success: false,
        message: 'Experiment not found'
      });
    }

    experiment.isActive = false;
    await experiment.save();

    res.json({
      success: true,
      message: 'Experiment deleted successfully'
    });
  } catch (error) {
    console.error('Delete experiment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting experiment',
      error: error.message
    });
  }
};

// Get experiments for comparison
const getExperimentsForComparison = async (req, res) => {
  try {
    const { ids } = req.query;
    
    if (!ids) {
      return res.status(400).json({
        success: false,
        message: 'Experiment IDs are required'
      });
    }

    const experimentIds = ids.split(',');
    
    const experiments = await Experiment.find({
      _id: { $in: experimentIds },
      user: req.user._id,
      isActive: true
    }).populate('user', 'username email');

    res.json({
      success: true,
      data: experiments
    });
  } catch (error) {
    console.error('Get comparison experiments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching experiments for comparison',
      error: error.message
    });
  }
};

// Get experiment statistics
const getExperimentStats = async (req, res) => {
  try {
    const stats = await Experiment.aggregate([
      { $match: { user: req.user._id, isActive: true } },
      {
        $group: {
          _id: null,
          totalExperiments: { $sum: 1 },
          avgAccuracy: { $avg: '$accuracy' },
          avgLoss: { $avg: '$loss' },
          maxAccuracy: { $max: '$accuracy' },
          minLoss: { $min: '$loss' }
        }
      }
    ]);

    const tagStats = await Experiment.aggregate([
      { $match: { user: req.user._id, isActive: true } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalExperiments: 0,
          avgAccuracy: 0,
          avgLoss: 0,
          maxAccuracy: 0,
          minLoss: 0
        },
        topTags: tagStats
      }
    });
  } catch (error) {
    console.error('Get experiment stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching experiment statistics',
      error: error.message
    });
  }
};

// Generate AI insights for an experiment
const getExperimentInsights = async (req, res) => {
  try {
    const experiment = await Experiment.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true
    });

    if (!experiment) {
      return res.status(404).json({
        success: false,
        message: 'Experiment not found'
      });
    }

    // Prepare experiment data for AI analysis
    const experimentData = {
      modelName: experiment.modelName,
      accuracy: experiment.accuracy,
      loss: experiment.loss,
      notes: experiment.notes || 'No notes provided',
      tags: experiment.tags.join(', ') || 'No tags',
      versions: experiment.versions.length,
      createdAt: experiment.createdAt,
      updatedAt: experiment.updatedAt
    };

    const prompt = `
Analyze this machine learning experiment and provide insights and recommendations for improvement:

Experiment Details:
- Model Name: ${experimentData.modelName}
- Current Accuracy: ${experimentData.accuracy}%
- Current Loss: ${experimentData.loss}
- Notes: ${experimentData.notes}
- Tags: ${experimentData.tags}
- Number of Versions: ${experimentData.versions + 1}
- Created: ${experimentData.createdAt}
- Last Updated: ${experimentData.updatedAt}

Please provide:
1. A brief summary of the experiment's performance
2. Analysis of the accuracy and loss metrics
3. Potential reasons for the current performance level
4. Specific recommendations to improve accuracy
5. Suggestions for reducing loss
6. Any additional insights based on the model name and tags

Keep the response concise but informative, structured in clear sections.
`;

    // Import Gemini AI
    const { GoogleGenAI } = require('@google/genai');
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });
    console.log('Response structure:', JSON.stringify(response, null, 2));
    const insights = response.text || response.response?.text || response.candidates?.[0]?.content?.parts?.[0]?.text;

    res.json({
      success: true,
      data: {
        insights,
        generatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Get experiment insights error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating AI insights',
      error: error.message
    });
  }
};

module.exports = {
  getExperiments,
  getExperiment,
  createExperiment,
  updateExperiment,
  deleteExperiment,
  getExperimentsForComparison,
  getExperimentStats,
  getExperimentInsights
};