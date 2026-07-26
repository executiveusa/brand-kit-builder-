# Change: bilingual-support

## Metadata

- **change-id:** bilingual-support
- **phase:** 19
- **ticket:** BKB-TRANSLATE-001
- **risk-tier:** LOW
- **status:** accepted
- **accepted-at:** 2026-07-24

## Context

The studio needs a bilingual (EN/ES) translation system to support all UI strings across both languages, with language switching, validation, and persistence.

## Proposal

Create `src/i18n/bilingual-support.mjs` — a bilingual language system with:

- 60+ translation keys across 7 categories: navigation, tour, actions, status, validation, guardian, export
- `t(key, lang)` function for translation retrieval
- `setLanguage(lang)` / `getLanguage()` for runtime switching
- `onLanguageChange(listener)` subscription system
- `validateTranslations()` completeness checker
- `initLanguage()` for startup initialization
- Persistence via localStorage
- `SUPPORTED_LANGUAGES`, `DEFAULT_LANGUAGE`, `EN`, `ES` constants

## Scope

- `src/i18n/bilingual-support.mjs` — NEW: 280 lines
- `tests/bilingual-support.test.mjs` — NEW: 21 tests

## Acceptance criteria

- [x] 60+ translation keys with EN/ES
- [x] Language switching with listener notification
- [x] Translation validation (completeness check)
- [x] Persistence via localStorage
- [x] `npm run check` passes
- [x] `npm test` passes (646 tests, 644 pass, 2 skipped, 0 fail)
