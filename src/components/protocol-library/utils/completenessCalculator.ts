import type { SavedProtocol, ProtocolVersion } from '../../protocol-workbench/types';

export interface ProtocolCompleteness {
  documentComplete: boolean;
  schemaComplete: boolean;
  dependenciesComplete: boolean;
  auditTrailComplete: boolean;
  overallComplete: boolean;
  details: {
    document: {
      requiredFields: string[];
      completedFields: string[];
      percentage: number;
    };
    schema: {
      blocksCount: number;
      variablesCount: number;
      hasMinimumBlocks: boolean;
    };
    dependencies: {
      dependenciesCount: number;
      blocksWithDependencies: number;
      coverage: number;
    };
    auditTrail: {
      versionsCount: number;
      publishedVersions: number;
      hasPublished: boolean;
    };
  };
  missingItems: string[];
}

const REQUIRED_DOCUMENT_FIELDS = [
  'protocolTitle',
  'protocolNumber',
  'principalInvestigator',
  'sponsor'
];

const MINIMUM_SCHEMA_BLOCKS = 5;

export function calculateProtocolCompleteness(
  protocol: SavedProtocol,
  version: ProtocolVersion
): ProtocolCompleteness {
  // 1. Document Completeness
  const requiredFields = REQUIRED_DOCUMENT_FIELDS;
  const completedFields = requiredFields.filter(field => {
    const value = version.metadata[field as keyof typeof version.metadata];
    return value && String(value).trim().length > 0;
  });
  const documentPercentage = Math.round((completedFields.length / requiredFields.length) * 100);
  const documentComplete = documentPercentage === 100;

  // 2. Schema Completeness
  const blocksCount = version.schemaBlocks?.length || 0;
  const variablesCount = version.schemaBlocks?.reduce((count, block) => {
    return count + (block.children?.length || 0) + 1; // +1 for the block itself if it's a variable
  }, 0) || 0;
  const hasMinimumBlocks = blocksCount >= MINIMUM_SCHEMA_BLOCKS;
  const schemaComplete = hasMinimumBlocks;

  // 3. Dependencies Completeness (optional but recommended)
  const blocksWithDependencies = version.schemaBlocks?.filter(
    block => block.conditionalDependencies && block.conditionalDependencies.length > 0
  ).length || 0;
  const dependenciesCount = version.schemaBlocks?.reduce((count, block) => {
    return count + (block.conditionalDependencies?.length || 0);
  }, 0) || 0;
  const dependencyCoverage = blocksCount > 0
    ? Math.round((blocksWithDependencies / blocksCount) * 100)
    : 0;
  // Dependencies are optional - consider complete if ANY exist OR if none are needed
  const dependenciesComplete = dependenciesCount > 0 || blocksCount === 0;

  // 4. Audit Trail Completeness
  const versionsCount = protocol.versions.length;
  const publishedVersions = protocol.versions.filter(v => v.status === 'published').length;
  const hasPublished = publishedVersions > 0;
  // For publishing, we don't need existing published versions (we're creating the first one)
  // So audit trail is complete if we have at least one version
  const auditTrailComplete = versionsCount > 0;

  // Overall completeness
  const overallComplete = documentComplete && schemaComplete && auditTrailComplete;

  // Missing items list
  const missingItems: string[] = [];
  if (!documentComplete) {
    const missing = requiredFields.filter(f => !completedFields.includes(f));
    missingItems.push(`Complete required fields: ${missing.join(', ')}`);
  }
  if (!schemaComplete) {
    missingItems.push(`Add at least ${MINIMUM_SCHEMA_BLOCKS} schema blocks (currently ${blocksCount})`);
  }
  if (!auditTrailComplete) {
    missingItems.push('Create at least one version');
  }

  return {
    documentComplete,
    schemaComplete,
    dependenciesComplete,
    auditTrailComplete,
    overallComplete,
    details: {
      document: {
        requiredFields,
        completedFields,
        percentage: documentPercentage
      },
      schema: {
        blocksCount,
        variablesCount,
        hasMinimumBlocks
      },
      dependencies: {
        dependenciesCount,
        blocksWithDependencies,
        coverage: dependencyCoverage
      },
      auditTrail: {
        versionsCount,
        publishedVersions,
        hasPublished
      }
    },
    missingItems
  };
}

export function getMissingItemsCount(completeness: ProtocolCompleteness): number {
  return completeness.missingItems.length;
}

export function canPublish(completeness: ProtocolCompleteness): boolean {
  return completeness.overallComplete;
}
