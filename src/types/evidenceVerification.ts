// Evidence Verification System - Phase 2 Grounding

export interface ReferenceSource {
  title: string;
  doi?: string;
  exactSnippet: string;
  pageNumber?: number;
  similarityScore: number; // 0-1 scale, how well snippet matches claim
  sourceId: string;
  citationKey: string;
}

export interface ManifestCheck {
  variable: string;
  valueInDb: number | string;
  consistencyStatus: 'matches' | 'conflict' | 'not_applicable';
  expectedValue?: number | string;
  deviation?: number; // Percentage deviation if numeric
}

// Internal check structure used by verification service
export interface InternalCheck {
  status: 'verified' | 'conflict' | 'pending';
  manifestVariable?: string;
  valueInManifest?: number | string;
  valueInManuscript?: number | string;
  deviation?: number;
}

// External check structure used by verification service
export interface ExternalCheck {
  similarityScore: number; // 0-1 scale
  sourceSnippet: string;
  sourceTitle: string;
  sourceDOI?: string;
}

// Unified VerificationPacket type - matches actual usage in LogicAuditSidebar and verificationService
export interface VerificationPacket {
  // Primary identifiers
  citationId?: string;
  citationKey: string;

  // Content fields
  manuscriptText?: string; // The sentence/paragraph containing the citation
  manuscriptClaim: string;
  section: string; // Which IMRaD section
  position?: { start: number; end: number }; // Text position in section

  // Verification checks
  referenceSource?: ReferenceSource;
  manifestCheck?: ManifestCheck;
  internalCheck?: InternalCheck;
  externalCheck: ExternalCheck;

  // Metadata
  verifiedAt: number; // Timestamp
  verifiedBy?: 'ai' | 'human' | 'system';
  overallStatus?: 'verified' | 'partial' | 'conflict';

  // Approval workflow
  approved?: boolean;
  piSignature?: string;
  piApprovedAt?: number;
}

export interface EvidenceCardData {
  citation: VerificationPacket;
  isOpen: boolean;
  position?: { x: number; y: number }; // For positioning the card
}

export type VerificationStatus = 'verified' | 'partial' | 'conflict' | 'pending';

// For simulation/mock data generation
export interface SourceExcerpt {
  text: string;
  page: number;
  confidence: number;
}
