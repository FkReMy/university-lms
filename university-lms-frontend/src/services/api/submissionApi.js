/**
 * Submission API
 */

import axiosInstance from './axiosInstance';

const submissionApi = {
  async getSubmissions(assignmentId) {
    try {
      const response = await axiosInstance.get(`/api/v1/assignments/${assignmentId}/submissions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching submissions:', error);
      return [];
    }
  }
};

export default submissionApi;
