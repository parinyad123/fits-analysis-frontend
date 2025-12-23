// lib/api/client.ts

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/lib/stores/authStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';

// Create axios instance
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    withCredentials: true,  // send cookies for all request
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = useAuthStore.getState().token;

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error: AxiosError) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<any>) => {
        // Enhanced error logging
        console.error('❌ API Error:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            url: error.config?.url,
            method: error.config?.method?.toUpperCase(),
            responseData: error.response?.data,
        });

        // Check if this is an auth endpoint (login/register)
        const isAuthEndpoint = 
            error.config?.url?.includes('/auth/login') || 
            error.config?.url?.includes('/auth/register');

        // Only handle 401 for non-auth endpoints
        // If user is already on login page, don't logout again
        if (error.response?.status === 401 && !isAuthEndpoint) {
            console.log('🔒 Unauthorized - clearing auth and redirecting to login');
            
            useAuthStore.getState().logout();
            
            // Only redirect if not already on login page
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

// Export API versions
export const API_V1 = '/api/v1';
export const API_V2 = '/api/v2';