# Change: logo-foundation

## Metadata

- **change-id:** logo-foundation
- **phase:** 12
- **ticket:** BKB-LOGO-001
- **risk-tier:** LOW
- **status:** accepted
- **accepted-at:** 2026-07-24

## Context

Logo assets need structured rules for types, variants, SVG validation, placement, file formats, and usage guidelines. Without these, logos will be inconsistent and potentially insecure.

## Proposal

Create `src/design-system/logo-foundation.mjs` — a logo foundation module with:

- 5 logo types (primary, secondary, mark, wordmark, lockup) with variants, min/max sizes, aspect ratios
- SVG validation rules: forbidden elements (script, iframe, filter), forbidden attributes (onload, onclick), required root attributes (viewBox, xmlns), max size 50KB, max 8 colors
- Placement rules: clear space (1x mark height, min 16px), minimum sizes (digital/print/favicon), approved backgrounds
- File format requirements: SVG (required), PNG (required, 1x/2x/3x), PDF, EPS, ICO
- Usage guidelines: 6 do's, 8 don'ts
- Validation functions: validateLogoType, validateLogoVariant, validateSvgContent, validateClearSpace, validateLogoSize, validateLogoBackground, validateFileFormat

## Scope

- `src/design-system/logo-foundation.mjs` — NEW: 350 lines
- `tests/logo-foundation.test.mjs` — NEW: 52 tests

## Acceptance criteria

- [x] 5 logo types with variants, sizes, aspect ratios
- [x] SVG validation rejects script, iframe, filter, onload, onclick
- [x] SVG validation requires viewBox and xmlns
- [x] Clear space validation enforces minimum 16px or 1x mark height
- [x] Logo size validation per context (digital, print, favicon)
- [x] Background validation blocks busy photography and rainbow gradients
- [x] 5 file formats (SVG, PNG, PDF, EPS, ICO)
- [x] Usage guidelines (6 do's, 8 don'ts)
- [x] `npm run check` passes
- [x] `npm test` passes (436 tests, 434 pass, 2 skipped, 0 fail)
