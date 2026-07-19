# One-shot build prompt — Pauli Production Brand Studio

Status: EXECUTION PROMPT
Purpose: close the remaining product gaps without discarding the working Brand Kit Builder architecture or colliding with concurrent work.

---

## ROLE

You are the principal product architect, brand-systems engineer, production designer, and integration lead for **Pauli Brand Studio / Brand Kit Builder**.

Your job is not to generate a prettier demo. Your job is to evolve the existing repository into one governed production system that can be used in two equally important ways:

1. **Human design studio** — a professional visual workspace a designer or studio operator can use directly.
2. **Agent-callable studio capability** — a deterministic, guarded capability that other Pauli Studio agents can invoke through CLI, MCP, SDK, and an authenticated HTTP API.

Both entry points MUST use the same project model, state machine, gates, artifact contracts, provenance, and export engine.

Do not build separate “human” and “AI” products that drift apart.

---

# PRIME DIRECTIVES

1. **Verify It Before Everything.**
2. **Reuse before rebuild.** Extend existing core, schemas, CLI, MCP, Studio, Guardians, KAKU renderer, export, source ledger, and approval gates.
3. **KAKU controls delivery structure, not visual style.** Never make every client look like KAKU.
4. **Production assets must be real assets.** A raster image wrapped in SVG is not a vector logo.
5. **One engine, multiple adapters.** Studio UI, CLI, MCP, SDK, and HTTP API must call shared use cases rather than implement duplicate business logic.
6. **Human approval stays human.** Never create an API/MCP shortcut that can self-approve export, rights, destructive asset mutation, or public release.
7. **Do not overwrite concurrent work.** Inspect current main, branches, commits, PRs, and changed files before every implementation phase.
8. **Do not perform a broad rewrite merely to match the aspirational architecture document.** Migrate incrementally behind compatibility boundaries.
9. **Complete and verify one ticket before starting the next.** This is a one-shot orchestration prompt, not permission for an unbounded diff.
10. **No public deployment in this run unless separately and explicitly approved.**

---

# PHASE 0 — RECONCILE CURRENT REALITY BEFORE WRITING CODE

Before modifying anything:

1. Read `AGENTS.md`.
2. Read all modules referenced by `docs/PAULI_BRAND_STUDIO_MASTER_SYSTEM_PROMPT_INDEX.md`.
3. Read `docs/PRODUCT_SPEC.md`, `docs/ARCHITECTURE.md`, `docs/AGENT_API.md`, `docs/SECURITY.md`, `docs/INTERNAL_AGENT_QUICKSTART.md`, and `skills/brand-kit-builder-agent/SKILL.md`.
4. Inspect the last 10 commits, open PRs, open issues, current branch, CI, package manager, test suite, and repository tree.
5. Detect work created by another active instance. Do not duplicate or revert it. Prefer integration or additive compatibility.
6. Run the current validation/test suite before edits and record the baseline.
7. Create an evidence-backed gap matrix with these columns:
   - capability
   - promised/documented
   - implemented
   - tested
   - human-usable
   - agent-callable
   - production-ready
   - gap
   - smallest safe ticket

Do not trust README claims that are not supported by code and tests.

Known areas that MUST be explicitly verified rather than assumed complete:

- package/app version consistency;
- current stage/output contract consistency;
- source adapters;
- discovery workflow;
- vector logo production;
- logo variant export;
- brand-book visual composition quality;
- PDF rendering and page-by-page QA;
- image/mockup generation adapters;
- HTTP API;
- remote/multi-agent invocation;
- human project persistence beyond local demo state;
- file/object storage abstraction;
- provider/model adapter boundaries;
- screenshot/browser QA;
- export package completeness versus documented output tree;
- GitHub/design-tool handoff adapters;
- approval authority naming and governance consistency.

### Stop condition

If concurrent changes touch the same core files required by the next ticket, do not overwrite them. Produce a reconciliation note and move to a non-conflicting ticket or wait for the conflicting branch to merge.

---

# TARGET ARCHITECTURE — ONE BRAND ENGINE, MULTIPLE SURFACES

Evolve toward this architecture incrementally:

```text
                         ┌─────────────────────┐
                         │   Human Studio UI   │
                         │ visual + guided UX  │
                         └──────────┬──────────┘
                                    │
┌──────────────┐  ┌──────────────┐ │ ┌──────────────┐  ┌──────────────┐
│ JSON CLI     │  │ MCP / Agents │─┼─│ JS/TS SDK    │  │ HTTP API     │
└──────┬───────┘  └──────┬───────┘ │ └──────┬───────┘  └──────┬───────┘
       └──────────────────┴─────────┼─────────┴─────────────────┘
                                    ▼
                     ┌──────────────────────────┐
                     │ Shared application/core  │
                     │ use cases + state machine│
                     └─────────────┬────────────┘
                                   ▼
        ┌─────────────────────────────────────────────────┐
        │ Projects · Sources · Decisions · Assets · Jobs  │
        │ Approvals · Provenance · Guardians · Exports    │
        └─────────────────────────────────────────────────┘
```

Rules:

- No adapter may own business rules that other adapters need.
- Approval logic lives below all adapters.
- HTTP does not replace CLI/MCP; it adds a remote/server-safe entry point.
- Browser UI never receives provider secrets.
- Provider integrations are adapters, not hard-coded into UI components.

---

# TICKET GROUP A — CANONICAL CAPABILITY CONTRACT

Create one machine-readable capability contract used by Studio, CLI, MCP, SDK, and HTTP.

Minimum capability groups:

```text
projects
sources
readiness
strategy
voice
visual
logo-production
asset-production
brandbook
guardians
validation
exports
approvals-readonly
jobs
```

Each capability declares:

- id and version;
- availability;
- required inputs;
- output schema;
- whether it mutates state;
- whether it requires a work order;
- whether it requires human approval;
- cost class;
- provider requirements;
- supported artifact types.

Add contract tests proving all adapters expose the same supported core capabilities.

Do not create fake “available” capabilities backed only by placeholder UI.

---

# TICKET GROUP B — AUTHENTICATED HTTP API

Add a server-side HTTP API adapter over the shared engine.

The first version may be local/self-hosted, but must be designed so Pauli Studio agents can invoke it as a service later.

Minimum endpoints or equivalent typed RPC operations:

```text
GET    /v1/capabilities
POST   /v1/projects
GET    /v1/projects/:projectId
POST   /v1/projects/:projectId/validate
POST   /v1/projects/:projectId/stages/:stage/run
POST   /v1/projects/:projectId/stages/:stage/complete
GET    /v1/projects/:projectId/assets
POST   /v1/projects/:projectId/logo/jobs
GET    /v1/jobs/:jobId
POST   /v1/projects/:projectId/brandbook/render
GET    /v1/projects/:projectId/exports
```

Required API behavior:

- versioned schemas;
- stable error codes consistent with CLI/MCP where possible;
- idempotency keys for mutation;
- request IDs;
- bounded payload/file handling;
- rate/cost guards;
- no secrets in request bodies or logs;
- server-side auth adapter with local-dev mode and production-safe mode;
- audit record of caller, operation, project, timestamp, input hashes, output hashes, and result;
- no endpoint that creates owner approval;
- no endpoint that silently publishes/deploys.

Add OpenAPI or equivalent machine-readable API specification and generated examples.

### Agent integration

Update the agent skill so other Pauli Studio agents may select the best available transport:

```text
same machine/workspace -> CLI or MCP
remote service -> authenticated HTTP API
application code -> SDK
human operator -> Studio UI
```

The agent must never bypass the engine by editing project JSON directly.

---

# TICKET GROUP C — PRODUCTION VECTOR IDENTITY ENGINE

This is a first-class capability, not a text field inside “visual system.”

Add a governed **Logo Production** workflow that supports:

1. preserve existing approved vector logo;
2. production-refine supplied raster or rough artwork;
3. approved redesign from strategy and visual territory;
4. create a new original identity from a blank brief.

## Required logo project model

Store:

- logo policy: preserve | refine | redesign | new;
- source asset references and rights status;
- master construction notes;
- symbol anatomy;
- wordmark/lettering construction;
- responsive variants;
- color variants;
- clear-space rule;
- minimum sizes;
- prohibited uses;
- trademark/legal review status as a human/legal flag;
- version and provenance;
- approval state.

## Required production artifacts

For a completed identity system, support relevant assets such as:

```text
assets/logos/
  master/
    logo-master.svg
  primary/
    logo-primary-color.svg
    logo-primary-black.svg
    logo-primary-white.svg
    logo-primary-light.svg
    logo-primary-dark.svg
  responsive/
    logo-horizontal.svg
    logo-vertical.svg
    logo-symbol.svg
    logo-wordmark.svg
    logo-favicon.svg
  raster/
    logo-512.png
    logo-1024.png
    logo-2048.png
  print/
    logo-print.pdf
    logo-print.eps        # only when a verified converter is available
  logo-manifest.json
  logo-usage.json
```

Do not require every project to use every variant. The manifest declares what applies.

## Vector production rules

A final production SVG MUST:

- contain a valid `viewBox`;
- contain no embedded raster `<image>` as the master mark;
- contain no remote/external assets;
- contain no script;
- contain no unapproved filters that make print reproduction dependent on browser effects;
- avoid required external fonts in final master logo assets; convert approved lettering to paths when legally permitted;
- use clean, intentional geometry and manageable path complexity;
- preserve transparency unless a background field is explicitly part of the identity;
- survive monochrome conversion;
- render on light and dark backgrounds;
- remain recognizable at the documented minimum size;
- record all source/provenance references.

An auto-trace may be used only as temporary scaffolding. **Auto-trace output is never automatically a production logo.**

## SVG QA validator

Implement deterministic validation that checks at minimum:

- XML/SVG parse;
- viewBox and dimensions;
- forbidden raster/image embedding;
- forbidden external URLs;
- script/event handler rejection;
- text/font dependency report;
- ID/reference integrity;
- clipping/mask/filter inventory;
- path/node complexity metrics;
- minimum-size preview render;
- monochrome preview render;
- light/dark preview render;
- transparent-background verification;
- file hash and manifest match.

Do not pretend geometry is “good design” merely because it passes syntax validation. Design Guardian still reviews optical quality, proportion, legibility, distinctiveness, and application behavior.

## Rendering/conversion adapters

Create provider-neutral/local adapters rather than hard dependencies:

- SVG optimization adapter;
- SVG -> PNG preview adapter;
- SVG -> PDF print adapter;
- optional SVG -> EPS adapter when a verified local converter such as Inkscape is installed;
- mockup renderer adapter.

Capability detection must report which converters are actually installed. Missing optional converters must produce an explicit blocked/omitted status, never a fake file.

---

# TICKET GROUP D — REAL DESIGN STUDIO FOR HUMANS

Keep the custom bilingual Studio usable without an agent.

The human workflow should feel like a professional design application, not an AI chat wrapper.

Required human surfaces:

```text
Projects
Sources
Discovery
Strategy
Voice
Visual direction
Logo Studio
Color + Typography
Imagery + Graphic language
Applications / Mockups
Brand Book
Guardian Review
Exports / Handoff
```

## Logo Studio minimum UX

Provide a visual workspace for:

- source/reference viewing;
- master logo preview;
- variant gallery;
- light/dark/background testing;
- size testing;
- clear-space overlay;
- monochrome preview;
- issue/annotation comments;
- version comparison;
- approve/revise decision recording.

Do not attempt to recreate Adobe Illustrator in-browser during the first implementation.

The clean division is:

- Studio manages project truth, previews, variants, review, annotations, tokens, approvals, and handoff;
- vector artwork may be produced by a capable human designer or an approved vector-generation/editing adapter;
- every produced asset returns through the same validator, provenance, Guardian, and approval gates.

This preserves professional design quality without turning the repo into an unmaintainable vector-editor project.

---

# TICKET GROUP E — KAKU-STRUCTURED PROFESSIONAL BRAND DELIVERY

KAKU is the **sequence and completeness benchmark**, not a template to copy.

Preserve the 13-part core sequence:

1. Cover / identity
2. Creative rationale
3. Master logo reveal
4. Symbol anatomy and meaning
5. Logo system and uses
6. Logo in context
7. Typography
8. Color behavior
9. Color palette and rationale
10. Primary business collateral
11. Relevant product/service/packaging/merchandise application
12. Website / digital application
13. Closing / ownership / version

Preserve digital annexes for strategy, voice, photography, graphic language, motion, templates, accessibility/localization, tokens/components, governance, and handoff.

## Upgrade the renderer

The current renderer must evolve from text-on-pages into a compositional brand-book renderer that can place actual approved assets and application evidence.

Each section schema must support structured content blocks such as:

```text
heading
body
quote
logo-asset
variant-grid
symbol-anatomy
color-swatch-grid
type-specimen
image
image-grid
mockup
application-frame
rules-table
do-dont
caption
source-note
credits
```

The renderer must:

- preserve the KAKU sequence;
- allow each client's own visual system to control composition;
- use actual approved logo/assets, not placeholder descriptions;
- show logo variants and usage rules visually;
- show real type specimens;
- show named palette values and accessible pairings;
- include relevant collateral/application mockups only;
- include a digital/web application frame;
- include version, ownership, source, and asset references;
- produce HTML as the primary review surface;
- produce print CSS;
- render PDF through an approved local/server adapter;
- visually verify every PDF page before marking PDF complete.

A brand book is not complete merely because 13 text sections are non-empty.

---

# TICKET GROUP F — ASSET / MOCKUP PRODUCTION CONTRACT

Add an asset-generation job contract usable by either humans or agents.

Every generated asset records:

- project ID;
- asset ID;
- asset type;
- source refs;
- governing visual direction/version;
- provider/tool/adapter;
- model/version when relevant;
- prompt or production spec version;
- seed when supported;
- timestamp;
- file hash;
- dimensions/media type;
- rights/provenance notes;
- approval state;
- parent/derived asset relationships.

Support adapter interfaces for:

- image generation;
- image editing;
- background removal when rights permit;
- mockup generation;
- browser screenshots;
- document/PDF rendering;
- optional Canva/Figma handoff later.

No provider-specific UI logic.

---

# TICKET GROUP G — STORAGE AND PROJECT PORTABILITY

Preserve the current filesystem/local-first mode.

Add abstractions so the same core can later use:

- filesystem storage;
- object/file storage;
- relational metadata store.

Do not force a database migration just to satisfy architecture aesthetics.

Required portability:

- export complete project bundle;
- import project bundle;
- include schema versions;
- include manifests and hashes;
- preserve approvals/provenance as immutable history;
- reject unsafe paths/symlinks/secrets;
- allow clients to receive and own their complete files.

---

# TICKET GROUP H — EXPORT PACKAGE MUST MATCH THE PRODUCT PROMISE

Reconcile all documented output contracts and implement one canonical export manifest.

A full engagement should be able to contain, when relevant:

```text
README.md
source-ledger.json
strategy/
voice/
visual/
assets/
  logos/
  icons/
  patterns/
  illustrations/
  photography/
  mockups/
  social/
brandbook/
  brandbook.html
  brandbook-print.css
  brandbook.pdf
product/
audit/
handoff/
package-manifest.json
```

Every file in the manifest must either:

- exist and have a verified hash; or
- be explicitly marked omitted with a machine-readable reason.

Never advertise PDF, EPS, images, or logo assets that were not actually produced and verified.

---

# TICKET GROUP I — GUARDIANS AND PRODUCTION QA EXPANSION

Keep the four Guardians independent.

Extend their required checks for production identity work.

### Brand Guardian

- strategic fit;
- distinctiveness;
- responsive logo hierarchy;
- coherent application system;
- brand-book completeness.

### Design Guardian

- optical logo construction;
- vector integrity report;
- small-size legibility;
- monochrome behavior;
- light/dark behavior;
- accessibility and contrast;
- type and layout quality;
- mockup realism;
- KAKU presentation quality;
- no generic AI slop.

### Voice Guardian

- authentic language;
- claims/proof;
- localization;
- brand-book copy quality;
- no generic AI filler.

### Rights Guardian

- source ownership;
- logo/artwork mutation authority;
- font licenses;
- icon/image/template licenses;
- generated-asset provenance;
- trademark/legal review flags;
- consent where people are used.

Add deterministic pre-Guardian checks where possible, but never replace human visual judgment with a numeric validator.

---

# TICKET GROUP J — PAULI STUDIO INVOCATION CONTRACT

Make Brand Kit Builder discoverable as a reusable studio capability.

Update/create:

- machine-readable capability manifest;
- agent skill documentation;
- MCP configuration example;
- HTTP invocation example;
- SDK example;
- one-shot project invocation example;
- studio registry/handoff instructions where the Pauli Studio control plane expects them.

Recommended invocation intent:

```yaml
capability: pauli-brand-studio
project_type: full_studio | logo_system | brand_kit | brand_voice | campaign_system
inputs:
  repository: ""
  urls: []
  files: []
  existing_brand_assets: []
outputs:
  logo_system: true
  brandbook: true
  design_tokens: true
  asset_package: true
  handoff: true
transport: auto
approval:
  human_required_for_release: true
```

Transport selection must be implementation detail, not part of the brand workflow.

---

# REQUIRED IMPLEMENTATION ORDER

Do not implement everything in one diff.

Execute in this order, completing verification before moving forward:

```text
0. current-state audit + gap matrix
1. canonical capability/artifact contracts
2. shared core boundary cleanup only where required
3. production logo model + SVG validator
4. logo job/use-case API in core
5. CLI + MCP exposure
6. authenticated HTTP API adapter
7. human Logo Studio preview/review workspace
8. KAKU structured block renderer
9. PDF/render adapter + visual QA contract
10. canonical export package reconciliation
11. Guardian expansion
12. Pauli Studio capability/skill integration
13. end-to-end reference project
```

Each numbered item becomes one or more exact tickets with:

- objective;
- files allowed;
- dependencies;
- acceptance criteria;
- verification commands;
- evidence;
- prohibited changes;
- rollback.

Commit each verified ticket independently.

---

# END-TO-END REFERENCE TEST

Use a clearly designated test/demo brand project with rights-safe assets.

The system must prove this complete path:

```text
human or agent creates project
→ sources registered and inspected
→ readiness passes
→ strategy/voice/visual direction approved
→ logo production job creates/imports real SVG assets
→ SVG validator passes deterministic checks
→ human reviews master + variants
→ design tokens and applications generated
→ KAKU brand book renders actual assets
→ HTML reviewed
→ PDF rendered and page-checked when renderer available
→ four Guardians pass
→ explicit human export approval
→ complete brand-kit ZIP exported
→ manifest hashes verify
→ another agent can read the exported kit through supported interfaces
```

The reference project must demonstrate:

- one full-color master SVG;
- one monochrome version;
- one reversed version;
- one responsive/symbol variant;
- small-size preview;
- typography;
- palette;
- one real business collateral application;
- one relevant product/service application;
- one digital application;
- KAKU sequence;
- complete manifest/provenance.

---

# ACCEPTANCE CRITERIA FOR “PRODUCTION BRAND STUDIO”

Do not call the product production-ready until all are true:

1. A human can create and complete a project through the Studio without manually editing JSON.
2. An agent can complete the same governed workflow through CLI/MCP/API without bypassing state rules.
3. All adapters call shared core use cases.
4. The system can ingest or produce real vector logo assets and validate them.
5. Final SVG masters contain no hidden raster substitute.
6. Logo variants are stored, versioned, previewed, and included in export manifests.
7. KAKU brand books render actual design assets rather than only text placeholders.
8. HTML review works locally.
9. PDF generation is either verified or explicitly reported unavailable—never faked.
10. Full exports reconcile exactly with their manifests and hashes.
11. Four Guardian reviews remain independent and blocking.
12. Human approval cannot be created by MCP/API/agent payload.
13. Source, rights, provenance, and claim gates remain intact.
14. English and Mexican Spanish Studio UX remains complete.
15. Existing CLI/MCP consumers remain compatible or receive a documented migration path.
16. `npm run ci` and all new contract/e2e tests pass.
17. No production deployment occurs without explicit approval.

---

# NON-GOALS

Do not:

- build a full Illustrator/Figma clone;
- claim autonomous trademark clearance;
- automatically approve a logo because validators pass;
- replace human design judgment with an image model;
- force a cloud/database rewrite before the local architecture needs it;
- add multiple overlapping icon/design libraries;
- create provider-specific UI code;
- expose provider secrets to the browser;
- create an MCP/API approval bypass;
- copy KAKU’s visual style or client artwork;
- redesign working Studio surfaces without evidence;
- publish or deploy automatically.

---

# KAKU DELIVERY PRINCIPLE

Use the KAKU example as proof of professional sequencing:

```text
why the identity exists
→ what the master mark is
→ what its parts mean
→ how the system adapts
→ how it behaves in context
→ typography
→ color
→ collateral
→ real application
→ digital application
→ ownership and handoff
```

The system should deliver that level of completeness for every client while letting every client’s own strategy determine the visual language.

---

# FINAL REPORT FORMAT

At the end of each session/run, output:

```yaml
status: working | blocked | approval_required | complete
current_phase:
tickets_completed: []
tickets_open: []
files_changed: []
tests_run: []
ci_status:
capabilities_proven: []
capabilities_still_placeholder: []
logo_pipeline_status:
api_status:
human_studio_status:
kaku_renderer_status:
export_status:
p0: 0
p1: 0
blockers: []
concurrent_work_conflicts: []
rollback_points: []
next_exact_ticket:
```

Never report “done” because code exists. Report capabilities only when verified by tests and evidence.

---

# START NOW

Begin with Phase 0 only:

1. reconcile the current repository and concurrent work;
2. run baseline validation/tests;
3. produce the gap matrix;
4. convert the implementation order into bounded tickets;
5. select the smallest non-conflicting first ticket;
6. implement, verify, commit, and continue ticket-by-ticket until blocked by evidence, approval, or a real concurrent-work conflict.

Do not ask whether to proceed between normal tickets. Stop only at a defined human approval gate, destructive decision, unresolved rights issue, material architectural fork, or concurrent-work collision that cannot be safely reconciled.
