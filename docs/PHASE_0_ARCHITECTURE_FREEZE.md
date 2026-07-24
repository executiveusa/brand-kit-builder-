# Phase 0 Architecture Freeze — Pauli Brand Studio

Status: FROZEN FOR INCREMENTAL IMPLEMENTATION  
Bead: `ZTE-20260718-0003`  
Baseline audited: `main@7b0f142258570a32190081f88adb8361e6f64150`

## 1. Product definition

Pauli Brand Studio is an **agent-operated professional design studio**, not a logo generator, prompt wrapper, or monolithic SaaS dashboard.

Humans assign goals, resolve evidence conflicts, make material creative/ownership decisions, review work, and approve release. Specialized agents perform research, strategy, design-system work, asset production, implementation, QA, and handoffs inside bounded work orders.

The governing invariant is:

```text
                    ONE CANONICAL BRAND ENGINE
                              │
        ┌─────────────┬───────┼────────┬─────────────┐
        ▼             ▼       ▼        ▼             ▼
 Human Studio       CLI      MCP      SDK       HTTP API
        │             │       │        │             │
        └─────────────┴───────┼────────┴─────────────┘
                              ▼
                    Shared application use cases
                              ▼
       Canonical domain + evidence + rules + approvals
                              ▼
          Renderers / integrations / sandbox workers
```

No adapter may own a business rule that another adapter needs.

## 2. Architecture decisions

### ADR-001 — One Brand Engine

**Decision:** all human and agent transports call the same versioned use cases and canonical project state.

**Consequences:**
- current browser-side project rules and current agent-core rules are transitional duplicates;
- migration must happen behind compatibility adapters;
- UI code may format state but may not redefine gates, scoring, stage order, approval, provenance, or artifact contracts;
- MCP/CLI/HTTP handlers are transport adapters only.

### ADR-002 — Local-first, service-capable

**Decision:** local filesystem operation remains a first-class supported deployment mode.

Canonical persistence is accessed through interfaces:

```text
ProjectRepository
ArtifactStore
EventStore
JobRepository
UsageLedger
ApprovalRepository
WorkspaceProvider
```

Initial implementations may remain local JSON/files. Later database/object-storage adapters must not change domain contracts.

### ADR-003 — Paperclip is a replaceable control plane

**Decision:** Paperclip manages company/workforce concerns, not canonical brand truth.

Paperclip may own or mirror:
- companies;
- agents and reporting lines;
- goals/projects/issues;
- atomic task checkout;
- heartbeats/schedules;
- budget visibility;
- workspace/runtime links;
- approval requests and activity views.

Pauli Brand Studio remains authoritative for:
- BrandProject;
- EvidenceRecord;
- ResearchRun;
- DesignDecision;
- WorkOrder;
- Artifact/ArtifactVariant;
- RuleResult;
- GuardianReview;
- Approval;
- Release.

Removing Paperclip must not make a brand project unusable.

### ADR-004 — ICM governs filesystem context, not concurrency

**Decision:** use ICM's layered, plain-file context structure for context routing, stage contracts, references, outputs, and human edit surfaces.

Paperclip/orchestrators handle concurrency, assignment, retries, budgets, and workforce status.

### ADR-005 — Hermes is Studio Director

**Decision:** Hermes is the management/orchestration employee.

Hermes may:
- accept owner goals;
- create scoped project/work orders;
- assign specialists;
- monitor progress and budgets;
- summarize evidence and decisions;
- pause blocked work;
- request human decisions.

Hermes may not:
- approve its own work;
- create owner approval records;
- bypass Guardians;
- silently widen scope;
- deploy or merge without the applicable human gate.

### ADR-006 — Rules are executable artifacts

**Decision:** Steve Krug, anti-slop, accessibility, evidence, rights, and design-system laws become versioned rule packs with stable IDs.

Each evaluation returns:

```json
{
  "rule_id": "KRUG-CLARITY-001",
  "version": "1.0.0",
  "status": "PASS | WARN | BLOCK | NOT_APPLICABLE",
  "severity": "P0 | P1 | P2 | P3",
  "evidence": [],
  "scope": [],
  "confidence": 1.0,
  "message": "",
  "remediation": "",
  "waiver": null
}
```

A waiver requires a documented reason, authorized human identity, timestamp, and expiry/scope. Agents cannot self-waive release blockers.

### ADR-007 — Research truth is an evidence graph

**Decision:** observations, claims, inferences, conflicts, and sources are stored separately.

No generated conclusion is accepted as project truth solely because an LLM said it.

Each evidence item records source URL/path, source type, retrieval time, content hash where possible, confidence, rights/access state, verification state, and references to the conclusion(s) it supports.

### ADR-008 — Design production is token- and component-governed

**Decision:** approved brand truth compiles into a typed design system.

Production interfaces and templates use registered tokens/components/page recipes. Arbitrary values and duplicate primitives become lintable exceptions rather than normal implementation style.

### ADR-009 — Production logos are governed asset systems

**Decision:** logo work is a first-class domain capability with `preserve`, `refine`, `redesign`, and `new` modes.

A valid SVG file is not automatically a production logo. Vector syntax validation, provenance, variant behavior, small-size tests, monochrome/light/dark tests, rights checks, Design Guardian review, and human approval remain separate gates.

### ADR-010 — HTML is the canonical human review surface

**Decision:** HTML remains the primary inspectable review surface for audits, PRDs, design systems, brand books, reports, and handoffs.

PDF is a derived approved artifact and requires rendering plus page-level visual QA.

### ADR-011 — No provider lock-in

**Decision:** model/image/video/browser/design-tool integrations sit behind capability interfaces.

Examples:

```text
LanguageModelProvider
VisionModelProvider
ImageGenerationProvider
VideoGenerationProvider
BrowserInspectionProvider
VectorToolProvider
DesignToolProvider
RepositoryProvider
DeploymentProvider
```

Provider IDs and model versions are recorded as provenance, never embedded as core domain assumptions.

### ADR-012 — Multi-repository edits require isolated workspaces

**Decision:** one implementation ticket runs in one isolated worktree/sandbox with an explicit repository/file allowlist.

Required lifecycle:

```text
pre-change snapshot
→ isolated worktree
→ bounded edit
→ tests
→ preview/evidence
→ Guardian/review
→ branch/PR
→ human merge/release gate where required
→ cleanup or rollback
```

No agent may share a mutable working tree across unrelated tickets.

## 3. Canonical domain objects

Phase 1 contracts must version these objects independently of transport or storage:

### BrandProject
Identity, classification, owner, languages/market, scope, current lifecycle state, source/evidence references, approved decisions, active work, and release lineage.

### EvidenceRecord
Source pointer, retrieval/access metadata, observed content/hash, trust level, rights/access state, verification state, confidence, conflicts, and supported claims.

### ResearchRun
Bounded research objective, adapters used, queries/URLs, timestamps, budget, evidence IDs produced, errors, and completion state.

### DesignDecision
Question, alternatives, recommendation, selected option, rationale, evidence references, decision owner, timestamp, reversibility, and affected artifacts.

### WorkOrder
Exact objective, stage/capability, assigned role/agent, inputs, allowed tools/repos/files, required outputs, acceptance criteria, evidence, budget, idempotency key, dependencies, prohibited actions, rollback, and status.

### Artifact
Stable ID, project, type, version, path/object key, media type, size, hash, provenance, source/decision refs, approval state, validation state, and variants.

### ArtifactVariant
Parent artifact, purpose, dimensions/format, background/application constraints, generation/conversion provenance, validation results.

### RuleResult
Rule pack/version, stable rule ID, scope, evidence, status/severity, confidence, remediation, waiver metadata.

### GuardianReview
Guardian type, independent reviewer identity/role, project/artifact/rule scope, findings, evidence, status, timestamp.

### Approval
Human authority, exact action/scope, evidence hash/version, method/channel, timestamp, expiry/revocation state. Agent transports expose approval status read-only unless an explicitly human-authenticated approval adapter is in use.

### Release
Approved project/version, artifact manifest, Guardian summary, approvals, scorecards, provenance summary, repository/PR/deployment references, rollback data.

### RepoWorkspace
Repository identity, base SHA, worktree/sandbox ID, allowlist, branch, runtime/preview data, status, cleanup/rollback state.

### AgentAssignment
Agent identity/role, manager, work-order IDs, permitted capabilities, budget, heartbeat/status, escalation target.

## 4. Lifecycle and stage model

Canonical high-level lifecycle:

```text
INTAKE
→ SITE_CENSUS / SOURCE_ACQUISITION
→ PUBLIC_RESEARCH
→ DISCOVERY
→ READINESS
→ STRATEGY
→ VOICE
→ VISUAL_DIRECTION
→ DESIGN_SYSTEM
→ ASSET_PRODUCTION
→ APPLICATIONS
→ BRAND_BOOK
→ IMPLEMENTATION (optional scoped workstreams)
→ GUARDIANS
→ HUMAN_APPROVAL
→ EXPORT / PR / APPROVED_RELEASE
```

The engine may run research subjobs in parallel, but dependent stage transitions remain deterministic.

A project may omit non-applicable production stages only when the canonical capability contract records them `NOT_APPLICABLE` with rationale; it may not silently skip required gates.

## 5. Human decision boundaries

Human intervention is required for:

1. accepting/rejecting material scope options when multiple rebuild workstreams are proposed;
2. unresolved high-impact evidence conflicts;
3. destructive or identity-changing logo operations (`redesign`, destructive `refine` decisions);
4. rights/license exceptions or ambiguous ownership;
5. claim/testimonial/public-reputation statements requiring confirmation;
6. release approval;
7. irreversible actions;
8. production deployment/merge when policy requires it;
9. cost or blast-radius overrides.

Routine implementation choices do not require human interruption when they are reversible, within scope, and governed by existing contracts.

## 6. Trust boundaries

### Browser / Human Studio
- receives sanitized project/view state;
- never receives provider secrets;
- cannot manufacture approval;
- cannot write arbitrary filesystem paths;
- does not call external providers directly.

### Agent transports
- authenticated/authorized according to transport;
- operate through use cases, not direct JSON edits;
- all mutations require idempotency and audit context;
- may request work but cannot self-approve gated actions.

### Research/browser workers
- untrusted external content;
- bounded network destinations and payload sizes;
- private/link-local/localhost targets blocked unless an explicit local inspection mode authorizes a known target;
- public-web research policy applies;
- no authentication bypass or private-profile scraping.

### Provider workers
- secrets come from runtime vault/env adapters, never project JSON;
- prompts/inputs are minimized to allowed project data;
- outputs are untrusted until validated and reviewed;
- cost is reserved/enforced before execution.

### Repository sandboxes
- scoped repo/base SHA/branch/file allowlist;
- no cross-project filesystem access;
- no direct main writes;
- credentials scoped to required actions;
- rollback and pre-change evidence mandatory.

### Control plane
- Paperclip/Hermes status is orchestration metadata;
- canonical project truth remains available without the control plane;
- control-plane compromise must not create release approval.

## 7. Incremental migration law

Do not rewrite the working prototype into the aspirational directory structure in one pass.

Migration order:

1. `BKB-CONTRACT-001`: create canonical versioned contracts and parity tests.
2. Wrap current `src/agent` use cases behind the canonical engine interface.
3. Adapt Studio state to canonical snapshots while preserving localStorage migration/import.
4. Make CLI/MCP consume the same capability registry.
5. Formalize SDK.
6. Add new research/rules/design/asset capabilities behind the engine.
7. Add authenticated HTTP only after auth/audit/job contracts are stable.
8. Add Paperclip/Hermes adapter after canonical events/work orders exist.
9. Add isolated multi-repo execution after workspace/rollback contracts are testable.

## 8. Donor integration law

### Open Pomelli
Extract bounded ideas:
- URL/site census;
- deterministic style/font/logo extraction;
- parallel text/vision analysis;
- editable Brand DNA;
- campaign concept generation;
- platform specs;
- constrained asset canvas;
- photo presets;
- image-to-video.

Reimplement behind Pauli contracts; do not copy provider lock-in, one-page assumptions, unvalidated JSON parsing, or missing provenance/governance.

### Paperclip
Integrate through a replaceable adapter. Do not fork it into the Brand Engine and do not make its database the only copy of project truth.

### ICM
Use plain-file stage contracts and editable outputs as the workspace interface. ICM structures context; it does not replace the scheduler/control plane.

## 9. Phase 0 exit criteria

Phase 0 is complete when:

- this architecture is accepted as the implementation boundary;
- ICM stage/context contracts exist;
- Paperclip integration boundary is explicit;
- agent org chart and handoff chain are explicit;
- Krug/anti-slop executable rule model is specified;
- research/privacy and approval policies are encoded in `icm/_config`;
- canonical object inventory and trust boundaries are documented;
- no runtime migration has been performed prematurely;
- repository validation and full tests pass.

The next runtime ticket after Phase 0 is `BKB-CONTRACT-001`.
