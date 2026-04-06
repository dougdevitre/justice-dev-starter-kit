# Enterprise Deployment Framework
## Justice OS — Production Operations & Compliance Guide

**Version:** 2.5 | **Date:** 2025 | **Audience:** DevOps/SRE, Security, Enterprise Architects

---

## Table of Contents

1. [Multi-tenancy Architecture](#1-multi-tenancy-architecture)
2. [High Availability & Disaster Recovery](#2-high-availability--disaster-recovery)
3. [Compliance Requirements Checklists](#3-compliance-requirements-checklists)
4. [Data Residency & Sovereignty](#4-data-residency--sovereignty)
5. [Backup & Recovery Strategy](#5-backup--recovery-strategy)
6. [Performance & Scaling](#6-performance--scaling)
7. [Security Hardening](#7-security-hardening)
8. [Monitoring & Observability](#8-monitoring--observability)
9. [Upgrade Strategies](#9-upgrade-strategies)
10. [Enterprise Support Model](#10-enterprise-support-model)

---

## 1. Multi-tenancy Architecture

### Three Isolation Models

Choosing the correct multi-tenancy model is a foundational architectural decision with cascading implications for performance, security, cost, and compliance.

**Model 1: Shared Schema**
All tenants share the same database tables. A `tenant_id` column in every table provides logical isolation.

| Aspect | Detail |
|--------|--------|
| Isolation | Logical only; SQL must always include `WHERE tenant_id = ?` |
| Cost | Lowest; most efficient use of database resources |
| Risk | High: SQL injection or missing tenant filter exposes all tenant data |
| Compliance | Generally insufficient for HIPAA/GDPR for sensitive legal data |
| Best for | Development environments; very small, low-sensitivity tenants |

**Model 2: Schema-per-Tenant (Recommended for Justice OS)**
Each tenant gets a dedicated PostgreSQL schema within a shared database cluster. Tables are identical across schemas; the application switches search path per request.

| Aspect | Detail |
|--------|--------|
| Isolation | Strong logical isolation; separate schema namespace |
| Cost | Medium; moderate resource overhead for schema management |
| Risk | Low; tenant data in separate schema reduces cross-contamination risk |
| Compliance | Meets HIPAA, GDPR, state bar requirements for most use cases |
| Best for | Legal aid organizations, law schools, small courts — the primary Justice OS segment |

**Model 3: Database-per-Tenant**
Each tenant has a completely separate database instance.

| Aspect | Detail |
|--------|--------|
| Isolation | Physical isolation; no shared database resources |
| Cost | Highest; separate instances for each tenant |
| Risk | Lowest; complete physical separation |
| Compliance | Meets all known compliance requirements including FedRAMP High |
| Best for | Statewide court systems, enterprise government deployments, FedRAMP-required |

---

### Justice OS Recommendation

**Schema-per-tenant for standard deployments; database-per-tenant for court systems and government.**

This hybrid approach:
- Allows legal aid organizations (the majority of tenants) to share cost-efficient infrastructure
- Provides physical isolation for courts and government agencies with strict data segregation requirements
- Enables tenant migration from shared to dedicated without application changes

---

### Multi-Tenant Architecture (ASCII Diagram)

```
Application Layer
┌─────────────────────────────────────────────────────┐
│              API Gateway (Kong)                      │
│  X-Tenant-ID header → TenantResolver middleware      │
│  Sets: PostgreSQL search_path, Redis namespace,      │
│        S3 path prefix, Kafka topic prefix            │
└────────────────────────┬────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
  ┌──────▼──────┐  ┌─────▼──────┐  ┌────▼────────┐
  │  Tenant A   │  │  Tenant B  │  │  Tenant C   │
  │  (Legal     │  │  (Court    │  │  (Law        │
  │   Aid LA)   │  │   System)  │  │   School)   │
  └──────┬──────┘  └─────┬──────┘  └────┬────────┘
         │               │               │
Data Layer
┌────────▼───────────────▼───────────────▼────────────┐
│              PostgreSQL Cluster (RDS Aurora)          │
│  ┌─────────────────────────────────────────────────┐ │
│  │  Schema: tenant_legal_aid_la                    │ │
│  │  Tables: cases, parties, documents, ...         │ │
│  ├─────────────────────────────────────────────────┤ │
│  │  Schema: tenant_court_system_001                │ │ │
│  │  Tables: cases, parties, documents, ...         │ │
│  ├─────────────────────────────────────────────────┤ │
│  │  Schema: tenant_law_school_xyz                  │ │
│  │  Tables: cases, parties, documents, ...         │ │
│  └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### Tenant Provisioning

```typescript
// Tenant provisioning service
async function provisionTenant(params: TenantProvisionParams): Promise<TenantConfig> {
  const { tenantId, organizationName, tier, region } = params;
  
  // 1. Create PostgreSQL schema
  await db.query(`CREATE SCHEMA IF NOT EXISTS "tenant_${tenantId}"`);
  await db.query(`SET search_path TO "tenant_${tenantId}"`);
  
  // 2. Run schema migrations in new tenant schema
  await runMigrations(`tenant_${tenantId}`);
  
  // 3. Create S3 prefix and lifecycle policies
  await s3.putBucketLifecycleConfiguration({
    Bucket: 'justice-os-documents',
    LifecycleConfiguration: {
      Rules: [{
        Prefix: `tenants/${tenantId}/`,
        Status: 'Enabled',
        Transitions: [
          { Days: 90, StorageClass: 'STANDARD_IA' },
          { Days: 365, StorageClass: 'GLACIER' }
        ]
      }]
    }
  });
  
  // 4. Create Redis namespace
  await redis.set(`tenant:${tenantId}:config`, JSON.stringify({ tier, region }));
  
  // 5. Create Kafka topics for tenant
  await kafka.createTopics([
    `${tenantId}.case.events`,
    `${tenantId}.document.events`,
    `${tenantId}.notifications`
  ]);
  
  // 6. Generate tenant API credentials
  const apiKey = await generateTenantApiKey(tenantId);
  
  // 7. Register in tenant registry
  await tenantRegistry.register({ tenantId, organizationName, tier, apiKey, createdAt: new Date() });
  
  return { tenantId, schemaName: `tenant_${tenantId}`, apiKey };
}
```

### Data Isolation Guarantees

All application queries are wrapped by a `TenantContext` middleware that automatically appends `SET search_path TO "tenant_{tenantId}"` before every database transaction. A query interception layer validates that no query runs without an active tenant context, preventing accidental cross-tenant data access. Integration tests explicitly verify that a query from Tenant A cannot return data belonging to Tenant B.

---

## 2. High Availability & Disaster Recovery

### SLA Targets

| Tier | Availability Target | Max Downtime/Year | Max Downtime/Month |
|------|--------------------|--------------------|-------------------|
| Community (free) | 99.5% | 43.8 hours | 3.6 hours |
| Professional | 99.9% | 8.76 hours | 43.2 minutes |
| Enterprise | 99.95% | 4.38 hours | 21.6 minutes |
| Government | 99.99% | 52.6 minutes | 4.3 minutes |

### Active-Active vs. Active-Passive

**Justice OS uses Active-Active across availability zones within a region, and Active-Passive across regions.**

- **Intra-region (AZ-level):** Active-Active. All application nodes are fully functional in all AZs simultaneously. Traffic is load balanced equally. An AZ failure triggers automatic failover in < 30 seconds via Route 53 health checks.

- **Cross-region:** Active-Passive. The primary region (us-east-1) handles all traffic. A standby region (us-west-2) maintains a warm replica. Failover to standby is manual for Community/Professional tiers, automated for Enterprise and Government tiers.

### Database Replication

```
Primary (us-east-1)          Replica (us-east-1b)         Standby (us-west-2)
┌──────────────────┐          ┌───────────────────┐        ┌──────────────────┐
│  PostgreSQL      │─ WAL ──>│  Read Replica      │        │  PostgreSQL      │
│  Primary         │  stream │  (Synchronous in   │─ async │  Standby         │
│  RDS Aurora      │         │   same AZ; async   │  WAL   │  RDS Aurora      │
│                  │         │   cross-AZ)        │──────> │                  │
└──────────────────┘          └───────────────────┘        └──────────────────┘
      │ Writes                       │ Reads (reports,                │ Failover
      │                              │  dashboards, search)           │ target
      └──────────────────────────────┘                                │
                                                              Promoted on failover
```

**PostgreSQL Streaming Replication Config:**
```ini
# postgresql.conf (primary)
wal_level = replica
max_wal_senders = 5
wal_keep_size = 1GB
synchronous_commit = on
synchronous_standby_names = 'replica_az1'

# pg_hba.conf
host replication replicator 10.0.0.0/8 md5
```

### Load Balancer Configuration

```nginx
# nginx.conf — upstream configuration
upstream justice_os_api {
    least_conn;
    server api-1.internal:3000 weight=10 max_fails=3 fail_timeout=30s;
    server api-2.internal:3000 weight=10 max_fails=3 fail_timeout=30s;
    server api-3.internal:3000 weight=10 max_fails=3 fail_timeout=30s;
    keepalive 32;
}

server {
    listen 443 ssl http2;
    ssl_certificate     /etc/ssl/justice-os.crt;
    ssl_certificate_key /etc/ssl/justice-os.key;
    ssl_protocols       TLSv1.3;
    ssl_ciphers         TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256;

    location /api/ {
        proxy_pass http://justice_os_api;
        proxy_connect_timeout 5s;
        proxy_read_timeout 30s;
        proxy_next_upstream error timeout http_500 http_502 http_503;
        proxy_next_upstream_tries 3;
        add_header X-Request-ID $request_id;
    }
}
```

### Health Check Endpoints

```
GET /health/live     → 200 if process is running
GET /health/ready    → 200 if DB + Redis + Kafka connections healthy
GET /health/startup  → 200 if initial startup complete (migrations run)
GET /health/detailed → JSON with per-dependency status (auth only)
```

### RTO and RPO Targets

| Scenario | RTO Target | RPO Target |
|----------|-----------|-----------|
| Single AZ failure (in-region) | < 30 seconds (automated) | 0 (synchronous replication) |
| Database primary failure | < 5 minutes (automated Aurora failover) | < 1 minute |
| Full region failure | < 1 hour (Enterprise); < 4 hours (Professional) | < 15 minutes |
| Data corruption (logical) | < 2 hours | Point-in-time restore to any 5-min interval in last 35 days |

---

## 3. Compliance Requirements Checklists

### HIPAA Compliance Checklist

Legal aid organizations sometimes handle health-related legal matters (Medicaid appeals, disability benefits, healthcare powers of attorney). When PHI is processed, HIPAA applies.

- [ ] Business Associate Agreement (BAA) executed with all vendors processing PHI
- [ ] PHI encrypted at rest using AES-256 (all database fields and document storage)
- [ ] PHI encrypted in transit using TLS 1.3
- [ ] Role-based access controls limiting PHI access to minimum necessary
- [ ] Unique user identification — no shared logins permitted
- [ ] Automatic session logout after 15 minutes of inactivity for systems handling PHI
- [ ] Audit controls: all access to PHI logged with user, timestamp, action, record ID
- [ ] Integrity controls: audit logs are tamper-evident (WORM storage)
- [ ] PHI transmission security: no PHI in email without encryption
- [ ] Workforce training: all staff with PHI access trained annually on HIPAA
- [ ] Sanctions policy: documented and enforced for HIPAA violations
- [ ] Contingency plan: documented backup and disaster recovery procedures for PHI
- [ ] Emergency access procedure: break-glass access documented and tested
- [ ] Security incident procedures: documented response plan; HHS notification within 60 days of breach discovery
- [ ] Evaluation: annual HIPAA security risk assessment
- [ ] Physical safeguards: documented for any on-premises components
- [ ] Device encryption: all laptops/workstations with PHI access encrypted (FileVault/BitLocker)
- [ ] BAA with cloud hosting provider (AWS HIPAA BAA signed)
- [ ] PHI data mapping: complete inventory of where PHI is stored, processed, transmitted
- [ ] Minimum necessary standard applied to all PHI disclosures

### FERPA Compliance Checklist (Law School Clinical Programs)

When Justice OS is deployed in law school clinical programs handling student records or records created in educational context:

- [ ] FERPA policy documented and provided to students
- [ ] Student records access limited to legitimate educational interest
- [ ] Parent/student consent obtained before any disclosure of education records
- [ ] Directory information designation clearly communicated
- [ ] Annual notification to students of FERPA rights
- [ ] Opt-out mechanism for directory information disclosure
- [ ] Records requests responded to within 45 days
- [ ] Hearing procedures documented for student challenges to records
- [ ] Contractor/vendor agreements (DUA) executed for third-party access to education records
- [ ] Records destruction schedule documented and followed
- [ ] Breach notification procedures (FERPA requires notification to Dept. of Education)
- [ ] Training for all clinical staff on FERPA obligations
- [ ] Separation of student academic records from client case records
- [ ] Supervision records maintained in compliance with state bar student practice rules
- [ ] Annual audit of access logs for student record systems

### GDPR Compliance Checklist (UK/EU Deployments)

- [ ] Lawful basis for processing documented for each processing activity
- [ ] Privacy notice (Privacy Policy) provided to data subjects at time of collection
- [ ] Consent mechanism implemented where consent is the lawful basis (granular, withdrawable)
- [ ] Data Protection Officer (DPO) appointed and registered with supervisory authority
- [ ] Records of Processing Activities (ROPA) maintained per Article 30
- [ ] Data Protection Impact Assessment (DPIA) completed for high-risk processing
- [ ] Data subject rights implemented: access (Article 15), rectification (16), erasure (17), portability (20), restriction (18), objection (21)
- [ ] Response to data subject requests within 30 days
- [ ] Data minimization: only data necessary for the purpose is collected
- [ ] Retention periods defined and automated deletion implemented
- [ ] International transfer safeguards in place (SCCs for non-adequate countries)
- [ ] Data breach response procedure: 72-hour notification to supervisory authority
- [ ] Third-party processor agreements (DPA) executed with all processors
- [ ] Privacy by design and default implemented in all new features
- [ ] Consent withdrawal mechanism easy to use and documented
- [ ] Automated decision-making safeguards (Article 22) where AI tools make consequential decisions
- [ ] Age verification where services may be used by minors
- [ ] Cookie consent (for web applications) implemented per ePrivacy Directive
- [ ] Annual GDPR compliance review with DPO
- [ ] Staff GDPR training completed and documented

### State Bar / Legal Ethics Checklist

- [ ] Attorney-client privilege protections documented in platform architecture
- [ ] Confidential client data access limited to assigned attorneys and supervising attorneys
- [ ] Unauthorized practice of law safeguards for self-help tools (clear disclaimers; AI limitations disclosed)
- [ ] Competence: attorneys trained on technology before using in client matters (ABA Model Rule 1.1 Comment 8)
- [ ] Confidentiality of client files during and after representation (Rule 1.6)
- [ ] Conflict of interest checks run before case assignment (Rule 1.7/1.9)
- [ ] File retention and return to client on termination (state-specific rules)
- [ ] Communication obligations: client portal communications are confidential (Rule 1.4)
- [ ] Supervision of non-attorney staff using Justice OS (Rule 5.3)
- [ ] Trust account rules: client funds never commingled with operating funds

---

## 4. Data Residency & Sovereignty

### Deployment Regions

| Market | Primary Region | AWS Region | Secondary Region | Data Classification |
|--------|--------------|-----------|-----------------|-------------------|
| United States | US East | us-east-1 (N. Virginia) | us-west-2 (Oregon) | All tiers |
| Canada | Canada | ca-central-1 (Montreal) | ca-west-1 (Calgary) | All tiers |
| United Kingdom | UK | eu-west-2 (London) | eu-west-1 (Ireland) | UK GDPR |
| European Union | EU | eu-central-1 (Frankfurt) | eu-west-1 (Ireland) | EU GDPR |
| Australia | Australia | ap-southeast-2 (Sydney) | ap-southeast-4 (Melbourne) | Australian Privacy Act |
| India | India | ap-south-1 (Mumbai) | ap-south-2 (Hyderabad) | DPDP Act 2023 |

### Data Classification Tiers

| Tier | Description | Examples | Controls |
|------|-------------|---------|---------|
| **Public** | No sensitivity; openly shareable | Aggregated statistics, anonymized outcomes | Standard access |
| **Internal** | Organizational data not suitable for public | Staff names, org configuration | Authenticated access |
| **PII** | Personally identifiable information | Client names, addresses, dates of birth | Encrypted at rest + in transit; access logged |
| **PHI** | Protected health information | Medical conditions, disability status | HIPAA controls; BAA required |
| **Legal Privileged** | Attorney-client privileged communications | Attorney notes, legal strategy, client disclosures | Privilege guard; attorney-only access |
| **CUI** | Controlled Unclassified Information | Federal program data | NIST 800-53; FedRAMP controls |

### Cross-Border Data Transfer Restrictions

- **EU/UK data** must not leave EU/UK regions except under:
  - Standard Contractual Clauses (SCCs) to non-adequate countries
  - Adequacy decision (e.g., US-EU Data Privacy Framework for participating companies)
  - Explicit data subject consent
- **Canadian government data** must remain in Canada per Treasury Board policy
- **Australian government data** must remain in Australia per the Cloud Policy
- **US federal data** must remain in the United States

All cross-border transfers require legal review and documentation in the data processing records.

---

## 5. Backup & Recovery Strategy

### Backup Schedule

| Data Type | Frequency | Retention | Method | Storage |
|-----------|-----------|-----------|--------|---------|
| PostgreSQL continuous WAL | Continuous | 35 days | AWS RDS automated | S3 (same region) |
| PostgreSQL full snapshot | Daily (2:00 AM UTC) | 35 days | pg_basebackup via RDS | S3 (same region) |
| PostgreSQL weekly archive | Weekly (Sunday 3:00 AM) | 1 year | pg_dump compressed | S3 Glacier |
| PostgreSQL annual | Annually (Jan 1) | 7 years | pg_dump encrypted | S3 Glacier Deep Archive |
| Document storage (S3) | Continuous | Versioning enabled | S3 versioning | S3 (cross-region replica) |
| Redis cache | Not backed up | N/A | Reconstructed from DB | N/A |
| Kafka event log | Continuous | 30 days | Kafka retention | MSK (same region) |
| Application configuration | On change | Indefinite | Git (encrypted secrets) | GitHub |

### PostgreSQL Backup Commands

```bash
# Point-in-time backup with pg_basebackup
pg_basebackup \
  --host=justice-os-db.cluster-abc123.us-east-1.rds.amazonaws.com \
  --username=backup_user \
  --pgdata=/backups/$(date +%Y%m%d) \
  --format=tar \
  --gzip \
  --compress=9 \
  --progress \
  --wal-method=stream

# Full logical dump with pg_dump (for schema-per-tenant granular restore)
pg_dump \
  --host=justice-os-db.cluster-abc123.us-east-1.rds.amazonaws.com \
  --username=backup_user \
  --dbname=justice_os \
  --schema=tenant_legal_aid_la \
  --format=custom \
  --compress=9 \
  --file=/backups/tenant_legal_aid_la_$(date +%Y%m%d).dump

# Upload to S3 with server-side encryption
aws s3 cp /backups/tenant_legal_aid_la_$(date +%Y%m%d).dump \
  s3://justice-os-backups/tenant-dumps/tenant_legal_aid_la/ \
  --sse aws:kms \
  --sse-kms-key-id arn:aws:kms:us-east-1:123456789:key/backup-key-id
```

### S3 Backup Lifecycle Policy

```json
{
  "Rules": [
    {
      "ID": "justice-os-backup-lifecycle",
      "Status": "Enabled",
      "Filter": { "Prefix": "tenant-dumps/" },
      "Transitions": [
        { "Days": 30, "StorageClass": "STANDARD_IA" },
        { "Days": 90, "StorageClass": "GLACIER" },
        { "Days": 365, "StorageClass": "DEEP_ARCHIVE" }
      ],
      "NoncurrentVersionTransitions": [
        { "NoncurrentDays": 30, "StorageClass": "GLACIER" }
      ],
      "NoncurrentVersionExpiration": { "NoncurrentDays": 2555 }
    }
  ]
}
```

### Recovery Runbook

**Step 1: Assess scope of data loss**
- Identify affected tenant(s) or full database
- Determine time of corruption or loss
- Select appropriate restore point (Aurora Console → "Restore to Point in Time")

**Step 2: Provision restore environment**
```bash
# Restore Aurora cluster to point in time
aws rds restore-db-cluster-to-point-in-time \
  --db-cluster-identifier justice-os-restore-$(date +%Y%m%d) \
  --restore-type full-copy \
  --source-db-cluster-identifier justice-os-production \
  --restore-to-time 2025-01-15T14:00:00Z \
  --vpc-security-group-ids sg-restore-01
```

**Step 3: Extract affected tenant data**
```bash
pg_dump \
  --host=justice-os-restore-$(date +%Y%m%d).cluster-abc123.us-east-1.rds.amazonaws.com \
  --schema=tenant_legal_aid_la \
  --format=custom \
  --file=/restore/tenant_legal_aid_la_restored.dump
```

**Step 4: Restore to production with data verification**
```bash
pg_restore \
  --host=justice-os-db-primary.cluster-abc123.us-east-1.rds.amazonaws.com \
  --schema=tenant_legal_aid_la \
  --data-only \
  --disable-triggers \
  /restore/tenant_legal_aid_la_restored.dump
```

**Step 5: Verify and notify**
- Run data integrity checks
- Notify affected tenant of incident and recovery action
- Update incident report

### Testing Schedule

Backup integrity tests must be performed on a documented schedule:
- **Monthly:** Restore one randomly selected tenant schema to staging; verify row counts and spot-check data
- **Quarterly:** Full point-in-time restore exercise to isolated environment; verify RTO/RPO targets met
- **Annually:** Full disaster recovery exercise including cross-region failover; document deviations from RTO/RPO

---

## 6. Performance & Scaling

### Kubernetes Horizontal Pod Autoscaler

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: justice-os-api-hpa
  namespace: justice-os-production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: justice-os-api
  minReplicas: 3
  maxReplicas: 100
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Pods
        value: 4
        periodSeconds: 60
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 10
        periodSeconds: 60
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 65
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 75
  - type: External
    external:
      metric:
        name: http_requests_per_second
      target:
        type: AverageValue
        averageValue: "200"
```

### Database Connection Pooling (PgBouncer)

```ini
# pgbouncer.ini
[databases]
justice_os = host=justice-os-db-primary.cluster-abc123.us-east-1.rds.amazonaws.com \
             port=5432 \
             dbname=justice_os \
             pool_size=50

[pgbouncer]
listen_port = 5432
listen_addr = 0.0.0.0
auth_type = md5
auth_file = /etc/pgbouncer/userlist.txt
pool_mode = transaction          ; Transaction pooling for stateless API requests
max_client_conn = 1000
default_pool_size = 50
min_pool_size = 10
reserve_pool_size = 5
reserve_pool_timeout = 3
server_idle_timeout = 600
client_idle_timeout = 0
server_reset_query = DISCARD ALL
server_check_query = SELECT 1
log_connections = 0              ; Disable in production (performance)
log_disconnections = 0
stats_period = 60
```

### Redis Caching Strategy

```typescript
// Cache configuration
const CACHE_CONFIG = {
  // Jurisdiction/form data — changes infrequently
  jurisdictionConfig: { ttl: 3600, prefix: 'juri:' },
  formLibrary: { ttl: 1800, prefix: 'forms:' },
  
  // User session and auth
  userSession: { ttl: 900, prefix: 'sess:' },    // 15 min idle timeout
  userPermissions: { ttl: 300, prefix: 'perms:' }, // 5 min; refreshed on role change
  
  // Case data — balance freshness with performance
  caseList: { ttl: 60, prefix: 'cases:' },         // 1 min; frequent updates
  caseSummary: { ttl: 120, prefix: 'case:' },      // 2 min summary view
  
  // Reference data
  eligibilityRules: { ttl: 3600, prefix: 'elig:' },
  lscCodes: { ttl: 86400, prefix: 'lsc:' },        // Daily refresh
};

// Cache invalidation on case update
async function invalidateCaseCache(tenantId: string, caseId: string): Promise<void> {
  const keys = [
    `${CACHE_CONFIG.caseSummary.prefix}${tenantId}:${caseId}`,
    `${CACHE_CONFIG.caseList.prefix}${tenantId}:*`,  // Wildcard for list views
  ];
  await redis.del(keys);
  // Publish invalidation event for other nodes
  await redis.publish('cache:invalidate', JSON.stringify({ tenantId, caseId, type: 'case' }));
}
```

### Performance Benchmarks and Load Testing

**Target performance:**
- API p50 response time: < 50ms
- API p95 response time: < 200ms
- API p99 response time: < 500ms
- Database query p95: < 50ms
- Document upload (1MB PDF): < 2 seconds end-to-end

**k6 Load Test Script:**
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 50 },   // Ramp to 50 users
    { duration: '5m', target: 50 },   // Steady state
    { duration: '2m', target: 200 },  // Spike test
    { duration: '5m', target: 200 },  // Hold spike
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const params = {
    headers: {
      'Authorization': `Bearer ${__ENV.TEST_TOKEN}`,
      'X-Tenant-ID': 'load-test-tenant',
    },
  };

  const caseListResponse = http.get(`${__ENV.BASE_URL}/api/v1/cases`, params);
  check(caseListResponse, { 'cases list 200': (r) => r.status === 200 });
  
  sleep(1);
}
```

---

## 7. Security Hardening

### CIS Benchmark Compliance

Justice OS targets **CIS Benchmark Level 2** for all production systems. Key controls:

**Operating System (Ubuntu 22.04 LTS / Amazon Linux 2023):**
- Automatic security updates enabled
- Unused services disabled (no GUI, minimal package installation)
- Filesystem encryption for all volumes
- SSH: key-based only, root login disabled, port changed from 22
- Firewall: ufw/iptables blocking all except required ports

### Container Security

```dockerfile
# Hardened Dockerfile example
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS runtime
# Run as non-root user
RUN addgroup -S justice && adduser -S justice -G justice
USER justice

# Read-only filesystem
WORKDIR /app
COPY --from=builder --chown=justice:justice /app/node_modules ./node_modules
COPY --chown=justice:justice dist/ ./dist/

# No write access needed; use mounted volumes for logs
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

### Kubernetes Network Policy

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: justice-os-api-netpol
  namespace: justice-os-production
spec:
  podSelector:
    matchLabels:
      app: justice-os-api
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: api-gateway    # Only API gateway can reach API pods
    ports:
    - protocol: TCP
      port: 3000
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: postgres       # Database access
    ports:
    - protocol: TCP
      port: 5432
  - to:
    - podSelector:
        matchLabels:
          app: redis          # Cache access
    ports:
    - protocol: TCP
      port: 6379
  - to:
    - namespaceSelector:
        matchLabels:
          name: kube-system   # DNS resolution
    ports:
    - protocol: UDP
      port: 53
```

### Secret Management

```bash
# HashiCorp Vault secret injection example
# Secrets injected as environment variables at pod startup
# Never stored in Kubernetes ConfigMaps or environment variables in manifests

vault kv put secret/justice-os/production \
  db_password="$(openssl rand -base64 32)" \
  redis_password="$(openssl rand -base64 32)" \
  jwt_secret="$(openssl rand -base64 64)"

# Vault agent sidecar injects secrets at runtime
# Annotation on pod spec:
# vault.hashicorp.com/agent-inject: "true"
# vault.hashicorp.com/role: "justice-os-production"
# vault.hashicorp.com/agent-inject-secret-db: "secret/justice-os/production"
```

### Vulnerability Scanning Schedule

| Tool | Target | Frequency | Action Threshold |
|------|--------|-----------|-----------------|
| **Trivy** | Container images | Every build (CI/CD) | Block on CRITICAL; alert on HIGH |
| **Snyk** | npm dependencies | Daily | Alert on CRITICAL; monthly remediation sprint |
| **OWASP ZAP** | Web application | Weekly (staging) | Alert on MEDIUM+; track in security backlog |
| **AWS Inspector** | EC2/EKS nodes | Continuous | Alert on CRITICAL; patch within 7 days |
| **External Pen Test** | Full platform | Annually | Remediate all CRITICAL/HIGH before next release |

---

## 8. Monitoring & Observability

### Prometheus Metrics (20 Key Metrics)

| Metric Name | Type | Description |
|---|---|---|
| `http_request_duration_seconds` | Histogram | API response time by endpoint and status |
| `http_requests_total` | Counter | Total HTTP requests by method, path, status |
| `http_requests_in_flight` | Gauge | Active concurrent requests |
| `db_query_duration_seconds` | Histogram | PostgreSQL query latency by operation |
| `db_connections_active` | Gauge | Active database connections per pool |
| `db_connection_pool_size` | Gauge | Total connection pool capacity |
| `redis_cache_hits_total` | Counter | Cache hits vs. misses by key prefix |
| `redis_memory_used_bytes` | Gauge | Redis memory consumption |
| `kafka_consumer_lag` | Gauge | Event processing lag by consumer group |
| `kafka_messages_produced_total` | Counter | Events published per topic |
| `cases_created_total` | Counter | New cases opened per tenant |
| `documents_uploaded_total` | Counter | Documents uploaded; total bytes |
| `efilings_submitted_total` | Counter | e-Filing submissions by status |
| `auth_login_attempts_total` | Counter | Login attempts; success vs. failure |
| `auth_mfa_completions_total` | Counter | MFA completions vs. failures |
| `tenant_api_requests_total` | Counter | API requests by tenant (billing/capacity) |
| `job_queue_depth` | Gauge | Background job queue depth by type |
| `job_processing_duration_seconds` | Histogram | Background job execution time |
| `ssl_certificate_expiry_seconds` | Gauge | Time until TLS cert expiry (alert at < 30 days) |
| `pod_restart_count` | Counter | Container restart count (indicates instability) |

### Grafana Dashboards

**1. Infrastructure Dashboard**
Panels: CPU/memory utilization per node, disk I/O, network throughput, pod count by namespace, node health status.

**2. Application Performance Dashboard**
Panels: p50/p95/p99 API latency, request rate, error rate by endpoint, active users, database query performance, cache hit rate.

**3. Business Metrics Dashboard**
Panels: Cases created per day, clients served this month, e-filings submitted, document uploads, active tenants, monthly ARR by tier.

**4. Security Dashboard**
Panels: Failed login attempts (rate), MFA adoption rate, privilege guard access events, audit log volume, security alert count by severity.

**5. SLA Dashboard**
Panels: Uptime percentage (rolling 30 days), current incident status, p95 latency vs. SLA target, backup success rate, RTO/RPO compliance.

### Alerting Rules

```yaml
# Prometheus alerting rules
groups:
- name: justice-os-critical
  rules:
  - alert: APIHighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05
    for: 2m
    labels:
      severity: critical
      team: engineering
    annotations:
      summary: "High API error rate: {{ $value | humanizePercentage }}"
      runbook: "https://runbooks.justiceos.org/api-errors"

  - alert: DatabaseConnectionExhausted
    expr: db_connections_active / db_connection_pool_size > 0.9
    for: 1m
    labels:
      severity: critical
    annotations:
      summary: "Database connection pool {{ $value | humanizePercentage }} utilized"

  - alert: KafkaConsumerLagHigh
    expr: kafka_consumer_lag > 10000
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "Kafka consumer lag {{ $value }} messages on {{ $labels.topic }}"
```

**Escalation Matrix:**

| Severity | Initial Response | Escalation (if no acknowledgment) |
|----------|-----------------|----------------------------------|
| P1 (Critical) | PagerDuty immediate call to on-call engineer | 15 min → engineering manager; 30 min → CTO |
| P2 (High) | PagerDuty page to on-call engineer | 30 min → engineering manager |
| P3 (Medium) | Slack alert to #alerts channel | Next business day → team lead |
| P4 (Low) | GitHub issue created automatically | Weekly review |

---

## 9. Upgrade Strategies

### Blue-Green Deployment

```
CURRENT STATE (Blue = Production)
┌─────────────────┐     ┌─────────────────┐
│  Load Balancer  │────>│  Blue (v1.5.0)  │
│  100% traffic   │     │  3 pods running │
└─────────────────┘     └─────────────────┘
                         ┌─────────────────┐
                         │  Green (v1.6.0) │
                         │  STANDBY        │
                         └─────────────────┘

AFTER DEPLOY (Green = Production)
┌─────────────────┐     ┌─────────────────┐
│  Load Balancer  │────>│  Green (v1.6.0) │
│  100% traffic   │     │  3 pods running │
└─────────────────┘     └─────────────────┘
                         ┌─────────────────┐
                         │  Blue (v1.5.0)  │
                         │  STANDBY 30min  │
                         └─────────────────┘
```

Blue-green deployments provide instant rollback capability: if the new version has a critical defect, traffic is switched back to the blue environment in < 30 seconds.

### Canary Releases

```yaml
# Argo Rollouts canary strategy
spec:
  strategy:
    canary:
      steps:
      - setWeight: 5        # 5% → canary for 10 min
      - pause: {duration: 10m}
      - setWeight: 25       # 25% → canary for 10 min
      - pause: {duration: 10m}
      - setWeight: 50       # 50% → canary for 15 min
      - pause: {duration: 15m}
      - setWeight: 100      # Full cutover
      canaryMetadata:
        labels:
          role: canary
      stableMetadata:
        labels:
          role: stable
      analysis:
        templates:
        - templateName: success-rate
        args:
        - name: service-name
          value: justice-os-api-canary
```

Auto-rollback is triggered if error rate on the canary exceeds 2% during any step.

### Database Migration Strategy (Zero-Downtime)

```sql
-- STEP 1: Add new column as nullable (non-blocking; runs while app is live)
ALTER TABLE cases ADD COLUMN matter_subtype VARCHAR(50) NULL;

-- STEP 2: Backfill data in batches (non-blocking; no table lock)
UPDATE cases SET matter_subtype = 'GENERAL' 
WHERE matter_subtype IS NULL AND id > 0
LIMIT 10000;
-- Repeat until complete; run as background job

-- STEP 3: Deploy new application code that reads AND writes new column

-- STEP 4: Add NOT NULL constraint after full backfill
-- (Only after all rows are backfilled; low-impact at this point)
ALTER TABLE cases ALTER COLUMN matter_subtype SET NOT NULL;
ALTER TABLE cases ALTER COLUMN matter_subtype SET DEFAULT 'GENERAL';
```

**Never use:**
- `ALTER TABLE ... DROP COLUMN` until all application code no longer references it
- Renaming columns without a transition period (old name read by old code)
- Blocking table rewrites during business hours

---

## 10. Enterprise Support Model

### Three Support Tiers

| Feature | Community | Professional | Enterprise |
|---------|-----------|-------------|------------|
| **Monthly Price** | Free | $2,000 | $10,000 |
| **Annual Price** | Free | $20,000 | $100,000 |
| **Support Hours** | Community forums | Monday–Friday 9am–6pm ET | 24/7/365 |
| **Response SLA (P1)** | Best effort | 4 business hours | 1 hour |
| **Response SLA (P2)** | Best effort | 1 business day | 4 hours |
| **Response SLA (P3)** | Best effort | 3 business days | 1 business day |
| **Support Channels** | GitHub Issues, Slack | Email + Slack + Phone | All + Dedicated CSM |
| **Users** | Unlimited | Up to 100 | Unlimited |
| **Hosted Deployment** | Self-managed | Justice OS managed | Dedicated infrastructure |
| **Uptime SLA** | None | 99.9% | 99.95% |
| **Data Backup** | Self-managed | Daily backups | Continuous + tested restore |
| **Security Updates** | Community-driven | 24-hour patch SLA | 4-hour patch SLA |
| **Custom Integrations** | Community | Available at hourly rate | 20 hours/year included |
| **Dedicated CSM** | No | No | Yes |
| **Training** | Self-service | 4 hours/year included | 20 hours/year included |
| **Executive Reviews** | None | Quarterly (optional) | Monthly |

### SLA Response Time Table

| Severity | Description | Professional Response | Enterprise Response | Resolution Target |
|----------|-------------|----------------------|--------------------|--------------------|
| **P1 — Critical** | Platform down; data inaccessible; security breach | 4 business hours | 1 hour (24/7) | P: 8 hours; E: 4 hours |
| **P2 — High** | Core feature unavailable; significant performance degradation | 1 business day | 4 hours (business hours) | P: 3 days; E: 1 day |
| **P3 — Medium** | Non-critical feature issue; workaround available | 3 business days | 1 business day | P: 2 weeks; E: 3 days |
| **P4 — Low** | Cosmetic issue; feature request; documentation question | 5 business days | 2 business days | Next release cycle |

### Escalation Path

```
Level 1: Support Engineer
  → Initial triage, known issues, configuration help
  → Escalation trigger: unresolved after 2x response SLA

Level 2: Senior Engineer
  → Complex technical issues, database problems, integration debugging
  → Escalation trigger: unresolved P1 after 2 hours (Enterprise)

Level 3: Engineering Team Lead
  → Architectural issues, data loss incidents, security events
  → Escalation trigger: P1 unresolved after 4 hours, or data breach

Level 4: CTO / Executive Response
  → Major incidents, contractual SLA breach, media-sensitive situations
  → Notification: All P1 incidents > 4 hours
```

### Customer Success Manager (Enterprise)

Enterprise customers receive a dedicated Customer Success Manager who:
- Conducts monthly check-in calls (30 minutes)
- Reviews platform utilization and optimization opportunities
- Coordinates training for new staff and new features
- Serves as the single point of escalation for contract and billing issues
- Provides advance notice of upcoming releases and migration requirements
- Participates in the Enterprise Customer Advisory Board (quarterly)

---

*This document is maintained by the Justice OS Platform Engineering and Customer Success teams. For the latest version, see the internal documentation portal at docs.internal.justiceos.org.*
