// Hook for managing tracked changes in manuscripts

import { useState, useCallback, useEffect } from 'react';
import type { TrackedChange, ViewMode, UserRole, ChangeType } from '../types/trackedChanges';

interface UseTrackedChangesProps {
  manuscriptId: string;
  currentUser: string;
  currentRole: UserRole;
}

export function useTrackedChanges({ manuscriptId, currentUser, currentRole }: UseTrackedChangesProps) {
  const [changes, setChanges] = useState<TrackedChange[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('markup');
  const [showChanges, setShowChanges] = useState(true);
  const [isTrackingEnabled, setIsTrackingEnabled] = useState(false); // Changed default to false

  // Load changes from localStorage
  useEffect(() => {
    const storageKey = `tracked_changes_${manuscriptId}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setChanges(parsed);
      } catch (e) {
        console.error('Failed to load tracked changes:', e);
      }
    }
  }, [manuscriptId]);

  // Save changes to localStorage
  const saveChanges = useCallback((updatedChanges: TrackedChange[]) => {
    const storageKey = `tracked_changes_${manuscriptId}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedChanges));
    setChanges(updatedChanges);
  }, [manuscriptId]);

  // Track a new change
  const trackChange = useCallback((
    type: ChangeType,
    section: TrackedChange['section'],
    startPos: number,
    endPos: number,
    originalText?: string,
    newText?: string,
    comment?: string
  ) => {
    if (!isTrackingEnabled) return;

    const newChange: TrackedChange = {
      id: `change_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      timestamp: Date.now(),
      author: currentUser,
      role: currentRole,
      section,
      startPos,
      endPos,
      originalText,
      newText,
      status: 'pending',
      comment
    };

    const updatedChanges = [...changes, newChange];
    saveChanges(updatedChanges);
  }, [changes, currentUser, currentRole, isTrackingEnabled, saveChanges]);

  // Accept a change
  const acceptChange = useCallback((changeId: string) => {
    const updatedChanges = changes.map(change =>
      change.id === changeId
        ? { ...change, status: 'accepted' as const, reviewedBy: currentUser, reviewedAt: Date.now() }
        : change
    );
    saveChanges(updatedChanges);
  }, [changes, currentUser, saveChanges]);

  // Reject a change
  const rejectChange = useCallback((changeId: string) => {
    const updatedChanges = changes.map(change =>
      change.id === changeId
        ? { ...change, status: 'rejected' as const, reviewedBy: currentUser, reviewedAt: Date.now() }
        : change
    );
    saveChanges(updatedChanges);
  }, [changes, currentUser, saveChanges]);

  // Accept all changes
  const acceptAll = useCallback(() => {
    const updatedChanges = changes.map(change =>
      change.status === 'pending'
        ? { ...change, status: 'accepted' as const, reviewedBy: currentUser, reviewedAt: Date.now() }
        : change
    );
    saveChanges(updatedChanges);
  }, [changes, currentUser, saveChanges]);

  // Reject all changes
  const rejectAll = useCallback(() => {
    const updatedChanges = changes.map(change =>
      change.status === 'pending'
        ? { ...change, status: 'rejected' as const, reviewedBy: currentUser, reviewedAt: Date.now() }
        : change
    );
    saveChanges(updatedChanges);
  }, [changes, currentUser, saveChanges]);

  // Delete a change (remove from history)
  const deleteChange = useCallback((changeId: string) => {
    const updatedChanges = changes.filter(change => change.id !== changeId);
    saveChanges(updatedChanges);
  }, [changes, saveChanges]);

  // Clear all accepted/rejected changes
  const clearReviewed = useCallback(() => {
    const updatedChanges = changes.filter(change => change.status === 'pending');
    saveChanges(updatedChanges);
  }, [changes, saveChanges]);

  // Get changes for a specific section
  const getChangesForSection = useCallback((section: TrackedChange['section']) => {
    return changes.filter(change => change.section === section);
  }, [changes]);

  // Get pending changes count
  const getPendingCount = useCallback(() => {
    return changes.filter(change => change.status === 'pending').length;
  }, [changes]);

  // Apply changes to text based on view mode
  const applyChangesToText = useCallback((
    originalText: string,
    section: TrackedChange['section']
  ): string => {
    const sectionChanges = getChangesForSection(section)
      .filter(change => {
        if (viewMode === 'original') return false;
        if (viewMode === 'clean') return change.status === 'accepted';
        return true; // markup mode shows all
      })
      .sort((a, b) => b.startPos - a.startPos); // Apply from end to start

    let resultText = originalText;

    for (const change of sectionChanges) {
      if (change.type === 'insertion' && change.newText) {
        const before = resultText.substring(0, change.startPos);
        const after = resultText.substring(change.startPos);
        resultText = before + change.newText + after;
      } else if (change.type === 'deletion' && change.originalText) {
        const before = resultText.substring(0, change.startPos);
        const after = resultText.substring(change.endPos);
        resultText = before + after;
      } else if (change.type === 'replacement' && change.originalText && change.newText) {
        const before = resultText.substring(0, change.startPos);
        const after = resultText.substring(change.endPos);
        resultText = before + change.newText + after;
      }
    }

    return resultText;
  }, [getChangesForSection, viewMode]);

  return {
    changes,
    viewMode,
    setViewMode,
    showChanges,
    setShowChanges,
    isTrackingEnabled,
    setIsTrackingEnabled,
    trackChange,
    acceptChange,
    rejectChange,
    acceptAll,
    rejectAll,
    deleteChange,
    clearReviewed,
    getChangesForSection,
    getPendingCount,
    applyChangesToText
  };
}