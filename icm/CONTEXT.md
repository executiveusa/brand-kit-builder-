# Pauli Brand Studio — ICM Router

Version: 1.0.0

## Purpose

This file routes an agent to the smallest context needed for one bounded assignment.

## Always read first

1. `/AGENTS.md`
2. `/docs/PAULI_BRAND_STUDIO_MASTER_SYSTEM_PROMPT_INDEX.md`
3. the WorkOrder assigned by the canonical Brand Engine/control plane
4. exactly one stage `CONTEXT.md` listed below
5. only the `_config` and `shared` references required by that stage

Do not load every client artifact or every stage into context by default.

## Stage router

| Stage | Contract | Primary role |
|---|---|---|
| 01 Intake | `stages/01_intake/CONTEXT.md` | Hermes / Intake Agent |
| 02 Site census | `stages/02_site-census/CONTEXT.md` | Site Census Agent |
| 03 Public research | `stages/03_public-research/CONTEXT.md` | Public Research Agent |
| 04 Reputation | `stages/04_reputation/CONTEXT.md` | Reputation Agent |
| 05 Social presence | `stages/05_social-presence/CONTEXT.md` | Social Presence Agent |
| 06 Competitors | `stages/06_competitors/CONTEXT.md` | Competitor/Category Agent |
| 07 Brand DNA | `stages/07_brand-dna/CONTEXT.md` | Evidence Analyst / Brand DNA Agent |
| 08 Krug audit | `stages/08_krug-audit/CONTEXT.md` | Krug Usability Auditor |
| 09 Strategy | `stages/09_strategy/CONTEXT.md` | Brand/Voice Strategists |
| 10 Design system | `stages/10_design-system/CONTEXT.md` | Design Systems Architect |
| 11 Content plan | `stages/11_content-plan/CONTEXT.md` | Content Strategist |
| 12 Rebuild options | `stages/12_rebuild-options/CONTEXT.md` | Hermes + specialist leads |
| 13 PRD and tickets | `stages/13_prd-and-tickets/CONTEXT.md` | Site Architect |
| 14 Implementation | `stages/14_implementation/CONTEXT.md` | Implementation Agent |
| 15 Guardians | `stages/15_guardians/CONTEXT.md` | independent Guardians |
| 16 Release | `stages/16_release/CONTEXT.md` | Release coordinator + human authority |

## Stable policies

- `/_config/source-precedence.yaml`
- `/_config/research-policy.yaml`
- `/_config/approval-policy.yaml`
- `/_config/krug-rules.yaml`
- `/_config/anti-slop-rules.yaml`

## Shared contracts

- `/shared/domain-objects.md`
- `/shared/work-order-contract.md`
- `/shared/evidence-contract.md`
- `/shared/artifact-contract.md`
- `/shared/agent-handoff-contract.md`

## Routing rules

- One work order = one exact objective.
- One implementation work order = one repository worktree/sandbox.
- Parallel research is allowed only when workers do not mutate the same canonical object directly.
- Every stage result is evidence-backed and machine-readable.
- Human approval cannot be inferred from a chat message, agent status, or control-plane checkbox unless the canonical approval adapter records it.
- Missing evidence is recorded as missing, never invented.
- A stage may be `NOT_APPLICABLE` only with explicit reason in canonical state.
- Same error three consecutive times triggers escalation.

## Working artifacts

Canonical project files live under:

`projects/<project-id>/`

The ICM tree contains factory/routing contracts. Do not put client secrets or generated project data into `icm/_config` or `icm/shared`.
