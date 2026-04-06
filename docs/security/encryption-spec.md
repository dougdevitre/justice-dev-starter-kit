# Encryption Specification — CoTrackPro

> **Status:** Production  
> **Applicability:** All CoTrackPro systems and data  
> **Last Updated:** 2026-04-06  
> **Owner:** Security Engineering Team

---

## Table of Contents

1. [Overview](#overview)
2. [Encryption at Rest](#encryption-at-rest)
3. [Encryption in Transit](#encryption-in-transit)
4. [Key Management](#key-management)
5. [Child Data Encryption](#child-data-encryption)
6. [Password Hashing](#password-hashing)
7. [Application-Level Encryption](#application-level-encryption)
8. [Cryptographic Standards Reference](#cryptographic-standards-reference)
9. [Implementation Guidance](#implementation-guidance)
10. [Validation and Testing](#validation-and-testing)

---

## Overview

CoTrackPro uses encryption as a foundational layer of defense across all data states. This document specifies the cryptographic algorithms, key lengths, protocols, and implementation requirements that must be followed by all engineers and system integrations.

### Threat Model Summary

| Threat | Encryption Control |
|-------|------------------|
| Unauthorized access to AWS account | AES-256 at rest; CMK with IAM restrictions |
| Compromised database credentials | Encryption keys separate from data; crypto-erasure capability |
| Network interception | TLS 1.3 in transit; certificate pinning for mobile clients |
| Insider threat (CoTrackPro staff) | Envelope encryption; staff access limited to envelope keys |
| Physical media theft | AWS facility-managed encryption; no unencrypted hardware |
| Weak password exploitation | Argon2id hashing with high memory cost; MFA required |

---

## Encryption at Rest

### AES-256-GCM Standard

All persistent data is encrypted using **AES-256-GCM** (Advanced Encryption Standard, 256-bit key, Galois/Counter Mode).

**Why AES-256-GCM?**
- 256-bit key provides 128-bit security against quantum attacks (Grover's algorithm)
- GCM mode provides authenticated encryption (confidentiality + integrity)
- FIPS 140-2 approved
- Required by HIPAA, FERPA, NIST SP 800-111

### Encryption Coverage by Data Store

| Data Store | Encryption Method | Key Type | Key Rotation |
|-----------|-----------------|---------|-------------|
| DynamoDB (primary data) | AWS-managed + CMK envelope | AWS KMS CMK | Annual |
| DynamoDB (PHI tables) | CMK with separate key per data classification | AWS KMS CMK | Annual |
| S3 (file storage) | SSE-KMS | AWS KMS CMK | Annual |
| S3 (evidence vault) | SSE-KMS + client-side AES-256 | Dual: KMS CMK + per-user DEK | Annual + per-key |
| RDS / DynamoDB backups | Same CMK as source | AWS KMS CMK | Annual |
| CloudWatch Logs | SSE-KMS | Log group KMS key | Annual |
| Secrets Manager | AWS-managed | AWS-managed | Automatic |
| EBS volumes (EC2) | AES-256 | AWS KMS CMK | Annual |

### Envelope Encryption Architecture

```
┌─────────────────────────────────────────┐
│              KMS CMK (Master Key)        │
│         Lives only in AWS KMS HSM       │
└─────────────────┬───────────────────────┘
                  │ encrypts
                  ▼
┌─────────────────────────────────────────┐
│         Data Encryption Key (DEK)        │
│    AES-256 random key per data object   │
│      Stored encrypted alongside data    │
└─────────────────┬───────────────────────┘
                  │ encrypts
                  ▼
┌─────────────────────────────────────────┐
│              Plaintext Data              │
│        Stored encrypted at rest         │
└─────────────────────────────────────────┘
```

**Benefits:**
- CMK never leaves KMS HSM
- Compromised DEK affects only one object; CMK rotation re-encrypts all DEKs
- Crypto-erasure: delete DEK to make data irrecoverable without deletion

### KMS Key Architecture

| Key ID | Purpose | Policy | Rotation |
|--------|---------|--------|---------|
| `cotrackpro-phi-key` | PHI data encryption | Restricted to PHI-access roles | Annual |
| `cotrackpro-ferpa-key` | FERPA record encryption | Restricted to FERPA-access roles | Annual |
| `cotrackpro-child-key` | Child data encryption | Restricted to child-data roles | Annual |
| `cotrackpro-audit-key` | Audit log encryption | Read-only for audit consumers | Annual |
| `cotrackpro-general-key` | General application data | Application role access | Annual |
| `cotrackpro-backup-key` | Backup encryption | Backup service only | Annual |

---

## Encryption in Transit

### TLS 1.3 Requirement

All data in transit is encrypted using **TLS 1.3** as the required minimum standard. TLS 1.2 is permitted as fallback for legacy integrations only with documented justification.

**TLS 1.3 Configuration:**

```
Supported Cipher Suites (TLS 1.3):
  - TLS_AES_256_GCM_SHA384       ← Preferred
  - TLS_CHACHA20_POLY1305_SHA256 ← Fallback
  - TLS_AES_128_GCM_SHA256       ← Last resort

Prohibited Cipher Suites (never use):
  - Any RC4 cipher
  - Any DES/3DES cipher  
  - NULL cipher suites
  - Anonymous cipher suites
  - Export cipher suites
  - TLS_RSA_* (no forward secrecy)
```

**TLS 1.2 Fallback (when permitted):**

```
Permitted TLS 1.2 Cipher Suites:
  - TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
  - TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
  - TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384

Prohibited TLS 1.2 Cipher Suites:
  - Anything not in the permitted list above
```

**Protocol Versions:**

| Protocol | Status |
|---------|--------|
| TLS 1.3 | ✅ Required (preferred) |
| TLS 1.2 | ⚠️ Permitted (legacy only, documented) |
| TLS 1.1 | ❌ Prohibited |
| TLS 1.0 | ❌ Prohibited |
| SSL 3.0 | ❌ Prohibited |
| SSL 2.0 | ❌ Prohibited |

### Certificate Requirements

| Certificate Usage | Type | Key Size | Validity | CA |
|-----------------|------|---------|---------|-----|
| Public HTTPS | DV or OV | RSA 2048+ or ECDSA P-256 | ≤ 398 days | Public CA (ACM/Let's Encrypt) |
| API endpoints | OV | RSA 2048+ or ECDSA P-256 | ≤ 398 days | Public CA |
| Internal services | Internal | RSA 2048+ or ECDSA P-256 | ≤ 2 years | Internal CA |
| Client mutual TLS | Client cert | ECDSA P-256 | ≤ 1 year | CoTrackPro CA |

**Certificate Pinning:** Mobile applications implement certificate pinning for all API endpoints. Pin set includes the leaf certificate + intermediate CA. Backup pins are maintained for rotation.

### HSTS Configuration

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

- `max-age=31536000` — 1 year HSTS duration
- `includeSubDomains` — applies to all subdomains
- `preload` — submitted to HSTS preload list

### Connection Encryption by Integration Type

| Connection | Protocol | Authentication | Notes |
|-----------|---------|---------------|-------|
| Browser → CoTrackPro | TLS 1.3 | Server cert | HSTS enforced |
| Mobile app → API | TLS 1.3 | Server cert + pinning | Certificate pinning |
| CoTrackPro → DynamoDB | TLS 1.3 via VPC endpoint | IAM | AWS-managed |
| CoTrackPro → S3 | TLS 1.3 via VPC endpoint | IAM | AWS-managed |
| CoTrackPro → Anthropic Claude | TLS 1.3 | API key | No PHI sent to Claude |
| CoTrackPro → Stripe | TLS 1.3 | API key | PCI DSS scope |
| CoTrackPro → Cognito | TLS 1.3 | OIDC/OAuth2 | AWS-managed |
| WebSocket connections | WSS (TLS 1.3) | Session token | Real-time updates |

---

## Key Management

### Key Lifecycle

```
1. GENERATION
   - CMKs: Generated in AWS KMS HSM (FIPS 140-2 Level 3)
   - DEKs: Generated by application using AWS SDK GenerateDataKey API
   - Session keys: Generated per-connection by TLS handshake

2. DISTRIBUTION
   - CMKs: Never leave KMS; accessed via API only
   - DEKs: Transmitted encrypted under CMK; never in plaintext over network
   - API keys: Stored in AWS Secrets Manager; rotated via automation

3. STORAGE
   - CMKs: KMS HSM (hardware security module)
   - DEKs: Stored encrypted alongside data in DynamoDB/S3
   - Secrets: AWS Secrets Manager (encrypted at rest with KMS)

4. USE
   - Decryption requires IAM permission + KMS key policy
   - All KMS operations logged in CloudTrail
   - Key usage anomalies trigger security alerts

5. ROTATION
   - CMKs: Annual rotation (automatic via KMS)
   - DEKs: Re-generated on each write (new random DEK per write)
   - API keys: 90-day rotation or on compromise
   - TLS certificates: Before expiry (automated via ACM)

6. REVOCATION
   - Immediate: Disable KMS key in emergency (makes all data inaccessible)
   - Planned: Key scheduled for deletion after 7-30 day waiting period
   - API key compromise: Revoke immediately in provider portal + Secrets Manager

7. DESTRUCTION
   - KMS key deletion: 7-day minimum waiting period; 30 days for PHI keys
   - Crypto-erasure: Delete DEK to render data irrecoverable
   - Hardware: AWS handles; CoTrackPro does not manage physical media
```

### Break-Glass Key Access

For emergency scenarios (security incident, legal discovery, system recovery):

1. Break-glass access requires **dual approval** (Security Officer + CTO)
2. Break-glass access is **time-limited** (maximum 4 hours)
3. All break-glass key operations are **logged and alerted** to the security team
4. Post-incident review required within 24 hours
5. Keys used in break-glass scenario are scheduled for rotation

### Key Hierarchy

```
AWS Account Root
  └── AWS Organizations KMS Key Policy
       └── CMK: cotrackpro-phi-key (PHI data)
       │    └── DEK per PHI object
       └── CMK: cotrackpro-child-key (child data)
       │    └── DEK per child data object
       └── CMK: cotrackpro-ferpa-key (educational records)
       │    └── DEK per FERPA record
       └── CMK: cotrackpro-general-key (general data)
            └── DEK per data object
```

---

## Child Data Encryption

Child data receives heightened encryption protections beyond standard requirements.

### Additional Controls for Child Data

| Control | Standard Data | Child Data |
|---------|-------------|-----------|
| Encryption key | General CMK | Dedicated `cotrackpro-child-key` CMK |
| Key access | Application role | Restricted role set (child-data-processor) |
| Key rotation | Annual | Annual |
| Client-side encryption | Not required | Required for evidence files |
| Deletion method | Crypto-erasure | Crypto-erasure + confirmation audit |
| Access logging | Standard | Elevated; all access alerted to compliance |
| Backup encryption | Standard | Separate backup key for child data |

### Child Data Encryption Implementation

```typescript
// Pseudocode: How child data DEK is obtained
async function encryptChildData(plaintextData: Buffer, childId: string): Promise<EncryptedData> {
  // Request data key from child-specific CMK
  const { CiphertextBlob, Plaintext } = await kms.generateDataKey({
    KeyId: process.env.CHILD_DATA_KMS_KEY_ID, // cotrackpro-child-key
    KeySpec: 'AES_256',
    EncryptionContext: {
      childId,
      purpose: 'child-record-encryption',
      timestamp: new Date().toISOString(),
    },
  });

  // Encrypt with the plaintext DEK
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', Plaintext, iv);
  const encryptedData = Buffer.concat([cipher.update(plaintextData), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Store encrypted DEK alongside data; never store plaintext DEK
  return {
    encryptedData,
    encryptedDEK: CiphertextBlob,
    iv,
    authTag,
    encryptionContext: { childId },
  };
}
```

### Child Evidence File Encryption

Evidence files (photos, video, documents) associated with child welfare cases:

1. Client-side encryption before upload: file encrypted with random AES-256 key in browser/app
2. Encryption key encrypted with `cotrackpro-child-key` CMK
3. Encrypted file uploaded to S3 with SSE-KMS as second layer
4. Access requires both IAM permission AND KMS key grant
5. Pre-signed URL generation requires re-authentication
6. Pre-signed URLs expire in 1 hour maximum

---

## Password Hashing

### Argon2id — Primary Algorithm

**CoTrackPro uses Argon2id for all password hashing.** Argon2id is the winner of the Password Hashing Competition (2015) and is recommended by OWASP, NIST, and RFC 9106.

**Argon2id Parameters (2026 baseline):**

```
Algorithm:    Argon2id
Memory cost:  64 MiB (65536 KiB) — minimum; increase as hardware allows
Iterations:   3 (minimum)
Parallelism:  4 (match to available CPU threads)
Salt length:  16 bytes (random, unique per password)
Hash length:  32 bytes
```

**Why these parameters?**
- Memory cost of 64 MiB makes GPU/ASIC attacks expensive
- Iterations of 3 provides adequate time cost
- Results in ~200-500ms hashing time on modern server hardware
- Per OWASP: "Use Argon2id with a minimum configuration of 19 MiB of memory, an iteration count of 2, and 1 degree of parallelism" — these parameters exceed minimums

### bcrypt — Legacy Fallback

For systems where Argon2id is not available (Node.js bcryptjs legacy path):

```
Algorithm:  bcrypt
Cost factor: 12 (minimum); 14 preferred
Salt:        bcrypt built-in (automatically unique per hash)
```

**Migration:** Any bcrypt hashes must be migrated to Argon2id on next user login.

### Prohibited Password Hashing Methods

| Algorithm | Status | Reason |
|-----------|--------|--------|
| MD5 | ❌ PROHIBITED | Not a password hash; trivially broken |
| SHA-1 | ❌ PROHIBITED | Not a password hash; fast, GPU-parallelizable |
| SHA-256 | ❌ PROHIBITED | Not a password hash; fast, GPU-parallelizable |
| SHA-512 | ❌ PROHIBITED | Not a password hash; fast, GPU-parallelizable |
| Unsalted any algorithm | ❌ PROHIBITED | Rainbow table attacks |
| bcrypt cost < 10 | ❌ PROHIBITED | Too fast; insufficient work factor |
| MD5crypt / sha256crypt | ❌ PROHIBITED | Deprecated Unix methods |

### Password Hash Implementation

```typescript
import * as argon2 from 'argon2';

const ARGON2_OPTIONS: argon2.Options = {
  type: argon2.argon2id,
  memoryCost: 65536,  // 64 MiB
  timeCost: 3,        // iterations
  parallelism: 4,
  hashLength: 32,
  saltLength: 16,
};

export async function hashPassword(plaintext: string): Promise<string> {
  return argon2.hash(plaintext, ARGON2_OPTIONS);
}

export async function verifyPassword(hash: string, plaintext: string): Promise<boolean> {
  return argon2.verify(hash, plaintext);
}

// Check if hash needs re-hashing (parameters changed or legacy bcrypt)
export function needsRehash(hash: string): boolean {
  return argon2.needsRehash(hash, ARGON2_OPTIONS);
}
```

---

## Application-Level Encryption

### When Application-Level Encryption Is Required

In addition to AWS-managed encryption, application-level (client-side) encryption is required for:

1. **PHI fields** — encrypted before writing to DynamoDB (field-level encryption)
2. **Child data fields** — encrypted before writing to any store
3. **Evidence files** — encrypted before upload to S3
4. **Exported data** — encrypted archive delivered to users
5. **Session tokens containing sensitive claims** — JWE (JSON Web Encryption) not just JWS

### Field-Level Encryption for PHI

```typescript
// PHI fields encrypted at application layer before DynamoDB write
const PHI_FIELDS = ['diagnosis', 'treatmentNotes', 'medicationList', 'mentalHealthHistory'];

async function encryptPHIFields(record: CaseRecord): Promise<EncryptedCaseRecord> {
  const encryptedRecord = { ...record };
  
  for (const field of PHI_FIELDS) {
    if (record[field]) {
      encryptedRecord[field] = await encryptWithCMK(
        record[field],
        'cotrackpro-phi-key',
        { caseId: record.caseId, field, userId: record.userId }
      );
    }
  }
  
  return encryptedRecord;
}
```

### JWT/Session Token Security

| Token Type | Algorithm | Expiry | Storage |
|-----------|-----------|-------|---------|
| Access token | RS256 (RSA 2048) | 15 minutes | Memory only (not localStorage) |
| Refresh token | RS256 (RSA 2048) | 7 days | httpOnly + Secure cookie |
| Session token | RS256 (RSA 2048) | 24 hours | httpOnly + Secure cookie |
| API key (service-to-service) | HMAC-SHA256 | No expiry (rotated 90 days) | AWS Secrets Manager |

**Security Headers for JWT/Cookie:**
```
Set-Cookie: session=<token>; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400
```

---

## Cryptographic Standards Reference

### Approved Algorithms Summary

| Use Case | Algorithm | Key Size / Parameters |
|---------|-----------|----------------------|
| Symmetric encryption | AES-GCM | 256-bit key |
| Asymmetric encryption | RSA-OAEP | 2048-bit minimum; 4096-bit for long-term keys |
| Asymmetric encryption (modern) | ECDH | P-256 or P-384 curve |
| Digital signatures | RSA-PSS | 2048-bit minimum |
| Digital signatures (modern) | ECDSA | P-256 or P-384 curve |
| Key exchange | ECDHE | P-256 or P-384 curve |
| Password hashing | Argon2id | Memory ≥ 64 MiB, iterations ≥ 3 |
| General hashing | SHA-256 | 256-bit output |
| HMAC | HMAC-SHA-256 | 256-bit key |
| Key derivation | HKDF-SHA-256 | 256-bit output |
| Random number generation | CSPRNG only | OS-provided or hardware RNG |

### Prohibited Algorithms

| Algorithm | Category | Reason |
|----------|---------|--------|
| DES | Symmetric | 56-bit key; broken |
| 3DES | Symmetric | Birthday attacks; deprecated (NIST SP 800-67 Rev2) |
| RC4 | Stream cipher | Multiple vulnerabilities |
| RC2 | Symmetric | Weak; deprecated |
| MD5 | Hash | Collision attacks |
| SHA-1 | Hash | SHAttered collision attack |
| RSA < 2048 | Asymmetric | Insufficient key length |
| DSA | Asymmetric | Largely superseded; parameter issues |
| DH < 2048 | Key exchange | Logjam vulnerability |
| ECB mode | Block cipher mode | Deterministic; reveals patterns |

---

## Implementation Guidance

### Secure Coding Rules

1. **Never log encryption keys, DEKs, or plaintext sensitive data**
2. **Use constant-time comparison for MAC/signature verification** (prevent timing attacks)
3. **Use OS/hardware CSPRNG** — never `Math.random()` for security purposes
4. **Generate IVs/nonces randomly** — never reuse an IV with the same key (AES-GCM nonce reuse breaks confidentiality)
5. **Validate authentication tags** before using decrypted data (GCM auth tag)
6. **Wipe sensitive data from memory** after use where possible
7. **Never roll your own crypto** — use established libraries (AWS SDK crypto, Node.js `crypto` module)

### Approved Cryptographic Libraries

| Language | Library | Version |
|---------|--------|--------|
| Node.js | Node.js built-in `crypto` module | Built-in (Node 18+) |
| Node.js | `argon2` | Latest stable |
| Node.js | AWS SDK v3 KMS | Latest stable |
| TypeScript | Same as Node.js | — |
| Browser | Web Crypto API (SubtleCrypto) | Built-in |

### Environment Variables for Encryption Config

```bash
# KMS Key IDs (ARNs preferred in production)
KMS_PHI_KEY_ID=arn:aws:kms:us-east-1:ACCOUNT:key/KEY-UUID
KMS_CHILD_KEY_ID=arn:aws:kms:us-east-1:ACCOUNT:key/KEY-UUID
KMS_FERPA_KEY_ID=arn:aws:kms:us-east-1:ACCOUNT:key/KEY-UUID
KMS_GENERAL_KEY_ID=arn:aws:kms:us-east-1:ACCOUNT:key/KEY-UUID
KMS_AUDIT_KEY_ID=arn:aws:kms:us-east-1:ACCOUNT:key/KEY-UUID

# JWT signing key reference (stored in Secrets Manager)
JWT_SIGNING_KEY_SECRET_ARN=arn:aws:secretsmanager:us-east-1:ACCOUNT:secret:jwt-key

# TLS (handled by AWS ACM / load balancer; not application config)
```

---

## Validation and Testing

### Encryption Validation Tests

All cryptographic implementations require automated tests verifying:

1. **Correct algorithm and parameters:** Configuration matches this specification
2. **Ciphertext is not plaintext:** Encrypted output does not contain plaintext
3. **Decryption round-trip:** Decrypt(Encrypt(plaintext)) == plaintext
4. **IV uniqueness:** Two encryptions of same plaintext produce different ciphertext
5. **Auth tag validation:** Modified ciphertext fails decryption (GCM integrity)
6. **Key isolation:** PHI key cannot decrypt data encrypted with general key

### Security Testing

| Test Type | Frequency | Scope |
|-----------|---------|-------|
| Automated unit tests | Every build | Individual crypto functions |
| TLS configuration scan | Weekly | All public endpoints (testssl.sh or similar) |
| Penetration testing | Semi-annual | Encryption in transit + at rest |
| Key management review | Annual | KMS policies, rotation schedule |
| Algorithm deprecation review | Annual | Ensure no deprecated algorithms in use |

### TLS Grade Target

All public-facing endpoints must achieve **A+ rating** on SSL Labs (ssllabs.com).

Requirements for A+:
- TLS 1.3 support
- No TLS 1.0 or 1.1
- Strong cipher suites only
- HSTS with preload
- No certificate issues
- Perfect forward secrecy (ECDHE)

---

> **Contact:** security-engineering@cotrackpro.com  
> **Report a cryptographic weakness:** security@cotrackpro.com (PGP key available on request)
