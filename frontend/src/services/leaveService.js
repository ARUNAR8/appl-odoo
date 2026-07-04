import api from './api';

export const leaveService = {
  getLeaves: async () => {
    const response = await api.get('/leaves');
    return response.data;
  },
};