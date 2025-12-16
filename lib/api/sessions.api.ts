/*
lib/api/sessions.api.ts

Sessions API Endpoints
*/

import { apiClient, API_V2 } from "./client";
// import type {
//     SessionListResponse,
//     PaginationParams,
//     ApiResponse
// } from '@/lib/types'

import type { SessionListResponse } from '@/lib/types/conversation.types';
import type { SimpleApiResponse } from '@/lib/types/auth.types';

// export const sessionApi = {
//     // Get user's sessions
//     getSessions: async (params?: PaginationParams): Promise<SessionListResponse> => {
//         const { data } = await apiClient.get<SessionListResponse>(
//             `${API_V2}/sessions`,
//             {params}
//         );
//         return data;
//     },

//     // Delete session (soft delete)
//     deleteSession: async (sessionId: string): Promise<ApiResponse> => {
//         const { data } = await apiClient.delete<ApiResponse>(
//             `${API_V2}/sessions/${sessionId}`
//         );
//         return data;
//     },

//     // Update session title
//     updateSessionTitle: async (
//         sessionId: string,
//         title: string
//     ): Promise<ApiResponse> => {
//         const { data } = await apiClient.patch<ApiResponse>(
//             `${API_V2}/sessions/${sessionId}/title`,
//             null,
//             {
//                 params: { title },
//             }
//         );
//         return data;
//     },

// }

export const sessionApi = {
    getSessions: async (offset=0, limit=20): Promise<SessionListResponse> => {
        const response = await apiClient.get(`${API_V2}/sessions`, {
            params: { offset, limit }
        });
        return response.data;
    },

    deleteSession: async (sessionId: string): Promise<SimpleApiResponse> => {
        const response = await apiClient.delete(`${API_V2}/sessions/${sessionId}`);
        return response.data;
    },

    updateSessionTitle: async (
        sessionId: string,
        title: string
    ): Promise<SimpleApiResponse> => {
        const response = await apiClient.patch(
            `${API_V2}/sessions/${sessionId}/title`,
            null,
            { params: { title } }
        );
        return response.data;
    }
};