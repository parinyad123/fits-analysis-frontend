'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAnalysis } from '@/lib/hooks/useAnalysis';
import { useAnalysisStream } from '@/lib/hooks/useAnalysisStream';
import { useConversations } from '@/lib/hooks/useConversations';
import { ConversationArea } from '@/components/dashboard/ConversationArea';
import { PromptBox } from '@/components/dashboard/PromptBox';
import type { ExpertiseLevel } from '@/lib/types';
import { Loader2 } from 'lucide-react';

function DashboardContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session') || undefined;
    const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);

    const { submit, isSubmitting, submittedData } = useAnalysis();
    const { refetch: refetchConversation } = useConversations(sessionId);

    const { status: streamStatus } = useAnalysisStream(currentTaskId, {
        onComplete: () => {
            refetchConversation();
            setCurrentTaskId(null);
        },
        onError: () => {
            setCurrentTaskId(null);
        },
    });

    useEffect(() => {
        if (submittedData) {
            setCurrentTaskId(submittedData.task_id);
        }
    }, [submittedData]);

    const handleSubmit = (
        message: string,
        fileId: string | null,
        expertise: ExpertiseLevel
    ) => {
        submit({
            query: message,
            fits_file_id: fileId || undefined, // send undefined if fileId is null
            session_id: sessionId,
            user_expertise: expertise,
        });
    };

    return (
        <div className='h-full w-full flex flex-col'>
            <div className='flex-1 min-h-0 overflow-hidden'>
                <ConversationArea sessionId={sessionId} />
            </div>
            <div className='flex-shrink-0'>
                <PromptBox
                    onSubmit={handleSubmit}
                    disabled={isSubmitting || !!currentTaskId}
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