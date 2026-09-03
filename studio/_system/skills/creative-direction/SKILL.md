# Creative Direction Skill

Purpose: execute the five governed creative-direction layers defined in `studio/_system/contracts/CREATIVE_DIRECTION.md` without creating a second source of truth.

## Load rule

Load only for new identity creation, material rebrand, or a work order explicitly requiring creative-direction evaluation. Do not preload it for routine delivery, publishing, copy cleanup, or implementation-only work.

## Required sequence

1. Governing Idea Gate — `10_strategy/governing-idea.json`
2. Distinctiveness Test — `10_strategy/distinctiveness-test.json`
3. Human territory selection — recorded approval before identity production
4. Brand Behavior Grammar — `20_design/brand-behavior.json`
5. Application Stress Test — `20_design/application-stress-test.json`
6. Commercial Desirability Judge — independent result in `30_validate/commercial-desirability.json`

The five named layers are 1, 2, 4, 5, and 6 above; human territory selection is the mandatory approval boundary between strategy and identity.

## Method

- Start from approved intake, positioning, constraints and provenance.
- Use external studios only as reference lenses for principles; never copy their visual style, wording, layouts or assets.
- Produce three bounded territories from one governing idea, not three unrelated brands.
- Run the distinctiveness test on every territory.
- Stop for authorized human territory selection.
- Build behavior rules before polishing applications.
- Stress-test the selected system across representative real surfaces.
- Send the release candidate to an independent commercial desirability critic.
- On failure, return one bounded repair packet to the owning stage; critics do not silently rewrite creator work.

## Hard bans

- styling before governing idea;
- self-approval by the builder;
- `GENERIC`, `DERIVATIVE`, `TREND_DEPENDENT` or `CATEGORY_COPY` territories advancing;
- one mockup treated as proof of a design system;
- commercial scores inferred from taste alone;
- invented customer research, conversion data, search data or cultural claims;
- weakening accessibility, reduced-motion, rights, provenance, rollback or owner control;
- copying reference-studio creative work.

## Pass bar

Validate the canonical creative-direction record against `studio/_system/schemas/creative-direction.v1.json`. All hard thresholds are 9.0 or higher and distinctiveness must be `OWNABLE`. Rights/provenance remain 10/10 release blockers under `DESIGN_STANDARD.json`.

## Output

Return only:
- artifact pointers;
- scores/verdicts;
- evidence/proof pointers;
- approval state;
- single biggest gap if failed;
- owning stage for repair;
- next handoff.
