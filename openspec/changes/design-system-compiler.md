# Change: design-system-compiler

## Metadata

- **change-id:** design-system-compiler
- **phase:** 10
- **ticket:** BKB-DESIGN-SYSTEM-001
- **risk-tier:** LOW
- **status:** accepted
- **accepted-at:** 2026-07-24

## Context

Design tokens must be versioned, validated, and compiled into a canonical design system. CI must reject arbitrary hex colors, spacing values, fonts, icons, components, breakpoints, radii, shadows, and gradients that break brand consistency.

## Proposal

Create `src/design-system/token-compiler.mjs` — a comprehensive design system compiler with:

- 14-color palette with hex values, OKLCH equivalents, and roles
- 12-step typography scale (display-lg through code)
- 18-step spacing scale (0 through 24rem)
- 7 radius values, 6 shadow levels, 3 gradients
- 6 elevation levels, 5 breakpoints, 5 containers, 3 grid tokens
- 5 durations and 4 easing functions for motion
- 7 component definitions with variants, sizes, and required tokens
- 6 layout patterns with token references
- 4 page recipes (landing, about, contact, pricing)
- 3 allowed icon families (phosphor, radix, tabler)
- Validation functions: validateHex, validateSpacing, validateRadius, validateShadow, validateGradient, validateTypography, validateBreakpoint, validateComponent, validateIconFamily, validateElevationToken, validatePattern
- compileBrandSpec: full-brand validation pipeline with error collection

## Scope

- `src/design-system/token-compiler.mjs` — NEW: 539 lines
- `tests/design-system.test.mjs` — NEW: 66 tests

## Acceptance criteria

- [x] 14 palette colors with hex and role
- [x] 12 typography tokens with scale, weight, line-height, tracking
- [x] 18 spacing tokens (rem-based, allowed scale: 0 to 24)
- [x] 7 radius tokens (0, 0.25, 0.5, 0.75, 1, 1.5, 9999rem)
- [x] 6 shadow tokens (none, xs, sm, md, lg, xl)
- [x] 3 gradient tokens (brand, surface, elevated)
- [x] 6 elevation tokens with z-index
- [x] 5 breakpoints, 5 containers, 3 grid tokens
- [x] 5 durations + 4 easing motion tokens
- [x] 7 components with variants, sizes, tokens, required props
- [x] 6 patterns with token references
- [x] 4 page recipes
- [x] All validation functions accept palette/allowed values, reject arbitrary
- [x] CI rejects: arbitrary hex, arbitrary spacing, unknown components, unknown patterns
- [x] `npm run check` passes
- [x] `npm test` passes (341 tests, 339 pass, 2 skipped, 0 fail)
