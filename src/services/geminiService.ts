/**
 * Gemini AI Service - Client-side integration
 * 
 * Uses Google's Gemini API for AI-powered features.
 * API key is stored in VITE_GEMINI_API_KEY environment variable.
 * 
 * NOTE: Client-side API calls expose the key in browser.
 * For production, move to a backend proxy.
 */

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

interface PICOExtraction {
  population: string;
  intervention: string;
  comparison: string;
  outcome: string;
  confidence: number;
  reasoning: string;
}

/**
 * Extracted data from a foundational research paper
 */
export interface FoundationalPaperExtraction {
  // Metadata
  title: string;
  authors: string;
  year: string;
  journal: string;
  doi?: string;
  
  // PICO Elements
  pico: {
    population: string;
    intervention: string;
    comparison: string;
    outcome: string;
  };
  
  // Protocol Elements (for pre-fill)
  protocolElements: {
    inclusionCriteria: string[];
    exclusionCriteria: string[];
    primaryEndpoint: string;
    secondaryEndpoints: string[];
    sampleSize: string;
    statisticalApproach: string;
    followUpDuration: string;
  };
  
  // For synthesis
  studyDesign: string;
  keyFindings: string;
  limitations: string;
  
  // Source tracking
  fileName: string;
  extractedAt: string;
}

/**
 * Check if Gemini API is configured
 */
export function isGeminiConfigured(): boolean {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  return !!key && key.length > 10;
}

/**
 * Call Gemini API with a prompt
 */
async function callGemini(prompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY not configured');
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1024,
      }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${error}`);
  }

  const data: GeminiResponse = await response.json();
  
  if (!data.candidates || data.candidates.length === 0) {
    throw new Error('No response from Gemini');
  }

  return data.candidates[0].content.parts[0].text;
}

/**
 * Extract PICO framework from clinical text using Gemini
 */
export async function extractPICOWithGemini(clinicalText: string): Promise<PICOExtraction> {
  const prompt = `You are Dr. Ariadne, a clinical research hypothesis architect. Your task is to extract the PICO framework from the following clinical observation or research description.

PICO Framework:
- P (Population): Who are the patients/subjects being studied? Include demographics, conditions, sample size if mentioned.
- I (Intervention): What treatment, procedure, protocol, or exposure is being studied?
- C (Comparison): What is the control or comparison group? If this is a methods paper or case series without a formal comparison, indicate "No formal comparison group" and explain why.
- O (Outcome): What are the primary endpoints or outcomes being measured?

Clinical Text:
"""
${clinicalText}
"""

Respond in valid JSON format only, with no additional text:
{
  "population": "Description of the patient population",
  "intervention": "Description of the intervention or exposure",
  "comparison": "Description of comparison group or 'No formal comparison group - [reason]'",
  "outcome": "Description of the primary outcome(s)",
  "confidence": 0.85,
  "reasoning": "Brief explanation of your extraction logic"
}`;

  try {
    const responseText = await callGemini(prompt);
    
    // Extract JSON from response (Gemini sometimes wraps in markdown code blocks)
    let jsonText = responseText;
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1];
    }
    
    // Clean up any leading/trailing whitespace
    jsonText = jsonText.trim();
    
    // Parse the JSON
    const parsed = JSON.parse(jsonText) as PICOExtraction;
    
    return {
      population: parsed.population || '(Could not extract population)',
      intervention: parsed.intervention || '(Could not extract intervention)',
      comparison: parsed.comparison || '(Could not extract comparison)',
      outcome: parsed.outcome || '(Could not extract outcome)',
      confidence: parsed.confidence || 0.5,
      reasoning: parsed.reasoning || 'AI extraction completed',
    };
  } catch (error) {
    console.error('PICO extraction failed:', error);
    throw error;
  }
}

/**
 * Validate hypothesis grounding against schema variables
 */
export async function validateHypothesisGrounding(
  picoData: { population: string; intervention: string; comparison: string; outcome: string },
  schemaVariables: string[]
): Promise<{
  isGrounded: boolean;
  groundedFields: Record<string, { grounded: boolean; linkedVariable?: string; suggestion?: string }>;
  overallScore: number;
}> {
  const prompt = `You are Dr. Ariadne, validating whether a research hypothesis is grounded in available protocol schema variables.

PICO Hypothesis:
- Population: ${picoData.population}
- Intervention: ${picoData.intervention}
- Comparison: ${picoData.comparison}
- Outcome: ${picoData.outcome}

Available Schema Variables:
${schemaVariables.map(v => `- ${v}`).join('\n')}

For each PICO field, determine:
1. Is it grounded in the available schema variables? (can the data actually be collected?)
2. Which variable(s) could support this field?
3. If not grounded, suggest what variable should be added.

Respond in valid JSON format only:
{
  "population": {
    "grounded": true/false,
    "linkedVariable": "variable_name or null",
    "suggestion": "Suggestion if not grounded"
  },
  "intervention": {
    "grounded": true/false,
    "linkedVariable": "variable_name or null",
    "suggestion": "Suggestion if not grounded"
  },
  "comparison": {
    "grounded": true/false,
    "linkedVariable": "variable_name or null",
    "suggestion": "Suggestion if not grounded"
  },
  "outcome": {
    "grounded": true/false,
    "linkedVariable": "variable_name or null",
    "suggestion": "Suggestion if not grounded"
  },
  "overallScore": 0.0-1.0
}`;

  try {
    const responseText = await callGemini(prompt);
    
    let jsonText = responseText;
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1];
    }
    jsonText = jsonText.trim();
    
    const parsed = JSON.parse(jsonText);
    
    const groundedCount = [
      parsed.population?.grounded,
      parsed.intervention?.grounded,
      parsed.comparison?.grounded,
      parsed.outcome?.grounded
    ].filter(Boolean).length;
    
    return {
      isGrounded: groundedCount >= 3, // At least 3 of 4 fields grounded
      groundedFields: {
        population: parsed.population,
        intervention: parsed.intervention,
        comparison: parsed.comparison,
        outcome: parsed.outcome,
      },
      overallScore: parsed.overallScore || (groundedCount / 4),
    };
  } catch (error) {
    console.error('Grounding validation failed:', error);
    throw error;
  }
}

/**
 * Extract research data from a PDF file using Gemini
 * Uses Gemini's vision capability to read PDF pages
 */
export async function extractFromPDF(file: File): Promise<FoundationalPaperExtraction> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY not configured');
  }

  // Convert PDF to base64
  const base64 = await fileToBase64(file);
  
  const prompt = `You are a clinical research analyst. Analyze this research paper PDF and extract structured information for use as a foundational reference in a new study design.

Extract the following information:

1. **Metadata**: Title, authors, year, journal, DOI if visible
2. **PICO Elements**: Population studied, intervention/exposure, comparison group, primary outcome
3. **Protocol Elements**: 
   - Inclusion criteria (as array of strings)
   - Exclusion criteria (as array of strings)
   - Primary endpoint definition
   - Secondary endpoints (as array)
   - Sample size and power calculation rationale
   - Statistical approach used
   - Follow-up duration
4. **Study Design**: Type of study (RCT, cohort, case-control, etc.)
5. **Key Findings**: Main results in 1-2 sentences
6. **Limitations**: Stated limitations

Respond in valid JSON format only:
{
  "title": "Full paper title",
  "authors": "First author et al.",
  "year": "2024",
  "journal": "Journal Name",
  "doi": "10.xxxx/xxxxx or null",
  "pico": {
    "population": "Description",
    "intervention": "Description",
    "comparison": "Description",
    "outcome": "Description"
  },
  "protocolElements": {
    "inclusionCriteria": ["criterion 1", "criterion 2"],
    "exclusionCriteria": ["criterion 1", "criterion 2"],
    "primaryEndpoint": "Description",
    "secondaryEndpoints": ["endpoint 1", "endpoint 2"],
    "sampleSize": "N=XXX with power calculation rationale",
    "statisticalApproach": "Description of statistical methods",
    "followUpDuration": "Duration"
  },
  "studyDesign": "Type of study",
  "keyFindings": "Main results",
  "limitations": "Key limitations"
}`;

  try {
    // Use Gemini's multimodal endpoint for PDF
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                // Chrome may return empty file.type for PDFs, so always default to application/pdf
                mime_type: file.type && file.type.includes('pdf') ? file.type : 'application/pdf',
                data: base64
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${error}`);
    }

    const data: GeminiResponse = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from Gemini');
    }

    const responseText = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from response
    let jsonText = responseText;
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1];
    }
    jsonText = jsonText.trim();
    
    const parsed = JSON.parse(jsonText);
    
    return {
      title: parsed.title || 'Unknown Title',
      authors: parsed.authors || 'Unknown Authors',
      year: parsed.year || 'Unknown Year',
      journal: parsed.journal || 'Unknown Journal',
      doi: parsed.doi || undefined,
      pico: {
        population: parsed.pico?.population || '',
        intervention: parsed.pico?.intervention || '',
        comparison: parsed.pico?.comparison || '',
        outcome: parsed.pico?.outcome || '',
      },
      protocolElements: {
        inclusionCriteria: parsed.protocolElements?.inclusionCriteria || [],
        exclusionCriteria: parsed.protocolElements?.exclusionCriteria || [],
        primaryEndpoint: parsed.protocolElements?.primaryEndpoint || '',
        secondaryEndpoints: parsed.protocolElements?.secondaryEndpoints || [],
        sampleSize: parsed.protocolElements?.sampleSize || '',
        statisticalApproach: parsed.protocolElements?.statisticalApproach || '',
        followUpDuration: parsed.protocolElements?.followUpDuration || '',
      },
      studyDesign: parsed.studyDesign || '',
      keyFindings: parsed.keyFindings || '',
      limitations: parsed.limitations || '',
      fileName: file.name,
      extractedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('PDF extraction failed:', error);
    throw error;
  }
}

/**
 * Synthesize multiple foundational papers into unified suggestions
 */
export async function synthesizeFoundationalPapers(
  papers: FoundationalPaperExtraction[]
): Promise<{
  suggestedPICO: {
    population: { value: string; sources: string[]; confidence: 'high' | 'medium' | 'low' };
    intervention: { value: string; sources: string[]; confidence: 'high' | 'medium' | 'low' };
    comparison: { value: string; sources: string[]; confidence: 'high' | 'medium' | 'low' };
    outcome: { value: string; sources: string[]; confidence: 'high' | 'medium' | 'low' };
  };
  suggestedProtocol: {
    inclusionCriteria: { value: string; sources: string[]; frequency: number }[];
    exclusionCriteria: { value: string; sources: string[]; frequency: number }[];
    primaryEndpoint: { value: string; sources: string[] };
    statisticalApproach: { value: string; sources: string[] };
    sampleSizeGuidance: string;
  };
  gapAnalysis: string;
  uniqueContribution: string;
}> {
  const prompt = `You are a clinical research synthesis expert. Analyze these ${papers.length} foundational research papers and provide unified suggestions for a new study design.

PAPERS:
${papers.map((p, i) => `
--- PAPER ${i + 1}: ${p.title} (${p.authors}, ${p.year}) ---
Study Design: ${p.studyDesign}
PICO:
  - Population: ${p.pico.population}
  - Intervention: ${p.pico.intervention}
  - Comparison: ${p.pico.comparison}
  - Outcome: ${p.pico.outcome}
Inclusion Criteria: ${p.protocolElements.inclusionCriteria.join('; ')}
Exclusion Criteria: ${p.protocolElements.exclusionCriteria.join('; ')}
Primary Endpoint: ${p.protocolElements.primaryEndpoint}
Sample Size: ${p.protocolElements.sampleSize}
Statistical Approach: ${p.protocolElements.statisticalApproach}
Key Findings: ${p.keyFindings}
Limitations: ${p.limitations}
`).join('\n')}

SYNTHESIS TASKS:
1. For each PICO element, suggest a synthesized version and note which papers support it
2. Identify commonly used inclusion/exclusion criteria across papers
3. Recommend a primary endpoint based on consensus
4. Suggest statistical approach based on what worked
5. Identify gaps in the literature - what hasn't been studied?
6. Suggest a unique contribution this new study could make

Respond in valid JSON format:
{
  "suggestedPICO": {
    "population": { "value": "Synthesized description", "sources": ["Paper 1 title", "Paper 2 title"], "confidence": "high/medium/low" },
    "intervention": { "value": "...", "sources": [...], "confidence": "..." },
    "comparison": { "value": "...", "sources": [...], "confidence": "..." },
    "outcome": { "value": "...", "sources": [...], "confidence": "..." }
  },
  "suggestedProtocol": {
    "inclusionCriteria": [
      { "value": "Criterion text", "sources": ["Paper 1"], "frequency": 3 }
    ],
    "exclusionCriteria": [...],
    "primaryEndpoint": { "value": "...", "sources": [...] },
    "statisticalApproach": { "value": "...", "sources": [...] },
    "sampleSizeGuidance": "Based on papers, suggest N=X with rationale"
  },
  "gapAnalysis": "What hasn't been studied yet",
  "uniqueContribution": "Suggested unique angle for the new study"
}`;

  try {
    const responseText = await callGemini(prompt);
    
    let jsonText = responseText;
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1];
    }
    jsonText = jsonText.trim();
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Paper synthesis failed:', error);
    throw error;
  }
}

/**
 * Helper: Convert file to base64
 * Works across browsers (Chrome may return empty file.type)
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (!result || typeof result !== 'string') {
        reject(new Error('FileReader returned invalid result'));
        return;
      }
      // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
      const commaIndex = result.indexOf(',');
      if (commaIndex === -1) {
        reject(new Error('Invalid data URL format - no comma separator'));
        return;
      }
      const base64 = result.substring(commaIndex + 1);
      if (!base64 || base64.length === 0) {
        reject(new Error('Base64 conversion produced empty result'));
        return;
      }
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('FileReader error: ' + (reader.error?.message || 'Unknown error')));
    reader.readAsDataURL(file);
  });
}

/**
 * Protocol field types that can receive AI suggestions
 */
export type ProtocolSuggestionField = 
  | 'studyPhase'
  | 'therapeuticArea'
  | 'estimatedEnrollment'
  | 'studyDuration'
  | 'primaryObjective'
  | 'secondaryObjectives'
  | 'inclusionCriteria'
  | 'exclusionCriteria'
  | 'statisticalPlan';

export interface ProtocolFieldSuggestion {
  value: string;
  rationale: string;
  confidence: 'high' | 'medium' | 'low';
  sources: string[];
}

/**
 * Generate a protocol field suggestion based on PICO and foundational papers
 */
export async function generateProtocolSuggestion(
  field: ProtocolSuggestionField,
  pico: {
    population: string;
    intervention: string;
    comparison: string;
    outcome: string;
  },
  foundationalPapers: FoundationalPaperExtraction[]
): Promise<ProtocolFieldSuggestion> {
  
  const fieldDescriptions: Record<ProtocolSuggestionField, string> = {
    studyPhase: 'Study Phase (e.g., Phase I, Phase II, Phase III, Phase IV, Pilot, Observational)',
    therapeuticArea: 'Therapeutic Area (medical specialty or disease category)',
    estimatedEnrollment: 'Estimated Enrollment target number with brief justification',
    studyDuration: 'Study Duration (e.g., 12 months, 24 months) with rationale',
    primaryObjective: 'Primary Objective - the main goal of the study in 1-3 sentences',
    secondaryObjectives: 'Secondary Objectives - additional goals, one per line',
    inclusionCriteria: 'Inclusion Criteria - who can participate, one criterion per line',
    exclusionCriteria: 'Exclusion Criteria - who cannot participate, one criterion per line',
    statisticalPlan: 'Statistical Analysis Plan - key methods, tests, and approach',
  };

  const papersContext = foundationalPapers.length > 0 
    ? `\n\nFOUNDATIONAL PAPERS FOR REFERENCE:\n${foundationalPapers.map((p, i) => `
Paper ${i + 1}: "${p.title}" (${p.year})
- Study Design: ${p.studyDesign}
- Population: ${p.pico.population}
- Intervention: ${p.pico.intervention}
- Primary Endpoint: ${p.protocolElements.primaryEndpoint}
- Sample Size: ${p.protocolElements.sampleSize}
- Inclusion: ${p.protocolElements.inclusionCriteria.join('; ')}
- Exclusion: ${p.protocolElements.exclusionCriteria.join('; ')}
- Stats: ${p.protocolElements.statisticalApproach}
`).join('\n')}`
    : '';

  const prompt = `You are an expert clinical research protocol designer. Generate a suggestion for a specific protocol field based on the PICO framework and reference papers.

STUDY PICO FRAMEWORK:
- Population: ${pico.population || 'Not specified'}
- Intervention: ${pico.intervention || 'Not specified'}
- Comparison: ${pico.comparison || 'Not specified'}
- Outcome: ${pico.outcome || 'Not specified'}
${papersContext}

TASK: Generate a suggestion for the field: "${fieldDescriptions[field]}"

The suggestion should:
1. Be directly informed by the PICO framework
2. Draw from patterns in the foundational papers where applicable
3. Be specific and actionable, not generic
4. Use appropriate clinical/scientific language

Respond in JSON format:
{
  "value": "The actual suggested content for this field",
  "rationale": "Brief explanation of why this suggestion fits (1-2 sentences)",
  "confidence": "high" | "medium" | "low",
  "sources": ["List paper titles or 'PICO framework' that informed this suggestion"]
}`;

  try {
    const responseText = await callGemini(prompt);
    
    let jsonText = responseText;
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1];
    }
    jsonText = jsonText.trim();
    
    const parsed = JSON.parse(jsonText);
    return {
      value: parsed.value || '',
      rationale: parsed.rationale || 'Based on study design',
      confidence: parsed.confidence || 'medium',
      sources: parsed.sources || ['PICO framework'],
    };
  } catch (error) {
    console.error('Protocol suggestion generation failed:', error);
    throw error;
  }
}
