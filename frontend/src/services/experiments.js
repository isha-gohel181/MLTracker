import api from './auth';

export const experimentService = {
  getExperiments: async (params = {}) => {
    const response = await api.get('/experiments', { params });
    return response.data;
  },

  getExperiment: async (id) => {
    const response = await api.get(`/experiments/${id}`);
    return response.data;
  },

  createExperiment: async (data) => {
    const response = await api.post('/experiments', data);
    return response.data;
  },

  updateExperiment: async (id, data) => {
    const response = await api.put(`/experiments/${id}`, data);
    return response.data;
  },

  deleteExperiment: async (id) => {
    const response = await api.delete(`/experiments/${id}`);
    return response.data;
  },

  getExperimentsForComparison: async (ids) => {
    const response = await api.get('/experiments/compare', {
      params: { ids: ids.join(',') }
    });
    return response.data;
  },

  getExperimentStats: async () => {
    const response = await api.get('/experiments/stats');
    return response.data;
  }
};