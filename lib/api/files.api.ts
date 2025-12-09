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
} from '@/lib/types';

export const filesApi = {
    // Upload FITS file
    uploadFile: async (file: File): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await apiClient.post<FileUploadResponse>(
      `${API_V2}/files/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data;
  },

    // Get user's files (paginated, lightweight)
    getFiles: async (params?: PaginationParams): Promise<UserFilesResponse> => {
      const { data } = await apiClient.get<UserFilesResponse>(`${API_V2}/files`, {
        params,
      });
      return data;
    },

    // Delete file (soft delete)
    deleteFile: async (fileId: string): Promise<ApiResponse> => {
        const { data }= await apiClient.delete<ApiResponse>(
            `${API_V2}/files/${fileId}`
        );
        return data;
    }
}