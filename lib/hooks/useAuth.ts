// lib/hooks/useAuth.ts

import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth.api';
import { useAuthStore } from '@/lib/stores/authStore';
import type { LoginCredentials, RegisterCredentials } from '@/lib/types';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export function useAuth() {
    const router = useRouter();
    const { setAuth, logout: logoutStore } = useAuthStore();

    // ✅ Helper function to extract error message
    const getErrorMessage = (error: AxiosError<any>): string => {
        let errorMessage = 'An error occurred';
        
        if (error.response?.data) {
            if (typeof error.response.data === 'string') {
                errorMessage = error.response.data;
            } else if (error.response.data.detail) {
                errorMessage = typeof error.response.data.detail === 'string' 
                    ? error.response.data.detail
                    : JSON.stringify(error.response.data.detail);
            } else if (error.response.data.message) {
                errorMessage = error.response.data.message;
            } else if (error.response.data.error) {
                errorMessage = error.response.data.error;
            }
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        return errorMessage;
    };

    // Register mutation
    const registerMutation = useMutation({
        mutationFn: authApi.register,
        onSuccess: () => {
            toast.success('Registration successful! Please login.');
            router.replace('/login');
        },
        onError: (error: AxiosError<any>) => {
            console.error('Registration error:', error);
            
            let errorMessage = getErrorMessage(error);
            
            // Handle specific status codes
            if (error.response?.status === 400) {
                if (errorMessage.toLowerCase().includes('already exists') || 
                    errorMessage.toLowerCase().includes('duplicate')) {
                    errorMessage = 'Username already exists. Please choose another username.';
                }
            }
            
            // Default to toast (will be overridden by onError callback if provided)
            toast.error(errorMessage);
        },
    });

    // Login mutation
    const loginMutation = useMutation({
        mutationFn: authApi.login,
        onSuccess: async (data) => {
            try {
                const tempUser = {
                    user_id: 'temp',
                    email: '',
                    username: '',
                    is_active: true,
                    created_at: new Date().toISOString(),
                    last_login_at: null,
                };

                setAuth(tempUser, data.access_token);
                const user = await authApi.getCurrentUser();
                setAuth(user, data.access_token);

                toast.success('Login successful!');
                router.push('/');
            } catch (error: any) {
                console.error('Failed to get user info:', error);
                logoutStore();
                toast.error('Failed to get user information');
            }
        },
        onError: (error: AxiosError<any>) => {
            console.error('Login error:', error);
            
            let errorMessage = getErrorMessage(error);
            
            if (error.response?.status === 401) {
                errorMessage = 'Incorrect username or password';
            }
            
            // Default to toast (will be overridden by onError callback if provided)
            toast.error(errorMessage);
        },
    });

    // Get current user query
    const { data: currentUser, isLoading } = useQuery({
        queryKey: ['currentUser'],
        queryFn: authApi.getCurrentUser,
        enabled: !!useAuthStore.getState().token,
        retry: false,
    });

    // Logout function
    const logout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            // Ignore errors
        } finally {
            logoutStore();
            router.push('/login');
            toast.info('Logged out successfully');
        }
    };

    return {
        register: registerMutation.mutate,
        login: loginMutation.mutate,
        logout,
        currentUser,
        isLoading,
        isRegistering: registerMutation.isPending,
        isLoggingIn: loginMutation.isPending,
        // ✅ Expose error states
        registerError: registerMutation.error,
        loginError: loginMutation.error,
    };
}