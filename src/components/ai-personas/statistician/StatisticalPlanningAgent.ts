/**
 * StatisticalPlanningAgent
 *
 * AI agent that analyzes PICO framework and available schema variables,
 * then suggests statistical role mappings for each variable.
 *
 * This closes the loop between data collection (Schema Builder) and
 * analysis execution (AI Statistician) by having the same AI system
 * suggest variable mappings that it will later use for analysis.
 */

import type { SchemaBlock, StatisticalRole, StatisticalMapping, AIStatisticalPlan } from '../../protocol-workbench/types';

// Re-export types for convenience
export type { StatisticalMapping, AIStatisticalPlan };

export interface PICOContext {
  population: string;
  intervention: string;
  comparison: string;
  outcome: string;
}

export interface SchemaBlockInput {
  id: string;
  label: string;
  dataType: string;
  role?: string;
  endpointTier?: string | null;
  description?: string;
  category?: string;
}

/**
 * Generate the prompt for statistical variable mapping
 */
export function buildStatisticalPlanPrompt(
  pico: PICOContext,
  schemaBlocks: SchemaBlockInput[]
): string {
  const variablesList = schemaBlocks.map(block => {
    const parts = [
      `- ID: ${block.id}`,
      `  Label: ${block.label}`,
      `  Type: ${block.dataType}`,
    ];
    if (block.role) parts.push(`  Role: ${block.role}`);
    if (block.endpointTier) parts.push(`  Endpoint Tier: ${block.endpointTier}`);
    if (block.description) parts.push(`  Description: ${block.description}`);
    if (block.category) parts.push(`  Category: ${block.category}`);
    return parts.join('\n');
  }).join('\n\n');

  return `You are Dr. Saga, an expert clinical biostatistician. Given the PICO framework and available data variables from a clinical study schema, suggest how each variable should be used in the statistical analysis plan.

## PICO FRAMEWORK

- **Population**: ${pico.population || 'Not specified'}
- **Intervention**: ${pico.intervention || 'Not specified'}
- **Comparison**: ${pico.comparison || 'Not specified'}
- **Outcome**: ${pico.outcome || 'Not specified'}

## AVAILABLE VARIABLES (${schemaBlocks.length} total)

${variablesList}

## TASK

For each variable, suggest ONE of these statistical roles:
- **primary_endpoint**: Main outcome measure that addresses the primary research question
- **secondary_endpoint**: Additional outcomes of interest
- **safety_endpoint**: Safety/adverse event measures
- **baseline_covariate**: Baseline characteristics to adjust for in analysis
- **confounder**: Variables that may confound the relationship between intervention and outcome
- **subgroup_variable**: Variables for subgroup analyses
- **treatment_indicator**: Treatment/control group assignment or exposure variable
- **time_variable**: Time-to-event or follow-up duration
- **excluded**: Not relevant to this analysis (structural fields, IDs, etc.)

## GUIDELINES

1. The primary_endpoint should directly align with the PICO "Outcome"
2. Treatment/intervention variables should be mapped as treatment_indicator
3. Demographic and baseline characteristics typically map to baseline_covariate
4. Variables that could confound results (related to both intervention and outcome) are confounders
5. Safety outcomes (adverse events, complications, deaths) should be safety_endpoint
6. Mark structural fields (sections, IDs, timestamps) as excluded
7. Be conservative with confidence - only high confidence for clear mappings

## RESPONSE FORMAT

Respond with valid JSON only. Include ALL ${schemaBlocks.length} variables:

{
  "mappings": [
    {
      "blockId": "exact_block_id_from_list",
      "suggestedRole": "primary_endpoint|secondary_endpoint|safety_endpoint|baseline_covariate|confounder|subgroup_variable|treatment_indicator|time_variable|excluded",
      "confidence": 0.0-1.0,
      "reasoning": "Brief explanation of why this role is appropriate"
    }
  ],
  "analysisRecommendations": {
    "primaryAnalysis": "Brief description of recommended primary analysis approach",
    "keyConfounders": ["list", "of", "key", "confounders"],
    "suggestedSubgroups": ["list", "of", "suggested", "subgroup", "analyses"]
  }
}

CRITICAL: Use the exact block IDs from the variable list above. Do not invent or modify IDs.`;
}

/**
 * Parse the Gemini response into structured StatisticalMapping array
 */
export function parseStatisticalPlanResponse(
  responseText: string,
  protocolId: string,
  pico: PICOContext,
  schemaBlocks: SchemaBlockInput[]
): AIStatisticalPlan {
  let parsed: any;

  try {
    // Try to extract JSON from response
    parsed = extractJSONFromResponse(responseText);
  } catch (error) {
    console.error('Failed to parse statistical plan response:', error);
    // Return empty plan on parse failure
    return createEmptyPlan(protocolId, pico);
  }

  if (!parsed.mappings || !Array.isArray(parsed.mappings)) {
    console.warn('No mappings array in response, creating from schema');
    return createEmptyPlan(protocolId, pico);
  }

  // Build a lookup map for schema blocks
  const blockLookup = new Map<string, SchemaBlockInput>();
  for (const block of schemaBlocks) {
    blockLookup.set(block.id, block);
  }

  // Transform response mappings into typed StatisticalMapping objects
  const mappings: StatisticalMapping[] = parsed.mappings
    .map((m: any) => {
      const block = blockLookup.get(m.blockId);
      if (!block) {
        console.warn(`Block ID not found in schema: ${m.blockId}`);
        return null;
      }

      const validRoles: StatisticalRole[] = [
        'primary_endpoint',
        'secondary_endpoint',
        'safety_endpoint',
        'baseline_covariate',
        'confounder',
        'subgroup_variable',
        'treatment_indicator',
        'time_variable',
        'excluded',
      ];

      const suggestedRole = validRoles.includes(m.suggestedRole)
        ? m.suggestedRole as StatisticalRole
        : 'excluded';

      return {
        blockId: m.blockId,
        blockLabel: block.label,
        suggestedRole,
        confidence: typeof m.confidence === 'number' ? Math.min(1, Math.max(0, m.confidence)) : 0.5,
        reasoning: m.reasoning || 'No reasoning provided',
        confirmed: false, // User must confirm
      } as StatisticalMapping;
    })
    .filter((m: StatisticalMapping | null): m is StatisticalMapping => m !== null);

  // Add any schema blocks not in the response as excluded
  for (const block of schemaBlocks) {
    if (!mappings.some(m => m.blockId === block.id)) {
      mappings.push({
        blockId: block.id,
        blockLabel: block.label,
        suggestedRole: 'excluded',
        confidence: 0.3,
        reasoning: 'Not included in AI analysis - review manually',
        confirmed: false,
      });
    }
  }

  return {
    id: `stat-plan-${Date.now()}`,
    protocolId,
    createdAt: new Date().toISOString(),
    picoContext: pico,
    mappings,
    status: 'draft',
  };
}

/**
 * Create an empty plan (fallback)
 */
function createEmptyPlan(protocolId: string, pico: PICOContext): AIStatisticalPlan {
  return {
    id: `stat-plan-${Date.now()}`,
    protocolId,
    createdAt: new Date().toISOString(),
    picoContext: pico,
    mappings: [],
    status: 'draft',
  };
}

/**
 * Extract JSON from Gemini response (handles markdown code blocks)
 */
function extractJSONFromResponse(responseText: string): any {
  let jsonText = responseText;

  // Try to extract JSON from markdown code blocks
  const jsonMatch = responseText.match(/```(?:json)?\n?([\s\S]*?)```/);
  if (jsonMatch) {
    jsonText = jsonMatch[1];
  }
  jsonText = jsonText.trim();

  // Strip "json" prefix if present
  if (jsonText.toLowerCase().startsWith('json')) {
    jsonText = jsonText.replace(/^json\s*/i, '').trim();
  }

  // Remove stray backticks
  if (jsonText.startsWith('`')) {
    jsonText = jsonText.replace(/^`+|`+$/g, '').trim();
  }

  // Find the JSON object
  const firstBrace = jsonText.indexOf('{');
  const lastBrace = jsonText.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    jsonText = jsonText.substring(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(jsonText);
  } catch (error) {
    // Attempt repair: remove trailing commas
    const repairedJson = jsonText.replace(/,(\s*[}\]])/g, '$1');
    return JSON.parse(repairedJson);
  }
}

/**
 * Get display label for statistical role
 */
export function getStatisticalRoleLabel(role: StatisticalRole): string {
  const labels: Record<StatisticalRole, string> = {
    primary_endpoint: 'Primary Endpoint',
    secondary_endpoint: 'Secondary Endpoint',
    safety_endpoint: 'Safety Endpoint',
    baseline_covariate: 'Baseline Covariate',
    confounder: 'Confounder',
    subgroup_variable: 'Subgroup Variable',
    treatment_indicator: 'Treatment Indicator',
    time_variable: 'Time Variable',
    excluded: 'Excluded',
  };
  return labels[role] || role;
}

/**
 * Get color class for statistical role (for UI badges)
 */
export function getStatisticalRoleColor(role: StatisticalRole): string {
  const colors: Record<StatisticalRole, string> = {
    primary_endpoint: 'bg-purple-100 text-purple-800 border-purple-300',
    secondary_endpoint: 'bg-blue-100 text-blue-800 border-blue-300',
    safety_endpoint: 'bg-red-100 text-red-800 border-red-300',
    baseline_covariate: 'bg-slate-100 text-slate-800 border-slate-300',
    confounder: 'bg-amber-100 text-amber-800 border-amber-300',
    subgroup_variable: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    treatment_indicator: 'bg-green-100 text-green-800 border-green-300',
    time_variable: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    excluded: 'bg-gray-100 text-gray-500 border-gray-300',
  };
  return colors[role] || 'bg-gray-100 text-gray-800 border-gray-300';
}

/**
 * Group mappings by statistical role for UI display
 */
export function groupMappingsByRole(mappings: StatisticalMapping[]): Map<StatisticalRole, StatisticalMapping[]> {
  const groups = new Map<StatisticalRole, StatisticalMapping[]>();

  // Define display order
  const roleOrder: StatisticalRole[] = [
    'primary_endpoint',
    'secondary_endpoint',
    'safety_endpoint',
    'treatment_indicator',
    'baseline_covariate',
    'confounder',
    'subgroup_variable',
    'time_variable',
    'excluded',
  ];

  // Initialize groups in order
  for (const role of roleOrder) {
    groups.set(role, []);
  }

  // Populate groups
  for (const mapping of mappings) {
    const group = groups.get(mapping.suggestedRole);
    if (group) {
      group.push(mapping);
    } else {
      // Unknown role goes to excluded
      const excludedGroup = groups.get('excluded');
      if (excludedGroup) {
        excludedGroup.push(mapping);
      }
    }
  }

  // Remove empty groups (except primary and treatment which are important)
  for (const [role, items] of groups) {
    if (items.length === 0 && role !== 'primary_endpoint' && role !== 'treatment_indicator') {
      groups.delete(role);
    }
  }

  return groups;
}
