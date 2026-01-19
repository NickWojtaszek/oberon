import { SchemaBlock, ProtocolVersion } from '../../protocol-workbench/types';
import { convertSchemaBlocks, isSimplifiedSchemaBlock, debugSchemaBlockFormat } from '../../../utils/schemaBlockAdapter';

export interface DatabaseField {
  id: string;
  fieldName: string;
  displayName: string;
  dataType: string;
  sqlType: string;
  isRequired: boolean;
  unit?: string;
  minValue?: number;
  maxValue?: number;
  options?: string[];
  endpointTier?: 'primary' | 'secondary' | 'exploratory' | null;
  category: string;
  status: 'normal' | 'modified' | 'new' | 'deprecated';
  changeDescription?: string;
  versionAdded?: string;
  versionModified?: string;
  versionDeprecated?: string;
  schemaBlockId: string;
}

export interface DatabaseTable {
  tableName: string;
  displayName: string;
  description: string;
  fields: DatabaseField[];
  recordCount: number;
  protocolNumber: string;
  protocolVersion: string;
}

/**
 * Database Structure Notes:
 *
 * LONGITUDINAL DATA SUPPORT:
 * Each table includes base fields for tracking repeated measurements:
 * - subject_id: Unique patient identifier
 * - visit_name: Visit/timepoint (Baseline, Week 4, etc.)
 * - visit_date: When the visit occurred
 * - enrollment_date: When patient entered study
 *
 * The combination of (subject_id + visit_name) forms a composite key
 * allowing multiple records per patient across different timepoints.
 *
 * Example: Patient "001" can have records for:
 * - 001, Baseline, 2024-01-15
 * - 001, Week 4, 2024-02-12
 * - 001, Week 8, 2024-03-11
 */

/**
 * Convert Protocol SchemaBlocks to Database Fields
 */
export function generateDatabaseFields(
  schemaBlocks: SchemaBlock[],
  protocolVersion: string,
  previousVersion?: ProtocolVersion
): DatabaseField[] {
  const fields: DatabaseField[] = [];
  
  const processBlock = (block: SchemaBlock, parentPath: string = '') => {
    const fieldName = parentPath 
      ? `${parentPath}_${block.customName || block.variable.name}`.toLowerCase().replace(/\s+/g, '_')
      : (block.customName || block.variable.name).toLowerCase().replace(/\s+/g, '_');
    
    // Map protocol data types to SQL types
    const getSQLType = (dataType: string): string => {
      switch (dataType) {
        case 'Continuous': return 'FLOAT';
        case 'Categorical': return 'VARCHAR(255)';
        case 'Boolean': return 'BOOLEAN';
        case 'Date': return 'DATE';
        case 'Text': return 'TEXT';
        case 'Multi-Select': return 'JSON';
        case 'Ranked-Matrix': return 'JSON';
        case 'Categorical-Grid': return 'JSON';
        default: return 'VARCHAR(255)';
      }
    };

    // Determine field status by comparing with previous version
    let status: 'normal' | 'modified' | 'new' | 'deprecated' = 'normal';
    let changeDescription: string | undefined;
    
    if (previousVersion) {
      const previousBlock = findBlockInVersion(block.variable.id, previousVersion.schemaBlocks);
      
      if (!previousBlock) {
        status = 'new';
      } else if (
        previousBlock.dataType !== block.dataType ||
        previousBlock.unit !== block.unit ||
        JSON.stringify(previousBlock.options) !== JSON.stringify(block.options)
      ) {
        status = 'modified';
        if (previousBlock.dataType !== block.dataType) {
          changeDescription = `Data type changed from ${previousBlock.dataType} → ${block.dataType}`;
        } else if (previousBlock.unit !== block.unit) {
          changeDescription = `Unit changed from ${previousBlock.unit || 'none'} → ${block.unit || 'none'}`;
        } else {
          changeDescription = `Field configuration updated`;
        }
      }
    }

    const field: DatabaseField = {
      id: block.id,
      fieldName,
      displayName: block.customName || block.variable.name,
      dataType: block.dataType,
      sqlType: getSQLType(block.dataType),
      isRequired: block.endpointTier === 'primary' || block.role === 'Outcome',
      unit: block.unit,
      minValue: block.minValue,
      maxValue: block.maxValue,
      options: block.options,
      endpointTier: block.endpointTier,
      category: block.variable.category,
      status,
      changeDescription,
      versionAdded: status === 'new' ? protocolVersion : undefined,
      versionModified: status === 'modified' ? protocolVersion : undefined,
      schemaBlockId: block.id
    };

    fields.push(field);

    // Process children recursively
    if (block.children && block.children.length > 0) {
      block.children.forEach(child => {
        processBlock(child, fieldName);
      });
    }
  };

  schemaBlocks.forEach(block => processBlock(block));

  return fields;
}

/**
 * Find deprecated fields (exist in previous version but not in current)
 */
export function findDeprecatedFields(
  currentVersion: ProtocolVersion,
  previousVersion: ProtocolVersion
): DatabaseField[] {
  const currentFieldIds = new Set(
    getAllBlockIds(currentVersion.schemaBlocks)
  );
  
  const deprecatedFields: DatabaseField[] = [];
  
  const processBlock = (block: SchemaBlock) => {
    if (!currentFieldIds.has(block.variable.id)) {
      const fieldName = (block.customName || block.variable.name).toLowerCase().replace(/\s+/g, '_');
      
      deprecatedFields.push({
        id: block.id,
        fieldName,
        displayName: block.customName || block.variable.name,
        dataType: block.dataType,
        sqlType: 'VARCHAR(255)',
        isRequired: false,
        unit: block.unit,
        options: block.options,
        endpointTier: block.endpointTier,
        category: block.variable.category,
        status: 'deprecated',
        versionDeprecated: currentVersion.versionNumber,
        schemaBlockId: block.id
      });
    }
    
    if (block.children) {
      block.children.forEach(processBlock);
    }
  };
  
  previousVersion.schemaBlocks.forEach(processBlock);
  
  return deprecatedFields;
}

/**
 * Generate database tables from protocol version
 * Uses the actual Section structure from schema rather than hardcoded categories
 */
export function generateDatabaseTables(
  protocolVersion: ProtocolVersion,
  previousVersion?: ProtocolVersion
): DatabaseTable[] {
  const tables: DatabaseTable[] = [];

  // 🛡️ PHASE 3 FIX: Defensive check and auto-conversion
  console.log('🛡️ Database Generator - Checking schema block format...');

  // Check if we have simplified blocks and convert if needed
  let schemaBlocks = protocolVersion.schemaBlocks;

  if (schemaBlocks.length > 0) {
    const firstBlock = schemaBlocks[0];

    if (isSimplifiedSchemaBlock(firstBlock)) {
      console.warn('⚠️ WARNING: Simplified schema blocks detected in protocol version!');
      console.warn('⚠️ Auto-converting to full format for database compatibility...');
      debugSchemaBlockFormat(schemaBlocks, 'Simplified Blocks (Before)');

      schemaBlocks = convertSchemaBlocks(schemaBlocks as any);

      debugSchemaBlockFormat(schemaBlocks, 'Full Blocks (After)');
      console.log(`✅ Converted ${schemaBlocks.length} blocks to full format`);
    } else {
      console.log('✅ Schema blocks are already in full format');
    }
  } else {
    console.warn('⚠️ No schema blocks found in protocol version');
  }

  // Log schema structure info for debugging
  console.log(`📋 Schema Analysis: ${schemaBlocks.length} top-level blocks`);

  // Always add subject ID, enrollment date, and visit tracking to all tables
  const baseFields: DatabaseField[] = [
    {
      id: 'subject_id',
      fieldName: 'subject_id',
      displayName: 'Subject ID',
      dataType: 'Text',
      sqlType: 'VARCHAR(50)',
      isRequired: true,
      category: 'Structural',
      status: 'normal',
      schemaBlockId: 'base_subject_id'
    },
    {
      id: 'visit_name',
      fieldName: 'visit_name',
      displayName: 'Visit/Timepoint',
      dataType: 'Categorical',
      sqlType: 'VARCHAR(100)',
      isRequired: true,
      options: ['Screening', 'Baseline', 'Week 2', 'Week 4', 'Week 8', 'Week 12', 'Month 6', 'Month 12', 'Final Visit', 'Early Termination', 'Unscheduled'],
      category: 'Structural',
      status: 'normal',
      schemaBlockId: 'base_visit_name'
    },
    {
      id: 'visit_date',
      fieldName: 'visit_date',
      displayName: 'Visit Date',
      dataType: 'Date',
      sqlType: 'DATE',
      isRequired: true,
      category: 'Structural',
      status: 'normal',
      schemaBlockId: 'base_visit_date'
    },
    {
      id: 'enrollment_date',
      fieldName: 'enrollment_date',
      displayName: 'Enrollment Date',
      dataType: 'Date',
      sqlType: 'DATE',
      isRequired: true,
      category: 'Structural',
      status: 'normal',
      schemaBlockId: 'base_enrollment_date'
    }
  ];

  // NEW APPROACH: Generate tables based on Section structure from schema
  // Each top-level Section becomes a database table, preserving user's organization
  const sectionBlocks = schemaBlocks.filter(block => block.dataType === 'Section');
  const nonSectionBlocks = schemaBlocks.filter(block => block.dataType !== 'Section');

  console.log(`   Found ${sectionBlocks.length} sections and ${nonSectionBlocks.length} root-level fields`);

  // Create a table for each Section in the schema
  for (const section of sectionBlocks) {
    const sectionName = section.customName || section.variable.name;
    const tableName = `${sectionName}_${protocolVersion.metadata.protocolNumber}`
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '_')
      .replace(/_+/g, '_'); // Collapse multiple underscores

    // Get fields from this section's children
    const sectionFields = generateDatabaseFields(
      section.children || [],
      protocolVersion.versionNumber,
      previousVersion
    );

    if (sectionFields.length > 0) {
      tables.push({
        tableName,
        displayName: sectionName,
        description: `Data fields from "${sectionName}" section of the protocol.`,
        fields: [...baseFields, ...sectionFields],
        recordCount: 0,
        protocolNumber: protocolVersion.metadata.protocolNumber,
        protocolVersion: protocolVersion.versionNumber
      });

      console.log(`   📁 Created table "${sectionName}" with ${sectionFields.length} fields`);
    }
  }

  // Handle root-level fields (not in any section) - create a "General Data" table
  if (nonSectionBlocks.length > 0) {
    const rootFields = generateDatabaseFields(
      nonSectionBlocks,
      protocolVersion.versionNumber,
      previousVersion
    );

    if (rootFields.length > 0) {
      tables.push({
        tableName: `general_data_${protocolVersion.metadata.protocolNumber}`.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
        displayName: 'General Data',
        description: 'Fields not organized into specific sections.',
        fields: [...baseFields, ...rootFields],
        recordCount: 0,
        protocolNumber: protocolVersion.metadata.protocolNumber,
        protocolVersion: protocolVersion.versionNumber
      });

      console.log(`   📁 Created "General Data" table with ${rootFields.length} root-level fields`);
    }
  }

  // FALLBACK: If no sections exist, create tables by role/endpointTier
  if (tables.length === 0 && schemaBlocks.length > 0) {
    console.log('⚠️ No sections found. Falling back to role-based table generation.');

    const allFields = generateDatabaseFields(schemaBlocks, protocolVersion.versionNumber, previousVersion);
    const endpointFields = allFields.filter(f => f.endpointTier);
    const otherFields = allFields.filter(f => !f.endpointTier);

    if (endpointFields.length > 0) {
      tables.push({
        tableName: `endpoints_${protocolVersion.metadata.protocolNumber}`.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
        displayName: 'Study Endpoints',
        description: 'Primary, secondary, and exploratory endpoints.',
        fields: [...baseFields, ...endpointFields],
        recordCount: 0,
        protocolNumber: protocolVersion.metadata.protocolNumber,
        protocolVersion: protocolVersion.versionNumber
      });
    }

    if (otherFields.length > 0) {
      tables.push({
        tableName: `study_data_${protocolVersion.metadata.protocolNumber}`.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
        displayName: 'Study Data',
        description: 'All study data fields.',
        fields: [...baseFields, ...otherFields],
        recordCount: 0,
        protocolNumber: protocolVersion.metadata.protocolNumber,
        protocolVersion: protocolVersion.versionNumber
      });
    }
  }

  // Log table generation result
  console.log(`📊 Generated ${tables.length} tables:`, tables.map(t => `${t.displayName} (${t.fields.length} fields)`).join(', '));

  return tables;
}

// Helper functions
function findBlockInVersion(variableId: string, blocks: SchemaBlock[]): SchemaBlock | null {
  for (const block of blocks) {
    if (block.variable.id === variableId) {
      return block;
    }
    if (block.children) {
      const found = findBlockInVersion(variableId, block.children);
      if (found) return found;
    }
  }
  return null;
}

function getAllBlockIds(blocks: SchemaBlock[]): string[] {
  const ids: string[] = [];
  
  const traverse = (block: SchemaBlock) => {
    ids.push(block.variable.id);
    if (block.children) {
      block.children.forEach(traverse);
    }
  };
  
  blocks.forEach(traverse);
  return ids;
}