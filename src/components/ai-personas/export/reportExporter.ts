// Report Exporter - Export validation reports as PDF or JSON

import type { ValidationResult, ValidationIssue } from '../core/personaTypes';

export interface ExportOptions {
  format: 'pdf' | 'json' | 'csv';
  includeMetadata?: boolean;
  includeRecommendations?: boolean;
  includeCitations?: boolean;
  groupBy?: 'severity' | 'persona' | 'category';
  filterSeverity?: Array<'critical' | 'warning' | 'info'>;
}

export interface ExportMetadata {
  exportDate: string;
  studyTitle?: string;
  protocolNumber?: string;
  studyType?: string;
  exportedBy?: string;
  totalIssues: number;
  criticalIssues: number;
  warningIssues: number;
  infoIssues: number;
}

/**
 * Export validation results as JSON
 */
export function exportAsJSON(
  results: ValidationResult[],
  metadata: ExportMetadata,
  options: ExportOptions = { format: 'json' }
): string {
  const exportData = {
    metadata: {
      ...metadata,
      exportDate: new Date().toISOString(),
      exportFormat: 'JSON',
      version: '1.0'
    },
    summary: {
      totalPersonas: results.length,
      totalIssues: metadata.totalIssues,
      criticalIssues: metadata.criticalIssues,
      warningIssues: metadata.warningIssues,
      infoIssues: metadata.infoIssues
    },
    validationResults: results.map(result => ({
      personaId: result.personaId,
      personaName: result.personaName,
      timestamp: result.timestamp,
      issueCount: result.issues.length,
      issues: result.issues.map(issue => ({
        id: issue.id,
        severity: issue.severity,
        category: issue.category,
        title: issue.title,
        description: options.includeRecommendations ? issue.description : undefined,
        recommendation: options.includeRecommendations ? issue.recommendation : undefined,
        citation: options.includeCitations ? issue.citation : undefined,
        location: issue.location,
        autoFixAvailable: issue.autoFixAvailable,
        studyTypeSpecific: issue.studyTypeSpecific
      }))
    }))
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Export validation results as CSV
 */
export function exportAsCSV(
  results: ValidationResult[],
  metadata: ExportMetadata,
  options: ExportOptions = { format: 'csv' }
): string {
  // CSV Headers
  const headers = [
    'Persona',
    'Issue ID',
    'Severity',
    'Category',
    'Title',
    'Description',
    'Recommendation',
    'Citation',
    'Module',
    'Tab',
    'Field',
    'Auto-Fix Available'
  ];

  const rows: string[][] = [headers];

  // Add data rows
  results.forEach(result => {
    result.issues.forEach(issue => {
      rows.push([
        result.personaName || result.personaId,
        issue.id,
        issue.severity,
        issue.category,
        issue.title,
        options.includeRecommendations ? issue.description : '',
        options.includeRecommendations ? issue.recommendation : '',
        options.includeCitations ? (issue.citation || '') : '',
        issue.location?.module || '',
        issue.location?.tab || '',
        issue.location?.field || '',
        issue.autoFixAvailable ? 'Yes' : 'No'
      ]);
    });
  });

  // Convert to CSV string
  return rows.map(row => 
    row.map(cell => {
      // Escape quotes and wrap in quotes if contains comma, newline, or quote
      const escaped = cell.replace(/"/g, '""');
      return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
    }).join(',')
  ).join('\n');
}

/**
 * Export validation results as HTML (for PDF generation)
 */
export function exportAsHTML(
  results: ValidationResult[],
  metadata: ExportMetadata,
  options: ExportOptions = { format: 'pdf' }
): string {
  const criticalIssues = results.flatMap(r => r.issues.filter(i => i.severity === 'critical'));
  const warningIssues = results.flatMap(r => r.issues.filter(i => i.severity === 'warning'));
  const infoIssues = results.flatMap(r => r.issues.filter(i => i.severity === 'info'));

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Clinical Trial Validation Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #1e293b;
      padding: 40px;
      background: #fff;
    }
    .header {
      border-bottom: 3px solid #2563eb;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      font-size: 24pt;
      color: #1e293b;
      margin-bottom: 10px;
    }
    .header .subtitle {
      font-size: 12pt;
      color: #64748b;
    }
    .metadata {
      background: #f8fafc;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }
    .metadata-item {
      display: flex;
      justify-content: space-between;
    }
    .metadata-label {
      font-weight: 600;
      color: #475569;
    }
    .metadata-value {
      color: #1e293b;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      margin-bottom: 30px;
    }
    .summary-card {
      padding: 15px;
      border-radius: 8px;
      border: 2px solid;
      text-align: center;
    }
    .summary-card.total {
      border-color: #3b82f6;
      background: #eff6ff;
    }
    .summary-card.critical {
      border-color: #ef4444;
      background: #fef2f2;
    }
    .summary-card.warning {
      border-color: #f59e0b;
      background: #fffbeb;
    }
    .summary-card.info {
      border-color: #06b6d4;
      background: #ecfeff;
    }
    .summary-number {
      font-size: 32pt;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .summary-label {
      font-size: 10pt;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      opacity: 0.8;
    }
    .section {
      margin-bottom: 40px;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 18pt;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e2e8f0;
    }
    .issue {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-left: 4px solid;
      border-radius: 6px;
      padding: 15px;
      margin-bottom: 15px;
      page-break-inside: avoid;
    }
    .issue.critical { border-left-color: #ef4444; }
    .issue.warning { border-left-color: #f59e0b; }
    .issue.info { border-left-color: #06b6d4; }
    .issue-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 10px;
    }
    .issue-title {
      font-size: 12pt;
      font-weight: 600;
      color: #1e293b;
      flex: 1;
    }
    .issue-badge {
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 9pt;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .issue-badge.critical {
      background: #fef2f2;
      color: #dc2626;
    }
    .issue-badge.warning {
      background: #fffbeb;
      color: #d97706;
    }
    .issue-badge.info {
      background: #ecfeff;
      color: #0891b2;
    }
    .issue-description {
      color: #475569;
      margin-bottom: 10px;
      line-height: 1.7;
    }
    .issue-recommendation {
      background: #f8fafc;
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 10px;
      border-left: 3px solid #3b82f6;
    }
    .issue-recommendation-label {
      font-weight: 600;
      color: #3b82f6;
      font-size: 10pt;
      margin-bottom: 5px;
    }
    .issue-citation {
      background: #fef3c7;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 9pt;
      color: #92400e;
      border: 1px solid #fbbf24;
    }
    .issue-meta {
      display: flex;
      gap: 20px;
      margin-top: 10px;
      font-size: 9pt;
      color: #64748b;
    }
    .persona-section {
      margin-bottom: 30px;
    }
    .persona-header {
      background: #f1f5f9;
      padding: 12px 15px;
      border-radius: 6px;
      margin-bottom: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .persona-name {
      font-weight: 700;
      font-size: 13pt;
      color: #1e293b;
    }
    .persona-count {
      background: #3b82f6;
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 10pt;
      font-weight: 600;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #e2e8f0;
      text-align: center;
      color: #64748b;
      font-size: 9pt;
    }
    @media print {
      body { padding: 20px; }
      .section { page-break-after: auto; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Clinical Trial Validation Report</h1>
    <div class="subtitle">AI-Powered Regulatory Compliance Analysis</div>
  </div>

  <div class="metadata">
    <div class="metadata-item">
      <span class="metadata-label">Study Title:</span>
      <span class="metadata-value">${metadata.studyTitle || 'N/A'}</span>
    </div>
    <div class="metadata-item">
      <span class="metadata-label">Protocol Number:</span>
      <span class="metadata-value">${metadata.protocolNumber || 'N/A'}</span>
    </div>
    <div class="metadata-item">
      <span class="metadata-label">Study Type:</span>
      <span class="metadata-value">${metadata.studyType || 'N/A'}</span>
    </div>
    <div class="metadata-item">
      <span class="metadata-label">Export Date:</span>
      <span class="metadata-value">${new Date(metadata.exportDate).toLocaleString()}</span>
    </div>
    <div class="metadata-item">
      <span class="metadata-label">Exported By:</span>
      <span class="metadata-value">${metadata.exportedBy || 'System'}</span>
    </div>
    <div class="metadata-item">
      <span class="metadata-label">Total Personas:</span>
      <span class="metadata-value">${results.length}</span>
    </div>
  </div>

  <div class="summary">
    <div class="summary-card total">
      <div class="summary-number" style="color: #3b82f6;">${metadata.totalIssues}</div>
      <div class="summary-label" style="color: #3b82f6;">Total Issues</div>
    </div>
    <div class="summary-card critical">
      <div class="summary-number" style="color: #dc2626;">${metadata.criticalIssues}</div>
      <div class="summary-label" style="color: #dc2626;">Critical</div>
    </div>
    <div class="summary-card warning">
      <div class="summary-number" style="color: #d97706;">${metadata.warningIssues}</div>
      <div class="summary-label" style="color: #d97706;">Warnings</div>
    </div>
    <div class="summary-card info">
      <div class="summary-number" style="color: #0891b2;">${metadata.infoIssues}</div>
      <div class="summary-label" style="color: #0891b2;">Info</div>
    </div>
  </div>

  ${criticalIssues.length > 0 ? `
  <div class="section">
    <h2 class="section-title">🔴 Critical Issues (${criticalIssues.length})</h2>
    ${criticalIssues.map(issue => generateIssueHTML(issue, results, options)).join('')}
  </div>
  ` : ''}

  ${warningIssues.length > 0 ? `
  <div class="section">
    <h2 class="section-title">🟡 Warnings (${warningIssues.length})</h2>
    ${warningIssues.map(issue => generateIssueHTML(issue, results, options)).join('')}
  </div>
  ` : ''}

  ${infoIssues.length > 0 ? `
  <div class="section">
    <h2 class="section-title">🔵 Informational (${infoIssues.length})</h2>
    ${infoIssues.map(issue => generateIssueHTML(issue, results, options)).join('')}
  </div>
  ` : ''}

  <div class="section">
    <h2 class="section-title">📊 Results by Persona</h2>
    ${results.map(result => `
      <div class="persona-section">
        <div class="persona-header">
          <span class="persona-name">${result.personaName || result.personaId}</span>
          <span class="persona-count">${result.issues.length} issues</span>
        </div>
        ${result.issues.map(issue => generateIssueHTML(issue, results, options)).join('')}
      </div>
    `).join('')}
  </div>

  <div class="footer">
    Generated by Clinical Intelligence Engine AI Persona System v1.0<br>
    This report is for internal use and regulatory compliance tracking
  </div>
</body>
</html>
  `;

  return html;
}

function generateIssueHTML(issue: ValidationIssue, results: ValidationResult[], options: ExportOptions): string {
  const persona = results.find(r => r.personaId === issue.personaId);
  
  return `
    <div class="issue ${issue.severity}">
      <div class="issue-header">
        <div class="issue-title">${issue.title}</div>
        <div class="issue-badge ${issue.severity}">${issue.severity}</div>
      </div>
      
      ${options.includeRecommendations ? `
        <div class="issue-description">${issue.description}</div>
      ` : ''}
      
      ${options.includeRecommendations ? `
        <div class="issue-recommendation">
          <div class="issue-recommendation-label">✓ Recommendation:</div>
          ${issue.recommendation}
        </div>
      ` : ''}
      
      ${options.includeCitations && issue.citation ? `
        <div class="issue-citation">
          📖 Regulatory Citation: ${issue.citation}
        </div>
      ` : ''}
      
      <div class="issue-meta">
        <span><strong>Persona:</strong> ${persona?.personaName || issue.personaId}</span>
        ${issue.location?.module ? `<span><strong>Module:</strong> ${issue.location.module}</span>` : ''}
        ${issue.location?.tab ? `<span><strong>Tab:</strong> ${issue.location.tab}</span>` : ''}
        ${issue.location?.field ? `<span><strong>Field:</strong> ${issue.location.field}</span>` : ''}
        ${issue.autoFixAvailable ? '<span><strong>Auto-Fix:</strong> Available</span>' : ''}
      </div>
    </div>
  `;
}

/**
 * Download validation report
 */
export function downloadReport(
  results: ValidationResult[],
  metadata: ExportMetadata,
  options: ExportOptions
): void {
  let content: string;
  let filename: string;
  let mimeType: string;

  switch (options.format) {
    case 'json':
      content = exportAsJSON(results, metadata, options);
      filename = `validation-report-${Date.now()}.json`;
      mimeType = 'application/json';
      break;
    
    case 'csv':
      content = exportAsCSV(results, metadata, options);
      filename = `validation-report-${Date.now()}.csv`;
      mimeType = 'text/csv';
      break;
    
    case 'pdf':
      content = exportAsHTML(results, metadata, options);
      filename = `validation-report-${Date.now()}.html`;
      mimeType = 'text/html';
      break;
    
    default:
      throw new Error(`Unsupported export format: ${options.format}`);
  }

  // Create blob and download
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const reportExporter = {
  exportAsJSON,
  exportAsCSV,
  exportAsHTML,
  downloadReport
};
