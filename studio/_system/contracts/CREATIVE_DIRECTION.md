# PARÉ Creative Direction Contract v1

Purpose: convert approved strategy into an ownable, behaviorally coherent, commercially useful design direction before identity execution. This contract implements exactly five required layers and keeps them inside existing ICM stages.

## Non-negotiable sequence

`positioning → 1 governing idea → 2 distinctiveness test → human territory selection → identity → 3 brand behavior grammar → 4 application stress test → 5 commercial desirability → validation`

The five layers are not optional on `creative-direction.v1` or `brand-kit.v1` work that creates or materially changes a brand identity.

## 1. Governing Idea Gate

Owner: `10_strategy`.

Required artifact: `10_strategy/governing-idea.json`.

Must contain:
- `statement` — one memorable central idea;
- `tension` — the contradiction/opportunity the idea resolves;
- `audience_truth` — sourced or explicitly labeled hypothesis;
- `cultural_truth` — sourced or explicitly labeled hypothesis;
- `business_truth` — real commercial constraint/opportunity;
- `must_feel[]`;
- `must_not_feel[]`;
- `proof[]` — source/evidence pointers.

Pass: governing idea score >= 9.0 and no unsupported factual claim presented as fact.

Hard fail: styling begins before this artifact exists; multiple unrelated governing ideas; model/technology jargon substitutes for customer meaning.

## 2. Distinctiveness Test

Owner: `10_strategy` for territories; repeated in `30_validate` for the selected design.

Required artifact: `10_strategy/distinctiveness-test.json`.

Questions:
1. If the logo is removed, can the intended brand still be recognized from the system?
2. Could a direct competitor plausibly use the same territory unchanged?
3. Is the territory merely fashionable/trend-dependent?
4. Is the idea ownable enough to guide multiple applications?
5. Is there a recognizable behavior or element doing memorable work?

Allowed verdicts: `OWNABLE`, `DERIVATIVE`, `GENERIC`, `TREND_DEPENDENT`, `CATEGORY_COPY`.

Pass: `OWNABLE` only, distinctiveness score >= 9.0, with evidence/rationale. Any other verdict routes back to strategy.

## Human territory selection

After three bounded territories and their distinctiveness tests exist, an authorized human selects one territory before identity production. This is a canonical brand decision. No builder may self-select and self-approve.

## 3. Brand Behavior Grammar

Owner: `20_design`.

Required artifact: `20_design/brand-behavior.json`.

Define repeatable behavior, not decorative examples:
- motion: tempo, entrance/reveal, easing, reduced-motion fallback;
- layout: density, asymmetry, whitespace, grid behavior;
- typography: display/body behavior, emphasis rules, scale limits;
- imagery: subject, framing, treatment, provenance constraints;
- UI: shape/card/border/gradient rules, interaction feedback, state behavior;
- expression controls: what stays restrained vs what may become expressive.

Every rule must include `why`, `use_when`, and `avoid_when`. References are lenses, never styles to copy.

Pass: system-coherence score >= 9.0 and accessibility/reduced-motion requirements remain intact.

## 4. Application Stress Test

Owner: `20_design`, independently checked in `30_validate`.

Required artifact: `20_design/application-stress-test.json` plus proof pointers to renderings.

Default test surfaces:
- mobile homepage;
- desktop homepage;
- social post;
- one-page PDF/document;
- email/header context;
- favicon/avatar/small mark;
- presentation cover;
- merch/product or relevant physical/digital equivalent;
- light environment;
- dark environment;
- small-size identity;
- large-format typography.

A project may mark a surface `not_applicable` only with a reason and replacement stress surface where useful.

Pass requires:
- recognizability across applicable surfaces;
- no break in hierarchy, legibility, accessibility or brand behavior;
- no single mockup is treated as proof of a system;
- responsive score >= 9.0 for primary digital surfaces.

## 5. Commercial Desirability Judge

Owner: independent critic in `30_validate`; strategist may preflight in `10_strategy`.

Required artifact: `30_validate/commercial-desirability.json`.

Judge:
- perceived value;
- offer comprehension;
- price-position fit;
- desire/interest created without deception;
- memorable reason to choose;
- category/market-position communication;
- CTA/next-action coherence where a conversion surface exists.

Pass: commercial desirability >= 9.0 for commercial projects. For nonprofit/public-interest projects, use the same test against the intended action (donate, join, apply, attend, volunteer, trust) rather than purchase.

Taste cannot average away commercial failure. Commercial effectiveness cannot excuse accessibility, rights, provenance or truth failures.

## Reference council lenses

Use selectively and only as principles:
- COLLINS — governing idea, transformation, world-building;
- Pentagram — concept, reduction, typography, longevity;
- Koto — digital behavior, adaptable identity systems, motion;
- PORTO ROCHA — editorial composition, typography, art direction;
- Red Antler — positioning, desirability, launch/commercial clarity;
- Further / DesignStudio lineage — brand-to-product/system transformation.

Never copy a studio's visual style, layout, assets, wording or proprietary work. Learn WHY a decision works, WHEN it applies, HOW to judge it, and WHEN not to use it.

## Anti-bloat law

Before promoting any external design principle into shared PARÉ intelligence, apply `subtraction`:
1. Does an existing principle already express it?
2. Is it a durable principle rather than an example/trend?
3. Does it change an agent decision?
4. Can it be evaluated?
5. Can we state when not to use it?
6. Does it retain provenance?
7. Is it durable beyond the current trend?

If 3, 4, 5, or 7 fail, do not promote it.

## Repair and proof

Each failed layer returns one bounded repair packet to its owning stage containing: failed criterion, evidence, single biggest gap, protected items, and proof required. Critics never silently rewrite creator work. After three failed repair cycles, follow ICM escalation law.
