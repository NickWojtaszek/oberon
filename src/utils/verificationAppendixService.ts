// Verification Appendix Generation Service - Scientific Receipt Builder

import type { 
  VerificationAppendix, 
  DataLineageEntry, 
  SourceValidationEntry,
  MultiplierAuditEntry,
  AuditSummary,
  ExportOptions,
  ExportResult
} from '../types/verificationAppendix';
import type { ManuscriptManifest, SourceDocument } from '../types/manuscript';
import type { StatisticalManifest } from '../components/analytics-stats/types';
import type { VerificationPacket } from '../types/evidenceVerification';

/**
 * Generate complete Verification Appendix for manuscript
 */
export function generateVerificationAppendix(
  manuscript: ManuscriptManifest,
  manifest: StatisticalManifest | null,
  verifications: VerificationPacket[],
  userName: string
): VerificationAppendix {
  const dataLineage = extractDataLineage(manuscript, manifest);
  const sourceValidation = extractSourceValidation(manuscript, verifications);
  const multiplierAudit = extractMultiplierUsage(manuscript);
  const auditSummary = calculateAuditSummary(dataLineage, sourceValidation, verifications);
  
  return {
    appendixMetadata: {
      manuscriptId: manuscript.id,
      manuscriptTitle: manuscript.projectMeta.studyTitle,
      projectId: manuscript.projectMeta.projectId,
      generatedAt: Date.now(),
      generatedBy: userName,
      version: '1.0',
      manifestVersion: manifest?.manifestMetadata.version,
      protocolVersion: manuscript.projectMeta.protocolRef
    },
    auditSummary,
    dataLineage,
    sourceValidation,
    multiplierAudit,
    complianceFlags: {
      allClaimsVerified: auditSummary.verificationRate === 100,
      noFabricatedCitations: sourceValidation.every(s => s.overallGrounding !== 'unverified'),
      dataMatchesManifest: dataLineage.every(d => d.verified),
      piReviewRequired: auditSummary.verificationRate < 95 || auditSummary.logicChecks.errors > 0,
      readyForSubmission: auditSummary.verificationRate >= 95 && auditSummary.logicChecks.errors === 0
    }
  };
}

/**
 * Extract data lineage: Map statistical claims in text to manifest variables
 */
function extractDataLineage(
  manuscript: ManuscriptManifest,
  manifest: StatisticalManifest | null
): DataLineageEntry[] {
  const lineage: DataLineageEntry[] = [];
  
  if (!manifest) return lineage;
  
  // Parse all sections for statistical claims
  Object.entries(manuscript.manuscriptContent).forEach(([section, content]) => {
    // Extract p-values
    const pValueMatches = [...content.matchAll(/p\s*[=<>]\s*0?\.\d+/gi)];
    pValueMatches.forEach((match, idx) => {
      const claim = match[0];
      const pValue = parseFloat(claim.match(/0?\.\d+/)?.[0] || '1');
      
      // Find corresponding comparison in manifest
      const comparison = manifest.comparativeAnalyses.find(c => 
        Math.abs((c.pValue || 1) - pValue) < 0.001
      );
      
      if (comparison) {
        lineage.push({
          claimInText: claim,
          section: section as any,
          lineNumber: content.substring(0, match.index).split('\n').length,
          manifestVariable: comparison.outcome || 'unknown',
          manifestValue: comparison.pValue || 1,
          testUsed: comparison.testUsed,
          verified: true
        });
      } else {
        lineage.push({
          claimInText: claim,
          section: section as any,
          lineNumber: content.substring(0, match.index).split('\n').length,
          manifestVariable: 'NOT_FOUND',
          manifestValue: pValue,
          verified: false,
          discrepancy: `P-value ${pValue} not found in Statistical Manifest`
        });
      }
    });
    
    // Extract sample sizes (N=...)
    const nMatches = [...content.matchAll(/[Nn]\s*=\s*(\d+)/g)];
    nMatches.forEach((match, idx) => {
      const claim = match[0];
      const nValue = parseInt(match[1]);
      
      const matchesTotal = nValue === manifest.manifestMetadata.totalRecordsAnalyzed;
      const matchesStat = manifest.descriptiveStats.some(s => s.results.n === nValue);
      
      if (matchesTotal || matchesStat) {
        lineage.push({
          claimInText: claim,
          section: section as any,
          lineNumber: content.substring(0, match.index).split('\n').length,
          manifestVariable: matchesTotal ? 'total_n' : 'subset_n',
          manifestValue: nValue,
          verified: true
        });
      } else {
        lineage.push({
          claimInText: claim,
          section: section as any,
          lineNumber: content.substring(0, match.index).split('\n').length,
          manifestVariable: 'NOT_FOUND',
          manifestValue: nValue,
          verified: false,
          discrepancy: `Sample size N=${nValue} not found in Statistical Manifest`
        });
      }
    });
    
    // Extract percentages and link to descriptive stats
    const percentMatches = [...content.matchAll(/(\d+\.?\d*)\s*%/g)];
    percentMatches.forEach((match, idx) => {
      const claim = match[0];
      const percent = parseFloat(match[1]);
      const proportion = percent / 100;
      
      // Find matching descriptive stat
      const stat = manifest.descriptiveStats.find(s => 
        s.results.mean && Math.abs(s.results.mean - proportion) < 0.01
      );
      
      if (stat) {
        lineage.push({
          claimInText: claim,
          section: section as any,
          lineNumber: content.substring(0, match.index).split('\n').length,
          manifestVariable: stat.variableId,
          manifestValue: stat.results.mean || 0,
          verified: true
        });
      }
    });
  });
  
  return lineage;
}

/**
 * Extract source validation: Map citations to grounded snippets
 */
function extractSourceValidation(
  manuscript: ManuscriptManifest,
  verifications: VerificationPacket[]
): SourceValidationEntry[] {
  const validationMap = new Map<string, SourceValidationEntry>();
  
  // Count citations per source
  const citationCounts = new Map<string, { count: number; sections: Set<string> }>();
  
  Object.entries(manuscript.manuscriptContent).forEach(([section, content]) => {
    const matches = [...content.matchAll(/\[@([^\]]+)\]/g)];
    matches.forEach(match => {
      const key = match[1];
      if (!citationCounts.has(key)) {
        citationCounts.set(key, { count: 0, sections: new Set() });
      }
      const entry = citationCounts.get(key)!;
      entry.count++;
      entry.sections.add(section);
    });
  });
  
  // Build validation entries
  manuscript.notebookContext.linkedSources.forEach(source => {
    const citationData = citationCounts.get(source.citationKey);
    
    if (!citationData) return; // Source not cited
    
    // Find all verifications for this source
    const sourceVerifications = verifications.filter(v => v.citationKey === source.citationKey);
    
    const groundedSnippets = sourceVerifications.map(v => ({
      snippet: v.sourceExcerpt.text,
      page: v.sourceExcerpt.page,
      verificationScore: v.externalCheck.similarityScore,
      claimSupported: v.manuscriptClaim
    }));
    
    // Calculate overall grounding
    const avgScore = groundedSnippets.length > 0
      ? groundedSnippets.reduce((sum, s) => sum + s.verificationScore, 0) / groundedSnippets.length
      : 0;
    
    const overallGrounding: 'verified' | 'partial' | 'unverified' = 
      avgScore >= 0.85 ? 'verified' :
      avgScore >= 0.60 ? 'partial' : 
      'unverified';
    
    validationMap.set(source.citationKey, {
      citationKey: source.citationKey,
      citationCount: citationData.count,
      sourceName: source.fileName,
      sections: Array.from(citationData.sections),
      groundedSnippets,
      overallGrounding
    });
  });
  
  return Array.from(validationMap.values());
}

/**
 * Extract Research Multiplier usage tracking
 */
function extractMultiplierUsage(manuscript: ManuscriptManifest): MultiplierAuditEntry[] {
  const multiplierAudit: MultiplierAuditEntry[] = [];
  
  // Parse discussion for lateral insights
  manuscript.manuscriptStructure.discussionAnchors.lateralOpportunities?.forEach(opp => {
    multiplierAudit.push({
      opportunityTitle: opp.title,
      variablesUsed: opp.suggestedVariables || [],
      integratedInSection: 'discussion',
      rationale: opp.rationale
    });
  });
  
  return multiplierAudit;
}

/**
 * Calculate comprehensive audit summary
 */
function calculateAuditSummary(
  dataLineage: DataLineageEntry[],
  sourceValidation: SourceValidationEntry[],
  verifications: VerificationPacket[]
): AuditSummary {
  const totalClaims = dataLineage.length + sourceValidation.reduce((sum, s) => sum + s.citationCount, 0);
  const verifiedClaims = dataLineage.filter(d => d.verified).length + 
    sourceValidation.filter(s => s.overallGrounding === 'verified').reduce((sum, s) => sum + s.citationCount, 0);
  
  const statisticalClaims = {
    total: dataLineage.length,
    manifestMatched: dataLineage.filter(d => d.verified).length,
    unmatched: dataLineage.filter(d => !d.verified).length
  };
  
  const citationClaims = {
    total: sourceValidation.reduce((sum, s) => sum + s.citationCount, 0),
    grounded: sourceValidation.filter(s => s.overallGrounding === 'verified').reduce((sum, s) => sum + s.citationCount, 0),
    partiallyGrounded: sourceValidation.filter(s => s.overallGrounding === 'partial').reduce((sum, s) => sum + s.citationCount, 0),
    ungrounded: sourceValidation.filter(s => s.overallGrounding === 'unverified').reduce((sum, s) => sum + s.citationCount, 0)
  };
  
  const logicChecks = {
    passed: dataLineage.filter(d => d.verified).length,
    warnings: dataLineage.filter(d => !d.verified && d.discrepancy).length,
    errors: dataLineage.filter(d => !d.verified && d.manifestVariable === 'NOT_FOUND').length
  };
  
  return {
    totalClaims,
    verifiedClaims,
    manualApprovals: 0, // Would be tracked separately in production
    conflictResolutions: verifications.filter(v => v.internalCheck?.status === 'conflict').length,
    verificationRate: totalClaims > 0 ? (verifiedClaims / totalClaims) * 100 : 0,
    statisticalClaims,
    citationClaims,
    logicChecks
  };
}

/**
 * Generate text-based Verification Appendix (for PDF export)
 */
export function generateAppendixText(appendix: VerificationAppendix): string {
  const lines: string[] = [];
  
  // Header
  lines.push('═'.repeat(80));
  lines.push('VERIFICATION APPENDIX');
  lines.push('Scientific Receipt for Manuscript Submission');
  lines.push('═'.repeat(80));
  lines.push('');
  
  // Metadata
  lines.push('MANUSCRIPT INFORMATION');
  lines.push('-'.repeat(80));
  lines.push(`Title: ${appendix.appendixMetadata.manuscriptTitle}`);
  lines.push(`Manuscript ID: ${appendix.appendixMetadata.manuscriptId}`);
  lines.push(`Generated: ${new Date(appendix.appendixMetadata.generatedAt).toLocaleString()}`);
  lines.push(`Generated by: ${appendix.appendixMetadata.generatedBy}`);
  lines.push(`Statistical Manifest Version: ${appendix.appendixMetadata.manifestVersion || 'N/A'}`);
  lines.push(`Protocol Version: ${appendix.appendixMetadata.protocolVersion || 'N/A'}`);
  lines.push('');
  
  // Audit Summary
  lines.push('AUDIT SUMMARY');
  lines.push('-'.repeat(80));
  lines.push(`Total Claims: ${appendix.auditSummary.totalClaims}`);
  lines.push(`Verified Claims: ${appendix.auditSummary.verifiedClaims}`);
  lines.push(`Verification Rate: ${appendix.auditSummary.verificationRate.toFixed(1)}%`);
  lines.push(`Manual PI Approvals: ${appendix.auditSummary.manualApprovals}`);
  lines.push(`Conflict Resolutions: ${appendix.auditSummary.conflictResolutions}`);
  lines.push('');
  
  lines.push('Statistical Claims:');
  lines.push(`  Total: ${appendix.auditSummary.statisticalClaims.total}`);
  lines.push(`  Manifest-Matched: ${appendix.auditSummary.statisticalClaims.manifestMatched}`);
  lines.push(`  Unmatched: ${appendix.auditSummary.statisticalClaims.unmatched}`);
  lines.push('');
  
  lines.push('Citation Claims:');
  lines.push(`  Total: ${appendix.auditSummary.citationClaims.total}`);
  lines.push(`  Grounded: ${appendix.auditSummary.citationClaims.grounded}`);
  lines.push(`  Partially Grounded: ${appendix.auditSummary.citationClaims.partiallyGrounded}`);
  lines.push(`  Ungrounded: ${appendix.auditSummary.citationClaims.ungrounded}`);
  lines.push('');
  
  lines.push('Logic Checks:');
  lines.push(`  Passed: ${appendix.auditSummary.logicChecks.passed}`);
  lines.push(`  Warnings: ${appendix.auditSummary.logicChecks.warnings}`);
  lines.push(`  Errors: ${appendix.auditSummary.logicChecks.errors}`);
  lines.push('');
  
  // Data Lineage
  lines.push('DATA LINEAGE');
  lines.push('-'.repeat(80));
  lines.push('Mapping of statistical claims in manuscript to Statistical Manifest variables:');
  lines.push('');
  
  if (appendix.dataLineage.length === 0) {
    lines.push('No statistical claims detected in manuscript.');
  } else {
    appendix.dataLineage.forEach((entry, idx) => {
      lines.push(`${idx + 1}. Claim: "${entry.claimInText}" (${entry.section}, line ${entry.lineNumber})`);
      lines.push(`   Manifest Variable: ${entry.manifestVariable}`);
      lines.push(`   Manifest Value: ${typeof entry.manifestValue === 'number' ? entry.manifestValue.toFixed(4) : entry.manifestValue}`);
      if (entry.testUsed) {
        lines.push(`   Test Used: ${entry.testUsed}`);
      }
      lines.push(`   Status: ${entry.verified ? '✓ VERIFIED' : '✗ UNVERIFIED'}`);
      if (entry.discrepancy) {
        lines.push(`   Discrepancy: ${entry.discrepancy}`);
      }
      lines.push('');
    });
  }
  
  // Source Validation
  lines.push('SOURCE VALIDATION');
  lines.push('-'.repeat(80));
  lines.push('Citations with grounded snippets and verification scores:');
  lines.push('');
  
  if (appendix.sourceValidation.length === 0) {
    lines.push('No citations found in manuscript.');
  } else {
    appendix.sourceValidation.forEach((entry, idx) => {
      lines.push(`${idx + 1}. Citation: @${entry.citationKey}`);
      lines.push(`   Source: ${entry.sourceName}`);
      lines.push(`   Usage: ${entry.citationCount} times in ${entry.sections.join(', ')}`);
      lines.push(`   Overall Grounding: ${entry.overallGrounding.toUpperCase()}`);
      lines.push('');
      
      if (entry.groundedSnippets.length > 0) {
        lines.push('   Grounded Snippets:');
        entry.groundedSnippets.forEach((snippet, sidx) => {
          lines.push(`   ${sidx + 1}. "${snippet.snippet.substring(0, 100)}..."`);
          lines.push(`      Page: ${snippet.page || 'N/A'}`);
          lines.push(`      Verification Score: ${(snippet.verificationScore * 100).toFixed(1)}%`);
          lines.push(`      Claim Supported: "${snippet.claimSupported.substring(0, 80)}..."`);
          lines.push('');
        });
      } else {
        lines.push('   No grounded snippets available.');
        lines.push('');
      }
    });
  }
  
  // Multiplier Audit
  if (appendix.multiplierAudit.length > 0) {
    lines.push('RESEARCH MULTIPLIER AUDIT');
    lines.push('-'.repeat(80));
    lines.push('Lateral insights from Research Multiplier integrated into manuscript:');
    lines.push('');
    
    appendix.multiplierAudit.forEach((entry, idx) => {
      lines.push(`${idx + 1}. Opportunity: ${entry.opportunityTitle}`);
      lines.push(`   Variables Used: ${entry.variablesUsed.join(', ')}`);
      lines.push(`   Integrated In: ${entry.integratedInSection || 'Not integrated'}`);
      lines.push(`   Rationale: ${entry.rationale}`);
      lines.push('');
    });
  }
  
  // Compliance Flags
  lines.push('COMPLIANCE FLAGS');
  lines.push('-'.repeat(80));
  lines.push(`All Claims Verified: ${appendix.complianceFlags.allClaimsVerified ? '✓ YES' : '✗ NO'}`);
  lines.push(`No Fabricated Citations: ${appendix.complianceFlags.noFabricatedCitations ? '✓ YES' : '✗ NO'}`);
  lines.push(`Data Matches Manifest: ${appendix.complianceFlags.dataMatchesManifest ? '✓ YES' : '✗ NO'}`);
  lines.push(`PI Review Required: ${appendix.complianceFlags.piReviewRequired ? 'YES' : 'NO'}`);
  lines.push(`Ready for Submission: ${appendix.complianceFlags.readyForSubmission ? '✓ YES' : '✗ NO'}`);
  lines.push('');
  
  // Sign-off Section
  lines.push('DIGITAL SIGN-OFF');
  lines.push('-'.repeat(80));
  if (appendix.signOff) {
    lines.push(`Principal Investigator: ${appendix.signOff.piName}`);
    if (appendix.signOff.piEmail) {
      lines.push(`Email: ${appendix.signOff.piEmail}`);
    }
    if (appendix.signOff.reviewedAt) {
      lines.push(`Reviewed: ${new Date(appendix.signOff.reviewedAt).toLocaleString()}`);
    }
    lines.push('');
    lines.push('Attestation:');
    lines.push(appendix.signOff.attestation);
    if (appendix.signOff.notes) {
      lines.push('');
      lines.push('Additional Notes:');
      lines.push(appendix.signOff.notes);
    }
    if (appendix.signOff.signature) {
      lines.push('');
      lines.push(`Signature: ${appendix.signOff.signature}`);
    }
  } else {
    lines.push('⚠ AWAITING PI REVIEW AND SIGN-OFF');
    lines.push('');
    lines.push('Attestation (to be signed):');
    lines.push('I, the Principal Investigator, certify that I have reviewed this Verification');
    lines.push('Appendix and confirm that all statistical claims, citations, and data presented');
    lines.push('in the manuscript are accurate and grounded in the source documents and');
    lines.push('Statistical Manifest referenced herein.');
  }
  lines.push('');
  
  // Footer
  lines.push('═'.repeat(80));
  lines.push('END OF VERIFICATION APPENDIX');
  lines.push(`Generated by Clinical Intelligence Engine v1.0 on ${new Date(appendix.appendixMetadata.generatedAt).toLocaleDateString()}`);
  lines.push('═'.repeat(80));
  
  return lines.join('\n');
}

/**
 * Export manuscript as .docx (simulated - returns blob URL)
 */
export function exportManuscriptDocx(manuscript: ManuscriptManifest): Blob {
  const sections = [
    `TITLE: ${manuscript.projectMeta.studyTitle}`,
    '',
    'ABSTRACT',
    '[Abstract to be added]',
    '',
    'INTRODUCTION',
    manuscript.manuscriptContent.introduction,
    '',
    'METHODS',
    manuscript.manuscriptContent.methods,
    '',
    'RESULTS',
    manuscript.manuscriptContent.results,
    '',
    'DISCUSSION',
    manuscript.manuscriptContent.discussion,
    '',
    'CONCLUSION',
    manuscript.manuscriptContent.conclusion,
    '',
    'REFERENCES',
    '[References formatted according to journal style]'
  ].join('\n');
  
  return new Blob([sections], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
}

/**
 * Export Verification Appendix as .pdf (simulated - returns text blob)
 */
export function exportAppendixPdf(appendix: VerificationAppendix): Blob {
  const text = generateAppendixText(appendix);
  return new Blob([text], { type: 'application/pdf' });
}

/**
 * Export raw manifest data as .csv
 */
export function exportManifestCsv(manifest: StatisticalManifest): Blob {
  const lines: string[] = [];
  
  // Header
  lines.push('Variable ID,Label,Type,N,Mean,Std Dev,Median,Min,Max');
  
  // Descriptive stats
  manifest.descriptiveStats.forEach(stat => {
    lines.push([
      stat.variableId,
      stat.label,
      stat.type,
      stat.results.n,
      stat.results.mean?.toFixed(4) || '',
      stat.results.stdDev?.toFixed(4) || '',
      stat.results.median?.toFixed(4) || '',
      stat.results.min?.toFixed(4) || '',
      stat.results.max?.toFixed(4) || ''
    ].join(','));
  });
  
  lines.push('');
  lines.push('Comparative Analyses');
  lines.push('Outcome,Group 1,Group 2,Test Used,P-Value,Effect Size');
  
  manifest.comparativeAnalyses.forEach(comp => {
    lines.push([
      comp.outcome,
      comp.group1,
      comp.group2,
      comp.testUsed,
      comp.pValue?.toFixed(4) || '',
      comp.effectSize?.toFixed(4) || ''
    ].join(','));
  });
  
  return new Blob([lines.join('\n')], { type: 'text/csv' });
}
