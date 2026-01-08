// API Types for Manuscript endpoints
// These define the contract between frontend and backend

import type { ManuscriptManifest } from '../manuscript';

// Request types
export interface CreateManuscriptRequest {
  projectId: string;
  title: string;
  studyDesign?: string;
}

export interface UpdateManuscriptRequest {
  title?: string;
  content?: Partial<ManuscriptManifest['manuscriptContent']>;
  notebookContext?: Partial<ManuscriptManifest['notebookContext']>;
  reviewComments?: ManuscriptManifest['reviewComments'];
}

export interface UpdateManuscriptContentRequest {
  section: keyof ManuscriptManifest['manuscriptContent'];
  content: string;
}

export interface AddSourceRequest {
  title: string;
  authors: string;
  year: string;
  journal?: string;
  doi?: string;
  pmid?: string;
  abstract?: string;
  keyFindings?: string;
}

export interface AddReviewCommentRequest {
  section: string;
  lineNumber: number;
  comment: string;
  severity: 'info' | 'warning' | 'critical';
  author: string;
}

// Response types
export interface ManuscriptListResponse {
  manuscripts: ManuscriptManifest[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ManuscriptResponse {
  manuscript: ManuscriptManifest;
}

export interface ManuscriptCreatedResponse {
  manuscript: ManuscriptManifest;
  message: string;
}

export interface ManuscriptUpdatedResponse {
  manuscript: ManuscriptManifest;
  message: string;
}

export interface ManuscriptDeletedResponse {
  message: string;
  deletedId: string;
}

// Query parameters
export interface GetManuscriptsParams {
  projectId: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'createdAt' | 'modifiedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

// Batch operations
export interface BatchUpdateManuscriptsRequest {
  updates: Array<{
    manuscriptId: string;
    updates: UpdateManuscriptRequest;
  }>;
}

export interface BatchUpdateManuscriptsResponse {
  updated: ManuscriptManifest[];
  errors: Array<{
    manuscriptId: string;
    error: string;
  }>;
}
