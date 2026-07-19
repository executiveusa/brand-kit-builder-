# Bounded implementation tickets

These tickets are ordered by dependency and commercial leverage. Complete and verify one ticket before starting the next. Reconcile `main`, open PRs, and changed files before every ticket.

## Foundation sequence

### BKB-AUDIT-001 — Current-state audit and capability matrix

**Objective:** establish verified current reality before architecture or feature work.

**Likely files:** `docs/CURRENT_CAPABILITY_MATRIX.md`, audit report/plan only.

**Dependencies:** governing docs, current main, PR #11, tests, Open Pomelli/Paperclip/ICM references.

**Acceptance:** evidence-backed matrix; runtime/docs drift recorded; confirmed gaps decomposed; full CI passes.

**Verification:** `npm run check`; `npm test`.

**Evidence:** current main SHA, CI run, open PR list, cited files.

**Prohibited:** runtime rewrites, migrations, deployments.

**Rollback:** revert audit commits.

---

### BKB-PHASE0-001 — Architecture freeze and ICM Studio specification

**Objective:** freeze the portable, non-lock-in architecture before adding features.

**Likely files:** `docs/PHASE_0_ARCHITECTURE_FREEZE.md`, `docs/ICM_STUDIO_SPEC.md`, `docs/PAPERCLIP_INTEGRATION_BOUNDARY.md`, `docs/AGENT_ORG_CHART.md`, `docs/ANTI_SLOP_RULE_ENGINE_SPEC.md`, `icm/**` contracts.

**Dependencies:** BKB-AUDIT-001.

**Acceptance:** one Brand Engine; transport adapters separated; canonical objects defined; ICM 5-layer routing/stages defined; Paperclip optional; Hermes manager role defined; Krug rule-pack model defined; trust boundaries explicit.

**Verification:** repo validation; docs/reference checks; no conflicting runtime edits.

**Evidence:** architecture decision table, ICM stage map, agent org chart, threat-boundary diagram.

**Prohibited:** framework migration, DB migration, Paperclip vendoring, remote deployment.

**Rollback:** revert Phase 0 docs/contracts.

---

### BKB-CONTRACT-001 — Canonical domain, versions, capability and artifact contracts

**Objective:** eliminate duplicated state/schema drift before more adapters are added.

**Likely files:** new `src/domain/` or agreed incremental compatibility layer, schemas, constants, tests, capability descriptor.

**Dependencies:** BKB-PHASE0-001.

**Acceptance:** one canonical stage list; one prebuild axis set/criticality; one app version source; versioned `BrandProject`, `EvidenceRecord`, `WorkOrder`, `Artifact`, `GuardianReview`, `Approval`, `Release`; machine-readable capability registry; compatibility adapters for existing UI/core.

**Verification:** parity tests across UI/core IDs; all existing tests; version-parity test.

**Evidence:** schema fixtures and adapter compatibility matrix.

**Prohibited:** breaking stored local projects without migration compatibility.

**Rollback:** revert compatibility layer and preserve old schemas.

---

## Research and analysis sequence

### BKB-RESEARCH-001 — Safe URL/site census adapter

**Objective:** paste a URL and produce deterministic, source-traceable site census data.

**Dependencies:** BKB-CONTRACT-001.

**Acceptance:** normalized URL; SSRF/private-network protection; robots/access policy handling; sitemap/internal-page discovery; bounded page sampling; desktop/mobile screenshots; DOM/meta/copy/font/color/logo/component extraction; errors recorded without fabrication.

**Verification:** fixture sites; SSRF tests; timeout/body-size limits; screenshot manifest hashes.

**Evidence:** `site-census.json`, screenshot manifest, source ledger entries.

**Prohibited:** login bypass, private data scraping, arbitrary browser downloads.

**Rollback:** disable adapter capability flag.

---

### BKB-RESEARCH-002 — Parallel public-web research and evidence graph

**Objective:** research public reputation, reviews, social presence, news, competitors and public company/profile information in parallel.

**Dependencies:** BKB-RESEARCH-001; evidence schema; search/browser adapters.

**Acceptance:** every claim has URL/source type/retrieved time/confidence/verification state; conflicting claims retained; public-only policy; per-source adapter isolation; bounded fan-out/cost.

**Verification:** mocked search adapters; conflict fixtures; duplicate-source reconciliation; privacy policy tests.

**Evidence:** `evidence-graph.json`, `reputation-report.json`, `social-presence.json`, `competitor-map.json`.

**Prohibited:** private LinkedIn scraping, auth bypass, fake reviews, inferred facts marked verified.

**Rollback:** disable affected research adapters.

---

### BKB-ANALYZER-001 — Brand Analyzer scorecard and upgrade options

**Objective:** turn research into an evidence-backed scorecard and selectable remediation options.

**Dependencies:** BKB-RESEARCH-002; BKB-RULES-001.

**Acceptance:** score categories carry rule IDs/evidence/severity/confidence/remediation; human sees checkbox workstreams with impact/effort/risk; selecting options creates scoped work orders, not one unbounded rebuild.

**Verification:** deterministic scoring fixtures; no score without evidence; option-to-ticket mapping tests.

**Evidence:** `brand-audit.json/html`, `upgrade-options.json`.

**Prohibited:** mystery aggregate score; automatic destructive rebuild.

**Rollback:** revert analyzer adapter.

---

## Anti-slop and design-system sequence

### BKB-RULES-001 — Executable Krug and anti-slop rules engine

**Objective:** convert prompt guidance into deterministic, versioned design law.

**Dependencies:** BKB-PHASE0-001; BKB-CONTRACT-001.

**Acceptance:** rule-pack schema; stable rule IDs; PASS/WARN/BLOCK; evidence requirements; score caps; Krug clarity/navigation/scanability/clickability/recovery rules; anti-slop UI/copy patterns; exemptions require documented reason and reviewer.

**Verification:** positive/negative fixtures; severity/cap tests; waiver audit tests.

**Evidence:** `rule-results.json`, human-readable report.

**Prohibited:** subjective score with no evidence; automatic waivers.

**Rollback:** version-pin previous rule pack.

---

### BKB-DESIGN-SYSTEM-001 — Canonical design-system compiler

**Objective:** compile approved brand truth into enforceable tokens, components, patterns and page recipes.

**Dependencies:** BKB-CONTRACT-001; BKB-RULES-001.

**Acceptance:** typed color/type/spacing/radius/border/shadow/layout/motion tokens; one icon family; component registry; page recipes; token-only lint rules; accessibility metadata; exportable implementation contract.

**Verification:** schema tests; token lint fixtures; duplicate-component and arbitrary-value detection.

**Evidence:** `design-system/` package and validation report.

**Prohibited:** universal Pauli visual style; arbitrary values bypassing tokens.

**Rollback:** preserve prior generated tokens and disable strict lint.

---

### BKB-FONT-001 — Licensed font registry and gallery

**Objective:** create a real production font library, not a screenshot imitation system.

**Dependencies:** rights policy; design-system schema.

**Acceptance:** actual licensed font files only; license/source/weights/styles/glyph coverage; es-MX support checks; specimens; role/personality metadata; fallback stacks; searchable gallery.

**Verification:** font parse/load tests; glyph coverage; license metadata required.

**Evidence:** font registry and specimen gallery.

**Prohibited:** reconstructing proprietary fonts from screenshots; unlicensed redistribution.

**Rollback:** remove registry entries/assets while retaining metadata audit.

---

## Logo, asset and brand-book sequence

### BKB-LOGO-001 — Logo asset model and deterministic SVG validator

**Objective:** make production vector identity a first-class governed asset type.

**Dependencies:** BKB-CONTRACT-001; rights/provenance schema.

**Acceptance:** preserve/refine/redesign/new modes; canonical logo manifest; SVG parse/viewBox; no embedded raster master; no scripts/events/external URLs; text/font dependency report; ID/reference integrity; complexity metrics; hashes/provenance; PASS/WARN/BLOCK.

**Verification:** malicious/invalid/valid SVG fixtures; hash/manifest tests.

**Evidence:** `logo-validation-report.json`.

**Prohibited:** auto-trace automatically accepted as production logo.

**Rollback:** disable validator capability and retain original assets untouched.

---

### BKB-LOGO-002 — Logo production jobs and variant engine

**Objective:** orchestrate production/refinement and required responsive/color variants through guarded jobs.

**Dependencies:** BKB-LOGO-001; provider/vector adapters.

**Acceptance:** master/primary/responsive/raster/print applicability manifest; clear space/min size/prohibited uses; light/dark/mono/small-size render tests; provenance/versioning.

**Verification:** fixture identity package; missing converter produces explicit omitted status.

**Evidence:** logo package + QA report.

**Prohibited:** silent mutation of supplied identity.

**Rollback:** restore prior approved asset version.

---

### BKB-ASSET-001 — Provider-neutral campaigns, photo, image and video jobs

**Objective:** integrate the useful Open Pomelli production concepts behind governed provider-neutral jobs.

**Dependencies:** provider abstraction, asset locks, evidence/provenance, design system.

**Acceptance:** campaign concepts; platform format catalog; text-free image generation; editable text/layout layer; photo presets; image-to-video; async jobs; cost guard; assets always return through review/provenance.

**Verification:** provider mock tests; asset-lock tests; failure/omitted states; cost limits.

**Evidence:** job manifests, prompts, seeds/model metadata when available, hashes.

**Prohibited:** MuAPI hard lock-in; generated text baked into final editable designs by default.

**Rollback:** disable provider adapter.

---

### BKB-KAKU-001 — Structured visual brand-book renderer

**Objective:** keep KAKU sequence while replacing generic heading/paragraph rendering with a visual document model.

**Dependencies:** logo system, design system, application assets.

**Acceptance:** typed blocks for logo grids/anatomy/clear space/min sizes/swatches/type specimens/imagery/patterns/icons/mockups/digital frames/do-don't/rules/source/provenance; client tokens drive layout; EN/es-MX.

**Verification:** representative fixture render; HTML structural/a11y checks; screenshot visual QA.

**Evidence:** rendered HTML/screenshots.

**Prohibited:** copying KAKU visual style; universal Pauli template look.

**Rollback:** retain old renderer as compatibility fallback until verified.

---

### BKB-PRINT-001 — Approved PDF renderer and page-by-page QA

**Objective:** produce a real visually verified PDF from approved structured brandbook HTML.

**Dependencies:** BKB-KAKU-001.

**Acceptance:** local fixed-argument browser renderer; no arbitrary URL/args; page manifests; clipping/overflow/font/image/page-break/contrast checks; screenshots for every page; explicit omitted status on missing renderer.

**Verification:** PDF signature/page count/hash; render-to-image QA; malicious input tests.

**Evidence:** PDF, page screenshots, QA report.

**Prohibited:** claim PDF complete when omitted or unverified.

**Rollback:** disable PDF capability; HTML remains canonical review surface.

---

### BKB-EXPORT-001 — Canonical complete export manifest

**Objective:** one manifest governs all delivery transports and artifacts.

**Dependencies:** prior production modules.

**Acceptance:** full output tree; every artifact path/media/size/SHA-256/provenance/approval/version/status; explicit omitted reasons; ZIP deterministic enough for verification; no phantom artifacts.

**Verification:** manifest schema; file existence/hash; omitted-state tests.

**Evidence:** package manifest + ZIP inventory.

**Prohibited:** listing nonexistent artifacts.

**Rollback:** fall back to previous export schema with versioned compatibility.

---

## Agent/control-plane sequence

### BKB-ADAPTER-001 — Shared use cases across Studio, CLI, MCP and SDK

**Objective:** ensure every current interface calls one engine instead of duplicated rules.

**Dependencies:** BKB-CONTRACT-001.

**Acceptance:** stable SDK; capability parity tests; Studio host, CLI and MCP map to shared use cases; no adapter-owned approval/gate logic.

**Verification:** cross-adapter conformance tests.

**Evidence:** capability parity matrix.

**Prohibited:** breaking local-first operation.

**Rollback:** compatibility adapters.

---

### BKB-API-001 — Authenticated versioned HTTP API

**Objective:** allow remote Pauli agents to call the same engine safely.

**Dependencies:** BKB-ADAPTER-001; identity/auth; async jobs.

**Acceptance:** `/v1` capabilities/projects/status/validate/stages/jobs/assets/brandbook/guardians/exports; auth/authorization; request IDs; idempotency; audit; rate/cost guards; bounded payloads; no approval endpoint.

**Verification:** authz/idempotency/replay/payload/rate tests; OpenAPI contract.

**Evidence:** OpenAPI spec + conformance tests.

**Prohibited:** `POST /approve`; public unauthenticated operation.

**Rollback:** disable HTTP adapter, local transports remain.

---

### BKB-PAPERCLIP-001 — Replaceable Paperclip control-plane adapter

**Objective:** represent the design studio as an AI company without coupling brand truth to Paperclip internals.

**Dependencies:** capability/work-order/event contracts; HTTP/plugin boundary.

**Acceptance:** company/project/goal/issues mappings; agents/roles; atomic work checkout; heartbeat status; budgets; artifacts; approvals; workspace links; event reconciliation; idempotent sync; Paperclip can be removed without losing canonical Brand Studio state.

**Verification:** adapter contract tests against mocks or isolated Paperclip; replay/idempotency tests.

**Evidence:** mapping spec + sync logs.

**Prohibited:** vendoring/forking Paperclip into Brand Studio core; storing sole canonical brand state only in Paperclip.

**Rollback:** disable adapter; Brand Studio runs via CLI/MCP/SDK/API.

---

### BKB-HERMES-001 — Hermes Studio Director integration

**Objective:** make Hermes the manager that assigns, monitors and escalates work.

**Dependencies:** BKB-PAPERCLIP-001.

**Acceptance:** Hermes local/gateway adapter selection; project/task delegation; status summaries; blocker escalation; budget awareness; no creator self-approval; signed/human decision boundary retained.

**Verification:** smoke flow from issue -> Hermes -> specialist -> artifact -> Guardian -> human decision.

**Evidence:** run timeline and audit log.

**Prohibited:** Hermes directly mutating canonical project JSON or approving its own release.

**Rollback:** pause Hermes agent; manual/other orchestrator continues.

---

### BKB-SANDBOX-001 — Isolated multi-repository execution fleet

**Objective:** safely let design agents modify multiple client repositories while humans monitor a unified dashboard.

**Dependencies:** Paperclip workspace/runtime boundary; work-order contracts; repo adapter.

**Acceptance:** one worktree/sandbox per ticket; repo/file allowlists; bounded credentials; pre-change snapshot; preview; diff; smoke tests; rollback; branch/PR only; no cross-project writes.

**Verification:** escape/cross-repo tests; failed-build rollback; concurrent ticket isolation.

**Evidence:** worktree manifest, diffs, preview links, CI results.

**Prohibited:** direct main writes; public deploy without approval; >3-service blast radius without plan.

**Rollback:** discard worktree/branch and restore snapshot.

---

## Reference client

### BKB-REFERENCE-001 — Asc3nd controlled end-to-end validation

**Objective:** validate the reusable core on a real reference client only after required foundations are ready.

**Dependencies:** logo, renderer, Guardians, export, required research/design modules.

**Acceptance:** REFINE existing identity, not blind redesign; production vector variants; small-size and application tests; KAKU-structured brandbook; full provenance; Guardian passes; human approval.

**Verification:** 16/32px, website header, event page, social avatar, shirt, banner, vinyl, embroidery simplification; full export validation.

**Prohibited:** using Asc3nd-specific hacks to bypass unfinished reusable core.

**Rollback:** retain original identity and prior approved files.
