# Product specification — Brand Kit Builder

## Objective

Create an internal brand studio that can start with no assets, a URL, repository, logo, image, uploaded documents, or any combination of these inputs and produce a complete, source-traceable brand system.

## Primary users

- Pauli Effect studio operators
- Approved client-facing project managers
- Design, voice, image, web, and handoff agents
- Human reviewers responsible for rights, claims, and release approval

## Primary workflow

1. Create a project.
2. Choose input mode: idea, URL, repository, logo, image, documents, or mixed.
3. Inspect all available sources and create a source ledger.
4. Run the relentless discovery interview one question at a time.
5. Score the 20-axis prebuild readiness gate.
6. Generate brand strategy after the score reaches 8.5.
7. Generate and validate the brand voice system.
8. Define three genuinely distinct visual territories.
9. Approve one direction.
10. Generate the visual identity and image system.
11. Render the KAKU-structured brand book.
12. Run Brand, Design, Voice, and Rights Guardian reviews.
13. Export HTML, PDF, tokens, asset manifests, prompts, and handoff files.
14. Optionally open a GitHub pull request or publish an approved preview.

## Input adapters

- Blank business idea
- Live URL
- GitHub repository
- Logo file
- Single image or mood reference
- Documents and ZIP archives
- Existing brand kit
- Mixed intake

## Required core modules

### Project workspace

Stores scope, owner, status, input mode, languages, target market, and approval authority.

### Source forensics

Tracks filenames, URLs, repository SHAs, pages/files inspected, licenses, trust level, conflicts, and applicable rules.

### Discovery interview

Asks one precise question at a time, detects contradictions, records confidence, and stops only when the prebuild gate passes.

### Readiness gate

Scores 20 axes from source completeness through contradiction resolution. No generation starts below 8.5 or with a critical axis below 8.0.

### Strategy engine

Produces positioning, promise, reasons to believe, values, message hierarchy, proof ledger, creative rationale, and three distinct visual territories.

### Voice engine

Produces identity, audience, offers, voice axes, prohibited language, real phrases, true stories, proof, content pillars, platform rules, localization, claim controls, examples, and tests.

### Visual studio

Produces logo behavior, typography, color, imagery, illustration, icons, patterns, textures, layout, motion, applications, and design tokens.

### KAKU brand-book renderer

Preserves the 13-part KAKU sequence and adds digital annexes for strategy, voice, imagery, icons, motion, accessibility, components, governance, and handoff.

### Guardian review

Independent Brand, Design, Voice, and Rights reviews file findings and block release when required.

### Export and handoff

Generates HTML, PDF, JSON, CSS tokens, asset manifests, prompt libraries, component specifications, acceptance matrices, and GitHub handoffs.

## Hard constraints

- No fabricated evidence
- No unlicensed assets or fonts
- No logo mutation without explicit approval
- No emojis as UI icons
- No production action without approval
- No final output without source ledger and rights review
- No release below 8.5
