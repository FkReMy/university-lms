/**
 * Timetable API
 */

import axiosInstance from './axiosInstance';

const timetableApi = {
  async getTimetable() {
    try {
      const response = await axiosInstance.get('/api/v1/timetable');
      return response.data;
    } catch (error) {
      console.error('Error fetching timetable:', error);
      return [];
    }
  }
};

export default timetableApi;
