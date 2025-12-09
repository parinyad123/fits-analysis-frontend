/*
lib/api/auth.api.ts

Authentication API Endpoints
 */

import { apiClient, API_V1 } from './client';
import type {
    LoginCredentials,
    RegisterCredentials,
    TokenResponse,
    User,
    ApiResponse,
} from '@/lib/types';

export const authApi = {
    // Register new user
    register: async (credentials: RegisterCredentials): Promise<User> => {
        const { data } = await apiClient.post<User>(
            `${API_V1}/auth/register`,
            credentials
        );
        return data;
    },

    // Login user
    login: async (credentials: LoginCredentials): Promise<TokenResponse> => {
        const { data } =await apiClient.post<TokenResponse>(
            `${API_V1}/auth/login`,
            credentials
        );
        return data;
    },

    // Get current user info
    getCurrentUser: async (): Promise<User> => {
        const { data } = await apiClient.get<User>(`${API_V1}/auth/me`);
        return data;
    },

    // Logout (client-side token deletion)
    logout: async (): Promise<ApiResponse> => {
        const { data } = await apiClient.post<ApiResponse>(`${API_V1}/auth/logout`);
        return data;
    }
}