# Stage 02 — Site Census

Version: 1.0.0

## Objective
Turn an approved public URL/site into bounded deterministic evidence before interpretation.

## Entry criteria
Registered URL source and source-access policy passed.

## Inputs
Normalized start URL, project scope, protected assets, optional repository reference.

## Required references
`../../_config/research-policy.yaml`, `../../shared/evidence-contract.md`.

## Allowed capabilities/tools
Safe browser/crawler, screenshot capture, DOM/meta/style extraction, repository read when separately authorized.

## Process
Validate target; discover sitemap/internal pages; select bounded representative pages; capture desktop/mobile; extract navigation, headings, CTAs, forms, colors, fonts, logo candidates, imagery, components, metadata and technical signals; separate observations from inferences.

## Outputs
`site-census.json`, page inventory, screenshot manifest, extracted-style inventory, errors/coverage notes, EvidenceRecords.

## Acceptance criteria
Every sampled page has URL/status/evidence; screenshots are hashed; private/link-local targets blocked; failures explicit; no one-page result represented as full-site coverage.

## Human decision gate
Only for authenticated/private targets or ambiguous ownership/access.

## Prohibited actions
Login bypass, unrestricted crawling, arbitrary downloads, source mutation, redesign.

## Failure/escalation
Access denied/robots/policy conflict → record inaccessible and route to Hermes; repeated browser error follows loop guard.

## Handoff target
Stages 03–06 and Brand DNA.

## Rollback
Remove census artifacts from failed run; retain audit/error event.
