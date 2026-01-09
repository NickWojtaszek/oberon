/**
 * AI Governance Types
 * 
 * Unified type system for AI Persona governance, customization, and audit logging.
 * 
 * Architecture:
 * - Layer 1: Validation Rules (LOCKED - defined in personaRegistry.ts)
 * - Layer 2: Inference Boundaries (PARTIALLY LOCKED - system + user-configurable)
 * - Layer 3: Communication Settings (EDITABLE - presentation only)
 * 
 * This separation ensures governance integrity while allowing UX customization.
 */

import type { PersonaId, PersonaModule } from '../components/ai-personas/core/personaTypes';

// ==========================================
// INFERENCE BOUNDARIES
// ==========================================

/**
 * Inference type configuration
 * Defines what the AI is allowed or forbidden to infer
 */
export interface InferenceType {
  id: string;
  title: string;
  description: string;
  category: 'allowed' | 'disallowed';
  isSystemLocked: boolean; // If true, user cannot modify
  regulatoryBasis?: string; // e.g., "ICH E6(R2)", "FDA Guidance"
}

/**
 * Inference boundaries configuration
 * Split into system-locked and user-configurable sections
 */
export interface InferenceBoundaries {
  // 🔒 LOCKED - System enforced, non-editable
  systemDisallowed: string[];  // NEVER permitted (e.g., efficacy-claims, safety-conclusions)
  systemRequired: string[];    // ALWAYS active (e.g., pattern-recognition for case-series)
  
  // ⚠️ CONFIGURABLE - Can modify with audit trail
  additionalAllowed: string[]; // User can ADD optional inferences
  additionalDisallowed: string[]; // User can RESTRICT further (safe operation)
  
  // Audit trail for modifications
  modificationHistory: InferenceModification[];
}

/**
 * Record of inference boundary modification
 */
export interface InferenceModification {
  id: string;
  timestamp: string;
  modifiedBy: string;
  modifiedByName: string;
  action: 'added-allowed' | 'added-disallowed' | 'removed-allowed' | 'removed-disallowed';
  inference: string;
  justification: string; // Required for audit
}

// ==========================================
// COMMUNICATION SETTINGS (FULLY EDITABLE)
// ==========================================

/**
 * Language control settings
 * Affects how the AI communicates, NOT what it validates
 */
export interface LanguageControls {
  tone: 'socratic' | 'educational' | 'directive';
  confidenceLevel: 1 | 2 | 3 | 4 | 5; // 1=Highly Conservative, 5=Highly Exploratory
  jargonLevel: 'layperson' | 'technical' | 'peer-review';
  neverWriteFullSections: boolean; // AI is coach, not ghostwriter
  forbiddenAnthropomorphism: boolean; // Block "I think" language
  forbiddenPhrases: string[]; // User-defined forbidden phrases
}

/**
 * Citation display preferences
 */
export interface CitationDisplay {
  format: 'vancouver' | 'apa' | 'harvard';
  showConfidenceScores: boolean;
  inlineCitations: boolean;
  showRegulatoryBadges: boolean; // Show ICH, FDA, etc. badges
}

/**
 * Citation policy settings
 */
export interface CitationPolicy {
  strictnessLevel: 'strict' | 'balanced' | 'exploratory';
  requireSourceForClaim: boolean;
  allowHeuristic: boolean;
  maxUncitedSentences: number;
  requirePeerReviewed: boolean;
  sourceTypes: {
    protocol: boolean;
    benchmarks: boolean;
    guidelines: boolean;
    peerReviewed: boolean;
  };
}

/**
 * Output formatting preferences
 */
export interface OutputPreferences {
  verbosity: 'concise' | 'detailed' | 'comprehensive';
  showRationale: boolean;
  showAlternatives: boolean;
  showStatisticalRationale: boolean;
}

/**
 * Complete communication settings
 */
export interface CommunicationSettings {
  languageControls: LanguageControls;
  citationDisplay: CitationDisplay;
  citationPolicy: CitationPolicy;
  outputPreferences: OutputPreferences;
}

// ==========================================
// PERSONA CUSTOMIZATION
// ==========================================

/**
 * Per-persona, per-project customization
 * Stored separately from the locked PersonaConfig
 */
export interface PersonaCustomization {
  id: string;
  personaId: PersonaId;
  projectId: string;
  
  // Editable settings
  communicationSettings: CommunicationSettings;
  inferenceBoundaries: InferenceBoundaries;
  
  // Additional user restrictions (can only add, not remove core)
  additionalRestrictions: string[];
  
  // Metadata
  createdAt: string;
  modifiedAt: string;
  modifiedBy: string;
  modifiedByName: string;
}

// ==========================================
// AI AUDIT TRAIL
// ==========================================

/**
 * All auditable AI actions
 */
export type AIAuditAction =
  // AI Suggestions
  | 'AI_SUGGESTION_GENERATED'
  | 'AI_SUGGESTION_ACCEPTED'
  | 'AI_SUGGESTION_DISMISSED'
  | 'AI_SUGGESTION_MODIFIED'
  | 'AI_AUTO_FIX_APPLIED'
  | 'AI_AUTO_FIX_REJECTED'
  
  // Validation Events
  | 'AI_VALIDATION_RUN'
  | 'AI_VALIDATION_PASSED'
  | 'AI_VALIDATION_FAILED'
  | 'AI_VALIDATION_BLOCKED'
  
  // User Configuration Changes
  | 'AI_PERSONA_ACTIVATED'
  | 'AI_PERSONA_DEACTIVATED'
  | 'AI_COMMUNICATION_SETTINGS_CHANGED'
  | 'AI_INFERENCE_BOUNDARY_MODIFIED'
  | 'AI_ADDITIONAL_RESTRICTION_ADDED'
  | 'AI_ADDITIONAL_RESTRICTION_REMOVED'
  
  // Export Events
  | 'AI_AUDIT_LOG_EXPORTED';

/**
 * Single audit log entry
 */
export interface AIAuditLogEntry {
  id: string;
  timestamp: string;
  projectId: string;
  
  // Attribution - which persona did this
  personaId: PersonaId;
  personaName: string;
  module: PersonaModule | string;
  
  // Action details
  action: AIAuditAction;
  actor: 'System AI' | 'User';
  userId?: string;
  userName?: string;
  
  // Detailed information
  details: {
    // For suggestions
    suggestionId?: string;
    suggestionType?: string;
    message?: string;
    severity?: 'critical' | 'warning' | 'info';
    regulatoryCitation?: string;
    confidence?: number;
    
    // For user actions
    oldValue?: any;
    newValue?: any;
    reason?: string;
    justification?: string;
    
    // For validation
    score?: number;
    issuesFound?: number;
    criticalCount?: number;
    warningCount?: number;
    blockedReasons?: string[];
    
    // Context
    variableName?: string;
    fieldPath?: string;
  };
  
  // Integrity chain (for tamper detection)
  previousEntryHash?: string;
  entryHash?: string;
}

/**
 * Complete audit log for a project
 */
export interface AIAuditLog {
  projectId: string;
  entries: AIAuditLogEntry[];
  lastUpdated: string;
  
  // Cached summary stats
  stats: AIAuditStats;
}

/**
 * Audit statistics summary
 */
export interface AIAuditStats {
  totalSuggestions: number;
  acceptedSuggestions: number;
  dismissedSuggestions: number;
  autoFixesApplied: number;
  configurationChanges: number;
  validationRuns: number;
  lastValidationScore?: number;
}

/**
 * Per-persona audit statistics
 */
export interface PersonaAuditStats {
  personaId: PersonaId;
  personaName: string;
  suggestionsGenerated: number;
  suggestionsAccepted: number;
  suggestionsDismissed: number;
  acceptanceRate: number;
  lastActivity?: string;
}

// ==========================================
// GOVERNANCE DISPLAY TYPES
// ==========================================

/**
 * Governance information for UI display
 * Shows what's locked vs. configurable
 */
export interface GovernanceDisplay {
  personaId: PersonaId;
  personaName: string;
  
  // Locked layer info (for greyed-out display)
  lockedRules: {
    validationRulesCount: number;
    validationRules: Array<{
      id: string;
      name: string;
      severity: 'critical' | 'warning' | 'info';
    }>;
    regulatoryFrameworks: string[];
    systemDisallowedInferences: string[];
  };
  
  // Configurable layer info
  configurableSettings: {
    hasLanguageControls: boolean;
    hasCitationPolicy: boolean;
    hasOptionalInferences: boolean;
  };
}

// ==========================================
// DEFAULT CONFIGURATIONS
// ==========================================

/**
 * Default communication settings
 */
export const DEFAULT_COMMUNICATION_SETTINGS: CommunicationSettings = {
  languageControls: {
    tone: 'socratic',
    confidenceLevel: 2,
    jargonLevel: 'peer-review',
    neverWriteFullSections: true,
    forbiddenAnthropomorphism: true,
    forbiddenPhrases: ['Statistically significant', 'Cured', 'Proven treatment'],
  },
  citationDisplay: {
    format: 'vancouver',
    showConfidenceScores: true,
    inlineCitations: true,
    showRegulatoryBadges: true,
  },
  citationPolicy: {
    strictnessLevel: 'strict',
    requireSourceForClaim: true,
    allowHeuristic: false,
    maxUncitedSentences: 0,
    requirePeerReviewed: true,
    sourceTypes: {
      protocol: true,
      benchmarks: true,
      guidelines: true,
      peerReviewed: true,
    },
  },
  outputPreferences: {
    verbosity: 'detailed',
    showRationale: true,
    showAlternatives: false,
    showStatisticalRationale: true,
  },
};

/**
 * Default inference boundaries (universal guardrails)
 */
export const DEFAULT_INFERENCE_BOUNDARIES: InferenceBoundaries = {
  systemDisallowed: [
    'efficacy-claims',
    'safety-conclusions',
    'clinical-recommendations',
  ],
  systemRequired: [],
  additionalAllowed: [],
  additionalDisallowed: [],
  modificationHistory: [],
};

/**
 * System-locked inference types that can NEVER be unlocked
 */
export const SYSTEM_LOCKED_DISALLOWED_INFERENCES: InferenceType[] = [
  {
    id: 'efficacy-claims',
    title: 'Efficacy Claims',
    description: 'Making definitive statements about treatment effectiveness',
    category: 'disallowed',
    isSystemLocked: true,
    regulatoryBasis: 'FDA 21 CFR 312.32',
  },
  {
    id: 'safety-conclusions',
    title: 'Safety Conclusions',
    description: 'Drawing conclusions about safety profiles or adverse events',
    category: 'disallowed',
    isSystemLocked: true,
    regulatoryBasis: 'ICH E2A',
  },
  {
    id: 'clinical-recommendations',
    title: 'Clinical Recommendations',
    description: 'Providing clinical guidance or treatment recommendations',
    category: 'disallowed',
    isSystemLocked: true,
    regulatoryBasis: 'ICH E6(R2)',
  },
];

/**
 * Optional inference types that users can enable/disable
 */
export const OPTIONAL_INFERENCE_TYPES: InferenceType[] = [
  {
    id: 'benchmark-comparison',
    title: 'Benchmark Comparison',
    description: 'Compare results against pre-specified benchmarks or historical data',
    category: 'allowed',
    isSystemLocked: false,
  },
  {
    id: 'descriptive-trend',
    title: 'Descriptive Trend Analysis',
    description: 'Identify patterns and trends in the data without causal interpretation',
    category: 'allowed',
    isSystemLocked: false,
  },
  {
    id: 'protocol-deviation-highlighting',
    title: 'Protocol Deviation Highlighting',
    description: 'Flag potential deviations from the protocol or analysis plan',
    category: 'allowed',
    isSystemLocked: false,
  },
  {
    id: 'statistical-method-suggestions',
    title: 'Statistical Method Suggestions',
    description: 'Recommend appropriate statistical methods based on data characteristics',
    category: 'allowed',
    isSystemLocked: false,
  },
  {
    id: 'causal-inference',
    title: 'Causal Inference',
    description: 'Making causal claims about relationships between variables',
    category: 'disallowed',
    isSystemLocked: false,
    regulatoryBasis: 'Best practice for observational studies',
  },
];
