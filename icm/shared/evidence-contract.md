# Evidence Contract

Version: 1.0.0-draft

Evidence is the basis for research conclusions, claims, audits, design decisions and release assertions.

## Required fields

```yaml
evidence_id: ""
project_id: ""
source_type: "url | repository | file | screenshot | review | social | news | interview | metric | code | asset"
source_location: ""
retrieved_or_recorded_at: ""
trust_level: "primary | governing | reference | inspiration"
verification_state: "verified | observed | inferred | conflicting | unverified | inaccessible"
confidence: 0.0
rights_or_access_state: "owned | licensed | public | permitted | unknown | restricted"
content_hash: null
summary: ""
observations: []
inferences: []
supports: []
contradicts: []
metadata: {}
```

## Laws

- Observations and inferences are stored separately.
- A summary is not evidence by itself.
- Public claims require a claim/evidence relationship and applicable approval state.
- Conflicting evidence remains visible until resolved; do not delete the losing side silently.
- Retrieval/access failure is recorded explicitly.
- Screenshots and captured documents record hashes when possible.
- Research adapters record source URLs/paths and retrieval timestamps.
- Private/authenticated data is excluded unless an explicit approved adapter and scope permits it.
- Evidence provenance must survive export/handoff.

## Confidence

Confidence expresses support quality, not truth certainty by itself. High confidence cannot override a governing source conflict.

## Human conflict gate

A human decision is required when unresolved evidence would materially change:
- ownership/rights;
- identity or destructive brand decisions;
- public claims with legal/reputation impact;
- irreversible implementation/release scope.
