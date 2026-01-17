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
  }
  
  // Generate fields from current version
  const activeFields = generateDatabaseFields(
    schemaBlocks,
    protocolVersion.versionNumber,
    previousVersion
  );
  
  // Find deprecated fields if there's a previous version
  const deprecatedFields = previousVersion 
    ? findDeprecatedFields(protocolVersion, previousVersion)
    : [];
  
  const allFields = [...activeFields, ...deprecatedFields];

  // Determine the order of categories by scanning schema blocks
  const categoryOrder: string[] = [];
  const processCategoryOrder = (blocks: SchemaBlock[]) => {
    blocks.forEach(block => {
      const category = block.variable.category;
      if (category && !categoryOrder.includes(category)) {
        categoryOrder.push(category);
      }
      if (block.children && block.children.length > 0) {
        processCategoryOrder(block.children);
      }
    });
  };
  processCategoryOrder(protocolVersion.schemaBlocks);

  // Group fields by category
  const demographicFields = allFields.filter(f => f.category === 'Demographics');
  const endpointFields = allFields.filter(f => f.endpointTier);
  const laboratoryFields = allFields.filter(f => f.category === 'Laboratory');
  const clinicalFields = allFields.filter(f => f.category === 'Clinical');
  const treatmentFields = allFields.filter(f => f.category === 'Treatments');

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

  // Create tables in the order they appear in the schema
  const tableCreators = [
    {
      categories: ['Demographics'],
      condition: () => demographicFields.length > 0,
      create: () => ({
        tableName: `subjects_${protocolVersion.metadata.protocolNumber}`.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
        displayName: 'Subject Demographics',
        description: 'Demographic and baseline characteristics tracked across study visits. Each row represents one subject at one timepoint.',
        fields: [...baseFields, ...demographicFields],
        recordCount: 0,
        protocolNumber: protocolVersion.metadata.protocolNumber,
        protocolVersion: protocolVersion.versionNumber
      })
    },
    {
      categories: ['Endpoints'],
      condition: () => endpointFields.length > 0,
      create: () => ({
        tableName: `endpoints_${protocolVersion.metadata.protocolNumber}`.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
        displayName: 'Study Endpoints',
        description: 'Primary, secondary, and exploratory endpoints measured longitudinally. Records multiple assessments per subject over time.',
        fields: [
          ...baseFields,
          {
            id: 'visit_number',
            fieldName: 'visit_number',
            displayName: 'Visit Number',
            dataType: 'Continuous',
            sqlType: 'INT',
            isRequired: true,
            category: 'Structural',
            status: 'normal',
            schemaBlockId: 'base_visit_number'
          },
          ...endpointFields
        ],
        recordCount: 0,
        protocolNumber: protocolVersion.metadata.protocolNumber,
        protocolVersion: protocolVersion.versionNumber
      })
    },
    {
      categories: ['Clinical'],
      condition: () => clinicalFields.length > 0 || treatmentFields.length > 0,
      create: () => ({
        tableName: `clinical_data_${protocolVersion.metadata.protocolNumber}`.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
        displayName: 'Clinical Data',
        description: 'Treatments, adverse events, and clinical observations captured at each study visit. Supports longitudinal tracking of interventions and safety data.',
        fields: [
          ...baseFields,
          {
            id: 'visit_number',
            fieldName: 'visit_number',
            displayName: 'Visit Number',
            dataType: 'Continuous',
            sqlType: 'INT',
            isRequired: true,
            category: 'Structural',
            status: 'normal',
            schemaBlockId: 'base_visit_number'
          },
          ...clinicalFields,
          ...treatmentFields
        ],
        recordCount: 0,
        protocolNumber: protocolVersion.metadata.protocolNumber,
        protocolVersion: protocolVersion.versionNumber
      })
    },
    {
      categories: ['Laboratory'],
      condition: () => laboratoryFields.length > 0,
      create: () => ({
        tableName: `laboratory_${protocolVersion.metadata.protocolNumber}`.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
        displayName: 'Laboratory Results',
        description: 'Lab tests and biomarkers measured across study visits. Tracks repeated laboratory assessments for each subject over time.',
        fields: [
          ...baseFields,
          {
            id: 'visit_number',
            fieldName: 'visit_number',
            displayName: 'Visit Number',
            dataType: 'Continuous',
            sqlType: 'INT',
            isRequired: true,
            category: 'Structural',
            status: 'normal',
            schemaBlockId: 'base_visit_number'
          },
          ...laboratoryFields
        ],
        recordCount: 0,
        protocolNumber: protocolVersion.metadata.protocolNumber,
        protocolVersion: protocolVersion.versionNumber
      })
    }
  ];

  // Add tables in the order they appear in the schema
  for (const category of categoryOrder) {
    const creator = tableCreators.find(tc => tc.categories.includes(category));
    if (creator && creator.condition() && !tables.some(t => t.displayName === creator.create().displayName)) {
      tables.push(creator.create());
    }
  }

  // Add endpoints if they exist (they might not have a regular category)
  const endpointsCreator = tableCreators.find(tc => tc.categories.includes('Endpoints'));
  if (endpointsCreator && endpointsCreator.condition() && !tables.some(t => t.displayName === 'Study Endpoints')) {
    tables.push(endpointsCreator.create());
  }

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