// lib/validations/auth.schemas.ts

/**
 * Authentication Validation Schemas
 * Zod schemas for login and register forms
 */


import { z } from 'zod';

// ==========================================
// Login Schema
// ==========================================

export const loginSchema = z.object({
    username: z
    .string()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters')
    .regex(
        /^[a-zA-Z0-0_-]+$/,
        'Username can only contain letters, number, underscores, and hyphens'
    )
    .transform((val) => val.toLowerCase().trim()),

    password: z
    .string()
    .min(1, 'Pasword is required')
    .min(8, 'Password must be at least 8 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ==========================================
// Register Schema (for future use)
// ==========================================

export const registerSchema = z.object({
    username: z
        .string()
        .min(1, 'Username is required')
        .min(3, 'Username must be at least 3 characters')
        .max(50, 'Username must be less than 50 characters')
        .regex(
            /^[a-zA-Z0-9][a-zA-Z0-9_-]*$/,
            'Username can only contain letters, numbers, underscore, and hyphen'
        ),
    email: z
        .string()
        .email('Invalid email format')
        .optional()
        .or(z.literal('')),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password must be less than 100 characters'),
    confirmPassword: z
        .string()
        .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;