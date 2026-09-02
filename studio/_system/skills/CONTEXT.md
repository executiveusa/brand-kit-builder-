# Design Factory Skills Router

Load only the skills required by the current ICM stage or work order.

| Stage / need | Required skill |
|---|---|
| `00_intake` discovery | `brand-discovery/SKILL.md` |
| strategy or creative direction | `collins-level/SKILL.md` |
| brand/search/entity/content architecture | `seo/SKILL.md` |
| production logo/vector masters | `svg-engineering/SKILL.md` |
| public-facing prose cleanup after voice truth exists | `humanize/SKILL.md` |
| substantial implementation before adding code/dependencies | `subtraction/SKILL.md` |
| substantial implementation acceptance/evidence ledger | `completion-gates/SKILL.md` |
| any design release candidate | `design-guardian/SKILL.md` |
| independent validation | `gauntlet/SKILL.md` |
| proof / release evidence | `design-proof/SKILL.md` |
| packaging / handoff | `design-delivery/SKILL.md` |

## Common stage routing
- `00_intake`: `brand-discovery`; load `completion-gates` for substantial work.
- `10_strategy`: `brand-discovery` + `collins-level`; load `seo` when the project has a discoverability/content surface.
- `20_design`: `collins-level`; add `svg-engineering` only for vector identity work; add creator-specific tools only as needed.
- `30_validate`: `design-guardian` → `gauntlet` → `design-proof`.
- `40_deliver`: `design-delivery`; `seo` for developer/content handoff where applicable.
- `50_publish`: publishing adapter contract only after required approval; social content may use `humanize` before approval.
- engineering/interface changes: `subtraction` + `completion-gates` before introducing new implementation.

## Laws
- Skills do not own canonical brand truth. Approved ICM files and manifests do.
- A skill may guide judgment but may not bypass stage read/write scope.
- Builders cannot approve their own output.
- Failed validation returns a bounded repair packet to the owning stage.
- Do not preload every skill. Use the smallest sufficient context packet.
- SEO measurements require real source/tool evidence; strategic hypotheses must stay labeled hypotheses.
- Humanization may change wording, not evidence.
- SVG concepts do not become Official until vector/provenance/independent-review gates pass.
