# Font-Finding Skill

Owner: Creative District (Darya Designs / Synthia Superdesign), served through PARÉ.
When: every project's Visual World definition step, and the font gate of every brand-kit build (`studio/FONTS.md`).

## Law

1. Typography is derived from the project's own visual world (owner's DESIGN-LAW). The type must come from the brand's audience truth, cultural truth and governing idea — never from habit.
2. Never default to Inter, Geist, Space Grotesk, or any "safe" starter font. Their presence in a source collection is not an argument. If one is proposed, the decision ledger must record why this project's world demands it.
3. Corleone + Corleone Due are the standing Pauli type standard (owner ruling 2026-09-16: "THIS BECOMES THE STANDARD ACROSS all pauli stuff"). Pauli-family brands start from Corleone; any departure is an owner decision, recorded.
4. Maximum 2 font families per brand kit: a display face for headlines + a sans or serif for body (DARYA registry rule). An accent (script/mono) is allowed only when the visual world calls for it.
5. "Free" is not a license. Before any font is bundled, shipped, or claimed for commercial use, read back the current original license from the owner or distributor and record it (FONTS.md gate). Catalog status `free-license-text-found` is a harvest-day observation, not a permanent right.

## Sources, in order

1. `studio/_shared/design-systems/type/awwwards-free-fonts.catalog.json` — 287 typefaces harvested from the owner-specified Awwwards free-fonts collection (2026-09-23), queryable by category, tag, designer and license status. Human form: `AWWWARDS_FREE_FONTS_CATALOG.md`.
2. `studio/_shared/design-systems/type/DARYA_FONT_REGISTRY.md` — the curated high-fashion registry (personality, pairing, weights) for premium directions; note its fonts are rights-gated and mostly commercial-license.
3. The second owner-specified Awwwards source: https://www.awwwards.com/best-free-fonts.html (mixed fully-free / personal-only / trials / demos — read each license).
4. Owner-supplied font files (like corleone.zip) outrank every source.

## Process

1. **Read the visual world.** Pull the project's governing idea, audience, cultural references, and any owner type rulings (Corleone scope, per-brand overrides). No type work before this exists.
2. **Define the type job.** Roles needed (display / body / UI / caption / price-SKU mono), sizes and surfaces (mobile-first, social avatars, 16px favicon-adjacent), languages and diacritics (Spanish required for MX brands).
3. **Shortlist 3-5 candidates per role** from the catalog by category/tag/personality, excluding `personal-use-only` and `demo-or-trial-flag` for any commercial work. Prefer faces with real weight ranges or variable axes for responsive polish.
4. **Test in context, not in a specimen.** Render the actual headline, body, price and CTA in the project's layout at mobile and desktop sizes. Check Spanish diacritics (á é í ó ú ñ ü ¿ ¡) render in-font.
5. **License read-back.** Open each finalist's `source_url`, read the current license, record the quote + URL + date in the decision ledger. Personal-use or unclear → out, or escalated to the owner for purchase decision. This step is mandatory even for `free-license-text-found` entries.
6. **Present max 2 pairings** to the owner with rendered proof (display, body, caption, avatar, favicon sizes) and the license evidence. Owner picks; builder does not approve its own selection.
7. **Record the decision** in the project's decision ledger and brand manifest (`20_design/brand-behavior.json` typography section), including `why`, `use_when`, `avoid_when` per the Brand Behavior Grammar layer.

## Pairing judgment

- Display serif + neutral sans: editorial, premium, botanical, heritage brands.
- Geometric/humanist sans + same-family weights: tech, utilitarian, price-forward retail.
- Script/brush accent: only for handmade, organic or signature moments (badges, thank-you cards) — never body text.
- Condensed/mono accents: SKUs, prices, data, wholesale tables.
- Check the DARYA registry `pairing_recommendations` when a registry face is in play.

## What this skill never does

- Bundle or redistribute font files without a recorded license read-back.
- Exceed 2 families per kit without an owner-recorded exception.
- Skip the rendered-proof step because a font "looked right" in the catalog.
- Treat Awwwards collection membership as proof of commercial-use rights.

## Worked example — Tila (air plants, MX wholesale, botanical)

Verified-license picks from the 2026-09-23 harvest:
- Headlines: **Rude** (handcrafted serif, organic/artisanal) or **Spectral** (screen-first serif, 7 weights, full diacritics).
- Body/UI: **Satoshi** (variable, mobile-legible, ITF Free) or **Ranade** (warm humanist, ITF Free).
- Accent: **Arkipelago** (wet ink brush script) for care-card/handwritten moments only.
- Prices/SKUs: **Heming** (variable monotype) where a mono voice helps wholesale tables.
All four families carried harvest-day free-license text; re-verify at source before production, per the gate.
