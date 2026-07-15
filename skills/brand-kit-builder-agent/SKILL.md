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

The engine creates deterministic work orders. The agent performs the actual research, interview, design, writing, image direction, review, or rendering required by that work order, then submits artifact evidence to complete the stage.

## Required loop

```text
inspect capabilities
→ create or load project
→ validate current state
→ request next stage work order with idempotency key
→ read governing prompt and required outputs
→ produce artifacts inside project workspace
→ self-test artifacts
→ call complete-stage with manifest
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

Never skip a stage.

## CLI pattern

```bash
node bin/brand-kit-builder.mjs inspect

node bin/brand-kit-builder.mjs create-project \
  --workspace <workspace> \
  --input <project-input.json>

node bin/brand-kit-builder.mjs run-stage \
  --workspace <workspace> \
  --input <stage-request.json>

node bin/brand-kit-builder.mjs complete-stage \
  --workspace <workspace> \
  --input <completion-manifest.json>
```

## MCP tools

- `brand_kit_inspect`
- `brand_kit_score_prebuild`
- `brand_kit_create_project`
- `brand_kit_get_project`
- `brand_kit_validate_project`
- `brand_kit_run_stage`
- `brand_kit_complete_stage`

## Work-order behavior

Every `run-stage` result includes:

- stage name;
- required artifacts;
- governing prompt index;
- workspace and project boundaries;
- release floor;
- source, proof, secret, and cost constraints.

Use that result as the execution contract. Do not create unrelated outputs.

## Hard stops

Do not retry until the cause is resolved:

- `SECRET_GUARD`
- `PATH_GUARD`
- `SYMLINK_GUARD`
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
- Export requires explicit Bambu approval.

## Completion response

After every stage, report:

```json
{
  "project_id": "...",
  "stage": "...",
  "status": "completed",
  "artifacts": [],
  "tests": [],
  "score": 0,
  "guardian_findings": [],
  "next_stage": "...",
  "blockers": []
}
```
