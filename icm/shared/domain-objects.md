# Shared Canonical Domain Objects

Version: 1.0.0-draft

These are transport- and storage-neutral objects. Runtime schemas are implemented in `BKB-CONTRACT-001`; this file freezes names/responsibilities for Phase 0.

## BrandProject

Required identity: `project_id`, `schema_version`, `name`, `classification`, `owner`, `languages`, `market`, lifecycle state, timestamps.

References: evidence, decisions, work orders, artifacts, Guardians, approvals, releases.

Rule: no adapter-specific IDs are required to load a project.

## EvidenceRecord

Required: `evidence_id`, source URL/path/type, retrieved/accessed timestamp, trust level, verification state, confidence, rights/access state, content hash when available, supported/contradicted claim IDs.

Rule: observed content, inference, and verified fact are distinct states.

## ResearchRun

Required: `research_run_id`, project, objective, assigned capability/agent, adapters, bounded targets/queries, start/end, budget, evidence produced, errors, status.

## DesignDecision

Required: `decision_id`, project, question, alternatives, recommendation, selected option, rationale, evidence refs, decision authority, timestamp, reversibility, affected artifacts/work orders.

## WorkOrder

Required: `work_order_id`, project, stage/capability, exact objective, assigned role/agent, dependencies, inputs, allowed tools/repos/files, expected outputs, acceptance criteria, evidence required, prohibited actions, budget, idempotency key, rollback, status.

## Artifact

Required: `artifact_id`, project, type, version, location, media type, size, SHA-256, provenance, source/evidence/decision refs, validation state, approval state, timestamps.

## ArtifactVariant

Required: `variant_id`, parent artifact, purpose, dimensions/format, application/background constraints, provenance, validation state.

## RuleResult

Required: `rule_result_id`, rule pack/version, rule ID, project/artifact/page/component scope, status, severity, evidence refs, confidence, message, remediation, waiver.

## GuardianReview

Required: `guardian_review_id`, project, Guardian type, reviewer identity/role, independence confirmation, scope, findings, rule results, evidence, status, timestamp.

## Approval

Required: `approval_id`, project, action, scope, human authority, timestamp, evidence hash/version, channel/method, status, revocation/expiry fields.

Rule: an agent-created status is not approval.

## Release

Required: `release_id`, project/version, artifact manifest, scorecard, Guardian summary, approvals, provenance summary, repository/PR/deployment refs when applicable, rollback metadata, created timestamp.

## RepoWorkspace

Required: `repo_workspace_id`, project/work order, repository identity, base SHA, worktree/sandbox, branch, repository/file allowlists, runtime/preview refs, status, cleanup/rollback data.

## AgentAssignment

Required: `assignment_id`, agent identity/role/manager, project/work-order scope, capability allowlist, permitted repos, budget, heartbeat/status, escalation target.

## ID and version rules

- IDs are stable and opaque to user-facing display names.
- Every schema has explicit version.
- Domain versions are independent from application package version.
- External/control-plane IDs are stored as mappings, never canonical identity.
- Material changes create events and update version lineage rather than silently rewriting historical evidence/approval meaning.
