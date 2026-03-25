/**
 * @module @justice-os/starter-kit/types
 * @description Core type definitions for the Justice Dev Starter Kit.
 */

/** User roles in the system */
export type UserRole = 'admin' | 'attorney' | 'litigant' | 'public';

/** Subscription tiers */
export type SubscriptionTier = 'free' | 'starter' | 'professional';

/** Subscription status */
export type SubscriptionStatus = 'active' | 'past_due' | 'cancelled' | 'trialing' | 'unpaid';

/** Document types */
export type DocumentType = 'pdf' | 'docx';

/** Audit action types */
export type AuditAction =
  | 'login'
  | 'logout'
  | 'ai_query'
  | 'document_created'
  | 'document_downloaded'
  | 'file_uploaded'
  | 'file_deleted'
  | 'subscription_changed'
  | 'role_changed'
  | 'settings_updated';

/**
 * Authenticated user with role and subscription info.
 */
export interface AuthUser {
  /** Unique user identifier */
  id: string;
  /** Email address */
  email: string;
  /** Display name */
  name: string;
  /** User role */
  role: UserRole;
  /** External auth provider ID (Clerk or Cognito) */
  externalId: string;
  /** Stripe customer ID */
  stripeCustomerId?: string;
  /** Current subscription tier */
  tier: SubscriptionTier;
  /** Subscription status */
  subscriptionStatus: SubscriptionStatus;
}

/**
 * Subscription details.
 */
export interface Subscription {
  id: string;
  userId: string;
  stripeSubscriptionId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelledAt?: string;
}

/**
 * AI query configuration.
 */
export interface AIQueryConfig {
  /** The question or prompt */
  query: string;
  /** Legal jurisdiction for scoping */
  jurisdiction?: string;
  /** User making the query */
  userId: string;
  /** Guardrail settings */
  guardrails: AIGuardrails;
}

/**
 * AI safety guardrail configuration.
 */
export interface AIGuardrails {
  /** Require citations for all claims */
  requireCitations: boolean;
  /** Max confidence score allowed without source */
  maxConfidenceWithoutSource: number;
  /** Prevent AI from giving direct legal advice */
  prohibitLegalAdvice: boolean;
  /** Additional prohibited topics */
  prohibitedTopics?: string[];
}

/**
 * AI query result.
 */
export interface AIQueryResult {
  id: string;
  response: string;
  confidence: number;
  citations: AICitation[];
  guardrailFlags: string[];
  model: string;
  tokensUsed: number;
}

/**
 * A citation from the AI response.
 */
export interface AICitation {
  claim: string;
  source: string;
  sourceType: string;
  url?: string;
}

/**
 * Audit log entry.
 */
export interface AuditLogEntry {
  id: string;
  userId: string;
  action: AuditAction;
  resource?: string;
  resourceId?: string;
  ipAddress?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

/**
 * Document generation request.
 */
export interface DocumentRequest {
  /** Template identifier */
  templateId: string;
  /** Output format */
  type: DocumentType;
  /** Template variables */
  variables: Record<string, string | number | boolean>;
  /** User generating the document */
  userId: string;
}

/**
 * Feature gating configuration by tier.
 */
export interface TierFeatures {
  maxAIQueriesPerMonth: number;
  maxDocuments: number;
  maxStorageMB: number;
  customTemplates: boolean;
  auditExport: boolean;
  apiAccess: boolean;
  prioritySupport: boolean;
}

/**
 * Tier feature limits.
 */
export const TIER_LIMITS: Record<SubscriptionTier, TierFeatures> = {
  free: {
    maxAIQueriesPerMonth: 10,
    maxDocuments: 5,
    maxStorageMB: 50,
    customTemplates: false,
    auditExport: false,
    apiAccess: false,
    prioritySupport: false,
  },
  starter: {
    maxAIQueriesPerMonth: 100,
    maxDocuments: 50,
    maxStorageMB: 500,
    customTemplates: true,
    auditExport: false,
    apiAccess: true,
    prioritySupport: false,
  },
  professional: {
    maxAIQueriesPerMonth: -1, // Unlimited
    maxDocuments: -1,
    maxStorageMB: 5000,
    customTemplates: true,
    auditExport: true,
    apiAccess: true,
    prioritySupport: true,
  },
};
