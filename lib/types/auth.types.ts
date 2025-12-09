/*
types/auth.types.ts

Authentication Types
*/

export interface User{
    user_id: string;
    username: string;
    email: string | null;
    is_active: boolean;
    created_at: string;
    last_login_at: string | null;
}

export interface RegisterCredentials {
    username: string;
    password: string;
    email?: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface TokenResponse {
    access_token: string;
    token_type: 'bearer';
    expires_in: number; // seconds
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface ApiResponse {
    message: string;
}