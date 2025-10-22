import api from './auth';

export const profileService = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/profile', profileData);
    return response.data;
  },

  // Get user statistics
  getStats: async () => {
    const response = await api.get('/profile/stats');
    return response.data;
  },

  // Get user achievements
  getAchievements: async () => {
    const response = await api.get('/profile/achievements');
    return response.data;
  },

  // Upload profile picture
  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);
    const response = await api.post('/profile/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get user settings
  getSettings: async () => {
    const response = await api.get('/profile/settings');
    return response.data;
  },

  // Update user settings
  updateSettings: async (settings) => {
    const response = await api.put('/profile/settings', settings);
    return response.data;
  },

  // Reset settings to default
  resetSettings: async () => {
    const response = await api.post('/profile/settings/reset');
    return response.data;
  },

  // Delete user account
  deleteAccount: async () => {
    const response = await api.delete('/profile');
    return response.data;
  },

  // Export user data
  exportData: async () => {
    const response = await api.get('/profile/export', {
      responseType: 'blob'
    });
    return response.data;
  }
};