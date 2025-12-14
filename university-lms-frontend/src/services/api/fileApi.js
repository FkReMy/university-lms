/**
 * File API Client (LMS Production Service)
 * ----------------------------------------------------------------------------
 * Handles all file-related actions: listing, uploading, details, deleting.
 * - Uses global axios instance configured with authentication.
 * - Parameterized for backend compatibility and scalable integration.
 * - No sample/demo logic.
 */

import axiosInstance from './axiosInstance';

const fileApi = {
  /**
   * List all files with optional filtering and pagination.
   * @param {Object} params - { page, limit, search, type, ownerId, courseId, offeringId }
   * @returns {Promise}
   */
  list(params = {}) {
    return axiosInstance.get('/files', { params });
  },

  /**
   * Get a single file's metadata or file reference.
   * @param {string|number} fileId
   * @returns {Promise}
   */
  get(fileId) {
    return axiosInstance.get(`/files/${fileId}`);
  },

  /**
   * Upload a file. Use FormData to include binary and optional metadata.
   * FormData keys depend on backend expectations (e.g., "file", "ownerId", etc).
   * @param {FormData} formData
   * @returns {Promise}
   */
  upload(formData) {
    return axiosInstance.post('/files', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /**
   * Delete a file by ID.
   * @param {string|number} fileId
   * @returns {Promise}
   */
  remove(fileId) {
    return axiosInstance.delete(`/files/${fileId}`);
  },

  // ===========================================================================
  // Optional: Presigned URL helpers for cloud direct upload/download
  // ===========================================================================

  /**
   * Get a presigned upload URL for direct object storage (optional).
   * @param {Object} payload - { filename, contentType, folder }
   * @returns {Promise}
   */
  presignUpload(payload) {
    return axiosInstance.post('/files/presign-upload', payload);
  },

  /**
   * Get a presigned download URL for direct file download (optional).
   * @param {string|number} fileId
   * @returns {Promise}
   */
  presignDownload(fileId) {
    return axiosInstance.get(`/files/${fileId}/presign-download`);
  }
};

export default fileApi;

/**
 * Production/Architecture Notes:
 * - API client is parameterized to work with real backend and storage flows.
 * - Presigned endpoints included for S3/GCS patterns (optional; safe to remove).
 * - All methods are pure and importable across the LMS app.
 */