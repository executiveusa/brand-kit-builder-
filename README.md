# PARÉ — Pauli Brand Studio

**Brand systems, reduced to what matters.**

PARÉ is the installable Pauli Brand Studio: governed in-house software for turning company context into brand strategy, identity, production SVG, voice, SEO, social systems and portable delivery packages.

**One Hands** is the operating agent. **ICM** is canonical brand intelligence. Darya/OpenHands and Postiz are optional replaceable execution/publishing adapters rather than owners of brand truth.

## Commercial / ownership model
PARÉ is designed to be installed and adapted to a business rather than rented as mandatory subscription software.

A client handoff can include:
- source/runtime package;
- portable ICM project intelligence;
- approved brand manifest and creative-direction artifacts;
- brand book and production assets;
- REST/MCP/CLI interfaces;
- self-host documentation;
- optional Darya/OpenHands worker integration;
- optional Postiz social publishing integration.

Pauli may sell installation, customization, migration, maintenance and creative operations. The customer should still be able to operate and retain its approved assets/intelligence after ending optional maintenance.

## Human start
Read `CONTEXT.md`.

## Agent start
Read, in order:
1. `AGENTS.md`
2. `CONTEXT.md`
3. `studio/CONTEXT.md`
4. `studio/_system/contracts/ICM.md`
5. `studio/_system/governance/WALK_TEST.md`
6. only the skills required by the active work order

For a new identity or material rebrand, also read:
- `studio/_system/contracts/CREATIVE_DIRECTION.md`
- `studio/_system/skills/creative-direction/SKILL.md`

One Hands contract: `studio/_system/contracts/ONE_HANDS.md`.

## Canonical pipeline
`00_intake → 10_strategy → 20_design → 30_validate → 40_deliver → 50_publish`

Optional workflows attach to those stages. They do not replace ICM.

Registered in `studio/_system/workflows/registry.v1.json`:
- `brand-kit.v1`
- `creative-direction.v1`
- `seo.v1`
- `social.v2`
- `flipbook.v1`
- `sovereign-install.v1`
- `product-audit.v1`

## The five creative-direction layers

PARÉ does not jump from positioning directly into visual styling. New identities and material rebrands must pass these five layers:

### 1. Governing Idea Gate
One central idea must connect audience truth, cultural truth and business truth before styling begins. Required artifact: `10_strategy/governing-idea.json`. Minimum score: 9.0.

### 2. Distinctiveness Test
Every territory is tested for recognizability without the logo, competitor interchangeability, trend dependence, ownability and memorable behavior. Only verdict `OWNABLE` advances. Required artifact: `10_strategy/distinctiveness-test.json`. Minimum score: 9.0.

**Human gate:** after three bounded territories are tested, an authorized human selects one. The builder cannot select and approve its own territory.

### 3. Brand Behavior Grammar
The selected identity defines repeatable motion, layout, typography, imagery, UI and expression behavior, including `why`, `use_when` and `avoid_when`. Required artifact: `20_design/brand-behavior.json`. System coherence: 9.0+.

### 4. Application Stress Test
The system must survive representative mobile, desktop, social, document, small-mark, presentation, light/dark and scale contexts. One hero mockup is not proof of a system. Required artifact: `20_design/application-stress-test.json`. Primary digital responsive score: 9.0+.

### 5. Commercial Desirability Judge
An independent critic judges perceived value, offer/action comprehension, position fit, desire, reason to choose, market position and next-action coherence. Required artifact: `30_validate/commercial-desirability.json`. Minimum score: 9.0. Nonprofits/public-interest work substitutes the intended action (donate, join, apply, attend, volunteer, trust) for purchase.

Canonical contract: `studio/_system/contracts/CREATIVE_DIRECTION.md`.
Machine schema: `studio/_system/schemas/creative-direction.v1.json`.
CI wiring validator: `ops/validate_creative_direction.mjs`.

## Reference council — lenses, not styles
PARÉ may use world-class studios as selective judgment references:
- COLLINS — governing idea, transformation, world-building;
- Pentagram — concept, reduction, typography, longevity;
- Koto — adaptable digital identity, behavior, motion;
- PORTO ROCHA — editorial composition, typography, art direction;
- Red Antler — positioning, desirability, commercial clarity;
- Further / DesignStudio lineage — brand-to-product/system transformation.

Agents must learn **why** a principle works, **when** it applies, **how** to judge it and **when not to use it**. They must not copy a studio's visual style, layouts, assets, wording or proprietary work.

## Agent-callable doors
### CLI
```bash
node interfaces/cli/cli.mjs capabilities
node interfaces/cli/cli.mjs workflows --root .
node interfaces/cli/cli.mjs plan \
  --root . \
  --tenant acme \
  --project launch \
  --outcome "Build an ownable brand system." \
  --workflow creative-direction.v1 \
  --stage 10_strategy \
  --step governing-idea \
  --action governing-idea-gate
```

### MCP
```bash
node interfaces/mcp/server.mjs
```
Tools include legacy Design Factory calls plus PARÉ v2 normalization, workflow discovery, planning and work-order validation.

### REST
```bash
PARE_API_TOKEN='<owner-runtime-secret>' node interfaces/rest/server.mjs
```
The API serves authenticated `/v1` and `/v2` endpoints. See `interfaces/rest/API.md`.

## Self-host
```bash
cp .env.pare.example .env
PARE_API_TOKEN='<owner-runtime-secret>' docker compose up --build
```

For production, use an owner-controlled secret store and TLS reverse proxy rather than plaintext shell history. Full runbook: `docs/architecture/SELF_HOST_PARE.md`.

The Docker image serves the PARÉ web surface and REST API from one service. Optional Postiz and Darya/OpenHands runtimes remain separate owner-controlled services.

## Anti-bloat knowledge law
Before external design knowledge becomes shared PARÉ intelligence:
1. check whether an existing principle already covers it;
2. distinguish durable principle from example/trend;
3. require that it changes an agent decision;
4. require an evaluable test;
5. state when not to use it;
6. retain provenance;
7. require durability beyond the current trend.

If it does not change a decision, cannot be evaluated, has no `avoid_when`, or is merely trend-dependent, do not promote it.

## Quality law
- Strategy before styling.
- Governing idea before territories.
- `OWNABLE` before identity production.
- Human territory selection before design execution.
- Behavior before polish.
- Stress-test systems across real applications.
- Commercial desirability is independent from taste.
- Proof before claims.
- Builders do not approve themselves.
- Generated raster marks are not official SVG masters.
- SEO measurements require real evidence.
- Social schedule/publish and production promotion require recorded approval.
- External references never become permission to copy.
- No evidence, no completion claim.

Design release candidates pass Commercial Desirability → Design Guardian → Gauntlet → Proof before delivery.

## Product project
PARÉ uses its own ICM structure at:
`studio/projects/pauli/pare/`

That project contains the owner-approved product brief, constraints, positioning, brand manifest and design territories used to govern the product surface.

## Production hold
A successful build, CI run, preview or deployment request is not production approval. Promotion remains owner-gated.
