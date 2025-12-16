// lib/hooks/useConversations.ts

import { useQuery } from '@tanstack/react-query';
import { conversationApi } from '@/lib/api/conversations.api';
import type { PaginationParams } from '@/lib/types';

export function useConversations(
    sessionId: string | undefined,
    params?: PaginationParams
) {
    return useQuery({
        queryKey: ['conversation', sessionId, params],
        queryFn: () => conversationApi.getConversation(sessionId!, params),
        enabled: !!sessionId,
        refetchInterval: false,
    });
}

export function useMessageCount(sessionId: string | undefined) {
    return useQuery({
        queryKey: ['messageCount', sessionId],
        queryFn: () => conversationApi.getMessageCount(sessionId!),
        enabled: !!sessionId,
    });
}