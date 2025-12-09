/*
lib/hooks/useAuth.ts

 Authentication Hook
*/

import { useMutation, useQuery } from  '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth.api';
import { useAuthStore } from '@/lib/stores/authStore';
import type { LoginCredentials, RegisterCredentials } from '@/lib/types';
import { toast, Toaster } from 'sonner';

export function useAuth() {
    const router = useRouter();
    const { setAuth, logout: logoutStore } = useAuthStore();

    // Register mutation
    const registerMutation = useMutation({
        mutationFn: authApi.register,
        onSuccess: () => {
            toast.success('Registration successful! Please login.');
            router.push('/login');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || 'Registration failed');
        },
    });

    // Login mutation
    const loginMutation = useMutation({
        mutationFn: authApi.login,
        onSuccess: async (data) => {

            try {
                // Store token FIRST
                const tempUser = {
                    user_id: 'temp',
                    email: '',
                    username: '',
                    is_active: true,
                    created_at: new Date().toISOString(),
                    last_login_at: null,
                }

                // Store token in Zustand BEFORE calling getCurrentUser
                setAuth(tempUser, data.access_token);
                        
                // Now axios interceptor can use the token
                const user = await authApi.getCurrentUser();

                // Update with real user data
                setAuth(user, data.access_token);

                toast.success('Login successful!');
                router.push('/');
            } catch (error: any) {
                console.error('Failed to get user info:', error);
                logoutStore();  // Clear invalid state
                toast.error('Failed to get user information');
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || 'Login failed');
        },
    });

    // Get current user query
    const { data: currentUser, isLoading} = useQuery({
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
            toast.info('Logged out successfully')
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
    };
}