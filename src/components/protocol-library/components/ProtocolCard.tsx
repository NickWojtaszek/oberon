import { FileText, Calendar, CheckCircle2, Edit3, Eye, Archive, GitBranch, Clock, Trash2, ArrowUpCircle, XCircle, AlertCircle, Blocks, FileCheck, Shield } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { SavedProtocol, ProtocolVersion } from '../../protocol-workbench/types';
import { calculateProtocolCompleteness, getMissingItemsCount } from '../utils/completenessCalculator';

interface ProtocolCardProps {
  protocol: SavedProtocol;
  onNavigateToBuilder: (protocolId?: string, versionId?: string) => void;
  onPublishVersion: (protocolId: string, versionId: string) => void;
  onEditPublishedVersion: (protocolId: string, versionId: string) => void;
  onArchiveProtocol: (protocolId: string) => void;
  onDeleteProtocol: (protocolId: string) => void;
  onDeleteDraft: (protocolId: string, versionId: string) => void;
}

export function ProtocolCard({
  protocol,
  onNavigateToBuilder,
  onPublishVersion,
  onEditPublishedVersion,
  onArchiveProtocol,
  onDeleteProtocol,
  onDeleteDraft
}: ProtocolCardProps) {
  const { t } = useTranslation('protocolLibrary');

  // 🛡️ DEFENSIVE: Handle both string and object formats for currentVersion
  const currentVersionData = useMemo(() => {
    if (!protocol.currentVersion) return null;
    
    // Handle legacy format where currentVersion might be an object
    const versionToFind = typeof protocol.currentVersion === 'string'
      ? protocol.currentVersion
      : (protocol.currentVersion as any)?.versionNumber;
    
    if (!versionToFind) return null;
    
    return protocol.versions.find(v => v.versionNumber === versionToFind) || null;
  }, [protocol.currentVersion, protocol.versions]);

  // 🛡️ DEFENSIVE: Handle both string and object formats for latestDraftVersion
  const latestDraftData = useMemo(() => {
    if (protocol.latestDraftVersion) {
      const versionToFind = typeof protocol.latestDraftVersion === 'string'
        ? protocol.latestDraftVersion
        : (protocol.latestDraftVersion as any)?.versionNumber;
      
      if (versionToFind) {
        const found = protocol.versions.find(v => v.versionNumber === versionToFind);
        if (found) return found;
      }
    }
    
    // Fallback: find any draft version
    return protocol.versions.find(v => v.status === 'draft') || null;
  }, [protocol.latestDraftVersion, protocol.versions]);

  // Calculate completeness for the latest draft or current version
  const completeness = useMemo(() => {
    const versionToCheck = latestDraftData || currentVersionData;
    if (!versionToCheck) return null;
    return calculateProtocolCompleteness(protocol, versionToCheck);
  }, [protocol, latestDraftData, currentVersionData]);

  const getStatusBadge = (status: 'draft' | 'published' | 'archived') => {
    switch (status) {
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs">
            <Edit3 className="w-3 h-3" />
            {t('card.statusDraft')}
          </span>
        );
      case 'published':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
            <CheckCircle2 className="w-3 h-3" />
            {t('card.statusPublished')}
          </span>
        );
      case 'archived':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
            <Archive className="w-3 h-3" />
            {t('card.statusArchived')}
          </span>
        );
    }
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors">
      {/* Protocol Header - Clickable to open latest version */}
      <div 
        className="bg-blue-50/40 border border-blue-200/60 rounded-xl p-6 hover:shadow-md hover:border-blue-300/80 hover:bg-blue-50/60 transition-all cursor-pointer"
        onClick={() => {
          // 🛡️ DEFENSIVE: Try multiple fallbacks to find a version to open
          const versionToOpen = latestDraftData || currentVersionData || protocol.versions[0];
          
          if (versionToOpen) {
            console.log('📂 Opening protocol:', {
              protocolId: protocol.id,
              versionId: versionToOpen.id,
              versionNumber: versionToOpen.versionNumber
            });
            onNavigateToBuilder(protocol.id, versionToOpen.id);
          } else {
            console.error('❌ No version found for protocol:', protocol.id);
            alert('Error: Protocol has no valid versions to open');
          }
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl text-slate-900 font-medium">
                {protocol.protocolTitle || (protocol as any).name || t('card.untitledProtocol')}
              </h3>
              <span className="text-sm text-slate-600 px-3 py-1 bg-white border border-slate-300 rounded">
                {protocol.protocolNumber || (protocol as any).studyNumber || t('card.noNumber')}
              </span>
              {/* Clickable indicator */}
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {t('card.clickToOpen')}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {t('card.created')} {new Date(protocol.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {t('card.modified')} {new Date(protocol.modifiedAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <GitBranch className="w-4 h-4" />
                {protocol.versions.length} {t('card.versions', { count: protocol.versions.length })}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onArchiveProtocol(protocol.id)}
              className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
              title="Archive all versions"
            >
              <Archive className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeleteProtocol(protocol.id)}
              className="px-3 py-2 bg-white hover:bg-red-50 text-red-600 border border-slate-300 hover:border-red-300 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
              title="Delete protocol"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Current Version Info */}
        {currentVersionData && (
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-700">
              {t('card.current')}: <strong>v{currentVersionData.versionNumber}</strong>
            </span>
            {getStatusBadge(currentVersionData.status)}
            <span className="text-slate-600">
              {t('card.modifiedBy')} {currentVersionData.modifiedBy}
            </span>
          </div>
        )}
      </div>

      {/* Versions */}
      <div className="p-6">
        <div className="space-y-3">
          {/* Latest Draft (if exists) */}
          {latestDraftData && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Edit3 className="w-6 h-6 text-blue-700" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-slate-900">
                        v{latestDraftData.versionNumber}
                      </span>
                      {getStatusBadge(latestDraftData.status)}
                      {latestDraftData.changeLog && (
                        <span className="text-sm text-slate-600">• {latestDraftData.changeLog}</span>
                      )}
                    </div>
                    <div className="text-sm text-slate-600">
                      {t('card.modified')} {new Date(latestDraftData.modifiedAt).toLocaleString()} {t('card.modifiedBy').toLowerCase()} {latestDraftData.modifiedBy}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onDeleteDraft(protocol.id, latestDraftData.id)}
                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                    title="Delete this draft"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onNavigateToBuilder(protocol.id, latestDraftData.id)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    {t('card.continueEditing')}
                  </button>
                  <button
                    onClick={() => onPublishVersion(protocol.id, latestDraftData.id)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
                  >
                    <ArrowUpCircle className="w-4 h-4" />
                    {t('card.publish')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Published Version */}
          {currentVersionData && currentVersionData.status === 'published' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-slate-900">
                        v{currentVersionData.versionNumber}
                      </span>
                      {getStatusBadge(currentVersionData.status)}
                      {currentVersionData.changeLog && (
                        <span className="text-sm text-slate-600">• {currentVersionData.changeLog}</span>
                      )}
                    </div>
                    <div className="text-sm text-slate-600">
                      {t('card.published')} {new Date(currentVersionData.modifiedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigateToBuilder(protocol.id, currentVersionData.id)}
                    className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    {t('card.view')}
                  </button>
                  {!latestDraftData && (
                    <button
                      onClick={() => onEditPublishedVersion(protocol.id, currentVersionData.id)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      {t('card.createNewVersion')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Show other versions if there are more than 2 */}
          {protocol.versions.length > 2 && (
            <details className="text-sm">
              <summary className="cursor-pointer text-slate-600 hover:text-slate-900 py-2 px-3 rounded hover:bg-slate-50">
                {t('card.viewOlderVersions', { count: protocol.versions.length - (latestDraftData ? 1 : 0) - (currentVersionData ? 1 : 0) })}
              </summary>
              <div className="mt-2 space-y-2 pl-3">
                {protocol.versions
                  .filter(v => 
                    v.id !== latestDraftData?.id && 
                    v.id !== currentVersionData?.id
                  )
                  .sort((a, b) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime())
                  .map((version) => (
                    <div
                      key={version.id}
                      className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900">v{version.versionNumber}</span>
                        {getStatusBadge(version.status)}
                        <span className="text-xs text-slate-600">
                          {new Date(version.modifiedAt).toLocaleDateString()}
                        </span>
                        {version.changeLog && (
                          <span className="text-xs text-slate-600">• {version.changeLog}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {version.status === 'draft' && (
                          <button
                            onClick={() => onDeleteDraft(protocol.id, version.id)}
                            className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                            title="Delete this draft"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => onNavigateToBuilder(protocol.id, version.id)}
                          className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-medium transition-colors"
                        >
                          {t('card.view')}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </details>
          )}

          {/* Protocol Completeness Panel */}
          {completeness && (
            <div className="border-t border-slate-200 pt-4 mt-4">
              <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Protocol Completeness
              </h4>

              <div className="space-y-2">
                {/* Document */}
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-600" />
                    <span className="text-sm text-slate-700">Document</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600">{completeness.details.document.percentage}%</span>
                    {completeness.documentComplete ?
                      <CheckCircle2 className="w-4 h-4 text-green-600" /> :
                      <XCircle className="w-4 h-4 text-red-500" />
                    }
                  </div>
                </div>

                {/* Schema */}
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                  <div className="flex items-center gap-2">
                    <Blocks className="w-4 h-4 text-slate-600" />
                    <span className="text-sm text-slate-700">Schema</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600">{completeness.details.schema.blocksCount} blocks</span>
                    {completeness.schemaComplete ?
                      <CheckCircle2 className="w-4 h-4 text-green-600" /> :
                      <XCircle className="w-4 h-4 text-red-500" />
                    }
                  </div>
                </div>

                {/* Dependencies */}
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-slate-600" />
                    <span className="text-sm text-slate-700">Dependencies</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600">{completeness.details.dependencies.dependenciesCount} configured</span>
                    {completeness.dependenciesComplete ?
                      <CheckCircle2 className="w-4 h-4 text-green-600" /> :
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                    }
                  </div>
                </div>

                {/* Audit Trail */}
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-slate-600" />
                    <span className="text-sm text-slate-700">Audit Trail</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600">{completeness.details.auditTrail.publishedVersions} published</span>
                    {completeness.auditTrailComplete ?
                      <CheckCircle2 className="w-4 h-4 text-green-600" /> :
                      <XCircle className="w-4 h-4 text-red-500" />
                    }
                  </div>
                </div>
              </div>

              {/* Overall Status */}
              <div className="mt-3 pt-3 border-t border-slate-200">
                {completeness.overallComplete ? (
                  <div className="flex items-center gap-2 text-green-700 bg-green-50 p-2 rounded">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm font-medium">Ready to Publish</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-amber-700 bg-amber-50 p-2 rounded">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      {getMissingItemsCount(completeness)} {getMissingItemsCount(completeness) === 1 ? 'item needs' : 'items need'} attention before publishing
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}