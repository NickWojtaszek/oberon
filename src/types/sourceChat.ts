// Source-Aware Chat System - Phase 3 Deep Interrogation

export type QueryScope = 'all_sources' | 'selected_sources' | 'manifest_only';

export interface CitationFound {
  sourceId: string;
  sourceName: string;
  citationKey: string;
  page?: number;
  snippet: string;
  relevanceScore: number; // 0-1
}

export interface ContextSource {
  type: 'manifest' | 'source' | 'global_knowledge';
  id: string;
  name: string;
  priority: 1 | 2 | 3; // 1=highest (manifest), 2=sources, 3=global
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  
  // Assistant messages only
  contextUsed?: ContextSource[];
  citationsFound?: CitationFound[];
  manifestData?: {
    variable: string;
    value: number | string;
    interpretation: string;
  }[];
  canCopyToManuscript?: boolean;
  suggestedSection?: 'introduction' | 'methods' | 'results' | 'discussion' | 'conclusion';
}

export interface QuerySession {
  id: string;
  projectId: string;
  messages: ChatMessage[];
  scope: QueryScope;
  selectedSourceIds: string[]; // For 'selected_sources' scope
  manifestLinked: boolean;
  createdAt: number;
  lastActive: number;
}

export interface QueryRequest {
  userQuestion: string;
  scope: QueryScope;
  selectedSourceIds?: string[];
  manifestId?: string;
  conversationHistory?: ChatMessage[];
}

export interface QueryResponse {
  answer: string;
  contextUsed: ContextSource[];
  citationsFound: CitationFound[];
  manifestData?: {
    variable: string;
    value: number | string;
    interpretation: string;
  }[];
  suggestedSection?: 'introduction' | 'methods' | 'results' | 'discussion' | 'conclusion';
  confidence: number; // 0-1 scale
}

export interface DraftInsertData {
  text: string;
  citations: Array<{
    citationKey: string;
    position: number; // Character position in text where citation should go
  }>;
  section: 'introduction' | 'methods' | 'results' | 'discussion' | 'conclusion';
}
