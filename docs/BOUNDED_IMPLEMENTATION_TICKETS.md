# Bounded implementation tickets

This backlog is the authoritative dependency order after Phase 0. Complete and verify one ticket before beginning the next ticket **in the execution order below**, unless a ticket explicitly states it may run in parallel after all of its prerequisites are complete. Reconcile `main`, open PRs, and changed files before every ticket.

## Authoritative execution order

1. BKB-AUDIT-001
2. BKB-PHASE0-001
3. BKB-CONTRACT-001
4. BKB-STUDIO-COMPLIANCE-001
5. BKB-RULES-001
6. BKB-RESEARCH-001
7. BKB-RESEARCH-002
8. BKB-ANALYZER-001
9. BKB-PROVIDER-001
10. BKB-PLATFORM-001
11. BKB-DESIGN-SYSTEM-001
12. BKB-FONT-001
13. BKB-LOGO-001
14. BKB-LOGO-002
15. BKB-ASSET-001
16. BKB-GUARDIAN-001
17. BKB-KAKU-001
18. BKB-PRINT-001
19. BKB-EXPORT-001
20. BKB-ADAPTER-001
21. BKB-API-001
22. BKB-PAPERCLIP-001
23. BKB-HERMES-001
24. BKB-SANDBOX-001
25. BKB-REFERENCE-001

The document position and this numbered list agree. A later ticket may never be used as a hidden prerequisite for an earlier ticket.

---

## BKB-AUDIT-001 — Current-state audit and capability matrix

**Objective:** establish verified current reality before architecture or feature work.

**Dependencies:** governing docs, current main, PR #11, tests, Open Pomelli/Paperclip/ICM references.

**Likely files:** capability matrix, audit plan/report only.

**Acceptance:** evidence-backed matrix; runtime/docs drift recorded; confirmed gaps decomposed; full CI passes.

**Verification:** `npm run check`; `npm test`.

**Evidence:** main SHA, CI run, open PR/issues, files inspected.

**Prohibited:** runtime rewrites, migrations, deployment.

**Rollback:** revert audit commits.

---

## BKB-PHASE0-001 — Architecture freeze and ICM Studio specification

**Objective:** freeze portable non-lock-in architecture before feature work.

**Dependencies:** BKB-AUDIT-001.

**Likely files:** Phase 0 architecture docs, ICM contracts/policies/stage routers.

**Acceptance:** one Brand Engine; adapters separated; canonical objects defined; ICM 5-layer routing and 16 stage contracts; Paperclip optional; Hermes manager role; executable rule model; trust boundaries explicit.

**Verification:** repo validation and full tests; no overlapping concurrent edits.

**Evidence:** architecture decisions, ICM tree, agent org chart, control-plane boundary.

**Prohibited:** framework/DB migration, Paperclip vendoring, remote deployment.

**Rollback:** revert Phase 0 docs/contracts.

---

## BKB-CONTRACT-001 — Canonical domain, versions, capability and artifact contracts

**Objective:** eliminate duplicated browser/core state and schema drift before more adapters are added.

**Dependencies:** BKB-PHASE0-001.

**Likely files:** compatibility-first domain/schema layer, constants/version source, capability descriptor, tests.

**Acceptance:** one canonical stage list; one readiness-axis set/criticality; one app version source; versioned BrandProject/EvidenceRecord/ResearchRun/DesignDecision/WorkOrder/Artifact/RuleResult/GuardianReview/Approval/Release/RepoWorkspace/AgentAssignment; compatibility adapters preserve existing local projects.

**Verification:** UI/core parity tests; schema fixtures; version-parity test; all current tests.

**Evidence:** capability/schema matrix and migration compatibility fixtures.

**Prohibited:** breaking stored local projects without compatibility/migration path.

**Rollback:** remove compatibility layer and retain prior schemas/state readers.

---

## BKB-STUDIO-COMPLIANCE-001 — Close current Studio contract gaps

**Objective:** fix known current-shell violations before calling the existing UI release-ready.

**Dependencies:** BKB-CONTRACT-001 only when changes touch shared contracts; otherwise may be executed immediately after contract verification.

**Likely files:** `apps/studio/tour.js`, Studio validation/tests, accessible help metadata.

**Acceptance:** every actionable tour button has accessible name plus required `data-help`; validator/test fails when future actionable buttons omit required metadata; EN/es-MX tour behavior unchanged; skip/back/next/finish and keyboard controls still work.

**Verification:** Studio static validator, focused tour tests, full CI.

**Evidence:** DOM/test assertions; screenshots only if visual behavior changes.

**Prohibited:** redesigning the tour or unrelated Studio refactor.

**Rollback:** revert bounded UI/test commit.

---

## BKB-RULES-001 — Executable Krug and anti-slop rules engine

**Objective:** convert prompt guidance into deterministic, versioned design law.

**Dependencies:** BKB-CONTRACT-001.

**Likely files:** rule schemas/registry, evaluator, score-cap/waiver logic, tests.

**Acceptance:** stable rule IDs; PASS/WARN/BLOCK/NOT_APPLICABLE; evidence requirements; severity P0-P3; Krug clarity/CTA/scanability/hierarchy/clickability/navigation/recovery rules; anti-slop patterns; explicit human waiver contract; no agent self-waiver.

**Verification:** positive/negative fixtures, cap/severity/waiver tests.

**Evidence:** machine rule results + human report fixture.

**Prohibited:** unexplained aesthetic score or automatic waiver.

**Rollback:** version-pin previous rule pack/evaluator.

---

## BKB-RESEARCH-001 — Safe URL/site census adapter

**Objective:** paste a URL and produce deterministic source-traceable site census evidence.

**Dependencies:** BKB-CONTRACT-001.

**Likely files:** browser inspection adapter, site-census use case, evidence writers, tests.

**Acceptance:** URL normalization; SSRF/private-network protection; access/robots policy; sitemap/internal discovery; bounded representative pages; desktop/mobile screenshots; DOM/meta/copy/font/color/logo/component extraction; coverage/errors explicit.

**Verification:** fixture sites, SSRF/timeout/body-size tests, screenshot-manifest hashes.

**Evidence:** `site-census.json`, page inventory, screenshots/evidence records.

**Prohibited:** login bypass, private scraping, unrestricted crawl/downloads.

**Rollback:** disable adapter capability flag.

---

## BKB-RESEARCH-002 — Parallel public-web research and evidence graph

**Objective:** research public reputation, reviews, social presence, news, competitors and public company/profile information in parallel.

**Dependencies:** BKB-RESEARCH-001 and canonical evidence contracts.

**Likely files:** public search/research adapters, evidence reconciliation, research-run jobs, tests.

**Acceptance:** every claim has source URL/type/time/confidence/verification state; conflicts retained; public-only policy; bounded fan-out/cost; per-source adapter isolation.

**Verification:** mocked adapters, conflict/dedup fixtures, privacy/policy tests.

**Evidence:** evidence graph, reputation/social/competitor reports.

**Prohibited:** private LinkedIn scraping, auth bypass, fake reviews, inference marked verified.

**Rollback:** disable affected research adapter(s).

---

## BKB-ANALYZER-001 — Brand Analyzer scorecard and upgrade options

**Objective:** turn verified research plus executable rules into an evidence-backed scorecard and selectable remediation workstreams.

**Dependencies:** BKB-RESEARCH-002 and BKB-RULES-001 (both precede this ticket).

**Likely files:** analyzer/scoring use case, upgrade-option model/UI, tests.

**Acceptance:** categories carry rule IDs/evidence/severity/confidence/remediation; human receives checkbox workstreams with impact/effort/risk/dependencies; selected options create scoped work orders rather than one unbounded rebuild.

**Verification:** deterministic score fixtures; no score without evidence; option-to-ticket tests.

**Evidence:** `brand-audit.json/html`, `upgrade-options.json`.

**Prohibited:** mystery aggregate score, automatic destructive rebuild.

**Rollback:** disable analyzer capability.

---

## BKB-PROVIDER-001 — Provider-neutral model/media adapters

**Objective:** add safe interfaces for language, vision, image, video and optional vector providers without provider lock-in.

**Dependencies:** BKB-CONTRACT-001 and cost/security contracts.

**Likely files:** provider interfaces/registry, vault/env credential adapter, async job envelope, provenance/cost hooks, mocks/tests.

**Acceptance:** no provider-specific logic in UI/domain; secrets never enter project JSON; capability discovery; model/tool version provenance; bounded input/output; timeout/retry/cost controls; provider can be swapped or disabled.

**Verification:** mock-provider conformance, secret rejection, timeout/retry/cost tests.

**Evidence:** provider capability matrix and job provenance fixtures.

**Prohibited:** MuAPI or any single-provider hard dependency; browser-held secrets.

**Rollback:** disable provider adapter/registry entry.

---

## BKB-PLATFORM-001 — Versioned platform specification catalog

**Objective:** encode channel/aspect/copy/layout constraints as reviewable data instead of prompt folklore.

**Dependencies:** BKB-CONTRACT-001; public research may update evidence behind specs.

**Likely files:** platform schemas/catalog, version/source metadata, tests.

**Acceptance:** per-platform asset dimensions/aspect roles, safe copy limits/guidance, tone/layout hints, source/version/update date, applicability; no hard-coded provider dependency.

**Verification:** schema and version tests; sample asset-plan fixtures.

**Evidence:** catalog + source/update metadata.

**Prohibited:** presenting stale platform facts as timeless; unsupported invented limits.

**Rollback:** pin previous catalog version.

---

## BKB-DESIGN-SYSTEM-001 — Canonical design-system compiler

**Objective:** compile approved brand truth into enforceable tokens, components, patterns and page recipes.

**Dependencies:** BKB-CONTRACT-001 and BKB-RULES-001.

**Likely files:** visual/design-system schemas, compiler, linter, tests.

**Acceptance:** typed color/type/spacing/radius/border/shadow/layout/motion tokens; one icon family; component registry/states; page recipes; accessibility/localization metadata; token-only lint hooks.

**Verification:** schema/lint fixtures, duplicate-component/arbitrary-value detection.

**Evidence:** generated `design-system/` fixture and validation report.

**Prohibited:** universal Pauli visual style or arbitrary production values bypassing tokens.

**Rollback:** preserve prior generated tokens; disable strict linter if needed.

---

## BKB-FONT-001 — Licensed font registry and gallery

**Objective:** create a production font library from real licensed font binaries, not screenshot imitation.

**Dependencies:** BKB-DESIGN-SYSTEM-001 and rights policy.

**Likely files:** font registry/gallery, license metadata, specimen generator, tests.

**Acceptance:** actual licensed font files only; source/license/weights/styles/glyph coverage; es-MX coverage; role/personality metadata; fallback stacks; searchable specimens.

**Verification:** font parse/load, glyph coverage, required license metadata tests.

**Evidence:** registry and specimen gallery.

**Prohibited:** reconstructing proprietary fonts from screenshots or unlicensed redistribution.

**Rollback:** remove registry entry/binary while retaining audit metadata.

---

## BKB-LOGO-001 — Logo asset model and deterministic SVG validator

**Objective:** make production vector identity a first-class governed asset type.

**Dependencies:** BKB-CONTRACT-001 and rights/provenance contracts.

**Likely files:** logo schemas/validator/fixtures/tests.

**Acceptance:** preserve/refine/redesign/new policies; canonical manifest; SVG/XML/viewBox validation; embedded raster/script/event/external URL blocks; font/text dependency report; ID/reference integrity; complexity metrics; hashes/provenance; PASS/WARN/BLOCK.

**Verification:** malicious/invalid/valid SVG fixtures and manifest/hash tests.

**Evidence:** `logo-validation-report.json`.

**Prohibited:** treating auto-trace as automatically production-ready.

**Rollback:** disable validator capability; originals remain untouched.

---

## BKB-LOGO-002 — Logo production jobs and variant engine

**Objective:** orchestrate approved production/refinement and responsive/color variants through governed jobs.

**Dependencies:** BKB-LOGO-001 and BKB-PROVIDER-001/vector adapter where needed.

**Likely files:** logo job use cases, variant manifest, render tests.

**Acceptance:** master/primary/responsive/raster/print applicability; horizontal/vertical/symbol/wordmark/favicon; mono/reversed/light/dark; clear space/min size/prohibited uses; small-size tests; provenance/versioning.

**Verification:** fixture identity package; missing conversion tooling creates explicit omission.

**Evidence:** logo package + QA report.

**Prohibited:** silent mutation of supplied identity.

**Rollback:** restore prior approved asset version.

---

## BKB-ASSET-001 — Campaign/photo/image/video production jobs

**Objective:** integrate useful Open Pomelli production concepts behind governed provider-neutral jobs.

**Dependencies:** BKB-PROVIDER-001, BKB-PLATFORM-001, BKB-DESIGN-SYSTEM-001, asset locks/provenance.

**Likely files:** campaign/image/photo/video job use cases, constrained canvas hooks, manifests/tests.

**Acceptance:** campaign concepts; platform formats; text-free background generation by default; editable typography/layout layer; photo presets; image-to-video; async jobs; cost guard; review/provenance return path.

**Verification:** provider mocks, asset-lock/failure/omission/cost tests.

**Evidence:** job manifests, prompts/recipes, model/tool metadata and hashes.

**Prohibited:** provider lock-in or inaccessible baked-in text as default final design.

**Rollback:** disable production provider/capability.

---

## BKB-GUARDIAN-001 — Expand independent production Guardians

**Objective:** extend current four Guardians to cover the new production system without letting creators self-approve.

**Dependencies:** BKB-RULES-001, BKB-DESIGN-SYSTEM-001, BKB-LOGO-001; later capabilities register additional checks.

**Likely files:** Guardian schemas/check registries, independent reviewer assignment rules, tests.

**Acceptance:** Brand checks strategy/distinctiveness/logo/applications; Design checks Krug/anti-slop/logo/vector/type/color/accessibility/system/brandbook; Voice checks authenticity/claims/localization; Rights checks licenses/consent/provenance/trademark flags; reviewer independence recorded; P0/P1 gating preserved.

**Verification:** pass/fail fixtures, independence/self-approval rejection, rerun-after-change tests.

**Evidence:** Guardian reports with rule/evidence references.

**Prohibited:** silent waivers or creator as sole approver.

**Rollback:** keep prior Guardian set version-pinned.

---

## BKB-KAKU-001 — Structured visual brand-book renderer

**Objective:** preserve KAKU sequence while replacing generic heading/paragraph pages with a structured visual document model.

**Dependencies:** BKB-DESIGN-SYSTEM-001, BKB-LOGO-002 and applicable approved application assets.

**Likely files:** brandbook block schema/renderer/styles/tests.

**Acceptance:** typed blocks for logo grids/anatomy/clear space/min size/swatches/type specimens/imagery/patterns/icons/mockups/digital frames/do-don't/rules/source/provenance; client tokens drive layout; EN/es-MX.

**Verification:** representative render, semantic/a11y checks, screenshot QA.

**Evidence:** HTML and screenshots.

**Prohibited:** copying KAKU visual identity or forcing universal Pauli styling.

**Rollback:** old renderer remains compatibility fallback until verified.

---

## BKB-PRINT-001 — Approved PDF renderer and page-by-page QA

**Objective:** produce a real visually verified PDF from approved structured HTML.

**Dependencies:** BKB-KAKU-001.

**Likely files:** local fixed-argument renderer, page QA, CLI/use case, tests.

**Acceptance:** no arbitrary URL/args; page manifest; clipping/overflow/font/image/page-break/contrast checks; page screenshots; omitted status if unavailable.

**Verification:** PDF signature/page count/hash, render-to-image QA, malicious input tests.

**Evidence:** PDF, page screenshots, QA report.

**Prohibited:** claiming PDF complete when omitted/unverified.

**Rollback:** disable PDF capability; HTML remains canonical review surface.

---

## BKB-EXPORT-001 — Canonical complete export manifest/package

**Objective:** make one manifest authoritative for all delivered artifacts.

**Dependencies:** applicable production modules and Guardian contracts.

**Likely files:** artifact/package manifest schemas, exporter, tests.

**Acceptance:** full output tree; every artifact path/media/size/SHA-256/provenance/approval/version/status; explicit omission reasons; no phantom files.

**Verification:** schema, existence/hash and omission tests.

**Evidence:** package manifest and ZIP inventory.

**Prohibited:** listing nonexistent artifacts.

**Rollback:** versioned compatibility with previous export schema.

---

## BKB-ADAPTER-001 — Shared use cases across Studio, CLI, MCP and SDK

**Objective:** ensure current transports call one engine rather than duplicating rules.

**Dependencies:** BKB-CONTRACT-001; may begin only after preceding product contracts that its conformance suite must expose are stable.

**Likely files:** application use-case layer, SDK package/export map, CLI/MCP/Studio adapters, parity tests.

**Acceptance:** stable SDK; shared capability registry; cross-adapter project/state/artifact contract parity; no adapter-owned gate/approval logic.

**Verification:** conformance tests across Studio host/CLI/MCP/SDK.

**Evidence:** capability parity matrix.

**Prohibited:** breaking local-first operation.

**Rollback:** compatibility adapters preserve existing commands.

---

## BKB-API-001 — Authenticated versioned HTTP API

**Objective:** let remote Pauli agents call the same engine safely.

**Dependencies:** BKB-ADAPTER-001, identity/auth, async job contract.

**Likely files:** HTTP adapter/OpenAPI/authz/idempotency/audit/job routes/tests.

**Acceptance:** `/v1` capabilities/projects/status/validate/stages/jobs/assets/brandbook/guardians/exports; authentication/authorization; request IDs; idempotency; audit; bounded payload/rate/cost; no approval endpoint.

**Verification:** authz/replay/idempotency/payload/rate tests and OpenAPI conformance.

**Evidence:** OpenAPI spec + route conformance report.

**Prohibited:** `POST /approve`, public unauthenticated operation or browser-held provider secrets.

**Rollback:** disable HTTP adapter; local transports remain.

---

## BKB-PAPERCLIP-001 — Replaceable Paperclip control-plane adapter

**Objective:** represent the Studio as an AI company without coupling canonical brand truth to Paperclip internals.

**Dependencies:** BKB-ADAPTER-001 and stable WorkOrder/event/artifact/identity contracts; HTTP is optional depending deployment mode.

**Likely files:** integration adapter/mappings/events/tests, Paperclip company template.

**Acceptance:** project/work-order/agent/artifact mappings; atomic assignment/status; heartbeats/budgets/workspace links; idempotent event reconciliation; Brand Studio remains usable with adapter disabled.

**Verification:** mocked/isolated adapter contract and replay/idempotency tests.

**Evidence:** mapping table + sync log fixtures.

**Prohibited:** vendoring/forking Paperclip into core or storing sole canonical brand state there.

**Rollback:** disable adapter; CLI/MCP/SDK/API continue.

---

## BKB-HERMES-001 — Hermes Studio Director integration

**Objective:** make Hermes the manager that assigns, monitors and escalates bounded work.

**Dependencies:** BKB-PAPERCLIP-001.

**Likely files:** Hermes agent role/config/adapter mappings, smoke workflow tests.

**Acceptance:** local/gateway mode selection; delegation; status/blocker/budget summaries; specialist handoffs; human decision routing; no self-approval.

**Verification:** issue/work order → Hermes → specialist → artifact → Guardian → human-decision smoke flow.

**Evidence:** timeline/audit log.

**Prohibited:** direct canonical JSON edits or Hermes-created release approval.

**Rollback:** pause Hermes agent; another orchestrator/manual operations continue.

---

## BKB-SANDBOX-001 — Isolated multi-repository execution fleet

**Objective:** let agents modify multiple client repositories safely while humans monitor unified status.

**Dependencies:** WorkOrder/RepoWorkspace contracts and control-plane workspace adapter.

**Likely files:** sandbox/worktree provider, repo/file allowlists, snapshots/diffs/previews/rollback/test harness.

**Acceptance:** one worktree/sandbox per implementation ticket; scoped credentials; base SHA snapshot; preview/diff/tests; rollback; branch/PR only; project isolation.

**Verification:** path/cross-repo escape tests, concurrent isolation, failed-build rollback.

**Evidence:** workspace manifest, diff, preview and CI references.

**Prohibited:** direct main writes, unrelated repo changes, production deploy without approval, >3-service change without multi-service plan.

**Rollback:** discard worktree/branch and restore recorded base.

---

## BKB-REFERENCE-001 — Asc3nd controlled end-to-end validation

**Objective:** validate the reusable core on a real reference client only after required foundations are production-ready.

**Dependencies:** applicable research, rules, design system, logo, renderer, Guardians, export and handoff modules.

**Likely files:** client workspace/artifacts and reference validation tests; reusable core changes require separate tickets.

**Acceptance:** REFINE existing identity rather than blind redesign; production variants; 16/32px, website/event/social/shirt/banner/vinyl/embroidery-simplification tests; KAKU-structured book; provenance; Guardian passes; human approval.

**Verification:** full reference-client acceptance matrix and export validation.

**Evidence:** assets, screenshots, QA, release manifest.

**Prohibited:** Asc3nd-specific hacks used to bypass unfinished reusable core.

**Rollback:** retain original identity and prior approved client files.
