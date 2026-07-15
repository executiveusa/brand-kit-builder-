# Architecture — Brand Kit Builder

## Initial application architecture

The product should evolve as a modular web application rather than a monolithic prompt wrapper.

```text
apps/web
  project dashboard
  intake workspace
  source ledger
  interview console
  strategy workspace
  voice workspace
  visual studio
  brand-book preview
  guardian review
  exports and handoff

packages/domain
  project schema
  source schema
  scoring rules
  brand strategy schema
  voice schema
  visual-system schema
  KAKU page schema
  guardian findings

packages/engine
  source adapters
  interview orchestrator
  prebuild scorer
  generation contracts
  quality gates
  provenance checks
  export coordinator

packages/renderers
  HTML brand book
  print/PDF styles
  token exports
  image-prompt exports
  handoff documents

packages/integrations
  GitHub
  image generation
  file storage
  browser inspection
  Figma/Canva when approved
```

## Recommended stack

- Next.js 15 with TypeScript
- Tailwind CSS v4
- Radix primitives and one coherent open-source icon family
- Zod for versioned domain schemas
- Server-side provider adapters behind typed interfaces
- Pluggable model gateway rather than provider-specific UI code
- Object storage for source files and generated assets
- Relational database for projects, sources, decisions, scores, approvals, and provenance
- Worker queue for document parsing, screenshots, image generation, PDF rendering, and batch exports

## Trust boundaries

- The browser never receives provider secrets.
- Uploaded files are untrusted input.
- Source extraction is separated from generation.
- Claims and proof remain blocked until approved.
- Asset mutations are explicit, scoped operations.
- Every generation records source references, model/provider, prompt version, timestamp, output hash, and approval status.

## State machine

```text
DRAFT
→ SOURCES_PENDING
→ DISCOVERY
→ PREBUILD_BLOCKED | PREBUILD_APPROVED
→ STRATEGY_REVIEW
→ VOICE_REVIEW
→ VISUAL_TERRITORIES
→ DIRECTION_APPROVED
→ PRODUCTION
→ GUARDIAN_REVIEW
→ RELEASE_BLOCKED | RELEASE_APPROVED
→ EXPORTED
```

## Non-goals for the first build

- Fully autonomous trademark clearance
- Automatic approval of claims or testimonials
- Unreviewed production deployment
- Replacing professional vector logo construction with raster AI output
