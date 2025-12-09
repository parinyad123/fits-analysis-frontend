/*
lib/hooks/useAnalysis.ts

Analysis Hook with Polling & SSE
*/

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { analysisApi } from "@/lib/api/analysis.api";
import { useSSE } from './useSSE';
import type { AnalyzeRequest, SSEStatusEvent } from "@/lib/types";
import { toast } from 'sonner';
import { toNamespacedPath } from "path";

export function useAnalysis() {
    const queryClient = useQueryClient();

    // Submit analysis mutation
    const submitMutation = useMutation({
        mutationFn: analysisApi.submitAnalysis,
        onSuccess: (data) => {
            toast.success(`Analysis submitted: ${data.task_id}`);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || 'Analysis submission failed');

        },
    });

    return {
        submit: submitMutation.mutate,
        isSubmitting: submitMutation.isPending,
        submittedData: submitMutation.data,
    };
}

// Hook for polling status
export function useAnalysisStatus(taskId: string | undefined, enabled: boolean = true){
    const url = taskId ? analysisApi.getSSEUrl(taskId) : undefined;

    return useQuery({
        queryKey: ['analysisStatus', taskId],
        queryFn: () => analysisApi.getStatusLight(taskId!),
        enabled: !!taskId && enabled,
        refetchInterval: (query) => {
            const status = query.state.data?.status;

            // Stop polling if completed or failed
            if (status === 'completed' || status == 'failed') {
                return false;
            }

            // Poll every 2 seconds
            return 2000;
        },
    });
}

// Hook for getting result
export function useAnalysisResult(taskId: string | undefined){
    return useQuery({
        queryKey: ['analysisResult', taskId],
        queryFn: () => analysisApi.getResult(taskId!),
        enabled: false,     // Manual fatch when completed
    });
}