/*  
lib/types/api.types.ts

Core API Types - Matches Backend Pydantic Models
*/

import { UUID } from 'crypto';

// ============================================
// Base Types
// ============================================

export type ApiStatus = 'success' | 'error';
export type WorkflowStatus = 'queued' | 'in_progress' | 'completed' | 'failed';
export type ValidationStatus =  'pending' | 'valid' | 'invalid' | 'corrupted';
export type UserRole = 'user' | 'assistant';
export type ExpertiseLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

// ============================================
// API Response Wrapper
// ============================================

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

// ============================================
// Pagination
// ============================================

export interface PaginationParams {
    offset?: number;
    limit?: number;
}

export interface PagintedResponse<T> {
    items: T[];
    total: number;
    has_more: boolean;
    next_offset: number | null;
}

// ============================================
// Plot Types
// ============================================

export interface PlotInfo {
    plot_id: string;
    plot_type: 'psd' | 'power_law' | 'bending_power_law';
    plot_url: string;
    title: string;
    created_at: string;
}

// ============================================
// Error Type
// ============================================
export interface ApiError {
    detail: string;
    status_code: number;
    type?: string;
}

export interface ValidationError {
    loc: (string | number)[];
    msg: string;
    type: string;
}