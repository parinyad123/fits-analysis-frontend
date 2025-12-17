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
    const { data, isLoading } = useConversations(sessionId);
    const containerRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom whenever messages change
    useEffect(() => {
        const scrollToBottom = () => {
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ 
                    behavior: 'auto', // ✅ เปลี่ยนจาก 'smooth' เป็น 'auto'
                    block: 'end'      // ✅ เพิ่ม block: 'end'
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

    if (isLoading) {
        return (
            <div className='flex items-center justify-center w-full h-full'>
                <Loader2 className='h-8 w-8 animate-spin text-violet-500' />
            </div>
        );
    }

    const messages = data?.messages || [];

    if (messages.length === 0) {
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

    return (
        <div
            ref={containerRef}
            className='w-full h-full overflow-y-auto overflow-x-hidden scrollbar-thin bg-[#0f0f0f]'
        >
            {/* ✅ เอา justify-end ออก เพราะ content สูงเกินพื้นที่ */}
            <div className='min-h-full flex flex-col'>
                <div className='flex-1' /> {/* ✅ Spacer ที่ยืดได้ */}
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