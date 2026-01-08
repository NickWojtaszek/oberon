// Custom Hook: Manuscript State Management

import { useState, useEffect } from 'react';
import { storage } from '../utils/storageService';
import type { ManuscriptManifest, SourceDocument, ReviewComment, SatelliteOpportunity } from '../types/manuscript';
import type { SavedProtocol } from '../components/protocol-workbench/types';

export function useManuscriptState(projectId: string | undefined) {
  const [manuscripts, setManuscripts] = useState<ManuscriptManifest[]>([]);
  const [selectedManuscriptId, setSelectedManuscriptId] = useState<string | null>(null);
  const [protocols, setProtocols] = useState<SavedProtocol[]>([]);

  // Load manuscripts and protocols on mount
  useEffect(() => {
    if (!projectId) return;

    const loadedManuscripts = storage.manuscripts.getAll(projectId);
    setManuscripts(loadedManuscripts);

    if (loadedManuscripts.length > 0 && !selectedManuscriptId) {
      setSelectedManuscriptId(loadedManuscripts[0].id);
    }

    const loadedProtocols = storage.protocols.getAll(projectId);
    setProtocols(loadedProtocols);
  }, [projectId]);

  const selectedManuscript = manuscripts.find(m => m.id === selectedManuscriptId);

  // Get published protocol and schema blocks
  const publishedProtocol = protocols.find(p => p.versions.some(v => v.status === 'published'));
  const publishedVersion = publishedProtocol?.versions.find(v => v.status === 'published');
  const schemaBlocks = publishedVersion?.schemaBlocks || [];

  // Create new manuscript
  const handleCreateManuscript = (title: string) => {
    if (!projectId) return null;

    const newManuscript: ManuscriptManifest = {
      id: `manuscript-${Date.now()}`,
      projectMeta: {
        projectId,
        studyTitle: title,
        primaryInvestigator: 'Unknown',
        protocolRef: publishedVersion?.versionNumber || 'N/A',
        createdAt: Date.now(),
        modifiedAt: Date.now()
      },
      manuscriptStructure: {
        methods: {
          statisticalPlan: {
            software: 'Clinical Intelligence Engine v1.0',
            primaryTest: 'To be determined',
            rationale: 'Based on study design and endpoint characteristics'
          },
          populationSummary: 'To be determined'
        },
        results: {
          primaryFindings: [],
          secondaryFindings: []
        },
        discussionAnchors: {
          internalConflicts: '',
          lateralOpportunities: []
        }
      },
      notebookContext: {
        linkedSources: [],
        citationMap: {}
      },
      manuscriptContent: {
        introduction: '',
        methods: '',
        results: '',
        discussion: '',
        conclusion: ''
      },
      reviewComments: []
    };

    storage.manuscripts.save(newManuscript, projectId);
    setManuscripts(prev => [...prev, newManuscript]);
    setSelectedManuscriptId(newManuscript.id);
    
    return newManuscript;
  };

  // Update manuscript content
  const handleContentChange = (section: keyof ManuscriptManifest['manuscriptContent'], content: string) => {
    if (!selectedManuscript || !projectId) return;

    const updated: ManuscriptManifest = {
      ...selectedManuscript,
      manuscriptContent: {
        ...selectedManuscript.manuscriptContent,
        [section]: content
      },
      projectMeta: {
        ...selectedManuscript.projectMeta,
        modifiedAt: Date.now()
      }
    };

    storage.manuscripts.save(updated, projectId);
    setManuscripts(prev => prev.map(m => m.id === updated.id ? updated : m));
  };

  // Add a manuscript to state (used by demo loader)
  const addManuscript = (manuscript: ManuscriptManifest) => {
    if (!projectId) return;
    
    storage.manuscripts.save(manuscript, projectId);
    setManuscripts(prev => [...prev, manuscript]);
    setSelectedManuscriptId(manuscript.id);
  };

  // Source management
  const handleSourceAdd = (source: SourceDocument) => {
    if (!selectedManuscript || !projectId) return;

    const updated: ManuscriptManifest = {
      ...selectedManuscript,
      notebookContext: {
        ...selectedManuscript.notebookContext,
        linkedSources: [...selectedManuscript.notebookContext.linkedSources, source]
      }
    };

    storage.manuscripts.save(updated, projectId);
    setManuscripts(prev => prev.map(m => m.id === updated.id ? updated : m));
  };

  const handleSourceToggle = (sourceId: string) => {
    if (!selectedManuscript || !projectId) return;

    const updated: ManuscriptManifest = {
      ...selectedManuscript,
      notebookContext: {
        ...selectedManuscript.notebookContext,
        linkedSources: selectedManuscript.notebookContext.linkedSources.map(s =>
          s.id === sourceId ? { ...s, isGrounded: !s.isGrounded } : s
        )
      }
    };

    storage.manuscripts.save(updated, projectId);
    setManuscripts(prev => prev.map(m => m.id === updated.id ? updated : m));
  };

  const handleSourceRemove = (sourceId: string) => {
    if (!selectedManuscript || !projectId) return;

    const updated: ManuscriptManifest = {
      ...selectedManuscript,
      notebookContext: {
        ...selectedManuscript.notebookContext,
        linkedSources: selectedManuscript.notebookContext.linkedSources.filter(s => s.id !== sourceId)
      }
    };

    storage.manuscripts.save(updated, projectId);
    setManuscripts(prev => prev.map(m => m.id === updated.id ? updated : m));
  };

  // Review comments
  const handleAddComment = (comment: Omit<ReviewComment, 'id' | 'timestamp'>) => {
    if (!selectedManuscript || !projectId) return;

    const newComment: ReviewComment = {
      ...comment,
      id: `comment-${Date.now()}`,
      timestamp: Date.now()
    };

    const updated: ManuscriptManifest = {
      ...selectedManuscript,
      reviewComments: [...selectedManuscript.reviewComments, newComment]
    };

    storage.manuscripts.save(updated, projectId);
    setManuscripts(prev => prev.map(m => m.id === updated.id ? updated : m));
  };

  const handleResolveComment = (commentId: string) => {
    if (!selectedManuscript || !projectId) return;

    const updated: ManuscriptManifest = {
      ...selectedManuscript,
      reviewComments: selectedManuscript.reviewComments.map(c =>
        c.id === commentId ? { ...c, resolved: true } : c
      )
    };

    storage.manuscripts.save(updated, projectId);
    setManuscripts(prev => prev.map(m => m.id === updated.id ? updated : m));
  };

  const handleDeleteComment = (commentId: string) => {
    if (!selectedManuscript || !projectId) return;

    const updated: ManuscriptManifest = {
      ...selectedManuscript,
      reviewComments: selectedManuscript.reviewComments.filter(c => c.id !== commentId)
    };

    storage.manuscripts.save(updated, projectId);
    setManuscripts(prev => prev.map(m => m.id === updated.id ? updated : m));
  };

  // Create satellite draft from Research Multiplier
  const handleCreateSatelliteDraft = (opportunity: SatelliteOpportunity) => {
    if (!projectId) return;

    const newManuscript: ManuscriptManifest = {
      id: `manuscript-${Date.now()}`,
      projectMeta: {
        projectId,
        studyTitle: opportunity.title,
        primaryInvestigator: 'Unknown',
        protocolRef: publishedVersion?.versionNumber || 'N/A',
        createdAt: Date.now(),
        modifiedAt: Date.now()
      },
      manuscriptStructure: {
        methods: {
          statisticalPlan: {
            software: 'Clinical Intelligence Engine v1.0',
            primaryTest: 'To be determined',
            rationale: opportunity.rationale
          },
          populationSummary: 'To be determined'
        },
        results: {
          primaryFindings: [],
          secondaryFindings: []
        },
        discussionAnchors: {
          internalConflicts: '',
          lateralOpportunities: []
        }
      },
      notebookContext: {
        linkedSources: [],
        citationMap: {}
      },
      manuscriptContent: {
        introduction: `[Draft manuscript for: ${opportunity.title}]\n\nThis ${opportunity.type} focuses on ${opportunity.description}`,
        methods: '',
        results: '',
        discussion: '',
        conclusion: ''
      },
      reviewComments: []
    };

    storage.manuscripts.save(newManuscript, projectId);
    setManuscripts(prev => [...prev, newManuscript]);
    setSelectedManuscriptId(newManuscript.id);
  };

  // Get used citations for bibliography
  const getUsedCitations = () => {
    if (!selectedManuscript) return [];

    const citationPattern = /\[@([^\]]+)\]/g;
    const citationCounts: { [key: string]: number } = {};

    Object.values(selectedManuscript.manuscriptContent).forEach(content => {
      const matches = [...content.matchAll(citationPattern)];
      matches.forEach(match => {
        const key = match[1];
        citationCounts[key] = (citationCounts[key] || 0) + 1;
      });
    });

    return Object.entries(citationCounts).map(([citationKey, count]) => ({
      citationKey,
      count
    }));
  };

  return {
    manuscripts,
    selectedManuscript,
    selectedManuscriptId,
    setSelectedManuscriptId,
    schemaBlocks,
    handleCreateManuscript,
    handleContentChange,
    addManuscript,
    handleSourceAdd,
    handleSourceToggle,
    handleSourceRemove,
    handleAddComment,
    handleResolveComment,
    handleDeleteComment,
    handleCreateSatelliteDraft,
    getUsedCitations
  };
}
