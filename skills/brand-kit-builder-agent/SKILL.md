---
name: brand-kit-builder-agent
description: Operate the in-house Pauli Brand Kit Builder through its guarded JSON CLI or local MCP server. Use when an agent must create, inspect, validate, advance, review, or export a brand project from an idea, URL, repository, logo, image, or documents.
version: 0.2.0
---

# Brand Kit Builder Agent Skill

## Read first

1. `AGENTS.md`
2. `docs/PAULI_BRAND_STUDIO_MASTER_SYSTEM_PROMPT_INDEX.md`
3. `docs/AGENT_API.md`
4. `docs/SECURITY.md`
5. the relevant modules under `docs/prompt/`

## Prime directive

Operate through `brand-kit-builder` or `brand-kit-builder-mcp`. Do not edit `.brand-kit-builder/`, project state, job state, usage ledgers, or approval records directly.

The engine creates deterministic work orders. The agent performs the research, interview, strategy, writing, image direction, design, review, or rendering required by that order, then submits evidence to complete the same bound job.

## Required loop

```text
inspect capabilities
→ create or load project
→ validate current state
→ request next stage with a unique idempotency key
→ read the governing prompt and exact outputs
→ produce only those artifacts inside the project workspace
→ self-test
→ complete the same work order with the same key
→ validate again
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

Never skip a stage. Only one active work order is allowed per stage.

## Agent interfaces

```bash
node bin/brand-kit-builder.mjs inspect

cat <project-input.json> | \
  node bin/brand-kit-builder.mjs create-project --workspace <workspace> --input -

cat <stage-request.json> | \
  node bin/brand-kit-builder.mjs run-stage --workspace <workspace> --input -

cat <completion-manifest.json> | \
  node bin/brand-kit-builder.mjs complete-stage --workspace <workspace> --input -
```

MCP tools:

- `brand_kit_inspect`
- `brand_kit_score_prebuild`
- `brand_kit_create_project`
- `brand_kit_get_project`
- `brand_kit_validate_project`
- `brand_kit_run_stage`
- `brand_kit_complete_stage`

There is no MCP approval tool.

## Work-order contract

Every work order includes the project, stage, job ID, idempotency key, exact required outputs, governing prompt index, workspace boundary, quality floor, and cost reservation.

Completion must use the same project, stage, and key. The manifest must contain exactly the required regular files. Successful completion records SHA-256 and byte size. Missing, extra, duplicate, directory, symlink, or mismatched-hash artifacts fail.

## Source contract

When completing `sources`:

- include the updated source array;
- mark a primary or governing source accessed only after reading it;
- resolve conflicts before clearing them;
- never fabricate hashes, licenses, access status, or rules.

Readiness and generation remain blocked until the source gate passes.

## Approval boundary

Agents must never:

- add `approvals` to project intake;
- edit stored approval records;
- invoke or simulate the interactive `approve` command;
- claim Bambu approved an action without a recorded local approval.

After all guardian gates pass, notify the project owner that the local interactive approval command is required. The owner operates that command directly. Export remains blocked until the engine records it.

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
- `APPROVAL_INJECTION_GUARD`
- `INTERACTIVE_APPROVAL_REQUIRED`
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
- Steve Krug clarity is mandatory for digital surfaces.
- No emojis as UI icons.
- Supplied assets remain locked unless a scoped change is approved.
- HTML is the primary review surface.
- Guardian review is independent from the creating agent.

## Completion report

```json
{
  "project_id": "...",
  "stage": "...",
  "status": "completed",
  "artifacts": [
    { "path": "...", "size_bytes": 0, "sha256": "..." }
  ],
  "tests": [],
  "score": 0,
  "guardian_findings": [],
  "next_stage": "...",
  "blockers": []
}
```
