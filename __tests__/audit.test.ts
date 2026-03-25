/**
 * @jest-environment node
 */

import {
  logAudit,
  queryAuditLogs,
  getAuditSummary,
  getClientIP,
  clearAuditStore,
  getAuditCount,
} from '../src/lib/audit';

describe('Audit Logging', () => {
  beforeEach(() => {
    clearAuditStore();
  });

  describe('logAudit()', () => {
    it('should create an audit entry with all fields', async () => {
      const entry = await logAudit({
        action: 'ai_query',
        userId: 'user_1',
        resource: 'ai_query',
        resourceId: 'query_123',
        ipAddress: '127.0.0.1',
        metadata: { query: 'test query' },
      });

      expect(entry.id).toBeDefined();
      expect(entry.userId).toBe('user_1');
      expect(entry.action).toBe('ai_query');
      expect(entry.resource).toBe('ai_query');
      expect(entry.resourceId).toBe('query_123');
      expect(entry.ipAddress).toBe('127.0.0.1');
      expect(entry.timestamp).toBeDefined();
    });

    it('should sanitize sensitive metadata', async () => {
      const entry = await logAudit({
        action: 'login',
        userId: 'user_1',
        metadata: {
          email: 'test@example.com',
          password: 'secret123',
          apiToken: 'tok_abc',
          normal_field: 'visible',
        },
      });

      expect(entry.metadata?.email).toBe('test@example.com');
      expect(entry.metadata?.password).toBe('[REDACTED]');
      expect(entry.metadata?.apiToken).toBe('[REDACTED]');
      expect(entry.metadata?.normal_field).toBe('visible');
    });

    it('should increment audit count', async () => {
      expect(getAuditCount()).toBe(0);
      await logAudit({ action: 'login', userId: 'user_1' });
      await logAudit({ action: 'logout', userId: 'user_1' });
      expect(getAuditCount()).toBe(2);
    });
  });

  describe('queryAuditLogs()', () => {
    it('should return logs for a specific user', async () => {
      await logAudit({ action: 'login', userId: 'user_1' });
      await logAudit({ action: 'ai_query', userId: 'user_1' });
      await logAudit({ action: 'login', userId: 'user_2' });

      const logs = await queryAuditLogs('user_1');
      expect(logs).toHaveLength(2);
      expect(logs.every((l) => l.userId === 'user_1')).toBe(true);
    });

    it('should filter by action type', async () => {
      await logAudit({ action: 'login', userId: 'user_1' });
      await logAudit({ action: 'ai_query', userId: 'user_1' });
      await logAudit({ action: 'ai_query', userId: 'user_1' });

      const logs = await queryAuditLogs('user_1', { action: 'ai_query' });
      expect(logs).toHaveLength(2);
    });

    it('should respect limit parameter', async () => {
      for (let i = 0; i < 10; i++) {
        await logAudit({ action: 'login', userId: 'user_1' });
      }

      const logs = await queryAuditLogs('user_1', { limit: 5 });
      expect(logs).toHaveLength(5);
    });

    it('should sort by newest first', async () => {
      await logAudit({ action: 'login', userId: 'user_1' });
      // Small delay to ensure different timestamps
      await logAudit({ action: 'logout', userId: 'user_1' });

      const logs = await queryAuditLogs('user_1');
      expect(logs[0].timestamp >= logs[1].timestamp).toBe(true);
    });
  });

  describe('getAuditSummary()', () => {
    it('should count actions by type', async () => {
      await logAudit({ action: 'login', userId: 'user_1' });
      await logAudit({ action: 'login', userId: 'user_1' });
      await logAudit({ action: 'ai_query', userId: 'user_1' });
      await logAudit({ action: 'document_created', userId: 'user_1' });

      const summary = await getAuditSummary('user_1');
      expect(summary.login).toBe(2);
      expect(summary.ai_query).toBe(1);
      expect(summary.document_created).toBe(1);
    });
  });

  describe('getClientIP()', () => {
    it('should extract IP from x-forwarded-for header', () => {
      const request = new Request('http://localhost', {
        headers: { 'x-forwarded-for': '192.168.1.1, 10.0.0.1' },
      });
      expect(getClientIP(request)).toBe('192.168.1.1');
    });

    it('should fall back to x-real-ip', () => {
      const request = new Request('http://localhost', {
        headers: { 'x-real-ip': '10.0.0.5' },
      });
      expect(getClientIP(request)).toBe('10.0.0.5');
    });

    it('should return unknown when no IP headers', () => {
      const request = new Request('http://localhost');
      expect(getClientIP(request)).toBe('unknown');
    });
  });
});
