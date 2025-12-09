// components/auth/LoginForm.tsx

/**
 * Login Form Component
 * Username + Password authentication
 */

'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

import { useAuth } from '@/lib/hooks/useAuth';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth.schemas';
import { PasswordInput } from './PasswordInput';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export function LoginForm() {
    const { login, isLoggingIn } = useAuth();
    const [rememberMe, setRememberMe] = useState(false);
    const [mounted, setMounted] = useState(false);  // Track if component mounted

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const passwordValue = watch('password');

    // Load remembered username (client-side only)
    useEffect(() => {
        setMounted(true);       // Mark as mounted

        const remembered = localStorage.getItem('remember_username');
        if (remembered) {
            setValue('username', remembered);
            setRememberMe(true);
        }
    }, [setValue]);

    const onSubmit = (data: LoginFormData) => {
        if (rememberMe) {
            localStorage.setItem('remember_username', data.username);
        } else {
            localStorage.removeItem('remember_username');
        }
        login(data);
    };

    // Load remembered username on mount
    // useState(() => {
    //     const remembered = localStorage.getItem('remember_username');
    //     if (remembered) {
    //         setValue('username', remembered);
    //         setRememberMe(true);
    //     }
    // });

    // Show loading skeleton during SSR to prevent hydration mismatch
    if (!mounted) {
        return (
            <div className='w-full max-w-md space-y-8'>
                <div className='text-center'>
                    <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/10'>
                        <span className='text-2xl'>🔭</span>
                    </div>
                    <h1 className='text-2xl fint-bold tracking-tih=ght text-white'>
                        FITS Analysis Application
                    </h1>
                    <p className='mt-2 text-sm text-gray-400'>
                        Sign in to your account
                    </p>
                </div>
                <div className='space-y-6 animate-pulse'>
                    <div className='h-10 bg-gray-800 rounded'></div>
                    <div className='h-10 bg-gray-800 rounded'></div>
                    <div className='h-10 bg-violet-500/20 rounded'></div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className='text-center'>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/10">
                    <span className="text-2xl">🔭</span>
                </div>
                <h1 className='text-2xl font-bold tracking-tight text-white'>
                    FITS Analysis Application
                </h1>
                <p className="mt-2 text-sm text-gray-400">
                    Sign in to your account
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Username Field */}
                <div className='space-y-2'>
                    <Label htmlFor='username' className='text-gray-300'>
                        Username
                    </Label>
                    <Input 
                        id="username"
                        type='text'
                        placeholder='john_doe'
                        disabled={isLoggingIn}
                        className={errors.username ? 'border-red-500 focus-visible:ring-red-500' : ''}
                        {...register('username')}
                    ></Input>
                    {errors.username && (
                        <p className="text-sm text-red-500">
                            {errors.username.message}
                        </p>
                    )}
                </div>

                {/* Password Field */}
                <div className='space-y-2'>
                    <Label htmlFor='password' className='text-gray-300'>
                        Password
                    </Label>
                        <PasswordInput 
                            id='password'
                            name='password'
                            value={passwordValue}
                            onChange={(value) => setValue('password', value)}
                            placeholder='Enter your password'
                            disabled={isLoggingIn}
                            error={!!errors.password}
                        />

                        {errors.password && (
                            <p className='text-sm text-red-500'>
                                {errors.password.message}
                            </p>
                        )}
                </div>

                {/* Remember Me */}
                <div className='flex items-center space-x-2'>
                    <Checkbox
                        id='remember'
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked === true)}
                        disabled={isLoggingIn}
                    />
                    <label
                        htmlFor='remember'
                        className='text-sm font-medium leading-none tect-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                    >
                        Remember me
                    </label>
                </div>

                {/* Submit Button */}
                <Button
                    type='submit'
                    className='w-full'
                    disabled={isLoggingIn}
                >
                    {isLoggingIn ? (
                        <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                        Signing in...
                        </>
                    ) : (
                        'Sign in'
                    )}
                </Button>

                {/* Divider */}
                <div className='relative'>
                    <div className='absolute inset-0 flex items-center'>
                        <span className='w-full border-t border-gray-700'></span>
                    </div>
                    <div className='relative flex justify-center text-xs uppercase'>
                        <span className='bg-[#1F1D3E] px-2 text-gray-400'>
                            or
                        </span>
                    </div>
                </div>

                {/* Register Link */}
                <div className='text-center text-sm'>
                    <span className='text-gray-400'>Don't have an account?</span>{' '}
                    <Link
                        href='/register'
                        className='font-medium text-blue-400 hover:text-blue-300 transition-colors'
                    >
                            Create one
                    </Link>
                </div>
            </form>
        </div>
    );
}

 

