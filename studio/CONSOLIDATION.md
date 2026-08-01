# CONSOLIDATION — Studio Intelligence v1
## What every past session taught us, and what we fix now

This document consolidates findings from the Kimi, Gemini, and ChatGPT build sessions, the PAULI_STUDIO_MASTER_PROMPT, DARYA registry, KAKU template, and the sovereign-intelligence architecture pass. It is the studio's shared memory. Any agent starting work reads this first.

---

## 1. The One-Sentence Truth

We are not building a brand tool. We are building a **digital design factory**: a governed pipeline that turns an intake interview into luxury-grade digital assets (brand kits, logos, flipbooks, posters, 3D stickers, scroll-world sites) at scale — assets that other agents then sell through PAULI'S PLACE on Etsy/Fiverr/direct, print-on-demand, with zero inventory risk.

- **Brand Kit Builder = the creative engine** (makes the assets)
- **PAULI'S PLACE = the store** (sells pure digital assets + POD fulfillment)
- **Humans touch the process twice**: once to begin, once to approve at the end

---

## 2. Struggles & Roadblocks — Observed Across All Sessions

| # | Struggle | Evidence | Root Cause | Fix (implemented in this repo) |
|---|----------|----------|-----------|-------------------------------|
| 1 | **AI slop**: generic gradients, default shadows, emoji icons, bento grids, lorem ipsum | Master Prompt anti-slop list; Gemini "Shadcn visual fatigue" discussion | Models regress to the average of the web | GUARDIANS.md — release-blocking validator packs; taste encoded as rules, not vibes |
| 2 | **Fractured intelligence** across Kimi/Gemini/ChatGPT/local drives | ChatGPT session: "merge into one intelligence" | No canonical representation; every output a new interpretation | Brand Manifest v1 schema — one source of truth, all outputs are renderings of it |
| 3 | **Token waste** — every agent reads everything | "auto-router saves us a lot of tokens" | No context compilation | Context Packet schema + ICM stage law: agents read only what their stage needs |
| 4 | **Wrong-model spend** | auto-router discussion | No routing layer | AUTO_ROUTER.md — cheapest model that clears the quality floor, escalate on failure |
| 5 | **Repo sprawl / unrelated histories** | KAKU/DARYA reconciliation branch saga | Platform rebuilt inside every project | Platform components vs tenants separation; this repo is the only engine |
| 6 | **Font licensing risk** | DARYA blocked from production until rights verified | Unlicensed assets in the pipeline | Provenance gate (score must be 10/10) + free-alternative column in DARYA registry |
| 7 | **Copy drift** — models rewriting locked copy | ASC3ND "preserve word-for-word" hard ban | No protected-items contract | Work Order schema has `protected_items` + `hard_bans` fields; Guardian enforces |
| 8 | **Approval chaos** — "merge to main" with no auth, broken handoffs | ChatGPT merge-blocked session | No durable job state | Durable work-order ledger; every gate recorded; jobs resume after crash |
| 9 | **"Looks good" shipping** | quality scoring exists but is manual | No eval harness | Evaluation Record schema + 15-dimension scorecard wired as a release gate |
| 10 | **Scope creep** — building advanced media before one paid loop | architecture pass RISKS list | No sequencing law | FACTORY.md Phase 0: one paid end-to-end loop beats ten architecture expansions |
| 11 | **Cross-client leakage risk** | memory/privacy layers discussion | Shared intelligence without isolation | Tenant law: client manifests are sealed; studio law is shared; never the reverse |
| 12 | **Design taste not transferable** | "Bambu knows premium when he sees it" | Taste lives in one person's head | Taste = accepted examples + rejected examples + reasons + Guardian eval packs |

---

## 3. What We Keep (Proven Good)

1. **KAKU 13-page narrative** — governs sequence and completeness of every brand book.
2. **DARYA registry** — font selection by personality + pairing matrix + free alternatives. Research-only until rights verified per family.
3. **Neumeier 5 disciplines** as pipeline gates: Differentiate → Collaborate → Innovate → Validate → Cultivate.
4. **Chris Do / The Futur law**: strategy before pixels, always.
5. **Krug usability laws** as executable checks, not aspirations.
6. **The 15-dimension scorecard** with 9.0 minimum ship score.
7. **Awwwards stack for premium web output**: Next.js + Tailwind fluid clamp() type + Lenis smooth scroll + GSAP/Framer Motion + Aceternity-class micro-interactions. Never default Shadcn aesthetics.
8. **Bilingual EN/es-MX** as structural requirement, not an afterthought.
9. **A2A HTML-first law** (from the ASC3ND build): any visual fix is proven in HTML (`audit.html → prd.html → fix-lab.html → approved patch → implementation-report.html`) before code is touched.

---

## 4. The Factory in One Diagram

```
HUMAN (starts)                                   HUMAN (approves)
    │                                                  ▲
    ▼                                                  │
┌─────────┐  ┌──────────┐  ┌─────────┐  ┌──────────┐  │  ┌──────────┐
│ INTAKE  │─▶│ STRATEGY │─▶│ DESIGN  │─▶│ VALIDATE │──┘─▶│ DELIVER  │
│  (voice │  │ manifest │  │ assets  │  │ guardians│     │ package + │
│   brief)│  │  locked  │  │ render  │  │ 9.0 gate │     │  publish  │
└─────────┘  └──────────┘  └─────────┘  └──────────┘     └────┬─────┘
                                                              │
                                     ┌────────────────────────┘
                                     ▼
                            PAULI'S PLACE (store)
                     trends → A/B test → sell → POD fulfill
                                     │
                                     ▼
                        outcome telemetry feeds
                        the governed learning loop
```

All stages run unattended. The only gates requiring a human: **G0 start** and **G5 final approval/tweak**.

---

## 5. What Is Still Missing (Honest List)

| Gap | First proof |
|-----|-------------|
| Running orchestrator (the schemas exist; the daemon doesn't yet) | One brand kit produced end-to-end unattended |
| Context compiler implementation | Stage packet assembled with citations, tokens measured |
| Eval harness with real accepted/rejected work | 20 examples scored, routing learns from them |
| Trend/A-B adapters (Google Trends, social) | One asset listed from a trend signal with UTM telemetry |
| PAULI'S PLACE storefront | One digital asset sold and delivered automatically |
| GRINIONS / emerald-tablets / ICM paper uploaded | Upload to repo `/knowledge/` so the law is in-repo, not on E:\ |

---

## 6. Non-Negotiable Laws

1. **The Manifest is truth.** Brand books, sites, flipbooks, agent prompts are renderings. Never edit a rendering; edit the manifest and re-render.
2. **Deterministic beats LLM.** If code can verify it, code verifies it. Models reason; scripts judge.
3. **No agent writes to canonical truth.** Agents propose; approvals commit.
4. **Every route, score, and decision leaves a receipt.** No receipt = didn't happen.
5. **One paid loop before any expansion.** Revenue is the validator that matters.

*Consolidated 2026-08-02 — Pauli Studio / MACS Digital Media*
