/**
 * @module audit
 * @description Complete audit logging for justice applications.
 * Records all user actions with timestamps, metadata, and IP addresses
 * for compliance and quality assurance.
 */

import { v4 as uuid } from 'uuid';
import type { AuditLogEntry, AuditAction } from '../types';

/** Audit log input */
export interface AuditInput {
  /** The action being logged */
  action: AuditAction;
  /** User performing the action */
  userId: string;
  /** Resource type (e.g., 'document', 'case', 'query') */
  resource?: string;
  /** Resource identifier */
  resourceId?: string;
  /** Client IP address */
  ipAddress?: string;
  /** Additional context */
  metadata?: Record<string, unknown>;
}

/** In-memory audit store (replace with database in production) */
const auditStore: AuditLogEntry[] = [];

/**
 * Log an audit event.
 *
 * @param input - The audit event details
 * @returns The created audit log entry
 */
export async function logAudit(input: AuditInput): Promise<AuditLogEntry> {
  const entry: AuditLogEntry = {
    id: uuid(),
    userId: input.userId,
    action: input.action,
    resource: input.resource,
    resourceId: input.resourceId,
    ipAddress: input.ipAddress,
    metadata: sanitizeMetadata(input.metadata),
    timestamp: new Date().toISOString(),
  };

  auditStore.push(entry);

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[AUDIT] ${entry.action} by ${entry.userId} at ${entry.timestamp}`);
  }

  return entry;
}

/**
 * Query audit logs for a user.
 *
 * @param userId - The user ID
 * @param options - Query options
 * @returns Matching audit entries
 */
export async function queryAuditLogs(
  userId: string,
  options?: {
    action?: AuditAction;
    startDate?: string;
    endDate?: string;
    limit?: number;
  }
): Promise<AuditLogEntry[]> {
  let results = auditStore.filter((e) => e.userId === userId);

  if (options?.action) {
    results = results.filter((e) => e.action === options.action);
  }

  if (options?.startDate) {
    results = results.filter((e) => e.timestamp >= options.startDate!);
  }

  if (options?.endDate) {
    results = results.filter((e) => e.timestamp <= options.endDate!);
  }

  // Sort by newest first
  results.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  if (options?.limit) {
    results = results.slice(0, options.limit);
  }

  return results;
}

/**
 * Get audit summary statistics for a user.
 *
 * @param userId - The user ID
 * @returns Summary of actions by type
 */
export async function getAuditSummary(
  userId: string
): Promise<Record<AuditAction, number>> {
  const counts = {} as Record<AuditAction, number>;

  for (const entry of auditStore) {
    if (entry.userId === userId) {
      counts[entry.action] = (counts[entry.action] ?? 0) + 1;
    }
  }

  return counts;
}

/**
 * Extract IP address from a request.
 *
 * @param request - The incoming request
 * @returns Client IP address
 */
export function getClientIP(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  );
}

/**
 * Sanitize metadata to remove sensitive fields.
 * Strips passwords, tokens, and keys from audit metadata.
 */
function sanitizeMetadata(
  metadata?: Record<string, unknown>
): Record<string, unknown> | undefined {
  if (!metadata) return undefined;

  const sensitive = ['password', 'token', 'secret', 'key', 'authorization'];
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(metadata)) {
    if (sensitive.some((s) => key.toLowerCase().includes(s))) {
      sanitized[key] = '[REDACTED]';
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Get total audit entry count (for testing/admin).
 */
export function getAuditCount(): number {
  return auditStore.length;
}

/**
 * Clear audit store (for testing only).
 */
export function clearAuditStore(): void {
  auditStore.length = 0;
}
