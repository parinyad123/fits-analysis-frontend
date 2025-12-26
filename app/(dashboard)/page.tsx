// app/(dashboard)/page.tsx

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAnalysis } from '@/lib/hooks/useAnalysis';
import { useAnalysisStream } from '@/lib/hooks/useAnalysisStream';
import { useConversations } from '@/lib/hooks/useConversations';
import { ConversationArea } from '@/components/dashboard/ConversationArea';
import { PromptBox } from '@/components/dashboard/PromptBox';
import type { ExpertiseLevel } from '@/lib/types';
import { Loader2 } from 'lucide-react';

function DashboardContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionIdFromUrl = searchParams.get('session') || undefined;
    const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
    const [currentSessionId, setCurrentSessionId] = useState<string | undefined>(sessionIdFromUrl);

    const { submit, isSubmitting, submittedData } = useAnalysis();

    // Validate sessionId
    const validSessionId = currentSessionId &&
        currentSessionId !== 'undefined' &&
        currentSessionId !== 'null'
        ? currentSessionId
        : undefined;

    useEffect(() => {
        console.log('📊 Dashboard state:', {
            sessionIdFromUrl,
            currentSessionId,
            validSessionId,
            currentTaskId,
            isAnalyzing: !!currentTaskId,
            isSubmitting  
        });
    }, [sessionIdFromUrl, currentSessionId, validSessionId, currentTaskId, isSubmitting]);

    const { refetch: refetchConversation } = useConversations(validSessionId);

    const { status: streamStatus } = useAnalysisStream(currentTaskId, {
        onComplete: (status) => {
            console.log('✅ Analysis completed:', status);

            // Extract session_id from SSE response
            if (status.session_id) {
                console.log('📝 Session ID from SSE:', status.session_id);
                setCurrentSessionId(status.session_id);

                // Update URL if needed
                if (!sessionIdFromUrl || sessionIdFromUrl !== status.session_id) {
                    console.log('🔄 Updating URL with session:', status.session_id);
                    router.push(`/?session=${status.session_id}`, { scroll: false });
                }
            }

            // Refetch conversation
            console.log('🔄 Refetching conversation...');
            refetchConversation();
            setCurrentTaskId(null);
        },
        onError: (error) => {
            console.error('❌ Analysis failed:', error);
            setCurrentTaskId(null);
        },
    });

    // Sync sessionId from URL (including clearing when URL has no session)
    useEffect(() => {
        console.log('🔄 URL changed:', { sessionIdFromUrl, currentSessionId });

        // CRITICAL FIX: Clear session when URL has no session param
        if (!sessionIdFromUrl && currentSessionId) {
            console.log('🆕 New chat detected - clearing current session');
            setCurrentSessionId(undefined);
        } else if (sessionIdFromUrl && sessionIdFromUrl !== currentSessionId) {
            console.log('🔄 Syncing sessionId from URL:', sessionIdFromUrl);
            setCurrentSessionId(sessionIdFromUrl);
        }
    }, [sessionIdFromUrl]); // Remove currentSessionId from dependencies

    useEffect(() => {
        if (submittedData) {
            console.log('📝 New task submitted:', submittedData.task_id);
            setCurrentTaskId(submittedData.task_id);

            // Extract session_id from submit response
            if (submittedData.session_id) {
                console.log('📝 Session ID from submit:', submittedData.session_id);
                setCurrentSessionId(submittedData.session_id);
            }
        }
    }, [submittedData]);

    const handleSubmit = (
        message: string,
        fileId: string | null,
        expertise: ExpertiseLevel
    ) => {
        console.log('🚀 Submitting analysis:', {
            message,
            fileId,
            sessionId: validSessionId
        });

        submit({
            query: message,
            fits_file_id: fileId || undefined,
            session_id: validSessionId,
            user_expertise: expertise,
        });
    };

    return (
        // <div className='h-full w-full flex flex-col'>
        <div className='h-full w-full flex flex-col bg-[#0f0f0f]'>
            <div className='flex-1 min-h-0 overflow-hidden'>
                <ConversationArea 
                    sessionId={validSessionId} 
                    isWaitingResponse={!!currentTaskId} 
                />
            </div>
            <div className='flex-shrink-0'>
                <PromptBox
                    onSubmit={handleSubmit}
                    // disabled={isSubmitting || !!currentTaskId}
                    isAnalyzing={!!currentTaskId}
                />
            </div>
        </div>
    );
}

export default function HomePage() {
    return (
        <Suspense
            fallback={
                <div className='flex items-center justify-center h-full'>
                    <Loader2 className='h-8 w-8 animate-spin text-violet-500' />
                </div>
            }
        >
            <DashboardContent />
        </Suspense>
    );
}