// Journal Profile Configuration Types

export interface WordLimits {
  title: number;
  abstract: number;
  introduction: number;
  methods: number;
  results: number;
  discussion: number;
  conclusion: number;
  totalMain?: number; // Optional overall limit
}

export interface JournalProfile {
  id: string;
  name: string;
  abbreviation: string;
  
  // Word limits
  wordLimits: WordLimits;
  
  // Citation constraints
  citationLimit: number;
  citationStyle: 'vancouver' | 'ama' | 'apa' | 'nature';
  
  // Structure requirements
  requiredSections: string[];
  optionalSections?: string[];
  
  // Formatting
  allowSubsections: boolean;
  requireKeywords: boolean;
  keywordLimit?: number;
  
  // Metadata
  impactFactor?: number;
  specialty: string;
  website?: string;
}

export interface JournalConstraintStatus {
  section: string;
  currentWords: number;
  limit: number;
  percentage: number;
  status: 'ok' | 'warning' | 'error';
}

export interface CitationConstraintStatus {
  currentCount: number;
  limit: number;
  percentage: number;
  status: 'ok' | 'warning' | 'error';
}

export interface ConstraintWarning {
  type: 'word_limit' | 'citation_limit' | 'section_missing';
  severity: 'error' | 'warning';
  section?: string;
  message: string;
  current?: number;
  limit?: number;
}
