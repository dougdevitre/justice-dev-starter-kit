# Architecture — Justice Dev Starter Kit

## System Overview

```mermaid
flowchart TB
    subgraph Client["Client (Browser)"]
        Pages[Next.js Pages]
        Components[React Components]
        AuthProvider[Auth Provider]
        BillingGate[Billing Gate]
    end

    subgraph Middleware["Edge Middleware"]
        AuthMW[Auth Middleware]
        RoleMW[Role Middleware]
        RateLimit[Rate Limiter]
    end

    subgraph API["API Routes"]
        AuthAPI[/api/auth]
        BillingAPI[/api/billing]
        AIAPI[/api/ai]
        DocAPI[/api/documents]
    end

    subgraph Services["Service Layer"]
        AuthLib[Auth Helpers]
        StripeLib[Stripe Billing]
        AILib[AI + Guardrails]
        DocLib[Doc Generation]
        StorageLib[Encrypted Storage]
        AuditLib[Audit Logger]
    end

    subgraph External["External Services"]
        Clerk[Clerk / Cognito]
        Stripe[Stripe]
        OpenAI[OpenAI]
        S3[AWS S3]
        DB[(Database)]
    end

    Pages --> AuthProvider
    Pages --> BillingGate
    Pages --> Components
    Components --> API
    API --> Middleware
    Middleware --> AuthMW
    Middleware --> RoleMW
    Middleware --> RateLimit
    AuthAPI --> AuthLib
    BillingAPI --> StripeLib
    AIAPI --> AILib
    DocAPI --> DocLib
    AuthLib --> Clerk
    StripeLib --> Stripe
    AILib --> OpenAI
    StorageLib --> S3
    AuditLib --> DB
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Middleware
    participant Clerk/Cognito
    participant App

    User->>App: Visit protected page
    App->>Middleware: Check session
    alt No session
        Middleware->>User: Redirect to login
        User->>Clerk/Cognito: Authenticate
        Clerk/Cognito->>Middleware: JWT token
    end
    Middleware->>Middleware: Validate token
    Middleware->>Middleware: Check role permissions
    Middleware->>App: Authorized request
    App->>User: Protected content
```

## Billing and Tier Gating

```mermaid
flowchart TB
    subgraph Tiers["Subscription Tiers"]
        Free[Free Tier<br/>Basic features]
        Starter[Starter<br/>$29/mo]
        Pro[Professional<br/>$99/mo]
    end

    subgraph Gating["Feature Gating"]
        Check{Check Tier}
        Allow[Allow Access]
        Block[Show Upgrade]
    end

    subgraph Stripe["Stripe Integration"]
        Checkout[Checkout Session]
        Webhook[Webhook Handler]
        Portal[Customer Portal]
    end

    Free --> Check
    Starter --> Check
    Pro --> Check
    Check -->|Tier sufficient| Allow
    Check -->|Tier too low| Block
    Block --> Checkout
    Checkout --> Stripe
    Webhook --> Tiers
    Portal --> Stripe
```

## Request Lifecycle

```mermaid
sequenceDiagram
    participant Client
    participant Middleware
    participant Route as API Route
    participant Service as Service Layer
    participant Audit as Audit Logger

    Client->>Middleware: HTTP Request
    Middleware->>Middleware: Auth check
    Middleware->>Middleware: Role check
    Middleware->>Middleware: Rate limit
    Middleware->>Route: Authorized request
    Route->>Service: Business logic
    Service->>Service: Process
    Service->>Audit: Log action
    Service-->>Route: Result
    Route-->>Client: Response
```

## Security Architecture

```mermaid
flowchart TB
    subgraph Edge["Edge Layer"]
        CSP[Content Security Policy]
        HSTS[HSTS Headers]
        XFO[X-Frame-Options]
        RateLimit[Rate Limiting]
    end

    subgraph Auth["Auth Layer"]
        JWT[JWT Validation]
        RBAC[Role-Based Access]
        Session[Session Management]
    end

    subgraph Data["Data Layer"]
        Encrypt[AES-256 Encryption]
        Audit[Audit Trail]
        Sanitize[Input Sanitization]
    end

    Edge --> Auth --> Data
```
