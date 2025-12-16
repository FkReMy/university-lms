/**
 * Profile API
 */

import axiosInstance from './axiosInstance';

const profileApi = {
  async getProfile() {
    try {
      const response = await axiosInstance.get('/api/v1/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  },
  
  async updateProfile(data) {
    try {
      const response = await axiosInstance.put('/api/v1/profile', data);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
};

export default profileApi;
