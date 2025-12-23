// components/dashboard/ConversationArea.tsx

'use client';

import { useEffect, useRef } from 'react';
import { useConversations } from '@/lib/hooks/useConversations';
import { MessageBubble } from './MessageBubble';
import { Loader2 } from 'lucide-react';

interface ConversationAreaProps {
    sessionId: string | undefined;
}

export function ConversationArea({ sessionId }: ConversationAreaProps) {

    // Debug log: sessionId 
    useEffect(() => {
        console.log('📊 ConversationArea received sessionId:', sessionId);
    }, [sessionId]);

    const { data, isLoading, error, refetch  } = useConversations(sessionId);
    const containerRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Debug log: query
    useEffect(() => {
        console.log('📊 ConversationArea state:', {
            sessionId,
            hasData: !!data,
            messagesCount: data?.messages?.length || 0,
            isLoading,
            error: error ? String(error) : null
        });
    }, [sessionId, data, isLoading, error]);

    // Scroll to bottom whenever messages change
    useEffect(() => {
        const scrollToBottom = () => {
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ 
                    behavior: 'auto',
                    block: 'end'
                });
            }
        };

        // Scroll immediately
        scrollToBottom();

        // Scroll again after a short delay (for images/content loading)
        const timer = setTimeout(scrollToBottom, 100);
        
        return () => clearTimeout(timer);
    }, [data?.messages]);

    // Initial scroll when session loads
    useEffect(() => {
        if (containerRef.current) {
            // Force scroll to bottom
            requestAnimationFrame(() => {
                if (containerRef.current) {
                    containerRef.current.scrollTop = containerRef.current.scrollHeight;
                }
            });
        }
    }, [sessionId]);

    // Loading state
    if (isLoading) {
        console.log('⏳ Loading conversation...');
        return (
            <div className='flex items-center justify-center w-full h-full'>
                <Loader2 className='h-8 w-8 animate-spin text-violet-500' />
                <span className='ml-2 text-gray-400'>Loading conversation...</span>
            </div>
        );
    }

    // Error state
    if (error) {
        console.error('❌ Conversation error:', error);
        return (
            <div className='flex flex-col items-center justify-center w-full h-full text-center px-4'>
                <div className='mb-4'>
                    <span className='text-6xl'>❌</span>
                </div>
                <h2 className='text-xl font-semibold text-red-500 mb-2'>
                    Failed to load conversation
                </h2>
                <p className='text-gray-400 mb-4'>
                    {error instanceof Error ? error.message : 'Unknown error'}
                </p>
                <button 
                    onClick={() => {
                        console.log('🔄 Retrying conversation fetch...');
                        refetch();
                    }}
                    className='px-4 py-2 bg-violet-500 text-white rounded hover:bg-violet-600 transition'
                >
                    Retry
                </button>
            </div>
        );
    }

    // No session selected
    // if (!sessionId) {
    //     console.log('ℹ️ No session selected');
    //     return (
    //         <div className='flex flex-col items-center justify-center w-full h-full text-center px-4 bg-[#0f0f0f]'>
    //             <div className='mb-6'>
    //                 <span className='text-6xl'>💬</span>
    //             </div>
    //             <h2 className='text-2xl font-semibold text-white mb-2'>
    //                 No conversation selected
    //             </h2>
    //             <p className='text-gray-400 max-w-md'>
    //                 Select a conversation from the sidebar or start a new one
    //             </p>
    //         </div>
    //     );
    // }

    const messages = data?.messages || [];

    // Empty conversation
    if (!sessionId || messages.length === 0) {
        console.log('ℹ️ Empty conversation, showing welcome message');
        return (
            <div className='flex flex-col items-center justify-center w-full h-full text-center px-4 bg-[#0f0f0f]'>
                <div className='mb-6'>
                    <span className='text-6xl'>🔭</span>
                </div>
                <h2 className='text-2xl font-semibold text-white mb-2'>
                    Welcome to FITS Analysis
                </h2>
                <p className='text-gray-400 max-w-md'>
                    Upload a FITS file and ask questions about your X-ray astronomy data.
                    I can help with PSD analysis, Power law fitting, and Bending Power law.
                </p>
            </div>
        );
    }

    // Render messages
    console.log(`✅ Rendering ${messages.length} messages`);
    return (
        <div
            ref={containerRef}
            className='w-full h-full overflow-y-auto overflow-x-hidden scrollbar-thin bg-[#0f0f0f]'
        >
            <div className='min-h-full flex flex-col'>
                <div className='flex-1' />
                <div className='pb-4'>
                    {messages.map((message) => (
                        <MessageBubble key={message.message_id} message={message} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>
        </div>
    );
}