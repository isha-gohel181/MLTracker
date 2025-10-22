const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for profile picture uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profiles/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// @route   GET /api/profile
// @desc    Get user profile
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        username: user.username,
        email: user.email,
        fullName: user.fullName || '',
        bio: user.bio || '',
        location: user.location || '',
        organization: user.organization || '',
        role: user.role || '',
        website: user.website || '',
        github: user.github || '',
        linkedin: user.linkedin || '',
        twitter: user.twitter || '',
        profilePicture: user.profilePicture || null,
        joinedDate: user.createdAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/profile
// @desc    Update user profile
// @access  Private
router.put('/', auth, async (req, res) => {
  try {
    const {
      fullName,
      bio,
      location,
      organization,
      role,
      website,
      github,
      linkedin,
      twitter
    } = req.body;

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields
    if (fullName !== undefined) user.fullName = fullName;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (organization !== undefined) user.organization = organization;
    if (role !== undefined) user.role = role;
    if (website !== undefined) user.website = website;
    if (github !== undefined) user.github = github;
    if (linkedin !== undefined) user.linkedin = linkedin;
    if (twitter !== undefined) user.twitter = twitter;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        bio: user.bio,
        location: user.location,
        organization: user.organization,
        role: user.role,
        website: user.website,
        github: user.github,
        linkedin: user.linkedin,
        twitter: user.twitter,
        profilePicture: user.profilePicture,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/profile/picture
// @desc    Upload profile picture
// @access  Private
router.post('/picture', auth, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update profile picture path
    user.profilePicture = `/uploads/profiles/${req.file.filename}`;
    await user.save();

    res.json({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: {
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/profile/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    // Import Experiment model dynamically to avoid circular dependency
    const Experiment = require('../models/Experiment');
    
    // Get experiment statistics
    const totalExperiments = await Experiment.countDocuments({ user: req.user.id });
    const completedExperiments = await Experiment.countDocuments({ 
      user: req.user.id, 
      status: 'completed' 
    });
    const runningExperiments = await Experiment.countDocuments({ 
      user: req.user.id, 
      status: 'running' 
    });

    // Calculate success rate
    const successRate = totalExperiments > 0 ? Math.round((completedExperiments / totalExperiments) * 100) : 0;

    // Mock achievements count (you can extend this with actual achievements model)
    const achievementsCount = Math.floor(totalExperiments / 5); // 1 achievement per 5 experiments

    const stats = [
      {
        label: 'Experiments Run',
        value: totalExperiments,
        icon: 'Target',
        color: 'text-blue-600'
      },
      {
        label: 'Models Trained',
        value: completedExperiments,
        icon: 'TrendingUp',
        color: 'text-green-600'
      },
      {
        label: 'Success Rate',
        value: `${successRate}%`,
        icon: 'Award',
        color: 'text-purple-600'
      },
      {
        label: 'Active',
        value: runningExperiments,
        icon: 'ActivityIcon',
        color: 'text-orange-600'
      }
    ];

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/profile/achievements
// @desc    Get user achievements
// @access  Private
router.get('/achievements', auth, async (req, res) => {
  try {
    const Experiment = require('../models/Experiment');
    
    const totalExperiments = await Experiment.countDocuments({ user: req.user.id });
    const completedExperiments = await Experiment.countDocuments({ 
      user: req.user.id, 
      status: 'completed' 
    });

    // Generate achievements based on user activity
    const achievements = [];
    
    if (totalExperiments >= 1) {
      achievements.push({
        title: 'First Experiment',
        description: 'Completed your first ML experiment',
        date: new Date().toISOString(),
        icon: '🎯'
      });
    }
    
    if (totalExperiments >= 10) {
      achievements.push({
        title: 'Experimenter',
        description: 'Created 10+ experiments',
        date: new Date().toISOString(),
        icon: '🧪'
      });
    }
    
    if (completedExperiments >= 5) {
      achievements.push({
        title: 'Model Master',
        description: 'Successfully completed 5+ experiments',
        date: new Date().toISOString(),
        icon: '🧠'
      });
    }

    if (totalExperiments >= 25) {
      achievements.push({
        title: 'ML Expert',
        description: 'Created 25+ experiments',
        date: new Date().toISOString(),
        icon: '🏆'
      });
    }

    res.json({
      success: true,
      data: achievements
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/profile/settings
// @desc    Get user settings
// @access  Private
router.get('/settings', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Return user settings (with defaults)
    const settings = {
      emailNotifications: user.settings?.emailNotifications ?? true,
      pushNotifications: user.settings?.pushNotifications ?? false,
      weeklyReports: user.settings?.weeklyReports ?? true,
      experimentAlerts: user.settings?.experimentAlerts ?? true,
      profileVisibility: user.settings?.profileVisibility ?? 'public',
      experimentVisibility: user.settings?.experimentVisibility ?? 'private',
      shareAnalytics: user.settings?.shareAnalytics ?? false,
      theme: user.settings?.theme ?? 'dark',
      language: user.settings?.language ?? 'en',
      timezone: user.settings?.timezone ?? 'UTC-8',
      defaultExperimentType: user.settings?.defaultExperimentType ?? 'classification',
      autoSaveInterval: user.settings?.autoSaveInterval ?? 5,
      maxExperiments: user.settings?.maxExperiments ?? 100,
      dataRetention: user.settings?.dataRetention ?? 365
    };

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/profile/settings
// @desc    Update user settings
// @access  Private
router.put('/settings', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update settings
    user.settings = { ...user.settings, ...req.body };
    await user.save();

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: user.settings
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/profile
// @desc    Delete user account
// @access  Private
router.delete('/', auth, async (req, res) => {
  try {
    // Delete user and all associated data
    const Experiment = require('../models/Experiment');
    
    await Experiment.deleteMany({ user: req.user.id });
    await User.findByIdAndDelete(req.user.id);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;