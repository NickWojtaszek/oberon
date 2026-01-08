// Evidence Verification Service - Mock grounding and validation

import type { VerificationPacket, ReferenceSource, ManifestCheck, SourceExcerpt } from '../types/evidenceVerification';
import type { SourceDocument } from '../types/manuscript';
import type { StatisticalManifest } from '../components/analytics-stats/types';

/**
 * Mock source excerpts database
 * In production, this would use actual PDF parsing + vector search
 */
const mockSourceExcerpts: Record<string, SourceExcerpt[]> = {
  'SVS_Guidelines_2024': [
    {
      text: 'Current guidelines recommend an upper age threshold of 80 years for elective aortic arch repair, though individual patient assessment remains paramount.',
      page: 12,
      confidence: 0.92
    },
    {
      text: 'In large-scale multicenter trials, the 30-day mortality rate for elective aortic arch procedures ranges from 8.8% to 10.2% in specialized centers.',
      page: 14,
      confidence: 0.95
    },
    {
      text: 'Postoperative stroke remains the most feared complication, occurring in approximately 3-5% of cases despite modern neuroprotection strategies.',
      page: 18,
      confidence: 0.89
    }
  ],
  'VESTAL_Trial_2023': [
    {
      text: 'The VESTAL trial demonstrated that age alone should not be a contraindication for arch repair. Patients aged 75-85 showed comparable outcomes to younger cohorts when properly selected.',
      page: 8,
      confidence: 0.94
    },
    {
      text: 'Primary endpoint analysis revealed no significant difference in 30-day mortality between age groups (p=0.067), though stroke rates were marginally higher in octogenarians.',
      page: 22,
      confidence: 0.91
    }
  ],
  'ACC_Risk_Calculator': [
    {
      text: 'The ACC/AHA risk calculator incorporates age, comorbidities, and procedural complexity to estimate perioperative mortality. Validation studies show strong concordance (c-statistic 0.87).',
      page: 5,
      confidence: 0.88
    }
  ]
};

/**
 * Generate verification packet for a citation
 */
export function generateVerificationPacket(
  citationKey: string,
  manuscriptText: string,
  section: string,
  source: SourceDocument,
  statisticalManifest?: StatisticalManifest
): VerificationPacket {
  // Find best matching excerpt from source
  const excerpts = mockSourceExcerpts[citationKey] || [];
  const bestMatch = findBestMatch(manuscriptText, excerpts);
  
  // Build reference source
  const referenceSource: ReferenceSource = {
    title: source.fileName.replace(/\.pdf$/i, ''),
    doi: generateMockDOI(citationKey),
    exactSnippet: bestMatch.text,
    pageNumber: bestMatch.page,
    similarityScore: bestMatch.confidence,
    sourceId: source.id,
    citationKey: citationKey
  };

  // Check against statistical manifest
  const manifestCheck = checkAgainstManifest(manuscriptText, statisticalManifest);

  // Determine overall status
  const overallStatus = determineOverallStatus(referenceSource.similarityScore, manifestCheck.consistencyStatus);

  return {
    citationId: `cite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    manuscriptText,
    section,
    position: { start: 0, end: manuscriptText.length },
    referenceSource,
    manifestCheck,
    verifiedAt: Date.now(),
    verifiedBy: 'ai',
    overallStatus
  };
}

/**
 * Find best matching excerpt using simple keyword matching
 * In production: Use vector embeddings + semantic search
 */
function findBestMatch(manuscriptText: string, excerpts: SourceExcerpt[]): SourceExcerpt {
  if (excerpts.length === 0) {
    return {
      text: 'No excerpt available. This source has not been processed for text extraction.',
      page: 1,
      confidence: 0.5
    };
  }

  // Simple keyword matching (in production, use embeddings)
  const manuscriptLower = manuscriptText.toLowerCase();
  const keywords = manuscriptLower.split(/\s+/).filter(w => w.length > 4);
  
  let bestExcerpt = excerpts[0];
  let bestScore = 0;

  excerpts.forEach(excerpt => {
    const excerptLower = excerpt.text.toLowerCase();
    let matches = 0;
    
    keywords.forEach(keyword => {
      if (excerptLower.includes(keyword)) {
        matches++;
      }
    });
    
    const score = keywords.length > 0 ? matches / keywords.length : 0;
    if (score > bestScore) {
      bestScore = score;
      bestExcerpt = excerpt;
    }
  });

  return {
    ...bestExcerpt,
    confidence: Math.min(bestExcerpt.confidence, 0.5 + bestScore * 0.4)
  };
}

/**
 * Check manuscript claim against statistical manifest
 */
function checkAgainstManifest(manuscriptText: string, manifest?: StatisticalManifest): ManifestCheck {
  if (!manifest) {
    return {
      variable: 'not_checked',
      valueInDb: 'N/A',
      consistencyStatus: 'not_applicable'
    };
  }

  // Extract numbers from manuscript text
  const numbers = extractNumbers(manuscriptText);
  
  // Check for common statistical claims
  if (manuscriptText.toLowerCase().includes('mortality')) {
    return checkMortalityRate(numbers, manifest);
  }
  
  if (manuscriptText.toLowerCase().includes('stroke')) {
    return checkStrokeRate(numbers, manifest);
  }
  
  if (manuscriptText.toLowerCase().includes('significant') || manuscriptText.includes('p')) {
    return checkSignificance(manuscriptText, manifest);
  }

  // Default: assume consistent if no specific check applies
  return {
    variable: 'general_claim',
    valueInDb: 'Not quantified',
    consistencyStatus: 'not_applicable'
  };
}

/**
 * Extract percentages and numbers from text
 */
function extractNumbers(text: string): number[] {
  const numbers: number[] = [];
  
  // Extract percentages (9%, 10.5%)
  const percentages = text.match(/(\d+\.?\d*)%/g);
  if (percentages) {
    percentages.forEach(p => {
      const num = parseFloat(p.replace('%', ''));
      numbers.push(num / 100); // Convert to decimal
    });
  }
  
  // Extract p-values (p<0.05, p=0.001)
  const pValues = text.match(/p\s*[<>=]\s*(\d+\.?\d*)/gi);
  if (pValues) {
    pValues.forEach(p => {
      const match = p.match(/(\d+\.?\d*)/);
      if (match) {
        numbers.push(parseFloat(match[1]));
      }
    });
  }
  
  return numbers;
}

/**
 * Check mortality rate claim
 */
function checkMortalityRate(numbers: number[], manifest: StatisticalManifest): ManifestCheck {
  // Find mortality variable in manifest
  const mortalityVar = manifest.descriptiveStats.find(stat => 
    stat.variableId.toLowerCase().includes('mortality') || 
    stat.label.toLowerCase().includes('mortality')
  );

  if (!mortalityVar || numbers.length === 0) {
    return {
      variable: 'mortality_rate',
      valueInDb: mortalityVar?.results.mean || 'Unknown',
      consistencyStatus: 'not_applicable'
    };
  }

  const actualRate = mortalityVar.results.mean || 0;
  const claimedRate = numbers[0];
  const deviation = Math.abs((claimedRate - actualRate) / actualRate * 100);

  return {
    variable: mortalityVar.variableId,
    valueInDb: actualRate,
    expectedValue: claimedRate,
    deviation: deviation,
    consistencyStatus: deviation < 5 ? 'matches' : 'conflict'
  };
}

/**
 * Check stroke rate claim
 */
function checkStrokeRate(numbers: number[], manifest: StatisticalManifest): ManifestCheck {
  const strokeVar = manifest.descriptiveStats.find(stat => 
    stat.variableId.toLowerCase().includes('stroke') || 
    stat.label.toLowerCase().includes('stroke')
  );

  if (!strokeVar || numbers.length === 0) {
    return {
      variable: 'stroke_rate',
      valueInDb: strokeVar?.results.mean || 'Unknown',
      consistencyStatus: 'not_applicable'
    };
  }

  const actualRate = strokeVar.results.mean || 0;
  const claimedRate = numbers[0];
  const deviation = Math.abs((claimedRate - actualRate) / actualRate * 100);

  return {
    variable: strokeVar.variableId,
    valueInDb: actualRate,
    expectedValue: claimedRate,
    deviation: deviation,
    consistencyStatus: deviation < 5 ? 'matches' : 'conflict'
  };
}

/**
 * Check significance claims
 */
function checkSignificance(text: string, manifest: StatisticalManifest): ManifestCheck {
  const pValues = extractNumbers(text).filter(n => n <= 1); // p-values are 0-1
  
  if (pValues.length === 0) {
    return {
      variable: 'significance',
      valueInDb: 'Not specified',
      consistencyStatus: 'not_applicable'
    };
  }

  const claimedP = pValues[0];
  const claimsSignificance = text.toLowerCase().includes('significant');
  const actuallySignificant = claimedP < 0.05;

  if (claimsSignificance && !actuallySignificant) {
    return {
      variable: 'p_value',
      valueInDb: claimedP,
      expectedValue: '< 0.05',
      consistencyStatus: 'conflict'
    };
  }

  if (!claimsSignificance && actuallySignificant) {
    return {
      variable: 'p_value',
      valueInDb: claimedP,
      expectedValue: '≥ 0.05',
      consistencyStatus: 'conflict'
    };
  }

  return {
    variable: 'p_value',
    valueInDb: claimedP,
    consistencyStatus: 'matches'
  };
}

/**
 * Determine overall verification status
 */
function determineOverallStatus(
  similarityScore: number, 
  consistencyStatus: 'matches' | 'conflict' | 'not_applicable'
): 'verified' | 'partial' | 'conflict' {
  if (consistencyStatus === 'conflict') {
    return 'conflict';
  }
  
  if (similarityScore >= 0.85 && (consistencyStatus === 'matches' || consistencyStatus === 'not_applicable')) {
    return 'verified';
  }
  
  return 'partial';
}

/**
 * Generate mock DOI
 */
function generateMockDOI(citationKey: string): string {
  const year = citationKey.match(/20\d{2}/)?.[0] || '2024';
  const journal = citationKey.includes('VESTAL') ? 'jvs' : 
                  citationKey.includes('SVS') ? 'jvs' : 
                  'clinres';
  return `10.1016/j.${journal}.${year}`;
}

/**
 * Add more source excerpts (for testing)
 */
export function addSourceExcerpts(citationKey: string, excerpts: SourceExcerpt[]) {
  mockSourceExcerpts[citationKey] = excerpts;
}

/**
 * Get all verification packets for a manuscript
 */
export function getAllVerifications(manuscriptContent: Record<string, string>): VerificationPacket[] {
  const verifications: VerificationPacket[] = [];
  
  Object.entries(manuscriptContent).forEach(([section, content]) => {
    // Find all citations in content
    const citationPattern = /\[@([^\]]+)\]/g;
    const matches = [...content.matchAll(citationPattern)];
    
    // For demo purposes, we'll skip actual verification generation here
    // This would be called when citations are created
  });

  return verifications;
}
