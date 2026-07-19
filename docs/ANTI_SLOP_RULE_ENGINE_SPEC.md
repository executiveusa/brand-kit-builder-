# Executable Krug + Anti-Slop Rule Engine Specification

Status: Phase 0 contract

## 1. Purpose

The Studio must not depend on a model remembering good taste. Usability and anti-slop standards become deterministic, versioned, evidence-backed rules that agents and humans cannot silently bypass.

The rule engine does not replace professional design judgment. It blocks known failure patterns and forces subjective exceptions to be explicit and reviewable.

## 2. Rule-pack families

```text
KRUG        task clarity and usability
SLOP        generic AI/design anti-patterns
A11Y        accessibility
SYSTEM      design-system consistency
CONTENT     copy clarity/evidence/claims
BRAND       strategy and identity coherence
RIGHTS      licensing/provenance/consent
PERF        technical/performance budgets
REPO        implementation and handoff integrity
```

Each pack is independently versioned.

## 3. Rule schema

```yaml
id: KRUG-CLARITY-001
version: 1.0.0
title: Page purpose is immediately understandable
family: KRUG
severity: P1
default_result: BLOCK
applies_to:
  - website-page
  - landing-page
  - application-screen
method: hybrid
inputs:
  - rendered_screenshot
  - semantic_dom
  - page_metadata
assertion: >-
  A first-time user can determine what this is, who it serves, and the intended next action without reading instructions.
evidence_required:
  - screenshot
  - page_heading
  - primary_action
remediation: Clarify page identity, audience/value proposition, hierarchy, and primary action.
waivable: true
waiver_authority: human_design_lead
```

Required fields:
- stable ID;
- semantic version;
- title/family;
- severity;
- applicability;
- evaluation method;
- required inputs/evidence;
- assertion;
- pass/warn/block behavior;
- remediation;
- waiver rules.

## 4. Evaluation methods

### Deterministic

Examples:
- two H1 elements where one is required;
- missing accessible name;
- unregistered hex value;
- mixed icon families;
- missing focus indicator;
- duplicated component implementation;
- SVG contains script/external URL;
- primary button not keyboard reachable.

### Measured

Examples:
- contrast ratio;
- touch target size;
- text line length;
- heading order;
- Core Web Vitals when available;
- path/component complexity;
- image resolution.

### Heuristic with structured evidence

Examples:
- page purpose clarity;
- competing CTAs;
- misleading visual hierarchy;
- generic category copy;
- unnecessary decorative complexity.

A model may assist, but it must return evidence pointers and confidence. A Guardian can challenge the result.

### Human-only

Examples:
- distinctive enough for the strategic category;
- optical quality of a logo;
- cultural appropriateness where evidence cannot determine it;
- final identity selection.

Human-only rules still produce structured RuleResults.

## 5. Core Krug rules

Minimum executable set:

```text
KRUG-CLARITY-001  page purpose obvious
KRUG-CTA-001      one dominant primary action per task context
KRUG-SCAN-001     headings/labels/groups support scanning
KRUG-HIER-001     visual hierarchy matches information priority
KRUG-CLICK-001    interactive elements look interactive without hover
KRUG-CONVENTION-001 familiar conventions unless tested alternative is justified
KRUG-NAV-001      current location and navigation context are visible
KRUG-LABEL-001    page/destination label matches user expectation
KRUG-HOME-001     identity mark returns home where expected
KRUG-EXIT-001     modals/forms/dead ends have obvious recovery/exit
KRUG-FORM-001     forms request only necessary information
KRUG-ERROR-001    errors explain problem and recovery action
KRUG-MOBILE-001   primary workflow is comfortable on target mobile context
KRUG-TRUST-001    truthful trust evidence appears near relevant decisions
KRUG-REDUCE-001   words/decoration/motion that do not aid understanding or action are removed
```

The five-second test is a usability heuristic, not a fabricated scientific threshold. The system records it as an operational design check.

## 6. Core anti-slop rules

Reject or warn unless a documented, project-specific reason exists:

```text
SLOP-CLAIM-001    fake/unverified metrics, testimonials, awards, partners, urgency
SLOP-HERO-001     generic centered AI/SaaS hero with interchangeable copy
SLOP-GRADIENT-001 default purple/blue gradient without brand rationale
SLOP-GLASS-001    decorative glass/frosting used as default visual language
SLOP-CARD-001     nested/floating/repeated card-shell overuse
SLOP-RADIUS-001   oversized radius applied indiscriminately
SLOP-PILL-001     pill overload
SLOP-BENTO-001    meaningless bento grid used as first-layout reflex
SLOP-METRIC-001   metric-card grid with no decision value
SLOP-ICON-001     icon-card repetition or mixed icon families
SLOP-SPACE-001    excessive empty padding pretending to signal luxury
SLOP-MOTION-001   motion/scroll hijacking/forced intro weakens task completion
SLOP-CURSOR-001   custom cursor harms accessibility or discoverability
SLOP-STOCK-001    stock/duplicate imagery used only to fill layout space
SLOP-COPY-001     decorative/generic phrases could describe any business
SLOP-PLACEHOLDER-001 placeholder states presented as real product/business facts
SLOP-SCREENSHOT-001 static mock interface presented as working product
SLOP-COMING-001   coming-soon state with no useful next action
SLOP-EASY-AI-001  design choice exists primarily because it is easy for AI to generate
```

## 7. Design-system enforcement rules

Minimum set:

```text
SYSTEM-COLOR-001      no unregistered production color values
SYSTEM-TYPE-001       typography uses registered roles/tokens
SYSTEM-SPACING-001    spacing follows approved scale
SYSTEM-RADIUS-001     radii use registered tokens
SYSTEM-SHADOW-001     shadows/elevation use approved tokens
SYSTEM-ICON-001       one approved icon family per surface/system
SYSTEM-COMPONENT-001  reuse canonical component before creating duplicate
SYSTEM-BREAKPOINT-001 breakpoints come from approved responsive system
SYSTEM-MOTION-001     motion tokens and reduced-motion fallback required
SYSTEM-STATE-001      interactive components define required states
```

Exceptions must be tagged and visible in audit output.

## 8. Evidence model

Every non-trivial result references inspectable evidence:

```json
{
  "evidence_id": "ev-...",
  "type": "screenshot | dom | metric | source | code | asset | human-test",
  "location": "...",
  "selector_or_region": "...",
  "hash": "...",
  "captured_at": "..."
}
```

A BLOCK without evidence is invalid unless the input itself failed to produce required evidence, in which case the rule result explicitly says `BLOCKED_BY_MISSING_EVIDENCE`.

## 9. Severity and release behavior

```text
P0  critical safety/rights/data/release integrity issue; immediate stop
P1  major user/design/release blocker; cannot release unresolved
P2  significant quality defect; must fix or receive explicit scoped waiver
P3  nitpick/improvement; may ship when documented and score permits
```

Existing score caps remain compatible:
- any P0 caps/fails release;
- generic AI slop caps quality;
- unclear primary CTA caps quality;
- broken mobile/accessibility/routes/forms block or cap release according to current policy;
- missing evidence reduces confidence and can block a claim of passing QA.

The canonical rule engine calculates caps from versioned rules, not hard-coded UI prose.

## 10. Waiver contract

```json
{
  "rule_id": "...",
  "scope": ["artifact/page/component IDs"],
  "reason": "project-specific reason",
  "approved_by": "human identity",
  "role": "authorized role",
  "approved_at": "ISO timestamp",
  "expires_at": null,
  "evidence": [],
  "replacement_control": ""
}
```

Rules:
- agent cannot approve its own waiver;
- P0 is non-waivable unless the governing policy explicitly allows a human legal/security override;
- waiver scope is narrow;
- material changes re-run the rule and may invalidate waiver relevance.

## 11. Pipeline placement

```text
source/research
→ evidence graph
→ draft/design/implementation
→ deterministic rules continuously
→ specialist self-check
→ independent Guardians
→ human approval when required
→ release
```

Rule checks should run early, not only at final review.

Examples:
- design-system lint while building;
- Krug checks after first usable prototype;
- accessibility checks in CI;
- claim/source checks during content generation;
- logo validator immediately after asset creation.

## 12. Human-facing scorecard

The UI must show:

- category score;
- failed rules;
- evidence thumbnails/links;
- why it matters;
- exact remediation;
- affected pages/components/artifacts;
- agent/owner responsible;
- status and history;
- waiver state.

Never show one unexplained “AI quality score.”

## 13. First implementation boundary

`BKB-RULES-001` implements the generic rule engine and a small high-confidence subset first:

1. canonical rule/result schemas;
2. Krug page-purpose/CTA/clickability/navigation evidence contracts;
3. deterministic anti-fabrication checks where data supports them;
4. design-token/icon enforcement hooks;
5. severity/caps/waiver mechanics;
6. tests.

Do not attempt computer-vision aesthetic scoring before the evidence and rule contracts are stable.
