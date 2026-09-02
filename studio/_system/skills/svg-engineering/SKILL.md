# SVG Engineering Skill

Purpose: convert an approved identity direction into production-grade vector masters and reject AI/raster/vector slop before an identity can become Official.

## Inputs
- approved strategy/brand manifest;
- approved identity direction or source logo;
- protected geometry/letterforms;
- intended applications and minimum sizes;
- provenance/rights records;
- DARYA type reference when a wordmark uses live typography.

## Rule zero
A generated raster image, traced bitmap or attractive concept is not a production logo master by itself.

## Required gate
1. **Strategy fit** — mark expresses the approved governing idea rather than a generic category symbol.
2. **Originality** — compare against references/competitors; record imitation risk.
3. **Geometry** — remove accidental points, overlaps, gaps and broken contours.
4. **Path economy** — simplify without changing intended form; no giant trace noise.
5. **Optical correction** — balance weight, alignment, negative space and perceived centering.
6. **Wordmark spacing** — inspect kerning, punctuation, accents and language-specific characters.
7. **Monochrome** — master remains recognizable in solid single color.
8. **Minimum size** — detail survives documented small-size use.
9. **Reversed** — define dark/light/reversed behavior without relying on effects.
10. **Accessibility/application contrast** — logo/background combinations are documented.
11. **Technical hygiene** — valid SVG; no raster payloads, remote resources, scripts, mystery fonts, unnecessary masks/filters, editor metadata or secret data.
12. **Provenance and rights** — source/contributor/generation record exists; trademark/legal clearance remains a human/legal decision.
13. **Independent critic** — creator cannot sign the final SVG gate.

## Expected package
- `logo-primary.svg`
- `logo-horizontal.svg` when needed
- `logo-stacked.svg` when needed
- `symbol.svg`
- `wordmark.svg`
- `logo-black.svg`
- `logo-white.svg`
- `favicon.svg`
- `app-icon.svg` when needed
- `social-avatar.svg`

Only include variants the brand actually needs.

## Technical checks
Reject:
- embedded base64 raster images;
- `<script>`;
- external URLs/resources;
- live font dependency in final distribution artwork unless explicitly required and licensed;
- malformed IDs/references;
- invisible junk paths;
- clipping/masking used only to hide tracing defects;
- filters/glows that are required for recognition;
- text converted to outlines before an editable source and font/license record exist.

## Status
- concept = Draft
- cleaned vector = Candidate
- gate passed with evidence = Verified
- human-approved canonical identity = Canonical
- canonical + validation + delivery package = Official
