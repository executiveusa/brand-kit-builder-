# Change: studio-ui-components

## Metadata

- **change-id:** studio-ui-components
- **phase:** 17
- **ticket:** BKB-STUDIO-002
- **risk-tier:** LOW
- **status:** accepted
- **accepted-at:** 2026-07-24

## Context

The studio needs accessible, bilingual UI component definitions with data-help descriptions, ARIA attributes, and navigation structure. Every component must have EN/ES labels and accessible interaction patterns.

## Proposal

Create `src/design-system/studio-ui-components.mjs` — a UI component library with:

- 10 components: button, input, select, card, modal, toast, tabs, breadcrumb, tooltip, progress
- Each component: variants, sizes, states, required props, accessible pattern, bilingual flag
- 5 bilingual label categories: button, nav, status, form, tour
- 15 data-help descriptions with EN/ES translations
- Navigation structure: 6 main items, 2 footer items
- Validation: validateComponent, validateComponentProps, validateBilingualLabel, validateDataHelp, validateNavItem

## Scope

- `src/design-system/studio-ui-components.mjs` — NEW: 300 lines
- `tests/studio-ui-components.test.mjs` — NEW: 32 tests

## Acceptance criteria

- [x] 10 components with all required fields
- [x] Every component has bilingual=true
- [x] Button, modal require dataHelp prop
- [x] 5 bilingual label categories with EN/ES
- [x] 15 data-help descriptions with EN/ES
- [x] Navigation structure with main and footer
- [x] Every nav item has icon and data_help
- [x] `npm run check` passes
- [x] `npm test` passes (593 tests, 591 pass, 2 skipped, 0 fail)
