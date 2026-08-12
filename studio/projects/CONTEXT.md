# Project workspaces context

`studio/projects/` contains tenant-sealed brand projects. Each project is a product workspace governed by the factory contracts in `../_system/`.

## Required path
`studio/projects/<tenant>/<project-slug>/`

## Required stage folders
- `00_intake/`
- `10_strategy/`
- `20_design/`
- `30_validate/`
- `40_deliver/`
- `50_publish/`
- `_ledger/`

## Law
- Read/write boundaries follow `../_system/contracts/ICM.md`.
- A project manifest is canonical only after the required approval gate.
- No cross-tenant reads.
- Project outputs never overwrite `_system/` or `_shared/`.
- Every consequential action leaves a receipt in `_ledger/`.
- Secrets are forbidden in project packs.
