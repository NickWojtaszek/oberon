/**
 * Mismatch Detection Engine
 * Research Factory - Phase 4: Logic Audit System
 * 
 * Extracts statistical claims from manuscript text and compares
 * against ground truth from Statistical Manifest
 */

import type { MismatchCard, VerifiedResult } from '../types/accountability';
import type { StatisticalManifest } from '../components/analytics-stats/types';

// ============================================================================
// Statistical Claim Extraction
// ============================================================================

export interface ExtractedClaim {
  type: 'percentage' | 'p-value' | 'sample-size' | 'fraction' | 'mean' | 'median';
  value: number | string;
  rawText: string;
  section: string;
  context: string;  // Surrounding text for context
  position: number; // Character position in text
}

/**
 * Extract all statistical claims from manuscript text
 */
export function extractStatisticalClaims(
  text: string,
  section: string = 'unknown'
): ExtractedClaim[] {
  const claims: ExtractedClaim[] = [];

  // Pattern 1: Percentages (e.g., "9.7%", "25.3 percent")
  const percentagePattern = /(\d+\.?\d*)\s*%/g;
  let match;
  while ((match = percentagePattern.exec(text)) !== null) {
    claims.push({
      type: 'percentage',
      value: parseFloat(match[1]),
      rawText: match[0],
      section,
      context: extractContext(text, match.index),
      position: match.index,
    });
  }

  // Pattern 2: P-values (e.g., "p=0.02", "p < 0.001", "P = .045")
  const pValuePattern = /p\s*[=<>]\s*0?\.\d+/gi;
  while ((match = pValuePattern.exec(text)) !== null) {
    const valueMatch = match[0].match(/0?\.\d+/);
    if (valueMatch) {
      claims.push({
        type: 'p-value',
        value: parseFloat(valueMatch[0]),
        rawText: match[0],
        section,
        context: extractContext(text, match.index),
        position: match.index,
      });
    }
  }

  // Pattern 3: Sample sizes (e.g., "N=142", "n = 500", "(N=1000)")
  const sampleSizePattern = /n\s*=\s*(\d+)/gi;
  while ((match = sampleSizePattern.exec(text)) !== null) {
    claims.push({
      type: 'sample-size',
      value: parseInt(match[1], 10),
      rawText: match[0],
      section,
      context: extractContext(text, match.index),
      position: match.index,
    });
  }

  // Pattern 4: Fractions with percentages (e.g., "45/142 (31.7%)")
  const fractionPattern = /(\d+)\/(\d+)\s*\((\d+\.?\d*)%\)/g;
  while ((match = fractionPattern.exec(text)) !== null) {
    claims.push({
      type: 'fraction',
      value: `${match[1]}/${match[2]}`,
      rawText: match[0],
      section,
      context: extractContext(text, match.index),
      position: match.index,
    });
  }

  // Pattern 5: Mean/Median values (e.g., "mean age 65.3 years", "median FI 3.2")
  const meanMedianPattern = /(mean|median)\s+(\w+\s+)?(\d+\.?\d*)/gi;
  while ((match = meanMedianPattern.exec(text)) !== null) {
    claims.push({
      type: match[1].toLowerCase() === 'mean' ? 'mean' : 'median',
      value: parseFloat(match[3]),
      rawText: match[0],
      section,
      context: extractContext(text, match.index),
      position: match.index,
    });
  }

  return claims;
}

/**
 * Extract surrounding context (50 chars before and after)
 */
function extractContext(text: string, position: number, radius: number = 50): string {
  const start = Math.max(0, position - radius);
  const end = Math.min(text.length, position + radius);
  return text.substring(start, end).trim();
}

// ============================================================================
// Mismatch Detection
// ============================================================================

/**
 * Compare extracted claims against Statistical Manifest
 */
export function detectMismatches(
  manuscriptContent: string,
  statisticalManifest: StatisticalManifest | null,
  protocolId: string
): MismatchCard[] {
  if (!statisticalManifest) return [];

  const mismatches: MismatchCard[] = [];
  
  // Extract claims from different sections
  const sections = ['introduction', 'methods', 'results', 'discussion'];
  const allClaims: ExtractedClaim[] = [];

  sections.forEach(section => {
    const sectionText = (manuscriptContent as any)[section] || '';
    const claims = extractStatisticalClaims(sectionText, section);
    allClaims.push(...claims);
  });

  // Compare each claim against manifest
  allClaims.forEach(claim => {
    const manifestValue = findMatchingManifestValue(claim, statisticalManifest);
    
    if (manifestValue) {
      const doesMatch = valuesMatch(claim, manifestValue);
      
      if (!doesMatch) {
        mismatches.push({
          id: generateMismatchId(),
          severity: determineSeverity(claim, manifestValue),
          section: capitalizeSection(claim.section),
          textClaim: claim.rawText,
          manifestValue: manifestValue,
          status: 'unresolved',
          sourceVariableId: manifestValue.var,
          protocolId: protocolId,
        });
      }
    }
  });

  return mismatches;
}

/**
 * Find matching value in Statistical Manifest
 */
function findMatchingManifestValue(
  claim: ExtractedClaim,
  manifest: StatisticalManifest
): VerifiedResult | null {
  // For now, use simple heuristics based on claim type and value proximity
  // In production, this would use more sophisticated matching
  
  const manifestEntries = manifest.results || [];
  
  for (const entry of manifestEntries) {
    // Match percentages
    if (claim.type === 'percentage' && typeof entry.value === 'number') {
      const claimValue = typeof claim.value === 'number' ? claim.value : parseFloat(claim.value as string);
      const diff = Math.abs(claimValue - entry.value);
      
      // If values are close but not exact, it might be a mismatch
      if (diff > 0.1 && diff < 10) {
        return {
          var: entry.variableId || 'unknown',
          val: entry.value,
          p: entry.pValue,
          n: entry.sampleSize,
        };
      }
    }
    
    // Match p-values
    if (claim.type === 'p-value' && entry.pValue !== undefined) {
      const claimValue = typeof claim.value === 'number' ? claim.value : parseFloat(claim.value as string);
      const diff = Math.abs(claimValue - entry.pValue);
      
      if (diff > 0.001 && diff < 0.1) {
        return {
          var: entry.variableId || 'unknown',
          val: entry.value,
          p: entry.pValue,
          n: entry.sampleSize,
        };
      }
    }
    
    // Match sample sizes
    if (claim.type === 'sample-size' && entry.sampleSize !== undefined) {
      const claimValue = typeof claim.value === 'number' ? claim.value : parseInt(claim.value as string, 10);
      const diff = Math.abs(claimValue - entry.sampleSize);
      
      if (diff > 0 && diff < 100) {
        return {
          var: entry.variableId || 'unknown',
          val: entry.value,
          p: entry.pValue,
          n: entry.sampleSize,
        };
      }
    }
  }
  
  return null;
}

/**
 * Check if claim matches manifest value
 */
function valuesMatch(claim: ExtractedClaim, manifestValue: VerifiedResult): boolean {
  const claimValue = typeof claim.value === 'number' ? claim.value : parseFloat(claim.value as string);
  const manifestVal = typeof manifestValue.val === 'number' ? manifestValue.val : parseFloat(manifestValue.val as string);
  
  // Allow for small rounding differences (0.1)
  return Math.abs(claimValue - manifestVal) < 0.1;
}

/**
 * Determine severity of mismatch
 */
function determineSeverity(
  claim: ExtractedClaim,
  manifestValue: VerifiedResult
): 'critical' | 'warning' | 'info' {
  const claimValue = typeof claim.value === 'number' ? claim.value : parseFloat(claim.value as string);
  const manifestVal = typeof manifestValue.val === 'number' ? manifestValue.val : parseFloat(manifestValue.val as string);
  
  const diff = Math.abs(claimValue - manifestVal);
  const percentDiff = (diff / manifestVal) * 100;
  
  // Critical: > 10% difference or primary outcome
  if (percentDiff > 10 || claim.section === 'results') {
    return 'critical';
  }
  
  // Warning: 5-10% difference
  if (percentDiff > 5) {
    return 'warning';
  }
  
  // Info: < 5% difference
  return 'info';
}

/**
 * Generate unique mismatch ID
 */
function generateMismatchId(): string {
  return `mismatch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Capitalize section name
 */
function capitalizeSection(section: string): string {
  return section.charAt(0).toUpperCase() + section.slice(1);
}

// ============================================================================
// Auto-Sync Logic
// ============================================================================

/**
 * Replace incorrect value in manuscript with ground truth
 */
export function autoSyncMismatch(
  manuscriptContent: string,
  mismatch: MismatchCard
): string {
  const incorrectText = mismatch.textClaim;
  const correctValue = formatVerifiedResult(mismatch.manifestValue);
  
  // Simple replacement (in production, would be more sophisticated)
  return manuscriptContent.replace(incorrectText, correctValue);
}

/**
 * Format verified result for display
 */
export function formatVerifiedResult(result: VerifiedResult): string {
  let output = String(result.val);
  
  // Add percentage symbol if it's a percentage
  if (typeof result.val === 'number' && result.val < 100) {
    output += '%';
  }
  
  if (result.p !== undefined) {
    output += ` (p=${result.p})`;
  }
  
  if (result.n !== undefined) {
    output += ` [N=${result.n}]`;
  }
  
  return output;
}

// ============================================================================
// Demo Data Generator
// ============================================================================

/**
 * Generate demo mismatches for testing
 */
export function generateDemoMismatches(protocolId: string): MismatchCard[] {
  return [
    {
      id: 'demo_mismatch_1',
      severity: 'critical',
      section: 'Results',
      textClaim: '30-day mortality was 9.7%',
      manifestValue: {
        var: 'mortality_30d',
        val: 6.7,
        p: 0.02,
        n: 142,
      },
      status: 'unresolved',
      sourceVariableId: 'protocol_var_mortality_30d',
      protocolId: protocolId,
    },
    {
      id: 'demo_mismatch_2',
      severity: 'warning',
      section: 'Methods',
      textClaim: 'Sample size N=150',
      manifestValue: {
        var: 'sample_size',
        val: 142,
        n: 142,
      },
      status: 'unresolved',
      sourceVariableId: 'protocol_var_sample_size',
      protocolId: protocolId,
    },
    {
      id: 'demo_mismatch_3',
      severity: 'info',
      section: 'Results',
      textClaim: 'p=0.025',
      manifestValue: {
        var: 'primary_outcome_p',
        val: 6.7,
        p: 0.02,
        n: 142,
      },
      status: 'unresolved',
      sourceVariableId: 'protocol_var_primary_p',
      protocolId: protocolId,
    },
  ];
}
