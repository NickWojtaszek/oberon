/**
 * Academic Writing Enhanced - Research Factory Integration
 * Adds LiveBudgetTracker and Journal Selector to Research Factory UI
 */

import { useState, useEffect } from 'react';
import { useProject } from '../contexts/ProtocolContext';
import { AcademicWriting } from './AcademicWriting';
import { LiveBudgetTracker } from './unified-workspace/LiveBudgetTracker';
import { JOURNAL_LIBRARY, getJournalById } from '../data/journalLibrary';
import { calculateManuscriptBudget } from '../utils/budgetCalculator';
import type { ManuscriptBudget, JournalProfile } from '../types/accountability';
import { storage } from '../utils/storageService';

interface AcademicWritingEnhancedProps {
  selectedJournal?: JournalProfile;
  onJournalChange?: (journal: JournalProfile) => void;
  showBudgetTracker?: boolean;
}

export function AcademicWritingEnhanced({
  selectedJournal,
  onJournalChange,
  showBudgetTracker = true,
}: AcademicWritingEnhancedProps) {
  const { currentProject } = useProject();
  const [budget, setBudget] = useState<ManuscriptBudget | null>(null);
  const [currentSection, setCurrentSection] = useState<string>('introduction');
  const [manuscriptContent, setManuscriptContent] = useState('');

  // Default journal if none provided
  const activeJournal = selectedJournal || JOURNAL_LIBRARY[0];

  // Load manuscript content from storage and calculate budget
  useEffect(() => {
    if (!currentProject) return;

    // Get manuscripts from storage using the proper API
    const manuscripts = storage.manuscripts.getAll(currentProject.id);
    
    if (manuscripts && Array.isArray(manuscripts) && manuscripts.length > 0) {
      // Get the first manuscript (or selected one)
      const manuscript = manuscripts[0];
      
      // Combine all sections into single content for analysis
      const fullContent = [
        manuscript.manuscriptContent?.abstract || '',
        manuscript.manuscriptContent?.introduction || '',
        manuscript.manuscriptContent?.methods || '',
        manuscript.manuscriptContent?.results || '',
        manuscript.manuscriptContent?.discussion || '',
      ].join('\n\n');
      
      setManuscriptContent(fullContent);
    }
  }, [currentProject]);

  // Calculate budget whenever content or journal changes
  useEffect(() => {
    if (manuscriptContent && activeJournal) {
      const calculatedBudget = calculateManuscriptBudget(manuscriptContent, activeJournal);
      setBudget(calculatedBudget);
    }
  }, [manuscriptContent, activeJournal]);

  // Listen for content changes from AcademicWriting component
  useEffect(() => {
    if (!currentProject) return;
    
    // Set up interval to check for content updates
    const interval = setInterval(() => {
      const manuscripts = storage.manuscripts.getAll(currentProject.id);
      if (manuscripts && Array.isArray(manuscripts) && manuscripts.length > 0) {
        const manuscript = manuscripts[0];
        const fullContent = [
          manuscript.manuscriptContent?.abstract || '',
          manuscript.manuscriptContent?.introduction || '',
          manuscript.manuscriptContent?.methods || '',
          manuscript.manuscriptContent?.results || '',
          manuscript.manuscriptContent?.discussion || '',
        ].join('\n\n');
        
        // Use functional update to avoid dependency on manuscriptContent
        setManuscriptContent(prev => {
          if (fullContent !== prev) {
            return fullContent;
          }
          return prev;
        });
      }
    }, 2000); // Check every 2 seconds (reduced frequency)

    return () => clearInterval(interval);
  }, [currentProject]); // FIXED: Removed manuscriptContent from dependencies

  return (
    <div className="relative h-full">
      {/* Main Academic Writing Component */}
      <AcademicWriting />

      {/* Live Budget Tracker (Only show in Research Factory UI) */}
      {showBudgetTracker && budget && (
        <LiveBudgetTracker 
          budget={budget}
          currentSection={currentSection}
        />
      )}
    </div>
  );
}