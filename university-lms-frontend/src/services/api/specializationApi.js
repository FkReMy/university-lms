/**
 * Specialization API
 */

import axiosInstance from './axiosInstance';

const specializationApi = {
  async getSpecializations() {
    try {
      const response = await axiosInstance.get('/api/v1/specializations');
      return response.data;
    } catch (error) {
      console.error('Error fetching specializations:', error);
      return [];
    }
  }
};

export default specializationApi;
