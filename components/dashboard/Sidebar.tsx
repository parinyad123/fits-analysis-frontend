// components/dashboard/Sidebar.tsx

'use client';

import { useSessions } from '@/lib/hooks/useSessions';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
    PlusCircle,
    MessageSquare,
    ChevronLeft,
    ChevronRight,
    Trash2,
    MoreVertical,
    SquarePen,
    NotebookPen
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

interface SidebarProps {
    collapsed: boolean;
    onToggleCollapse: () => void;
}

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSessionId = searchParams.get('session');

    const { sessions, deleteSession } = useSessions(0, 50);

    const handleNewChat = () => {
        router.push('/');
        toast.success('Started new chat');
    };

    const handleSelectSession = (sessionId: string) => {
        router.push(`/?session=${sessionId}`);
    };

    const handleDeleteSession = async (sessionId: string, title: string) => {
        if (confirm(`Delete "${title}"?`)) {
            deleteSession(sessionId);
            if (currentSessionId === sessionId) {
                router.push('/');
            }
        }
    };

    return (
        <aside
            className={cn(
                'relative border-r border-gray-800 bg-[#1A1825] transition-all duration-300',
                collapsed ? 'w-16' : 'w-72'
            )}
        >
            {/* Header */}
            <div className='flex items-center justify-between p-4'>
                {!collapsed && (
                    <div className='flex items-center gap-2'>
                        <span className='text-xl'>🔭</span>
                        <h1 className='text-lg font-semibold text-white whitespace-nowrap'>FITS Analysis</h1>
                    </div>
                )}
                <Button
                    variant='ghost'
                    size='icon'
                    onClick={onToggleCollapse}
                    className='text-gray-400 hover:text-white'
                >
                    {collapsed ? (
                        <ChevronRight className='h-5 w-5' />
                    ) : (
                        <ChevronLeft className='h-5 w-5' />
                    )}
                </Button>
            </div>

            {/* New Chat Button */}
            <div className='p-3'>
                <Button
                    onClick={handleNewChat}
                    className='w-full justify-start gap-2'
                    variant='default'
                >
                    <SquarePen className='h-4 w-4' />
                    {!collapsed && <span>New Chat</span>}
                </Button>
            </div>

            {/* Recent Chats */}
            {!collapsed && (
                <div className='px-3 pt-6'>
                    <h2 className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 whitespace-nowrap'>
                        YOUR CHATS
                    </h2>
                    <ScrollArea className='h-[calc(100vh-200px)]'>
                        <div className='space-y-1'>
                            {sessions.map((session) => (
                                <div
                                    key={session.session_id}
                                    className={cn(
                                        'group relative rounded-lg transition-colors',
                                        currentSessionId === session.session_id
                                            ? 'bg-gray-800'
                                            : 'hover:bg-gray-800/50'
                                    )}
                                >
                                    {/* Main clickable area */}
                                    <div
                                        onClick={() => handleSelectSession(session.session_id)}
                                        className='flex items-center gap-2 px-3 py-2 pr-10 cursor-pointer text-sm'
                                    >
                                        {/* <MessageSquare className='h-4 w-4 flex-shrink-0 text-gray-400' /> */}
                                        <span
                                            className={cn(
                                                'truncate',
                                                currentSessionId === session.session_id
                                                    ? 'text-white'
                                                    : 'text-gray-400'
                                            )}
                                        >
                                            {session.title}
                                        </span>
                                    </div>

                                    {/* Dropdown menu */}
                                    <div className='absolute right-2 top-1/2 -translate-y-1/2'>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button
                                                    className='h-6 w-6 rounded-md opacity-0 group-hover:opacity-100 hover:bg-gray-700 transition-opacity flex items-center justify-center'
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <MoreVertical className='h-3 w-3 text-gray-400' />
                                                    <span className='sr-only'>More options</span>
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align='end'>
                                                <DropdownMenuItem
                                                    className='text-red-500 cursor-pointer'
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteSession(
                                                            session.session_id,
                                                            session.title
                                                        );
                                                    }}
                                                >
                                                    <Trash2 className='mr-2 h-4 w-4' />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))}

                            {sessions.length === 0 && (
                                <p className='text-center text-sm text-gray-500 py-4'>
                                    No recent chats
                                </p>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            )}
        </aside>
    );
}