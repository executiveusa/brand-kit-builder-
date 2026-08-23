# ICM — Intelligence Context Management
## The studio's folder, stage, context & handoff law

ICM controls **what an agent reads, does, writes, proves, and hands off**. It is the antidote to context rot, token waste, duplicate authority, and agent self-modification.

> Note: the Jake Van Cleeff ICM paper and GRINIONS-v1 system prompt live on local drives. Upload them to `knowledge/` and this file gets amended to match the paper exactly. Until then, this is the operative law, built from the ICM principles already agreed across sessions.

---

## 0. Cold-start walk test
Before editing, every agent must read `AGENTS.md`, `CONTEXT.md`, `studio/CONTEXT.md`, this contract, and `studio/_system/governance/WALK_TEST.md`.

The agent must be able to state: PURPOSE, OWNER, STAGE, READ SCOPE, WRITE SCOPE, REQUIRED SKILLS, REQUIRED OUTPUT, PASS BAR, PROOF, and NEXT HANDOFF. If any are unknown, emit `WALK_TEST_FAIL` and stop.

Skills are routed from `studio/_system/skills/CONTEXT.md`. Skills guide judgment; approved ICM files and manifests remain canonical truth.

## 1. Workspace Layout (per project)

```
projects/<tenant>/<project-slug>/
├── 00_intake/          # human-provided brief, voice transcript, assets
│   ├── brief.md
│   ├── assets/         # logos, photos, references (with provenance.md)
│   └── constraints.md  # locked copy, hard bans, protected items
├── 10_strategy/        # agents write; human never edits directly
│   ├── research/       # competitor, market, culture notes (cited)
│   ├── positioning.md
│   └── brand-manifest.json      # ← THE deliverable of this stage
├── 20_design/
│   ├── directions/     # 3 logo directions, each a folder
│   ├── tokens/         # color, type, spacing JSON
│   ├── mockups/
│   └── html-lab/       # audit.html, prd.html, fix-lab.html (A2A law)
├── 30_validate/
│   ├── guardian-reports/   # one file per guardian, machine-written
│   ├── scorecard.json      # quality scores
│   └── verdict.md
├── 40_deliver/
│   ├── brand-book/     # HTML + print PDF
│   ├── asset-package/  # SVG, PNG, EPS, favicon
│   ├── style-guide/    # living web page + tokens
│   ├── social/
│   └── developer-handoff/
├── 50_publish/         # PAULI'S PLACE listing payloads, UTM, POD mapping
└── _ledger/            # work orders, route decisions, eval records, events
    ├── work-orders/
    ├── routes/
    ├── evaluations/
    └── events.jsonl    # append-only, the durable spine
```

## 2. Stage Law

| Rule | Meaning |
|------|---------|
| Read-scope | An agent may read its own stage + the stages before it. Never later stages. |
| Write-scope | An agent writes only inside its stage folder. Cross-stage writes happen via handoff, never direct. |
| Skill-scope | Load only skills named for the current stage/work order. Do not preload the whole skill library. |
| Handoff | A stage ends by emitting a **handoff packet**: manifest pointer + context packet + open questions + proof pointers. The orchestrator moves it. |
| Immutability | Once a stage is gate-approved, its outputs are immutable. Revision = new version, new work order. |
| Separation | Builder and final critic/approver are different roles. Builders cannot approve themselves. |
| Ledger | Every action appends to `_ledger/events.jsonl`. Crash? Resume from last committed event. |

## 3. Context Packets (the token saver)

Before any agent call, the context compiler assembles the **smallest sufficient packet**:

- `role` — which worker is being invoked
- `stage` — which ICM stage
- `manifest_slice` — only the manifest fields this task touches
- `rules` — only the guardian/skill packs that apply to this task type
- `evidence` — cited facts, with freshness timestamps
- `hard_bans` + `protected_items` — always included, verbatim
- `budget` — max tokens, quality floor, allowed models

Schema: `studio/_system/schemas/context-packet.v1.json`

## 4. Skill routing by stage

| Stage | Required / typical skills |
|---|---|
| `00_intake` | `brand-discovery` |
| `10_strategy` | `brand-discovery`; `collins-level` when testing governing idea / creative territory |
| `20_design` | `collins-level` for direction; creator-specific tools as routed |
| `30_validate` | `design-guardian` → `gauntlet` → `design-proof` |
| `40_deliver` | `design-delivery` after G4 proof passes |
| `50_publish` | publish adapters only after G5 human approval |

Machine thresholds: `studio/_system/governance/DESIGN_STANDARD.json`.

## 5. Stage Gates

| Gate | From → To | Automated check | Human? |
|------|-----------|-----------------|--------|
| G0 | — → intake | brief completeness ≥ required fields | **YES (start)** |
| G1 | intake → strategy | assets have provenance; constraints parsed; discovery packet complete | no |
| G2 | strategy → design | manifest validates against schema; positioning score ≥ 9.0 | no |
| G3 | design → validate | all scoped assets rendered; html-lab complete where required; tokens compile | no |
| G4 | validate → deliver | Design Guardian pass + Gauntlet pass + proof receipt; machine thresholds met; provenance/rights 10/10 | no |
| G5 | deliver → publish | human reviews package, tweaks, approves | **YES (approve)** |

G2–G4 failures route back with a retry work order containing the **single biggest gap plus hard blockers**, injected into the owning stage context packet. Critics judge; creators repair. After 3 failed repair cycles, escalate model tier per `studio/_system/routing/AUTO_ROUTER.md`, then escalate to human with a diff/evidence report.

## 6. Gauntlet law

For release candidates:

`builder → separate fresh critic → direct comparison → one biggest gap → builder`

- Name a comparable quality bar for the slice under review.
- Judge the artifact, not the intent.
- No praise requirement.
- No arbitrary round-count exit.
- Hard blockers cannot be averaged away.
- Stop only when the work beats the defined bar and G4 passes, a required gate fails closed, or the owner stops the loop.

Canonical skill: `studio/_system/skills/gauntlet/SKILL.md`.

## 7. Tenant Isolation

- Studio law (this repo) is shared across all projects.
- Client manifests are sealed to their tenant folder. No cross-tenant reads.
- Personal/second-brain domains are a separate provider, never mounted into studio runs.

*ICM v1.1 — operative law for the Pauli design factory*
