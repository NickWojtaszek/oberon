// API Types for Verification endpoints

import type { VerificationPacket } from '../evidenceVerification';

// Request types
export interface RunLogicCheckRequest {
  manuscriptId: string;
  statisticalManifestId?: string;
  sections?: string[]; // Optional: check specific sections only
  deepCheck?: boolean; // Optional: run deep AI verification
}

export interface ApproveVerificationRequest {
  verificationId: string;
  piSignature: string;
  piName: string;
  comments?: string;
}

export interface AutoSyncVerificationRequest {
  verificationId: string;
  manuscriptId: string;
  targetSection: string;
}

export interface BatchApproveVerificationsRequest {
  verificationIds: string[];
  piSignature: string;
  piName: string;
}

// Response types
export interface VerificationListResponse {
  verifications: VerificationPacket[];
  total: number;
  summary: {
    verified: number;
    warnings: number;
    mismatches: number;
    pending: number;
  };
}

export interface VerificationResponse {
  verification: VerificationPacket;
}

export interface LogicCheckResponse {
  verifications: VerificationPacket[];
  summary: {
    totalClaims: number;
    verified: number;
    warnings: number;
    mismatches: number;
    conflicts: number;
  };
  processingTime: number; // milliseconds
}

export interface ApproveVerificationResponse {
  verification: VerificationPacket;
  message: string;
  approvedAt: number;
}

export interface AutoSyncResponse {
  success: boolean;
  manuscriptUpdated: boolean;
  verificationId: string;
  message: string;
}

export interface BatchApproveVerificationsResponse {
  approved: string[];
  failed: Array<{
    verificationId: string;
    error: string;
  }>;
}

// Query parameters
export interface GetVerificationsParams {
  manuscriptId?: string;
  status?: 'verified' | 'warning' | 'mismatch' | 'pending';
  page?: number;
  pageSize?: number;
}

// Verification status update
export interface UpdateVerificationStatusRequest {
  status: 'verified' | 'warning' | 'mismatch' | 'pending' | 'approved';
  notes?: string;
}

export interface UpdateVerificationStatusResponse {
  verification: VerificationPacket;
  message: string;
}
