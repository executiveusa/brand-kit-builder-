---
name: refero-design
description: Research-first design methodology for UI, product, web, landing pages, dashboards, redesigns, visual polish, frontend styling, design systems, responsive design, typography, color, spacing, motion, icons, accessibility, copywriting, conversion, and anti-AI-slop work. Ground major decisions in references before implementation, lock one dominant direction, and validate rendered output against the lock.
---

# Refero Design — extracted research-first workflow

## Purpose
Give the design factory reference-grounded taste and product evidence instead of generic model taste.

## Non-negotiables
- Research before substantial visual design work.
- Study several strong references; never copy one reference.
- Do not average conflicting references into a safe middle. Choose one dominant direction and preserve its sharp traits.
- Major layout, visual, content, and interaction decisions must trace to the brief, a reference, existing product truth, or an explicit craft rule.
- Synthesize before implementation: concept → token direction → decision ledger → build.
- A brief alone is not a build target. Lock a user-provided source, existing system, selected visual direction, or explicit reference-locked direction first.
- Preserve imagery roles. Do not replace image-dependent references with weak decorative CSS.
- Validate rendered work against the lock after implementation.
- Do not hand off unresolved P0/P1/P2 design drift unless blocked and documented.

## Research layers
1. **Styles** — visual direction, typography, palette, spacing, surfaces, rhythm, imagery treatment.
2. **Screens** — concrete UI patterns, hierarchy, forms, tables, pricing, empty states, settings, dashboards, dialogs.
3. **Flows** — multi-step journey logic such as onboarding, checkout, billing, cancellation, account changes, and recovery.

When live Refero MCP exists, use it. Otherwise use user-provided references, project references, screenshots, existing design systems, and explicit craft rules while preserving the same reference-lock discipline.

## Discovery brief
```text
Designing [WHAT] for [WHO] on [PLATFORM].
Goal: [PRIMARY USER GOAL].
Tone: [DESIRED FEELING].
Main objection/risk: [OBJECTION].
Must remember: [DISTINCTIVE IDEA].
Constraints: [CONSTRAINTS].
Research needed: [styles/screens/flows].
Path: [direct build / visual exploration / audit / asset generation].
```

Ask only for information that materially changes the outcome and cannot be recovered from project truth.

## Workflow routing
- **Direct build:** small UI fixes, clear production edits, existing design-system work, or concrete targets.
- **Visual exploration:** new visual language, major redesign, landing page, or high-visibility surface. Default to three meaningfully different reference-locked options before expensive implementation.
- **Audit:** capture actual current state and compare screenshots, behavior, hierarchy, responsive behavior, accessibility, and product intent against references and project rules.
- **Asset generation:** only when the lock requires bitmap media code/icons/existing assets cannot faithfully provide.

## Research loop
1. Form the brief.
2. Research 3–5 different angles.
3. Study 3–4 strong references.
4. Record what each contributes.
5. Choose one primary foundation.
6. Borrow only 1–2 narrow secondary details.
7. Write a reference lock.
8. Build a decision ledger.
9. Implement.
10. Render and compare.
11. Repair drift.
12. Run independent quality gates.

## Reference lock
```text
Primary reference/direction: [ONE DOMINANT FOUNDATION].
Preserve: [SIGNATURE TRAITS].
Borrow only: [NARROW SECONDARY DETAILS].
Role rules: [TOKEN / COMPONENT / MEDIA ROLES].
Media strategy: [REAL / GENERATED / PLACEHOLDER RULE].
Reject: [TRAITS THAT PULL TOWARD ANOTHER DIRECTION].
Token commitments: [TYPE / COLOR / RADIUS / SPACING / SURFACE / MOTION].
```

## Decision ledger
For every major choice record: area, decision, source, source role/rule, and why it serves the user/business outcome.

## Anti-AI-slop gate
Challenge generic centered heroes, gradient blobs, interchangeable SaaS bento grids, endless rounded cards, unjustified glassmorphism, fake screenshots, invented metrics/testimonials, arbitrary glow/shadows, excessive pills, filler icons, delaying animations, vague copy, unsupported superlatives, stock-tech imagery, and visual complexity that does not improve understanding.

## Craft disciplines extracted from the uploaded package
### Typography
Deliberate hierarchy, readable body/line length, disciplined weights, optical spacing, appropriate numerals and data treatment.

### Color
Semantic roles, preserved contrast, deliberate accent use. Never change token meanings just because another reference looks attractive.

### Motion
Communicate hierarchy, orientation, state, feedback, continuity, or brand behavior. Remove motion that communicates nothing. Support reduced motion.

### Icons
Use for recognition, action, state, or navigation. Maintain one coherent icon language. Avoid icon filler.

### Copywriting
Concrete human language, exact actions, evidence, natural rhythm, low uncertainty.

### Craft detail
Inspect spacing, alignment, hit areas, focus, hover/pressed/disabled states, overflow, truncation, responsive ordering, empty/loading/error states, and edge-case polish.

## Visual QA severity
- P0 — broken task, unreadable/overlapping UI, severe accessibility issue.
- P1 — major design drift or likely usability regression.
- P2 — moderate visual mismatch, missing state, responsive issue, asset drift.
- P3 — polish that can follow.

Do not claim completion with known unresolved P0/P1/P2 findings unless a blocker and missing evidence are explicitly recorded.

## Source provenance
Extracted and adapted from the uploaded `refero_skill-master` package. The package included dedicated reference files for anti-AI-slop, color, copywriting, craft details, example workflow, icons, MCP tooling, motion, typography, and visual workflow. Their operating rules are consolidated here so One Hands can lazy-load one bounded reference methodology instead of injecting the entire source pack into every turn.
