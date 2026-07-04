import api from './api';

export const attendanceService = {
  getAttendance: async () => {
    const response = await api.get('/attendance');
    return response.data;
  },
};