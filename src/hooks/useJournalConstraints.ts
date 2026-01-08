// Custom Hook: Journal Constraints & Word Budgeting (Phase 4)

import { useState, useEffect, useMemo } from 'react';
import { getJournalProfile } from '../config/journalRules';
import type { JournalProfile, JournalConstraintStatus, CitationConstraintStatus, ConstraintWarning } from '../types/journalProfile';
import type { ManuscriptManifest } from '../types/manuscript';

export function useJournalConstraints(
  selectedJournalId: string | null,
  manuscript: ManuscriptManifest | undefined
) {
  const [journalProfile, setJournalProfile] = useState<JournalProfile | null>(null);

  // Load journal profile when ID changes
  useEffect(() => {
    if (!selectedJournalId) {
      setJournalProfile(null);
      return;
    }
    
    const profile = getJournalProfile(selectedJournalId);
    setJournalProfile(profile);
  }, [selectedJournalId]);

  // Count words in text
  const countWords = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  // Calculate word counts for all sections
  const wordCounts = useMemo(() => {
    if (!manuscript) return {};
    
    const counts: Record<string, number> = {};
    Object.entries(manuscript.manuscriptContent).forEach(([section, content]) => {
      counts[section] = countWords(content);
    });
    
    // Calculate total
    counts.total = Object.values(counts).reduce((sum, count) => sum + count, 0);
    
    return counts;
  }, [manuscript?.manuscriptContent]);

  // Calculate citation count
  const citationCount = useMemo(() => {
    if (!manuscript) return 0;
    
    const citationPattern = /\[@([^\]]+)\]/g;
    const uniqueCitations = new Set<string>();
    
    Object.values(manuscript.manuscriptContent).forEach(content => {
      const matches = [...content.matchAll(citationPattern)];
      matches.forEach(match => uniqueCitations.add(match[1]));
    });
    
    return uniqueCitations.size;
  }, [manuscript?.manuscriptContent]);

  // Check section word limits
  const getSectionStatus = (section: string): JournalConstraintStatus | null => {
    if (!journalProfile || !wordCounts[section]) return null;
    
    const limit = journalProfile.wordLimits[section as keyof typeof journalProfile.wordLimits];
    if (!limit) return null;
    
    const current = wordCounts[section];
    const percentage = (current / limit) * 100;
    
    let status: 'ok' | 'warning' | 'error' = 'ok';
    if (percentage > 100) status = 'error';
    else if (percentage > 90) status = 'warning';
    
    return {
      section,
      currentWords: current,
      limit,
      percentage,
      status
    };
  };

  // Check citation limit
  const getCitationStatus = (): CitationConstraintStatus | null => {
    if (!journalProfile) return null;
    
    const limit = journalProfile.citationLimit;
    const percentage = (citationCount / limit) * 100;
    
    let status: 'ok' | 'warning' | 'error' = 'ok';
    if (percentage > 100) status = 'error';
    else if (percentage > 90) status = 'warning';
    
    return {
      currentCount: citationCount,
      limit,
      percentage,
      status
    };
  };

  // Get all constraint warnings
  const getConstraintWarnings = (): ConstraintWarning[] => {
    if (!journalProfile || !manuscript) return [];
    
    const warnings: ConstraintWarning[] = [];
    
    // Check word limits for each section
    Object.keys(journalProfile.wordLimits).forEach(section => {
      if (section === 'totalMain') return; // Skip total for now
      
      const status = getSectionStatus(section);
      if (status && status.status !== 'ok') {
        warnings.push({
          type: 'word_limit',
          severity: status.status === 'error' ? 'error' : 'warning',
          section: status.section,
          message: `${status.section} exceeds word limit (${status.currentWords}/${status.limit} words)`,
          current: status.currentWords,
          limit: status.limit
        });
      }
    });
    
    // Check citation limit
    const citationStatus = getCitationStatus();
    if (citationStatus && citationStatus.status !== 'ok') {
      warnings.push({
        type: 'citation_limit',
        severity: citationStatus.status === 'error' ? 'error' : 'warning',
        message: `Citation count exceeds limit (${citationStatus.currentCount}/${citationStatus.limit} citations)`,
        current: citationStatus.currentCount,
        limit: citationStatus.limit
      });
    }
    
    // Check required sections
    journalProfile.requiredSections.forEach(requiredSection => {
      const content = manuscript.manuscriptContent[requiredSection as keyof typeof manuscript.manuscriptContent];
      if (!content || content.trim().length === 0) {
        warnings.push({
          type: 'section_missing',
          severity: 'error',
          section: requiredSection,
          message: `Required section "${requiredSection}" is empty`
        });
      }
    });
    
    return warnings;
  };

  // Check if manuscript is ready for submission
  const isReadyForSubmission = (): boolean => {
    const warnings = getConstraintWarnings();
    return warnings.filter(w => w.severity === 'error').length === 0;
  };

  // Get overall compliance score (0-100)
  const getComplianceScore = (): number => {
    if (!journalProfile || !manuscript) return 0;
    
    const warnings = getConstraintWarnings();
    const totalChecks = Object.keys(journalProfile.wordLimits).length + 1 + journalProfile.requiredSections.length;
    const passedChecks = totalChecks - warnings.filter(w => w.severity === 'error').length;
    
    return Math.round((passedChecks / totalChecks) * 100);
  };

  return {
    journalProfile,
    wordCounts,
    citationCount,
    getSectionStatus,
    getCitationStatus,
    getConstraintWarnings,
    isReadyForSubmission,
    getComplianceScore,
    hasConstraints: journalProfile !== null
  };
}
