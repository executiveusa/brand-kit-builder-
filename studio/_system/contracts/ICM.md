# ICM — Intelligence Context Management
## The studio's folder, stage, context & handoff law

ICM controls **what an agent reads, does, writes, proves, and hands off**. It is the antidote to context rot, token waste, duplicate authority, and agent self-modification.

> Note: the Jake Van Cleeff ICM paper and GRINIONS-v1 system prompt live on local drives. Upload them to `knowledge/` and this file gets amended to match the paper exactly. Until then, this is the operative law, built from the ICM principles already agreed across sessions.

---

## 0. Cold-start walk test
Before editing, every agent must read `AGENTS.md`, `CONTEXT.md`, `studio/CONTEXT.md`, this contract, and `studio/_system/governance/WALK_TEST.md`.

The agent must be able to state: PURPOSE, OWNER, STAGE, READ SCOPE, WRITE SCOPE, REQUIRED SKILLS, REQUIRED OUTPUT, PASS BAR, PROOF, and NEXT HANDOFF. If any are unknown, emit `WALK_TEST_FAIL` and stop.

Skills are routed from `studio/_system/skills/CONTEXT.md`. Skills guide judgment; approved ICM files and manifests remain canonical truth.

For new identity creation or material rebrand work, also read `studio/_system/contracts/CREATIVE_DIRECTION.md` and load `creative-direction/SKILL.md`. Do not load it for routine delivery or publishing.

## 1. Workspace Layout (per project)

```
projects/<tenant>/<project-slug>/
├── 00_intake/
│   ├── brief.md
│   ├── assets/
│   └── constraints.md
├── 10_strategy/
│   ├── research/
│   ├── positioning.md
│   ├── governing-idea.json
│   ├── distinctiveness-test.json
│   └── brand-manifest.json
├── 20_design/
│   ├── directions/
│   ├── tokens/
│   ├── mockups/
│   ├── brand-behavior.json
│   ├── application-stress-test.json
│   └── html-lab/
├── 30_validate/
│   ├── guardian-reports/
│   ├── commercial-desirability.json
│   ├── scorecard.json
│   └── verdict.md
├── 40_deliver/
│   ├── brand-book/
│   ├── asset-package/
│   ├── style-guide/
│   ├── social/
│   └── developer-handoff/
├── 50_publish/
└── _ledger/
    ├── work-orders/
    ├── routes/
    ├── evaluations/
    └── events.jsonl
```

These creative-direction files are canonical stage artifacts, not optional mood-board notes. The combined machine record must validate against `studio/_system/schemas/creative-direction.v1.json` before G4.

## 2. Stage Law

| Rule | Meaning |
|------|---------|
| Read-scope | An agent may read its own stage + the stages before it. Never later stages. |
| Write-scope | An agent writes only inside its stage folder. Cross-stage writes happen via handoff, never direct. |
| Skill-scope | Load only skills named for the current stage/work order. Do not preload the whole skill library. |
| Handoff | A stage ends by emitting a handoff packet: manifest pointer + context packet + open questions + proof pointers. |
| Immutability | Once a stage is gate-approved, outputs are immutable. Revision = new version, new work order. |
| Separation | Builder and final critic/approver are different roles. Builders cannot approve themselves. |
| Ledger | Every action appends to `_ledger/events.jsonl`. Resume from the last committed event. |

## 3. Context Packets

Before any agent call, the context compiler assembles the smallest sufficient packet:
- `role`
- `stage`
- `manifest_slice`
- `rules`
- `evidence`
- `hard_bans` + `protected_items`
- `budget`

Schema: `studio/_system/schemas/context-packet.v1.json`.

For creative direction, the packet includes only the active layer plus approved upstream artifacts. External agency references are lenses, not canonical truth and never override client evidence or approved decisions.

## 4. Skill routing by stage

| Stage | Required / typical skills |
|---|---|
| `00_intake` | `brand-discovery` |
| `10_strategy` | `brand-discovery` + `creative-direction` for governing idea/distinctiveness; `collins-level` as judgment lens |
| `20_design` | `creative-direction` for behavior/stress test; `collins-level` for direction; creator tools as routed |
| `30_validate` | independent commercial desirability → `design-guardian` → `gauntlet` → `design-proof` |
| `40_deliver` | `design-delivery` after G4 proof passes |
| `50_publish` | publish adapters only after G5 human approval |

Machine thresholds: `studio/_system/governance/DESIGN_STANDARD.json`.

## 5. Stage Gates

| Gate | From → To | Automated check | Human? |
|------|-----------|-----------------|--------|
| G0 | — → intake | brief completeness ≥ required fields | **YES (start)** |
| G1 | intake → strategy | assets have provenance; constraints parsed; discovery packet complete | no |
| G2a | strategy positioning → creative direction | positioning score ≥ 9.0; governing idea exists and scores ≥ 9.0 | no |
| G2b | territories → selected territory | three bounded territories from one governing idea; each tested; selected territory verdict `OWNABLE` and score ≥ 9.0 | **YES (territory selection)** |
| G2 | strategy → design | manifest validates; G2a/G2b pass; selected territory approval recorded | no additional approval |
| G3a | design system → stress test | brand-behavior grammar exists; system coherence ≥ 9.0 | no |
| G3 | design → validate | application stress test passes applicable surfaces; primary digital responsive score ≥ 9.0; scoped assets/tokens compile | no |
| G4a | commercial review | independent commercial desirability score ≥ 9.0 or documented non-commercial action equivalent | no |
| G4 | validate → deliver | G4a + Design Guardian + Gauntlet + proof receipt; machine thresholds met; provenance/rights 10/10 | no |
| G5 | deliver → publish | human reviews package, tweaks, approves | **YES (approve)** |

G2–G4 failures route back with a retry work order containing the single biggest gap plus hard blockers, injected into the owning stage context packet. Critics judge; creators repair. After 3 failed repair cycles, escalate model tier per `studio/_system/routing/AUTO_ROUTER.md`, then escalate to human with a diff/evidence report.

## 6. Five creative-direction laws

1. **Governing Idea Gate** — no styling before one central idea is explicit and proven enough to guide design.
2. **Distinctiveness Test** — only `OWNABLE` territories advance; generic/trend/category-copy work returns to strategy.
3. **Brand Behavior Grammar** — define how the brand moves, reveals, composes, typesets, images and behaves in UI, including when not to use expressive behavior.
4. **Application Stress Test** — a brand is a system only after it survives representative real surfaces, sizes, modes and responsive states.
5. **Commercial Desirability Judge** — taste does not substitute for perceived value, comprehension, position, desire or intended next action.

Canonical details: `studio/_system/contracts/CREATIVE_DIRECTION.md`.

## 7. Gauntlet law

For release candidates:

`builder → separate fresh critic → direct comparison → one biggest gap → builder`

- Name a comparable quality bar for the slice under review.
- Judge the artifact, not the intent.
- No praise requirement.
- No arbitrary round-count exit.
- Hard blockers cannot be averaged away.
- Stop only when the work beats the defined bar and G4 passes, a required gate fails closed, or the owner stops the loop.

Canonical skill: `studio/_system/skills/gauntlet/SKILL.md`.

## 8. Tenant Isolation

- Studio law is shared across projects.
- Client manifests and creative-direction artifacts are sealed to their tenant folder. No cross-tenant reads.
- Personal/second-brain domains are a separate provider, never mounted into studio runs.

*ICM v1.2 — operative law for the Pauli design factory*
