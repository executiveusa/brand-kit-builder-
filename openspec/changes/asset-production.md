# Change: asset-production

## Metadata

- **change-id:** asset-production
- **phase:** 14
- **ticket:** BKB-ASSET-001
- **risk-tier:** LOW
- **status:** accepted
- **accepted-at:** 2026-07-24

## Context

The studio needs an asset production pipeline with asset types, export formats, validation rules, and production stages. Assets must meet type-specific requirements for dimensions, colors, and formats.

## Proposal

Create `src/design-system/asset-production.mjs` — an asset production module with:

- 8 asset types: logo, pattern, texture, illustration, icon, badge, social_card, email_header
- Each type: formats, densities, max_colors, min/max dimensions, transparency/tileable flags
- 6 export formats: SVG, PNG, JPG, PDF, ICO, WebP
- 7 production stages: design → review → refine → validate → export → qc → deliver
- Validation: validateAssetType, validateAssetFormat, validateAssetDimensions, validateAssetColors, validateExportFormat, validateProductionStage
- createAssetSpec: factory for asset specifications

## Scope

- `src/design-system/asset-production.mjs` — NEW: 280 lines
- `tests/asset-production.test.mjs` — NEW: 36 tests

## Acceptance criteria

- [x] 8 asset types with all required fields
- [x] 6 export formats with extension, mime, color_mode
- [x] 7 production stages in order
- [x] Validation rejects invalid types, formats, dimensions, colors
- [x] Asset spec creator works with defaults and overrides
- [x] `npm run check` passes
- [x] `npm test` passes (506 tests, 504 pass, 2 skipped, 0 fail)
