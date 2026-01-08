// Generic Validation Engine - Reusable across all personas

import type { 
  ValidationRule, 
  ValidationContext, 
  ValidationResult, 
  ValidationIssue,
  PersonaId 
} from './personaTypes';

export class ValidationEngine {
  private rules: Map<string, ValidationRule> = new Map();

  // Register a validation rule
  registerRule(rule: ValidationRule): void {
    this.rules.set(rule.id, rule);
  }

  // Register multiple rules
  registerRules(rules: ValidationRule[]): void {
    rules.forEach(rule => this.registerRule(rule));
  }

  // Get rule by ID
  getRule(ruleId: string): ValidationRule | undefined {
    return this.rules.get(ruleId);
  }

  // Get all rules for a persona
  getRulesForPersona(personaId: PersonaId): ValidationRule[] {
    return Array.from(this.rules.values()).filter(
      rule => rule.personaId === personaId
    );
  }

  // Execute validation for a specific persona
  validateForPersona(
    personaId: PersonaId,
    context: ValidationContext,
    ruleIds?: string[]
  ): ValidationResult {
    const startTime = Date.now();
    const allIssues: ValidationIssue[] = [];

    // Get rules to execute
    let rulesToRun: ValidationRule[];
    if (ruleIds) {
      rulesToRun = ruleIds
        .map(id => this.rules.get(id))
        .filter((rule): rule is ValidationRule => rule !== undefined);
    } else {
      rulesToRun = this.getRulesForPersona(personaId);
    }

    // Filter rules by study type if specified
    if (context.studyDesign?.type) {
      rulesToRun = rulesToRun.filter(rule => {
        if (!rule.applicableStudyTypes) return true;
        return rule.applicableStudyTypes.includes(context.studyDesign!.type);
      });
    }

    // Filter rules by regulatory framework if specified
    if (context.regulatoryFrameworks && context.regulatoryFrameworks.length > 0) {
      rulesToRun = rulesToRun.filter(rule => {
        if (!rule.regulatoryFrameworks) return true;
        return rule.regulatoryFrameworks.some(framework =>
          context.regulatoryFrameworks!.includes(framework)
        );
      });
    }

    // Execute each rule
    rulesToRun.forEach(rule => {
      try {
        const issues = rule.check(context);
        allIssues.push(...issues);
      } catch (error) {
        console.error(`Validation rule ${rule.id} failed:`, error);
        
        // Add error issue
        allIssues.push({
          id: `error-${rule.id}`,
          personaId,
          severity: 'warning',
          category: 'regulatory',
          title: 'Validation Rule Error',
          description: `Rule "${rule.name}" encountered an error during execution`,
          recommendation: 'Please report this issue to support',
          location: { module: 'system' }
        });
      }
    });

    // Count by severity
    const criticalCount = allIssues.filter(i => i.severity === 'critical').length;
    const warningCount = allIssues.filter(i => i.severity === 'warning').length;
    const infoCount = allIssues.filter(i => i.severity === 'info').length;
    const successCount = allIssues.filter(i => i.severity === 'success').length;

    // Calculate compliance score (100 = perfect)
    const maxScore = 100;
    const criticalPenalty = 15;
    const warningPenalty = 5;
    const infoPenalty = 1;

    const complianceScore = Math.max(
      0,
      maxScore - 
        (criticalCount * criticalPenalty) - 
        (warningCount * warningPenalty) - 
        (infoCount * infoPenalty)
    );

    // Determine if can proceed
    const canProceed = criticalCount === 0;

    // Generate blocked reasons
    const blockedReasons: string[] = [];
    if (criticalCount > 0) {
      blockedReasons.push(
        `${criticalCount} critical issue${criticalCount > 1 ? 's' : ''} must be resolved`
      );
    }

    const executionTime = Date.now() - startTime;

    return {
      personaId,
      timestamp: new Date().toISOString(),
      issues: allIssues,
      criticalCount,
      warningCount,
      infoCount,
      successCount,
      totalIssues: allIssues.length - successCount, // Don't count success as issues
      complianceScore,
      canProceed,
      blockedReasons,
      executionTime
    };
  }

  // Execute validation for multiple personas
  validateAll(
    personaIds: PersonaId[],
    context: ValidationContext
  ): Record<PersonaId, ValidationResult> {
    const results: Record<string, ValidationResult> = {};

    personaIds.forEach(personaId => {
      results[personaId] = this.validateForPersona(personaId, context);
    });

    return results as Record<PersonaId, ValidationResult>;
  }

  // Get quick validation status (for real-time indicators)
  getQuickStatus(
    personaId: PersonaId,
    context: ValidationContext
  ): 'pass' | 'warning' | 'error' | 'unknown' {
    try {
      // Run only critical rules for performance
      const criticalRules = this.getRulesForPersona(personaId).filter(
        rule => rule.severity === 'critical'
      );

      const issues: ValidationIssue[] = [];
      criticalRules.forEach(rule => {
        try {
          const ruleIssues = rule.check(context);
          issues.push(...ruleIssues);
        } catch (error) {
          // Ignore errors in quick validation
        }
      });

      const hasCritical = issues.some(i => i.severity === 'critical');
      const hasWarning = issues.some(i => i.severity === 'warning');

      if (hasCritical) return 'error';
      if (hasWarning) return 'warning';
      return 'pass';
    } catch (error) {
      return 'unknown';
    }
  }

  // Clear all rules (useful for testing)
  clearRules(): void {
    this.rules.clear();
  }

  // Get summary statistics
  getRuleSummary(): {
    totalRules: number;
    byPersona: Record<PersonaId, number>;
    bySeverity: Record<string, number>;
    byCategory: Record<string, number>;
  } {
    const allRules = Array.from(this.rules.values());

    const byPersona: Record<string, number> = {};
    const bySeverity: Record<string, number> = {};
    const byCategory: Record<string, number> = {};

    allRules.forEach(rule => {
      // Count by persona
      byPersona[rule.personaId] = (byPersona[rule.personaId] || 0) + 1;

      // Count by severity
      bySeverity[rule.severity] = (bySeverity[rule.severity] || 0) + 1;

      // Count by category
      byCategory[rule.category] = (byCategory[rule.category] || 0) + 1;
    });

    return {
      totalRules: allRules.length,
      byPersona: byPersona as Record<PersonaId, number>,
      bySeverity,
      byCategory
    };
  }
}

// Global validation engine instance
export const globalValidationEngine = new ValidationEngine();

// Helper function to batch validate with debouncing
export function createDebouncedValidator(
  engine: ValidationEngine,
  personaId: PersonaId,
  delay: number = 500
) {
  let timeoutId: NodeJS.Timeout | null = null;

  return (
    context: ValidationContext,
    callback: (result: ValidationResult) => void
  ) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      const result = engine.validateForPersona(personaId, context);
      callback(result);
    }, delay);
  };
}

// Helper function to validate with caching
export class CachedValidationEngine {
  private engine: ValidationEngine;
  private cache: Map<string, { result: ValidationResult; timestamp: number }> = new Map();
  private cacheTTL: number; // milliseconds

  constructor(engine: ValidationEngine, cacheTTL: number = 5000) {
    this.engine = engine;
    this.cacheTTL = cacheTTL;
  }

  validate(
    personaId: PersonaId,
    context: ValidationContext,
    cacheKey?: string
  ): ValidationResult {
    const key = cacheKey || this.generateCacheKey(personaId, context);

    // Check cache
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.result;
    }

    // Run validation
    const result = this.engine.validateForPersona(personaId, context);

    // Store in cache
    this.cache.set(key, {
      result,
      timestamp: Date.now()
    });

    return result;
  }

  private generateCacheKey(personaId: PersonaId, context: ValidationContext): string {
    // Create a simple hash of the context
    const contextStr = JSON.stringify({
      personaId,
      studyType: context.studyDesign?.type,
      blockCount: context.schemaBlocks?.length,
      recordCount: context.records?.length,
      protocolVersion: context.protocolMetadata?.versionId
    });

    return btoa(contextStr); // Base64 encode for key
  }

  clearCache(): void {
    this.cache.clear();
  }

  clearExpiredCache(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((value, key) => {
      if (now - value.timestamp > this.cacheTTL) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));
  }
}
