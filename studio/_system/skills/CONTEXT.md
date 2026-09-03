# Design Factory Skills Router

Load only the skills required by the current ICM stage or work order.

| Stage / need | Required skill |
|---|---|
| `00_intake` discovery | `brand-discovery/SKILL.md` |
| governing idea / territories / distinctiveness | `creative-direction/SKILL.md` + `collins-level/SKILL.md` as judgment lens |
| brand/search/entity/content architecture | `seo/SKILL.md` |
| brand behavior / application stress test | `creative-direction/SKILL.md` |
| production logo/vector masters | `svg-engineering/SKILL.md` |
| public-facing prose cleanup after voice truth exists | `humanize/SKILL.md` |
| substantial implementation before adding code/dependencies | `subtraction/SKILL.md` |
| substantial implementation acceptance/evidence ledger | `completion-gates/SKILL.md` |
| commercial desirability validation | `creative-direction/SKILL.md` in independent critic mode |
| any design release candidate | `design-guardian/SKILL.md` |
| independent validation | `gauntlet/SKILL.md` |
| proof / release evidence | `design-proof/SKILL.md` |
| packaging / handoff | `design-delivery/SKILL.md` |

## Common stage routing
- `00_intake`: `brand-discovery`; load `completion-gates` for substantial work.
- `10_strategy`: `brand-discovery`; for new identity/material rebrand load `creative-direction` and use `collins-level` selectively for governing idea and territory judgment; load `seo` only when discoverability/content architecture is in scope.
- `20_design`: for new identity/material rebrand load `creative-direction` for brand behavior + stress test; add `collins-level` only when creative-direction judgment is required; add `svg-engineering` only for vector identity work; add creator-specific tools only as needed.
- `30_validate`: independent commercial desirability where applicable → `design-guardian` → `gauntlet` → `design-proof`.
- `40_deliver`: `design-delivery`; `seo` for developer/content handoff where applicable.
- `50_publish`: publishing adapter contract only after required approval; social content may use `humanize` before approval.
- engineering/interface changes: `subtraction` + `completion-gates` before introducing new implementation.

## Five-layer law
For `creative-direction.v1`, do not skip or reorder:
1. Governing Idea Gate.
2. Distinctiveness Test.
3. Human territory selection (approval boundary, not a skill).
4. Brand Behavior Grammar.
5. Application Stress Test.
6. Commercial Desirability Judge.

The numbered design layers are governing idea, distinctiveness, brand behavior, application stress testing, and commercial desirability. Human territory selection sits between layer 2 and layer 3 and is mandatory.

## Laws
- Skills do not own canonical brand truth. Approved ICM files and manifests do.
- A skill may guide judgment but may not bypass stage read/write scope.
- Builders cannot approve their own output or territory selection.
- Only an `OWNABLE` territory may advance to identity production.
- Failed validation returns a bounded repair packet to the owning stage.
- Do not preload every skill. Use the smallest sufficient context packet.
- External studio references are principle lenses only; never copy their visual work, assets, layouts or wording.
- SEO measurements require real source/tool evidence; strategic hypotheses must stay labeled hypotheses.
- Humanization may change wording, not evidence.
- SVG concepts do not become Official until vector/provenance/independent-review gates pass.
