/*
types/file.types.ts

 FITS File Types - Matches Backend Models
 */

import { ValidationStatus } from './api.types';

// ============================================
// File Upload
// ============================================

export interface FileUploadRequest {
  file: File;
}

export interface FileUploadResponse {
  success: boolean;
  file_id: string;
  original_filename: string;
  file_size: number;
  is_valid: boolean;
  validation_status: ValidationStatus;
  validation_error: string | null;
  uploaded_at: string;
  message: string;
}

// ============================================
// File Info (Lightweight)
// ============================================

export interface FileInfoLight {
    file_id: string;
    original_filename: string;
    file_size: number;
    is_valid: boolean;
    validation_status: ValidationStatus;
    uploaded_at: string;
}

// ============================================
// File Info (Full with Metadata)
// ============================================

// export interface FitsMetadata {
//   [key: string]: any;
// }

// export interface DataInfo {
//   [key: string]: any;
// }

export interface FileInfoFull extends FileInfoLight {
  user_id: string;
  metadata_filename: string | null;
  validation_error: string | null;
  last_accessed_at: string | null;
  // fits_metadata: FitsMetadata | null;
  // data_info: DataInfo | null;
  fits_metadata: Record<string, any> | null;
  data_info: Record<string, any> | null;
}

// ============================================
// File List Response
// ============================================

export interface UserFilesResponse {
    user_id: string;
    files: FileInfoLight[];
    total: number;
    has_more: boolean;
    next_offset: number | null;
}

// ============================================
// File Statistics
// ============================================

// export interface FileStatistics {
//   user_id: string;
//   total_files: number;
//   total_size_bytes: number;
//   total_size_mb: number;
//   valid_files: number;
//   invalid_files: number;
// }