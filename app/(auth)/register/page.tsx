// app/(auth)/register/page.tsx

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useState } from 'react';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
    const [queryClient] = useState(
        () => 
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                        retry: 1,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            <div className='flex min-h-screen items-center justify-center bg-[#0C0A1D] px-4 py-12'>
                <RegisterForm /> 
            </div>
            <Toaster position="top-right" richColors closeButton />
        </QueryClientProvider>
    );
}