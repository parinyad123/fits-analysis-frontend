// lib/hooks/useConversations.ts

import { useQuery } from '@tanstack/react-query';
import { conversationsApi } from '@/lib/api/conversations.api';

// Get conversation by session_id
export function useConversation(sessionId: string | undefined | null) {
    return useQuery({
        queryKey: ['conversation', sessionId],
        queryFn: () => {
            console.log('🔍 Fetching conversation:', sessionId);  // Debug log
            return conversationsApi.getConversation(sessionId!);
        },
        enabled: !!sessionId && sessionId !== 'undefined' && sessionId !== 'null',
        retry: false,
        staleTime: 30000,
    });
}

// Get conversations list (alias)
export function useConversations(sessionId: string | undefined | null) {
    return useConversation(sessionId); 
}

export function useMessageCount(sessionId: string | undefined) {
    return useQuery({
        queryKey: ['messageCount', sessionId],
        queryFn: () => conversationsApi.getMessageCount(sessionId!),
        enabled: !!sessionId,
    });
}