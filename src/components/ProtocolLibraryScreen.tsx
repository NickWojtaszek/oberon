import { FileText, Plus, Search, FolderOpen } from 'lucide-react';
import { ProtocolCard, PublishModal, useProtocolLibrary } from './protocol-library';
import { ContentContainer } from './ui/ContentContainer';
import { useTranslation } from 'react-i18next';
import { EmptyState } from './ui/EmptyState';
import { forwardRef, useImperativeHandle } from 'react';

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
    filteredProtocols,
    handlePublishVersion,
    confirmPublishVersion,
    handleEditPublishedVersion,
    handleArchiveProtocol,
    handleDeleteProtocol
  } = useProtocolLibrary();
  
  // Expose method to parent via ref
  useImperativeHandle(ref, () => ({
    createNew: () => onNavigateToBuilder()
  }));

  return (
    <div className="flex flex-col h-full">
      {/* Protocol List - with scrolling */}
      <div className="flex-1 overflow-y-auto p-8">
        <ContentContainer>
          {filteredProtocols.length === 0 ? (
            <div className="flex items-center justify-center min-h-[calc(100vh-250px)]">
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
    </div>
  );
});