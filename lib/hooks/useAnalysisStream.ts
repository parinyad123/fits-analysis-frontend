// lib/hooks/useAnalysisStream.ts

/**
 * SSE Stream Hook for Real-time Analysis Updates
 */

import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
import type { WorkflowStatusLight } from '@/lib/types/analysis.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003'

interface useAnalysisStreamOptions {
    onComplete?: (status: WorkflowStatusLight) => void;
    onError?: (error: string) => void;
}

export function useAnalysisStream(
    taskId: string | null,
    options?: useAnalysisStreamOptions
) {
    const { token } = useAuthStore();
    const [status, setStatus] = useState<WorkflowStatusLight | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const eventSourceRef = useRef<EventSource | null>(null);

    useEffect(() => {
        if (!taskId || !token) return;

        const url = `${API_BASE_URL}/api/v2/analyze/${taskId}/stream`;
        const eventSource = new EventSource(url);
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
            console.log('SSE connected:', taskId);
            setIsConnected(true);
            setError(null);
        };

        eventSource.onmessage = (event) => {
            try {
                const data: WorkflowStatusLight = JSON.parse(event.data);
                console.log('SSE update:', data);

                setStatus(data);

                if (data.status === 'completed') {
                    console.log('✅ Analysis completed');
                    options?.onComplete?.(data);
                    eventSource.close();
                } else if (data.status === 'failed') {
                    console.error('❌ Analysis failed:', data.error);
                    options?.onError?.(data.error || 'Analysis failed');
                    eventSource.close();
                }
            } catch (err) {
                console.error('Failed to parse SSE data:', err);
            }
        };

        eventSource.onerror = (err) => {
            console.error('❌ SSE error:', err);
            setError('Connection error');
            setIsConnected(false);
            eventSource.close();
        };

        return () => {
            console.log('Closing SSE connectin');
            eventSource.close();
        };
    }, [taskId, token, options]);

    const disconnect = () => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            setIsConnected(false);
        }
    };

    return {
        status,
        isConnected,
        error,
        disconnect,
    };
}