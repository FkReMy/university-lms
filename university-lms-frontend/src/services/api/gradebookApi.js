/**
 * Gradebook API
 */

import axiosInstance from './axiosInstance';

const gradebookApi = {
  async getGrades(courseId) {
    try {
      const response = await axiosInstance.get(`/api/v1/courses/${courseId}/grades`);
      return response.data;
    } catch (error) {
      console.error('Error fetching grades:', error);
      return [];
    }
  }
};

export default gradebookApi;
