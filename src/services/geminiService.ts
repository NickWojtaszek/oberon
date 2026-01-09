/**
 * Gemini AI Service - Client-side integration
 * 
 * Uses Google's Gemini API for AI-powered features.
 * API key is stored in VITE_GEMINI_API_KEY environment variable.
 * 
 * NOTE: Client-side API calls expose the key in browser.
 * For production, move to a backend proxy.
 */

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

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
