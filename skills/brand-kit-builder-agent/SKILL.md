---
name: brand-kit-builder-agent
description: Operate the in-house Pauli Brand Kit Builder through its guarded JSON CLI or local MCP server. Use when an agent must create, inspect, validate, advance, review, or export a brand project from an idea, URL, repository, logo, image, or documents.
version: 0.2.0
---

# Brand Kit Builder Agent Skill

## Read first

Before operating a project, read:

1. `AGENTS.md`
2. `docs/PAULI_BRAND_STUDIO_MASTER_SYSTEM_PROMPT_INDEX.md`
3. `docs/AGENT_API.md`
4. `docs/SECURITY.md`
5. the relevant prompt modules in `docs/prompt/`

## Prime directive

Operate through `brand-kit-builder` or `brand-kit-builder-mcp`. Do not edit `.brand-kit-builder/` or `projects/<project-id>/project.json` directly.

The engine creates deterministic work orders. The agent performs the actual research, interview, design, writing, image direction, review, or rendering required by that work order, then submits artifact evidence to complete the same bound job.

## Required loop

```text
inspect capabilities
→ create or load project
→ validate current state
→ request next stage work order with a unique idempotency key
→ read governing prompt and exact required outputs
→ produce only those artifacts inside the project workspace
→ self-test artifacts
→ complete the same work order with the same idempotency key
→ validate project again
```

## Stage order

```text
intake
→ sources
→ readiness
→ strategy
→ voice
→ visual
→ brandbook
→ guardian
→ export
```

Never skip a stage. Only one active work order is allowed per project stage.

## CLI pattern

For JSON files outside the workspace, stream input through stdin:

```bash
node bin/brand-kit-builder.mjs inspect

cat <project-input.json> | \
  node bin/brand-kit-builder.mjs create-project \
  --workspace <workspace> \
  --input -

cat <stage-request.json> | \
  node bin/brand-kit-builder.mjs run-stage \
  --workspace <workspace> \
  --input -

cat <completion-manifest.json> | \
  node bin/brand-kit-builder.mjs complete-stage \
  --workspace <workspace> \
  --input -
```

## MCP tools

- `brand_kit_inspect`
- `brand_kit_score_prebuild`
- `brand_kit_create_project`
- `brand_kit_get_project`
- `brand_kit_validate_project`
- `brand_kit_run_stage`
- `brand_kit_complete_stage`

Use one MCP server process per workspace. MCP mutations are serialized.

## Work-order behavior

Every `run-stage` result includes:

- project and stage identity;
- unique idempotency key and job ID;
- exact required artifacts;
- governing prompt index;
- workspace and project boundaries;
- release floor;
- source, proof, secret, and cost constraints.

Use that result as the execution contract. Do not create unrelated outputs.

Completion must include the same project, stage, and idempotency key. The artifact manifest must contain exactly the required paths. Successful completion records SHA-256 and byte size for every regular file. Directories, symlinks, missing paths, extra paths, and hash mismatches fail.

## Source-stage behavior

When completing `sources`:

- include the updated source array;
- mark every primary and governing source `accessed: true` only after it was actually read;
- resolve conflicts before setting `conflicts: []`;
- never fabricate hashes, licenses, access status, or applicable rules.

Readiness and later stages remain blocked until the source gate passes.

## Hard stops

Do not retry until the cause is resolved:

- `SECRET_GUARD`
- `PATH_GUARD`
- `SYMLINK_GUARD`
- `SOURCE_GATE_FAILED`
- `IDEMPOTENCY_CONFLICT`
- `WORK_ORDER_REQUIRED`
- `WORK_ORDER_STATE_MISMATCH`
- `ARTIFACT_HASH_MISMATCH`
- `COST_GUARD`
- `APPROVAL_REQUIRED`
- `PREBUILD_GATE_FAILED`
- `GUARDIAN_GATE_FAILED`
- `STAGE_ORDER_GUARD`

Three identical failures trigger escalation.

## Quality rules

- No generation before source inspection and readiness scoring.
- No fabricated claims, stories, proof, testimonials, metrics, or partnerships.
- KAKU controls brand-book sequence, not visual style.
- Steve Krug clarity is mandatory for interfaces and digital applications.
- No emojis as UI icons.
- Supplied assets remain locked unless a scoped change is approved.
- HTML is the primary review surface.
- Guardian review is independent from the creating agent.
- Export checks guardian and owner-approval state both before and after execution.

## Completion response

After every stage, report:

```json
{
  "project_id": "...",
  "stage": "...",
  "status": "completed",
  "artifacts": [
    {
      "path": "...",
      "size_bytes": 0,
      "sha256": "..."
    }
  ],
  "tests": [],
  "score": 0,
  "guardian_findings": [],
  "next_stage": "...",
  "blockers": []
}
```
