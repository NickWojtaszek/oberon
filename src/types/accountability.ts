/**
 * Accountability Layer Types
 * Research Factory - Clinical-Grade Publishing System
 */

// ============================================================================
// Autonomy & Journal Constraints
// ============================================================================

export type AutonomyMode = 'audit' | 'co-pilot' | 'pilot';

export type PaperType = 
  | 'original-research'
  | 'case-report'
  | 'review-article'
  | 'meta-analysis'
  | 'brief-communication'
  | 'commentary'
  | 'editorial';

export interface JournalConstraints {
  abstract: {
    wordLimit: number;
    structured: boolean;
  };
  introduction: {
    wordLimit: number;
  };
  methods: {
    wordLimit: number;
  };
  results: {
    wordLimit: number;
  };
  discussion: {
    wordLimit: number;
  };
  overall: {
    wordLimit: number;
  };
  references: {
    maxCount: number;
    citationStyle: 'vancouver' | 'apa' | 'chicago';
  };
  figures: {
    maxCount: number;
  };
  tables: {
    maxCount: number;
  };
}

export interface JournalProfile {
  id: string;
  name: string;
  shortName: string;
  
  // Submission constraints by paper type
  constraintsByPaperType?: {
    'original-research': JournalConstraints;
    'case-report': JournalConstraints;
    'review-article': JournalConstraints;
    'meta-analysis': JournalConstraints;
    'brief-communication': JournalConstraints;
    'commentary': JournalConstraints;
    'editorial': JournalConstraints;
  };
  
  // Default constraints (for backward compatibility)
  constraints: JournalConstraints;
  
  // Metadata
  impactFactor?: number;
  category: 'tier1' | 'tier2' | 'specialty' | 'custom';
  url?: string;
  isCustom?: boolean;
}

// ============================================================================
// Logic Audit System
// ============================================================================

export interface VerifiedResult {
  var: string;           // Variable ID from Statistical Manifest
  val: number | string;  // Ground truth value
  p?: number;           // P-value if applicable
  ci?: string;          // Confidence interval if applicable
  n?: number;           // Sample size if applicable
  unit?: string;        // Unit of measurement
  context?: string;     // Additional context
}

export interface MismatchCard {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  
  // Location
  section: string;
  lineNumber?: number;
  
  // The problem
  textClaim: string;           // What the student wrote
  manifestValue: VerifiedResult; // What the data says
  
  // Resolution
  status: 'unresolved' | 'auto-fixed' | 'manually-approved' | 'dismissed';
  resolvedAt?: string;
  resolvedBy?: string;
  
  // Traceability
  sourceVariableId: string;  // Links back to Recursive Schema
  protocolId: string;
}

export interface AuditSnapshot {
  id: string;
  manuscriptId: string;
  createdAt: string;
  
  // Verification metrics
  verificationRate: number;      // 0-1 (percentage of claims verified)
  unresolvedConflicts: number;   // Count of critical mismatches
  totalClaims: number;           // Total statistical claims found
  verifiedClaims: number;        // Claims matching manifest
  
  // Mismatch breakdown
  mismatches: MismatchCard[];
  
  // Journal compliance
  journalProfile?: string;       // Journal ID
  withinWordLimit: boolean;
  withinRefLimit: boolean;
  
  // Sign-off
  supervisorApproval?: {
    approved: boolean;
    approvedBy: string;
    approvedAt: string;
    signature?: string;
    comments?: string;
  };
}

// ============================================================================
// Source Library with Traceability
// ============================================================================

export interface TracedSource {
  id: string;
  type: 'literature' | 'protocol' | 'statistical-manifest' | 'benchmark';
  
  // Citation info
  title: string;
  authors?: string[];
  year?: number;
  journal?: string;
  doi?: string;
  
  // Content
  snippet: string;
  fullText?: string;
  
  // Traceability
  usedInSections: string[];      // Which manuscript sections reference this
  citationCount: number;          // How many times cited
  verificationStatus: 'verified' | 'pending' | 'unverified';
  
  // For statistical sources
  linkedVariables?: string[];     // Protocol variable IDs
  
  // Metadata
  addedAt: string;
  addedBy: string;
}

// ============================================================================
// Scientific Receipt (Export Package)
// ============================================================================

export interface DataLineageEntry {
  // What appears in the manuscript
  manuscriptClaim: string;
  sectionLocation: string;
  
  // What it traces back to
  sourceVariable: {
    id: string;
    label: string;
    type: string;
    protocolSection: string;
  };
  
  // The data
  rawValue: number | string;
  computedValue?: number | string;
  pValue?: number;
  confidenceInterval?: string;
  sampleSize?: number;
  
  // Verification
  verified: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface ScientificReceipt {
  // Manuscript metadata
  manuscriptId: string;
  projectId: string;
  title: string;
  authors: string[];
  submittedTo?: string;  // Journal name
  
  // Generated at
  generatedAt: string;
  generatedBy: string;
  
  // Audit summary
  auditSnapshot: AuditSnapshot;
  
  // Complete traceability
  dataLineage: DataLineageEntry[];
  
  // Source verification
  sources: TracedSource[];
  
  // Protocol reference
  protocolVersion: {
    id: string;
    name: string;
    version: number;
    lockedAt?: string;
  };
  
  // Sign-off
  piSignOff?: {
    name: string;
    title: string;
    date: string;
    signature?: string;
    certification: string;
  };
  
  // Export metadata
  exportFormat: 'docx' | 'pdf' | 'latex';
  includesAppendix: boolean;
}

// ============================================================================
// Enhanced Manuscript Structure
// ============================================================================

export interface ManuscriptWithAccountability {
  // Existing manuscript fields
  id: string;
  projectId: string;
  title: string;
  content: string;
  
  // NEW: Journal targeting
  targetJournal?: string;  // Journal ID
  journalProfile?: JournalProfile;
  
  // NEW: Autonomy setting
  autonomyMode: AutonomyMode;
  
  // NEW: Audit tracking
  currentAudit?: AuditSnapshot;
  auditHistory: AuditSnapshot[];
  
  // NEW: Word count tracking
  wordCounts: {
    abstract: number;
    introduction: number;
    methods: number;
    results: number;
    discussion: number;
    overall: number;
  };
  
  // NEW: Scientific receipt
  lastExport?: {
    exportedAt: string;
    receiptId: string;
    approved: boolean;
  };
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  lastAuditAt?: string;
}

// ============================================================================
// Live Budget Tracker
// ============================================================================

export interface BudgetStatus {
  section: string;
  current: number;
  limit: number;
  percentage: number;  // 0-100
  status: 'ok' | 'warning' | 'exceeded';  // warning at 90%, exceeded at 100%
}

export interface ManuscriptBudget {
  journal: string;
  sections: BudgetStatus[];
  references: {
    current: number;
    limit: number;
    status: 'ok' | 'warning' | 'exceeded';
  };
  figures: {
    current: number;
    limit: number;
    status: 'ok' | 'warning' | 'exceeded';
  };
  tables: {
    current: number;
    limit: number;
    status: 'ok' | 'warning' | 'exceeded';
  };
  overallCompliance: boolean;
}