# Current Capability Matrix — 2026-07-18

Baseline: `main@7b0f142258570a32190081f88adb8361e6f64150`

This matrix records what is actually present in code on current `main`, not what earlier status messages or aspirational architecture documents claimed.

| Capability | Current status | Evidence / files | Test evidence | Human usable | Agent callable | Production ready | Decision | Confirmed gap / smallest safe ticket | Dependencies | Risk |
|---|---|---|---|---|---|---|---|---|---|---|
| Governing operating system | BUILT | `AGENTS.md`, prompt index, eight `docs/prompt/*` modules, source corpus | static repo validation | Yes, as rules/docs | Yes, as context | PARTIAL | KEEP | Convert selected rules into executable contracts rather than prompt-only policy | domain contracts | LOW |
| Bilingual Studio shell | BUILT/PARTIAL | `apps/studio/app.js`, i18n, phase CSS, three-panel UI | studio validation/tests | Yes | Indirect via host bridge | PARTIAL | EXTEND | Replace demo-like surfaces with canonical engine-backed workspaces; retain EN + es-MX and first-run tour | canonical engine | MEDIUM |
| First-run guided tour | BUILT | `apps/studio/tour.js`, Studio UI | studio validation | Yes | N/A | Yes for current shell | KEEP | Extend targets as new workspaces appear; maintain keyboard/skip/restart behavior | Studio shell | LOW |
| Project intake/state | TWO IMPLEMENTATIONS | Browser project model in `apps/studio/project-store.js`; agent core in `src/agent/*` | project/core tests | Yes | Yes | PARTIAL | CONSOLIDATE | Define one canonical versioned domain/project model and adapters | BKB-CONTRACT-001 | HIGH if migrated, LOW for spec |
| Persistent state | LOCAL/PARTIAL | browser `localStorage`; workspace JSON under `.brand-kit-builder/` and `projects/` | filesystem tests | Yes, single browser/workspace | Yes, local | NO for multi-agent service | EXTEND | Add storage interfaces before DB/object storage; preserve local-first | domain/storage interfaces | MEDIUM |
| Source ledger + gates | BUILT | `src/agent/orchestrator.mjs`, `store.mjs`, `studio-sync.mjs`, schemas | source/sync/security tests | Yes, manual metadata | Yes | PARTIAL | KEEP + EXTEND | Add real URL/repo/file/browser adapters and evidence graph; current engine validates records but does not acquire evidence | source adapters | MEDIUM |
| URL/site analysis | NOT BUILT | No Playwright/site census adapter in current Brand Studio | none | No | No | No | ADD | BKB-RESEARCH-001: safe URL census adapter using Open Pomelli patterns, multi-page sampling, screenshots, deterministic CSS/font/logo extraction | browser sandbox, evidence schema | MEDIUM |
| Public reputation/social/competitor research | NOT BUILT | No search/review/social research engine | none | No | No | No | ADD | BKB-RESEARCH-002: parallel public-web research workers with citations/confidence/conflict handling | research policy, browser/search adapters | HIGH due privacy/ToS scope |
| Discovery interview | BUILT/PARTIAL | `project-store.js` one-question state and Studio tools | UI/domain tests | Yes | Stage callable, not autonomous | PARTIAL | EXTEND | Bind discovery to research evidence, contradiction graph, confidence, and stop condition; current flow is mostly form/state logic | evidence graph | MEDIUM |
| 20-axis prebuild gate | BUILT WITH CONTRACT DRIFT | UI axes in `apps/studio/project-store.js`; core axes in `src/agent/constants.mjs`; mapping in `studio-sync.mjs` | prebuild/sync tests | Yes | Yes | PARTIAL | FIX FIRST | BKB-CONTRACT-001: canonical axis IDs/criticality. UI marks `business_clarity` critical while core critical set differs; duplicated schemas invite drift | canonical domain | MEDIUM |
| Strategy workspace | BUILT/PARTIAL | strategy fields/tools | tests for completeness/staging | Yes | Stage callable | No autonomous generation | KEEP + EXTEND | Provider-neutral strategy job uses evidence and same domain model | model adapter | MEDIUM |
| Voice workspace | BUILT/PARTIAL | voice fields/tools and bilingual rules | tests for stage completeness | Yes | Stage callable | PARTIAL | KEEP + EXTEND | Expand to full documented voice contract; deterministic anti-slop checks; evidence-backed language examples | rules engine | MEDIUM |
| Visual system workspace | BUILT/PARTIAL | `studio-project-store.js`; color/type/imagery/icon/layout/motion fields | visual stage tests | Yes | Stage callable | PARTIAL | EXTEND | Current visual model is shallow; add token compiler, component/pattern registry, application specs, font registry | design-system domain | MEDIUM |
| Production logo system | NOT BUILT | Current model only stores `logo_policy` + `logo_notes` | no SVG production validator | No real production workflow | No | No | ADD | BKB-LOGO-001 then BKB-LOGO-002: versioned logo assets + deterministic SVG QA + governed jobs | rights/provenance, render adapters | HIGH quality/rights |
| Font gallery/registry | NOT BUILT | no font registry or licensed font assets | none | No | No | No | ADD | BKB-FONT-001: licensed font registry + specimens + es-MX coverage + role metadata. Uploaded font archive contains reference imagery, not production font binaries | licensing policy | MEDIUM |
| Design-token export | BASIC | `apps/studio/export-package.js` exports five colors, typography strings, minimal layout/motion | export tests | Yes | Via export stage | PARTIAL | REPLACE INCREMENTALLY | BKB-DESIGN-SYSTEM-001: canonical typed tokens for color/type/spacing/radius/border/shadow/layout/motion and validation | canonical visual schema | MEDIUM |
| Deterministic Krug/anti-slop enforcement | PROMPT-ONLY | `docs/prompt/04-krug-antislop-dials.md`; Guardian wording | no executable Krug linter | Human checklist only | No deterministic API | No | ADD | BKB-RULES-001: versioned rule packs, rule IDs, evidence, severity/caps, machine results, merge blockers | browser/screenshots/a11y | HIGH leverage |
| KAKU structure | BUILT | 13 sections + 10 annexes in `kaku-brandbook.js` | brandbook tests | Yes | Stage callable | PARTIAL | KEEP | Preserve sequence only; evolve page content model | renderer contracts | LOW |
| Brand-book visual renderer | BASIC/INSUFFICIENT | `renderBrandbookDocument()` renders headings + paragraphs with generic Arial/Georgia CSS | structural tests | Yes as review HTML | Yes indirectly | No top-tier production quality | REPLACE RENDERER, KEEP DATA | BKB-KAKU-001: structured visual block model (logo grids, swatches, specimens, mockups, do/don't, source/provenance notes) driven by client tokens | visual assets/tokens | MEDIUM |
| PDF/print production | NOT PRESENT ON CURRENT MAIN | `apps/studio/README.md` and export manifest explicitly omit PDF; current CLI has no `render-pdf` command | no current main PDF command tests | No final PDF | No | No | ADD | BKB-PRINT-001: approved local renderer + page-by-page visual QA. Earlier status claims are not reflected in current main | browser renderer | MEDIUM |
| Export package | BUILT/PARTIAL | `apps/studio/export-package.js`, stored ZIP, SHA-256 manifest | export tests | Yes | Export stage | PARTIAL | EXTEND | BKB-EXPORT-001: canonical full output tree, provenance/approval/version per artifact, explicit omitted statuses, real asset folders | renderers/assets | MEDIUM |
| Four Guardians | BUILT/PARTIAL | Brand/Design/Voice/Rights state and release gate | guardian/export tests | Yes | State callable | PARTIAL | KEEP + EXTEND | BKB-GUARDIAN-001: add production-logo, Krug, design-system, page-QA, provenance checks; enforce independent reviewer execution identity | rules/asset validators | MEDIUM |
| Human approval boundary | BUILT | interactive CLI only; no MCP approval; evidence freshness checks | approval/security tests | Yes, terminal | Read-only visibility only | Strong local boundary | KEEP | Future remote cryptographic/signed human approval adapter; never add agent self-approval endpoint | auth/identity | HIGH if remote |
| JSON CLI | BUILT | `bin/brand-kit-builder.mjs` | CLI/core tests | Technical operator | Yes | Local only | KEEP | Expand through shared use cases; current commands are core stages only | canonical engine | LOW |
| MCP | BUILT | `bin/brand-kit-builder-mcp.mjs`, 7 tools, stdio | MCP discovery/call tests | N/A | Yes | Local only | KEEP | Expose new capabilities from shared registry; avoid duplicated tool schemas | capability contract | MEDIUM |
| SDK | INTERNAL ONLY | `src/agent/index.mjs` exports functions but package has no public export map/versioned SDK contract | core tests | N/A | Application code can import repo internals | No stable SDK | FORMALIZE | BKB-ADAPTER-001: stable SDK adapter over canonical use cases | domain/engine split | MEDIUM |
| Authenticated HTTP API | NOT BUILT | security docs explicitly state no HTTP API; only localhost Studio host exists | none for remote API | N/A | No | No | ADD LATER | BKB-API-001: authenticated versioned API, request IDs, idempotency, audit, async jobs, no approval endpoint | auth + engine + jobs | HIGH |
| Studio localhost host bridge | BUILT/PARTIAL | `scripts/studio-host.mjs`, `src/studio-host/*`, `agent-bridge.js` | host/session/symlink tests | Yes | Local host commands | Local only | KEEP AS ADAPTER | Treat as UI adapter; do not confuse with remote API | canonical engine | MEDIUM |
| Provider/model abstraction | NOT BUILT | current core makes no external calls | none | No | No | No | ADD | BKB-PROVIDER-001: provider-neutral model/image/video interfaces with vault-only credentials and cost accounting | jobs/security | HIGH |
| Image/campaign generation | NOT BUILT | asset manifest states no external images are generated | none | No | No | No | ADD FROM DONOR PATTERNS | Open Pomelli donor: campaign concepts, platform specs, text-free backgrounds, photo presets, animation. Rebuild behind provider-neutral governed jobs | provider adapters, asset locks | HIGH |
| Platform-spec catalog | NOT BUILT | no versioned platform library | none | No | No | No | ADD | BKB-PLATFORM-001: data-driven channel specs derived from current platform rules, versioned and reviewable | research updates | MEDIUM |
| Canvas/application editor | BASIC TWEAKS ONLY | Studio color/type/range controls and canvas preview | UI validation | Limited | No formal agent capability | No | EXTEND | Constrained brand canvas using approved tokens/components; do not build Illustrator clone | design system | MEDIUM |
| Multi-repository sandbox execution | NOT BUILT | current core forbids GitHub writes/deploy and has no worktree fleet | none | No | No | No | ADD VIA CONTROL PLANE | BKB-SANDBOX-001: isolated worktree per ticket, allowlists, diffs, previews, rollback | Paperclip/workspace adapter | HIGH |
| Paperclip control plane | NOT INTEGRATED | no Paperclip adapter in repo | none | No unified office dashboard | No | No | ADD AS OPTIONAL ADAPTER | BKB-PAPERCLIP-001: map BrandProject/WorkOrder/Agent/Artifact events to Paperclip company/project/issues; keep domain independent | HTTP/plugin adapter | HIGH |
| Hermes manager integration | NOT INTEGRATED | no Hermes contract in current repo | none | N/A | No | No | ADD | BKB-HERMES-001: Studio Director role using Paperclip built-in Hermes gateway/local adapter; cannot approve own work | Paperclip boundary | HIGH |
| ICM filesystem architecture | NOT BUILT | no `icm/` hierarchy | none | No | No | No | ADD | Phase 0 defines 5 layers, numbered stage folders, explicit inputs/process/outputs and editable handoff points | canonical contracts | LOW for spec |
| Unified agent office dashboard | NOT BUILT | Studio is project-centric, not org/workforce-centric | none | No | N/A | No | LATER | Use Paperclip UI/control plane for org chart, tasks, heartbeats, budget, workspaces; Studio embeds/links design-specific views | Paperclip adapter | HIGH |
| Version consistency | FAILING | `package.json` = `0.3.0`; core `APP_VERSION` = `0.2.0`; MCP server = `0.2.0`; skill = `0.2.0` | no cross-version contract test | N/A | N/A | No | FIX | BKB-CONTRACT-001 adds one version source and parity test | package/contract | LOW |
| CI/test baseline | PASSING BEFORE AUDIT | `.github/workflows/ci.yml`; PR #10 authoritative run | Agent Core CI run 29650565168 passed; 53 tests reported in prior report | N/A | N/A | baseline only | KEEP | Local clone was blocked by sandbox DNS; branch CI is authoritative | GitHub Actions | LOW |

## Current reality summary

The repository is a solid **governed local prototype/core**, not yet the complete production design company described in the product vision.

What is strongest today:

- source/readiness/stage/approval safety model;
- local CLI + MCP;
- bilingual guided Studio shell;
- deterministic artifact integrity and release gates;
- KAKU sequence and four-Guardian workflow.

The highest-leverage structural gaps are:

1. duplicated domain/state models and version drift;
2. prompt-only Krug/anti-slop rules instead of executable design law;
3. no real research/source acquisition engine;
4. no production logo/vector pipeline;
5. generic text-heavy brand-book renderer;
6. no provider-neutral asset production;
7. no stable SDK or authenticated remote API;
8. no ICM stage/context architecture;
9. no Paperclip/Hermes workforce control-plane integration;
10. no sandboxed multi-repository execution fleet.

## Donor-system conclusions

### Open Pomelli

Reuse concepts, not architecture wholesale:

- Playwright website census;
- deterministic CSS/font/logo extraction merged with vision/text analysis;
- editable Brand DNA;
- campaign goal -> multiple concepts;
- data-driven platform format specifications;
- constrained in-browser asset editor;
- text-free background regeneration;
- product photo style presets;
- image-to-video workflow.

Do not inherit:

- single MuAPI lock-in;
- one-page/one-screenshot analysis;
- synchronous expensive routes;
- single-user/no-auth assumptions;
- loose LLM JSON parsing;
- SQLite as canonical studio architecture;
- missing provenance/Guardian boundaries.

### Paperclip

Use as an optional replaceable **company/workforce control plane** for:

- agents as employees with roles/reporting lines;
- goals/projects/issues;
- atomic task checkout;
- heartbeats and schedules;
- budgets/cost limits;
- workspaces/worktrees/runtime previews;
- approvals/audit trails;
- Hermes local/gateway adapter;
- multi-company isolation.

Do not move canonical brand truth into Paperclip-specific entities. Pauli Brand Studio owns `BrandProject`, `EvidenceRecord`, `WorkOrder`, `DesignDecision`, `Artifact`, `GuardianReview`, `Approval`, and `Release`; Paperclip maps to them through an adapter.

### ICM

Adopt its five-layer filesystem context model:

- Layer 0: repo/studio identity;
- Layer 1: workspace routing;
- Layer 2: per-stage `CONTEXT.md` contract;
- Layer 3: stable rules/references (the factory);
- Layer 4: working artifacts (the product).

Use numbered stage folders for sequential design-production context and human edit surfaces. Do **not** use ICM as the concurrency scheduler; Paperclip handles parallel agents, ownership, heartbeats, budgets, and execution workspaces.
