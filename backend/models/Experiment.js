const mongoose = require('mongoose');

const versionSchema = new mongoose.Schema({
  modelName: String,
  accuracy: Number,
  loss: Number,
  notes: String,
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const experimentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  modelName: {
    type: String,
    required: true,
    trim: true
  },
  accuracy: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  loss: {
    type: Number,
    required: true,
    min: 0
  },
  notes: {
    type: String,
    default: ''
  },
  tags: [{
    type: String,
    trim: true
  }],
  versions: [versionSchema],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Add text index for search functionality
experimentSchema.index({ 
  modelName: 'text', 
  notes: 'text', 
  tags: 'text' 
});

module.exports = mongoose.model('Experiment', experimentSchema);