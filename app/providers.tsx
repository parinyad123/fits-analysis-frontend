// app/providers.tsx

/**
 * App Providers
 * Wraps the app with necessary providers
 */

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import React, { useState } from 'react';

export function Providers({ children }: {children: React.ReactNode }) {
    // Create QueryClient inside component to aviod sharing between requests
    const [queryClient] = useState(
        () => 
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000, // 1 minute
                        retry: 1,
                        refetchOnWindowFocus: false,
                    },
                    mutations: {
                        retry: 0,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}

            {/* Toast Notification */}
            <Toaster
                position='top-right'
                richColors
                closeButton
                duration={4000} 
            />

            {/* React Query Aevtools (only in development) */}
            {process.env.NEXT_PUBLIC_ENABLE_DEVTOOLS === 'true' && (
                <ReactQueryDevtools initialIsOpen={false} />
            )}
        </QueryClientProvider>
    );
}