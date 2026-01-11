import { useState, useEffect, useCallback } from 'react';
import { useProject } from '../../../contexts/ProtocolContext';
import { storage } from '../../../utils/storageService';
import { migrateProjectProtocols } from '../../../utils/protocolMigration';
import type { SavedProtocol } from '../../protocol-workbench/types';

interface UseProtocolLibraryReturn {
  savedProtocols: SavedProtocol[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: 'all' | 'draft' | 'published' | 'archived';
  setStatusFilter: (filter: 'all' | 'draft' | 'published' | 'archived') => void;
  sortBy: 'modified' | 'created' | 'name';
  setSortBy: (sort: 'modified' | 'created' | 'name') => void;
  showPublishModal: boolean;
  setShowPublishModal: (show: boolean) => void;
  selectedVersionForPublish: { protocolId: string; versionId: string } | null;
  setSelectedVersionForPublish: (version: { protocolId: string; versionId: string } | null) => void;
  publishChangeLog: string;
  setPublishChangeLog: (log: string) => void;
  showDeleteDraftModal: boolean;
  setShowDeleteDraftModal: (show: boolean) => void;
  draftToDelete: { protocolId: string; versionId: string; versionNumber: string } | null;
  setDraftToDelete: (draft: { protocolId: string; versionId: string; versionNumber: string } | null) => void;
  filteredProtocols: SavedProtocol[];
  loadProtocols: () => void;
  handlePublishVersion: (protocolId: string, versionId: string) => void;
  confirmPublishVersion: () => void;
  handleEditPublishedVersion: (protocolId: string, versionId: string, onNavigateToBuilder: (protocolId?: string, versionId?: string) => void) => void;
  handleArchiveProtocol: (protocolId: string) => void;
  handleDeleteProtocol: (protocolId: string) => void;
  handleDeleteDraft: (protocolId: string, versionId: string) => void;
  confirmDeleteDraft: () => void;
}

export function useProtocolLibrary(): UseProtocolLibraryReturn {
  const { currentProject } = useProject();

  const [savedProtocols, setSavedProtocols] = useState<SavedProtocol[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [sortBy, setSortBy] = useState<'modified' | 'created' | 'name'>('modified');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [selectedVersionForPublish, setSelectedVersionForPublish] = useState<{ protocolId: string; versionId: string } | null>(null);
  const [publishChangeLog, setPublishChangeLog] = useState('');
  const [showDeleteDraftModal, setShowDeleteDraftModal] = useState(false);
  const [draftToDelete, setDraftToDelete] = useState<{ protocolId: string; versionId: string; versionNumber: string } | null>(null);

  // 🔄 NEW: Load protocols from project-scoped storage
  const loadProtocols = useCallback(() => {
    if (!currentProject) {
      console.log('ℹ️  [useProtocolLibrary] No current project, clearing protocols');
      setSavedProtocols([]);
      return;
    }

    console.log('📂 [useProtocolLibrary] Loading protocols for project:', currentProject.name);
    
    try {
      const protocols = storage.protocols.getAll(currentProject.id);
      
      // Convert date strings back to Date objects if needed
      const parsedProtocols = protocols.map(p => ({
        ...p,
        createdAt: p.createdAt instanceof Date ? p.createdAt : new Date(p.createdAt),
        modifiedAt: p.modifiedAt instanceof Date ? p.modifiedAt : new Date(p.modifiedAt),
        versions: p.versions.map(v => ({
          ...v,
          createdAt: v.createdAt instanceof Date ? v.createdAt : new Date(v.createdAt),
          modifiedAt: v.modifiedAt instanceof Date ? v.modifiedAt : new Date(v.modifiedAt)
        }))
      }));
      
      setSavedProtocols(parsedProtocols);
      console.log(`✅ [useProtocolLibrary] Loaded ${parsedProtocols.length} protocols`);
    } catch (error) {
      console.error('❌ [useProtocolLibrary] Failed to load protocols:', error);
      setSavedProtocols([]);
    }
  }, [currentProject]);

  // Load protocols on mount and when project changes
  useEffect(() => {
    loadProtocols();

    // Set up interval to refresh every 2 seconds to catch updates from builder
    const interval = setInterval(loadProtocols, 2000);
    
    return () => clearInterval(interval);
  }, [loadProtocols]);

  // 🔄 NEW: Save protocols to project-scoped storage
  const saveProtocols = useCallback((protocols: SavedProtocol[]) => {
    if (!currentProject) {
      console.error('❌ [useProtocolLibrary] Cannot save protocols: No current project');
      return;
    }

    console.log('💾 [useProtocolLibrary] Saving protocols to project storage:', currentProject.id);
    storage.protocols.save(protocols, currentProject.id);
    setSavedProtocols(protocols);
  }, [currentProject]);

  const handlePublishVersion = (protocolId: string, versionId: string) => {
    setSelectedVersionForPublish({ protocolId, versionId });
    setShowPublishModal(true);
  };

  const confirmPublishVersion = () => {
    if (!selectedVersionForPublish) return;

    const { protocolId, versionId } = selectedVersionForPublish;
    const updatedProtocols = savedProtocols.map(protocol => {
      if (protocol.id !== protocolId) return protocol;

      const versionIndex = protocol.versions.findIndex(v => v.id === versionId);
      if (versionIndex === -1) return protocol;

      const currentVersion = protocol.versions[versionIndex];
      
      // If this is a draft, publish it
      if (currentVersion.status === 'draft') {
        const updatedVersion = {
          ...currentVersion,
          status: 'published' as const,
          modifiedAt: new Date(),
          changeLog: publishChangeLog || currentVersion.changeLog
        };

        const updatedVersions = [...protocol.versions];
        updatedVersions[versionIndex] = updatedVersion;

        return {
          ...protocol,
          currentVersion: updatedVersion, // Update reference
          versions: updatedVersions,
          modifiedAt: new Date()
        };
      }

      return protocol;
    });

    saveProtocols(updatedProtocols);
    setShowPublishModal(false);
    setSelectedVersionForPublish(null);
    setPublishChangeLog('');
  };

  const handleEditPublishedVersion = (protocolId: string, versionId: string, onNavigateToBuilder: (protocolId?: string, versionId?: string) => void) => {
    const protocol = savedProtocols.find(p => p.id === protocolId);
    if (!protocol) return;

    const version = protocol.versions.find(v => v.id === versionId);
    if (!version || version.status !== 'published') return;

    // Create a new version number (increment minor version)
    const versionParts = version.versionNumber.split('.');
    let major = 1, minor = 0;
    if (versionParts.length >= 2) {
      major = Number(versionParts[0]) || 1;
      minor = Number(versionParts[1]) || 0;
    }
    const newVersionNumber = `${major}.${minor + 1}`;

    // Create new draft version based on published version
    const newVersion = {
      ...version,
      id: `version-${Date.now()}`,
      versionNumber: newVersionNumber,
      status: 'draft' as const,
      createdAt: new Date(),
      modifiedAt: new Date(),
      createdBy: 'Current User', // TODO: Get from persona system
      modifiedBy: 'Current User',
      changeLog: `Created from v${version.versionNumber}`
    };

    const updatedProtocols = savedProtocols.map(p => {
      if (p.id !== protocolId) return p;

      return {
        ...p,
        versions: [...p.versions, newVersion],
        modifiedAt: new Date()
      };
    });

    saveProtocols(updatedProtocols);
    onNavigateToBuilder(protocolId, newVersion.id);
  };

  const handleArchiveProtocol = (protocolId: string) => {
    const updatedProtocols = savedProtocols.map(protocol => {
      if (protocol.id !== protocolId) return protocol;

      return {
        ...protocol,
        versions: protocol.versions.map(v => ({
          ...v,
          status: 'archived' as const,
          modifiedAt: new Date()
        })),
        modifiedAt: new Date()
      };
    });

    saveProtocols(updatedProtocols);
  };

  const handleDeleteProtocol = (protocolId: string) => {
    if (confirm('Are you sure you want to permanently delete this protocol and all its versions?')) {
      const updatedProtocols = savedProtocols.filter(p => p.id !== protocolId);
      saveProtocols(updatedProtocols);
    }
  };

  const handleDeleteDraft = (protocolId: string, versionId: string) => {
    const protocol = savedProtocols.find(p => p.id === protocolId);
    if (!protocol) {
      console.error('❌ [useProtocolLibrary] Protocol not found:', protocolId);
      return;
    }

    const version = protocol.versions.find(v => v.id === versionId);
    if (!version) {
      console.error('❌ [useProtocolLibrary] Version not found:', versionId);
      return;
    }

    // COMPLIANCE CHECK: Only allow draft deletion
    if (version.status === 'published') {
      alert('Cannot delete published versions (compliance requirement).\n\nPublished protocols must be preserved for audit trail purposes.');
      return;
    }

    if (version.status === 'archived') {
      alert('Cannot delete archived versions.\n\nPlease contact an administrator if you need to remove archived protocols.');
      return;
    }

    // Show confirmation modal for draft deletion
    setDraftToDelete({
      protocolId,
      versionId,
      versionNumber: version.versionNumber
    });
    setShowDeleteDraftModal(true);
  };

  const confirmDeleteDraft = () => {
    if (!draftToDelete) return;

    const { protocolId, versionId } = draftToDelete;

    console.log('🗑️  [useProtocolLibrary] Deleting draft version:', { protocolId, versionId });

    const updatedProtocols = savedProtocols.map(protocol => {
      if (protocol.id === protocolId) {
        const updatedVersions = protocol.versions.filter(v => v.id !== versionId);

        // If no versions left, return null to delete entire protocol
        if (updatedVersions.length === 0) {
          console.log('📦 [useProtocolLibrary] No versions remaining, deleting entire protocol');
          return null;
        }

        return {
          ...protocol,
          versions: updatedVersions,
          modifiedAt: new Date()
        };
      }
      return protocol;
    }).filter(Boolean) as SavedProtocol[]; // Remove nulls

    saveProtocols(updatedProtocols);
    setShowDeleteDraftModal(false);
    setDraftToDelete(null);

    console.log('✅ [useProtocolLibrary] Draft deleted successfully');
  };

  // Filter and sort protocols
  const filteredProtocols = savedProtocols.filter(protocol => {
    // Search filter - handle protocol fields properly
    const title = protocol.protocolTitle || '';
    const number = protocol.protocolNumber || '';
    
    const matchesSearch = searchQuery === '' || 
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      number.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus = statusFilter === 'all' || 
      protocol.versions.some(v => v.status === statusFilter);

    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'modified':
        return b.modifiedAt.getTime() - a.modifiedAt.getTime();
      case 'created':
        return b.createdAt.getTime() - a.createdAt.getTime();
      case 'name':
        const aName = a.protocolTitle || '';
        const bName = b.protocolTitle || '';
        return aName.localeCompare(bName);
      default:
        return 0;
    }
  });

  return {
    savedProtocols,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
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
    loadProtocols,
    handlePublishVersion,
    confirmPublishVersion,
    handleEditPublishedVersion,
    handleArchiveProtocol,
    handleDeleteProtocol,
    handleDeleteDraft,
    confirmDeleteDraft,
  };
}