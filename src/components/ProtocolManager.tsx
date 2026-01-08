import { useState } from 'react';
import { ProtocolWorkbench } from './protocol-workbench';
import { ProtocolLibraryScreen } from './ProtocolLibraryScreen';

type ProtocolManagerView = 'builder' | 'library';

interface ProtocolManagerProps {
  initialView?: ProtocolManagerView;
  initialProtocolId?: string;
  initialVersionId?: string;
}

export function ProtocolManager({ 
  initialView = 'builder',
  initialProtocolId,
  initialVersionId 
}: ProtocolManagerProps) {
  const [currentView, setCurrentView] = useState<ProtocolManagerView>(initialView);
  const [protocolToLoad, setProtocolToLoad] = useState<{ protocolId: string; versionId: string } | null>(
    initialProtocolId && initialVersionId 
      ? { protocolId: initialProtocolId, versionId: initialVersionId }
      : null
  );

  const handleNavigateToBuilder = (protocolId?: string, versionId?: string) => {
    if (protocolId && versionId) {
      setProtocolToLoad({ protocolId, versionId });
    } else {
      setProtocolToLoad(null);
    }
    setCurrentView('builder');
  };

  const handleNavigateToLibrary = () => {
    setCurrentView('library');
    // Clear protocol to load when returning to library
    setProtocolToLoad(null);
  };

  if (currentView === 'library') {
    return <ProtocolLibraryScreen onNavigateToBuilder={handleNavigateToBuilder} />;
  }

  return (
    <ProtocolWorkbench 
      key={protocolToLoad ? `${protocolToLoad.protocolId}-${protocolToLoad.versionId}` : 'new'}
      initialProtocolId={protocolToLoad?.protocolId}
      initialVersionId={protocolToLoad?.versionId}
      onNavigateToLibrary={handleNavigateToLibrary}
    />
  );
}