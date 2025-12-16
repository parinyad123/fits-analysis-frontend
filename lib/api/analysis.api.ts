/*
lib/api/analysis.api.ts
 
Analysis & Workflow API Endpoints
 */

import { apiClient, API_V2 } from './client';
import type {
    AnalyzeRequest,
    AnalyzeResponse,
    WorkflowStatusLight,
    // WorkflowStatusFull,
    AnalysisResultLight,
} from '@/lib/types/analysis.types';

export const analysisApi = {
    // Submit analysis request
    submitAnalysis: async (request: AnalyzeRequest): Promise<AnalyzeResponse> => {
        const response = await apiClient.post(`${API_V2}/analyze`, request);
        return response.data;
    },

    // Get lightweight status (for polling)
    getAnalysisStatus: async (taskId: string): Promise<WorkflowStatusLight> => {
        const response = await apiClient.get(`${API_V2}/analyze/${taskId}/status`);
        return response.data;
    },

    // Get analysis result only
    getAnalysisResult: async (taskId: string): Promise<AnalysisResultLight> => {
        const response = await apiClient.get(`${API_V2}/analyze/${taskId}/result`);
        return response.data;
    },

    // Servcer-Sent Event stream URL
    getSSEUrl: (taskId: string): string => {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';
        return `${API_V2}/analyze/${taskId}/stream`;
    },

    // Cancel workflow (not yet implemented in backend)
    cancelAnalysis: async (taskId: string): Promise<{ message: string }> => {
        const response = await apiClient.delete(`${API_V2}/analyze/${taskId}`);
        return response.data;
    },
};