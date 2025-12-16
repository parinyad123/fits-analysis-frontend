// lib/hooks/useSessions.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionApi } from '@/lib/api/sessions.api';
import { toast } from 'sonner';

export function useSessions(offset = 0, limit = 20) {
    const queryClient = useQueryClient();

    const sessionsQuery = useQuery({
        queryKey: ['sessions', offset, limit],
        queryFn: () => sessionApi.getSessions(offset, limit),
    });

    const deleteMutation = useMutation({
        mutationFn: sessionApi.deleteSession,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
            toast.success('Session deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || 'Delete failed');
        },
    });

    const updateTitleMutation = useMutation({
        mutationFn: ({ sessionId, title }: { sessionId: string; title: string }) =>
            sessionApi.updateSessionTitle(sessionId, title),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
            toast.success('Title updated');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || 'Update failed');
        },
    });

    return {
        sessions: sessionsQuery.data?.sessions || [],
        total: sessionsQuery.data?.total || 0,
        hasMore: sessionsQuery.data?.has_more || false,
        nextOffset: sessionsQuery.data?.next_offset,
        isLoading: sessionsQuery.isLoading,
        deleteSession: deleteMutation.mutate,
        updateTitle: updateTitleMutation.mutate,
        isDeleting: deleteMutation.isPending,
        isUpdating: updateTitleMutation.isPending,
        refetch: sessionsQuery.refetch,
    };
}