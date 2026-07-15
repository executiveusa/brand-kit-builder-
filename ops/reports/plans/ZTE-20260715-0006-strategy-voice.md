# ZTE-20260715-0006 — Strategy and voice phase

## Objective

Advance a readiness-approved brand project through structured strategy and brand-voice workspaces without allowing unsupported claims, superficial creative territories, or generic language systems.

## Scope

- Versioned migration for existing browser projects
- Strategy domain: positioning, promise, reasons to believe, values, message hierarchy, proof ledger, and three creative territories
- Voice domain: identity, audience language, prohibited language, real phrases, true stories, channel rules, localization, examples, and four voice axes
- English and Mexican Spanish interfaces
- Derived stage completion and workflow progression
- Guarded `save-strategy` and `save-voice` host-bridge events
- Tests for completeness, migration, and stage unlocking

## Acceptance criteria

- Existing Phase 2A projects load without losing intake, source, discovery, or readiness data
- Strategy requires all core fields, one sourced claim, and three complete territories
- Voice remains locked until strategy is complete
- Voice requires evidence, boundaries, channel rules, localization, and examples
- Visual work remains locked until voice is complete
- No browser network calls or provider credentials are introduced
- English and Mexican Spanish remain available
- Repository validation and complete test suite pass

## Risk

MEDIUM. This expands editable project state and progression logic but does not add providers, external persistence, deployment, or approval bypasses.

## Rollback

Close the pull request or revert the Phase 2B commits. The project loader preserves existing Phase 2A fields, so rollback does not require external data restoration.
