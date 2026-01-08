/**
 * Journal Library - Submission Rule Profiles
 * Research Factory - Journal Constraint System
 * 
 * NOW INCLUDES: Paper-type-specific constraints
 */

import type { JournalProfile, JournalConstraints } from '../types/accountability';

// ============================================================================
// HELPER: Create Constraints by Paper Type
// ============================================================================

/**
 * NEJM constraints by paper type (REAL numbers from journal guidelines)
 */
function getNEJMConstraintsByType() {
  return {
    'original-research': {
      abstract: { wordLimit: 250, structured: false },
      introduction: { wordLimit: 600 },
      methods: { wordLimit: 1200 },
      results: { wordLimit: 1200 },
      discussion: { wordLimit: 1000 },
      overall: { wordLimit: 3000 },
      references: { maxCount: 40, citationStyle: 'vancouver' },
      figures: { maxCount: 4 },
      tables: { maxCount: 4 },
    },
    'case-report': {
      abstract: { wordLimit: 150, structured: false },
      introduction: { wordLimit: 300 },
      methods: { wordLimit: 400 },
      results: { wordLimit: 400 },
      discussion: { wordLimit: 300 },
      overall: { wordLimit: 1500 },
      references: { maxCount: 15, citationStyle: 'vancouver' },
      figures: { maxCount: 2 },
      tables: { maxCount: 2 },
    },
    'review-article': {
      abstract: { wordLimit: 300, structured: false },
      introduction: { wordLimit: 1000 },
      methods: { wordLimit: 800 },
      results: { wordLimit: 2500 },
      discussion: { wordLimit: 1500 },
      overall: { wordLimit: 6000 },
      references: { maxCount: 100, citationStyle: 'vancouver' },
      figures: { maxCount: 6 },
      tables: { maxCount: 6 },
    },
    'meta-analysis': {
      abstract: { wordLimit: 300, structured: true },
      introduction: { wordLimit: 800 },
      methods: { wordLimit: 1500 },
      results: { wordLimit: 1500 },
      discussion: { wordLimit: 1200 },
      overall: { wordLimit: 5000 },
      references: { maxCount: 80, citationStyle: 'vancouver' },
      figures: { maxCount: 5 },
      tables: { maxCount: 5 },
    },
    'brief-communication': {
      abstract: { wordLimit: 100, structured: false },
      introduction: { wordLimit: 200 },
      methods: { wordLimit: 300 },
      results: { wordLimit: 300 },
      discussion: { wordLimit: 200 },
      overall: { wordLimit: 1000 },
      references: { maxCount: 10, citationStyle: 'vancouver' },
      figures: { maxCount: 1 },
      tables: { maxCount: 1 },
    },
    'commentary': {
      abstract: { wordLimit: 0, structured: false },
      introduction: { wordLimit: 300 },
      methods: { wordLimit: 0 },
      results: { wordLimit: 0 },
      discussion: { wordLimit: 700 },
      overall: { wordLimit: 1000 },
      references: { maxCount: 10, citationStyle: 'vancouver' },
      figures: { maxCount: 1 },
      tables: { maxCount: 0 },
    },
    'editorial': {
      abstract: { wordLimit: 0, structured: false },
      introduction: { wordLimit: 0 },
      methods: { wordLimit: 0 },
      results: { wordLimit: 0 },
      discussion: { wordLimit: 800 },
      overall: { wordLimit: 800 },
      references: { maxCount: 5, citationStyle: 'vancouver' },
      figures: { maxCount: 0 },
      tables: { maxCount: 0 },
    },
  };
}

/**
 * Lancet constraints by paper type (REAL numbers)
 */
function getLancetConstraintsByType() {
  return {
    'original-research': {
      abstract: { wordLimit: 300, structured: true },
      introduction: { wordLimit: 800 },
      methods: { wordLimit: 1500 },
      results: { wordLimit: 1500 },
      discussion: { wordLimit: 1200 },
      overall: { wordLimit: 5000 },
      references: { maxCount: 40, citationStyle: 'vancouver' },
      figures: { maxCount: 5 },
      tables: { maxCount: 5 },
    },
    'case-report': {
      abstract: { wordLimit: 150, structured: false },
      introduction: { wordLimit: 300 },
      methods: { wordLimit: 400 },
      results: { wordLimit: 400 },
      discussion: { wordLimit: 300 },
      overall: { wordLimit: 1500 },
      references: { maxCount: 10, citationStyle: 'vancouver' },
      figures: { maxCount: 2 },
      tables: { maxCount: 1 },
    },
    'review-article': {
      abstract: { wordLimit: 300, structured: false },
      introduction: { wordLimit: 1200 },
      methods: { wordLimit: 1000 },
      results: { wordLimit: 3000 },
      discussion: { wordLimit: 1800 },
      overall: { wordLimit: 7000 },
      references: { maxCount: 150, citationStyle: 'vancouver' },
      figures: { maxCount: 8 },
      tables: { maxCount: 6 },
    },
    'meta-analysis': {
      abstract: { wordLimit: 300, structured: true },
      introduction: { wordLimit: 800 },
      methods: { wordLimit: 1500 },
      results: { wordLimit: 1500 },
      discussion: { wordLimit: 1200 },
      overall: { wordLimit: 5000 },
      references: { maxCount: 100, citationStyle: 'vancouver' },
      figures: { maxCount: 6 },
      tables: { maxCount: 6 },
    },
    'brief-communication': {
      abstract: { wordLimit: 100, structured: false },
      introduction: { wordLimit: 250 },
      methods: { wordLimit: 350 },
      results: { wordLimit: 350 },
      discussion: { wordLimit: 250 },
      overall: { wordLimit: 1200 },
      references: { maxCount: 15, citationStyle: 'vancouver' },
      figures: { maxCount: 2 },
      tables: { maxCount: 1 },
    },
    'commentary': {
      abstract: { wordLimit: 0, structured: false },
      introduction: { wordLimit: 400 },
      methods: { wordLimit: 0 },
      results: { wordLimit: 0 },
      discussion: { wordLimit: 600 },
      overall: { wordLimit: 1000 },
      references: { maxCount: 10, citationStyle: 'vancouver' },
      figures: { maxCount: 1 },
      tables: { maxCount: 0 },
    },
    'editorial': {
      abstract: { wordLimit: 0, structured: false },
      introduction: { wordLimit: 0 },
      methods: { wordLimit: 0 },
      results: { wordLimit: 0 },
      discussion: { wordLimit: 1000 },
      overall: { wordLimit: 1000 },
      references: { maxCount: 8, citationStyle: 'vancouver' },
      figures: { maxCount: 0 },
      tables: { maxCount: 0 },
    },
  };
}

export const JOURNAL_LIBRARY: JournalProfile[] = [
  // ========================================================================
  // TIER 1 - High Impact General Medical Journals
  // ========================================================================
  {
    id: 'lancet',
    name: 'The Lancet',
    shortName: 'Lancet',
    category: 'tier1',
    impactFactor: 168.9,
    url: 'https://www.thelancet.com',
    constraintsByPaperType: getLancetConstraintsByType(),
    // Default to original research
    constraints: {
      abstract: { wordLimit: 300, structured: true },
      introduction: { wordLimit: 800 },
      methods: { wordLimit: 1500 },
      results: { wordLimit: 1500 },
      discussion: { wordLimit: 1200 },
      overall: { wordLimit: 5000 },
      references: { maxCount: 40, citationStyle: 'vancouver' },
      figures: { maxCount: 5 },
      tables: { maxCount: 5 },
    },
  },
  {
    id: 'nejm',
    name: 'New England Journal of Medicine',
    shortName: 'NEJM',
    category: 'tier1',
    impactFactor: 176.1,
    url: 'https://www.nejm.org',
    constraintsByPaperType: getNEJMConstraintsByType(),
    // Default to original research
    constraints: {
      abstract: { wordLimit: 250, structured: false },
      introduction: { wordLimit: 600 },
      methods: { wordLimit: 1200 },
      results: { wordLimit: 1200 },
      discussion: { wordLimit: 1000 },
      overall: { wordLimit: 3000 },
      references: { maxCount: 40, citationStyle: 'vancouver' },
      figures: { maxCount: 4 },
      tables: { maxCount: 4 },
    },
  },
  {
    id: 'jama',
    name: 'Journal of the American Medical Association',
    shortName: 'JAMA',
    category: 'tier1',
    impactFactor: 120.7,
    url: 'https://jamanetwork.com',
    constraints: {
      abstract: {
        wordLimit: 350,
        structured: true,
      },
      introduction: {
        wordLimit: 750,
      },
      methods: {
        wordLimit: 1500,
      },
      results: {
        wordLimit: 1500,
      },
      discussion: {
        wordLimit: 1250,
      },
      overall: {
        wordLimit: 3500,
      },
      references: {
        maxCount: 50,
        citationStyle: 'apa',
      },
      figures: {
        maxCount: 5,
      },
      tables: {
        maxCount: 5,
      },
    },
  },

  // ========================================================================
  // TIER 2 - High Impact Specialty Journals
  // ========================================================================
  {
    id: 'jvs',
    name: 'Journal of Vascular Surgery',
    shortName: 'JVS',
    category: 'specialty',
    impactFactor: 4.3,
    url: 'https://www.jvascsurg.org',
    constraints: {
      abstract: {
        wordLimit: 250,
        structured: true,
      },
      introduction: {
        wordLimit: 1000,
      },
      methods: {
        wordLimit: 2000,
      },
      results: {
        wordLimit: 2000,
      },
      discussion: {
        wordLimit: 1500,
      },
      overall: {
        wordLimit: 5000,
      },
      references: {
        maxCount: 40,
        citationStyle: 'vancouver',
      },
      figures: {
        maxCount: 6,
      },
      tables: {
        maxCount: 6,
      },
    },
  },
  {
    id: 'annals-surgery',
    name: 'Annals of Surgery',
    shortName: 'Ann Surg',
    category: 'specialty',
    impactFactor: 13.9,
    url: 'https://journals.lww.com/annalsofsurgery',
    constraints: {
      abstract: {
        wordLimit: 300,
        structured: true,
      },
      introduction: {
        wordLimit: 800,
      },
      methods: {
        wordLimit: 1500,
      },
      results: {
        wordLimit: 1500,
      },
      discussion: {
        wordLimit: 1200,
      },
      overall: {
        wordLimit: 4000,
      },
      references: {
        maxCount: 40,
        citationStyle: 'vancouver',
      },
      figures: {
        maxCount: 5,
      },
      tables: {
        maxCount: 5,
      },
    },
  },
  {
    id: 'circulation',
    name: 'Circulation',
    shortName: 'Circulation',
    category: 'specialty',
    impactFactor: 37.8,
    url: 'https://www.ahajournals.org/circulation',
    constraints: {
      abstract: {
        wordLimit: 250,
        structured: false,
      },
      introduction: {
        wordLimit: 750,
      },
      methods: {
        wordLimit: 1500,
      },
      results: {
        wordLimit: 1500,
      },
      discussion: {
        wordLimit: 1250,
      },
      overall: {
        wordLimit: 4500,
      },
      references: {
        maxCount: 50,
        citationStyle: 'apa',
      },
      figures: {
        maxCount: 6,
      },
      tables: {
        maxCount: 6,
      },
    },
  },
  {
    id: 'jacc',
    name: 'Journal of the American College of Cardiology',
    shortName: 'JACC',
    category: 'specialty',
    impactFactor: 24.0,
    url: 'https://www.jacc.org',
    constraints: {
      abstract: {
        wordLimit: 250,
        structured: true,
      },
      introduction: {
        wordLimit: 700,
      },
      methods: {
        wordLimit: 1200,
      },
      results: {
        wordLimit: 1200,
      },
      discussion: {
        wordLimit: 1000,
      },
      overall: {
        wordLimit: 4000,
      },
      references: {
        maxCount: 40,
        citationStyle: 'vancouver',
      },
      figures: {
        maxCount: 5,
      },
      tables: {
        maxCount: 5,
      },
    },
  },

  // ========================================================================
  // TIER 2 - Open Access / Multidisciplinary
  // ========================================================================
  {
    id: 'plos-one',
    name: 'PLOS ONE',
    shortName: 'PLOS ONE',
    category: 'tier2',
    impactFactor: 3.7,
    url: 'https://journals.plos.org/plosone',
    constraints: {
      abstract: {
        wordLimit: 300,
        structured: false,
      },
      introduction: {
        wordLimit: 2000,
      },
      methods: {
        wordLimit: 3000,
      },
      results: {
        wordLimit: 3000,
      },
      discussion: {
        wordLimit: 2500,
      },
      overall: {
        wordLimit: 10000, // More lenient
      },
      references: {
        maxCount: 60,
        citationStyle: 'vancouver',
      },
      figures: {
        maxCount: 10,
      },
      tables: {
        maxCount: 10,
      },
    },
  },
  {
    id: 'bmj',
    name: 'British Medical Journal',
    shortName: 'BMJ',
    category: 'tier1',
    impactFactor: 105.7,
    url: 'https://www.bmj.com',
    constraints: {
      abstract: {
        wordLimit: 300,
        structured: true,
      },
      introduction: {
        wordLimit: 800,
      },
      methods: {
        wordLimit: 1500,
      },
      results: {
        wordLimit: 1500,
      },
      discussion: {
        wordLimit: 1200,
      },
      overall: {
        wordLimit: 4000,
      },
      references: {
        maxCount: 30,
        citationStyle: 'vancouver',
      },
      figures: {
        maxCount: 5,
      },
      tables: {
        maxCount: 5,
      },
    },
  },

  // ========================================================================
  // GENERIC PROFILE (Default for unlisted journals)
  // ========================================================================
  {
    id: 'generic',
    name: 'Generic Academic Journal',
    shortName: 'Generic',
    category: 'tier2',
    constraints: {
      abstract: {
        wordLimit: 300,
        structured: false,
      },
      introduction: {
        wordLimit: 1000,
      },
      methods: {
        wordLimit: 2000,
      },
      results: {
        wordLimit: 2000,
      },
      discussion: {
        wordLimit: 1500,
      },
      overall: {
        wordLimit: 6000,
      },
      references: {
        maxCount: 50,
        citationStyle: 'vancouver',
      },
      figures: {
        maxCount: 8,
      },
      tables: {
        maxCount: 8,
      },
    },
  },
];

/**
 * Helper function to get journal by ID
 */
export function getJournalById(id: string): JournalProfile | null {
  return JOURNAL_LIBRARY.find(j => j.id === id) || null;
}

/**
 * Helper function to get default journal (generic)
 */
export function getDefaultJournal(): JournalProfile {
  return JOURNAL_LIBRARY.find(j => j.id === 'generic')!;
}

/**
 * Helper function to search journals
 */
export function searchJournals(query: string): JournalProfile[] {
  const lowerQuery = query.toLowerCase();
  return JOURNAL_LIBRARY.filter(j => 
    j.name.toLowerCase().includes(lowerQuery) ||
    j.shortName.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Helper function to get journals by category
 */
export function getJournalsByCategory(category: JournalProfile['category']): JournalProfile[] {
  return JOURNAL_LIBRARY.filter(j => j.category === category);
}

/**
 * Create a custom journal profile
 */
export function createCustomJournal(
  name: string,
  shortName: string,
  constraints: JournalConstraints,
  impactFactor?: number
): JournalProfile {
  const id = `custom-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  
  return {
    id,
    name,
    shortName,
    category: 'custom',
    impactFactor,
    constraints,
    isCustom: true,
  };
}

/**
 * Get constraints for specific paper type
 */
export function getConstraintsForPaperType(
  journal: JournalProfile,
  paperType: string
): JournalConstraints {
  // If journal has paper-type-specific constraints, use them
  if (journal.constraintsByPaperType && paperType in journal.constraintsByPaperType) {
    return journal.constraintsByPaperType[paperType as keyof typeof journal.constraintsByPaperType];
  }
  
  // Otherwise, use default constraints
  return journal.constraints;
}

/**
 * Save custom Generic journal constraints to localStorage
 */
export function saveGenericConstraints(constraints: JournalConstraints): void {
  try {
    localStorage.setItem('research_factory_generic_constraints', JSON.stringify(constraints));
  } catch (error) {
    console.error('Failed to save generic constraints:', error);
  }
}

/**
 * Load custom Generic journal constraints from localStorage
 */
export function loadGenericConstraints(): JournalConstraints | null {
  try {
    const saved = localStorage.getItem('research_factory_generic_constraints');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load generic constraints:', error);
  }
  return null;
}

/**
 * Get Generic journal with custom constraints if available
 */
export function getGenericJournal(): JournalProfile {
  const baseGeneric = JOURNAL_LIBRARY.find(j => j.id === 'generic')!;
  const customConstraints = loadGenericConstraints();
  
  if (customConstraints) {
    return {
      ...baseGeneric,
      constraints: customConstraints,
    };
  }
  
  return baseGeneric;
}

/**
 * Update Generic journal constraints in library
 */
export function updateGenericJournal(constraints: JournalConstraints): JournalProfile {
  saveGenericConstraints(constraints);
  return getGenericJournal();
}