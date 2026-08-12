# System context

`studio/_system/` contains the **operating law of the design factory**. It is shared across tenants and is not a client project workspace.

## Routes
- `contracts/ICM.md` — stage/read/write/handoff law.
- `contracts/FACTORY.md` — worker roster and unattended pipeline.
- `schemas/` — machine-readable work-order, context, evaluation and brand-manifest contracts.
- `routing/AUTO_ROUTER.md` — model/cost/quality routing law.
- `guardians/GUARDIANS.md` — independent release checks.
- `governance/CONSOLIDATION.md` — current factory-wide truth and known gaps.
- `governance/PAULI_STUDIO_MASTER_PROMPT.md` — design constitution.

## Law
- System law may be changed only through reviewed repository changes.
- Tenant projects never overwrite system law.
- Guardians judge; they do not silently repair creator output.
- Schemas are canonical at this path; legacy `studio/schemas/` files are compatibility pointers only.
- Runtime implementations must trace back to these contracts and leave receipts.
