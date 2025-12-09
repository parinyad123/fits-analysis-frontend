// app/(auth)/login/page.tsx

/**
 * Login Page with Provider Wrapper
 */
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useState } from 'react';
// import { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';

// export const metadata: Metadata = {
//     title: 'Sign in | FITS Analysis System',
//     description: 'Sign in to your FITS Analysis account',
// };

export default function LoginPage() {
    const [queryClient] = useState(
        () => 
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 *  1000,
                        retry: 1,
                    },
                },
            })
    );
    return (
        <QueryClientProvider client={queryClient}>
            <div className='flex min-h-screen items-center justify-center bg-[#0C0A1D px-4 py-12'>
                <LoginForm /> 
            </div>
            <Toaster position="top-right" richColors closeButton />
        </QueryClientProvider>
    );
}