// components/dashboard/MessageBubble.tsx (Complete)

'use client';

import { cn } from '@/lib/utils';
import type { ConversationMessageLight } from '@/lib/types';
import { User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import type { Components } from 'react-markdown';
import 'katex/dist/katex.min.css';

interface MessageBubbleProps {
    message: ConversationMessageLight;
}

function getImageUrl(src: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';
    
    if (src.startsWith('http://') || src.startsWith('https://')) {
        return src;
    }
    
    if (src.startsWith('/')) {
        return `${baseUrl}${src}`;
    }
    
    return `${baseUrl}/${src}`;
}

export function MessageBubble({ message }: MessageBubbleProps) {
    const isUser = message.role === 'user';

    const markdownComponents: Components = {
        img: ({ src, alt, ...props }) => {
            // Type-safe src handling
            if (!src || typeof src !== 'string') {
                return null;
            }
            
            const imageUrl = getImageUrl(src);
            
            return (
                <img
                    src={imageUrl}
                    alt={alt || ''}
                    className='rounded-lg my-4 max-w-full'
                    loading='lazy'
                    {...props}
                />
            );
        },
    };

    return (
        <div className='w-full py-6 border-b border-gray-800/50'>
            <div className='max-w-4xl mx-auto px-4'>
                <div className='flex gap-4'>
                    <div
                        className={cn(
                            'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                            isUser ? 'bg-blue-500' : 'bg-violet-500'
                        )}
                    >
                        {isUser ? (
                            <User className='w-5 h-5 text-white' />
                        ) : (
                            <Bot className='w-5 h-5 text-white' />
                        )}
                    </div>

                    <div className='flex-1 min-w-0'>
                        {isUser ? (
                            <div className='bg-gray-800 rounded-2xl px-5 py-3 inline-block max-w-[80%]'>
                                <p className='text-gray-100 whitespace-pre-wrap'>
                                    {message.content}
                                </p>
                            </div>
                        ) : (
                            <div className='text-gray-100'>
                                <div className='prose-chat prose-sm'>
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm, remarkMath]}
                                        rehypePlugins={[rehypeKatex]}
                                        components={markdownComponents}
                                    >
                                        {message.content}
                                    </ReactMarkdown>
                                </div>

                                {message.plots && message.plots.length > 0 && (
                                    <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-4'>
                                        {message.plots.map((plot) => (
                                            <div
                                                key={plot.plot_id}
                                                className='bg-gray-800/50 rounded-lg p-3 border border-gray-700 hover:border-gray-600 transition-colors'
                                            >
                                                <img
                                                    src={getImageUrl(plot.plot_url)}
                                                    alt={plot.title}
                                                    className='w-full rounded-lg'
                                                    loading='lazy'
                                                />
                                                <p className='text-sm text-gray-400 mt-2'>
                                                    {plot.title}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <p className='text-xs text-gray-500 mt-2'>
                            {new Date(message.created_at).toLocaleTimeString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}