/**
 * Student Dashboard API
 * Handles API requests for student dashboard data
 */

import axiosInstance from './axiosInstance';

const studentDashboardApi = {
  /**
   * Get dashboard statistics
   */
  async getStats() {
    try {
      const response = await axiosInstance.get('/api/v1/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return mock data for now
      return {
        enrolledCourses: 0,
        pendingAssignments: 0,
        upcomingQuizzes: 0,
        averageGrade: 0
      };
    }
  },

  /**
   * Get upcoming events/deadlines
   */
  async getUpcoming() {
    try {
      const response = await axiosInstance.get('/api/v1/dashboard/upcoming');
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      return [];
    }
  },

  /**
   * Get recent activities
   */
  async getRecent() {
    try {
      const response = await axiosInstance.get('/api/v1/dashboard/recent');
      return response.data;
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      return [];
    }
  },

  /**
   * Get student grades
   */
  async getGrades() {
    try {
      const response = await axiosInstance.get('/api/v1/dashboard/grades');
      return response.data;
    } catch (error) {
      console.error('Error fetching grades:', error);
      return [];
    }
  }
};

export default studentDashboardApi;
