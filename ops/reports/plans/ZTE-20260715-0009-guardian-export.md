# ZTE-20260715-0009 — Guardian and export phase

## Objective

Complete the local Brand Studio workflow with independent Brand, Design, Voice, and Rights reviews, then generate a traceable brand-kit ZIP only after verified human export approval from the hardened agent core.

## Scope

- Four Guardian review domains and checklists
- Reviewer identity, role, and cooperative independence declaration
- P0, P1, and P2 findings with evidence, fixes, and resolution state
- Hard block for open P0 or P1 findings
- Guardian progression and release summary
- Read-only host inspection of agent-core export approval
- Rejection of browser-authored or mismatched approval records
- Dependency-free local stored-ZIP writer
- SHA-256 manifest for generated package files
- HTML brand book, print CSS, design tokens, project JSON, source/claims/rights evidence, Guardian report, asset manifest, handoff, and README
- Explicit PDF omission pending approved local renderer and visual verification
- English and Mexican Spanish release interface

## Acceptance criteria

- Exactly four Guardians are required
- Guardian reviewer must provide a name, role, summary, independence declaration, and all required checks
- Open P0 or P1 findings block that Guardian and export
- Export remains locked until all Guardians pass
- Browser code cannot create export approval
- Only a matching `source: agent-core` approval record can unlock package generation
- Package files have SHA-256 evidence
- ZIP opens with standard ZIP signatures and contains all declared files
- PDF is not falsely claimed as generated
- Browser code performs no direct network calls
- Repository validation and all tests pass

## Risk

MEDIUM. This phase introduces local package downloads and manual review state but does not add provider access, secrets, remote storage, PDF rendering, deployment, or autonomous approval.

## Rollback

Close the pull request or revert Phase 2E commits. Existing project, brand-book, strategy, voice, and visual data remain compatible. Browser export approval can be cleared without changing the agent-core approval record.
