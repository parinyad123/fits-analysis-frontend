'use client';

import { useEffect, useRef } from 'react';
import { useConversations } from '@/lib/hooks/useConversations';
import { MessageBubble } from './MessageBubble';
import { Loader2 } from 'lucide-react';

interface ConversationAreaProps {
    sessionId: string | undefined;
}

export function ConversationArea({ sessionId }: ConversationAreaProps) {
    const { data, isLoading } = useConversations(sessionId);
    const containerRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [data?.messages]);

    // Initial scroll to bottom when session loads
    useEffect(() => {
        if (containerRef.current && data?.messages && data.messages.length > 0) {
            setTimeout(() => {
                if (containerRef.current) {
                    containerRef.current.scrollTop = containerRef.current.scrollHeight;
                }
            }, 100);
        }
    }, [sessionId]);

    if (isLoading) {
        return (
            <div className='flex items-center justify-center h-full'>
                <Loader2 className='h-8 w-8 animate-spin text-violet-500' />
            </div>
        );
    }

    const messages = data?.messages || [];

    if (messages.length === 0) {
        return (
            <div className='flex flex-col items-center justify-center h-full text-center px-4'>
                <div className='mb-6'>
                    <span className='text-6xl'>🔭</span>
                </div>
                <h2 className='text-2xl font-semibold text-white mb-2'>
                    Welcome to FITS Analysis
                </h2>
                <p className='text-gray-400 max-w-md'>
                    Upload a FITS file and ask questions about your X-ray astronomy data.
                    I can help with PSD analysis, power law fitting, and more.
                </p>
            </div>
        );
    }

    return (
    <div
        ref={containerRef}
        className='h-full w-full overflow-y-auto overflow-x-hidden scrollbar-thin'
        style={{ border: '3px solid red' }} // 🔴 ConversationArea
    >
        <div 
            className='min-h-full flex flex-col justify-end'
            style={{ border: '3px solid blue' }} // 🔵 Inner wrapper
        >
            <div 
                className='pb-4'
                style={{ border: '3px solid green' }} // 🟢 Messages
            >
                {messages.map((message) => (
                    <MessageBubble key={message.message_id} message={message} />
                ))}
                <div ref={messagesEndRef} />
            </div>
        </div>
    </div>
);
}