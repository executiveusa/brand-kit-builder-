# Source conflicts — ZTE-20260810-0001

## 1. ICM human-every-stage vs unattended factory
**Source A:** uploaded ICM Architect v2 says every output is an edit surface and nothing advances until a person has read the last output.

**Source B:** existing `studio/ICM.md` and `studio/FACTORY.md` define unattended operation between start and final approval. Current owner direction also asks to put technology under the hood and reduce button-clicking/human operation.

**Resolution for this project:** preserve an explicit `Human/Guardian check` field on every stage contract, but only consequential brand decisions, protected-asset changes, irreversible actions, final package approval, and production deployment require the owner. Routine quality checks may be performed by independent Guardians. This keeps editability/auditability without turning the studio back into a manual checklist.

## 2. ICM filesystem truth vs Supabase
**Source A:** ICM core uses plain files as the interface/state machine and warns against making a database the loop.

**Source B:** owner requires Supabase for the cloud product.

**Resolution:** ICM files + approved manifest remain canonical brand intelligence. Supabase owns cloud identity/tenancy, session/job/approval indexes, sync state, and optional asset mirrors. Cloud records point to file/manifest versions/hashes; they do not become a second editable brand truth.

## 3. Popebot auto-merge vs independent approval
**Source A:** upstream Popebot supports agent jobs that open PRs and can auto-merge.

**Source B:** Pauli/ZTE law says builders cannot approve themselves; production changes require explicit owner approval during the production gate.

**Resolution:** adapt Popebot's conversation/session/job patterns, but do not adopt blind auto-merge for studio canonical truth or production. Agent jobs propose; Guardians and configured human gates approve.

## 4. COLLINS expression vs anti-slop/Krug restraint
**Source A:** COLLINS uses large expressive typography, full-bleed work presentation, distinctive motion, and brand-system storytelling.

**Source B:** Krug/anti-slop rules require immediate clarity, obvious primary action, accessibility, reduced motion, and no decorative complexity without purpose.

**Resolution:** borrow the proof-first hierarchy and systems thinking, not protected identity. Keep the outcome composer obvious, use expressive work specimens as proof, and keep navigation/interaction conventional.

## 5. Design OS donor process vs Pauli Brand Studio scope
**Source A:** Design OS is a planning/design tool that exports implementation packages; its own `agents.md` explicitly says it is not the end-product codebase.

**Source B:** Pauli Brand Studio must be an operating design office that produces brand intelligence/assets and exposes human + agent interfaces.

**Resolution:** reuse compatible MIT patterns/components selectively. Do not make the donor's product-planning flow the studio architecture. Pauli ICM/manifests/guardians remain authoritative.

## 6. Cloud convenience vs USB portability
**Source A:** Vercel/Supabase/Popebot provide useful cloud runtime and collaboration.

**Source B:** owner requires the intelligence to remain portable, privately runnable, and transferable through Hermes USB/local agents.

**Resolution:** cloud is an adapter/runtime. Portable intelligence packs contain the project router, contracts, manifest, decisions, receipts, provenance, and selected offline assets; secrets remain external.
