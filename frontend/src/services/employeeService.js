import api from './api';

export const employeeService = {
  getProfile: async () => {
    const response = await api.get('/employees/profile');
    return response.data;
  },
};