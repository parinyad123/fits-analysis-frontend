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

    // Helper function to extract error message
    const getErrorMessage = (error: AxiosError<any>): string => {
        console.log('🔍 Full error:', error);
        console.log('🔍 Response data:', error.response?.data);
        
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
        
        console.log('📝 Extracted message:', errorMessage);
        return errorMessage;
    };

    // Register mutation
    const registerMutation = useMutation({
        mutationFn: authApi.register,
        onSuccess: () => {
            toast.success('✅ Registration successful! Please login.', {
                duration: 5000,
                position: 'top-center',
            });
            router.replace('/login');
        },
        onError: (error: AxiosError<any>) => {
            console.error('❌ Registration error:', error);
            
            let errorMessage = getErrorMessage(error);
            
            if (errorMessage.toLowerCase().includes('already registered') || 
                errorMessage.toLowerCase().includes('already exists') || 
                errorMessage.toLowerCase().includes('duplicate')) {
                const usernameMatch = errorMessage.match(/:\s*(\w+)/);
                const username = usernameMatch ? usernameMatch[1] : '';
                
                if (username) {
                    errorMessage = `⚠️ Username "${username}" is already taken. Please choose another.`;
                } else {
                    errorMessage = '⚠️ This username is already taken. Please choose another.';
                }
            }
            
            toast.error(errorMessage, {
                duration: 8000, // ✅ เพิ่มเป็น 8 วินาที
                position: 'top-center',
            });
        },
    });

    // Login mutation
    const loginMutation = useMutation({
        mutationFn: authApi.login,
        onSuccess: async (data) => {
            console.log('✅ Login successful');
            
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

                toast.success('✅ Login successful!', {
                    duration: 3000,
                });
                
                // ✅ Small delay before redirect to show toast
                setTimeout(() => {
                    router.push('/');
                }, 500);
            } catch (error: any) {
                console.error('❌ Failed to get user info:', error);
                logoutStore();
                toast.error('Failed to get user information', {
                    duration: 8000,
                    position: 'top-center',
                });
            }
        },
        onError: (error: AxiosError<any>) => {
            console.error('❌ Login error:', error);
            
            let errorMessage = getErrorMessage(error);
            
            // ✅ Handle 401 Unauthorized
            if (error.response?.status === 401) {
                errorMessage = '⚠️ Incorrect username or password. Please try again.';
            }
            // ✅ Handle other common errors
            else if (error.code === 'ERR_NETWORK') {
                errorMessage = '⚠️ Network error. Please check your connection.';
            }
            
            // ✅ Show toast with longer duration
            toast.error(errorMessage, {
                duration: 10000, // ✅ 10 วินาที สำหรับ login error
                position: 'top-center',
            });
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
            toast.info('👋 Logged out successfully', {
                duration: 3000,
            });
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
        registerError: registerMutation.error,
        loginError: loginMutation.error,
    };
}