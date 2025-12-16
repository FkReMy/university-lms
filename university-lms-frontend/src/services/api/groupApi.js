/**
 * Group API
 */

import axiosInstance from './axiosInstance';

const groupApi = {
  async getGroups() {
    try {
      const response = await axiosInstance.get('/api/v1/groups');
      return response.data;
    } catch (error) {
      console.error('Error fetching groups:', error);
      return [];
    }
  }
};

export default groupApi;
