# Change: public-brand-research

## Metadata

- **change-id:** public-brand-research
- **phase:** 06
- **ticket:** BKB-RESEARCH-002
- **risk-tier:** MEDIUM
- **status:** accepted
- **accepted-at:** 2026-07-24

## Context

The Brand Studio needs public brand research agents that gather reviews, social presence, competitor info, and reputation data. All research must be public-only — no login bypass, no private scraping, no invented evidence.

## Proposal

Create `src/research/public-research.mjs` — a Node.js-only research framework with 5 agent types, evidence tracking, conflict detection, confidence scoring, and public-only enforcement.

### 5 Research Agent Types
1. **Public Research** — general public web information
2. **Reputation** — public reviews and reputation themes
3. **Social Presence** — public social media profiles
4. **Competitor/Category** — competitors and category conventions
5. **Evidence Analyst** — conflict detection, confidence scoring, verification

### Features
- Every agent has prohibited_actions (login-bypass, private-scraping, inventing-evidence)
- Evidence records use canonical EvidenceRecord from contracts.js
- Conflict detection (same claim, different verification states)
- Confidence scoring (verified=1.0, inferred=0.5, unverified=0.2, conflicting=0.0)
- Public-only enforcement (blocks login/auth/private URLs)
- Policy validation (blocks prohibited actions per agent type)
- Reputation summary (positive/negative themes, recurring topics)
- Social presence summary (platforms, consistency, abandoned profiles)
- Competitor analysis (verified competitors, category conventions)
- Evidence analysis (conflicts, confidence, public claims eligibility)

## Scope

- `src/research/public-research.mjs` — NEW: 250+ line research framework
- `tests/public-research.test.mjs` — NEW: 25 tests

## Acceptance criteria

- [x] 5 research agent types defined with prohibited actions
- [x] All agents prohibit login-bypass and inventing-evidence
- [x] Evidence records use canonical EvidenceRecord
- [x] Conflict detection for same-claim/different-state evidence
- [x] Confidence scoring with weighted verification states
- [x] Public-only enforcement (blocks login/auth/private URLs)
- [x] Policy validation (blocks prohibited actions)
- [x] Reputation, social, competitor, evidence summaries
- [x] `npm run check` passes
- [x] `npm test` passes (208 tests, 206 pass, 2 skipped, 0 fail)
