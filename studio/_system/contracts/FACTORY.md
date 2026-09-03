# FACTORY — Worker Schema & Long-Running Pipeline
## The digital design factory's org chart

Every worker is a defined role with inputs, outputs, guardian packs, and a model tier. Workers are model-agnostic: the auto-router binds a concrete model at runtime.

---

## 1. Worker Roster

### INTAKE STAGE
| Worker | Job | Reads | Writes | Model tier |
|--------|-----|-------|--------|-----------|
| **Interviewer** | Runs discovery: one question at a time, builds brand DNA, scores readiness | intake brief | `00_intake/brief.md` | balanced |
| **Provenance Clerk** | Verifies every asset's source, license, rights | assets/ | `provenance.md` | draft / deterministic where possible |

### STRATEGY STAGE
| Worker | Job | Reads | Writes | Tier |
|--------|-----|-------|--------|------|
| **Researcher** | Competitor audit, market gaps, cultural context, evidence and labeled hypotheses | brief + approved research adapters | `10_strategy/research/` | balanced |
| **Strategist** | Positioning, brand promise + proof, differentiation, audience, naming/tagline, voice | research | `brand-manifest.json` | **signature** |
| **Governing Idea Director** | Produces one central idea joining audience, cultural and business truth; no styling | positioning + research + constraints | `10_strategy/governing-idea.json` | **signature** |
| **Territory Director** | Produces three bounded territories from the one governing idea | governing idea + manifest | `10_strategy/directions/` or project-declared strategy territory paths | **signature** |
| **Distinctiveness Critic** | Independently tests logo-removed recognizability, competitor interchangeability, trend dependence, ownability and memorable behavior | territories + strategy | `10_strategy/distinctiveness-test.json` | signature critic |
| **Manifest Verifier** | Validates manifest/schema and confirms required creative-direction pointers/receipts for applicable work | manifest + strategy artifacts | gate report | draft / deterministic |

**Mandatory human boundary:** after three territories and distinctiveness evidence exist, an authorized human selects the territory. No worker may auto-select it by score. The approval receipt is required before identity production.

### DESIGN STAGE
| Worker | Job | Reads | Writes | Tier |
|--------|-----|-------|--------|------|
| **Creative Director** | Executes the human-selected territory into a coherent identity system; may not change the selected strategic territory silently | approved manifest + governing idea + territory approval | `20_design/directions/` + identity assets | signature |
| **Behavior Director** | Defines motion, layout, typography, imagery, UI and expression behavior with why/use_when/avoid_when | selected identity + strategy | `20_design/brand-behavior.json` | signature |
| **Type Engineer** | Picks display+body from DARYA by personality + pairing matrix; builds type scale | manifest + DARYA + behavior grammar | `tokens/type.json` | balanced |
| **Color Scientist** | OKLCH-first palette, HEX/RGB/CMYK/Pantone where relevant, WCAG contrast proof | manifest + behavior grammar | `tokens/color.json` | balanced / deterministic checks |
| **Asset Renderer** | Logo suite, patterns, collateral and required production assets | tokens + approved direction | `mockups/`, asset files | specialized |
| **Web Builder** | Builds governed digital surfaces from approved brand truth and behavior | manifest + tokens + behavior | `html-lab/` → components | signature |
| **Stress Test Runner** | Renders/checks representative mobile, desktop, social, document, small-mark, presentation, light/dark and scale contexts | selected system + applications | `20_design/application-stress-test.json` + proof pointers | balanced + deterministic checks |

### VALIDATE STAGE (independent — never the creator)
| Worker | Job | Tier |
|--------|-----|------|
| **Commercial Desirability Critic** | Judges perceived value, comprehension, position fit, desire, reason to choose and intended next action; 9.0+ required | signature critic |
| **Brand Guardian** | Brand-book completeness and narrative/system coherence | balanced |
| **Taste Guardian** | Anti-slop, rejected-example matching, world-class visual threshold | signature |
| **Krug Guardian** | 5-second test, one-primary-action, scanning hierarchy | draft + deterministic |
| **A11y Guardian** | WCAG/reduced-motion/legibility and interaction checks | deterministic where possible |
| **Rights Guardian** | Font licenses, image provenance — score must be 10/10 | deterministic |
| **Copy Guardian** | Locked copy preserved; bilingual parity where required | deterministic diff |

### DELIVER / PUBLISH STAGE
| Worker | Job | Tier |
|--------|-----|------|
| **Packager** | Brand book HTML+PDF, asset package, social templates, dev handoff | balanced |
| **Merchant Agent** | PAULI'S PLACE listing: title, tags, pricing, POD/listing mappings | balanced |
| **Trend Scout** | Public trends/signals; proposes what to investigate next; cannot promote trends directly into canonical intelligence | draft |
| **Experiment Runner** | Approved A/B variants, UTM telemetry, winner recommendation | deterministic |
| **Telemetry Clerk** | Records cost, revisions, acceptance, outcomes → learning loop | deterministic |

---

## 2. Long-Running Loop

```
work_order(intake)
  → Interviewer → Provenance Clerk                                      [G1]
  → Researcher → Strategist                                             [positioning]
  → Governing Idea Director                                             [G2a]
  → Territory Director → Distinctiveness Critic
  → HOLD FOR HUMAN TERRITORY SELECTION                                  [G2b]
  → Manifest Verifier                                                   [G2]
  → Creative Director → Behavior Director
  → Type Engineer + Color Scientist → Asset Renderer/Web Builder
  → Stress Test Runner                                                   [G3]
  → Commercial Desirability Critic                                      [G4a]
  → Guardians → Gauntlet → Proof                                       [G4]
  → Packager → HOLD FOR HUMAN PACKAGE APPROVAL                          [G5]
  → approved publishing/experiments/telemetry
```

There is no auto-by-score territory selection. Scores inform the human decision but cannot replace it.

Failure handling: failed gate → bounded retry work order with failed criterion, evidence, single biggest gap, protected items and proof required → owning creator stage. Critics do not silently repair. Three failed repair cycles → model-tier escalation → human escalation with diff/evidence report.

Durability: every state transition appends to `_ledger/events.jsonl`. The orchestrator resumes from the last committed event; side effects are idempotent (same work-order id = same output path).

---

## 3. What Agents Must NEVER Do

- Write outside their stage folder.
- Read later-stage content except through an authorized handoff packet.
- Edit an approved manifest in place; propose a versioned revision instead.
- Pick their own model when the router owns routing.
- Style before the governing idea gate passes.
- Advance a non-`OWNABLE` territory.
- Auto-select or self-approve a creative territory.
- Treat one hero mockup as proof of a design system.
- Let taste scores substitute for commercial desirability evidence.
- Copy external reference-studio visual work, assets, layouts or wording.
- Ship without the required scorecard/proof receipts.
- Touch protected copy without an authorized change.
- Use an asset without provenance/rights evidence.

*FACTORY v1.1 — the workforce of the Pauli design factory*
