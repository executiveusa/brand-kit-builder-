# Social SVG asset intake

PARÉ may ingest third-party platform logo collections for mockups, social layouts, previews, and client brand systems, but third-party marks never become Pauli-owned brand IP.

## Required format

Production social assets must be true SVG vectors:

- SVG paths/shapes only; no embedded raster images.
- No `data:image` payloads.
- Preserve a viewBox.
- Keep source provenance and license state next to the asset set.
- Store platform marks separately from client-owned logos and identity assets.

## Current intake — 2026-09-02

Three user-supplied ZIP archives were inspected and converted locally from EPS to SVG using a vector-only pipeline:

`EPS -> PDF (Ghostscript) -> SVG (pdftocairo) -> optimized SVG (Scour)`

Vector verification found SVG paths/shapes and zero embedded raster image references.

The generated handoff pack contains 27 SVG files:

- 3 complete vector sheets.
- 12 individual square social-mark SVG views.
- 12 individual circle social-mark SVG views.

## Rights boundary

The legacy `social-media-logotype-collection` archive includes Freepik license text. The supplied free-user terms require attribution to `saragnzalez / Freepik`; the premium-user text refers to a personalized license. Both supplied texts restrict sublicensing/reselling or including the source content in an archive/database.

The two newer `new X logo` archives contained EPS/JPG files but no license text in the supplied ZIPs. Their redistribution rights are therefore **unverified**.

Because this repository may be publicly accessible, the supplied third-party vector artwork is not committed here until its redistribution/license status is verified. Keep the generated asset pack in the owner-controlled asset store or client runtime and reference it from project provenance.

## Trademark law

Facebook, X, Instagram, YouTube, LinkedIn, TikTok, WhatsApp, Reddit and other platform marks remain third-party trademarks. Use them only as platform identifiers and follow the current brand/trademark rules of the relevant platform.

## PARÉ rule

A client project can reference these marks in `brand-manifest.json` or an application manifest, but PARÉ must never list them as client-owned identity assets or claim exclusive rights to them.
