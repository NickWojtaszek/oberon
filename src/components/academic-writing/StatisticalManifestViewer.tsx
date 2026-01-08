import { Check, Copy, AlertTriangle, Lock, Unlock, Shield } from 'lucide-react';
import { copyToClipboard as copyTextToClipboard } from '../../utils/clipboard';

import { useState } from 'react';
import { BarChart3, TrendingUp, Database, FileText } from 'lucide-react';
import type { Finding } from '../../types/manuscript';
import type { StatisticalManifest } from '../analytics-stats/types';
import { useGovernance } from '../../hooks/useGovernance';
import { storage } from '../../utils/storageService';

interface StatisticalManifestViewerProps {
  manifest: StatisticalManifest | null;
  onInsertNarrative: (narrative: string) => void;
  projectId?: string;
  onManifestUpdate?: (manifest: StatisticalManifest) => void;
}

export function StatisticalManifestViewer({ manifest, onInsertNarrative, projectId, onManifestUpdate }: StatisticalManifestViewerProps) {
  const [selectedTab, setSelectedTab] = useState<'descriptive' | 'comparative' | 'correlations'>('descriptive');
  const [showLockModal, setShowLockModal] = useState(false);
  const [lockReason, setLockReason] = useState('');
  const { canManageStatisticalManifests } = useGovernance();
  
  const isLocked = manifest?.manifestMetadata.locked || false;

  if (!manifest) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-slate-900">Statistical Manifest</h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center text-slate-500">
            <Database className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <div className="text-sm">No statistical analysis loaded</div>
            <div className="text-xs mt-2">
              Run analyses in Analytics tab to populate
            </div>
          </div>
        </div>
      </div>
    );
  }

  const generateNarrative = (finding: any, type: 'descriptive' | 'comparative' | 'correlation') => {
    if (type === 'descriptive' && finding.type === 'Continuous') {
      return `${finding.label} was ${finding.results.mean.toFixed(2)} ± ${finding.results.stdDev.toFixed(2)} (mean ± SD), with a median of ${finding.results.median.toFixed(2)} (IQR: ${finding.results.q1.toFixed(2)}-${finding.results.q3.toFixed(2)}). Data completeness was ${(100 - finding.results.missingPercentage).toFixed(1)}%.`;
    }

    if (type === 'descriptive' && finding.type === 'Categorical') {
      const categorySummary = Object.entries(finding.results.frequencies)
        .map(([cat, freq]) => `${cat}: ${freq}`)
        .join(', ');
      return `${finding.label} distribution: ${categorySummary}. Data completeness was ${(100 - finding.results.missingPercentage).toFixed(1)}%.`;
    }

    if (type === 'comparative') {
      const pValue = finding.pValue || 0;
      const significant = pValue < 0.05;
      const significance = significant ? 'statistically significant' : 'not statistically significant';
      
      return `Comparison of ${finding.predictor || 'predictor'} and ${finding.outcome || 'outcome'} using ${finding.test} revealed ${significance} results (p=${pValue.toFixed(3)}). ${finding.interpretation || ''}`;
    }

    if (type === 'correlation') {
      const r = finding.coefficient || 0;
      const strength = Math.abs(r) > 0.7 ? 'strong' : Math.abs(r) > 0.4 ? 'moderate' : 'weak';
      const direction = r > 0 ? 'positive' : 'negative';
      
      return `A ${strength} ${direction} correlation was observed between ${finding.var1Label} and ${finding.var2Label} (r=${r.toFixed(3)}, p=${(finding.pValue || 0).toFixed(3)}).`;
    }

    return 'Unable to generate narrative for this finding.';
  };

  const copyToClipboard = async (text: string) => {
    const success = await copyTextToClipboard(text);
    if (success) {
      onInsertNarrative(text);
    } else {
      // Still insert narrative even if copy fails
      onInsertNarrative(text);
      alert('Text inserted but clipboard copy failed. Content is available in the editor.');
    }
  };
  
  const handleLockManifest = () => {
    if (!manifest || !projectId) return;
    
    const updatedManifest: StatisticalManifest = {
      ...manifest,
      manifestMetadata: {
        ...manifest.manifestMetadata,
        locked: true,
        lockedAt: new Date().toISOString(),
        lockedBy: 'Current User', // In production, use actual user from auth
        lockReason: lockReason || 'Locked for final review and approval',
      },
    };
    
    // Save updated manifest
    const allManifests = storage.statisticalManifests.getAll(projectId);
    const updatedManifests = allManifests.map(m =>
      m.manifestMetadata.protocolId === manifest.manifestMetadata.protocolId &&
      m.manifestMetadata.generatedAt === manifest.manifestMetadata.generatedAt
        ? updatedManifest
        : m
    );
    storage.statisticalManifests.save(updatedManifests, projectId);
    
    // Notify parent
    if (onManifestUpdate) {
      onManifestUpdate(updatedManifest);
    }
    
    setShowLockModal(false);
    setLockReason('');
  };
  
  const handleUnlockManifest = () => {
    if (!manifest || !projectId) return;
    
    const confirmed = confirm('Are you sure you want to unlock this statistical manifest? This will allow edits and regeneration.');
    if (!confirmed) return;
    
    const updatedManifest: StatisticalManifest = {
      ...manifest,
      manifestMetadata: {
        ...manifest.manifestMetadata,
        locked: false,
        lockedAt: undefined,
        lockedBy: undefined,
        lockReason: undefined,
      },
    };
    
    // Save updated manifest
    const allManifests = storage.statisticalManifests.getAll(projectId);
    const updatedManifests = allManifests.map(m =>
      m.manifestMetadata.protocolId === manifest.manifestMetadata.protocolId &&
      m.manifestMetadata.generatedAt === manifest.manifestMetadata.generatedAt
        ? updatedManifest
        : m
    );
    storage.statisticalManifests.save(updatedManifests, projectId);
    
    // Notify parent
    if (onManifestUpdate) {
      onManifestUpdate(updatedManifest);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-slate-900">Statistical Manifest</h3>
          
          {/* Lock Status & Controls */}
          {manifest && canManageStatisticalManifests && (
            <div className="flex items-center gap-2">
              {isLocked ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                    <Lock className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-medium text-green-900">Locked</span>
                  </div>
                  <button
                    onClick={handleUnlockManifest}
                    className="px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-300 rounded-lg hover:bg-amber-100 transition-colors flex items-center gap-2"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    Unlock
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowLockModal(true)}
                  className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-300 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Lock for Approval
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Lock Status Banner */}
        {isLocked && manifest?.manifestMetadata.lockedAt && (
          <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-green-900">Manifest Locked</div>
                <div className="text-xs text-green-700 mt-1">
                  Locked by {manifest.manifestMetadata.lockedBy} on {new Date(manifest.manifestMetadata.lockedAt).toLocaleString()}
                </div>
                {manifest.manifestMetadata.lockReason && (
                  <div className="text-xs text-green-600 mt-1 italic">
                    "{manifest.manifestMetadata.lockReason}"
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="text-slate-500">Protocol</div>
            <div className="text-slate-900 font-medium">v{manifest.manifestMetadata.protocolVersion}</div>
          </div>
          <div>
            <div className="text-slate-500">Records</div>
            <div className="text-slate-900 font-medium">{manifest.manifestMetadata.totalRecordsAnalyzed}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-4 pt-2 border-b border-slate-200">
        <button
          onClick={() => setSelectedTab('descriptive')}
          className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
            selectedTab === 'descriptive'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Descriptive
        </button>
        <button
          onClick={() => setSelectedTab('comparative')}
          className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
            selectedTab === 'comparative'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Comparative
        </button>
        <button
          onClick={() => setSelectedTab('correlations')}
          className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
            selectedTab === 'correlations'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Correlations
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {selectedTab === 'descriptive' && (
          <div className="space-y-3">
            {manifest.descriptiveStats.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                No descriptive statistics available
              </div>
            ) : (
              manifest.descriptiveStats.map((stat, idx) => {
                const narrative = generateNarrative(stat, 'descriptive');
                return (
                  <div key={idx} className="p-3 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-900">{stat.label}</div>
                        <div className="text-xs text-slate-500 mt-1">{stat.type}</div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(narrative)}
                        className="p-1.5 hover:bg-blue-50 rounded transition-colors"
                        title="Insert Narrative"
                      >
                        <Copy className="w-4 h-4 text-blue-600" />
                      </button>
                    </div>
                    <div className="text-xs text-slate-700 bg-slate-50 p-2 rounded leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                      {narrative}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {selectedTab === 'comparative' && (
          <div className="space-y-3">
            {manifest.comparativeAnalyses.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                No comparative analyses available
              </div>
            ) : (
              manifest.comparativeAnalyses.map((comp, idx) => {
                const narrative = generateNarrative(comp, 'comparative');
                return (
                  <div key={idx} className="p-3 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-900">
                          {comp.predictor} vs {comp.outcome}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {comp.test} • p={comp.pValue?.toFixed(3) || 'N/A'}
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(narrative)}
                        className="p-1.5 hover:bg-blue-50 rounded transition-colors"
                        title="Insert Narrative"
                      >
                        <Copy className="w-4 h-4 text-blue-600" />
                      </button>
                    </div>
                    <div className="text-xs text-slate-700 bg-slate-50 p-2 rounded leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                      {narrative}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {selectedTab === 'correlations' && (
          <div className="space-y-3">
            {manifest.correlations.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                No correlations available
              </div>
            ) : (
              manifest.correlations.map((corr, idx) => {
                const narrative = generateNarrative(corr, 'correlation');
                return (
                  <div key={idx} className="p-3 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-900">
                          {corr.var1Label} ↔ {corr.var2Label}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          r={corr.coefficient?.toFixed(3) || 'N/A'} • p={corr.pValue?.toFixed(3) || 'N/A'}
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(narrative)}
                        className="p-1.5 hover:bg-blue-50 rounded transition-colors"
                        title="Insert Narrative"
                      >
                        <Copy className="w-4 h-4 text-blue-600" />
                      </button>
                    </div>
                    <div className="text-xs text-slate-700 bg-slate-50 p-2 rounded leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                      {narrative}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="text-xs text-slate-600">
          Validated by {manifest.manifestMetadata.personaValidation}
        </div>
      </div>
      
      {/* Lock Confirmation Modal */}
      {showLockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Lock Statistical Manifest</h3>
              </div>
              <p className="text-sm text-slate-600 mt-2">
                Locking this manifest will prevent any modifications and mark it as approved for final review.
              </p>
            </div>
            
            <div className="p-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Lock Reason (Optional)
              </label>
              <textarea
                value={lockReason}
                onChange={(e) => setLockReason(e.target.value)}
                placeholder="e.g., Final analysis approved by PI for manuscript submission"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm resize-none"
                rows={3}
              />
              
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-amber-900">
                    <div className="font-medium mb-1">Important:</div>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Locked manifests cannot be modified</li>
                      <li>Only PIs can unlock manifests</li>
                      <li>This action creates an audit trail</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-200 flex gap-3">
              <button
                onClick={() => {
                  setShowLockModal(false);
                  setLockReason('');
                }}
                className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLockManifest}
                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Lock Manifest
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}