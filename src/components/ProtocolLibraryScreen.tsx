import { FileText, Plus, Search, FolderOpen, Trash2, Upload } from 'lucide-react';
import { ProtocolCard, PublishModal, ImportProtocolModal, useProtocolLibrary } from './protocol-library';
import { ContentContainer } from './ui/ContentContainer';
import { ConfirmationModal } from './ui/ConfirmationModal';
import { useTranslation } from 'react-i18next';
import { EmptyState } from './ui/EmptyState';
import { forwardRef, useImperativeHandle, useState } from 'react';

interface ProtocolLibraryScreenProps {
  onNavigateToBuilder: (protocolId?: string, versionId?: string) => void;
}

export interface ProtocolLibraryScreenRef {
  createNew: () => void;
}

export const ProtocolLibraryScreen = forwardRef<ProtocolLibraryScreenRef, ProtocolLibraryScreenProps>(
  ({ onNavigateToBuilder }, ref) => {
  const { t } = useTranslation('protocolLibrary');
  const {
    showPublishModal,
    setShowPublishModal,
    selectedVersionForPublish,
    setSelectedVersionForPublish,
    publishChangeLog,
    setPublishChangeLog,
    showDeleteDraftModal,
    setShowDeleteDraftModal,
    draftToDelete,
    setDraftToDelete,
    filteredProtocols,
    handlePublishVersion,
    confirmPublishVersion,
    handleEditPublishedVersion,
    handleArchiveProtocol,
    handleDeleteProtocol,
    handleDeleteDraft,
    confirmDeleteDraft,
    refreshProtocols
  } = useProtocolLibrary();

  const [showImportModal, setShowImportModal] = useState(false);
  
  // Expose method to parent via ref
  useImperativeHandle(ref, () => ({
    createNew: () => onNavigateToBuilder()
  }));

  return (
    <div className="flex flex-col h-full">
      {/* Header with Import Button */}
      <div className="px-8 pt-6 pb-4 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">{t('title')}</h1>
            <p className="text-sm text-slate-600 mt-1">{t('subtitle')}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowImportModal(true)}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Import Protocol
            </button>
            <button
              onClick={() => onNavigateToBuilder()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Protocol
            </button>
          </div>
        </div>
      </div>

      {/* Protocol List - with scrolling */}
      <div className="flex-1 overflow-y-auto p-8">
        <ContentContainer>
          {filteredProtocols.length === 0 ? (
            <div className="flex items-center justify-center min-h-[calc(100vh-350px)]">
              <EmptyState
                icon={FileText}
                title={t('emptyStates.noProtocols.title')}
                description={t('emptyStates.noProtocols.description')}
                action={{
                  label: t('emptyStates.noProtocols.actionCreate'),
                  onClick: () => onNavigateToBuilder(),
                  icon: Plus
                }}
                size="md"
              />
            </div>
          ) : (
            <div className="space-y-6">
              {filteredProtocols.map((protocol) => (
                <ProtocolCard
                  key={protocol.id}
                  protocol={protocol}
                  onNavigateToBuilder={onNavigateToBuilder}
                  onPublishVersion={handlePublishVersion}
                  onEditPublishedVersion={(protocolId, versionId) =>
                    handleEditPublishedVersion(protocolId, versionId, onNavigateToBuilder)
                  }
                  onArchiveProtocol={handleArchiveProtocol}
                  onDeleteProtocol={handleDeleteProtocol}
                  onDeleteDraft={handleDeleteDraft}
                />
              ))}
            </div>
          )}
        </ContentContainer>
      </div>

      {/* Publish Modal */}
      <PublishModal
        isOpen={showPublishModal}
        changeLog={publishChangeLog}
        onChangeLogUpdate={setPublishChangeLog}
        onConfirm={confirmPublishVersion}
        onCancel={() => {
          setShowPublishModal(false);
          setSelectedVersionForPublish(null);
          setPublishChangeLog('');
        }}
      />

      {/* Delete Draft Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteDraftModal}
        variant="danger"
        icon={Trash2}
        title={t('modals.deleteDraft.title')}
        description={
          draftToDelete
            ? t('modals.deleteDraft.description', { version: draftToDelete.versionNumber })
            : ''
        }
        confirmText={t('modals.deleteDraft.confirm')}
        onConfirm={confirmDeleteDraft}
        onClose={() => {
          setShowDeleteDraftModal(false);
          setDraftToDelete(null);
        }}
      />

      {/* Import Protocol Modal */}
      <ImportProtocolModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImportComplete={(result) => {
          if (result.success) {
            refreshProtocols();
          }
        }}
      />
    </div>
  );
});