// Journal Rules Library - Pre-configured journal constraints

import type { JournalProfile } from '../types/journalProfile';

export const JOURNAL_PROFILES: Record<string, JournalProfile> = {
  'jvs': {
    id: 'jvs',
    name: 'Journal of Vascular Surgery',
    abbreviation: 'JVS',
    wordLimits: {
      title: 150,
      abstract: 250,
      introduction: 500,
      methods: 1000,
      results: 1500,
      discussion: 1500,
      conclusion: 300,
      totalMain: 3500
    },
    citationLimit: 50,
    citationStyle: 'vancouver',
    requiredSections: ['introduction', 'methods', 'results', 'discussion', 'conclusion'],
    allowSubsections: true,
    requireKeywords: true,
    keywordLimit: 6,
    impactFactor: 4.3,
    specialty: 'Vascular Surgery',
    website: 'https://www.jvascsurg.org'
  },
  
  'nejm': {
    id: 'nejm',
    name: 'New England Journal of Medicine',
    abbreviation: 'NEJM',
    wordLimits: {
      title: 120,
      abstract: 300,
      introduction: 500,
      methods: 800,
      results: 1200,
      discussion: 1000,
      conclusion: 200,
      totalMain: 3000
    },
    citationLimit: 40,
    citationStyle: 'vancouver',
    requiredSections: ['introduction', 'methods', 'results', 'discussion'],
    optionalSections: ['conclusion'],
    allowSubsections: false,
    requireKeywords: false,
    impactFactor: 176.1,
    specialty: 'General Medicine',
    website: 'https://www.nejm.org'
  },
  
  'lancet': {
    id: 'lancet',
    name: 'The Lancet',
    abbreviation: 'Lancet',
    wordLimits: {
      title: 150,
      abstract: 300,
      introduction: 600,
      methods: 1000,
      results: 1500,
      discussion: 1200,
      conclusion: 300,
      totalMain: 4000
    },
    citationLimit: 30,
    citationStyle: 'vancouver',
    requiredSections: ['introduction', 'methods', 'results', 'discussion', 'conclusion'],
    allowSubsections: true,
    requireKeywords: true,
    keywordLimit: 5,
    impactFactor: 202.7,
    specialty: 'General Medicine',
    website: 'https://www.thelancet.com'
  },
  
  'jama': {
    id: 'jama',
    name: 'JAMA (Journal of the American Medical Association)',
    abbreviation: 'JAMA',
    wordLimits: {
      title: 100,
      abstract: 350,
      introduction: 400,
      methods: 1000,
      results: 1500,
      discussion: 1200,
      conclusion: 250,
      totalMain: 3500
    },
    citationLimit: 50,
    citationStyle: 'ama',
    requiredSections: ['introduction', 'methods', 'results', 'discussion', 'conclusion'],
    allowSubsections: true,
    requireKeywords: true,
    keywordLimit: 6,
    impactFactor: 157.3,
    specialty: 'General Medicine',
    website: 'https://jamanetwork.com'
  },
  
  'annals_surgery': {
    id: 'annals_surgery',
    name: 'Annals of Surgery',
    abbreviation: 'Ann Surg',
    wordLimits: {
      title: 120,
      abstract: 250,
      introduction: 600,
      methods: 1200,
      results: 1500,
      discussion: 1500,
      conclusion: 300,
      totalMain: 4000
    },
    citationLimit: 60,
    citationStyle: 'vancouver',
    requiredSections: ['introduction', 'methods', 'results', 'discussion'],
    optionalSections: ['conclusion'],
    allowSubsections: true,
    requireKeywords: true,
    keywordLimit: 8,
    impactFactor: 13.9,
    specialty: 'Surgery',
    website: 'https://journals.lww.com/annalsofsurgery'
  },
  
  'nature': {
    id: 'nature',
    name: 'Nature',
    abbreviation: 'Nature',
    wordLimits: {
      title: 90,
      abstract: 200,
      introduction: 500,
      methods: 800,
      results: 1000,
      discussion: 800,
      conclusion: 200,
      totalMain: 2500
    },
    citationLimit: 30,
    citationStyle: 'nature',
    requiredSections: ['introduction', 'results', 'discussion', 'methods'],
    allowSubsections: false,
    requireKeywords: false,
    impactFactor: 69.5,
    specialty: 'Multidisciplinary',
    website: 'https://www.nature.com'
  },
  
  'bmj': {
    id: 'bmj',
    name: 'British Medical Journal',
    abbreviation: 'BMJ',
    wordLimits: {
      title: 150,
      abstract: 300,
      introduction: 500,
      methods: 1000,
      results: 1200,
      discussion: 1000,
      conclusion: 300,
      totalMain: 3500
    },
    citationLimit: 40,
    citationStyle: 'vancouver',
    requiredSections: ['introduction', 'methods', 'results', 'discussion', 'conclusion'],
    allowSubsections: true,
    requireKeywords: true,
    keywordLimit: 5,
    impactFactor: 105.7,
    specialty: 'General Medicine',
    website: 'https://www.bmj.com'
  },
  
  'circulation': {
    id: 'circulation',
    name: 'Circulation',
    abbreviation: 'Circulation',
    wordLimits: {
      title: 150,
      abstract: 250,
      introduction: 600,
      methods: 1200,
      results: 1500,
      discussion: 1500,
      conclusion: 300,
      totalMain: 4000
    },
    citationLimit: 50,
    citationStyle: 'ama',
    requiredSections: ['introduction', 'methods', 'results', 'discussion', 'conclusion'],
    optionalSections: ['limitations'],
    allowSubsections: true,
    requireKeywords: true,
    keywordLimit: 6,
    impactFactor: 37.8,
    specialty: 'Cardiology',
    website: 'https://www.ahajournals.org/journal/circ'
  },
  
  'generic': {
    id: 'generic',
    name: 'Generic Medical Journal',
    abbreviation: 'Generic',
    wordLimits: {
      title: 150,
      abstract: 250,
      introduction: 800,
      methods: 1500,
      results: 2000,
      discussion: 2000,
      conclusion: 500,
      totalMain: 5000
    },
    citationLimit: 75,
    citationStyle: 'vancouver',
    requiredSections: ['introduction', 'methods', 'results', 'discussion', 'conclusion'],
    allowSubsections: true,
    requireKeywords: true,
    keywordLimit: 10,
    specialty: 'General',
    website: ''
  }
};

// Get all journal IDs sorted by impact factor
export function getJournalsByImpact(): JournalProfile[] {
  return Object.values(JOURNAL_PROFILES).sort((a, b) => 
    (b.impactFactor || 0) - (a.impactFactor || 0)
  );
}

// Get journals by specialty
export function getJournalsBySpecialty(specialty: string): JournalProfile[] {
  return Object.values(JOURNAL_PROFILES).filter(j => 
    j.specialty.toLowerCase().includes(specialty.toLowerCase())
  );
}

// Get journal by ID
export function getJournalProfile(id: string): JournalProfile | null {
  return JOURNAL_PROFILES[id] || null;
}
