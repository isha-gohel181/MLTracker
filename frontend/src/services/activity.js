import api from './auth';

export const activityService = {
  // Get user activities with filtering and pagination
  getActivities: async (params = {}) => {
    const { search, type, dateRange, page = 1, limit = 20 } = params;
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (search) queryParams.append('search', search);
    if (type && type !== 'all') queryParams.append('type', type);
    if (dateRange && dateRange !== 'all') queryParams.append('dateRange', dateRange);
    
    const response = await api.get(`/activity?${queryParams}`);
    return response.data;
  },

  // Get activity statistics
  getActivityStats: async () => {
    const response = await api.get('/activity/stats');
    return response.data;
  },

  // Get activity breakdown by type
  getActivityBreakdown: async (dateRange = 'month') => {
    const response = await api.get(`/activity/breakdown?dateRange=${dateRange}`);
    return response.data;
  },

  // Get activity trends
  getActivityTrends: async () => {
    const response = await api.get('/activity/trends');
    return response.data;
  },

  // Get specific activity details
  getActivity: async (activityId) => {
    const response = await api.get(`/activity/${activityId}`);
    return response.data;
  },

  // Mark activity as viewed
  markAsViewed: async (activityId) => {
    const response = await api.post(`/activity/${activityId}/view`);
    return response.data;
  },

  // Delete activity (if allowed)
  deleteActivity: async (activityId) => {
    const response = await api.delete(`/activity/${activityId}`);
    return response.data;
  },

  // Log custom activity (for tracking user actions)
  logActivity: async (activityData) => {
    const response = await api.post('/activity/log', activityData);
    return response.data;
  }
};