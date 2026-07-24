# Change: safe-site-census

## Metadata

- **change-id:** safe-site-census
- **phase:** 05
- **ticket:** BKB-RESEARCH-001
- **risk-tier:** MEDIUM
- **status:** accepted
- **accepted-at:** 2026-07-24

## Context

The Brand Studio needs a safe URL/site analyzer that performs bounded crawling, sitemap discovery, content extraction, and evidence recording. The module must enforce SSRF protection, private IP blocking, localhost blocking, redirect validation, request timeouts, size limits, and rate limiting.

## Proposal

Create `src/research/site-census.mjs` — a Node.js-only research module that the agent core uses to perform safe site census. Browser code never calls this module (browser remains network-free by design).

### Security features
- URL validation (http/https only, blocked ports, no internal TLDs)
- SSRF protection (private IP blocking via DNS resolution)
- Localhost blocking (localhost, .local, .internal)
- Redirect validation (max 3 redirects, each validated)
- Request timeout (10s)
- Response size limit (5MB)
- Rate limiting (500ms between requests)
- Bounded concurrency (3 concurrent requests max)
- Bounded crawl (25 pages max, depth 3 max)

### Extraction capabilities
- robots.txt parsing (sitemap discovery)
- XML sitemap parsing
- Page URL extraction (anchor links)
- Color extraction (hex and rgb/rgba)
- Font family extraction
- Title and meta description extraction
- Heading extraction (H1-H6)
- Logo candidate detection (img and SVG)
- Technical metadata (framework hints, viewport, responsive CSS)
- Evidence record generation per page

## Scope

- `src/research/site-census.mjs` — NEW: 300+ line safe site census module
- `tests/site-census.test.mjs` — NEW: 32 tests

## Acceptance criteria

- [x] SSRF protection (private IP blocking)
- [x] Localhost blocking
- [x] Blocked ports (SSH, MySQL, Redis, etc.)
- [x] Bounded crawl (25 pages max)
- [x] Rate limiting (500ms)
- [x] Request timeout (10s)
- [x] Response size limit (5MB)
- [x] Redirect validation (max 3, each validated)
- [x] Sitemap discovery from robots.txt
- [x] XML sitemap parsing
- [x] Color/font/title/description/heading extraction
- [x] Logo candidate detection
- [x] Technical metadata extraction
- [x] Evidence records produced per page
- [x] `npm run check` passes
- [x] `npm test` passes (183 tests, 181 pass, 2 skipped, 0 fail)
