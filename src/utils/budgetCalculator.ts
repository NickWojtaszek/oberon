/**
 * Budget Calculator Utilities
 * Research Factory - Journal Constraint Enforcement
 */

import type { JournalProfile, ManuscriptBudget, BudgetStatus } from '../types/accountability';

/**
 * Count words in a text string
 */
export function countWords(text: string): number {
  if (!text || text.trim().length === 0) return 0;
  
  // Remove HTML tags if present
  const strippedText = text.replace(/<[^>]*>/g, '');
  
  // Split by whitespace and filter out empty strings
  const words = strippedText.trim().split(/\s+/).filter(word => word.length > 0);
  
  return words.length;
}

/**
 * Extract section content from markdown/text
 * Assumes sections are marked with ## headers
 */
export function extractSections(content: string): Record<string, string> {
  const sections: Record<string, string> = {
    abstract: '',
    introduction: '',
    methods: '',
    results: '',
    discussion: '',
  };

  // Split content by ## headers
  const lines = content.split('\n');
  let currentSection: string | null = null;
  let currentContent: string[] = [];

  lines.forEach(line => {
    const headerMatch = line.match(/^##\s+(.+)/i);
    
    if (headerMatch) {
      // Save previous section
      if (currentSection && currentContent.length > 0) {
        sections[currentSection] = currentContent.join('\n').trim();
      }
      
      // Start new section
      const headerText = headerMatch[1].toLowerCase();
      if (headerText.includes('abstract')) {
        currentSection = 'abstract';
      } else if (headerText.includes('introduction')) {
        currentSection = 'introduction';
      } else if (headerText.includes('method')) {
        currentSection = 'methods';
      } else if (headerText.includes('result')) {
        currentSection = 'results';
      } else if (headerText.includes('discussion')) {
        currentSection = 'discussion';
      } else {
        currentSection = null;
      }
      currentContent = [];
    } else if (currentSection) {
      currentContent.push(line);
    }
  });

  // Save last section
  if (currentSection && currentContent.length > 0) {
    sections[currentSection] = currentContent.join('\n').trim();
  }

  return sections;
}

/**
 * Calculate budget status for a section
 */
export function calculateBudgetStatus(
  current: number,
  limit: number
): BudgetStatus['status'] {
  const percentage = (current / limit) * 100;
  
  if (current > limit) return 'exceeded';
  if (percentage >= 90) return 'warning';
  return 'ok';
}

/**
 * Count references in text
 * Looks for [1], [2], etc. or superscript numbers
 */
export function countReferences(text: string): number {
  // Match [1], [2], etc.
  const bracketRefs = text.match(/\[\d+\]/g) || [];
  
  // Get unique reference numbers
  const uniqueRefs = new Set(
    bracketRefs.map(ref => ref.match(/\d+/)?.[0]).filter(Boolean)
  );
  
  return uniqueRefs.size;
}

/**
 * Count figures in text
 * Looks for "Figure 1", "Fig. 1", etc.
 */
export function countFigures(text: string): number {
  const figureRefs = text.match(/(?:Figure|Fig\.?)\s+\d+/gi) || [];
  
  const uniqueFigures = new Set(
    figureRefs.map(ref => ref.match(/\d+/)?.[0]).filter(Boolean)
  );
  
  return uniqueFigures.size;
}

/**
 * Count tables in text
 * Looks for "Table 1", etc.
 */
export function countTables(text: string): number {
  const tableRefs = text.match(/Table\s+\d+/gi) || [];
  
  const uniqueTables = new Set(
    tableRefs.map(ref => ref.match(/\d+/)?.[0]).filter(Boolean)
  );
  
  return uniqueTables.size;
}

/**
 * Calculate complete manuscript budget based on journal profile
 */
export function calculateManuscriptBudget(
  content: string,
  journal: JournalProfile
): ManuscriptBudget {
  const sections = extractSections(content);
  
  // Calculate word counts for each section
  const wordCounts = {
    abstract: countWords(sections.abstract),
    introduction: countWords(sections.introduction),
    methods: countWords(sections.methods),
    results: countWords(sections.results),
    discussion: countWords(sections.discussion),
  };

  // Overall word count
  const overallWords = Object.values(wordCounts).reduce((sum, count) => sum + count, 0);

  // Build section budgets
  const sectionBudgets: BudgetStatus[] = [
    {
      section: 'Abstract',
      current: wordCounts.abstract,
      limit: journal.constraints.abstract.wordLimit,
      percentage: (wordCounts.abstract / journal.constraints.abstract.wordLimit) * 100,
      status: calculateBudgetStatus(wordCounts.abstract, journal.constraints.abstract.wordLimit),
    },
    {
      section: 'Introduction',
      current: wordCounts.introduction,
      limit: journal.constraints.introduction.wordLimit,
      percentage: (wordCounts.introduction / journal.constraints.introduction.wordLimit) * 100,
      status: calculateBudgetStatus(wordCounts.introduction, journal.constraints.introduction.wordLimit),
    },
    {
      section: 'Methods',
      current: wordCounts.methods,
      limit: journal.constraints.methods.wordLimit,
      percentage: (wordCounts.methods / journal.constraints.methods.wordLimit) * 100,
      status: calculateBudgetStatus(wordCounts.methods, journal.constraints.methods.wordLimit),
    },
    {
      section: 'Results',
      current: wordCounts.results,
      limit: journal.constraints.results.wordLimit,
      percentage: (wordCounts.results / journal.constraints.results.wordLimit) * 100,
      status: calculateBudgetStatus(wordCounts.results, journal.constraints.results.wordLimit),
    },
    {
      section: 'Discussion',
      current: wordCounts.discussion,
      limit: journal.constraints.discussion.wordLimit,
      percentage: (wordCounts.discussion / journal.constraints.discussion.wordLimit) * 100,
      status: calculateBudgetStatus(wordCounts.discussion, journal.constraints.discussion.wordLimit),
    },
  ];

  // Count references, figures, tables
  const refCount = countReferences(content);
  const figCount = countFigures(content);
  const tableCount = countTables(content);

  // Calculate statuses for references, figures, tables
  const refStatus = calculateBudgetStatus(refCount, journal.constraints.references.maxCount);
  const figStatus = calculateBudgetStatus(figCount, journal.constraints.figures.maxCount);
  const tableStatus = calculateBudgetStatus(tableCount, journal.constraints.tables.maxCount);

  // Build complete budget
  const budget: ManuscriptBudget = {
    journal: journal.shortName,
    sections: sectionBudgets,
    references: {
      current: refCount,
      limit: journal.constraints.references.maxCount,
      status: refStatus,
    },
    figures: {
      current: figCount,
      limit: journal.constraints.figures.maxCount,
      status: figStatus,
    },
    tables: {
      current: tableCount,
      limit: journal.constraints.tables.maxCount,
      status: tableStatus,
    },
    overallCompliance: 
      sectionBudgets.every(s => s.status !== 'exceeded') &&
      refStatus !== 'exceeded' &&
      figStatus !== 'exceeded' &&
      tableStatus !== 'exceeded',
  };

  return budget;
}

/**
 * Get color classes for budget status
 */
export function getBudgetStatusColor(status: BudgetStatus['status']): {
  text: string;
  bg: string;
  border: string;
} {
  switch (status) {
    case 'exceeded':
      return {
        text: 'text-red-600',
        bg: 'bg-red-50',
        border: 'border-red-200',
      };
    case 'warning':
      return {
        text: 'text-amber-600',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
      };
    case 'ok':
    default:
      return {
        text: 'text-green-600',
        bg: 'bg-green-50',
        border: 'border-green-200',
      };
  }
}