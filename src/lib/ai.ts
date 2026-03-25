/**
 * @module ai
 * @description AI client with built-in guardrails for legal applications.
 * Wraps OpenAI with citation requirements, legal advice prohibition,
 * and confidence scoring.
 */

import { v4 as uuid } from 'uuid';
import type { AIQueryConfig, AIQueryResult, AICitation, AIGuardrails } from '../types';

/** Default guardrail configuration */
const DEFAULT_GUARDRAILS: AIGuardrails = {
  requireCitations: true,
  maxConfidenceWithoutSource: 0.3,
  prohibitLegalAdvice: true,
};

/**
 * Query the AI with automatic guardrails.
 * Ensures responses include citations, avoid direct legal advice,
 * and flag low-confidence areas.
 *
 * @param query - The user's question
 * @param config - Query configuration with guardrails
 * @returns AI response with citations and guardrail flags
 */
export async function queryAI(
  query: string,
  config: Partial<AIQueryConfig> & { query?: string }
): Promise<AIQueryResult> {
  const guardrails = { ...DEFAULT_GUARDRAILS, ...config.guardrails };
  const flags: string[] = [];

  // Pre-query guardrail checks
  if (guardrails.prohibitLegalAdvice) {
    const advicePatterns = [
      /should\s+i\s+(sue|file|divorce|plead)/i,
      /what\s+should\s+i\s+do/i,
      /give\s+me\s+legal\s+advice/i,
    ];

    const requestsAdvice = advicePatterns.some((p) => p.test(query));
    if (requestsAdvice) {
      flags.push('LEGAL_ADVICE_REQUESTED');
    }
  }

  // Build the system prompt with guardrails
  const systemPrompt = buildSystemPrompt(guardrails, config.jurisdiction);

  // Call the AI provider
  const response = await callAIProvider(systemPrompt, query);

  // Post-response guardrail checks
  const citations = extractCitations(response.text);

  if (guardrails.requireCitations && citations.length === 0) {
    flags.push('NO_CITATIONS_IN_RESPONSE');
  }

  // Calculate confidence based on citations and response quality
  const confidence = calculateConfidence(response.text, citations, guardrails);

  if (confidence < guardrails.maxConfidenceWithoutSource && citations.length === 0) {
    flags.push('LOW_CONFIDENCE_NO_SOURCE');
  }

  return {
    id: uuid(),
    response: response.text,
    confidence,
    citations,
    guardrailFlags: flags,
    model: response.model,
    tokensUsed: response.tokensUsed,
  };
}

/**
 * Build a system prompt that enforces guardrail behavior.
 */
function buildSystemPrompt(guardrails: AIGuardrails, jurisdiction?: string): string {
  const parts: string[] = [
    'You are a legal information assistant. You provide legal information, NOT legal advice.',
    'Always clarify that you are not a lawyer and users should consult an attorney.',
  ];

  if (guardrails.requireCitations) {
    parts.push(
      'Cite specific statutes, cases, or regulations for every factual claim.',
      'Format citations as [SOURCE: Title, Section/Citation].'
    );
  }

  if (guardrails.prohibitLegalAdvice) {
    parts.push(
      'Never tell users what they should do. Instead, explain their options and the relevant law.',
      'Use phrases like "under [law], the options include..." rather than "you should...".'
    );
  }

  if (jurisdiction) {
    parts.push(`Focus on ${jurisdiction} law and procedure when applicable.`);
  }

  return parts.join('\n');
}

/**
 * Call the AI provider (OpenAI or compatible API).
 * In production, this integrates with the OpenAI SDK.
 */
async function callAIProvider(
  systemPrompt: string,
  userQuery: string
): Promise<{ text: string; model: string; tokensUsed: number }> {
  // Placeholder — in production, use OpenAI SDK
  // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  // const completion = await openai.chat.completions.create({
  //   model: process.env.AI_MODEL ?? 'gpt-4',
  //   messages: [
  //     { role: 'system', content: systemPrompt },
  //     { role: 'user', content: userQuery }
  //   ],
  // });

  return {
    text: `[Placeholder response for: ${userQuery}]`,
    model: process.env.AI_MODEL ?? 'gpt-4',
    tokensUsed: 0,
  };
}

/**
 * Extract citations from AI response text.
 * Looks for patterns like [SOURCE: Title, Citation].
 */
function extractCitations(text: string): AICitation[] {
  const pattern = /\[SOURCE:\s*(.+?),\s*(.+?)\]/g;
  const citations: AICitation[] = [];
  let match;

  while ((match = pattern.exec(text)) !== null) {
    citations.push({
      claim: '', // Populated by surrounding context
      source: match[1].trim(),
      sourceType: 'legal',
      url: undefined,
    });
  }

  return citations;
}

/**
 * Calculate response confidence based on citations and guardrail compliance.
 */
function calculateConfidence(
  text: string,
  citations: AICitation[],
  guardrails: AIGuardrails
): number {
  let score = 0.5;

  // More citations = higher confidence
  score += Math.min(citations.length * 0.1, 0.3);

  // Penalize if citations were required but missing
  if (guardrails.requireCitations && citations.length === 0) {
    score -= 0.2;
  }

  // Response length factor (very short responses may be low quality)
  if (text.length > 200) score += 0.1;
  if (text.length > 500) score += 0.1;

  return Math.max(0, Math.min(1, score));
}
