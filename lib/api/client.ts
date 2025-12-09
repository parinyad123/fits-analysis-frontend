/*
lib/api/client.ts

Axios Client with Interceptors
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/lib/stores/authStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = useAuthStore.getState().token;

        console.log('Token from store:', token ? `${token.substring(0,20)}...`: 'No Token')

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;

            console.log('Sending request to:', config.url);
            console.log('Authorization header:', config.headers.Authorization?.substring(0,30) + '...');
        }

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        // debug logging
        console.error('❌ API Error:', {
            status: error.response?.status,
            url: error.config?.url,
            data: error.response?.data
        });
        if (error.response?.status === 401) {
            // Token expired or invalid
            useAuthStore.getState().logout();

            // Redirect to login
            if (typeof window !== 'undefined') {
            window.location.href = '/login';
            }
        }

        return Promise.reject(error)
    }
);

// Export API versions
export const API_V1 = '/api/v1';
export const API_V2 = '/api/v2';