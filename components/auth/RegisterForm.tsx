// components/auth/RegisterForm.tsx

'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

import { useAuth } from '@/lib/hooks/useAuth';
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth.schemas';
import { PasswordInput } from './PasswordInput';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AxiosError } from 'axios';

export function RegisterForm() {
    const { register: registerUser, isRegistering, registerError } = useAuth();
    const [mounted, setMounted] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const passwordValue = watch('password');
    const confirmPasswordValue = watch('confirmPassword');

    useEffect(() => {
        setMounted(true);
    }, []);

    // ✅ Extract error message from AxiosError
    const getApiErrorMessage = (): string | null => {
        if (!registerError) return null;
        
        const axiosError = registerError as AxiosError<any>;
        
        if (axiosError.response?.data) {
            if (typeof axiosError.response.data === 'string') {
                return axiosError.response.data;
            }
            if (axiosError.response.data.detail) {
                const detail = axiosError.response.data.detail;
                return typeof detail === 'string' ? detail : JSON.stringify(detail);
            }
            if (axiosError.response.data.message) {
                return axiosError.response.data.message;
            }
        }
        
        if (axiosError.message) {
            return axiosError.message;
        }
        
        return 'Registration failed';
    };

    const apiErrorMessage = getApiErrorMessage();

    const onSubmit = (data: RegisterFormData) => {
        registerUser({
            username: data.username.toLowerCase().trim(),
            password: data.password,
            email: data.email?.trim() || undefined,
        });
    };

    // Show loading skeleton during SSR
    if (!mounted) {
        return (
            <div className='w-full max-w-md space-y-8'>
                <div className='text-center'>
                    <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/10'>
                        <span className='text-2xl'>🔭</span>
                    </div>
                    <h1 className='text-2xl font-bold tracking-tight text-white'>
                        FITS Analysis Application
                    </h1>
                    <p className='mt-2 text-sm text-gray-400'>
                        Create your account
                    </p>
                </div>
                <div className='space-y-6 animate-pulse'>
                    <div className='h-10 bg-gray-800 rounded'></div>
                    <div className='h-10 bg-gray-800 rounded'></div>
                    <div className='h-10 bg-gray-800 rounded'></div>
                    <div className='h-10 bg-gray-800 rounded'></div>
                    <div className='h-10 bg-violet-500/20 rounded'></div>
                </div>
            </div>
        );
    }

    return (
        <div className='w-full max-w-md space-y-8'>
            {/* Header */}
            <div className='text-center'>
                <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/10'>
                    <span className='text-2xl'>🔭</span>
                </div>
                <h1 className='text-2xl font-bold tracking-tight text-white'>
                    FITS Analysis Application
                </h1>
                <p className='mt-2 text-sm text-gray-400'>
                    Create your account
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                {/* ✅ General API Error */}
                {apiErrorMessage && (
                    <div className='rounded-lg bg-red-500/10 border border-red-500/50 p-3'>
                        <p className='text-sm text-red-500'>{apiErrorMessage}</p>
                    </div>
                )}

                {/* Username Field */}
                <div className='space-y-2'>
                    <Label htmlFor='username' className='text-gray-300'>
                        Username
                    </Label>
                    <Input
                        id='username'
                        type='text'
                        placeholder='john_doe'
                        disabled={isRegistering}
                        className={errors.username ? 'border-red-500 focus-visible:ring-red-500' : ''}
                        {...register('username')}
                    />
                    {errors.username && (
                        <p className='text-sm text-red-500'>
                            {errors.username.message}
                        </p>
                    )}
                </div>

                {/* Email Field */}
                <div className='space-y-2'>
                    <Label htmlFor='email' className='text-gray-300'>
                        Email <span className='text-gray-500 text-sm'>(optional)</span>
                    </Label>
                    <Input
                        id='email'
                        type='email'
                        placeholder='john@example.com'
                        disabled={isRegistering}
                        className={errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}
                        {...register('email')}
                    />
                    {errors.email && (
                        <p className='text-sm text-red-500'>
                            {errors.email.message}
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
                        disabled={isRegistering}
                        error={!!errors.password}
                    />
                    {errors.password && (
                        <p className='text-sm text-red-500'>
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {/* Confirm Password Field */}
                <div className='space-y-2'>
                    <Label htmlFor='confirmPassword' className='text-gray-300'>
                        Confirm Password
                    </Label>
                    <PasswordInput
                        id='confirmPassword'
                        name='confirmPassword'
                        value={confirmPasswordValue}
                        onChange={(value) => setValue('confirmPassword', value)}
                        placeholder='Confirm your password'
                        disabled={isRegistering}
                        error={!!errors.confirmPassword}
                    />
                    {errors.confirmPassword && (
                        <p className='text-sm text-red-500'>
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <Button
                    type='submit'
                    className='w-full'
                    disabled={isRegistering}
                >
                    {isRegistering ? (
                        <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Creating account...
                        </>
                    ) : (
                        'Create account'
                    )}
                </Button>

                {/* Divider */}
                <div className='relative'>
                    <div className='absolute inset-0 flex items-center'>
                        <span className='w-full border-t border-gray-700'></span>
                    </div>
                    <div className='relative flex justify-center text-xs uppercase'>
                        <span className='bg-[#0C0A1D] px-2 text-gray-400'>
                            or
                        </span>
                    </div>
                </div>

                {/* Login Link */}
                <div className='text-center text-sm'>
                    <span className='text-gray-400'>Already have an account?</span>{' '}
                    <Link
                        href='/login'
                        className='font-medium text-blue-400 hover:text-blue-300 transition-colors'
                    >
                        Sign in
                    </Link>
                </div>
            </form>
        </div>
    );
}