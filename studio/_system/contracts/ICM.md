# ICM — Intelligence Context Management
## The studio's folder, stage, context & handoff law

ICM controls **what an agent reads, does, writes, and hands off**. It is the antidote to context rot, token waste, and agent self-modification.

> Note: the Jake Van Cleeff ICM paper and GRINIONS-v1 system prompt live on local drives. Upload them to `knowledge/` and this file gets amended to match the paper exactly. Until then, this is the operative law, built from the ICM principles already agreed across sessions.

---

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
│   ├── scorecard.json      # 15-dimension scores
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
| Handoff | A stage ends by emitting a **handoff packet**: manifest pointer + context packet + open questions. The orchestrator moves it. |
| Immutability | Once a stage is gate-approved, its outputs are immutable. Revision = new version, new work order. |
| Ledger | Every action appends to `_ledger/events.jsonl`. Crash? Resume from last committed event. |

## 3. Context Packets (the token saver)

Before any agent call, the context compiler assembles the **smallest sufficient packet**:

- `role` — which worker is being invoked
- `stage` — which ICM stage
- `manifest_slice` — only the manifest fields this task touches
- `rules` — only the guardian packs that apply to this task type
- `evidence` — cited facts, with freshness timestamps
- `hard_bans` + `protected_items` — always included, verbatim
- `budget` — max tokens, quality floor, allowed models

Schema: `studio/_system/schemas/context-packet.v1.json`

## 4. Stage Gates

| Gate | From → To | Automated check | Human? |
|------|-----------|-----------------|--------|
| G0 | — → intake | brief completeness ≥ required fields | **YES (start)** |
| G1 | intake → strategy | assets have provenance; constraints parsed | no |
| G2 | strategy → design | manifest validates against schema; positioning score ≥ 9.0 | no |
| G3 | design → validate | all assets rendered; html-lab complete; tokens compile | no |
| G4 | validate → deliver | 15-dim scorecard ≥ 9.0; all guardians pass; provenance 10/10 | no |
| G5 | deliver → publish | human reviews package, tweaks, approves | **YES (approve)** |

G2–G4 failures route back with a retry work order (max 3 retries, then escalate model tier per `studio/_system/routing/AUTO_ROUTER.md`, then escalate to human).

## 5. Tenant Isolation

- Studio law (this repo) is shared across all projects.
- Client manifests are sealed to their tenant folder. No cross-tenant reads.
- Personal/second-brain domains are a separate provider, never mounted into studio runs.

*ICM v1 — operative law for the Pauli design factory*
