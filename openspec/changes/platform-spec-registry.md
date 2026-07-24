# Change: platform-spec-registry

## Metadata

- **change-id:** platform-spec-registry
- **phase:** 09
- **ticket:** BKB-PLATFORM-001
- **risk-tier:** LOW
- **status:** accepted
- **accepted-at:** 2026-07-24

## Context

Platform specifications (dimensions, aspect ratios, safe zones, text limits, accessibility constraints) must be versioned data files, not hardcoded throughout UI code.

## Proposal

Create `src/platforms/platform-registry.mjs` — a versioned registry for 12 platforms with format specifications, accessibility constraints, and bilingual tone guidance.

### 12 Platforms
instagram, linkedin, youtube, tiktok, facebook, x, email, web, print, presentation, proposal, advertising

### Each platform defines
- id, name, version, retrieved_at, source
- formats array (each with id, name, aspect_ratio, dimensions, safe_zone, file_types, max sizes)
- accessibility_constraints (min contrast, alt text requirements, captions)
- tone_guidance (bilingual EN/ES)

### Functions
- getPlatformSpec, getPlatformFormat, listPlatforms, listFormats
- validatePlatformAsset (checks dimensions, file types, file size, text length, video duration, contrast)

## Scope

- `src/platforms/platform-registry.mjs` — NEW: 400+ line versioned platform registry
- `tests/platform-registry.test.mjs` — NEW: 22 tests

## Acceptance criteria

- [x] 12 platforms defined with versioned specs
- [x] Every format has dimensions, safe_zone, file_types
- [x] Every platform has accessibility_constraints with min_contrast_ratio
- [x] Bilingual tone guidance (EN/ES) for all platforms
- [x] validatePlatformAsset checks dimensions, file type, file size, text, video, contrast
- [x] Print formats include bleed, DPI, color profile
- [x] `npm run check` passes
- [x] `npm test` passes (275 tests, 273 pass, 2 skipped, 0 fail)
