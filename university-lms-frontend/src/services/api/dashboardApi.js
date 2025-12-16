/**
 * General Dashboard API
 * Handles API requests for dashboard data
 */

import axiosInstance from './axiosInstance';

const dashboardApi = {
  async getStats() {
    try {
      const response = await axiosInstance.get('/api/v1/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {};
    }
  },

  async getActivityFeed() {
    try {
      const response = await axiosInstance.get('/api/v1/dashboard/activity');
      return response.data;
    } catch (error) {
      console.error('Error fetching activity feed:', error);
      return [];
    }
  }
};

export default dashboardApi;
