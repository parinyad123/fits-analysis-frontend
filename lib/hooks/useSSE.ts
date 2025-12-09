/*
lib/hooks/useSSE.ts

Server-Sent Events Hook
*/

import { useEffect, useRef, useState  } from "react";
import { useAuthStore } from "../stores/authStore";
import { setDefaultAutoSelectFamily } from "net";

interface UseSSEOptions<T> {
    onMessage?: (data: T) => void;
    onError?: (error: Event) => void;
    onOpen?: () => void;
}

export function useSSE<T = any>(
    url: string | undefined,
    options: UseSSEOptions<T> = {}
) {
    const [data, setData] = useState<T | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, settError] = useState<string | null>(null);
    const eventSourceRef = useRef<EventSource | null>(null);
    const token = useAuthStore((state) => state.token);

    useEffect(() => {
        if (!url || !token) return;

        // Add token to URL as query parameter
        const urlWithAuth = `${url}?token=${token}`;

        const eventSource = new EventSource(urlWithAuth);
        eventSourceRef.current = new EventSource(urlWithAuth);

        eventSource.onopen = () => {
            setIsConnected(true);
            settError(null);
            options.onOpen?.();
        };

        eventSource.onmessage = (event) => {
            try {
                const parsedData = JSON.parse(event.data) as T;
                setData(parsedData);
                options.onMessage?.(parsedData);
            } catch (err) {
                console.error('Failed to parse SSE data:', err);
            }
        };

        eventSource.onerror = (event) => {
            setIsConnected(false);
            settError('Connection error');
            options.onError?.(event);
            eventSource.close();
        };

        // Cleanup
        return () => {
            eventSource.close();
        };
    }, [url, token]);

    const close = () => {
        eventSourceRef.current?.close();
        setIsConnected(false);
    };

    return {
        data,
        isConnected,
        error,
        close,
    };
}