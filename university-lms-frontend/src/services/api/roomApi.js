/**
 * Room API
 */

import axiosInstance from './axiosInstance';

const roomApi = {
  async getRooms() {
    try {
      const response = await axiosInstance.get('/api/v1/rooms');
      return response.data;
    } catch (error) {
      console.error('Error fetching rooms:', error);
      return [];
    }
  }
};

export default roomApi;
