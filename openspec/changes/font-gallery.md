# Change: font-gallery

## Metadata

- **change-id:** font-gallery
- **phase:** 11
- **ticket:** BKB-FONT-001
- **risk-tier:** LOW
- **status:** accepted
- **accepted-at:** 2026-07-24

## Context

The studio needs a curated font catalog with pairing rules, font-face declarations, and gallery data. Fonts must be from open-source sources (Google Fonts, OFL) with validated pairing rules (sans+serif mix, weight ranges, readability).

## Proposal

Create `src/design-system/font-gallery.mjs` — a font gallery module with:

- 15 fonts: 6 heading, 7 body, 3 mono (Inter appears in both heading and body)
- Each font: category, weights, styles, subsets, axes, license, source, pairs_well_with, description
- 4 pairing rules: heading-body (different category preferred), weight-range (400/700), readability (no mono for body), no-mixing-roles
- Font-face declaration generator with unicode-range
- Gallery categories: heading, body, mono
- 6 sample pairings with labels
- Validation: validateFontName, validateFontWeight, validateFontStyle, validatePairing, validateFontFaceDeclaration

## Scope

- `src/design-system/font-gallery.mjs` — NEW: 310 lines
- `tests/font-gallery.test.mjs` — NEW: 43 tests

## Acceptance criteria

- [x] 15 fonts in catalog with all required fields
- [x] 6 heading fonts, 7 body fonts, 3 mono fonts
- [x] All body fonts include weight 400+
- [x] All heading fonts include weight 700 (except display-only)
- [x] 4 pairing rules validate heading-body, weight, readability
- [x] Font-face declarations generate with woff2/woff sources
- [x] Sample pairings validate against catalog
- [x] `npm run check` passes
- [x] `npm test` passes (384 tests, 382 pass, 2 skipped, 0 fail)
