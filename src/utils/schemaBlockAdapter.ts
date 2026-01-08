/**
 * Schema Block Type Adapter
 * 
 * PURPOSE: Converts simplified SchemaBlocks (from auto-generation) to full SchemaBlocks
 * (required by Protocol Workbench and Database Generator)
 * 
 * BACKGROUND:
 * - Simplified blocks from /types/shared.ts (Study DNA auto-generation)
 * - Full blocks from /components/protocol-workbench/types.ts (Protocol Workbench)
 * - This adapter ensures compatibility between both systems
 */

import type { SchemaBlock as FullSchemaBlock, Variable, DataType, RoleTag, VariableCategory } from '../components/protocol-workbench/types';
import type { SchemaBlock as SimplifiedSchemaBlock } from '../types/shared';
import { 
  Activity, 
  Heart, 
  Thermometer, 
  Scale, 
  Users, 
  FlaskConical, 
  Pill, 
  Stethoscope,
  FileText,
  Target,
  TrendingUp,
  AlertTriangle,
  CalendarDays,
  MessageSquare
} from 'lucide-react';

/**
 * Type guard to check if a block is simplified format
 */
export function isSimplifiedSchemaBlock(block: any): block is SimplifiedSchemaBlock {
  return (
    block &&
    typeof block === 'object' &&
    'type' in block &&
    'title' in block &&
    !('variable' in block) &&
    !('dataType' in block)
  );
}

/**
 * Type guard to check if a block is full format
 */
export function isFullSchemaBlock(block: any): block is FullSchemaBlock {
  return (
    block &&
    typeof block === 'object' &&
    'variable' in block &&
    'dataType' in block &&
    'role' in block
  );
}

/**
 * Map simplified block type to data type
 */
function mapTypeToDataType(type: string, metadataType?: string): DataType {
  // First check metadata
  if (metadataType) {
    const normalized = metadataType.toLowerCase();
    if (normalized.includes('continuous') || normalized.includes('numeric')) return 'Continuous';
    if (normalized.includes('categorical') || normalized.includes('category')) return 'Categorical';
    if (normalized.includes('boolean') || normalized.includes('yes/no')) return 'Boolean';
    if (normalized.includes('date') || normalized.includes('time')) return 'Date';
    if (normalized.includes('text') || normalized.includes('string')) return 'Text';
    if (normalized.includes('multi')) return 'Multi-Select';
    if (normalized.includes('matrix')) return 'Ranked-Matrix';
    if (normalized.includes('grid')) return 'Categorical-Grid';
  }

  // Fallback to type
  switch (type) {
    case 'section':
      return 'Section';
    case 'endpoint':
      return 'Continuous'; // Most endpoints are numeric measurements
    case 'variable':
      return 'Continuous'; // Default for variables
    case 'text':
      return 'Text';
    case 'matrix':
      return 'Ranked-Matrix';
    case 'categorical':
      return 'Categorical';
    default:
      return 'Text';
  }
}

/**
 * Map simplified block type to role
 */
function mapTypeToRole(type: string, metadataType?: string, metadataTags?: string[]): RoleTag {
  // Check tags first
  if (metadataTags) {
    if (metadataTags.includes('primary') || metadataTags.includes('outcome')) return 'Outcome';
    if (metadataTags.includes('predictor') || metadataTags.includes('treatment')) return 'Predictor';
    if (metadataTags.includes('structural') || metadataTags.includes('section')) return 'Structure';
  }

  // Check type
  switch (type) {
    case 'endpoint':
      return 'Outcome';
    case 'section':
      return 'Structure';
    case 'variable':
      return 'Predictor'; // Most variables are predictors
    default:
      return 'Predictor';
  }
}

/**
 * Map title/description to variable category
 */
function inferCategory(title: string, description?: string, tags?: string[]): VariableCategory {
  const text = `${title} ${description || ''} ${tags?.join(' ') || ''}`.toLowerCase();

  if (text.includes('demographic') || text.includes('age') || text.includes('sex') || text.includes('gender')) 
    return 'Demographics';
  if (text.includes('treatment') || text.includes('intervention') || text.includes('therapy')) 
    return 'Treatments';
  if (text.includes('endpoint') || text.includes('outcome') || text.includes('efficacy')) 
    return 'Endpoints';
  if (text.includes('clinical') || text.includes('diagnosis') || text.includes('disease')) 
    return 'Clinical';
  if (text.includes('laboratory') || text.includes('lab') || text.includes('blood') || text.includes('serum')) 
    return 'Laboratory';
  if (text.includes('vital') || text.includes('blood pressure') || text.includes('heart rate') || text.includes('temperature')) 
    return 'Vitals';
  if (text.includes('safety') || text.includes('adverse') || text.includes('toxicity')) 
    return 'Safety';
  if (text.includes('quality of life') || text.includes('qol') || text.includes('questionnaire')) 
    return 'Quality of Life';
  if (text.includes('history') || text.includes('medical history') || text.includes('past')) 
    return 'Medical History';
  if (text.includes('biomarker') || text.includes('marker')) 
    return 'Biomarkers';
  if (text.includes('imaging') || text.includes('scan') || text.includes('mri') || text.includes('ct')) 
    return 'Imaging';
  if (text.includes('medication') || text.includes('drug') || text.includes('concomitant')) 
    return 'Medications';
  if (text.includes('procedure') || text.includes('surgery') || text.includes('operation')) 
    return 'Procedures';
  if (text.includes('section') || text.includes('header')) 
    return 'Structural';

  return 'Other';
}

/**
 * Get appropriate icon for category
 */
function getCategoryIcon(category: VariableCategory) {
  const iconMap: Record<VariableCategory, any> = {
    'Demographics': Users,
    'Treatments': Pill,
    'Endpoints': Target,
    'Clinical': Stethoscope,
    'Laboratory': FlaskConical,
    'Vitals': Heart,
    'Labs': FlaskConical,
    'Safety': AlertTriangle,
    'Efficacy': TrendingUp,
    'Quality of Life': MessageSquare,
    'Medical History': FileText,
    'Biomarkers': FlaskConical,
    'Imaging': Activity,
    'Medications': Pill,
    'Adverse Events': AlertTriangle,
    'Procedures': Activity,
    'Questionnaires': MessageSquare,
    'Structural': FileText,
    'Other': FileText,
  };

  return iconMap[category] || FileText;
}

/**
 * Convert simplified SchemaBlock to full SchemaBlock
 */
export function convertSimplifiedToFullSchemaBlock(
  simplified: SimplifiedSchemaBlock,
  parentId?: string
): FullSchemaBlock {
  const category = inferCategory(
    simplified.title,
    simplified.description,
    simplified.metadata?.tags
  );

  const dataType = mapTypeToDataType(
    simplified.type,
    simplified.metadata?.dataType
  );

  const role = mapTypeToRole(
    simplified.type,
    simplified.metadata?.dataType,
    simplified.metadata?.tags
  );

  // Create Variable object
  const variable: Variable = {
    id: `var-${simplified.id}`,
    name: simplified.title,
    category,
    icon: getCategoryIcon(category),
    defaultType: dataType,
    isCustom: false,
  };

  // Build full schema block
  const fullBlock: FullSchemaBlock = {
    id: simplified.id,
    variable,
    dataType,
    role,
    unit: undefined,
    minValue: undefined,
    maxValue: undefined,
    options: simplified.categories || undefined,
    children: simplified.children?.map(child => 
      convertSimplifiedToFullSchemaBlock(child, simplified.id)
    ) || [],
    isExpanded: false,
    parentId,
    customName: simplified.title,
    isCustom: false,
  };

  // Handle endpoint tier (primary/secondary)
  if (simplified.type === 'endpoint' && simplified.metadata?.tags) {
    if (simplified.metadata.tags.includes('primary')) {
      fullBlock.endpointTier = 'primary';
      fullBlock.isPrimary = true;
    } else if (simplified.metadata.tags.includes('secondary')) {
      fullBlock.endpointTier = 'secondary';
    } else if (simplified.metadata.tags.includes('exploratory')) {
      fullBlock.endpointTier = 'exploratory';
    }
  }

  // Handle matrix/grid specific fields
  if (simplified.rows) {
    fullBlock.matrixRows = simplified.rows;
  }
  if (simplified.columns && simplified.categories) {
    fullBlock.gridItems = simplified.columns;
    fullBlock.gridCategories = simplified.categories;
  }

  // Add metadata preservation
  if (simplified.metadata) {
    // Store original metadata in a way that doesn't conflict
    if (simplified.metadata.validation) {
      // Extract validation rules if present
      const validation = simplified.metadata.validation;
      if (validation.min !== undefined) fullBlock.minValue = validation.min;
      if (validation.max !== undefined) fullBlock.maxValue = validation.max;
    }
  }

  return fullBlock;
}

/**
 * Batch convert an array of schema blocks
 */
export function convertSchemaBlocks(
  blocks: (SimplifiedSchemaBlock | FullSchemaBlock)[]
): FullSchemaBlock[] {
  return blocks.map(block => {
    if (isFullSchemaBlock(block)) {
      return block; // Already in full format
    }
    if (isSimplifiedSchemaBlock(block)) {
      return convertSimplifiedToFullSchemaBlock(block);
    }
    // Unknown format - log warning and skip
    console.warn('⚠️ Unknown schema block format, skipping:', block);
    return null;
  }).filter((block): block is FullSchemaBlock => block !== null);
}

/**
 * Validate a schema block array
 */
export function validateSchemaBlocks(blocks: any[]): {
  isValid: boolean;
  hasSimplified: boolean;
  hasFull: boolean;
  hasMixed: boolean;
  invalidCount: number;
} {
  let hasSimplified = false;
  let hasFull = false;
  let invalidCount = 0;

  for (const block of blocks) {
    if (isSimplifiedSchemaBlock(block)) {
      hasSimplified = true;
    } else if (isFullSchemaBlock(block)) {
      hasFull = true;
    } else {
      invalidCount++;
    }
  }

  return {
    isValid: invalidCount === 0,
    hasSimplified,
    hasFull,
    hasMixed: hasSimplified && hasFull,
    invalidCount,
  };
}

/**
 * Debug utility: Log schema block format
 */
export function debugSchemaBlockFormat(blocks: any[], label: string = 'Schema Blocks') {
  const validation = validateSchemaBlocks(blocks);
  
  console.group(`🔍 ${label} Format Check`);
  console.log('Total blocks:', blocks.length);
  console.log('Has simplified:', validation.hasSimplified);
  console.log('Has full:', validation.hasFull);
  console.log('Has mixed:', validation.hasMixed);
  console.log('Invalid blocks:', validation.invalidCount);
  console.log('Is valid:', validation.isValid);
  
  if (blocks.length > 0) {
    console.log('Sample block:', blocks[0]);
  }
  
  console.groupEnd();
  
  return validation;
}
