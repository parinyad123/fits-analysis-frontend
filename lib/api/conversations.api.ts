/*
lib/api/conversations.api.ts

Conversations API Endpoints
*/

import { apiClient, API_V2 } from './client';
import type {
    ConversationResponse,
    MessageCountResponse,
    PaginationParams,
} from '@/lib/types';

export const conversationApi = {
    // get conversation history
    getConversation: async (
        sessionId: string,
        params?: PaginationParams
    ): Promise<ConversationResponse> => {
        const { data } = await apiClient.get<ConversationResponse>(
            `${API_V2}/conversations/${sessionId}`,
            { params }
        );
        return data;
    },

    // Get message count for pagination
    getMessageCount: async (sessionId: string): Promise<MessageCountResponse> => {
        const { data } = await apiClient.get<MessageCountResponse>(
            `${API_V2}/conversations/${sessionId}/count`
        );
        return data;
    }
}