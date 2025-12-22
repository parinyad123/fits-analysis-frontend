// components/dashboard/Header.tsx

'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User, Settings } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useSessions } from '@/lib/hooks/useSessions';

export function Header() {
    const { currentUser, logout } = useAuth();
    const searchParams = useSearchParams();
    const currentSessionId = searchParams.get('session');
    const { sessions } = useSessions(0, 100);

    const currentSession = sessions.find((s) => s.session_id === currentSessionId);
    const title = currentSession?.title || 'New Chat';

    const initials = currentUser?.username
        ? currentUser.username.substring(0, 2).toUpperCase()
        : 'U';

    return (
        <header className='border-b border-gray-900 bg-[#0f0f0f] px-6 py-3'>
        {/* <header className='border-b border-gray-800 bg-transparent px-6 py-3'> */}
            <div className='flex items-center justify-between'>
                {/* Title */}
                <h4 className='text-base font-semibold text-white'>{title}</h4>

                {/* User Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            className='relative h-9 w-9 rounded-full hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-[#1A1825]'
                            aria-label='User menu'
                        >
                            <Avatar className='h-9 w-9'>
                                <AvatarFallback className='bg-[#0c314a] text-white font-semibold'>
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                        </button>
                    </DropdownMenuTrigger>
                    
                    <DropdownMenuContent align='end' className='w-56'>
                        <DropdownMenuLabel>
                            <div className='flex flex-col'>
                                <span className='text-sm font-medium'>
                                    {currentUser?.username}
                                </span>
                                {currentUser?.email && (
                                    <span className='text-xs text-gray-500'>
                                        {currentUser.email}
                                    </span>
                                )}
                            </div>
                        </DropdownMenuLabel>
                        {/* <DropdownMenuSeparator />
                        <DropdownMenuItem className='cursor-pointer'>
                            <User className='mr-2 h-4 w-4' />
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className='cursor-pointer'>
                            <Settings className='mr-2 h-4 w-4' />
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator /> */}
                        <DropdownMenuItem
                            className='text-red-500 cursor-pointer'
                            onClick={logout}
                        >
                            <LogOut className='mr-2 h-4 w-4' />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}