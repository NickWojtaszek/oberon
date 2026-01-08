// Ethics & IRB Types - Regulatory Compliance System

export type IRBStatus = 'PENDING' | 'APPROVED' | 'EXPIRED' | 'REJECTED' | 'NONE';
export type SubmissionType = 'INITIAL' | 'AMENDMENT' | 'RENEWAL' | 'CONTINUING_REVIEW';
export type SubmissionStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
export type Country = 'Poland' | 'EU' | 'US' | 'UK' | 'Other';

export interface DocumentMetadata {
  id: string;
  name: string;
  type: 'ICF' | 'PROTOCOL' | 'PI_CV' | 'AMENDMENT' | 'OTHER';
  uploadedAt: string;
  uploadedBy: string;
  fileSize?: number;
  url?: string; // For actual file storage integration
}

export interface IRBSubmission {
  id: string;
  projectId: string;
  type: SubmissionType;
  status: SubmissionStatus;
  protocolNumber?: string;
  protocolVersion: string;
  committeeName: string;
  submittedBy: string; // user ID
  submittedByName: string; // user display name
  approvedBy?: string; // PI user ID
  approvedByName?: string;
  documents: DocumentMetadata[];
  createdAt: string;
  submittedAt?: string;
  decidedAt?: string;
  reviewNotes?: string;
  amendmentReason?: string; // For amendment submissions
}

export interface EthicsCompliance {
  projectId: string;
  country: Country;
  irbStatus: IRBStatus;
  approvalNumber?: string;
  approvalDate?: string;
  expirationDate?: string;
  renewalDueDate?: string; // 30 days before expiration
  submissions: IRBSubmission[];
  lastUpdated: string;
}

export interface RegulatoryQuestion {
  id: string;
  question: string;
  answer: string;
  citations: string[];
  jurisdiction: string[];
  tags: string[];
}

export interface RegulatoryContext {
  country: Country;
  studyPhase: 'I' | 'II' | 'III' | 'IV' | 'Observational';
  studyType: 'Drug' | 'Device' | 'Diagnostic' | 'Observational';
  multiCenter: boolean;
}

// Audit Trail System
export type AuditAction = 
  | 'SUBMISSION_CREATED'
  | 'SUBMISSION_EDITED'
  | 'SUBMISSION_SUBMITTED'
  | 'SUBMISSION_APPROVED'
  | 'SUBMISSION_REJECTED'
  | 'SUBMISSION_WITHDRAWN'
  | 'DOCUMENT_UPLOADED'
  | 'DOCUMENT_DELETED'
  | 'STATUS_CHANGED'
  | 'APPROVAL_GRANTED'
  | 'APPROVAL_EXPIRED'
  | 'EXPORT_BLOCKED'
  | 'EXPORT_ALLOWED';

export interface AuditLogEntry {
  id: string;
  projectId: string;
  submissionId?: string;
  action: AuditAction;
  performedBy: string; // user ID
  performedByName: string;
  performedByRole: string;
  timestamp: string;
  details: {
    oldValue?: any;
    newValue?: any;
    reason?: string;
    metadata?: Record<string, any>;
  };
  ipAddress?: string; // For enhanced security audit
}

export interface AuditLog {
  projectId: string;
  entries: AuditLogEntry[];
  lastUpdated: string;
}