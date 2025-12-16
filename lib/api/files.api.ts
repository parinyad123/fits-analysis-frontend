/*
lib/api/files.api.ts

FITS Files API Endpoints
*/

import { apiClient, API_V2 } from './client';
import type {
    FileUploadResponse,
    ApiResponse,
    PaginationParams,
    UserFilesResponse,
    FileInfoFull,
} from '@/lib/types';
import type { SimpleApiResponse } from '@/lib/types/auth.types';

export const filesApi = {

    // Get user's FITS files
    getUserFiles: async (offset=0, limit=20): Promise<UserFilesResponse> => {
      const response = await apiClient.get(`${API_V2}/files`, {
        params: { offset, limit }
      });
      return response.data
    },

    // Upload FITS file
    uploadFile: async (file: File): Promise<FileUploadResponse> => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post(`${API_V2}/files/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    
    // Delete file (soft delete)
    deleteFile: async (fileId: string): Promise<ApiResponse> => {
      const response = await apiClient.delete(`${API_V2}/files/${fileId}`);
      return response.data;
    }
}