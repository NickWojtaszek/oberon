// Verification Appendix - Scientific Receipt for Journal Submission

export interface DataLineageEntry {
  claimInText: string; // e.g., "p=0.089"
  section: 'introduction' | 'methods' | 'results' | 'discussion' | 'conclusion';
  lineNumber: number;
  manifestVariable: string; // e.g., "mortality_30d"
  manifestValue: number | string;
  testUsed?: string;
  verified: boolean;
  discrepancy?: string;
}

export interface SourceValidationEntry {
  citationKey: string;
  citationCount: number; // How many times cited in manuscript
  sourceName: string;
  sections: string[]; // Sections where cited
  groundedSnippets: Array<{
    snippet: string;
    page?: number;
    verificationScore: number; // 0-1 (NotebookLM similarity)
    claimSupported: string; // The claim this snippet supports
  }>;
  overallGrounding: 'verified' | 'partial' | 'unverified';
}

export interface MultiplierAuditEntry {
  opportunityTitle: string;
  variablesUsed: string[];
  integratedInSection?: 'introduction' | 'discussion' | 'conclusion';
  rationale: string;
}

export interface AuditSummary {
  totalClaims: number;
  verifiedClaims: number;
  manualApprovals: number; // PI overrides
  conflictResolutions: number;
  verificationRate: number; // Percentage (0-100)
  
  statisticalClaims: {
    total: number;
    manifestMatched: number;
    unmatched: number;
  };
  
  citationClaims: {
    total: number;
    grounded: number;
    partiallyGrounded: number;
    ungrounded: number;
  };
  
  logicChecks: {
    passed: number;
    warnings: number;
    errors: number;
  };
}

export interface DigitalSignOff {
  piName: string;
  piEmail?: string;
  reviewedAt?: number; // timestamp
  signature?: string; // Base64 image or text signature
  attestation: string; // Standard text
  notes?: string;
}

export interface VerificationAppendix {
  appendixMetadata: {
    manuscriptId: string;
    manuscriptTitle: string;
    projectId: string;
    generatedAt: number;
    generatedBy: string; // User name
    version: string; // Appendix format version
    manifestVersion?: string; // Statistical Manifest version used
    protocolVersion?: string; // Protocol version used
  };
  
  auditSummary: AuditSummary;
  dataLineage: DataLineageEntry[];
  sourceValidation: SourceValidationEntry[];
  multiplierAudit: MultiplierAuditEntry[];
  signOff?: DigitalSignOff;
  
  // Compliance metadata
  complianceFlags: {
    allClaimsVerified: boolean;
    noFabricatedCitations: boolean;
    dataMatchesManifest: boolean;
    piReviewRequired: boolean;
    readyForSubmission: boolean;
  };
}

export interface ExportOptions {
  includeManuscript: boolean; // .docx
  includeAppendix: boolean; // .pdf (DEPRECATED - use includeVerificationAppendix)
  includeVerificationAppendix?: boolean; // .pdf - New standard name
  includeSourceLibrary?: boolean; // Include source PDFs in ZIP
  includeRawData: boolean; // .csv of manifest
  citationFormat: 'vancouver' | 'ama' | 'apa' | 'nature';
  appendixFormat: 'detailed' | 'summary';
  format?: 'docx' | 'pdf'; // Export format for manuscript
}

export interface ExportResult {
  success: boolean;
  files: Array<{
    filename: string;
    type: 'docx' | 'pdf' | 'csv';
    size: number;
    downloadUrl: string; // Blob URL
  }>;
  errors?: string[];
}