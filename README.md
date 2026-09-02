# PARÉ — Pauli Brand Studio

**Brand systems, reduced to what matters.**

PARÉ is the installable Pauli Brand Studio: governed in-house software for turning company context into brand strategy, identity, production SVG, voice, SEO, social systems and portable delivery packages.

**One Hands** is the operating agent. **ICM** is canonical brand intelligence. Darya/OpenHands and Postiz are optional replaceable execution/publishing adapters rather than owners of brand truth.

## Commercial / ownership model
PARÉ is designed to be installed and adapted to a business rather than rented as mandatory subscription software.

A client handoff can include:
- source/runtime package;
- portable ICM project intelligence;
- approved brand manifest and voice;
- brand book and production assets;
- REST/MCP/CLI interfaces;
- self-host documentation;
- optional Darya/OpenHands worker integration;
- optional Postiz social publishing integration.

Pauli may sell installation, customization, migration, maintenance and creative operations. The customer should still be able to operate and retain its approved assets/intelligence after ending optional maintenance.

## Human start
Read `CONTEXT.md`.

## Agent start
Read `AGENTS.md`, then `CONTEXT.md`, then `studio/_system/contracts/ICM.md`, the walk test and only the skills required by the active work order.

One Hands contract: `studio/_system/contracts/ONE_HANDS.md`.

## Canonical pipeline
`00_intake → 10_strategy → 20_design → 30_validate → 40_deliver → 50_publish`

Optional workflows attach to those stages. They do not replace ICM.

Registered in `studio/_system/workflows/registry.v1.json`:
- `brand-kit.v1`
- `seo.v1`
- `social.v2`
- `flipbook.v1`
- `sovereign-install.v1`
- `product-audit.v1`

## Agent-callable doors
### CLI
```bash
node interfaces/cli/cli.mjs capabilities
node interfaces/cli/cli.mjs workflows --root .
node interfaces/cli/cli.mjs plan \
  --root . \
  --tenant acme \
  --project launch \
  --outcome "Build our brand, SEO and social plan." \
  --workflow brand-kit.v1 \
  --stage 00_intake \
  --step intake \
  --action discover
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
cp .env.pare.example .env   # fill real values outside Git
PARE_API_TOKEN='<owner-runtime-secret>' docker compose up --build
```

For production, use an owner-controlled secret store and TLS reverse proxy rather than plaintext shell history. Full runbook: `docs/architecture/SELF_HOST_PARE.md`.

The Docker image serves the PARÉ web surface and REST API from one service. Optional Postiz and Darya/OpenHands runtimes remain separate owner-controlled services.

## Quality law
- Strategy before styling.
- Proof before claims.
- Builders do not approve themselves.
- Generated raster marks are not official SVG masters.
- SEO measurements require real evidence.
- Social schedule/publish and production promotion require recorded approval.
- No evidence, no completion claim.

Design release candidates pass Design Guardian → Gauntlet → Proof before delivery.

## Product project
PARÉ uses its own ICM structure at:
`studio/projects/pauli/pare/`

That project contains the owner-approved product brief, constraints, positioning, brand manifest and design territories used to govern the product surface.

## Production hold
A successful build, CI run, preview or deployment request is not production approval. Promotion remains owner-gated.
