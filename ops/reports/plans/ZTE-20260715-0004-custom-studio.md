# ZTE-20260715-0004 — Custom bilingual Brand Studio shell

## Objective

Extract reusable interaction patterns from the supplied Open CoDesign archive and implement an original Pauli Brand Studio interface connected conceptually to the existing hardened agent core.

## Scope

- custom three-panel studio shell;
- Brand Canvas with responsive previews;
- files, comments, history, claims, rights, and deliverables dock;
- controlled design and voice tweaks;
- English and Mexican Spanish localization;
- no Chinese language content;
- automatic first-run guided tour with optional restart;
- local host bridge for desktop/MCP integration;
- Steve Krug usability and accessibility improvements;
- MIT attribution and upstream extraction record;
- static validation and tests.

## Risk

MEDIUM. The change introduces a substantial new user interface and a local browser-to-host bridge contract. It does not enable model access, production deployment, secrets, or unrestricted filesystem operations.

## Validation criteria

- all studio files pass syntax/static validation;
- English and `es-MX` dictionary keys match exactly;
- no Han characters exist in custom studio source;
- no remote assets or direct browser network calls;
- every visible button has help metadata and an accessible name;
- every tour target exists;
- tour auto-starts once and can be restarted;
- existing agent-core tests remain green;
- GitHub Actions passes.

## Rollback

Close the pull request without merging or revert the studio-shell commits. No database, production, secret, deployment, or external service state is changed.
