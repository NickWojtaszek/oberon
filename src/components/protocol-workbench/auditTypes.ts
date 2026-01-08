// Protocol Audit System - Type Definitions

export type AuditSeverity = 'critical' | 'warning' | 'info';
export type AuditCategory = 'protocol-text' | 'schema' | 'dependency' | 'cross-validation' | 'regulatory';

export interface AuditIssue {
  id: string;
  severity: AuditSeverity;
  category: AuditCategory;
  title: string;
  description: string;
  recommendation: string;
  location: {
    tab: 'protocol' | 'schema' | 'dependencies';
    fieldId?: string;
    blockId?: string;
    sectionName?: string;
  };
  regulatoryReference?: string; // e.g., "ICH E6(R2) 5.1.2"
  autoFixAvailable?: boolean;
}

export interface ProtocolAuditResult {
  timestamp: string;
  protocolId: string;
  versionId: string;
  protocolNumber: string;
  
  // Issue categorization
  protocolTextIssues: AuditIssue[];
  schemaIssues: AuditIssue[];
  dependencyIssues: AuditIssue[];
  crossValidationIssues: AuditIssue[];
  regulatoryIssues: AuditIssue[];
  
  // Summary metrics
  criticalCount: number;
  warningCount: number;
  infoCount: number;
  totalIssues: number;
  complianceScore: number; // 0-100
  
  // Status flags
  canPublish: boolean;
  requiresPIApproval: boolean;
  blockedReasons: string[];
  
  // Metadata
  auditedBy: string; // "AI Governance Persona"
  auditDuration: number; // milliseconds
}

export interface ValidationRule {
  id: string;
  name: string;
  category: AuditCategory;
  severity: AuditSeverity;
  description: string;
  check: (context: AuditContext) => AuditIssue[];
}

export interface AuditContext {
  protocolMetadata: any;
  protocolContent: any;
  schemaBlocks: any[];
  dependencies: any[];
  studyDesign?: any;
}
