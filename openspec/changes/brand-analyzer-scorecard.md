# Change: brand-analyzer-scorecard

## Metadata

- **change-id:** brand-analyzer-scorecard
- **phase:** 07
- **ticket:** BKB-ANALYZER-001
- **risk-tier:** MEDIUM
- **status:** accepted
- **accepted-at:** 2026-07-24

## Context

The Brand Studio needs a unified analyzer that ties together site census (Phase 05), public research (Phase 06), Krug rules (Phase 03), and anti-slop rules (Phase 03) into an evidence-backed scorecard with upgrade checklist and PRD generation.

## Proposal

Create `src/research/brand-analyzer.mjs` — a Node.js-only analyzer that orchestrates all research and rule evaluation into a structured scorecard, rebuild checklist, and PRD with implementation tickets.

### Score categories (14)
clarity, scanability, hierarchy, interaction_obviousness, navigation, distinctiveness, design_system_consistency, typography, color, spacing_layout, responsive_quality, accessibility, proof_integrity, anti_slop_compliance

### Rebuild options (15)
clarify_positioning, rewrite_messaging, rebuild_ia, refresh_visual_identity, replace_design_system, rebuild_frontend, repair_accessibility, improve_performance, create_bilingual_content, build_blog_search, repair_reputation, rebuild_social, create_photo_video, create_brand_book, create_dev_handoff

### Flow
URL → site census → public research → Krug rules → anti-slop rules → scorecard → recommended rebuild options → selectable checklist → PRD → implementation tickets

### Every category shows
score, rules_triggered, evidence, severity, recommended_action, pass_threshold

## Scope

- `src/research/brand-analyzer.mjs` — NEW: 300+ line analyzer module
- `tests/brand-analyzer.test.mjs` — NEW: 16 tests

## Acceptance criteria

- [x] 14 score categories with evidence-backed scoring
- [x] 15 rebuild options with impact/cost/evidence_required
- [x] Scorecard never emits unexplained aggregate only
- [x] Rebuild checklist with selectable options
- [x] PRD generation from selected options
- [x] Implementation tickets decomposed from PRD
- [x] Rule results integrated (Krug + anti-slop)
- [x] Evidence confidence and conflict analysis
- [x] Recommended options based on low scores
- [x] Deterministic: same input produces same output
- [x] `npm run check` passes
- [x] `npm test` passes (224 tests, 222 pass, 2 skipped, 0 fail)
