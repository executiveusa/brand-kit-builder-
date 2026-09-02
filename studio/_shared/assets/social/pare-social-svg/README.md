# PARÉ Social SVG Library

Canonical shared vector reference library for agents working inside `brand-kit-builder-`.

## Files

- `square-sprite.svg` — square social-logo sheet exposed as named SVG symbols.
- `circle-sprite.svg` — circular social-logo sheet exposed as named SVG symbols.
- `manifest.json` — machine-readable provenance, symbol names, vector proof, and rights state.

## Available symbol IDs

`facebook`, `x`, `instagram`, `youtube`, `dribbble`, `pinterest`, `linkedin`, `snapchat`, `twitch`, `tiktok`, `whatsapp`, `reddit`

## Agent usage

For HTML/SVG surfaces, reference a symbol directly:

```html
<svg viewBox="0 0 480 480" aria-label="Instagram">
  <use href="/path/to/square-sprite.svg#instagram"></use>
</svg>
```

For generated brand mockups, social layouts, brand books, and interface prototypes, prefer these vector symbols over raster screenshots or improvised logo redraws.

## Production rules

1. These files are real SVG geometry. Do not rasterize the canonical source.
2. Do not claim PARÉ ownership of third-party platform marks.
3. Platform trademarks must follow the platform's current trademark/brand rules.
4. The supplied source packs had mixed/partial licensing evidence. Treat these assets as **reference/internal-use assets until rights are verified for the specific client/output**.
5. Agents must never silently convert an `unverified` rights state to `approved`.
6. If a client deliverable redistributes these marks as standalone assets, route through the rights/provenance gate first.

## Source conversion proof

The source files were converted from EPS to vector PDF to SVG and checked for embedded raster images. The resulting vector proof recorded `embedded_raster_images: 0`.

## ICM placement

This library lives under `_shared` because it is reusable execution/reference intelligence. It is not canonical truth for any individual client brand. Client-specific approved usage belongs in that client's `20_design` / `40_deliver` records with provenance attached.
