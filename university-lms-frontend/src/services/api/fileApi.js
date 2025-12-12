import axiosInstance from './axiosInstance';

/**
 * File API client.
 * Handles uploads, listing, downloading, and deleting files in the LMS.
 * Adjust endpoint paths to match your backend routing.
 *
 * Suggested backend routes (example):
 * - GET    /files                  (list/search)
 * - POST   /files                  (upload)
 * - GET    /files/:fileId          (metadata or download URL)
 * - DELETE /files/:fileId          (delete)
 *
 * - (Optional) presigned URLs:
 *   POST /files/presign-upload     (get upload URL)
 *   GET  /files/:fileId/presign-download (get download URL)
 */
const fileApi = {
  /**
   * List files with optional filters/pagination.
   * @param {Object} params e.g., { page, limit, search, type, ownerId, courseId, offeringId }
   */
  list(params = {}) {
    return axiosInstance.get('/files', { params });
  },

  /**
   * Get a single file's metadata (or direct URL, if your backend returns it).
   * @param {string|number} fileId
   */
  get(fileId) {
    return axiosInstance.get(`/files/${fileId}`);
  },

  /**
   * Upload a file.
   * Use FormData and ensure the caller sets the file field(s) per backend expectation.
   * Optionally include metadata such as { folder, ownerId, courseId, offeringId }.
   * @param {FormData} formData
   */
  upload(formData) {
    return axiosInstance.post('/files', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /**
   * Delete a file.
   * @param {string|number} fileId
   */
  remove(fileId) {
    return axiosInstance.delete(`/files/${fileId}`);
  },

  // ---------------------------------------------------------------------------
  // Optional: presigned URL helpers (if your backend supports S3/GCS-style flows)
  // ---------------------------------------------------------------------------

  /**
   * Request a presigned URL to upload directly to object storage.
   * @param {Object} payload e.g., { filename, contentType, folder }
   */
  presignUpload(payload) {
    return axiosInstance.post('/files/presign-upload', payload);
  },

  /**
   * Request a presigned download URL for a file.
   */
  presignDownload(fileId) {
    return axiosInstance.get(`/files/${fileId}/presign-download`);
  },
};

export default fileApi;