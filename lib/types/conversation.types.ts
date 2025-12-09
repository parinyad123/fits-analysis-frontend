/*
lib/types/conversation.types.ts

Conversation & Session Types
*/

import { PlotInfo, UserRole } from './api.types';

// ============================================
// Session
// ============================================

export interface SessionInfo {
    session_id: string;
    title: string;
    created_at: string;
    last_message_at: string;
    message_count: number;
}

export interface SessionListResponse {
    sessions: SessionInfo[];
    total: number;
    has_more: boolean;
    next_offset: number | null;
}

// ============================================
// Messages
// ============================================

export interface ConversationMessageLight {
    message_id: string;
    role: UserRole;
    content: string;
    created_at: string;
    plots: PlotInfo[] | null;
}

export interface ConversationResponse {
    session_id: string;
    messages: ConversationMessageLight[];
    total: number;
    has_more: boolean;
    next_offset: number | null;
}

// ============================================
// Message Count
// ============================================

export interface MessageCountResponse {
    session_id: string;
    total_messages: number;
}