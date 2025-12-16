/**
 * Professor Dashboard API
 */

import axiosInstance from './axiosInstance';

const professorDashboardApi = {
  async getStats() {
    try {
      const response = await axiosInstance.get('/api/v1/professor/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching professor stats:', error);
      return {};
    }
  }
};

export default professorDashboardApi;
