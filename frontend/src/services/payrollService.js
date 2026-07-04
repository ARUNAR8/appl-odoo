import api from './api';

export const payrollService = {
  getPayroll: async () => {
    const response = await api.get('/payroll');
    return response.data;
  },
};