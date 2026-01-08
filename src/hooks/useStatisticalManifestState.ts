// Custom Hook: Statistical Manifest State

import { useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storageService';
import type { StatisticalManifest } from '../components/analytics-stats/types';

export function useStatisticalManifestState(projectId: string | undefined) {
  const [statisticalManifests, setStatisticalManifests] = useState<StatisticalManifest[]>([]);

  const loadManifests = useCallback(() => {
    if (!projectId) return;
    const loadedManifests = storage.statisticalManifests.getAll(projectId);
    setStatisticalManifests(loadedManifests);
  }, [projectId]);

  // Load statistical manifests on mount
  useEffect(() => {
    loadManifests();
  }, [loadManifests]);

  // Get the most recent statistical manifest
  const latestStatisticalManifest = statisticalManifests.length > 0
    ? statisticalManifests.sort((a, b) => b.manifestMetadata.generatedAt - a.manifestMetadata.generatedAt)[0]
    : null;

  return {
    statisticalManifests,
    latestStatisticalManifest,
    refreshManifests: loadManifests, // NEW: Allow manual refresh
  };
}
