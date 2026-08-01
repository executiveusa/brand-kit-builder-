# AUTO ROUTER — Model Routing Law
## Cheapest model that clears the quality floor. Escalate on failure. Receipt for every route.

The router lives **inside the harness**, not in a gateway, because it needs context no gateway has.

---

## 1. The Decision

```
m* = argmin over models m of ExpectedCost(m, task)
subject to:
  ExpectedQuality(m, task) >= quality_floor(task)
  AND privacy, licensing, tool, and latency constraints all pass
```

## 2. Inputs the router considers

task type · ICM stage · context size · tenant privacy class · required tools · quality floor · commercial importance · prompt-cache hits · whether a deterministic check exists · past performance on this task family · remaining budget · cost of escalation vs restart

## 3. Tiers (what the UI shows)

| Tier | Use for | Internal meaning |
|------|---------|------------------|
| **draft** | classification, extraction, formatting, provenance checks, copy-diffing | cheapest available; deterministic code preferred over any LLM |
| **balanced** | research, packaging, merchant listings, guardian review | mid-tier |
| **signature** | strategy, creative direction, web builds, taste judgments | strongest available |
| **specialized** | image/vector/audio generation | the right tool for the modality, only when required |

Model names never appear in the client experience.

## 4. Routing behavior

1. Deterministic software beats an LLM. If code can verify it (contrast ratio, copy diff, schema validation, license lookup), no model is called at all.
2. Escalation path on gate failure: retry same tier (×3) → next tier up → human with diff report.
3. Every route appends a record to `_ledger/routes/`: task family, chosen tier, cost, outcome, eval score. This is the training data for future routing.
4. Learning = better context selection, workflow selection, routing, validators, templates — **before** any fine-tuning is even considered.

## 5. Route record (ledger line)

```json
{
  "route_id": "RT-20260802-0007",
  "work_order_id": "WO-20260802-0003",
  "task_family": "strategy.positioning",
  "tier": "signature",
  "cost_usd": 0.41,
  "eval_score": 9.3,
  "verdict": "pass",
  "created_at": "2026-08-02T00:00:00Z"
}
```

*AUTO ROUTER v1 — the token saver*
