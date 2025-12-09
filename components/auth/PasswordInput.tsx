// components/auth/PasswordInput.tsx

/**
 * Password Input with Show/Hide Toggle
 */

'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface PasswordInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: boolean;
    id?: string;
    name?: string;
}

export function PasswordInput({
    value,
    onChange,
    placeholder = 'Enter your password',
    disabled = false,
    error = false,
    id = 'password',
    name= 'password',
}: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative">
            <Input
            id={id}
            name={name}
            type={showPassword ? 'text': 'password'}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={error ? 'bored-rad-500 focus-visible:ring-red-500': ''}
            />

            <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
            tabIndex={-1}
            >
                {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                ): (
                    <Eye className="h-4 w-4 text-gray-500" />
                )}
                <span className='sr-only'>
                    {showPassword ? 'Hide password' : 'Show password'}
                </span>
            </Button>
        </div>
    );
}