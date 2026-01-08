// Custom Hook: Manuscript State Management (Refactored with Service Layer)

import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { manuscriptService } from '../services/manuscriptService';
import { storage } from '../utils/storageService';
import { queryKeys } from '../lib/queryClient';
import type { ManuscriptManifest, SourceDocument, ReviewComment, SatelliteOpportunity } from '../types/manuscript';
import type { SavedProtocol } from '../components/protocol-workbench/types';

export function useManuscriptState(projectId: string | undefined) {
  const queryClient = useQueryClient();
  const [selectedManuscriptId, setSelectedManuscriptId] = useState<string | null>(null);
  
  // Local optimistic state for content to prevent cursor jumping
  const [optimisticContent, setOptimisticContent] = useState<Record<string, string>>({});
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch manuscripts with React Query
  const {
    data: manuscripts = [],
    isLoading: isLoadingManuscripts,
    error: manuscriptsError,
  } = useQuery({
    queryKey: queryKeys.manuscripts.all(projectId || ''),
    queryFn: () => manuscriptService.getAll(projectId!),
    enabled: !!projectId,
  });

  // Fetch selected manuscript details
  const {
    data: selectedManuscript,
    isLoading: isLoadingSelected,
  } = useQuery({
    queryKey: queryKeys.manuscripts.detail(selectedManuscriptId || ''),
    queryFn: () => manuscriptService.getById(selectedManuscriptId!),
    enabled: !!selectedManuscriptId,
  });

  // Auto-select first manuscript
  useEffect(() => {
    if (manuscripts.length > 0 && !selectedManuscriptId) {
      setSelectedManuscriptId(manuscripts[0].id);
    }
  }, [manuscripts, selectedManuscriptId]);

  // Load protocols (still using localStorage for now)
  const protocols = projectId ? storage.protocols.getAll(projectId) : [];
  const publishedProtocol = protocols.find(p => p.versions.some(v => v.status === 'published'));
  const publishedVersion = publishedProtocol?.versions.find(v => v.status === 'published');
  const schemaBlocks = publishedVersion?.schemaBlocks || [];

  // Create manuscript mutation
  const createMutation = useMutation({
    mutationFn: (manuscript: ManuscriptManifest) => manuscriptService.create(manuscript),
    onSuccess: (newManuscript) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.manuscripts.all(projectId || '') });
      setSelectedManuscriptId(newManuscript.id);
    },
  });

  // Update manuscript mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<ManuscriptManifest> }) =>
      manuscriptService.update(id, updates),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.manuscripts.detail(updated.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.manuscripts.all(projectId || '') });
    },
  });

  // Update content mutation
  const updateContentMutation = useMutation({
    mutationFn: ({
      manuscriptId,
      section,
      content,
    }: {
      manuscriptId: string;
      section: keyof ManuscriptManifest['manuscriptContent'];
      content: string;
    }) => manuscriptService.updateContent(manuscriptId, section, content),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.manuscripts.detail(updated.id), updated);
    },
  });

  // Add source mutation
  const addSourceMutation = useMutation({
    mutationFn: ({
      manuscriptId,
      source,
    }: {
      manuscriptId: string;
      source: SourceDocument;
    }) => manuscriptService.addSource(manuscriptId, source),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.manuscripts.detail(updated.id), updated);
    },
  });

  // Remove source mutation
  const removeSourceMutation = useMutation({
    mutationFn: ({ manuscriptId, sourceId }: { manuscriptId: string; sourceId: string }) =>
      manuscriptService.removeSource(manuscriptId, sourceId),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.manuscripts.detail(updated.id), updated);
    },
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: ({
      manuscriptId,
      comment,
    }: {
      manuscriptId: string;
      comment: ReviewComment;
    }) => manuscriptService.addReviewComment(manuscriptId, comment),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.manuscripts.detail(updated.id), updated);
    },
  });

  // Resolve comment mutation
  const resolveCommentMutation = useMutation({
    mutationFn: ({ manuscriptId, commentId }: { manuscriptId: string; commentId: string }) =>
      manuscriptService.resolveComment(manuscriptId, commentId),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.manuscripts.detail(updated.id), updated);
    },
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: ({ manuscriptId, commentId }: { manuscriptId: string; commentId: string }) =>
      manuscriptService.deleteComment(manuscriptId, commentId),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.manuscripts.detail(updated.id), updated);
    },
  });

  // Handler functions
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
        modifiedAt: Date.now(),
      },
      manuscriptStructure: {
        methods: {
          statisticalPlan: {
            software: 'Clinical Intelligence Engine v1.0',
            primaryTest: 'To be determined',
            rationale: 'Based on study design and endpoint characteristics',
          },
          populationSummary: 'To be determined',
        },
        results: {
          primaryFindings: [],
          secondaryFindings: [],
        },
        discussionAnchors: {
          internalConflicts: '',
          lateralOpportunities: [],
        },
      },
      notebookContext: {
        linkedSources: [],
        citationMap: {},
      },
      manuscriptContent: {
        introduction: '',
        methods: '',
        results: '',
        discussion: '',
        conclusion: '',
      },
      reviewComments: [],
    };

    createMutation.mutate(newManuscript);
    return newManuscript;
  };

  const handleContentChange = (
    section: keyof ManuscriptManifest['manuscriptContent'],
    content: string
  ) => {
    if (!selectedManuscript) return;

    // Update local state immediately for optimistic UI
    setOptimisticContent(prev => ({ ...prev, [section]: content }));

    // Debounce the actual mutation call
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      updateContentMutation.mutate({
        manuscriptId: selectedManuscript.id,
        section,
        content,
      });
    }, 500);
  };

  const handleSourceAdd = (source: SourceDocument) => {
    if (!selectedManuscript) return;

    addSourceMutation.mutate({
      manuscriptId: selectedManuscript.id,
      source,
    });
  };

  const handleSourceToggle = (sourceId: string) => {
    if (!selectedManuscript) return;

    const source = selectedManuscript.notebookContext.linkedSources.find(s => s.id === sourceId);
    if (!source) return;

    const updated: SourceDocument = {
      ...source,
      enabled: !source.enabled,
    };

    // Update through service
    updateMutation.mutate({
      id: selectedManuscript.id,
      updates: {
        notebookContext: {
          ...selectedManuscript.notebookContext,
          linkedSources: selectedManuscript.notebookContext.linkedSources.map(s =>
            s.id === sourceId ? updated : s
          ),
        },
      },
    });
  };

  const handleSourceRemove = (sourceId: string) => {
    if (!selectedManuscript) return;

    removeSourceMutation.mutate({
      manuscriptId: selectedManuscript.id,
      sourceId,
    });
  };

  const handleAddComment = (comment: ReviewComment) => {
    if (!selectedManuscript) return;

    addCommentMutation.mutate({
      manuscriptId: selectedManuscript.id,
      comment,
    });
  };

  const handleResolveComment = (commentId: string) => {
    if (!selectedManuscript) return;

    resolveCommentMutation.mutate({
      manuscriptId: selectedManuscript.id,
      commentId,
    });
  };

  const handleDeleteComment = (commentId: string) => {
    if (!selectedManuscript) return;

    deleteCommentMutation.mutate({
      manuscriptId: selectedManuscript.id,
      commentId,
    });
  };

  const handleCreateSatelliteDraft = (opportunity: SatelliteOpportunity) => {
    // Implement satellite draft creation
    console.log('Creating satellite draft:', opportunity);
  };

  const getUsedCitations = (): string[] => {
    if (!selectedManuscript) return [];

    const citations = new Set<string>();
    const citationPattern = /\[@([^\]]+)\]/g;

    Object.values(selectedManuscript.manuscriptContent).forEach(content => {
      const matches = [...content.matchAll(citationPattern)];
      matches.forEach(match => citations.add(match[1]));
    });

    return Array.from(citations);
  };

  const addManuscript = (manuscript: ManuscriptManifest) => {
    createMutation.mutate(manuscript);
  };

  // Merge optimistic content with fetched manuscript
  const manuscriptWithOptimisticContent = selectedManuscript ? {
    ...selectedManuscript,
    manuscriptContent: {
      ...selectedManuscript.manuscriptContent,
      ...Object.keys(optimisticContent).reduce((acc, key) => {
        if (optimisticContent[key] !== undefined) {
          acc[key as keyof ManuscriptManifest['manuscriptContent']] = optimisticContent[key];
        }
        return acc;
      }, {} as Partial<ManuscriptManifest['manuscriptContent']>)
    }
  } : null;

  return {
    manuscripts,
    selectedManuscript: manuscriptWithOptimisticContent,
    selectedManuscriptId,
    isLoading: isLoadingManuscripts || isLoadingSelected,
    error: manuscriptsError,
    setSelectedManuscriptId,
    handleCreateManuscript,
    handleContentChange,
    handleSourceAdd,
    handleSourceToggle,
    handleSourceRemove,
    handleAddComment,
    handleResolveComment,
    handleDeleteComment,
    handleCreateSatelliteDraft,
    getUsedCitations,
    addManuscript,
    schemaBlocks,
  };
}