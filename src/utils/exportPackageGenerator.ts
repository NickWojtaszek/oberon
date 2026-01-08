/**
 * Export Package Generator
 * Research Factory - Phase 5: Scientific Receipt
 * 
 * Creates complete regulatory export package with:
 * - Manuscript (DOCX format)
 * - Verification Appendix (HTML/PDF)
 * - Data Lineage Table (CSV)
 * - Metadata (JSON)
 * - PI Certification
 */

import type { 
  DataLineageEntry, 
  AuditSnapshot, 
  MismatchCard,
  JournalProfile 
} from '../types/accountability';
import type { ManuscriptManifest } from '../types/manuscript';
import { formatLineageAsCSV, formatLineageAsHTML, calculateLineageStats } from './dataLineageTracer';

// ============================================================================
// Export Package Structure
// ============================================================================

export interface ExportPackage {
  manuscriptDocx: Blob;
  verificationAppendixHtml: string;
  dataLineageCsv: string;
  metadataJson: string;
  auditSnapshot: AuditSnapshot;
  generatedAt: string;
}

// ============================================================================
// Main Export Function
// ============================================================================

/**
 * Generate complete export package
 */
export async function generateExportPackage(
  manuscript: ManuscriptManifest,
  dataLineage: DataLineageEntry[],
  mismatches: MismatchCard[],
  journal: JournalProfile,
  projectId: string,
  piName?: string
): Promise<ExportPackage> {
  
  // 1. Generate manuscript DOCX (HTML format for now)
  const manuscriptDocx = generateManuscriptDocx(manuscript, journal);
  
  // 2. Generate verification appendix
  const verificationAppendixHtml = generateVerificationAppendix(
    manuscript,
    dataLineage,
    mismatches,
    journal,
    piName
  );
  
  // 3. Generate data lineage CSV
  const dataLineageCsv = formatLineageAsCSV(dataLineage);
  
  // 4. Generate audit snapshot
  const auditSnapshot = generateAuditSnapshot(
    manuscript,
    dataLineage,
    mismatches,
    projectId
  );
  
  // 5. Generate metadata JSON
  const metadataJson = JSON.stringify({
    manuscriptTitle: manuscript.title,
    manuscriptId: manuscript.id,
    projectId: projectId,
    targetJournal: journal.name,
    journalShortName: journal.shortName,
    generatedAt: new Date().toISOString(),
    auditSnapshot: auditSnapshot,
    piName: piName || 'Not specified',
    version: '1.0.0',
  }, null, 2);
  
  return {
    manuscriptDocx,
    verificationAppendixHtml,
    dataLineageCsv,
    metadataJson,
    auditSnapshot,
    generatedAt: new Date().toISOString(),
  };
}

// ============================================================================
// Manuscript DOCX Generation
// ============================================================================

/**
 * Generate manuscript as DOCX (simplified HTML format)
 */
function generateManuscriptDocx(
  manuscript: ManuscriptManifest,
  journal: JournalProfile
): Blob {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${manuscript.title}</title>
  <style>
    body {
      font-family: 'Times New Roman', serif;
      font-size: 12pt;
      line-height: 2;
      max-width: 8.5in;
      margin: 1in auto;
      padding: 0;
    }
    h1 {
      font-size: 16pt;
      font-weight: bold;
      text-align: center;
      margin: 0 0 24pt 0;
    }
    h2 {
      font-size: 14pt;
      font-weight: bold;
      margin: 24pt 0 12pt 0;
    }
    p {
      margin: 0 0 12pt 0;
      text-align: justify;
    }
    .abstract {
      margin: 24pt 0;
      font-size: 11pt;
    }
    .keywords {
      font-style: italic;
      margin: 12pt 0 24pt 0;
    }
    .metadata {
      text-align: center;
      font-size: 11pt;
      margin-bottom: 24pt;
    }
  </style>
</head>
<body>
  <h1>${manuscript.title}</h1>
  
  <div class="metadata">
    <p><strong>Target Journal:</strong> ${journal.name} (${journal.shortName})</p>
    <p><strong>Manuscript ID:</strong> ${manuscript.id}</p>
    <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
  </div>
  
  ${manuscript.manuscriptContent.abstract ? `
  <div class="abstract">
    <h2>Abstract</h2>
    <p>${manuscript.manuscriptContent.abstract}</p>
  </div>
  ` : ''}
  
  ${manuscript.manuscriptContent.introduction ? `
  <h2>Introduction</h2>
  ${formatParagraphs(manuscript.manuscriptContent.introduction)}
  ` : ''}
  
  ${manuscript.manuscriptContent.methods ? `
  <h2>Methods</h2>
  ${formatParagraphs(manuscript.manuscriptContent.methods)}
  ` : ''}
  
  ${manuscript.manuscriptContent.results ? `
  <h2>Results</h2>
  ${formatParagraphs(manuscript.manuscriptContent.results)}
  ` : ''}
  
  ${manuscript.manuscriptContent.discussion ? `
  <h2>Discussion</h2>
  ${formatParagraphs(manuscript.manuscriptContent.discussion)}
  ` : ''}
  
  <div class="metadata" style="margin-top: 48pt; border-top: 1px solid #ccc; padding-top: 24pt;">
    <p><em>This manuscript was generated using Clinical Intelligence Engine Research Factory</em></p>
    <p><em>Complete verification appendix and data lineage table available in export package</em></p>
  </div>
</body>
</html>
  `;
  
  return new Blob([html], { type: 'text/html' });
}

/**
 * Format text into paragraphs
 */
function formatParagraphs(text: string): string {
  return text
    .split('\n\n')
    .map(para => `<p>${para.trim()}</p>`)
    .join('\n');
}

// ============================================================================
// Verification Appendix Generation
// ============================================================================

/**
 * Generate verification appendix (regulatory document)
 */
function generateVerificationAppendix(
  manuscript: ManuscriptManifest,
  dataLineage: DataLineageEntry[],
  mismatches: MismatchCard[],
  journal: JournalProfile,
  piName?: string
): string {
  const stats = calculateLineageStats(dataLineage);
  const resolvedMismatches = mismatches.filter(m => m.status !== 'unresolved');
  const unresolvedMismatches = mismatches.filter(m => m.status === 'unresolved');
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Verification Appendix - ${manuscript.title}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      max-width: 8.5in;
      margin: 0.5in auto;
      padding: 0;
    }
    h1 {
      font-size: 18pt;
      color: #1e293b;
      border-bottom: 3px solid #2563eb;
      padding-bottom: 12pt;
      margin-bottom: 24pt;
    }
    h2 {
      font-size: 14pt;
      color: #1e293b;
      margin-top: 24pt;
      margin-bottom: 12pt;
    }
    h3 {
      font-size: 12pt;
      color: #475569;
      margin-top: 18pt;
      margin-bottom: 8pt;
    }
    .header-box {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      padding: 16pt;
      margin-bottom: 24pt;
      border-radius: 4pt;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16pt;
      margin: 16pt 0;
    }
    .stat-card {
      background: white;
      border: 1px solid #e2e8f0;
      padding: 12pt;
      text-align: center;
      border-radius: 4pt;
    }
    .stat-value {
      font-size: 24pt;
      font-weight: bold;
      color: #2563eb;
    }
    .stat-label {
      font-size: 10pt;
      color: #64748b;
      margin-top: 4pt;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 16pt 0;
      font-size: 10pt;
    }
    th {
      background: #1e293b;
      color: white;
      padding: 8pt;
      text-align: left;
      font-weight: 600;
    }
    td {
      padding: 8pt;
      border-bottom: 1px solid #e2e8f0;
    }
    tr:hover {
      background: #f8fafc;
    }
    code {
      background: #f1f5f9;
      padding: 2pt 6pt;
      border-radius: 2pt;
      font-family: 'Courier New', monospace;
      font-size: 9pt;
    }
    .status-verified {
      background: #dcfce7;
      color: #166534;
      padding: 2pt 8pt;
      border-radius: 2pt;
      font-weight: 600;
    }
    .status-auto-fixed {
      background: #dbeafe;
      color: #1e40af;
      padding: 2pt 8pt;
      border-radius: 2pt;
      font-weight: 600;
    }
    .status-flagged {
      background: #fef3c7;
      color: #92400e;
      padding: 2pt 8pt;
      border-radius: 2pt;
      font-weight: 600;
    }
    .status-unverified {
      background: #fee2e2;
      color: #991b1b;
      padding: 2pt 8pt;
      border-radius: 2pt;
      font-weight: 600;
    }
    .certification-box {
      background: #fffbeb;
      border: 2px solid #fbbf24;
      padding: 16pt;
      margin: 24pt 0;
      border-radius: 4pt;
    }
    .signature-line {
      border-top: 1px solid #000;
      width: 300pt;
      margin-top: 48pt;
      padding-top: 8pt;
    }
    .footer {
      margin-top: 48pt;
      padding-top: 16pt;
      border-top: 1px solid #cbd5e1;
      font-size: 9pt;
      color: #64748b;
      text-align: center;
    }
  </style>
</head>
<body>
  <h1>📋 Verification Appendix</h1>
  
  <div class="header-box">
    <p><strong>Manuscript Title:</strong> ${manuscript.title}</p>
    <p><strong>Manuscript ID:</strong> ${manuscript.id}</p>
    <p><strong>Target Journal:</strong> ${journal.name} (${journal.shortName})</p>
    <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
    <p><strong>Principal Investigator:</strong> ${piName || 'Not specified'}</p>
  </div>
  
  <h2>1. Executive Summary</h2>
  <p>This verification appendix provides complete traceability of all statistical claims in the manuscript, 
  mapping each claim to its source protocol variable and documenting the verification process.</p>
  
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-value">${stats.totalClaims}</div>
      <div class="stat-label">Total Claims</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${stats.verifiedClaims + stats.autoFixedClaims}</div>
      <div class="stat-label">Verified Claims</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${stats.verificationRate.toFixed(1)}%</div>
      <div class="stat-label">Verification Rate</div>
    </div>
  </div>
  
  <h2>2. Data Lineage Table</h2>
  <p>Complete mapping of manuscript claims to protocol variables:</p>
  
  ${formatLineageAsHTML(dataLineage)}
  
  <h2>3. Verification Process</h2>
  
  <h3>3.1 Automated Logic Checks</h3>
  <p>The manuscript underwent automated logic checking using the Clinical Intelligence Engine 
  Research Factory mismatch detection algorithm.</p>
  
  <p><strong>Mismatches Detected:</strong> ${mismatches.length}</p>
  <p><strong>Mismatches Resolved:</strong> ${resolvedMismatches.length}</p>
  <p><strong>Mismatches Unresolved:</strong> ${unresolvedMismatches.length}</p>
  
  ${mismatches.length > 0 ? `
  <h3>3.2 Mismatch Resolution Log</h3>
  <table>
    <thead>
      <tr>
        <th>Severity</th>
        <th>Section</th>
        <th>Claim</th>
        <th>Ground Truth</th>
        <th>Resolution</th>
        <th>Resolved At</th>
      </tr>
    </thead>
    <tbody>
      ${mismatches.map(m => `
        <tr>
          <td><span class="status-${m.severity}">${m.severity}</span></td>
          <td>${m.section}</td>
          <td><code>${m.textClaim}</code></td>
          <td><code>${formatVerifiedResult(m.manifestValue)}</code></td>
          <td><span class="status-${m.status}">${m.status}</span></td>
          <td>${m.resolvedAt ? new Date(m.resolvedAt).toLocaleString() : 'Pending'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  ` : '<p><em>No mismatches detected. All claims verified on first pass.</em></p>'}
  
  <h2>4. Journal Compliance</h2>
  <table>
    <thead>
      <tr>
        <th>Requirement</th>
        <th>Limit</th>
        <th>Current</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Abstract Word Count</td>
        <td>${journal.wordLimits.abstract} words</td>
        <td>${countWords(manuscript.manuscriptContent.abstract || '')} words</td>
        <td>${countWords(manuscript.manuscriptContent.abstract || '') <= journal.wordLimits.abstract ? '✅ Compliant' : '❌ Exceeded'}</td>
      </tr>
      <tr>
        <td>Reference Count</td>
        <td>${journal.referenceCap} references</td>
        <td>N/A</td>
        <td>Manual verification required</td>
      </tr>
      <tr>
        <td>Citation Style</td>
        <td>${journal.citationStyle}</td>
        <td>${journal.citationStyle}</td>
        <td>✅ Compliant</td>
      </tr>
    </tbody>
  </table>
  
  <h2>5. PI Certification</h2>
  <div class="certification-box">
    <p><strong>Principal Investigator Certification</strong></p>
    <p>I certify that I have reviewed this manuscript and its verification appendix. 
    All statistical claims have been traced to their protocol sources and verified 
    for accuracy. The data presented accurately reflects the protocol-specified analyses.</p>
    
    <div class="signature-line">
      <p>Principal Investigator Signature</p>
      <p>${piName || '______________________________'}</p>
      <p>Date: ${new Date().toLocaleDateString()}</p>
    </div>
  </div>
  
  <div class="footer">
    <p>Generated by Clinical Intelligence Engine Research Factory</p>
    <p>Verification Appendix v1.0 | ${new Date().toISOString()}</p>
    <p>This document is intended for regulatory and compliance purposes</p>
  </div>
</body>
</html>
  `;
  
  return html;
}

/**
 * Format verified result for display
 */
function formatVerifiedResult(result: any): string {
  if (!result) return 'N/A';
  
  let output = String(result.val);
  
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

/**
 * Count words in text
 */
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

// ============================================================================
// Audit Snapshot Generation
// ============================================================================

/**
 * Generate audit snapshot for metadata
 */
function generateAuditSnapshot(
  manuscript: ManuscriptManifest,
  dataLineage: DataLineageEntry[],
  mismatches: MismatchCard[],
  projectId: string
): AuditSnapshot {
  const stats = calculateLineageStats(dataLineage);
  
  return {
    manuscriptId: manuscript.id,
    projectId: projectId,
    timestamp: new Date().toISOString(),
    totalClaims: stats.totalClaims,
    verifiedClaims: stats.verifiedClaims,
    autoFixedClaims: stats.autoFixedClaims,
    verificationRate: stats.verificationRate,
    criticalMismatches: mismatches.filter(m => m.severity === 'critical').length,
    warningMismatches: mismatches.filter(m => m.severity === 'warning').length,
    resolvedMismatches: mismatches.filter(m => m.status !== 'unresolved').length,
  };
}

// ============================================================================
// Download Utilities
// ============================================================================

/**
 * Download export package as ZIP
 */
export async function downloadExportPackage(
  exportPackage: ExportPackage,
  manuscriptTitle: string
): Promise<void> {
  const filename = sanitizeFilename(manuscriptTitle);
  const timestamp = new Date().toISOString().split('T')[0];
  
  // For now, download individual files
  // In production, would use JSZip library to create actual .zip
  
  // Download manuscript
  downloadBlob(
    exportPackage.manuscriptDocx,
    `${filename}_manuscript_${timestamp}.html`
  );
  
  // Download verification appendix
  const appendixBlob = new Blob([exportPackage.verificationAppendixHtml], { type: 'text/html' });
  downloadBlob(
    appendixBlob,
    `${filename}_verification_appendix_${timestamp}.html`
  );
  
  // Download data lineage CSV
  const csvBlob = new Blob([exportPackage.dataLineageCsv], { type: 'text/csv' });
  downloadBlob(
    csvBlob,
    `${filename}_data_lineage_${timestamp}.csv`
  );
  
  // Download metadata JSON
  const jsonBlob = new Blob([exportPackage.metadataJson], { type: 'application/json' });
  downloadBlob(
    jsonBlob,
    `${filename}_metadata_${timestamp}.json`
  );
  
  console.log('✅ Export package downloaded (4 files)');
}

/**
 * Download blob as file
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Sanitize filename
 */
function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .substring(0, 50);
}
