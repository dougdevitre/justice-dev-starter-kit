# Integration Architecture Guide
## Justice OS — 72-Project Ecosystem Technical Reference

**Version:** 3.1 | **Date:** 2025 | **Audience:** Engineering, DevOps, Integration Teams

---

## Table of Contents

1. [Overview & Architecture Philosophy](#1-overview--architecture-philosophy)
2. [72-Project Integration Map](#2-72-project-integration-map)
3. [Common Data Model (CDM)](#3-common-data-model-cdm)
4. [Data Standardization Schemas](#4-data-standardization-schemas)
5. [API Specifications](#5-api-specifications)
6. [Authentication & Authorization](#6-authentication--authorization)
7. [Event-Driven Architecture](#7-event-driven-architecture)
8. [Microservices Communication](#8-microservices-communication)
9. [Scaling Patterns](#9-scaling-patterns)
10. [Real-time Sync Mechanisms](#10-real-time-sync-mechanisms)
11. [Integration Examples with Real Use Cases](#11-integration-examples-with-real-use-cases)
12. [Deployment Topologies](#12-deployment-topologies)
13. [Security & Compliance Architecture](#13-security--compliance-architecture)

---

## 1. Overview & Architecture Philosophy

Justice OS is built on a set of principled architectural decisions designed to ensure long-term maintainability, interoperability, and security across 72 integrated projects serving diverse legal technology use cases.

### Guiding Principles

**Open Standards First**
All data formats, protocols, and interfaces use open, documented standards. Proprietary protocols are prohibited in the Justice OS core. This ensures that any organization can integrate, audit, or migrate data without vendor permission.

**API-First Design**
Every service exposes a versioned, documented API as its primary interface. UIs, CLIs, and internal services consume the same APIs as external integrations. This creates a consistent, testable surface and enables the ecosystem's composability.

**Event-Driven by Default**
State changes in the system are propagated via immutable events on a durable event bus. Services react to events rather than polling, enabling loose coupling, audit trails, and replay capabilities essential for legal compliance.

**Backward Compatibility as a Contract**
Published APIs maintain backward compatibility for a minimum of 18 months. Breaking changes require a version increment, a migration guide, and a deprecation notice. Legal organizations cannot accept surprise breaking changes in production systems.

**Defense in Depth**
Security is implemented at every layer: network, application, data, and identity. No single control failure should expose sensitive legal data. Given the attorney-client privilege and confidentiality obligations involved, security is a first-class architectural concern, not an afterthought.

---

## 2. 72-Project Integration Map

### Category 1: Case Management (10 Projects)

| Project Name | Description | Integration Type | Status |
|---|---|---|---|
| `justice-core-cases` | Primary case lifecycle management: intake through disposition | REST + Events | Stable |
| `case-tracker` | Real-time case status dashboard for clients and attorneys | GraphQL + WebSocket | Stable |
| `deadline-engine` | Jurisdiction-aware deadline calculation and notifications | REST + Events | Stable |
| `docket-monitor` | Automated court docket polling and change detection | REST (outbound) | Stable |
| `case-assignment` | Attorney/staff assignment with load balancing and conflict checks | REST + Events | Stable |
| `matter-types` | Configurable matter type registry (family, housing, immigration, etc.) | REST | Stable |
| `case-merge` | Duplicate detection and case consolidation workflows | REST | Beta |
| `case-archive` | Long-term retention, legal hold, and FOIA response tooling | REST | Beta |
| `multi-jurisdiction` | Cross-jurisdictional case management with procedure mapping | GraphQL | Beta |
| `case-analytics` | Case outcome analytics, time-to-resolution, and trend analysis | GraphQL | Planned |

### Category 2: Document Assembly & Forms (10 Projects)

| Project Name | Description | Integration Type | Status |
|---|---|---|---|
| `guided-interview` | HotDocs/A2J Author-style interview engine for form completion | REST + Events | Stable |
| `form-library` | Jurisdiction-specific legal form repository (50K+ forms) | REST | Stable |
| `pdf-assembler` | Dynamic PDF generation with court-formatted output | REST | Stable |
| `docx-templates` | Word document template engine with variable substitution | REST | Stable |
| `form-validator` | Real-time form field validation against court requirements | REST | Stable |
| `translation-service` | Multilingual form translation (18 languages) | REST + Events | Stable |
| `e-signature` | Electronic signature capture with court-accepted standards | REST + Webhook | Stable |
| `document-version` | Version control and change tracking for legal documents | REST + Events | Beta |
| `form-analytics` | Abandonment tracking and completion rate optimization | REST | Beta |
| `plain-language` | AI-powered legal jargon simplification for client communications | REST | Planned |

### Category 3: Legal Research & AI (8 Projects)

| Project Name | Description | Integration Type | Status |
|---|---|---|---|
| `case-law-search` | Integrated search across CourtListener, CAP, and OpenJurist | REST | Stable |
| `statute-tracker` | Legislative change monitoring with affected-case alerts | REST + Events | Stable |
| `brief-analyzer` | AI-assisted motion and brief quality review | REST | Beta |
| `citation-manager` | Legal citation formatting (Bluebook, ALWD, state formats) | REST | Stable |
| `ai-intake-assistant` | LLM-powered guided intake for complex legal situations | REST + WebSocket | Beta |
| `precedent-matcher` | Semantic similarity matching between open cases and precedent | GraphQL | Beta |
| `regulatory-monitor` | Federal and state regulation change tracking | REST + Events | Planned |
| `legal-memo-generator` | AI-assisted legal memorandum drafting from case facts | REST | Planned |

### Category 4: Court Integration & e-Filing (8 Projects)

| Project Name | Description | Integration Type | Status |
|---|---|---|---|
| `efiling-gateway` | Universal e-filing adapter supporting EFM v4 and state variants | REST + Events | Stable |
| `pacer-integration` | Federal court PACER/CM-ECF integration for document retrieval | REST | Stable |
| `tyler-adapter` | Tyler Technologies Odyssey API integration layer | REST | Stable |
| `court-calendar` | Court scheduling integration with conflict detection | REST + Events | Stable |
| `filing-status` | Real-time e-filing status polling and notification | REST + Events | Stable |
| `service-of-process` | Electronic service of process tracking and confirmation | REST + Webhook | Beta |
| `fee-waiver` | Automated fee waiver application and approval workflow | REST + Events | Beta |
| `remote-hearing` | Video hearing scheduling and link distribution | REST + Events | Beta |

### Category 5: Client Intake & CRM (8 Projects)

| Project Name | Description | Integration Type | Status |
|---|---|---|---|
| `intake-portal` | Multilingual, mobile-first public intake form system | REST + Events | Stable |
| `eligibility-screener` | LSC income/asset eligibility calculation engine | REST | Stable |
| `conflict-checker` | Party conflict of interest detection across cases | REST | Stable |
| `client-portal` | Secure client document exchange and communication hub | GraphQL + WebSocket | Stable |
| `referral-network` | Legal aid referral routing and warm handoff workflows | REST + Events | Stable |
| `waitlist-manager` | Capacity-aware client waitlist with priority scoring | REST + Events | Beta |
| `follow-up-scheduler` | Automated follow-up reminders and re-engagement | REST + Events | Beta |
| `outcome-tracker` | Post-case closure client outcome survey and tracking | REST | Beta |

### Category 6: Analytics & Reporting (8 Projects)

| Project Name | Description | Integration Type | Status |
|---|---|---|---|
| `lsc-reporter` | LSC 9-digit case category and outcome reporting | REST | Stable |
| `grant-dashboard` | Foundation and government grant compliance reporting | GraphQL | Stable |
| `impact-metrics` | Outcome measurement and social impact quantification | GraphQL | Stable |
| `capacity-planner` | Staffing and caseload forecasting tools | GraphQL | Beta |
| `funding-analyzer` | IOLTA and grant revenue tracking against case costs | GraphQL | Beta |
| `equity-analytics` | Demographic equity analysis for client services | GraphQL | Beta |
| `data-warehouse` | ETL pipeline to analytics data warehouse (BigQuery/Redshift) | Event-driven | Planned |
| `public-dashboard` | Public-facing impact transparency dashboard | GraphQL | Planned |

### Category 7: Security & Identity (8 Projects)

| Project Name | Description | Integration Type | Status |
|---|---|---|---|
| `auth-service` | OAuth2/OIDC identity provider with MFA support | REST (OAuth2) | Stable |
| `rbac-engine` | Role-based access control with legal-specific role definitions | REST | Stable |
| `audit-logger` | Immutable audit trail for all data access and changes | Events | Stable |
| `encryption-service` | Key management and field-level encryption for PII | REST | Stable |
| `privilege-guard` | Attorney-client privilege compartmentalization controls | REST | Stable |
| `session-manager` | Secure session handling with idle timeout and device tracking | REST | Stable |
| `compliance-scanner` | Continuous HIPAA/GDPR/FERPA compliance posture monitoring | Events | Beta |
| `breach-response` | Automated breach detection and notification workflow | Events | Planned |

### Category 8: Communications & Notifications (10 Projects)

| Project Name | Description | Integration Type | Status |
|---|---|---|---|
| `sms-gateway` | Two-way SMS for client updates and reminders | REST + Webhook | Stable |
| `email-service` | Transactional email with deliverability optimization | REST + Events | Stable |
| `push-notifications` | Mobile push notification service (iOS/Android) | REST | Stable |
| `multilingual-sms` | Translated SMS generation and delivery | REST + Events | Stable |
| `court-notice-parser` | Automated court notice parsing and forwarding to clients | REST + Events | Stable |
| `appointment-reminders` | Hearing and appointment reminder automation | REST + Events | Stable |
| `chatbot-intake` | SMS/web chatbot for 24/7 preliminary intake | REST + WebSocket | Beta |
| `interpreter-scheduler` | Court interpreter scheduling and confirmation | REST + Events | Beta |
| `mail-merge-service` | Batch correspondence generation and mailing | REST | Beta |
| `notification-preferences` | Per-client communication channel preference management | REST | Planned |

---

## 3. Common Data Model (CDM)

The Common Data Model defines the canonical data structures shared across all 72 projects. All services serialize to/from these types. The CDM is versioned independently and changes are managed through a formal RFC process.

### Core TypeScript Interfaces

```typescript
// ============================================================
// LegalCase — Core case entity
// ============================================================
interface LegalCase {
  id: string;                        // UUID v4
  caseNumber: string;                // Jurisdiction-assigned case number
  title: string;                     // Human-readable case title
  matterType: MatterType;            // enum: FAMILY | HOUSING | IMMIGRATION | CONSUMER | CRIMINAL | OTHER
  status: CaseStatus;                // enum: INTAKE | ACTIVE | CLOSED | APPEALED | ARCHIVED
  jurisdiction: Jurisdiction;        // Embedded jurisdiction object
  parties: Party[];                  // Plaintiff(s), defendant(s), third parties
  filingDate: ISO8601DateTime;       // Date case was filed or opened
  closeDate?: ISO8601DateTime;       // Date case was closed (optional)
  assignedAttorney?: Attorney;       // Assigned attorney (optional for unassigned)
  documents: Document[];             // Associated documents
  hearings: HearingEvent[];          // Scheduled and past hearings
  notes: CaseNote[];                 // Internal case notes
  metadata: Record<string, unknown>; // Extensible key-value metadata
  createdAt: ISO8601DateTime;
  updatedAt: ISO8601DateTime;
  tenantId: string;                  // Multi-tenant isolation key
}

// Example JSON:
// {
//   "id": "550e8400-e29b-41d4-a716-446655440000",
//   "caseNumber": "2024-FD-00123",
//   "title": "Smith v. Jones — Divorce Petition",
//   "matterType": "FAMILY",
//   "status": "ACTIVE",
//   "jurisdiction": { "state": "CA", "county": "Los Angeles", "courtCode": "LASC" },
//   "parties": [...],
//   "filingDate": "2024-03-15T00:00:00Z",
//   "tenantId": "legal-aid-la-001"
// }

// ============================================================
// Party — Individual or organization involved in a case
// ============================================================
interface Party {
  id: string;
  role: PartyRole;                   // enum: PLAINTIFF | DEFENDANT | PETITIONER | RESPONDENT | THIRD_PARTY
  type: PartyType;                   // enum: INDIVIDUAL | ORGANIZATION
  firstName?: string;
  lastName?: string;
  organizationName?: string;
  dateOfBirth?: ISO8601Date;
  ssn?: string;                      // Encrypted at rest; never logged
  address: Address;
  phone?: string;
  email?: string;
  preferredLanguage: LanguageCode;   // BCP-47 language tag (e.g., "es", "zh-Hans")
  isRepresented: boolean;
  representingAttorney?: Attorney;
  income?: IncomeData;               // For eligibility screening
}

// ============================================================
// Document — Legal document entity
// ============================================================
interface Document {
  id: string;
  caseId: string;
  filename: string;
  mimeType: string;                  // "application/pdf", "application/vnd.openxmlformats-..."
  documentType: DocumentType;        // enum: PETITION | MOTION | ORDER | EVIDENCE | CORRESPONDENCE | FORM
  storageKey: string;                // S3/GCS object key (never public URL)
  checksum: string;                  // SHA-256 of document content
  sizeBytes: number;
  isPrivileged: boolean;             // Attorney-client privilege flag
  eFilingStatus?: EFilingStatus;     // enum: PENDING | SUBMITTED | ACCEPTED | REJECTED
  signatureStatus?: SignatureStatus; // enum: UNSIGNED | PARTIALLY_SIGNED | FULLY_SIGNED
  uploadedBy: string;                // User ID
  uploadedAt: ISO8601DateTime;
  metadata: DocumentMetadata;
}

// ============================================================
// CourtFiling — e-Filing submission record
// ============================================================
interface CourtFiling {
  id: string;
  caseId: string;
  filingType: string;                // "INITIAL_COMPLAINT" | "MOTION" | "RESPONSE" | "APPEAL"
  documents: string[];               // Document IDs included in this filing
  submittedAt: ISO8601DateTime;
  filingStatus: FilingStatus;        // enum: DRAFT | SUBMITTED | PENDING_REVIEW | ACCEPTED | REJECTED
  confirmationNumber?: string;       // Court-issued confirmation
  rejectionReason?: string;
  efmTransactionId?: string;         // Electronic Filing Manager transaction reference
  courtCode: string;
  feeAmount: number;                 // In cents
  feeWaiverApproved: boolean;
  submittedByUserId: string;
}

// ============================================================
// LegalAidClient — Extended client profile for legal aid context
// ============================================================
interface LegalAidClient extends Party {
  intakeDate: ISO8601DateTime;
  eligibilityStatus: EligibilityStatus; // enum: ELIGIBLE | INELIGIBLE | PENDING | REFERRED_OUT
  householdSize: number;
  annualIncome: number;              // In cents
  federalPovertyPercentage: number;  // Calculated field
  caseHistory: string[];             // Prior case IDs
  referralSource: string;
  lscCategoryCode: string;           // LSC 9-digit matter code
  fundingSource: string;             // Grant or funding stream
  vulnerabilityFlags: string[];      // e.g., ["DOMESTIC_VIOLENCE", "VETERAN", "ELDERLY"]
  consentToShare: boolean;
  languageAccessNotes?: string;
}

// ============================================================
// Attorney — Attorney/staff member profile
// ============================================================
interface Attorney {
  id: string;
  firstName: string;
  lastName: string;
  barNumber: string;
  barJurisdiction: string;
  barStatus: BarStatus;              // enum: ACTIVE | INACTIVE | SUSPENDED
  email: string;
  phone?: string;
  organizationId: string;
  role: StaffRole;                   // enum: ATTORNEY | PARALEGAL | LAW_STUDENT | ADMIN | INTAKE_WORKER
  supervising?: boolean;
  supervisorId?: string;
  activeCaseCount: number;
  maxCaseload: number;
  practiceAreas: MatterType[];
  languages: LanguageCode[];
}

// ============================================================
// Jurisdiction — Court and geographic jurisdiction
// ============================================================
interface Jurisdiction {
  id: string;
  country: string;                   // ISO 3166-1 alpha-2
  state?: string;                    // ISO 3166-2 state/province code
  county?: string;
  courtName: string;
  courtCode: string;                 // Internal reference code
  courtType: CourtType;              // enum: TRIAL | APPELLATE | SUPREME | SPECIALTY | FEDERAL
  eFilingSupported: boolean;
  eFilingProvider?: string;          // "TYLER" | "ODYSSEY" | "FISERV" | "STATE_PORTAL"
  timezone: string;                  // IANA timezone (e.g., "America/Los_Angeles")
  procedureRules: string;            // URL to applicable rules
  formsLibraryCode: string;          // Reference to form library subset
}

// ============================================================
// HearingEvent — Scheduled court hearing
// ============================================================
interface HearingEvent {
  id: string;
  caseId: string;
  hearingType: string;               // "ARRAIGNMENT" | "TRIAL" | "MOTION_HEARING" | "STATUS_CONFERENCE"
  scheduledAt: ISO8601DateTime;
  location: HearingLocation;
  isRemote: boolean;
  videoUrl?: string;
  attendees: HearingAttendee[];
  interpreterRequired: boolean;
  interpreterLanguage?: LanguageCode;
  status: HearingStatus;             // enum: SCHEDULED | COMPLETED | CONTINUED | CANCELLED
  outcome?: string;
  judgeAssigned?: string;
  notes?: string;
}
```

---

## 4. Data Standardization Schemas

Justice OS uses JSON Schema Draft 2020-12 for all data validation. Schemas are published at `schema.justiceos.org/v{version}/{type}`.

### Case Data Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://schema.justiceos.org/v1/legal-case",
  "title": "LegalCase",
  "type": "object",
  "required": ["id", "matterType", "status", "jurisdiction", "filingDate", "tenantId"],
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid",
      "description": "Globally unique case identifier"
    },
    "caseNumber": {
      "type": "string",
      "maxLength": 50,
      "pattern": "^[A-Z0-9-]+$"
    },
    "matterType": {
      "type": "string",
      "enum": ["FAMILY", "HOUSING", "IMMIGRATION", "CONSUMER", "CRIMINAL", "BENEFITS", "OTHER"]
    },
    "status": {
      "type": "string",
      "enum": ["INTAKE", "ACTIVE", "CLOSED", "APPEALED", "ARCHIVED"]
    },
    "filingDate": {
      "type": "string",
      "format": "date-time"
    },
    "tenantId": {
      "type": "string",
      "minLength": 1,
      "maxLength": 100
    }
  },
  "additionalProperties": true
}
```

### Person Data Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://schema.justiceos.org/v1/party",
  "title": "Party",
  "type": "object",
  "required": ["id", "role", "type", "preferredLanguage", "isRepresented"],
  "properties": {
    "id": { "type": "string", "format": "uuid" },
    "role": {
      "type": "string",
      "enum": ["PLAINTIFF", "DEFENDANT", "PETITIONER", "RESPONDENT", "THIRD_PARTY", "WITNESS"]
    },
    "type": { "type": "string", "enum": ["INDIVIDUAL", "ORGANIZATION"] },
    "ssn": {
      "type": "string",
      "pattern": "^\\d{3}-\\d{2}-\\d{4}$",
      "description": "Stored encrypted; never included in API responses"
    },
    "preferredLanguage": {
      "type": "string",
      "pattern": "^[a-z]{2,3}(-[A-Z][a-z]{3})?(-[A-Z]{2})?$",
      "description": "BCP-47 language tag"
    }
  }
}
```

### Document Metadata Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://schema.justiceos.org/v1/document-metadata",
  "type": "object",
  "required": ["contentType", "pageCount", "language"],
  "properties": {
    "contentType": { "type": "string", "enum": ["COURT_FORM", "LEGAL_BRIEF", "EVIDENCE", "CORRESPONDENCE", "CONTRACT", "ORDER"] },
    "pageCount": { "type": "integer", "minimum": 1 },
    "language": { "type": "string", "pattern": "^[a-z]{2,3}$" },
    "ocrProcessed": { "type": "boolean" },
    "aiSummary": { "type": "string", "maxLength": 2000 },
    "tags": { "type": "array", "items": { "type": "string" }, "maxItems": 20 }
  }
}
```

**Validation Approach:** All incoming API requests are validated against JSON Schema at the API gateway layer before reaching service handlers. Validation errors return HTTP 422 with a structured error body indicating the failing field path and constraint. Schema versions are included in `Content-Type` headers using the `+json;schema=v1` convention.

---

## 5. API Specifications

### Base URL

```
https://api.justiceos.org/v1
```

All endpoints require `Authorization: Bearer {jwt}` and `X-Tenant-ID: {tenantId}` headers.

### REST API Examples

**Create Case**
```bash
curl -X POST https://api.justiceos.org/v1/cases \
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiJ9..." \
  -H "X-Tenant-ID: legal-aid-la-001" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Smith v. Jones — Eviction Defense",
    "matterType": "HOUSING",
    "jurisdiction": {
      "state": "CA",
      "county": "Los Angeles",
      "courtCode": "LASC-CIVIL"
    },
    "filingDate": "2025-01-15T00:00:00Z",
    "parties": [
      {
        "role": "DEFENDANT",
        "type": "INDIVIDUAL",
        "firstName": "Maria",
        "lastName": "Smith",
        "preferredLanguage": "es",
        "isRepresented": true
      }
    ]
  }'
```

**Get Case**
```bash
curl -X GET https://api.justiceos.org/v1/cases/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiJ9..." \
  -H "X-Tenant-ID: legal-aid-la-001"
```

**Upload Document**
```bash
curl -X POST https://api.justiceos.org/v1/cases/550e8400-e29b-41d4-a716-446655440000/documents \
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiJ9..." \
  -H "X-Tenant-ID: legal-aid-la-001" \
  -F "file=@answer-to-complaint.pdf" \
  -F 'metadata={"documentType":"MOTION","isPrivileged":true}'
```

**Search Cases**
```bash
curl -X GET "https://api.justiceos.org/v1/cases?matterType=HOUSING&status=ACTIVE&page=1&limit=25" \
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiJ9..." \
  -H "X-Tenant-ID: legal-aid-la-001"
```

**Create Client (Legal Aid)**
```bash
curl -X POST https://api.justiceos.org/v1/clients \
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiJ9..." \
  -H "X-Tenant-ID: legal-aid-la-001" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Maria",
    "lastName": "Smith",
    "dateOfBirth": "1985-06-12",
    "address": { "street": "123 Main St", "city": "Los Angeles", "state": "CA", "zip": "90001" },
    "householdSize": 3,
    "annualIncome": 3200000,
    "preferredLanguage": "es",
    "referralSource": "COURT_SELF_HELP",
    "lscCategoryCode": "32"
  }'
```

### GraphQL Query Examples

```graphql
# Complex case query with related entities
query GetCaseWithDetails($id: ID!) {
  case(id: $id) {
    id
    title
    status
    matterType
    jurisdiction {
      courtName
      state
      eFilingSupported
    }
    parties {
      role
      firstName
      lastName
      preferredLanguage
      isRepresented
    }
    documents {
      id
      filename
      documentType
      eFilingStatus
      uploadedAt
    }
    hearings {
      hearingType
      scheduledAt
      isRemote
      status
    }
    assignedAttorney {
      firstName
      lastName
      barNumber
      activeCaseCount
    }
  }
}

# Search cases with multiple filters
query SearchCases($filter: CaseFilterInput!, $pagination: PaginationInput!) {
  cases(filter: $filter, pagination: $pagination) {
    nodes {
      id
      title
      matterType
      status
      filingDate
    }
    pageInfo {
      hasNextPage
      endCursor
      totalCount
    }
  }
}
```

---

## 6. Authentication & Authorization

### OAuth2 Authorization Code Flow (ASCII Diagram)

```
Client App                Auth Service              Resource API
    |                         |                          |
    |---(1) GET /authorize --> |                          |
    |    (client_id,           |                          |
    |     redirect_uri,        |                          |
    |     scope, state)        |                          |
    |                         |                          |
    |<--(2) Login Page ------- |                          |
    |                         |                          |
    |---(3) POST credentials ->|                          |
    |                         |                          |
    |<--(4) Redirect + code -- |                          |
    |    (?code=AUTH_CODE      |                          |
    |     &state=STATE)        |                          |
    |                         |                          |
    |---(5) POST /token ------>|                          |
    |    (code, client_secret, |                          |
    |     redirect_uri)        |                          |
    |                         |                          |
    |<--(6) access_token,  --- |                          |
    |       refresh_token      |                          |
    |       id_token (OIDC)    |                          |
    |                         |                          |
    |---(7) GET /cases --------|------------------------> |
    |    Bearer {access_token} |                          |
    |                         |                          |
    |                         |<--(8) Introspect token -- |
    |                         |---(9) Token claims -----> |
    |                         |                          |
    |<------------------------|---- (10) 200 Response --- |
```

### JWT Structure

```json
{
  "header": {
    "alg": "RS256",
    "typ": "JWT",
    "kid": "justice-os-2025-01"
  },
  "payload": {
    "iss": "https://auth.justiceos.org",
    "sub": "user_01HXYZ123ABC",
    "aud": "https://api.justiceos.org",
    "exp": 1735689600,
    "iat": 1735686000,
    "jti": "unique-token-id-abc123",
    "tenantId": "legal-aid-la-001",
    "roles": ["attorney", "supervisor"],
    "permissions": [
      "cases:read",
      "cases:write",
      "documents:read",
      "documents:write",
      "clients:read",
      "clients:write",
      "reports:read"
    ],
    "organizationId": "org_legal_aid_la",
    "barNumber": "CA-123456",
    "mfaVerified": true
  }
}
```

### RBAC Model

| Role | Scope | Permissions |
|------|-------|-------------|
| `admin` | Tenant-wide | All permissions including user management, billing, configuration |
| `attorney` | Assigned cases | Read/write cases, documents, clients; create filings; view reports |
| `supervisor` | All org cases | All attorney permissions + reassignment, quality review, full reports |
| `paralegal` | Assigned cases | Read/write cases and documents; limited client data; no filing |
| `intake_worker` | Intake only | Create clients, run eligibility; no case management |
| `client` | Own data only | Read own case status, documents, hearing dates; submit documents |
| `court_clerk` | All filings | Read all filings for jurisdiction; update filing status; no case data |
| `legal_aid_worker` | Assigned cases | Same as attorney but flagged for supervision requirements |
| `readonly` | Org-wide | Read-only access to non-privileged case data |

---

## 7. Event-Driven Architecture

### Event Bus

Justice OS uses **Apache Kafka** as the primary event bus for high-throughput scenarios, with **Redis Streams** as a lightweight alternative for smaller deployments. All events are serialized as **Avro** with schemas registered in a Schema Registry.

### Event Types Catalog (20+ Events)

| Event Type | Producer | Consumers | Description |
|---|---|---|---|
| `case.created` | case-service | analytics, notifications, audit | New case opened |
| `case.updated` | case-service | analytics, audit, docket-monitor | Case data changed |
| `case.closed` | case-service | analytics, outcome-tracker, audit | Case closed with disposition |
| `case.assigned` | case-service | notifications, calendar, audit | Attorney assigned to case |
| `document.uploaded` | document-service | ai-analyzer, audit, notifications | New document added |
| `document.analyzed` | ai-service | case-service, attorney-notification | AI analysis complete |
| `document.signed` | signature-service | efiling-gateway, audit | Document signature complete |
| `filing.submitted` | efiling-gateway | notifications, case-service | e-Filing sent to court |
| `filing.accepted` | efiling-gateway | notifications, case-service, audit | Court accepted filing |
| `filing.rejected` | efiling-gateway | notifications, case-service, audit | Court rejected filing |
| `hearing.scheduled` | calendar-service | notifications, reminders, audit | Hearing added to calendar |
| `hearing.updated` | calendar-service | notifications, reminders | Hearing time/location changed |
| `hearing.reminder` | reminder-service | sms-gateway, email-service | 24h/1h hearing reminder sent |
| `client.intake_complete` | intake-service | case-service, eligibility, audit | Client intake submitted |
| `client.eligibility_determined` | eligibility-service | intake-service, notifications | Eligibility result available |
| `client.referred_out` | case-service | notifications, referral-network | Client referred to other org |
| `deadline.approaching` | deadline-engine | notifications, calendar-service | Deadline within threshold |
| `deadline.missed` | deadline-engine | supervisor-notification, audit | Deadline passed without action |
| `payment.received` | billing-service | case-service, audit | Fee payment processed |
| `fee_waiver.approved` | court-service | efiling-gateway, notifications | Fee waiver granted |
| `access.privileged_data` | privilege-guard | audit-logger | Attorney-privileged data accessed |
| `security.failed_login` | auth-service | audit-logger, breach-response | Multiple failed authentication |

### Event Schema

```typescript
interface JusticeOSEvent<T = unknown> {
  eventId: string;                   // UUID v4
  eventType: string;                 // dot-notation event type
  eventVersion: string;              // "1.0" | "1.1" | "2.0"
  producerService: string;           // Originating service name
  occurredAt: ISO8601DateTime;       // When event occurred (not processed)
  tenantId: string;                  // Multi-tenant isolation
  correlationId: string;             // Request chain tracing
  userId?: string;                   // Acting user (null for system events)
  payload: T;                        // Event-specific data
  metadata: {
    schemaVersion: string;
    environment: "production" | "staging" | "development";
    region: string;
  };
}

// Example: case.created event payload
interface CaseCreatedPayload {
  caseId: string;
  matterType: MatterType;
  jurisdiction: { state: string; courtCode: string };
  assignedAttorneyId?: string;
  intakeWorkerId: string;
}
```

### Consumer Group Patterns

```yaml
# Kafka consumer group configuration
consumer_groups:
  notifications-service:
    topics: [case.created, case.assigned, filing.accepted, filing.rejected, hearing.scheduled]
    group_id: notifications-cg
    auto_offset_reset: latest
    
  analytics-service:
    topics: [case.created, case.closed, client.intake_complete]
    group_id: analytics-cg
    auto_offset_reset: earliest  # Analytics needs full history
    
  audit-logger:
    topics: ["*"]  # Subscribes to all topics
    group_id: audit-cg
    auto_offset_reset: earliest
    retention_ms: 2592000000  # 30 days
```

### Dead Letter Queues

Events that fail processing after 3 retries are routed to dead letter topics (`{original-topic}.dlq`). A separate DLQ monitoring service alerts on DLQ accumulation and provides a replay interface for manual remediation.

---

## 8. Microservices Communication

### Service Mesh Approach

Justice OS uses **Istio** service mesh for all internal microservice communication, providing mutual TLS (mTLS), traffic management, and observability without application-layer code changes.

### gRPC for Internal Communication

```protobuf
// case_service.proto
syntax = "proto3";
package justice.v1;

service CaseService {
  rpc GetCase(GetCaseRequest) returns (CaseResponse);
  rpc CreateCase(CreateCaseRequest) returns (CaseResponse);
  rpc UpdateCase(UpdateCaseRequest) returns (CaseResponse);
  rpc SearchCases(SearchCasesRequest) returns (SearchCasesResponse);
  rpc StreamCaseUpdates(StreamRequest) returns (stream CaseEvent);
}

message GetCaseRequest {
  string case_id = 1;
  string tenant_id = 2;
}

message CaseResponse {
  string id = 1;
  string case_number = 2;
  string title = 3;
  CaseStatus status = 4;
  string matter_type = 5;
  google.protobuf.Timestamp created_at = 6;
}
```

### Circuit Breaker Pattern

```typescript
import CircuitBreaker from 'opossum';

const efilingOptions = {
  timeout: 5000,           // 5s timeout
  errorThresholdPercentage: 50,
  resetTimeout: 30000,     // 30s before retry
  volumeThreshold: 10,     // Min requests before tripping
};

const efilingBreaker = new CircuitBreaker(submitFiling, efilingOptions);

efilingBreaker.fallback(() => ({
  status: 'QUEUED_FOR_RETRY',
  message: 'e-Filing service temporarily unavailable. Your filing has been queued.',
  estimatedRetryAt: new Date(Date.now() + 30000).toISOString(),
}));

efilingBreaker.on('open', () => {
  logger.warn('e-filing circuit breaker OPEN — service degraded');
  metrics.increment('circuit_breaker.open', { service: 'efiling' });
});
```

---

## 9. Scaling Patterns

### Horizontal Scaling

All Justice OS services are designed as stateless containers, enabling horizontal pod autoscaling based on CPU, memory, and custom metrics (queue depth, request latency).

```yaml
# HPA for case-service
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: case-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: case-service
  minReplicas: 2
  maxReplicas: 50
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: External
    external:
      metric:
        name: kafka_consumer_lag
        selector:
          matchLabels:
            topic: case.created
      target:
        type: AverageValue
        averageValue: "1000"
```

### Database Sharding

The primary case database is sharded by `tenantId` using range-based sharding. Small tenants (legal aid orgs with <1,000 active cases) share database instances. Large tenants (statewide court systems, multi-state organizations) receive dedicated shards.

Sharding key strategy:
- **Tenant isolation**: Each tenant's data lives in a single shard — queries never cross shards
- **Even distribution**: Tenant IDs are hashed before shard assignment to prevent hot spots
- **Shard rebalancing**: Automated rebalancing when a shard exceeds 80% capacity

### Read Replicas

Write operations go to the primary PostgreSQL instance. Read operations for reports, dashboards, and search are served from read replicas with a maximum replication lag of 100ms. Replicas are deployed in the same availability zone as compute to minimize latency.

### CDN for Document Storage

All documents are stored in S3/GCS with pre-signed URLs for client access. Pre-signed URLs expire in 15 minutes. Frequently accessed documents (court orders, signed agreements) are cached at CloudFront/CloudFlare edge locations. Document metadata is served via API; document content is served directly from CDN.

---

## 10. Real-time Sync Mechanisms

### WebSocket Events

```typescript
// Client-side WebSocket connection for case updates
const ws = new WebSocket('wss://realtime.justiceos.org/v1/cases/CASE_ID/stream', {
  headers: { Authorization: `Bearer ${accessToken}` }
});

ws.on('message', (data: string) => {
  const event: CaseUpdateEvent = JSON.parse(data);
  switch (event.type) {
    case 'STATUS_CHANGED':
      updateCaseStatus(event.payload.newStatus);
      break;
    case 'DOCUMENT_UPLOADED':
      refreshDocumentList(event.payload.documentId);
      break;
    case 'HEARING_SCHEDULED':
      addHearingToCalendar(event.payload.hearing);
      break;
  }
});
```

### Server-Sent Events for Notifications

```typescript
// Server-Sent Events endpoint for client-facing notifications
app.get('/v1/notifications/stream', authenticateMiddleware, (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  const subscription = notificationService.subscribe(req.user.id, (notification) => {
    res.write(`id: ${notification.id}\n`);
    res.write(`event: ${notification.type}\n`);
    res.write(`data: ${JSON.stringify(notification)}\n\n`);
  });
  
  req.on('close', () => subscription.unsubscribe());
});
```

### Conflict Resolution

For collaborative document editing (e.g., co-authoring a brief), Justice OS uses **Operational Transformation (OT)** with a **last-write-wins** fallback for non-collaborative scenarios. Case metadata fields that may be updated by multiple users simultaneously (e.g., status, attorney assignment) use **optimistic concurrency control** with an ETag-based version check — a 409 Conflict response is returned if the submitted version does not match the current version, prompting the client to re-fetch and reapply.

---

## 11. Integration Examples with Real Use Cases

### Example 1: Self-Represented Litigant Files for Divorce

**Actors:** Maria (SRL), Los Angeles Superior Court, Justice OS intake portal

```
1. Maria visits court self-help website → redirected to Justice OS intake portal
2. intake-portal: Presents language selection → Maria chooses Spanish
3. guided-interview: Starts "Divorce in California" interview (multilingual)
4. eligibility-screener: Checks for attorney referral eligibility (income > 300% FPL → self-help)
5. guided-interview: Collects marriage date, children, assets; auto-populates FL-100 (Petition)
6. form-validator: Validates all required fields against LASC requirements
7. pdf-assembler: Generates completed FL-100, FL-110, FL-105 as court-formatted PDFs
8. e-signature: Maria signs FL-110 (Summons) electronically
9. fee-waiver: Auto-detects potential waiver eligibility → generates FW-001 form
10. efiling-gateway: Submits packet to LASC e-filing portal (Tyler EFM)
11. filing.submitted event published → notifications-service sends SMS to Maria in Spanish
12. Court accepts filing → filing.accepted event
13. docket-monitor: Registers case number for ongoing monitoring
14. Maria receives SMS: "Your divorce case has been filed. Case number: 25FLZZ00123"
15. court-calendar: Populates with response deadline (30 days from service)
16. deadline-engine: Schedules 7-day and 1-day reminder notifications
```

### Example 2: Legal Aid Intake to Case Assignment

**Actors:** Intake worker (Legal Aid LA), Maria (client), managing attorney

```
1. intake-portal: Intake worker opens new intake for walk-in client
2. conflict-checker: Runs conflict check across all org cases → clear
3. eligibility-screener: Calculates 185% FPL → LSC-eligible; assigns LSC code "32" (housing)
4. client.intake_complete event published
5. case-service: Creates new case with status INTAKE
6. vulnerability-assessment: Flags DOMESTIC_VIOLENCE based on intake responses
7. waitlist-manager: Skips waitlist for DV flag → priority assignment
8. case-assignment: Matches to Spanish-speaking attorney with housing expertise and <35 cases
9. case.assigned event published
10. notifications-service: Emails attorney assignment; SMS client confirmation
11. Attorney reviews intake, accepts assignment → status: ACTIVE
12. appointment-reminders: Schedules initial consultation reminder
```

### Example 3: Court e-Filing with Electronic Signature

**Actors:** Attorney, court e-filing system

```
1. Attorney drafts motion to dismiss in document assembly tool
2. document-version: Creates v1.0 of motion
3. Attorney marks document ready for signature
4. e-signature: Generates DocuSign-compatible signature request
5. document.signed event published (attorney signature captured)
6. efiling-gateway: Packages motion with case number, court code, filing type
7. fee-waiver: Checks client eligibility → waiver on file → $0 fee
8. Tyler EFM API call: POST /filings with multipart document upload
9. EFM returns transaction ID and filing confirmation number
10. filing.submitted event published
11. Court clerk reviews filing → accepts
12. EFM webhook POST /callbacks/efiling-accepted
13. filing.accepted event published
14. case-service: Updates case record with accepted filing
15. notifications-service: Notifies attorney and client
16. deadline-engine: Sets response deadline based on filing type rules
```

### Example 4: AI Document Analysis Pipeline

**Actors:** Document service, AI analysis service

```
1. document.uploaded event consumed by ai-service
2. ai-service: Downloads document from pre-signed S3 URL
3. Runs OCR if needed (Tesseract for scanned documents)
4. Extracts text → chunks into 512-token segments
5. Generates embeddings → stores in pgvector for semantic search
6. Runs entity extraction: parties, dates, dollar amounts, legal citations
7. Runs document classification: identifies as "EVICTION_NOTICE" with 94% confidence
8. Generates plain-language summary (Spanish for client, English for attorney)
9. Identifies key deadlines: "Response due 5 business days from service"
10. deadline-engine: Creates deadline record from extracted date
11. document.analyzed event published with all extracted metadata
12. case-service: Updates document record with AI analysis results
13. attorney-notification: Highlights key findings in attorney dashboard
14. precedent-matcher: Searches for similar eviction defense cases → returns 3 precedents
```

### Example 5: Multi-Jurisdiction Case Management

**Actors:** Multi-state legal aid organization, 3 jurisdictions

```
1. Client in California has related cases in Texas and New York
2. multi-jurisdiction: Creates parent case linking all 3 jurisdictions
3. Each jurisdiction's case management sub-records are maintained separately
4. Each sub-case has jurisdiction-specific forms, deadlines, and procedures
5. multi-jurisdiction: Syncs party information (name changes, address) across all sub-cases
6. Attorney dashboard shows unified timeline across all 3 jurisdictions
7. deadline-engine: Calculates each deadline in each jurisdiction's timezone
8. conflict resolution: Identifies hearing schedule conflict (TX and NY same day)
9. calendar-service: Sends conflict alert to supervising attorney
10. Supervisor reassigns NY sub-case to local counsel via referral-network
11. Data sharing agreement between organizations governs shared client record access
12. All 3 organizations see their jurisdiction's data; shared client profile is read-only
```

---

## 12. Deployment Topologies

### Topology 1: Single-Tenant Deployment (Legal Aid Organization)

```
                    ┌─────────────────────────────────┐
                    │       Legal Aid Organization      │
                    │         On-Premises / VPS         │
                    │                                   │
  Users ──HTTPS───> │  ┌─────────┐    ┌─────────────┐  │
                    │  │  Nginx  │───>│  API Gateway │  │
                    │  │ (TLS)   │    │  (Kong/Caddy)│  │
                    │  └─────────┘    └──────┬──────┘  │
                    │                        │          │
                    │         ┌──────────────┼──────┐   │
                    │         │              │      │   │
                    │  ┌──────▼──┐  ┌────────▼──┐  │   │
                    │  │  Case   │  │  Document  │  │   │
                    │  │ Service │  │  Service   │  │   │
                    │  └──────┬──┘  └────────┬──┘  │   │
                    │         │              │      │   │
                    │  ┌──────▼──────────────▼──┐  │   │
                    │  │   PostgreSQL (Primary)   │  │   │
                    │  │   + Read Replica         │  │   │
                    │  └─────────────────────────┘  │   │
                    │                               │   │
                    │  ┌────────────┐ ┌──────────┐  │   │
                    │  │   Redis    │ │  MinIO   │  │   │
                    │  │  (Cache)   │ │ (Storage)│  │   │
                    │  └────────────┘ └──────────┘  │   │
                    └───────────────────────────────┘
```

### Topology 2: Multi-Tenant SaaS Deployment

```
                         ┌─────────────────────────────────────────┐
                         │           Justice OS Cloud (AWS)          │
                         │                                           │
  Org A ──HTTPS──> ┐     │  ┌────────────┐   ┌────────────────────┐ │
  Org B ──HTTPS──> ├────>│  │ CloudFront │──>│  API Gateway (EKS)  │ │
  Org C ──HTTPS──> ┘     │  │  (WAF+CDN) │   │  Multi-tenant JWT   │ │
                         │  └────────────┘   └──────────┬─────────┘ │
                         │                              │            │
                         │  ┌───────────────────────────▼──────────┐ │
                         │  │           Kubernetes (EKS)            │ │
                         │  │  [case-svc] [doc-svc] [intake-svc]   │ │
                         │  │  [efiling]  [notify]  [auth-svc]     │ │
                         │  │  [ai-svc]   [analytics] [audit]      │ │
                         │  └───────────────────────────┬──────────┘ │
                         │                              │             │
                         │  ┌───────────────────────────▼──────────┐  │
                         │  │         RDS Aurora (Multi-AZ)         │  │
                         │  │  schema_tenant_a | schema_tenant_b    │  │
                         │  │  schema_tenant_c | schema_tenant_n    │  │
                         │  └──────────────────────────────────────┘  │
                         │                                            │
                         │  [MSK/Kafka] [ElastiCache/Redis] [S3]      │
                         └────────────────────────────────────────────┘
```

### Topology 3: Hybrid Court-System Deployment

```
        COURT NETWORK (On-Premises)         JUSTICE OS CLOUD
        ┌─────────────────────────┐         ┌──────────────────┐
        │  Tyler Odyssey CMS      │         │  Justice OS SaaS  │
        │  ┌────────────────────┐ │ VPN/    │  ┌────────────┐  │
        │  │  Odyssey REST API  │◄├─────────┼──►  Sync Svc  │  │
        │  └────────────────────┘ │ TLS 1.3 │  └────────────┘  │
        │                         │         │                    │
        │  ┌────────────────────┐ │         │  ┌────────────┐  │
        │  │  e-Filing Portal   │◄├─────────┼──►  e-Filing  │  │
        │  │  (EFM Provider)    │ │ mTLS    │  │  Gateway   │  │
        │  └────────────────────┘ │         │  └────────────┘  │
        │                         │         │                    │
        │  Court Data stays on    │         │  Client-facing     │
        │  premises at all times  │         │  features in cloud │
        └─────────────────────────┘         └──────────────────┘
                    │                                │
                    └──────────── Citizens ──────────┘
                              (Access via cloud;
                               data synced securely)
```

---

## 13. Security & Compliance Architecture

### Encryption

- **In transit:** TLS 1.3 minimum for all connections; certificate pinning for mobile apps
- **At rest:** AES-256-GCM for database volumes (AWS EBS/RDS encryption); SSE-S3 for document storage
- **Field-level encryption:** SSN, date of birth, and financial data encrypted with tenant-specific keys managed in AWS KMS or HashiCorp Vault
- **Key rotation:** Automated 90-day rotation for data encryption keys; annual rotation for key encryption keys

### Audit Logging

Every data access and modification generates an immutable audit event:
```json
{
  "eventId": "uuid",
  "userId": "string",
  "tenantId": "string",
  "action": "READ | CREATE | UPDATE | DELETE",
  "resource": "Case | Document | Client",
  "resourceId": "string",
  "timestamp": "ISO8601",
  "ipAddress": "string",
  "userAgent": "string",
  "wasPrivileged": false,
  "resultCode": 200
}
```

Audit logs are written to an append-only log store (AWS CloudTrail + custom audit database) with a 7-year retention policy. Logs cannot be deleted by any user, including system administrators — deletion requires a formal legal process.

### Key Management

All cryptographic keys are managed through a dedicated key management service:
- **Hierarchy:** Master key → Key encryption key (KEK) → Data encryption key (DEK)
- **Storage:** KMS-backed HSM for master keys; no key material ever stored in application code or configuration
- **Access control:** Key access requires MFA + role justification; all access logged
- **Emergency access:** Break-glass procedure with dual control (2 senior engineers) for emergency key access

---

*This document is maintained by the Justice OS Core Architecture team. For integration support, file an issue at `github.com/justice-os/core/issues` or join the `#integrations` channel on the Justice OS community Slack.*
