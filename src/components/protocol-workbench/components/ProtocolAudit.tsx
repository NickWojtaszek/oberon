import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, AlertCircle, Info, CheckCircle2, Sparkles, Download, ExternalLink, ChevronRight, XCircle } from 'lucide-react';
import type { ProtocolAuditResult, AuditIssue, AuditSeverity } from '../auditTypes';
import { runProtocolAudit } from '../auditEngine';
import { ContentContainer } from '../../ui/ContentContainer';

interface ProtocolAuditProps {
  protocolMetadata: any;
  protocolContent: any;
  schemaBlocks: any[];
  onNavigateToIssue?: (issue: AuditIssue) => void;
}

export function ProtocolAudit({ 
  protocolMetadata, 
  protocolContent, 
  schemaBlocks,
  onNavigateToIssue 
}: ProtocolAuditProps) {
  const [auditResult, setAuditResult] = useState<ProtocolAuditResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'protocol-text' | 'schema' | 'dependency' | 'cross-validation' | 'regulatory'>('all');
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set());

  const runAudit = () => {
    setIsRunning(true);
    
    // Simulate async audit (in real implementation, this could be an API call)
    setTimeout(() => {
      const result = runProtocolAudit({
        protocolMetadata,
        protocolContent,
        schemaBlocks,
        dependencies: []
      });
      
      setAuditResult(result);
      setIsRunning(false);
    }, 1500);
  };

  // Auto-run on mount
  useEffect(() => {
    runAudit();
  }, []);

  const toggleIssue = (issueId: string) => {
    const newExpanded = new Set(expandedIssues);
    if (newExpanded.has(issueId)) {
      newExpanded.delete(issueId);
    } else {
      newExpanded.add(issueId);
    }
    setExpandedIssues(newExpanded);
  };

  const getSeverityIcon = (severity: AuditSeverity) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getSeverityColor = (severity: AuditSeverity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-900';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-900';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-900';
    }
  };

  const getSeverityBadgeColor = (severity: AuditSeverity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-600 text-white';
      case 'warning':
        return 'bg-amber-600 text-white';
      case 'info':
        return 'bg-blue-600 text-white';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Needs Improvement';
  };

  const getFilteredIssues = (): AuditIssue[] => {
    if (!auditResult) return [];
    
    let allIssues = [
      ...auditResult.protocolTextIssues,
      ...auditResult.schemaIssues,
      ...auditResult.dependencyIssues,
      ...auditResult.crossValidationIssues,
      ...auditResult.regulatoryIssues
    ];

    if (selectedCategory !== 'all') {
      allIssues = allIssues.filter(i => i.category === selectedCategory);
    }

    // Sort by severity: critical > warning > info
    return allIssues.sort((a, b) => {
      const severityOrder = { critical: 0, warning: 1, info: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  };

  if (!auditResult && isRunning) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Sparkles className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Running AI Protocol Audit...</h3>
          <p className="text-sm text-slate-600">Analyzing protocol, schema, and dependencies</p>
        </div>
      </div>
    );
  }

  if (!auditResult) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Shield className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">No audit results available</p>
        </div>
      </div>
    );
  }

  const filteredIssues = getFilteredIssues();

  return (
    <div className="flex-1 flex bg-slate-50 overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <ContentContainer>
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Protocol Audit Report</h2>
                  <p className="text-sm text-slate-600">
                    AI-powered validation • Last run: {new Date(auditResult.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={runAudit}
                  disabled={isRunning}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  Re-run Audit
                </button>
                <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Report
                </button>
              </div>
            </div>

            {/* Compliance Score */}
            <div className={`p-6 rounded-xl border-2 ${
              auditResult.canPublish 
                ? 'bg-green-50 border-green-300' 
                : 'bg-red-50 border-red-300'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {auditResult.canPublish ? (
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                  ) : (
                    <XCircle className="w-12 h-12 text-red-600" />
                  )}
                  <div>
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className={`text-4xl font-bold ${getScoreColor(auditResult.complianceScore)}`}>
                        {auditResult.complianceScore}
                      </span>
                      <span className="text-lg text-slate-600">/ 100</span>
                      <span className={`text-lg font-medium ${getScoreColor(auditResult.complianceScore)}`}>
                        {getScoreLabel(auditResult.complianceScore)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700">
                      {auditResult.canPublish ? (
                        <span className="text-green-700 font-medium">✓ Protocol ready for publication</span>
                      ) : (
                        <span className="text-red-700 font-medium">
                          ✗ {auditResult.blockedReasons.join('; ')}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-600 mb-1">Audit Duration</div>
                  <div className="text-2xl font-semibold text-slate-900">{auditResult.auditDuration}ms</div>
                </div>
              </div>
            </div>
          </div>

          {/* Issue Summary Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <span className="text-2xl font-bold text-red-600">{auditResult.criticalCount}</span>
              </div>
              <div className="text-sm font-medium text-red-900">Critical Issues</div>
              <div className="text-xs text-red-700 mt-1">Must resolve to publish</div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span className="text-2xl font-bold text-amber-600">{auditResult.warningCount}</span>
              </div>
              <div className="text-sm font-medium text-amber-900">Warnings</div>
              <div className="text-xs text-amber-700 mt-1">Recommended fixes</div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Info className="w-5 h-5 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">{auditResult.infoCount}</span>
              </div>
              <div className="text-sm font-medium text-blue-900">Info</div>
              <div className="text-xs text-blue-700 mt-1">Suggestions</div>
            </div>

            <div className="bg-slate-100 border border-slate-300 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <AlertCircle className="w-5 h-5 text-slate-600" />
                <span className="text-2xl font-bold text-slate-900">{auditResult.totalIssues}</span>
              </div>
              <div className="text-sm font-medium text-slate-900">Total Issues</div>
              <div className="text-xs text-slate-600 mt-1">All categories</div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium text-slate-700">Filter by:</span>
            {[
              { id: 'all', label: 'All Issues', count: auditResult.totalIssues },
              { id: 'protocol-text', label: 'Protocol Text', count: auditResult.protocolTextIssues.length },
              { id: 'schema', label: 'Schema', count: auditResult.schemaIssues.length },
              { id: 'dependency', label: 'Dependencies', count: auditResult.dependencyIssues.length },
              { id: 'cross-validation', label: 'Cross-Validation', count: auditResult.crossValidationIssues.length },
              { id: 'regulatory', label: 'Regulatory', count: auditResult.regulatoryIssues.length }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>

          {/* Issues List */}
          <div className="space-y-3">
            {filteredIssues.length === 0 ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-green-900 mb-1">No Issues Found</h3>
                <p className="text-sm text-green-700">
                  {selectedCategory === 'all' 
                    ? 'Your protocol passed all validation checks!' 
                    : `No issues found in ${selectedCategory} category`}
                </p>
              </div>
            ) : (
              filteredIssues.map(issue => (
                <div
                  key={issue.id}
                  className={`border rounded-lg overflow-hidden transition-all ${getSeverityColor(issue.severity)}`}
                >
                  {/* Issue Header */}
                  <div
                    className="p-4 cursor-pointer hover:bg-opacity-80"
                    onClick={() => toggleIssue(issue.id)}
                  >
                    <div className="flex items-start gap-3">
                      {getSeverityIcon(issue.severity)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{issue.title}</h4>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityBadgeColor(issue.severity)}`}>
                            {issue.severity.toUpperCase()}
                          </span>
                          <span className="px-2 py-0.5 bg-white bg-opacity-50 rounded text-xs font-medium">
                            {issue.category}
                          </span>
                        </div>
                        <p className="text-sm opacity-90">{issue.description}</p>
                      </div>
                      <ChevronRight className={`w-5 h-5 transition-transform ${expandedIssues.has(issue.id) ? 'rotate-90' : ''}`} />
                    </div>
                  </div>

                  {/* Issue Details (Expanded) */}
                  {expandedIssues.has(issue.id) && (
                    <div className="px-4 pb-4 space-y-3 border-t border-current border-opacity-20">
                      <div className="pt-3">
                        <div className="text-sm font-medium mb-1">Recommendation:</div>
                        <div className="text-sm bg-white bg-opacity-50 rounded p-3">
                          {issue.recommendation}
                        </div>
                      </div>

                      {issue.regulatoryReference && (
                        <div>
                          <div className="text-sm font-medium mb-1">Regulatory Reference:</div>
                          <div className="text-sm bg-white bg-opacity-50 rounded p-2 flex items-center gap-2">
                            <ExternalLink className="w-4 h-4" />
                            {issue.regulatoryReference}
                          </div>
                        </div>
                      )}

                      <div>
                        <div className="text-sm font-medium mb-1">Location:</div>
                        <div className="text-sm bg-white bg-opacity-50 rounded p-2">
                          Tab: <strong>{issue.location.tab}</strong>
                          {issue.location.sectionName && ` → ${issue.location.sectionName}`}
                        </div>
                      </div>

                      {onNavigateToIssue && (
                        <button
                          onClick={() => onNavigateToIssue(issue)}
                          className="w-full px-4 py-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Jump to Issue
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ContentContainer>
      </div>

      {/* Right Sidebar */}
      <div className="w-[400px] border-l border-slate-200 bg-white overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="font-medium text-slate-900">AI Audit Guide</h3>
          </div>

          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-purple-900 mb-2">What Gets Audited?</h4>
                <ul className="text-sm text-purple-800 space-y-2">
                  <li>• <strong>Protocol Text:</strong> Required sections, completeness</li>
                  <li>• <strong>Schema:</strong> Variable structure, safety fields</li>
                  <li>• <strong>Dependencies:</strong> Circular logic, safety violations</li>
                  <li>• <strong>Cross-Validation:</strong> Protocol ↔ Schema alignment</li>
                  <li>• <strong>Regulatory:</strong> ICH-GCP compliance</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Issue Severity Levels</h4>
                <div className="space-y-2 text-sm text-blue-800">
                  <div>
                    <span className="font-medium text-red-700">Critical:</span> Blocks publication, must fix
                  </div>
                  <div>
                    <span className="font-medium text-amber-700">Warning:</span> Recommended to fix, PI approval needed
                  </div>
                  <div>
                    <span className="font-medium text-blue-700">Info:</span> Suggestions for improvement
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900 mb-2">Quick Actions</h4>
                <ul className="text-sm text-green-800 space-y-2">
                  <li>• Click any issue to expand details</li>
                  <li>• Use "Jump to Issue" to navigate directly</li>
                  <li>• Export report for IRB submission</li>
                  <li>• Re-run after fixing issues</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Compliance Score</h4>
                <p className="text-sm text-slate-700 leading-relaxed mb-2">
                  Score ranges from 0-100 based on:
                </p>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li>• Critical issues: -15 points each</li>
                  <li>• Warnings: -5 points each</li>
                  <li>• Info: -1 point each</li>
                </ul>
                <div className="mt-3 pt-3 border-t border-slate-300 space-y-1 text-sm">
                  <div className="text-green-700">90-100: Excellent</div>
                  <div className="text-blue-700">70-89: Good</div>
                  <div className="text-amber-700">50-69: Fair</div>
                  <div className="text-red-700">&lt;50: Needs Improvement</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
