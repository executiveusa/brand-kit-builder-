# Target tree — Pauli Brand Studio ICM v2

Status: **PROPOSED — do not move brownfield files until owner approval.**

The target uses a composed ICM form: an umbrella/factory over a repeatable project pipeline, with explicit human and agent interface surfaces.

```text
/
├── AGENTS.md                         # <60-line cold-start router
├── CONTEXT.md                        # repository contract
├── apps/
│   └── web/                          # HUMAN OFFICE
│       ├── CONTEXT.md
│       ├── homepage-prototype.html
│       └── [future Vite/React app]
├── interfaces/                       # AGENT DOORS; adapters only
│   ├── CONTEXT.md
│   ├── rest/
│   ├── mcp/
│   ├── cli/
│   ├── folder-drop/
│   └── popebot/
├── studio/                           # FACTORY
│   ├── CONTEXT.md
│   ├── _system/                      # stable governing intelligence
│   │   ├── contracts/
│   │   ├── schemas/
│   │   ├── guardians/
│   │   ├── routing/
│   │   └── governance/
│   ├── _shared/                      # reusable creative intelligence
│   │   ├── brand-book/
│   │   ├── voice/
│   │   ├── design-systems/
│   │   ├── image-direction/
│   │   ├── print-pod/
│   │   ├── social/
│   │   ├── presentation/
│   │   └── references/
│   ├── _templates/                   # blank copy-to-instantiate project skeletons
│   │   └── brand-project/
│   └── projects/                     # PRODUCTS / client or internal runs
│       └── <tenant>/<project-slug>/
│           ├── CONTEXT.md
│           ├── 00_intake/
│           │   ├── CONTEXT.md
│           │   ├── input/
│           │   └── output/
│           ├── 10_strategy/
│           │   ├── CONTEXT.md
│           │   ├── research/
│           │   └── output/
│           ├── 20_design/
│           │   ├── CONTEXT.md
│           │   ├── directions/
│           │   ├── tokens/
│           │   ├── imagery/
│           │   ├── social/
│           │   ├── print-pod/
│           │   ├── mockups/
│           │   └── html-lab/
│           ├── 30_validate/
│           │   ├── CONTEXT.md
│           │   ├── guardian-reports/
│           │   └── output/
│           ├── 40_deliver/
│           │   ├── CONTEXT.md
│           │   ├── brand-book/
│           │   ├── asset-package/
│           │   ├── social/
│           │   ├── print-pod/
│           │   ├── presentations/
│           │   ├── style-guide/
│           │   └── developer-handoff/
│           ├── 50_publish/
│           │   ├── CONTEXT.md
│           │   └── output/
│           └── _ledger/
│               ├── work-orders/
│               ├── routes/
│               ├── evaluations/
│               ├── approvals/
│               └── events.jsonl
├── portability/                      # export/import/sync profiles
│   ├── CONTEXT.md
│   ├── portable-pack.schema.json
│   └── profiles/
├── supabase/                         # CLOUD OPERATIONS, not brand truth
│   ├── CONTEXT.md
│   └── migrations/
├── vercel/                           # deployment/runbook metadata
│   └── CONTEXT.md
├── docs/
│   ├── architecture/
│   └── decisions/
├── ops/
│   └── reports/
└── _archive/                         # superseded material after approved migration
```

## Why this shape

### 1. The repo becomes an office
- `apps/web` is the reception desk for people.
- `interfaces` is the loading dock for agents and tools.
- `studio/_system` is policy and procedure.
- `studio/_shared` is the reusable creative library.
- `studio/projects` is where actual client work happens.
- `30_validate` is an independent review room.
- `40_deliver` is packaging, not creation.

### 2. The intelligence remains sovereign
A project can be zipped/copied to local disk or USB and still be intelligible because its contracts, approved manifest, decisions, and outputs are files. A cloud database accelerates collaboration; it does not define what the brand is.

### 3. The human UI can disappear without the system disappearing
The web application is a renderer/controller over contracts. If Vercel, Supabase, or one LLM provider disappears, the project package still contains its intelligence and can be opened by another capable agent.

## Cold-walk rule
A new agent must answer these in three reads or fewer:
1. Where am I?
2. What task am I doing?
3. What exact inputs may I read?
4. What exact outputs may I write?
5. What human/guardian check ends the stage?

## Do not add yet
No speculative subfolders beyond demonstrated work. New creative departments appear only when repeated outputs prove they need their own stable contract.
