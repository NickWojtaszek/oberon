// AI-Powered Protocol Audit Engine
import type { ProtocolAuditResult, AuditIssue, AuditContext, ValidationRule } from './auditTypes';

// Validation Rules Library
const VALIDATION_RULES: ValidationRule[] = [
  // PROTOCOL TEXT VALIDATION
  {
    id: 'protocol-title-required',
    name: 'Protocol Title Required',
    category: 'protocol-text',
    severity: 'critical',
    description: 'Protocol must have a descriptive title',
    check: (ctx) => {
      if (!ctx.protocolMetadata.title?.trim()) {
        return [{
          id: 'missing-title',
          severity: 'critical',
          category: 'protocol-text',
          title: 'Missing Protocol Title',
          description: 'Protocol title is required for regulatory submission',
          recommendation: 'Add a clear, descriptive protocol title',
          location: { tab: 'protocol', fieldId: 'title', sectionName: 'Protocol Metadata' },
          regulatoryReference: 'ICH E6(R2) 5.1'
        }];
      }
      return [];
    }
  },
  {
    id: 'protocol-objectives-required',
    name: 'Study Objectives Required',
    category: 'protocol-text',
    severity: 'critical',
    description: 'Protocol must define clear study objectives',
    check: (ctx) => {
      const objectives = ctx.protocolContent['Study Objectives']?.trim();
      if (!objectives || objectives.length < 50) {
        return [{
          id: 'missing-objectives',
          severity: 'critical',
          category: 'protocol-text',
          title: 'Insufficient Study Objectives',
          description: 'Study objectives must be clearly defined with sufficient detail',
          recommendation: 'Provide clear primary and secondary objectives aligned with study endpoints',
          location: { tab: 'protocol', fieldId: 'Study Objectives', sectionName: 'Study Objectives' },
          regulatoryReference: 'ICH E6(R2) 5.2'
        }];
      }
      return [];
    }
  },
  {
    id: 'protocol-endpoints-required',
    name: 'Study Endpoints Required',
    category: 'protocol-text',
    severity: 'critical',
    description: 'Protocol must define primary and secondary endpoints',
    check: (ctx) => {
      const endpoints = ctx.protocolContent['Study Endpoints']?.trim();
      if (!endpoints || endpoints.length < 50) {
        return [{
          id: 'missing-endpoints',
          severity: 'critical',
          category: 'protocol-text',
          title: 'Missing or Insufficient Study Endpoints',
          description: 'Study endpoints must be clearly defined and measurable',
          recommendation: 'Define primary endpoint with timepoint, and list all secondary endpoints',
          location: { tab: 'protocol', fieldId: 'Study Endpoints', sectionName: 'Study Endpoints' },
          regulatoryReference: 'ICH E9 2.2.2'
        }];
      }
      return [];
    }
  },

  // SCHEMA VALIDATION
  {
    id: 'schema-empty-check',
    name: 'Schema Must Not Be Empty',
    category: 'schema',
    severity: 'critical',
    description: 'Protocol schema must contain data collection variables',
    check: (ctx) => {
      if (!ctx.schemaBlocks || ctx.schemaBlocks.length === 0) {
        return [{
          id: 'empty-schema',
          severity: 'critical',
          category: 'schema',
          title: 'No Variables in Schema',
          description: 'Protocol schema is empty - no data collection variables defined',
          recommendation: 'Add variables to schema using Schema Builder or AI Generator',
          location: { tab: 'schema', sectionName: 'Schema Builder' },
          regulatoryReference: 'ICH E6(R2) 5.18.3'
        }];
      }
      return [];
    }
  },
  {
    id: 'schema-required-fields',
    name: 'Required Safety Variables Present',
    category: 'schema',
    severity: 'critical',
    description: 'Schema must include mandatory safety variables',
    check: (ctx) => {
      const issues: AuditIssue[] = [];
      const allBlocks = flattenBlocks(ctx.schemaBlocks);
      const variableNames = allBlocks.map(b => b.variable.name.toLowerCase());
      
      // Check for adverse events
      const hasAE = variableNames.some(name => 
        name.includes('adverse') || name.includes('ae') || name.includes('safety')
      );
      
      if (!hasAE) {
        issues.push({
          id: 'missing-ae-variable',
          severity: 'critical',
          category: 'schema',
          title: 'Missing Adverse Event Variables',
          description: 'Schema does not include adverse event data collection',
          recommendation: 'Add adverse event (AE) variables to schema for safety monitoring',
          location: { tab: 'schema', sectionName: 'Schema Builder' },
          regulatoryReference: 'ICH E6(R2) 5.17'
        });
      }
      
      return issues;
    }
  },

  // DEPENDENCY VALIDATION
  {
    id: 'dependency-circular-check',
    name: 'No Circular Dependencies',
    category: 'dependency',
    severity: 'critical',
    description: 'Schema must not contain circular dependency chains',
    check: (ctx) => {
      const issues: AuditIssue[] = [];
      const allBlocks = flattenBlocks(ctx.schemaBlocks);
      
      // Simple circular dependency detection
      allBlocks.forEach(block => {
        if (block.conditionalDependencies && block.conditionalDependencies.length > 0) {
          block.conditionalDependencies.forEach(dep => {
            const targetBlock = allBlocks.find(b => b.id === dep.targetBlockId);
            if (targetBlock?.conditionalDependencies) {
              // Check if target depends back on source
              const hasCircular = targetBlock.conditionalDependencies.some(
                targetDep => targetDep.targetBlockId === block.id
              );
              
              if (hasCircular) {
                issues.push({
                  id: `circular-${block.id}-${targetBlock.id}`,
                  severity: 'critical',
                  category: 'dependency',
                  title: 'Circular Dependency Detected',
                  description: `"${block.variable.name}" and "${targetBlock.variable.name}" have circular dependencies`,
                  recommendation: 'Remove one of the dependency links to break the circular chain',
                  location: { tab: 'dependencies', blockId: block.id },
                  regulatoryReference: 'Data Integrity Standards'
                });
              }
            }
          });
        }
      });
      
      return issues;
    }
  },
  {
    id: 'dependency-safety-hidden',
    name: 'Safety Variables Never Hidden',
    category: 'dependency',
    severity: 'critical',
    description: 'Safety-critical variables must never be hidden by dependencies',
    check: (ctx) => {
      const issues: AuditIssue[] = [];
      const allBlocks = flattenBlocks(ctx.schemaBlocks);
      
      allBlocks.forEach(sourceBlock => {
        if (sourceBlock.conditionalDependencies) {
          sourceBlock.conditionalDependencies.forEach(dep => {
            if (dep.action === 'hide') {
              const targetBlock = allBlocks.find(b => b.id === dep.targetBlockId);
              const targetName = targetBlock?.variable.name.toLowerCase() || '';
              
              // Check if hiding a safety variable
              const isSafetyVar = targetName.includes('adverse') || 
                                 targetName.includes('ae') ||
                                 targetName.includes('safety') ||
                                 targetName.includes('serious');
              
              if (isSafetyVar) {
                issues.push({
                  id: `hidden-safety-${dep.id}`,
                  severity: 'critical',
                  category: 'dependency',
                  title: 'Safety Variable Cannot Be Hidden',
                  description: `Dependency rule hides safety variable "${targetBlock?.variable.name}"`,
                  recommendation: 'Remove "hide" action from safety-critical variables. Use "disable" if needed.',
                  location: { tab: 'dependencies', blockId: sourceBlock.id },
                  regulatoryReference: 'ICH E6(R2) 5.17.1'
                });
              }
            }
          });
        }
      });
      
      return issues;
    }
  },

  // CROSS-VALIDATION (Protocol ↔ Schema)
  {
    id: 'cross-validation-endpoints',
    name: 'Protocol Endpoints Match Schema',
    category: 'cross-validation',
    severity: 'warning',
    description: 'Variables mentioned in endpoints should exist in schema',
    check: (ctx) => {
      const issues: AuditIssue[] = [];
      const endpoints = ctx.protocolContent['Study Endpoints']?.toLowerCase() || '';
      const allBlocks = flattenBlocks(ctx.schemaBlocks);
      const variableNames = allBlocks.map(b => b.variable.name.toLowerCase());
      
      // Common endpoint terms to check
      const endpointTerms = ['response', 'survival', 'progression', 'efficacy', 'mortality'];
      
      endpointTerms.forEach(term => {
        if (endpoints.includes(term)) {
          const hasMatchingVar = variableNames.some(name => name.includes(term));
          if (!hasMatchingVar) {
            issues.push({
              id: `missing-endpoint-var-${term}`,
              severity: 'warning',
              category: 'cross-validation',
              title: `Protocol Mentions "${term}" But No Schema Variable`,
              description: `Protocol endpoints reference "${term}" but no corresponding variable exists in schema`,
              recommendation: `Add a variable to capture ${term} data in Schema Builder`,
              location: { tab: 'schema', sectionName: 'Schema Builder' }
            });
          }
        }
      });
      
      return issues;
    }
  },

  // REGULATORY COMPLIANCE
  {
    id: 'regulatory-informed-consent',
    name: 'Informed Consent Section Required',
    category: 'regulatory',
    severity: 'critical',
    description: 'Protocol must include informed consent procedures',
    check: (ctx) => {
      const consent = ctx.protocolContent['Informed Consent Process']?.trim();
      if (!consent || consent.length < 50) {
        return [{
          id: 'missing-consent',
          severity: 'critical',
          category: 'regulatory',
          title: 'Missing Informed Consent Procedures',
          description: 'Protocol does not adequately describe informed consent process',
          recommendation: 'Add detailed informed consent procedures per ICH-GCP requirements',
          location: { tab: 'protocol', fieldId: 'Informed Consent Process', sectionName: 'Informed Consent Process' },
          regulatoryReference: 'ICH E6(R2) 4.8'
        }];
      }
      return [];
    }
  }
];

// Helper function to flatten nested schema blocks
function flattenBlocks(blocks: any[]): any[] {
  const result: any[] = [];
  for (const block of blocks) {
    result.push(block);
    if (block.children && block.children.length > 0) {
      result.push(...flattenBlocks(block.children));
    }
  }
  return result;
}

// Main Audit Engine
export function runProtocolAudit(context: AuditContext): ProtocolAuditResult {
  const startTime = Date.now();
  
  // Run all validation rules
  const allIssues: AuditIssue[] = [];
  
  VALIDATION_RULES.forEach(rule => {
    try {
      const issues = rule.check(context);
      allIssues.push(...issues);
    } catch (error) {
      console.error(`Validation rule ${rule.id} failed:`, error);
    }
  });
  
  // Categorize issues
  const protocolTextIssues = allIssues.filter(i => i.category === 'protocol-text');
  const schemaIssues = allIssues.filter(i => i.category === 'schema');
  const dependencyIssues = allIssues.filter(i => i.category === 'dependency');
  const crossValidationIssues = allIssues.filter(i => i.category === 'cross-validation');
  const regulatoryIssues = allIssues.filter(i => i.category === 'regulatory');
  
  // Count by severity
  const criticalCount = allIssues.filter(i => i.severity === 'critical').length;
  const warningCount = allIssues.filter(i => i.severity === 'warning').length;
  const infoCount = allIssues.filter(i => i.severity === 'info').length;
  
  // Calculate compliance score (100 = perfect, 0 = many critical issues)
  const maxScore = 100;
  const criticalPenalty = 15;
  const warningPenalty = 5;
  const infoPenalty = 1;
  
  const complianceScore = Math.max(0, 
    maxScore - (criticalCount * criticalPenalty) - (warningCount * warningPenalty) - (infoCount * infoPenalty)
  );
  
  // Determine if can publish
  const canPublish = criticalCount === 0;
  const requiresPIApproval = warningCount > 0 || criticalCount > 0;
  
  // Blocked reasons
  const blockedReasons: string[] = [];
  if (criticalCount > 0) {
    blockedReasons.push(`${criticalCount} critical issue${criticalCount > 1 ? 's' : ''} must be resolved`);
  }
  
  const auditDuration = Date.now() - startTime;
  
  return {
    timestamp: new Date().toISOString(),
    protocolId: context.protocolMetadata.id || '',
    versionId: context.protocolMetadata.versionId || '',
    protocolNumber: context.protocolMetadata.protocolNumber || '',
    
    protocolTextIssues,
    schemaIssues,
    dependencyIssues,
    crossValidationIssues,
    regulatoryIssues,
    
    criticalCount,
    warningCount,
    infoCount,
    totalIssues: allIssues.length,
    complianceScore,
    
    canPublish,
    requiresPIApproval,
    blockedReasons,
    
    auditedBy: 'AI Governance Persona',
    auditDuration
  };
}

// Quick validation for real-time sidebar indicators
export function getQuickValidationStatus(context: Partial<AuditContext>): {
  protocol: 'pass' | 'warning' | 'error';
  schema: 'pass' | 'warning' | 'error';
  dependencies: 'pass' | 'warning' | 'error';
} {
  const issues: AuditIssue[] = [];
  
  // Run subset of critical checks only
  const criticalRules = VALIDATION_RULES.filter(r => r.severity === 'critical');
  
  criticalRules.forEach(rule => {
    try {
      const ruleIssues = rule.check(context as AuditContext);
      issues.push(...ruleIssues);
    } catch (error) {
      // Ignore errors in quick validation
    }
  });
  
  const protocolIssues = issues.filter(i => i.category === 'protocol-text' || i.category === 'regulatory');
  const schemaIssuesArr = issues.filter(i => i.category === 'schema');
  const dependencyIssuesArr = issues.filter(i => i.category === 'dependency');
  
  return {
    protocol: protocolIssues.some(i => i.severity === 'critical') ? 'error' : 
              protocolIssues.length > 0 ? 'warning' : 'pass',
    schema: schemaIssuesArr.some(i => i.severity === 'critical') ? 'error' : 
            schemaIssuesArr.length > 0 ? 'warning' : 'pass',
    dependencies: dependencyIssuesArr.some(i => i.severity === 'critical') ? 'error' : 
                  dependencyIssuesArr.length > 0 ? 'warning' : 'pass'
  };
}
