# Artifact Contract

Version: 1.0.0-draft

Artifacts are inspectable work products, not promises that a file exists.

## Required fields

```yaml
artifact_id: ""
project_id: ""
type: ""
version: ""
status: "draft | generated | validated | approved | blocked | omitted | superseded"
location: ""
media_type: ""
size_bytes: 0
sha256: ""
source_refs: []
evidence_refs: []
decision_refs: []
provenance:
  created_by: "human | agent-id | adapter-id"
  created_at: ""
  provider: null
  model_or_tool_version: null
  prompt_or_recipe_version: null
  parent_artifact_ids: []
validation:
  status: "pending | passed | warning | blocked"
  report_refs: []
approval:
  status: "not_required | pending | approved | rejected"
  approval_ids: []
variants: []
omission_reason: null
```

## Laws

- `status: generated|validated|approved` requires a real artifact location and integrity metadata.
- Missing/failed optional outputs are `omitted` with explicit reason; never fake completion.
- Canonical production files may not be symbolic links or remote URLs masquerading as delivered files.
- Generated/converted variants retain parent provenance.
- Protected supplied assets are immutable unless an explicit scoped DesignDecision/approval permits modification.
- Artifact versions are append-only lineage; superseding does not erase prior provenance.
- Export manifest references only verified artifacts or explicit omissions.
- Every public/client deliverable records applicable rights/provenance state.

## Logo-specific extension

Production logo artifacts additionally record:
- policy: preserve/refine/redesign/new;
- variant purpose;
- responsive/background constraints;
- vector validation report;
- minimum-size/mono/light/dark tests;
- trademark/legal-review flag where applicable.

## Rendered-document extension

PDF/print artifacts additionally record:
- source HTML/artifact hash;
- renderer/version;
- page count;
- page screenshot/QA manifest;
- clipping/overflow/font/image/page-break results.
