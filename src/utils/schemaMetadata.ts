// Schema Metadata - Address Book for AI Analysis
// Bridges human-readable variable names with auto-generated block IDs

import type { SchemaBlock } from '../components/protocol-workbench/types';

/**
 * Rich metadata for each field in the schema
 */
export interface FieldMetadata {
  // Identity
  id: string;              // "block-1768872837706-qpwwmxrsd"
  name: string;            // "age" (normalized from label)
  label: string;           // "Wiek pacjenta" (original label)
  labelEn?: string;        // "Patient Age" (English translation if available)

  // Data characteristics
  dataType: string;        // "Numeric" | "Text" | "Date" | "Binary" | "Categorical"
  unit?: string;           // "years" | "mmHg" | "%" | etc.
  options?: string[];      // For categorical: ["Yes", "No", "Unknown"]

  // Role in analysis
  role: 'Predictor' | 'Outcome' | 'Structure' | 'All';
  endpointTier?: 'primary' | 'secondary' | 'exploratory' | null;
  analysisMethod?: string; // Suggested method from schema

  // Location in schema hierarchy
  tableId: string;         // "dane_demograficzne_draft_1768872684068"
  tableName: string;       // "Dane Demograficzne"
  sectionPath: string[];   // ["Demographics"] or ["Outcomes", "Neurological"]

  // Clinical context (for AI prompts)
  clinicalMeaning?: string;
  expectedRange?: { min?: number; max?: number };
  benchmarkReference?: string;

  // Validation rules
  required?: boolean;
  validationRules?: any;
}

/**
 * Complete schema metadata for a protocol version
 */
export interface SchemaMetadata {
  protocolId: string;
  versionId: string;
  generatedAt: string;

  // Complete registry of all fields
  fieldRegistry: Record<string, FieldMetadata>;

  // Quick lookups for AI
  byName: Record<string, string>;           // "age" → "block-..."
  byLabel: Record<string, string>;          // "Wiek pacjenta" → "block-..."
  byTable: Record<string, string[]>;        // "dane_demograficzne..." → ["block-...", ...]

  byRole: {
    predictors: string[];
    outcomes: string[];
    structure: string[];
    all: string[];
  };

  byEndpointTier: {
    primary: string[];
    secondary: string[];
    exploratory: string[];
  };

  // Section hierarchy for subsection prompting
  sections: {
    name: string;
    path: string[];
    fields: string[];
    subsections?: any[];
  }[];

  // Statistics
  totalFields: number;
  fieldsByType: Record<string, number>;
  completenessMetrics?: any;
}

/**
 * Normalize label to create a canonical field name
 */
function normalizeLabelToName(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')  // Replace non-alphanumeric with underscore
    .replace(/^_+|_+$/g, '')       // Trim leading/trailing underscores
    .replace(/_+/g, '_')           // Collapse multiple underscores
    .substring(0, 50);             // Max 50 chars
}

/**
 * Extract section path from schema block hierarchy
 */
function extractSectionPath(block: SchemaBlock, allBlocks: SchemaBlock[]): string[] {
  const path: string[] = [];

  // If block has parentId, find parent and recurse
  if (block.parentId) {
    const parent = allBlocks.find(b => b.id === block.parentId);
    if (parent && parent.dataType === 'Section') {
      path.push(...extractSectionPath(parent, allBlocks));
      path.push(parent.label);
    }
  }

  return path;
}

/**
 * Generate complete schema metadata from schema blocks
 */
export function generateSchemaMetadata(
  schemaBlocks: SchemaBlock[],
  protocolId: string,
  versionId: string,
  tableIdMap?: Record<string, string> // Optional: block ID → table ID mapping
): SchemaMetadata {
  console.log('📚 Generating schema metadata...');

  // Extract timestamp from version ID (format: v-<timestamp>)
  const versionTimestamp = versionId.startsWith('v-')
    ? versionId.split('-')[1]
    : versionId;
  const tableIdSuffix = `draft_${versionTimestamp}`;

  console.log(`Version ID: ${versionId}, Table suffix: ${tableIdSuffix}`);

  const fieldRegistry: Record<string, FieldMetadata> = {};
  const byName: Record<string, string> = {};
  const byLabel: Record<string, string> = {};
  const byTable: Record<string, string[]> = {};
  const byRole = { predictors: [], outcomes: [], structure: [], all: [] } as any;
  const byEndpointTier = { primary: [], secondary: [], exploratory: [] } as any;
  const sections: any[] = [];
  const fieldsByType: Record<string, number> = {};

  // Flatten nested blocks
  const flattenBlocks = (blocks: SchemaBlock[]): SchemaBlock[] => {
    const result: SchemaBlock[] = [];
    for (const block of blocks) {
      result.push(block);
      if (block.children && block.children.length > 0) {
        result.push(...flattenBlocks(block.children));
      }
    }
    return result;
  };

  const allBlocks = flattenBlocks(schemaBlocks);

  // Process each block
  for (const block of allBlocks) {
    // Skip sections (they're structure, not data fields)
    if (block.dataType === 'Section') {
      // Track section for hierarchy
      sections.push({
        name: block.label,
        path: extractSectionPath(block, allBlocks),
        fields: [],
      });
      continue;
    }

    // Generate canonical name
    const name = normalizeLabelToName(block.label);

    // Determine table ID (use provided map or construct from parent)
    let tableId = '';
    let tableName = '';

    if (tableIdMap && block.id in tableIdMap) {
      tableId = tableIdMap[block.id];
    } else {
      // Find parent section
      const parentSection = allBlocks.find(b => b.id === block.parentId && b.dataType === 'Section');
      if (parentSection) {
        tableName = parentSection.label;
        tableId = `${normalizeLabelToName(parentSection.label)}_${tableIdSuffix}`;
      } else {
        tableName = 'General Data';
        tableId = `general_data_${tableIdSuffix}`;
      }
    }

    // Extract section path
    const sectionPath = extractSectionPath(block, allBlocks);

    // Build metadata
    const metadata: FieldMetadata = {
      id: block.id,
      name,
      label: block.label,
      dataType: block.dataType,
      unit: block.unit,
      options: block.options,
      role: block.role || 'All',
      endpointTier: block.endpointTier,
      analysisMethod: block.analysisMethod,
      tableId,
      tableName,
      sectionPath,
      required: block.required,
      validationRules: block.validationRules,
    };

    // Add to registry
    fieldRegistry[block.id] = metadata;

    // Add to lookups
    byName[name] = block.id;
    byLabel[block.label.toLowerCase()] = block.id;

    if (!byTable[tableId]) {
      byTable[tableId] = [];
    }
    byTable[tableId].push(block.id);

    // Role categorization
    if (block.role === 'Predictor') byRole.predictors.push(block.id);
    if (block.role === 'Outcome') byRole.outcomes.push(block.id);
    if (block.role === 'Structure') byRole.structure.push(block.id);
    byRole.all.push(block.id);

    // Endpoint tier
    if (block.endpointTier === 'primary') byEndpointTier.primary.push(block.id);
    if (block.endpointTier === 'secondary') byEndpointTier.secondary.push(block.id);
    if (block.endpointTier === 'exploratory') byEndpointTier.exploratory.push(block.id);

    // Type statistics
    fieldsByType[block.dataType] = (fieldsByType[block.dataType] || 0) + 1;
  }

  // Assign fields to sections
  for (const section of sections) {
    const sectionBlockIds = allBlocks
      .filter(b => {
        const blockPath = extractSectionPath(b, allBlocks);
        return blockPath.join('/') === [...section.path, section.name].join('/');
      })
      .map(b => b.id);

    section.fields = sectionBlockIds;
  }

  const metadata: SchemaMetadata = {
    protocolId,
    versionId,
    generatedAt: new Date().toISOString(),
    fieldRegistry,
    byName,
    byLabel,
    byTable,
    byRole,
    byEndpointTier,
    sections,
    totalFields: Object.keys(fieldRegistry).length,
    fieldsByType,
  };

  console.log(`✅ Generated metadata for ${metadata.totalFields} fields`);
  console.log(`   Predictors: ${byRole.predictors.length}`);
  console.log(`   Outcomes: ${byRole.outcomes.length}`);
  console.log(`   Primary endpoints: ${byEndpointTier.primary.length}`);
  console.log(`   Tables: ${Object.keys(byTable).length}`);
  console.log(`   Sections: ${sections.length}`);

  return metadata;
}

/**
 * Save schema metadata to localStorage
 */
export function saveSchemaMetadata(metadata: SchemaMetadata): void {
  const key = `schema-metadata-${metadata.protocolId}-${metadata.versionId}`;
  try {
    localStorage.setItem(key, JSON.stringify(metadata));
    console.log(`💾 Schema metadata saved: ${key}`);
  } catch (error) {
    console.error('Failed to save schema metadata:', error);
  }
}

/**
 * Load schema metadata from localStorage
 */
export function loadSchemaMetadata(
  protocolId: string,
  versionId: string
): SchemaMetadata | null {
  const key = `schema-metadata-${protocolId}-${versionId}`;
  try {
    const data = localStorage.getItem(key);
    if (data) {
      const metadata = JSON.parse(data) as SchemaMetadata;
      console.log(`📖 Schema metadata loaded: ${key} (${metadata.totalFields} fields)`);
      return metadata;
    }
  } catch (error) {
    console.error('Failed to load schema metadata:', error);
  }
  return null;
}

/**
 * Resolve a field identifier (name, label, or block ID) to actual block ID
 */
export function resolveFieldId(
  identifier: string,
  metadata: SchemaMetadata
): string | null {
  // Already a block ID?
  if (identifier.startsWith('block-') && identifier in metadata.fieldRegistry) {
    return identifier;
  }

  // Try by name
  if (identifier in metadata.byName) {
    return metadata.byName[identifier];
  }

  // Try by label (case-insensitive)
  const lowerIdentifier = identifier.toLowerCase();
  if (lowerIdentifier in metadata.byLabel) {
    return metadata.byLabel[lowerIdentifier];
  }

  // Try fuzzy match on names
  for (const [name, blockId] of Object.entries(metadata.byName)) {
    if (name.includes(lowerIdentifier) || lowerIdentifier.includes(name)) {
      console.warn(`🔎 Fuzzy matched "${identifier}" → "${name}" (${blockId})`);
      return blockId;
    }
  }

  console.error(`❌ Could not resolve field identifier: "${identifier}"`);
  return null;
}

/**
 * Get human-readable field summary for AI prompts
 */
export function getFieldSummaryForAI(
  fieldId: string,
  metadata: SchemaMetadata
): string {
  const field = metadata.fieldRegistry[fieldId];
  if (!field) return fieldId;

  let summary = `${field.name}`;

  if (field.unit) summary += ` (${field.unit})`;
  if (field.dataType !== 'Text') summary += ` [${field.dataType}]`;
  if (field.label !== field.name) summary += `: ${field.label}`;
  if (field.endpointTier) summary += ` *${field.endpointTier}*`;

  return summary;
}

/**
 * Get all fields for a specific section (for subsection prompting)
 */
export function getFieldsBySection(
  sectionName: string,
  metadata: SchemaMetadata
): FieldMetadata[] {
  const section = metadata.sections.find(s => s.name === sectionName);
  if (!section) return [];

  return section.fields
    .map((fieldId: string) => metadata.fieldRegistry[fieldId])
    .filter((f: FieldMetadata | undefined): f is FieldMetadata => f !== undefined);
}

/**
 * Get enriched field list for AI (replaces raw schema blocks)
 */
export function getEnrichedFieldList(
  fieldIds: string[],
  metadata: SchemaMetadata
): Array<{
  id: string;
  name: string;
  label: string;
  dataType: string;
  role: string;
  unit?: string;
  section: string;
}> {
  return fieldIds.map(id => {
    const field = metadata.fieldRegistry[id];
    if (!field) return null;

    return {
      id: field.id,
      name: field.name,
      label: field.label,
      dataType: field.dataType,
      role: field.role,
      unit: field.unit,
      section: field.sectionPath.join(' > ') || field.tableName,
    };
  }).filter((f): f is NonNullable<typeof f> => f !== null);
}

// Export to window for console debugging
if (typeof window !== 'undefined') {
  (window as any).schemaMetadata = {
    generate: generateSchemaMetadata,
    save: saveSchemaMetadata,
    load: loadSchemaMetadata,
    resolve: resolveFieldId,
    getFieldSummary: getFieldSummaryForAI,
    getBySection: getFieldsBySection,
  };
  console.log('💡 Schema metadata utilities available in console:');
  console.log('  - window.schemaMetadata.load(protocolId, versionId)');
  console.log('  - window.schemaMetadata.resolve(fieldName, metadata)');
  console.log('  - window.schemaMetadata.getBySection(sectionName, metadata)');
}
