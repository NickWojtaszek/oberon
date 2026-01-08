// AI Mode Controller Type Definitions

export type AIMode = 'pilot' | 'co-pilot';

export interface EditorState {
  aiMode: AIMode;
  supervisionActive: boolean;
  autoCheckEnabled: boolean;
}

export interface ClaimAudit {
  id: string;
  sentence: string;
  section: string;
  position: { start: number; end: number };
  manifestMatch: boolean;
  sourceLinked?: string;
  status: 'verified' | 'conflict' | 'unverified';
  manifestReference?: {
    variable: string;
    expectedValue: string | number;
    actualValue: string | number;
    pValue?: number;
  };
}

export interface CitationChip {
  id: string;
  citationKey: string;
  sourceId: string;
  position: number;
  displayText: string;
}

export interface BibliographyEntry {
  id: string;
  citationKey: string;
  sourceId: string;
  authors: string[];
  title: string;
  journal?: string;
  year: number;
  volume?: string;
  pages?: string;
  doi?: string;
  url?: string;
  timesUsed: number;
}

export type CitationStyle = 'vancouver' | 'ama' | 'apa';

export interface AIGenerationRequest {
  section: 'introduction' | 'methods' | 'results' | 'discussion' | 'conclusion';
  statisticalManifest: any;
  authorPersona?: string;
  sources: string[];
  context?: string;
}

export interface AIGenerationResponse {
  generatedText: string;
  citations: CitationChip[];
  claimsAudit: ClaimAudit[];
  confidence: number;
}
