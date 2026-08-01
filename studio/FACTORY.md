# FACTORY — Worker Schema & Long-Running Pipeline
## The digital design factory's org chart

Every worker is a defined role with inputs, outputs, guardian packs, and a model tier. Workers are model-agnostic: the auto-router binds a concrete model at runtime.

---

## 1. Worker Roster

### INTAKE STAGE
| Worker | Job | Reads | Writes | Model tier |
|--------|-----|-------|--------|-----------|
| **Interviewer** | Runs discovery: one question at a time, builds brand DNA, scores 20-axis readiness (min 8.5) | intake brief | `00_intake/brief.md` | balanced |
| **Provenance Clerk** | Verifies every asset's source, license, rights | assets/ | `provenance.md` | draft (deterministic where possible) |

### STRATEGY STAGE
| Worker | Job | Reads | Writes | Tier |
|--------|-----|-------|--------|------|
| **Researcher** | Competitor audit, market gaps, cultural context (es-MX sensitivity), trend pull | brief + web adapters | `10_strategy/research/` | balanced |
| **Strategist** | Positioning statement, brand promise + proof, differentiation (zag), audience tribes, naming/tagline, voice & tone | research | `brand-manifest.json` | **signature** |
| **Manifest Verifier** | Validates manifest against schema, checks Neumeier gates | manifest | gate report | draft (deterministic) |

### DESIGN STAGE
| Worker | Job | Reads | Writes | Tier |
|--------|-----|-------|--------|------|
| **Creative Director** | 3 distinct logo directions w/ rationale tied to strategy | manifest | `directions/` | signature |
| **Type Engineer** | Picks display+body from DARYA by personality + pairing matrix; builds type scale (Major Third) | manifest + DARYA | `tokens/type.json` | balanced |
| **Color Scientist** | OKLCH-first palette, HEX/RGB/CMYK/Pantone, WCAG contrast proof | manifest | `tokens/color.json` | balanced (deterministic checks) |
| **Asset Renderer** | Logo suite (SVG primary/secondary/monogram/favicon), patterns, collateral | tokens + chosen direction | `mockups/`, asset files | specialized (image/vector models) |
| **Web Builder** | Awwwards-stack surfaces: scroll-world sites, style-guide page, flipbooks | manifest + tokens | `html-lab/` → components | signature |

### VALIDATE STAGE (Guardians — independent, never the creator)
| Worker | Job | Tier |
|--------|-----|------|
| **Brand Guardian** | KAKU 13-page completeness, narrative coherence | balanced |
| **Taste Guardian** | Anti-slop checklist, rejected-example matching, Awwwards threshold | signature |
| **Krug Guardian** | 5-second test, one-primary-action, scanning hierarchy | draft + deterministic |
| **A11y Guardian** | WCAG 2.1 AA, contrast math, 75-char line rule | deterministic |
| **Rights Guardian** | Font licenses, image provenance — score must be 10/10 | deterministic |
| **Copy Guardian** | Locked copy preserved word-for-word; bilingual parity | deterministic diff |

### DELIVER / PUBLISH STAGE
| Worker | Job | Tier |
|--------|-----|------|
| **Packager** | Brand book HTML+PDF, asset package, social templates, dev handoff | balanced |
| **Merchant Agent** | PAULI'S PLACE listing: title, tags, pricing, POD mapping (Printify-class), Etsy/Fiverr payloads | balanced |
| **Trend Scout** | Google Trends + social signals; proposes what to make next | draft |
| **Experiment Runner** | A/B listing variants, UTM telemetry, winner promotion | deterministic |
| **Telemetry Clerk** | Records cost, revisions, acceptance, sales → learning loop | deterministic |

---

## 2. The Long-Running Loop (unattended between G0 and G5)

```
work_order(intake)
  → Interviewer → Provenance Clerk           [G1]
  → Researcher → Strategist → Manifest Verifier   [G2]
  → Creative Director → (pick direction, auto by score)
  → Type Engineer + Color Scientist (parallel)
  → Asset Renderer → Web Builder              [G3]
  → all Guardians (parallel) → scorecard       [G4]
  → Packager → HOLD for human approval         [G5]
  → Merchant Agent → Experiment Runner → Telemetry
```

Failure handling: failed gate → retry work order with the guardian's failure notes injected into the context packet → 3 strikes → escalate model tier → escalate to human with a diff report.

Durability: every state transition appends to `_ledger/events.jsonl`. The orchestrator resumes from the last event; side effects are idempotent (same work-order id = same output path).

---

## 3. What Agents Must NEVER Do

- Write outside their stage folder
- See later-stage content
- Edit an approved manifest (propose a new version instead)
- Pick their own model (the router decides)
- Ship without a scorecard receipt
- Touch locked copy (Copy Guardian diffs and blocks)
- Use an asset without a provenance entry

*FACTORY v1 — the workforce of the Pauli design factory*
