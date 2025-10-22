const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  // Extended profile fields
  fullName: {
    type: String,
    trim: true,
    maxlength: 100
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 500
  },
  location: {
    type: String,
    trim: true,
    maxlength: 100
  },
  organization: {
    type: String,
    trim: true,
    maxlength: 100
  },
  role: {
    type: String,
    trim: true,
    maxlength: 100
  },
  website: {
    type: String,
    trim: true,
    maxlength: 200
  },
  github: {
    type: String,
    trim: true,
    maxlength: 50
  },
  linkedin: {
    type: String,
    trim: true,
    maxlength: 50
  },
  twitter: {
    type: String,
    trim: true,
    maxlength: 50
  },
  profilePicture: {
    type: String,
    trim: true
  },
  // User settings
  settings: {
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: false },
    weeklyReports: { type: Boolean, default: true },
    experimentAlerts: { type: Boolean, default: true },
    profileVisibility: { type: String, enum: ['public', 'team', 'private'], default: 'public' },
    experimentVisibility: { type: String, enum: ['public', 'team', 'private'], default: 'private' },
    shareAnalytics: { type: Boolean, default: false },
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'dark' },
    language: { type: String, default: 'en' },
    timezone: { type: String, default: 'UTC-8' },
    defaultExperimentType: { type: String, default: 'classification' },
    autoSaveInterval: { type: Number, default: 5 },
    maxExperiments: { type: Number, default: 100 },
    dataRetention: { type: Number, default: 365 }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);