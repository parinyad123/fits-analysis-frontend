'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { currentUser, isLoading } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !isLoading && !currentUser) {
            router.replace('/login');
        }
    }, [mounted, isLoading, currentUser, router]);

    if (!mounted || isLoading) {
        return (
            <div className='flex h-screen items-center justify-center bg-[#1F1D3E]'>
                <Loader2 className='h-8 w-8 animate-spin text-violet-500' />
            </div>
        );
    }

    if (!currentUser) {
        return null;
    }

    return (
        <div className='flex h-screen bg-[#0f0f0f] overflow-hidden'>
            <Sidebar
                collapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
            <div className='flex-1 flex flex-col overflow-hidden'>
                <Header />
                <main className='flex-1 overflow-hidden bg-[#0f0f0f]'>
                    {children}
                </main>
            </div>
        </div>
    );
}