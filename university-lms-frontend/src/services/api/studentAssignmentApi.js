/**
 * Student Assignment API
 * Handles API requests for student assignment operations
 */

import axiosInstance from './axiosInstance';

const studentAssignmentApi = {
  /**
   * Get all assignments for a student
   */
  async getAssignments(studentId) {
    try {
      const response = await axiosInstance.get(`/api/v1/students/${studentId}/assignments`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student assignments:', error);
      return [];
    }
  },

  /**
   * Submit an assignment
   */
  async submitAssignment(assignmentId, formData) {
    try {
      const response = await axiosInstance.post(
        `/api/v1/assignments/${assignmentId}/submit`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error submitting assignment:', error);
      throw error;
    }
  },

  /**
   * Get student section assignments
   */
  async getSectionAssignments(sectionId) {
    try {
      const response = await axiosInstance.get(`/api/v1/sections/${sectionId}/assignments`);
      return response.data;
    } catch (error) {
      console.error('Error fetching section assignments:', error);
      return [];
    }
  }
};

export default studentAssignmentApi;
