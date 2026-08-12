# Portability context

This folder owns packaging rules for sovereign project intelligence that can move between cloud, local workspaces, USB drives, and compatible agents.

Canonical architecture contract: `../docs/architecture/PORTABILITY_CONTRACT.md`.

## Law
- A portable pack must include enough ICM context for a cold start without chat history.
- Secrets are excluded from portable packs.
- Large assets may be referenced by hashes/provenance when policy permits, but required offline assets must be explicitly selected.
- Export/import must preserve tenant boundaries, protected items, approvals, and receipt history.
- Cloud services are conveniences, not the only place brand intelligence exists.
