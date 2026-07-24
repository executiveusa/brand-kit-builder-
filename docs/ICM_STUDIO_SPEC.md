# ICM Studio Specification

Status: Phase 0 contract  
Purpose: make every design job understandable, portable, inspectable, and editable without relying on hidden agent memory.

## 1. Why ICM exists here

The repository is treated as a professional design studio office.

ICM supplies the **context architecture**:

- where an agent learns its job;
- what permanent rules it must load;
- which inputs it may use;
- where it writes outputs;
- how one specialist hands work to the next;
- where a human can inspect or edit the product between stages.

ICM does not schedule concurrent workers. Paperclip/Hermes or another orchestrator owns assignment, heartbeats, retries, budget, and concurrency.

## 2. Five-layer context model

### Layer 0 — Studio identity

Repository-level immutable/slow-changing operating context:

```text
AGENTS.md
README.md
docs/PAULI_BRAND_STUDIO_MASTER_SYSTEM_PROMPT_INDEX.md
```

Contains mission, non-negotiables, branch/approval law, and source precedence.

### Layer 1 — Workspace router

```text
icm/CONTEXT.md
```

Answers:
- what stage am I in;
- which stage contract must I read;
- which shared rules apply;
- what previous artifacts are authoritative;
- where outputs belong;
- what must not be loaded unnecessarily.

### Layer 2 — Stage contract

Each stage has:

```text
icm/stages/NN_stage-name/CONTEXT.md
```

Required headings:

```text
Objective
Entry criteria
Inputs
Required references
Allowed capabilities/tools
Process
Outputs
Acceptance criteria
Evidence required
Human decision gate
Prohibited actions
Failure/escalation behavior
Handoff target
Rollback
```

An agent executes one stage contract per bounded work order.

### Layer 3 — Factory configuration

Stable reusable rules and references:

```text
icm/_config/
icm/shared/
```

Examples:
- Krug rules;
- anti-slop rules;
- research/privacy policy;
- approval policy;
- source precedence;
- domain object registry;
- platform specs;
- industry benchmark packs;
- font registry metadata;
- design-system patterns;
- artifact templates.

Agents should change Layer 3 only through an explicit capability/rule-governance ticket. Project work normally changes Layer 4, not the factory.

### Layer 4 — Working artifacts

Project-specific editable product:

```text
projects/<project-id>/
```

or stage-specific generated working views referenced from that project.

These are human-visible edit surfaces, not hidden chain-of-thought or agent scratchpads.

## 3. Repository ICM structure

```text
icm/
├── CONTEXT.md
├── _config/
│   ├── source-precedence.yaml
│   ├── research-policy.yaml
│   ├── approval-policy.yaml
│   ├── krug-rules.yaml
│   └── anti-slop-rules.yaml
├── shared/
│   ├── domain-objects.md
│   ├── work-order-contract.md
│   ├── evidence-contract.md
│   ├── artifact-contract.md
│   └── agent-handoff-contract.md
└── stages/
    ├── 01_intake/
    ├── 02_site-census/
    ├── 03_public-research/
    ├── 04_reputation/
    ├── 05_social-presence/
    ├── 06_competitors/
    ├── 07_brand-dna/
    ├── 08_krug-audit/
    ├── 09_strategy/
    ├── 10_design-system/
    ├── 11_content-plan/
    ├── 12_rebuild-options/
    ├── 13_prd-and-tickets/
    ├── 14_implementation/
    ├── 15_guardians/
    └── 16_release/
```

This does not replace the current engine stage names immediately. It is the target context/workflow layer. `BKB-CONTRACT-001` defines compatibility mappings before runtime migration.

## 4. Project working structure

A project should converge toward:

```text
projects/<project-id>/
├── project.json
├── source-ledger.json
├── evidence/
│   ├── evidence-graph.json
│   ├── screenshots/
│   ├── captures/
│   └── research-runs/
├── discovery/
├── strategy/
├── voice/
├── visual/
│   ├── design-system/
│   ├── fonts/
│   ├── logos/
│   ├── imagery/
│   └── applications/
├── brandbook/
├── implementation/
│   ├── work-orders/
│   ├── repo-workspaces/
│   └── previews/
├── audit/
├── handoff/
└── exports/
```

Every folder contains derived artifacts or explicit project truth. Hidden process memory is not part of the deliverable contract.

## 5. Context-loading law

An agent must load the smallest sufficient context:

1. Layer 0 operating law.
2. `icm/CONTEXT.md`.
3. Its one stage `CONTEXT.md`.
4. Only the Layer 3 rule/reference files listed by that stage.
5. Only the Layer 4 inputs listed in the work order/stage contract.

Do not dump the entire repository or entire client corpus into every model call.

Benefits:
- fewer contradictions;
- lower token/cost use;
- reduced secret/client-data exposure;
- clearer specialist behavior;
- reproducible handoffs.

## 6. Stage output law

A stage is not complete because an agent says it is complete.

Completion requires:

```text
required files exist
+ schemas validate
+ artifact hashes recorded
+ required evidence exists
+ required rule checks pass
+ work-order acceptance criteria pass
+ no blocking finding remains
+ human decision exists when the contract requires one
```

Each stage should write a machine-readable `stage-result.json` through the engine/event layer containing:

```json
{
  "stage": "",
  "work_order_id": "",
  "status": "completed | blocked | failed | awaiting_human",
  "inputs": [],
  "outputs": [],
  "evidence_ids": [],
  "rule_results": [],
  "decisions": [],
  "findings": [],
  "handoff_to": [],
  "rollback": ""
}
```

## 7. Handoff law

A specialist handoff contains only externally useful reasoning and evidence, never hidden chain-of-thought.

Required handoff fields:

- objective completed;
- authoritative outputs;
- evidence references;
- decisions made and by whom;
- unresolved conflicts;
- assumptions explicitly labeled;
- blocking findings;
- files/URLs/repo SHAs;
- next required capability/role;
- acceptance criteria already satisfied;
- rollback information.

The receiving agent re-validates inputs; it does not blindly trust prose from the previous agent.

## 8. Parallelism model

ICM stages may contain parallel sub-work orders when they do not mutate the same canonical state.

Examples:

```text
03_public-research
  ├── news research
  ├── search presence
  ├── public company/profile research
  └── industry sources

04_reputation
  ├── review-site collection
  └── recurring theme analysis

05_social-presence
  ├── platform discovery
  ├── activity analysis
  └── visual/message consistency
```

The orchestrator owns fan-out/fan-in. The stage contract defines the merge/reconciliation rule.

Two workers must not concurrently edit the same canonical project file directly.

## 9. Human edit surfaces

Every meaningful stage creates a human-readable surface alongside machine data when a human decision or review benefits from it.

Examples:

- `research-summary.html`;
- `brand-audit.html`;
- `creative-brief.html`;
- `design-system.html`;
- `rebuild-options.html`;
- `prd.html`;
- `implementation-report.html`;
- `guardian-report.html`;
- `handoff.html`.

Humans edit/approve decisions and content through these governed surfaces or Studio UI. They should not need to hand-edit internal engine state.

## 10. Agent office metaphor mapped to files

```text
Office / company       = repository + Paperclip company
Department             = capability group / agent role
Employee               = specialized agent identity
Manager                = Hermes Studio Director
Assignment             = WorkOrder
Desk                    = isolated ICM stage context + sandbox/worktree
Company handbook       = Layer 0 + Layer 3 rules
Client folder          = projects/<project-id>/
Meeting note/decision  = DesignDecision / Approval
Work product           = Artifact
QA department          = Guardians / rule engine
Shipping department    = Release/export adapters
```

The metaphor must not weaken engineering boundaries: canonical state remains typed and versioned.

## 11. Versioning and compatibility

- Every stage contract declares a version.
- Every rule pack declares a version.
- Every domain object declares a schema version.
- Every work order records versions of stage/rule/capability contracts used.
- A running project is never silently reinterpreted under new rules without a migration/re-evaluation event.

## 12. Phase 0 ICM exit criteria

- root router exists;
- 16 stage contracts exist;
- permanent policy files exist;
- shared domain/work-order/evidence/artifact/handoff contracts exist;
- each stage identifies human gates and prohibited actions;
- the structure is portable plain text/data and does not require Paperclip to understand;
- runtime implementation remains deferred to bounded tickets after `BKB-CONTRACT-001`.
