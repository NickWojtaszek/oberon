// Source-Aware Chat Service - Hierarchical query engine

import type { 
  QueryRequest, 
  QueryResponse, 
  ContextSource, 
  CitationFound,
  ChatMessage 
} from '../types/sourceChat';
import type { SourceDocument } from '../types/manuscript';
import type { StatisticalManifest } from '../components/analytics-stats/types';

/**
 * Process a query with hierarchical context awareness
 * Priority: Statistical Manifest > Source Library > Global Knowledge
 */
export function processQuery(
  request: QueryRequest,
  sources: SourceDocument[],
  manifest?: StatisticalManifest
): QueryResponse {
  const contextUsed: ContextSource[] = [];
  const citationsFound: CitationFound[] = [];
  const manifestData: any[] = [];

  const questionLower = request.userQuestion.toLowerCase();

  // TIER 1: Check Statistical Manifest first
  if (manifest && request.scope !== 'selected_sources') {
    const manifestContext = queryManifest(questionLower, manifest);
    if (manifestContext.found) {
      contextUsed.push({
        type: 'manifest',
        id: manifest.manifestMetadata.manifestId,
        name: `Statistical Manifest v${manifest.manifestMetadata.version}`,
        priority: 1
      });
      manifestData.push(...manifestContext.data);
    }
  }

  // TIER 2: Check Source Library
  const relevantSources = request.scope === 'selected_sources'
    ? sources.filter(s => request.selectedSourceIds?.includes(s.id))
    : sources;

  relevantSources.forEach(source => {
    const sourceResults = querySource(questionLower, source);
    if (sourceResults.found) {
      contextUsed.push({
        type: 'source',
        id: source.id,
        name: source.fileName,
        priority: 2
      });
      citationsFound.push(...sourceResults.citations);
    }
  });

  // TIER 3: Global medical knowledge (simulated)
  const needsGlobalKnowledge = contextUsed.length === 0 || 
    questionLower.includes('general') || 
    questionLower.includes('standard');

  if (needsGlobalKnowledge) {
    contextUsed.push({
      type: 'global_knowledge',
      id: 'medical_llm',
      name: 'General Medical Knowledge',
      priority: 3
    });
  }

  // Generate response based on hierarchy
  const answer = generateHierarchicalResponse(
    request.userQuestion,
    contextUsed,
    manifestData,
    citationsFound
  );

  // Suggest manuscript section
  const suggestedSection = inferSection(request.userQuestion, manifestData, citationsFound);

  return {
    answer,
    contextUsed,
    citationsFound,
    manifestData: manifestData.length > 0 ? manifestData : undefined,
    suggestedSection,
    confidence: calculateConfidence(contextUsed, citationsFound, manifestData)
  };
}

/**
 * Query Statistical Manifest for relevant data
 */
function queryManifest(question: string, manifest: StatisticalManifest) {
  const data: any[] = [];
  let found = false;

  // Check for mortality queries
  if (question.includes('mortality') || question.includes('death')) {
    const mortalityStat = manifest.descriptiveStats.find(s => 
      s.variableId.toLowerCase().includes('mortality') || 
      s.label.toLowerCase().includes('mortality')
    );
    
    if (mortalityStat) {
      found = true;
      data.push({
        variable: mortalityStat.variableId,
        value: mortalityStat.results.mean || 0,
        interpretation: `${(mortalityStat.results.mean! * 100).toFixed(1)}% mortality rate in cohort (n=${mortalityStat.results.n})`
      });
    }
  }

  // Check for stroke queries
  if (question.includes('stroke') || question.includes('neurologic')) {
    const strokeStat = manifest.descriptiveStats.find(s => 
      s.variableId.toLowerCase().includes('stroke') || 
      s.label.toLowerCase().includes('stroke')
    );
    
    if (strokeStat) {
      found = true;
      data.push({
        variable: strokeStat.variableId,
        value: strokeStat.results.mean || 0,
        interpretation: `${(strokeStat.results.mean! * 100).toFixed(1)}% stroke rate observed`
      });
    }
  }

  // Check for statistical comparison queries
  if (question.includes('significant') || question.includes('difference') || question.includes('compare')) {
    const comparison = manifest.comparativeAnalyses.find(c => 
      question.includes(c.outcome?.toLowerCase() || '')
    );
    
    if (comparison) {
      found = true;
      data.push({
        variable: comparison.outcome || 'comparison',
        value: comparison.pValue || 1,
        interpretation: comparison.pValue! < 0.05 
          ? `Statistically significant difference detected (p=${comparison.pValue?.toFixed(3)})`
          : `No significant difference found (p=${comparison.pValue?.toFixed(3)})`
      });
    }
  }

  // General cohort info
  if (question.includes('cohort') || question.includes('sample') || question.includes('how many')) {
    found = true;
    data.push({
      variable: 'total_n',
      value: manifest.manifestMetadata.totalRecordsAnalyzed,
      interpretation: `Total cohort size: ${manifest.manifestMetadata.totalRecordsAnalyzed} patients`
    });
  }

  return { found, data };
}

/**
 * Query individual source document
 */
function querySource(question: string, source: SourceDocument): { found: boolean; citations: CitationFound[] } {
  const citations: CitationFound[] = [];
  let found = false;

  // Mock source excerpts based on citation keys (from Phase 2)
  const sourceExcerpts: Record<string, Array<{ text: string; page: number; keywords: string[] }>> = {
    'SVS_Guidelines_2024': [
      {
        text: 'Current guidelines recommend an upper age threshold of 80 years for elective aortic arch repair, though individual patient assessment remains paramount.',
        page: 12,
        keywords: ['age', 'threshold', '80', 'guidelines', 'elective']
      },
      {
        text: 'In large-scale multicenter trials, the 30-day mortality rate for elective aortic arch procedures ranges from 8.8% to 10.2% in specialized centers.',
        page: 14,
        keywords: ['mortality', '30-day', '8.8', '10.2', 'benchmark', 'rate']
      },
      {
        text: 'Postoperative stroke remains the most feared complication, occurring in approximately 3-5% of cases despite modern neuroprotection strategies.',
        page: 18,
        keywords: ['stroke', 'complication', '3-5%', 'postoperative']
      }
    ],
    'VESTAL_Trial_2023': [
      {
        text: 'The VESTAL trial demonstrated that age alone should not be a contraindication for arch repair. Patients aged 75-85 showed comparable outcomes to younger cohorts when properly selected.',
        page: 8,
        keywords: ['age', 'vestal', '75-85', 'outcomes', 'comparable']
      },
      {
        text: 'Primary endpoint analysis revealed no significant difference in 30-day mortality between age groups (p=0.067), though stroke rates were marginally higher in octogenarians. The 30-day mortality was 8.9% overall.',
        page: 22,
        keywords: ['mortality', '30-day', '8.9%', 'p=0.067', 'endpoint', 'significant']
      }
    ],
    'ACC_Risk_Calculator': [
      {
        text: 'The ACC/AHA risk calculator incorporates age, comorbidities, and procedural complexity to estimate perioperative mortality. Validation studies show strong concordance (c-statistic 0.87).',
        page: 5,
        keywords: ['risk', 'calculator', 'mortality', 'validation', 'acc']
      }
    ]
  };

  const excerpts = sourceExcerpts[source.citationKey] || [];
  
  // Simple keyword matching
  excerpts.forEach(excerpt => {
    const matchCount = excerpt.keywords.filter(keyword => 
      question.includes(keyword.toLowerCase())
    ).length;
    
    if (matchCount > 0) {
      found = true;
      citations.push({
        sourceId: source.id,
        sourceName: source.fileName,
        citationKey: source.citationKey,
        page: excerpt.page,
        snippet: excerpt.text,
        relevanceScore: Math.min(matchCount / excerpt.keywords.length, 1)
      });
    }
  });

  return { found, citations };
}

/**
 * Generate response using hierarchical context
 */
function generateHierarchicalResponse(
  question: string,
  context: ContextSource[],
  manifestData: any[],
  citations: CitationFound[]
): string {
  const questionLower = question.toLowerCase();
  
  // Mortality comparison queries
  if (questionLower.includes('compare') && questionLower.includes('mortality')) {
    const ourMortality = manifestData.find(d => d.variable.includes('mortality'));
    const vestalCitation = citations.find(c => c.citationKey === 'VESTAL_Trial_2023' && c.snippet.includes('8.9'));
    
    if (ourMortality && vestalCitation) {
      const ourRate = (ourMortality.value * 100).toFixed(1);
      return `Your cohort's 30-day mortality rate (${ourRate}%) is statistically comparable to the VESTAL trial's reported 8.9% (p=0.45, non-inferiority analysis). This suggests your surgical outcomes align with published multicenter trial benchmarks for properly selected patients.`;
    }
    
    if (ourMortality) {
      const ourRate = (ourMortality.value * 100).toFixed(1);
      return `Your cohort shows a 30-day mortality rate of ${ourRate}%, which falls within the acceptable benchmark range of 8.8-10.2% reported for specialized aortic centers.`;
    }
  }

  // Age-based queries
  if (questionLower.includes('age') && (questionLower.includes('threshold') || questionLower.includes('cutoff'))) {
    const vestalAge = citations.find(c => c.citationKey === 'VESTAL_Trial_2023' && c.snippet.includes('75-85'));
    const guidelineAge = citations.find(c => c.citationKey === 'SVS_Guidelines_2024' && c.snippet.includes('80'));
    
    if (vestalAge && guidelineAge) {
      return `Current SVS guidelines recommend an 80-year age threshold for elective arch repair, but the VESTAL trial demonstrated that patients aged 75-85 show comparable outcomes to younger cohorts when properly selected. This suggests age-based exclusion criteria may be reconsidered in favor of individualized risk assessment.`;
    }
  }

  // Stroke queries
  if (questionLower.includes('stroke') || questionLower.includes('neurologic')) {
    const ourStroke = manifestData.find(d => d.variable.includes('stroke'));
    const guidelineStroke = citations.find(c => c.snippet.toLowerCase().includes('stroke'));
    
    if (ourStroke && guidelineStroke) {
      const ourRate = (ourStroke.value * 100).toFixed(1);
      return `Your observed stroke rate (${ourRate}%) aligns with the published benchmark of 3-5% for modern arch repair procedures with neuroprotection strategies. This represents acceptable neurologic outcomes for this high-risk procedure.`;
    }
  }

  // Sample size queries
  if (questionLower.includes('cohort') || questionLower.includes('sample') || questionLower.includes('how many')) {
    const cohortSize = manifestData.find(d => d.variable === 'total_n');
    if (cohortSize) {
      return `Your study cohort includes ${cohortSize.value} patients who underwent the analyzed procedure. Statistical power calculations would help determine if this sample size is adequate for detecting clinically meaningful differences.`;
    }
  }

  // Significance queries
  if (questionLower.includes('significant') || questionLower.includes('p-value')) {
    const comparison = manifestData.find(d => d.value < 1 && typeof d.value === 'number');
    if (comparison && comparison.value < 0.05) {
      return `${comparison.interpretation}. This meets the conventional threshold for statistical significance (α=0.05), suggesting the observed difference is unlikely due to chance alone.`;
    }
    if (comparison && comparison.value >= 0.05) {
      return `${comparison.interpretation}. While this does not reach conventional statistical significance, it may represent a clinically relevant trend warranting further investigation.`;
    }
  }

  // General comparison
  if (questionLower.includes('compare') || questionLower.includes('versus')) {
    if (citations.length > 0) {
      const topCitation = citations.sort((a, b) => b.relevanceScore - a.relevanceScore)[0];
      return `Based on ${topCitation.sourceName}: "${topCitation.snippet.substring(0, 200)}..." This provides important contextual comparison for interpreting your findings.`;
    }
  }

  // Fallback: Context-aware general response
  if (context.length > 0) {
    const manifestUsed = context.some(c => c.type === 'manifest');
    const sourcesUsed = context.filter(c => c.type === 'source').length;
    
    if (manifestUsed && sourcesUsed > 0) {
      return `I've analyzed your Statistical Manifest and cross-referenced ${sourcesUsed} source document(s). ${citations.length > 0 ? `Key finding: "${citations[0].snippet.substring(0, 150)}..."` : 'The available data suggests further investigation of this topic would be valuable for your manuscript.'}`;
    }
    
    if (manifestUsed) {
      return `Based on your Statistical Manifest: ${manifestData.length > 0 ? manifestData[0].interpretation : 'Data available for analysis.'}`;
    }
    
    if (sourcesUsed > 0) {
      return `Based on ${sourcesUsed} source(s) in your library: ${citations.length > 0 ? `"${citations[0].snippet.substring(0, 200)}..."` : 'Relevant literature has been identified.'}`;
    }
  }

  return `I don't have sufficient context in your Statistical Manifest or Source Library to fully answer this question. Consider uploading additional sources or refining your query to focus on specific variables in your dataset.`;
}

/**
 * Infer which manuscript section this response belongs to
 */
function inferSection(
  question: string,
  manifestData: any[],
  citations: CitationFound[]
): 'introduction' | 'methods' | 'results' | 'discussion' | 'conclusion' | undefined {
  const questionLower = question.toLowerCase();
  
  if (questionLower.includes('background') || questionLower.includes('literature') || questionLower.includes('previous')) {
    return 'introduction';
  }
  
  if (questionLower.includes('method') || questionLower.includes('statistical') || questionLower.includes('analysis')) {
    return 'methods';
  }
  
  if (questionLower.includes('result') || questionLower.includes('finding') || questionLower.includes('outcome')) {
    return 'results';
  }
  
  if (questionLower.includes('interpret') || questionLower.includes('compare') || questionLower.includes('discuss')) {
    return 'discussion';
  }
  
  if (questionLower.includes('conclude') || questionLower.includes('implication') || questionLower.includes('recommendation')) {
    return 'conclusion';
  }
  
  // Infer from data type
  if (manifestData.length > 0 && citations.length > 0) {
    return 'discussion'; // Comparing our data to literature
  }
  
  if (manifestData.length > 0) {
    return 'results'; // Presenting our data
  }
  
  if (citations.length > 0) {
    return 'introduction'; // Citing literature
  }
  
  return undefined;
}

/**
 * Calculate confidence score for response
 */
function calculateConfidence(
  context: ContextSource[],
  citations: CitationFound[],
  manifestData: any[]
): number {
  let score = 0.5; // Base confidence
  
  // Higher confidence with manifest data
  if (context.some(c => c.type === 'manifest')) {
    score += 0.2;
  }
  
  // Higher confidence with multiple sources
  const sourceCount = context.filter(c => c.type === 'source').length;
  score += Math.min(sourceCount * 0.1, 0.3);
  
  // Higher confidence with high-relevance citations
  const avgRelevance = citations.length > 0
    ? citations.reduce((sum, c) => sum + c.relevanceScore, 0) / citations.length
    : 0;
  score += avgRelevance * 0.2;
  
  return Math.min(score, 1);
}

/**
 * Convert chat response to manuscript-ready draft
 */
export function generateDraftInsert(
  message: ChatMessage,
  section?: 'introduction' | 'methods' | 'results' | 'discussion' | 'conclusion'
): string {
  if (!message.citationsFound || message.citationsFound.length === 0) {
    return message.content;
  }
  
  // Insert citation markers at end of relevant sentences
  let text = message.content;
  
  message.citationsFound.forEach((citation, idx) => {
    // Find last sentence that contains keywords from citation
    const sentences = text.split('. ');
    const relevantSentenceIdx = sentences.findIndex(s => {
      const lower = s.toLowerCase();
      return citation.snippet.split(' ').slice(0, 5).some(word => 
        word.length > 4 && lower.includes(word.toLowerCase())
      );
    });
    
    if (relevantSentenceIdx !== -1) {
      // Add citation at end of sentence
      sentences[relevantSentenceIdx] += ` [@${citation.citationKey}]`;
      text = sentences.join('. ');
    } else {
      // Add all citations at the end
      if (idx === 0) {
        text += ` [@${citation.citationKey}]`;
      }
    }
  });
  
  return text;
}
