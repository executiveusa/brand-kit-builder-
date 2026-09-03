# System context

`studio/_system/` contains the **operating law of the design factory**. It is shared across tenants and is not a client project workspace.

## Routes
- `contracts/ICM.md` — stage/read/write/handoff law.
- `contracts/CREATIVE_DIRECTION.md` — mandatory five-layer creative-direction law for new identities/material rebrands.
- `contracts/FACTORY.md` — worker roster and unattended pipeline.
- `schemas/creative-direction.v1.json` — machine-checkable creative-direction thresholds and required fields.
- `schemas/` — machine-readable work-order, context, evaluation and brand-manifest contracts.
- `skills/creative-direction/SKILL.md` — bounded execution/judgment skill for the five layers.
- `workflows/registry.v1.json` — canonical workflow sequence including `creative-direction.v1`.
- `routing/AUTO_ROUTER.md` — model/cost/quality routing law.
- `guardians/GUARDIANS.md` — independent release checks.
- `governance/DESIGN_STANDARD.json` — release thresholds; creative-direction layers are 9.0+ and `OWNABLE` is required.
- `governance/CONSOLIDATION.md` — current factory-wide truth and known gaps.
- `governance/PAULI_STUDIO_MASTER_PROMPT.md` — design constitution.

## Law
- System law may be changed only through reviewed repository changes.
- Tenant projects never overwrite system law.
- New identity/material rebrand work must pass governing idea, distinctiveness, human territory selection, brand behavior, application stress testing and independent commercial desirability before delivery.
- Builders cannot approve their own territory or final output.
- Guardians judge; they do not silently repair creator output.
- External design studios are reference lenses only; never copy their assets, layouts, wording or proprietary work.
- Schemas are canonical at this path; legacy `studio/schemas/` files are compatibility pointers only.
- Runtime implementations must trace back to these contracts and leave receipts.
