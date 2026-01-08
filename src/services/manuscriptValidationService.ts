// Manuscript Validation Service
// Separates mechanical validation (all modes) from AI-driven validation (co-pilot/autopilot only)

import type { ManuscriptManifest } from '../types/manuscript';

export type AIMode = 'manual' | 'co-pilot' | 'autopilot';

export interface ValidationIssue {
  type: 'citation-format' | 'word-budget' | 'journal-compliance' | 'reference-limit' | 'ethics-disclosure' | 'statistical-claim';
  severity: 'error' | 'warning' | 'info';
  section: string;
  message: string;
  line?: number;
  suggestion?: string;
}

export interface ValidationResult {
  mechanicalIssues: ValidationIssue[]; // Always run (all modes)
  aiSupervisionIssues: ValidationIssue[]; // Only in co-pilot/autopilot
  totalIssues: number;
  criticalCount: number;
  warningCount: number;
  passed: boolean;
  timestamp: number;
}

class ManuscriptValidationService {
  /**
   * Run validation based on AI mode
   * @param manuscript - The manuscript to validate
   * @param aiMode - Current AI mode
   * @param journalId - Selected journal profile (optional)
   * @param citationStyle - Citation style (vancouver, apa, etc.)
   */
  async validateManuscript(
    manuscript: ManuscriptManifest,
    aiMode: AIMode = 'manual',
    journalId?: string,
    citationStyle: string = 'vancouver'
  ): Promise<ValidationResult> {
    // Always run mechanical checks (all modes)
    const mechanicalIssues = await this.runMechanicalChecks(manuscript, journalId, citationStyle);

    // Only run AI supervision checks in co-pilot/autopilot modes
    const aiSupervisionIssues =
      aiMode === 'manual' ? [] : await this.runAISupervisionChecks(manuscript);

    const allIssues = [...mechanicalIssues, ...aiSupervisionIssues];
    const totalIssues = allIssues.length;
    const criticalCount = allIssues.filter(i => i.severity === 'error').length;
    const warningCount = allIssues.filter(i => i.severity === 'warning').length;

    return {
      mechanicalIssues,
      aiSupervisionIssues,
      totalIssues,
      criticalCount,
      warningCount,
      passed: mechanicalIssues.filter(i => i.severity === 'error').length === 0,
      timestamp: Date.now(),
    };
  }

  /**
   * Mechanical checks - Run in ALL modes (manual, co-pilot, autopilot)
   * These are format/structural validation, not AI-driven
   */
  private async runMechanicalChecks(
    manuscript: ManuscriptManifest,
    journalId?: string,
    citationStyle: string = 'vancouver'
  ): Promise<ValidationIssue[]> {
    const issues: ValidationIssue[] = [];

    // 1. Citation format compliance
    issues.push(...this.validateCitationFormat(manuscript, citationStyle));

    // 2. Word budget adherence
    issues.push(...this.validateWordBudget(manuscript, journalId));

    // 3. Journal-specific requirements
    if (journalId) {
      issues.push(...this.validateJournalRequirements(manuscript, journalId));
    }

    // 4. Ethics disclosure completeness
    issues.push(...this.validateEthicsDisclosure(manuscript));

    // 5. Reference count limits
    issues.push(...this.validateReferenceCount(manuscript, journalId));

    return issues;
  }

  /**
   * AI Supervision checks - ONLY run in co-pilot/autopilot modes
   * These require AI analysis of claims vs data
   */
  private async runAISupervisionChecks(manuscript: ManuscriptManifest): Promise<ValidationIssue[]> {
    const issues: ValidationIssue[] = [];

    // Statistical claim verification happens via the existing verificationService
    // This is a placeholder for real-time passive monitoring
    // The actual deep check is triggered by "Run Logic Check" button

    return issues;
  }

  /**
   * Citation format validation (ALL MODES)
   */
  private validateCitationFormat(
    manuscript: ManuscriptManifest,
    citationStyle: string
  ): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const content = Object.values(manuscript.manuscriptContent).join(' ');

    // Check for malformed citations
    const citationPattern = citationStyle === 'vancouver' ? /\[\d+\]/g : /\([A-Za-z]+,?\s*\d{4}\)/g;
    const citations = content.match(citationPattern) || [];

    // Check for orphaned citations (citation without reference)
    const references = manuscript.bibliography?.entries || [];
    if (citations.length > references.length) {
      issues.push({
        type: 'citation-format',
        severity: 'warning',
        section: 'bibliography',
        message: `${citations.length} citations found but only ${references.length} references listed`,
        suggestion: 'Ensure all citations have corresponding bibliography entries',
      });
    }

    return issues;
  }

  /**
   * Word budget validation (ALL MODES)
   */
  private validateWordBudget(
    manuscript: ManuscriptManifest,
    journalId?: string
  ): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // Default limits (can be overridden by journal profile)
    const limits: Record<string, number> = {
      abstract: 250,
      introduction: 800,
      methods: 1500,
      results: 1500,
      discussion: 1200,
      conclusion: 400,
    };

    // Check each section
    Object.entries(manuscript.manuscriptContent).forEach(([section, content]) => {
      const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
      const limit = limits[section];

      if (limit && wordCount > limit) {
        issues.push({
          type: 'word-budget',
          severity: 'warning',
          section,
          message: `${section.charAt(0).toUpperCase() + section.slice(1)} exceeds word limit: ${wordCount}/${limit} words`,
          suggestion: `Reduce by ${wordCount - limit} words`,
        });
      }
    });

    return issues;
  }

  /**
   * Journal-specific requirements (ALL MODES)
   */
  private validateJournalRequirements(
    manuscript: ManuscriptManifest,
    journalId: string
  ): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // Journal-specific validation would go here
    // For now, placeholder logic

    return issues;
  }

  /**
   * Ethics disclosure validation (ALL MODES)
   */
  private validateEthicsDisclosure(manuscript: ManuscriptManifest): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    const methodsText = manuscript.manuscriptContent.methods?.toLowerCase() || '';

    // Check for required ethics statements
    const requiredElements = [
      { keyword: 'ethics', label: 'Ethics approval' },
      { keyword: 'consent', label: 'Informed consent' },
      { keyword: 'institutional review board', label: 'IRB approval' },
    ];

    requiredElements.forEach(element => {
      if (!methodsText.includes(element.keyword.toLowerCase())) {
        issues.push({
          type: 'ethics-disclosure',
          severity: 'warning',
          section: 'methods',
          message: `Missing ${element.label} statement`,
          suggestion: `Add ${element.label} information to Methods section`,
        });
      }
    });

    return issues;
  }

  /**
   * Reference count limits (ALL MODES)
   */
  private validateReferenceCount(
    manuscript: ManuscriptManifest,
    journalId?: string
  ): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    const referenceCount = manuscript.bibliography?.entries?.length || 0;
    const maxReferences = 50; // Default, can be overridden by journal profile

    if (referenceCount > maxReferences) {
      issues.push({
        type: 'reference-limit',
        severity: 'warning',
        section: 'bibliography',
        message: `Reference count exceeds limit: ${referenceCount}/${maxReferences}`,
        suggestion: `Reduce references by ${referenceCount - maxReferences}`,
      });
    }

    return issues;
  }

  /**
   * Get validation summary for display
   */
  getValidationSummary(result: ValidationResult, aiMode: AIMode): string {
    const lines: string[] = [];

    lines.push(`Validation Summary (${aiMode.toUpperCase()} mode):`);
    lines.push(`  Mechanical checks: ${result.mechanicalIssues.length} issues`);

    if (aiMode !== 'manual') {
      lines.push(`  AI supervision checks: ${result.aiSupervisionIssues.length} issues`);
    } else {
      lines.push(`  AI supervision checks: disabled in manual mode`);
    }

    lines.push(`  Total: ${result.totalIssues} issues`);
    lines.push(`  Status: ${result.passed ? '✅ PASSED' : '⚠️ WARNINGS FOUND'}`);

    return lines.join('\n');
  }
}

export const manuscriptValidationService = new ManuscriptValidationService();