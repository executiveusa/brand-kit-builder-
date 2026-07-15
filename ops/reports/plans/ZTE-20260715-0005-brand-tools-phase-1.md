# ZTE-20260715-0005 — Brand tools phase 2A

## Objective

Turn the bilingual Brand Studio shell into a usable local project workflow for project creation, discovery, source governance, and the 20-axis readiness gate.

## Scope

- Versioned local project store with a memory adapter for tests
- English and Mexican Spanish workflow copy
- Project library and project creation
- Intake form and one-question-at-a-time discovery interview
- Source ledger with trust, inspection, rights, and conflict controls
- Readiness scoring across exactly 20 axes
- Workflow lock and unlock states derived from evidence
- Guarded agent-bridge events for future desktop synchronization
- Responsive, keyboard-accessible workbench dialogs
- Static validation and Node tests

## Acceptance criteria

- Projects persist and can be switched without page reload
- English and `es-MX` remain available
- Intake cannot complete without goal, audience, primary action, and approval authority
- Source stage requires accessed primary or governing evidence and no unresolved conflict
- Readiness uses exactly 20 axes
- Strategy remains locked below 8.5 or with a critical axis below 8.0
- Browser code makes no direct network requests
- Existing agent-core, security, and approval tests continue to pass
- `npm run check` and `npm test` pass in GitHub Actions

## Risk

MEDIUM. New browser persistence and workflow state are introduced, but no provider, database, deployment, secret, or production integration is enabled.

## Rollback

Close the pull request or revert the phase 2A commits. Browser state can be reset by removing the `pauli-brand-studio-projects-v2` local-storage key. No external or production state is changed.
