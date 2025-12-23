/*
 lib/types/analysis.types.ts
 
Analysis & Workflow Types
 */

import { PlotInfo, WorkflowStatus, ExpertiseLevel } from "./api.types";

// ============================================
// Analysis Request
// ============================================

export interface AnalyzeRequest {
    query: string;
    fits_file_id?: string;
    session_id?: string;
    user_expertise?: ExpertiseLevel;
    // analysis_types?: string[];
    // parameters?: Record<string, any>;
}

export interface AnalyzeResponse {
    task_id: string;
    session_id: string;
    status: WorkflowStatus;
}

// ============================================
// Workflow Status
// ============================================

export interface WorkflowStatusLight {
  task_id: string;
  status: WorkflowStatus;
  progress: string;
  current_step: string | null;
  error: string | null;
}

// export interface WorkflowStatusFull extends WorkflowStatusLight {
//   routing_strategy: string | null;
//   completed_steps: any[] | null;
//   created_at: string | null;
//   completed_at: string | null;
// }

// ============================================
// Analysis Result
// ============================================

export interface AnalysisResultLight {
  task_id: string;
  status: WorkflowStatus;
  content: string;
  plots: PlotInfo[];
  completed_at: string | null;
}

// ============================================
// SSE Event
// ============================================

export interface SSEStatusEvent {
  task_id: string;
  status: WorkflowStatus;
  progress: string;
  current_step: string | null;
  error: string | null;
}