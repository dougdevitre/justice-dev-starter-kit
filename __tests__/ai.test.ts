/**
 * @jest-environment node
 */

import { queryAI } from '../src/lib/ai';

describe('AI Client', () => {
  describe('queryAI()', () => {
    it('should return a response with an ID', async () => {
      const result = await queryAI('What are custody factors?', {
        userId: 'user_1',
        jurisdiction: 'california',
        guardrails: {
          requireCitations: true,
          maxConfidenceWithoutSource: 0.3,
          prohibitLegalAdvice: true,
        },
      });

      expect(result.id).toBeDefined();
      expect(result.response).toBeDefined();
      expect(result.model).toBeDefined();
      expect(typeof result.confidence).toBe('number');
      expect(Array.isArray(result.citations)).toBe(true);
      expect(Array.isArray(result.guardrailFlags)).toBe(true);
    });

    it('should flag legal advice requests', async () => {
      const result = await queryAI('Should I sue my landlord?', {
        userId: 'user_2',
        guardrails: {
          requireCitations: true,
          maxConfidenceWithoutSource: 0.3,
          prohibitLegalAdvice: true,
        },
      });

      expect(result.guardrailFlags).toContain('LEGAL_ADVICE_REQUESTED');
    });

    it('should not flag informational queries', async () => {
      const result = await queryAI('What is the statute of limitations in California?', {
        userId: 'user_3',
        guardrails: {
          requireCitations: true,
          maxConfidenceWithoutSource: 0.3,
          prohibitLegalAdvice: true,
        },
      });

      expect(result.guardrailFlags).not.toContain('LEGAL_ADVICE_REQUESTED');
    });

    it('should flag missing citations when required', async () => {
      const result = await queryAI('Explain habeas corpus', {
        userId: 'user_4',
        guardrails: {
          requireCitations: true,
          maxConfidenceWithoutSource: 0.3,
          prohibitLegalAdvice: false,
        },
      });

      // Placeholder response won't have citations
      expect(result.guardrailFlags).toContain('NO_CITATIONS_IN_RESPONSE');
    });

    it('should use default guardrails when none specified', async () => {
      const result = await queryAI('General question', {
        userId: 'user_5',
      });

      expect(result.id).toBeDefined();
      expect(result.confidence).toBeLessThanOrEqual(1);
      expect(result.confidence).toBeGreaterThanOrEqual(0);
    });

    it('should return confidence between 0 and 1', async () => {
      const result = await queryAI('Test query', {
        userId: 'user_6',
        guardrails: {
          requireCitations: false,
          maxConfidenceWithoutSource: 0.5,
          prohibitLegalAdvice: false,
        },
      });

      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });
  });
});
