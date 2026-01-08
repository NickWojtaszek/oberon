// Manuscript Intelligence Manifest Type Definitions

export interface ManuscriptManifest {
  id: string;
  projectMeta: {
    projectId: string;
    studyTitle: string;
    primaryInvestigator: string;
    protocolRef: string;
    createdAt: number;
    modifiedAt: number;
  };
  manuscriptStructure: {
    methods: {
      statisticalPlan: {
        software: string;
        primaryTest: string;
        rationale: string;
      };
      populationSummary: string;
    };
    results: {
      primaryFindings: Finding[];
      secondaryFindings: Finding[];
    };
    discussionAnchors: {
      internalConflicts: string;
      lateralOpportunities: string[];
    };
  };
  notebookContext: {
    linkedSources: SourceDocument[];
    citationMap: { [key: string]: string };
  };
  manuscriptContent: {
    introduction: string;
    methods: string;
    results: string;
    discussion: string;
    conclusion: string;
  };
  reviewComments: ReviewComment[];
}

export interface Finding {
  variable: string;
  fact: string;
  p_value?: number;
  significance?: boolean;
  comparison?: string;
  narrativeTemplate?: string;
  confidence?: number;
  testUsed?: string;
}

export interface SourceDocument {
  id: string;
  fileName: string;
  fileType: 'pdf' | 'guideline' | 'reference';
  uploadedAt: number;
  citationKey: string;
  isGrounded: boolean; // Whether AI can cite this
  excerpts?: SourceExcerpt[];
}

export interface SourceExcerpt {
  id: string;
  text: string;
  page: number;
  section: string;
  citationAnchor: string; // Link back to source
}

export interface ReviewComment {
  id: string;
  timestamp: number;
  author: string;
  role: 'PI' | 'Professor' | 'Reviewer' | 'Statistician';
  section: 'introduction' | 'methods' | 'results' | 'discussion' | 'conclusion';
  comment: string;
  severity: 'info' | 'warning' | 'critical';
  resolved: boolean;
}

export interface ReferenceCitation {
  id: string;
  position: number; // Character position in text
  sourceId: string;
  excerptId?: string;
  displayText: string;
}

export interface SatelliteOpportunity {
  id: string;
  type: 'technical-note' | 'brief-communication' | 'sub-analysis' | 'case-series';
  title: string;
  description: string;
  variables: string[]; // Unused variable IDs
  rationale: string;
  potentialImpact: 'high' | 'medium' | 'low';
  estimatedWords: number;
  suggestedJournal?: string;
}

export interface LogicCheckResult {
  isValid: boolean;
  errors: LogicError[];
  warnings: LogicWarning[];
}

export interface LogicError {
  id: string;
  section: string;
  claim: string;
  actualValue: string | number;
  expectedValue: string | number;
  message: string;
}

export interface LogicWarning {
  id: string;
  section: string;
  message: string;
  suggestion: string;
}
