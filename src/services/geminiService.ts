import { GoogleGenAI } from '@google/genai';

// ── Types ──────────────────────────────────────────────────────────────

export interface FairnessMetric {
  score: number;
  value: number;
  status: 'pass' | 'warning' | 'fail';
  description: string;
}

export interface FeatureImportance {
  name: string;
  importance: number;
}

export interface BiasDetection {
  patterns: string[];
  recommendations: string[];
}

export interface AuditResults {
  fairnessMetrics: {
    demographicParity: FairnessMetric;
    equalOpportunity: FairnessMetric;
    calibration: FairnessMetric;
    accuracy: FairnessMetric;
    explainability: FairnessMetric;
  };
  featureImportance: FeatureImportance[];
  biasDetection: BiasDetection;
  totalScore: number;
  overallStatus: string;
}

// ── Prompt Builder ─────────────────────────────────────────────────────

function buildAuditPrompt(
  dataPreview: string,
  targetVariable: string,
  sensitiveAttributes: string[],
  modelType: string,
): string {
  return `You are an AI ethics auditor for the JEDI Code Compliance System.

Analyze the following dataset preview and audit configuration to produce a comprehensive ethical AI fairness audit.

## Dataset Preview (first 5 rows as JSON):
${dataPreview}

## Audit Configuration:
- Target Variable: ${targetVariable}
- Sensitive Attributes: ${sensitiveAttributes.join(', ')}
- Model Type: ${modelType}

## Scoring Reference:
- Demographic Parity (max 35 pts): measures prediction rate equity across demographic groups. <0.05 diff = 35, 0.05-0.10 = 25, 0.10-0.20 = 15, >0.20 = 5
- Equal Opportunity (max 20 pts): measures true positive rate equity. <0.05 diff = 20, 0.05-0.10 = 15, 0.10-0.20 = 10, >0.20 = 5
- Calibration (max 15 pts): measures Brier score equity. <0.03 diff = 15, 0.03-0.07 = 10, 0.07-0.12 = 7, >0.12 = 3
- Model Accuracy (max 20 pts): overall predictive accuracy. >0.85 = 20, 0.75-0.85 = 15, 0.65-0.75 = 10, <0.65 = 5
- Explainability (max 10 pts): whether SHAP/LIME explanations are feasible for the model type. Available = 10, Not = 0

## Instructions:
Based on the dataset structure, sensitive attributes, target variable, and model type, estimate realistic fairness metrics and produce a full audit report. Be realistic — consider the domain, data characteristics, and common biases associated with these features.

Respond ONLY with a valid JSON object (no markdown, no code fences, no explanation) matching this exact schema:

{
  "fairnessMetrics": {
    "demographicParity": { "score": <number 0-35>, "value": <float 0-1 representing the difference>, "status": "<pass|warning|fail>", "description": "<brief explanation>" },
    "equalOpportunity": { "score": <number 0-20>, "value": <float 0-1>, "status": "<pass|warning|fail>", "description": "<brief explanation>" },
    "calibration": { "score": <number 0-15>, "value": <float 0-1>, "status": "<pass|warning|fail>", "description": "<brief explanation>" },
    "accuracy": { "score": <number 0-20>, "value": <float 0-1>, "status": "<pass|warning|fail>", "description": "<brief explanation>" },
    "explainability": { "score": <number 0-10>, "value": <float 0-1>, "status": "<pass|warning|fail>", "description": "<brief explanation>" }
  },
  "featureImportance": [
    { "name": "<column name>", "importance": <float 0-1> }
  ],
  "biasDetection": {
    "patterns": ["<detected bias pattern 1>", "<pattern 2>", ...],
    "recommendations": ["<recommendation 1>", "<recommendation 2>", ...]
  },
  "totalScore": <number 0-100>,
  "overallStatus": "<Compliant|Conditionally Compliant|Non-Compliant>"
}

Rules for overallStatus:
- totalScore >= 80: "Compliant"
- totalScore 60-79: "Conditionally Compliant"
- totalScore < 60: "Non-Compliant"

Include ALL columns from the dataset in featureImportance (except the target variable). Provide at least 3 bias patterns and 3 recommendations.`;
}

// ── JSON Extraction ────────────────────────────────────────────────────

function extractJSON(text: string): AuditResults {
  // Try direct parse first
  try {
    return JSON.parse(text);
  } catch {
    // ignore
  }

  // Try to extract from code fences
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1].trim());
    } catch {
      // ignore
    }
  }

  // Try to find the first { ... } block
  const braceStart = text.indexOf('{');
  const braceEnd = text.lastIndexOf('}');
  if (braceStart !== -1 && braceEnd !== -1 && braceEnd > braceStart) {
    try {
      return JSON.parse(text.slice(braceStart, braceEnd + 1));
    } catch {
      // ignore
    }
  }

  throw new Error('Failed to parse audit results from AI response');
}

// ── Validation ─────────────────────────────────────────────────────────

function validateResults(data: any): AuditResults {
  const fm = data.fairnessMetrics;
  if (!fm || !fm.demographicParity || !fm.equalOpportunity || !fm.calibration || !fm.accuracy || !fm.explainability) {
    throw new Error('Missing fairness metrics in response');
  }
  if (!Array.isArray(data.featureImportance) || data.featureImportance.length === 0) {
    throw new Error('Missing feature importance data');
  }
  if (!data.biasDetection || !Array.isArray(data.biasDetection.patterns) || !Array.isArray(data.biasDetection.recommendations)) {
    throw new Error('Missing bias detection data');
  }
  if (typeof data.totalScore !== 'number') {
    throw new Error('Missing total score');
  }
  if (!data.overallStatus) {
    throw new Error('Missing overall status');
  }

  // Normalize status fields to lowercase
  const normalizeStatus = (s: string): 'pass' | 'warning' | 'fail' => {
    const lower = s.toLowerCase();
    if (lower === 'pass') return 'pass';
    if (lower === 'warning') return 'warning';
    return 'fail';
  };

  for (const key of ['demographicParity', 'equalOpportunity', 'calibration', 'accuracy', 'explainability'] as const) {
    fm[key].status = normalizeStatus(fm[key].status);
  }

  return data as AuditResults;
}

// ── Gemini Provider ────────────────────────────────────────────────────

async function callGemini(prompt: string): Promise<string> {
  const apiKey = (globalThis as any).process?.env?.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: {
      temperature: 0.3,
      maxOutputTokens: 4096,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error('Empty response from Gemini');
  }
  return text;
}

// ── Groq Provider (fallback) ───────────────────────────────────────────

async function callGroq(prompt: string): Promise<string> {
  const apiKey = (globalThis as any).process?.env?.GROQ_API_KEY;
  if (!apiKey || apiKey === 'YOUR_GROQ_API_KEY_HERE') {
    throw new Error('GROQ_API_KEY not configured');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are an AI ethics auditor. Respond only with valid JSON, no markdown or explanation.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Groq API error (${response.status}): ${errBody}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error('Empty response from Groq');
  }
  return text;
}

// ── Public API ─────────────────────────────────────────────────────────

export async function performEthicalAudit(
  dataPreview: string,
  targetVariable: string,
  sensitiveAttributes: string[],
  modelType: string,
): Promise<AuditResults> {
  const prompt = buildAuditPrompt(dataPreview, targetVariable, sensitiveAttributes, modelType);

  let rawText: string;
  let provider: string;

  // Try Gemini first
  try {
    console.log('[JEDI] Attempting audit via Gemini...');
    rawText = await callGemini(prompt);
    provider = 'Gemini';
  } catch (geminiError) {
    console.warn('[JEDI] Gemini failed, falling back to Groq:', geminiError);

    // Fallback to Groq
    try {
      console.log('[JEDI] Attempting audit via Groq...');
      rawText = await callGroq(prompt);
      provider = 'Groq';
    } catch (groqError) {
      console.error('[JEDI] Groq also failed:', groqError);
      throw new Error(
        'Both Gemini and Groq APIs failed. Please check your API keys and try again.\n' +
          `Gemini error: ${geminiError}\n` +
          `Groq error: ${groqError}`,
      );
    }
  }

  console.log(`[JEDI] Audit completed via ${provider}`);

  const parsed = extractJSON(rawText);
  return validateResults(parsed);
}
