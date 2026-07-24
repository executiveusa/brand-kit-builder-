# Change: hallmark-design-intelligence

## Metadata

- **change-id:** hallmark-design-intelligence
- **phase:** 04
- **ticket:** BKB-HALLMARK-001
- **risk-tier:** MEDIUM
- **status:** accepted
- **accepted-at:** 2026-07-24
- **accepted-by:** GRINIONS-autonomous

## Context

The GRINIONS handoff requires integrating Hallmark's design intelligence concepts as a first-class anti-slop design quality subsystem. Hallmark becomes a donor/rule source feeding the canonical Brand Engine — not a runtime dependency, not a parallel design engine.

## Proposal

Create `apps/studio/design-intelligence.js` — a governed, provider-neutral design-quality module implementing four canonical Design Intelligence modes, a macrostructure registry, design fingerprinting, pre-emit critique, and similarity detection.

### Four canonical modes

1. **BUILD** — Create new design from approved brand truth. Pipeline: brief → macrostructure candidates → Krug scoring → anti-slop scoring → bounded route generation → critique → revision → Guardian review. Blocks on excessive similarity without brand evidence.

2. **AUDIT** — Analyze existing site/page/component. Returns category scores (clarity, scanability, hierarchy, etc.) with rule results and findings.

3. **REDESIGN** — Preserve factual content, brand truth, claims, URLs, essential functionality, SEO info. Produces current DNA, keep/remove/change lists, and 3 redesign directions.

4. **STUDY** — Analyze URL/screenshot/reference and extract abstract design DNA without cloning. Includes do-not-copy list (copyrighted illustrations, proprietary layouts, paid templates, branded assets, pixel-perfect copies).

### Macrostructure registry (12)

editorial-manifesto, workbench-product-tour, founder-letter, immersive-case-study, documentary-scroll, modular-service-index, narrative-portfolio, comparison-led, evidence-led, directory-led, utility-dashboard, campaign-story

Each defines: id, name, best_for, avoid_when, required_content, section_logic, interaction_pattern, density, navigation_pattern, mobile_behavior, krug_risks, slop_risks.

### Design fingerprint (13 fields)

macrostructure, grid_behavior, density, type_contrast, shape_language, image_behavior, color_behavior, motion_behavior, section_rhythm, navigation_style, surface_treatment, content_emphasis, distinctive_rules

Similarity detection: compares proposed fingerprint against prior Studio outputs. Excessive similarity (>85% by default) blocks generation unless brand evidence supports variation.

### Pre-emit critique (6 dimensions)

clarity, distinctiveness, hierarchy, coherence, usability, craft

Score 1-5. Any dimension <3 requires automatic revision. After 3 failed revisions: BLOCK.

## Scope

### Files changed

- `apps/studio/design-intelligence.js` — NEW: 500+ line design intelligence module
- `scripts/validate-studio.mjs` — added design-intelligence.js to file list
- `tests/design-intelligence.test.mjs` — NEW: 29 tests

### No runtime dependency on Hallmark

Hallmark is a concept donor only. No imports, no vendored code. The module implements the architectural concepts (macrostructure selection, anti-slop enforcement, study/redesign workflows, pre-generation critique, visual distinctiveness) as canonical Brand Engine use cases.

## Acceptance criteria

- [x] BUILD/AUDIT/REDESIGN/STUDY defined as canonical use cases
- [x] Macrostructure registry implemented (12 macrostructures)
- [x] DesignFingerprint implemented (13 fields)
- [x] Similarity detection implemented
- [x] Pre-emit critique implemented (6 dimensions, 1-5 scale, <3 = revise, 3 failures = BLOCK)
- [x] executeBuild blocks on excessive similarity without brand evidence
- [x] executeBuild blocks after 3 failed critique revisions
- [x] executeStudy enforces do-not-copy list
- [x] executeRedesign includes preserve constraints
- [x] executeAudit returns category scores
- [x] Deterministic: same input produces same output
- [x] No runtime dependency on Hallmark
- [x] No duplicate business logic
- [x] No fake proof capability
- [x] No pixel-cloning capability
- [x] `npm run check` passes
- [x] `npm test` passes (150 tests, 148 pass, 2 skipped, 0 fail)

## Rollback

Revert the squash merge commit. Module is additive — no existing behavior changed. See `ops/rollback/phase-04-hallmark-design-intelligence.json`.
