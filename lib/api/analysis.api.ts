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
    ApiResponse,
} from '@/lib/types';

export const analysisApi = {
    // Submit analysis request
    submitAnalysis: async (request: AnalyzeRequest): Promise<AnalyzeResponse> => {
        const { data } = await apiClient.post<AnalyzeResponse>(
            `{API_V2}/analyze`,
            request
        );
        return data;
    },

    // Get lightweight status (for polling)
    getStatusLight: async (taskId: string): Promise<WorkflowStatusLight> => {
        const { data } = await apiClient.get<WorkflowStatusLight>(
            `${API_V2}/analyze/${taskId}/status`
        );
        return data;
    },

    // Get analysis result only
    getResult: async (taskId: string): Promise<AnalysisResultLight> => {
        const { data } = await apiClient.get<AnalysisResultLight>(
            `${API_V2}/analyze/${taskId}/result`
        );
        return data;
    },

    // Cancel workflow (not yet implemented in backend)
    cancelWorkflow: async (taskId: string): Promise<ApiResponse> => {
        const { data } = await apiClient.delete<ApiResponse>(
        `${API_V2}/analyze/${taskId}`
        );
        return data;
    },

    // Servcer-Sent Event stream URL
    getSSEUrl: (taskId: string): string => {
        return `${API_V2}/analyze/${taskId}/stream`;
    },
};