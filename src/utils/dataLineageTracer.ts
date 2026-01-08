/**
 * Data Lineage Tracer
 * Research Factory - Phase 5: Scientific Receipt
 * 
 * Maps every statistical claim in manuscript back to protocol variables
 * Generates complete traceability for regulatory compliance
 */

import type { MismatchCard, VerifiedResult, DataLineageEntry } from '../types/accountability';
import type { StatisticalManifest } from '../components/analytics-stats/types';
import { extractStatisticalClaims, type ExtractedClaim } from './mismatchDetectionEngine';

// ============================================================================
// Data Lineage Mapping
// ============================================================================

/**
 * Build complete data lineage table for manuscript
 */
export function buildDataLineage(
  manuscriptSections: {
    abstract?: string;
    introduction?: string;
    methods?: string;
    results?: string;
    discussion?: string;
  },
  statisticalManifest: StatisticalManifest | null,
  protocolId: string
): DataLineageEntry[] {
  if (!statisticalManifest) return [];

  const lineageEntries: DataLineageEntry[] = [];
  
  // Process each section
  Object.entries(manuscriptSections).forEach(([section, content]) => {
    if (!content) return;
    
    const claims = extractStatisticalClaims(content, section);
    
    claims.forEach(claim => {
      const manifestEntry = findManifestEntry(claim, statisticalManifest);
      
      if (manifestEntry) {
        lineageEntries.push({
          manuscriptSection: capitalizeSection(section),
          claimText: claim.rawText,
          claimContext: claim.context,
          protocolVariableId: manifestEntry.variableId || 'unknown',
          protocolVariableName: manifestEntry.label || 'Unknown Variable',
          groundTruthValue: manifestEntry.value,
          pValue: manifestEntry.pValue,
          sampleSize: manifestEntry.sampleSize,
          verificationStatus: determineVerificationStatus(claim, manifestEntry),
          lastVerified: new Date().toISOString(),
          verifiedBy: 'system',
        });
      } else {
        // Claim found but no manifest entry - flag as unverified
        lineageEntries.push({
          manuscriptSection: capitalizeSection(section),
          claimText: claim.rawText,
          claimContext: claim.context,
          protocolVariableId: 'unverified',
          protocolVariableName: 'No Protocol Source',
          groundTruthValue: claim.value,
          verificationStatus: 'unverified',
          lastVerified: new Date().toISOString(),
          verifiedBy: 'system',
        });
      }
    });
  });

  return lineageEntries;
}

/**
 * Find corresponding manifest entry for a claim
 */
function findManifestEntry(
  claim: ExtractedClaim,
  manifest: StatisticalManifest
): any | null {
  const manifestEntries = manifest.results || [];
  
  for (const entry of manifestEntries) {
    // Try to match by value and type
    if (claim.type === 'percentage' && typeof entry.value === 'number') {
      const claimValue = typeof claim.value === 'number' ? claim.value : parseFloat(claim.value as string);
      const diff = Math.abs(claimValue - entry.value);
      
      // If values match closely (within 0.1%), consider it a match
      if (diff < 0.1) {
        return entry;
      }
    }
    
    if (claim.type === 'p-value' && entry.pValue !== undefined) {
      const claimValue = typeof claim.value === 'number' ? claim.value : parseFloat(claim.value as string);
      const diff = Math.abs(claimValue - entry.pValue);
      
      if (diff < 0.001) {
        return entry;
      }
    }
    
    if (claim.type === 'sample-size' && entry.sampleSize !== undefined) {
      const claimValue = typeof claim.value === 'number' ? claim.value : parseInt(claim.value as string, 10);
      
      if (claimValue === entry.sampleSize) {
        return entry;
      }
    }
  }
  
  return null;
}

/**
 * Determine verification status of a claim
 */
function determineVerificationStatus(
  claim: ExtractedClaim,
  manifestEntry: any
): 'verified' | 'auto-fixed' | 'unverified' | 'flagged' {
  const claimValue = typeof claim.value === 'number' ? claim.value : parseFloat(claim.value as string);
  const manifestValue = typeof manifestEntry.value === 'number' ? manifestEntry.value : parseFloat(manifestEntry.value as string);
  
  const diff = Math.abs(claimValue - manifestValue);
  
  if (diff < 0.1) {
    return 'verified';
  }
  
  return 'flagged';
}

/**
 * Capitalize section name
 */
function capitalizeSection(section: string): string {
  return section.charAt(0).toUpperCase() + section.slice(1);
}

// ============================================================================
// Lineage Table Formatting
// ============================================================================

/**
 * Format lineage data as CSV for export
 */
export function formatLineageAsCSV(lineage: DataLineageEntry[]): string {
  const headers = [
    'Manuscript Section',
    'Claim Text',
    'Context',
    'Protocol Variable ID',
    'Protocol Variable Name',
    'Ground Truth Value',
    'P-Value',
    'Sample Size',
    'Verification Status',
    'Last Verified',
    'Verified By'
  ];
  
  const rows = lineage.map(entry => [
    entry.manuscriptSection,
    entry.claimText,
    entry.claimContext,
    entry.protocolVariableId,
    entry.protocolVariableName,
    String(entry.groundTruthValue),
    entry.pValue !== undefined ? String(entry.pValue) : 'N/A',
    entry.sampleSize !== undefined ? String(entry.sampleSize) : 'N/A',
    entry.verificationStatus,
    entry.lastVerified,
    entry.verifiedBy
  ]);
  
  const csvLines = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ];
  
  return csvLines.join('\n');
}

/**
 * Format lineage data as HTML table for PDF
 */
export function formatLineageAsHTML(lineage: DataLineageEntry[]): string {
  const rows = lineage.map(entry => `
    <tr>
      <td>${entry.manuscriptSection}</td>
      <td><code>${escapeHtml(entry.claimText)}</code></td>
      <td>${escapeHtml(entry.claimContext.substring(0, 50))}...</td>
      <td>${entry.protocolVariableId}</td>
      <td>${entry.protocolVariableName}</td>
      <td><strong>${entry.groundTruthValue}</strong></td>
      <td>${entry.pValue !== undefined ? entry.pValue : 'N/A'}</td>
      <td>${entry.sampleSize !== undefined ? entry.sampleSize : 'N/A'}</td>
      <td><span class="status-${entry.verificationStatus}">${entry.verificationStatus}</span></td>
    </tr>
  `).join('');
  
  return `
    <table class="lineage-table">
      <thead>
        <tr>
          <th>Section</th>
          <th>Claim</th>
          <th>Context</th>
          <th>Protocol Var ID</th>
          <th>Variable Name</th>
          <th>Ground Truth</th>
          <th>P-Value</th>
          <th>N</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

/**
 * Escape HTML characters
 */
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// ============================================================================
// Lineage Statistics
// ============================================================================

/**
 * Calculate lineage statistics for audit snapshot
 */
export function calculateLineageStats(lineage: DataLineageEntry[]): {
  totalClaims: number;
  verifiedClaims: number;
  autoFixedClaims: number;
  unverifiedClaims: number;
  flaggedClaims: number;
  verificationRate: number;
} {
  const totalClaims = lineage.length;
  const verifiedClaims = lineage.filter(e => e.verificationStatus === 'verified').length;
  const autoFixedClaims = lineage.filter(e => e.verificationStatus === 'auto-fixed').length;
  const unverifiedClaims = lineage.filter(e => e.verificationStatus === 'unverified').length;
  const flaggedClaims = lineage.filter(e => e.verificationStatus === 'flagged').length;
  
  const verificationRate = totalClaims > 0 
    ? ((verifiedClaims + autoFixedClaims) / totalClaims) * 100 
    : 0;
  
  return {
    totalClaims,
    verifiedClaims,
    autoFixedClaims,
    unverifiedClaims,
    flaggedClaims,
    verificationRate,
  };
}

// ============================================================================
// Demo Data Generator
// ============================================================================

/**
 * Generate demo lineage data for testing
 */
export function generateDemoLineage(): DataLineageEntry[] {
  return [
    {
      manuscriptSection: 'Results',
      claimText: '30-day mortality was 6.7%',
      claimContext: 'The primary outcome showed that 30-day mortality was 6.7% in the intervention group compared to...',
      protocolVariableId: 'protocol_var_mortality_30d',
      protocolVariableName: '30-Day Mortality',
      groundTruthValue: 6.7,
      pValue: 0.02,
      sampleSize: 142,
      verificationStatus: 'verified',
      lastVerified: new Date().toISOString(),
      verifiedBy: 'system',
    },
    {
      manuscriptSection: 'Results',
      claimText: 'median Frailty Index of 3.2',
      claimContext: 'Patients had a median Frailty Index of 3.2, indicating moderate frailty at baseline...',
      protocolVariableId: 'protocol_var_frailty_median',
      protocolVariableName: 'Median Frailty Index',
      groundTruthValue: 3.2,
      pValue: undefined,
      sampleSize: 142,
      verificationStatus: 'verified',
      lastVerified: new Date().toISOString(),
      verifiedBy: 'system',
    },
    {
      manuscriptSection: 'Methods',
      claimText: 'N=142',
      claimContext: 'A total of N=142 patients were enrolled in the study between 2023 and 2025...',
      protocolVariableId: 'protocol_var_sample_size',
      protocolVariableName: 'Total Sample Size',
      groundTruthValue: 142,
      pValue: undefined,
      sampleSize: 142,
      verificationStatus: 'verified',
      lastVerified: new Date().toISOString(),
      verifiedBy: 'system',
    },
    {
      manuscriptSection: 'Results',
      claimText: 'p=0.02',
      claimContext: 'This difference was statistically significant (p=0.02), demonstrating the efficacy...',
      protocolVariableId: 'protocol_var_primary_p',
      protocolVariableName: 'Primary Outcome P-Value',
      groundTruthValue: 6.7,
      pValue: 0.02,
      sampleSize: 142,
      verificationStatus: 'verified',
      lastVerified: new Date().toISOString(),
      verifiedBy: 'system',
    },
    {
      manuscriptSection: 'Results',
      claimText: 'mean age 68.5 years',
      claimContext: 'The cohort had a mean age 68.5 years with predominately male participants...',
      protocolVariableId: 'protocol_var_age_mean',
      protocolVariableName: 'Mean Age',
      groundTruthValue: 68.5,
      pValue: undefined,
      sampleSize: 142,
      verificationStatus: 'verified',
      lastVerified: new Date().toISOString(),
      verifiedBy: 'system',
    },
  ];
}
