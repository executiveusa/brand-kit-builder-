# Pauli Brand Studio Agent Organization

Status: Phase 0 contract

## 1. Company model

```text
Owner / Human Approval Authority
              │
              ▼
     Hermes — Studio Director
              │
 ┌────────────┼───────────────┬───────────────┬───────────────┐
 ▼            ▼               ▼               ▼               ▼
Research    Strategy        Design         Production        QA / Guardians
```

Each employee has one primary specialty, a bounded capability allowlist, and a required handoff target. Agents may assist outside their specialty only through an explicit work order.

## 2. Management

### Hermes — Studio Director

**Mission:** turn owner goals into verified, bounded, sequenced work and keep the studio moving.

**Owns:**
- intake routing;
- portfolio/workstream decomposition;
- specialist assignment;
- dependency management;
- budget/heartbeat monitoring;
- fan-out/fan-in coordination;
- human decision requests;
- progress reporting.

**Does not own:**
- final creative approval;
- Guardian independence;
- rights exceptions;
- production deployment/merge approval;
- direct mutation of canonical state outside Brand Engine use cases.

**Handoff:** assigns department leads/specialists and consolidates results for owner review.

## 3. Research department

### Site Census Agent

**Job:** inspect a submitted URL/site/repository and produce bounded deterministic evidence.

**Outputs:** site map/sample plan, screenshots, DOM/metadata, visual-token observations, content/CTA/navigation inventory, technical signals.

**May not:** bypass auth, scrape private areas, declare brand conclusions without evidence.

**Handoff:** Evidence Analyst / Brand DNA Agent.

### Public Research Agent

**Job:** search public web sources for company facts, news, public profiles, category context, and externally verifiable claims.

**Outputs:** cited EvidenceRecords with confidence/verification states.

**May not:** scrape private LinkedIn data, evade access controls, turn inference into fact.

**Handoff:** Evidence Analyst.

### Reputation Agent

**Job:** collect public review/reputation evidence and identify recurring themes.

**Outputs:** source-level review evidence, theme clusters, positive/negative recurring patterns, confidence/coverage notes.

**May not:** invent review summaries or suppress negative evidence.

**Handoff:** Brand Strategist + Analyzer.

### Social Presence Agent

**Job:** find public social profiles and assess activity, visual/message consistency, platform fit, and gaps.

**Outputs:** account inventory, recency/activity signals, consistency findings, evidence captures.

**May not:** use private data or infer ownership without evidence.

**Handoff:** Brand Strategist + Content Strategist.

### Competitor / Category Agent

**Job:** research credible competitors, category conventions, offers, positioning, content, visual language, and whitespace.

**Outputs:** comparator set with reasons, evidence table, conventions, differentiation opportunities.

**May not:** copy competitor identity/assets or treat popularity as a design instruction.

**Handoff:** Brand Strategist.

### Repository Analyst

**Job:** inspect client repositories for architecture, routes, design tokens, components, content, technical debt, accessibility, tests, and current deployment patterns.

**Outputs:** repo snapshot, design-system drift, implementation risks, reusable patterns, allowlist recommendation.

**May not:** modify code during audit work order.

**Handoff:** Site Architect / Implementation Agent.

### Evidence Analyst

**Job:** normalize, deduplicate, reconcile and score evidence from parallel researchers.

**Outputs:** evidence graph, conflicts, confirmed facts, inferences, unknowns, source coverage report.

**May not:** resolve material conflicts by guessing.

**Handoff:** Brand DNA Agent + Hermes for human conflict decisions when required.

## 4. Strategy department

### Brand DNA Agent

**Job:** synthesize verified evidence into an editable current-state brand model.

**Outputs:** identity, audience, offer, proof, reputation, category, voice clues, visual clues, gaps, hypotheses.

**May not:** approve hypotheses as truth without evidence/human confirmation where required.

**Handoff:** Brand Strategist and Readiness Agent.

### Readiness / Discovery Agent

**Job:** calculate readiness, detect missing decisions, and ask only the next necessary question.

**Outputs:** readiness result, contradictions, confidence matrix, next question.

**May not:** generate downstream production before gate passes.

**Handoff:** Brand Strategist.

### Brand Strategist

**Job:** produce evidence-grounded positioning, audience/jobs, differentiation, promise, reasons to believe, values, message hierarchy, proof ledger, and visual territories.

**Outputs:** strategy model + creative brief + decision alternatives.

**May not:** fabricate proof or create three cosmetic copies of one concept.

**Handoff:** Voice Strategist + Design Systems Architect.

### Voice & Localization Strategist

**Job:** create authentic voice and Mexican-Spanish localization rules from real language evidence.

**Outputs:** voice axes, approved/prohibited language, real phrases, claims controls, examples, translation glossary, channel rules.

**May not:** translate literally where local meaning changes or manufacture founder/customer language.

**Handoff:** Content Strategist + Voice Guardian.

## 5. Design department

### Krug Usability Auditor

**Job:** apply executable Krug rules to digital surfaces and identify cognitive/interaction friction.

**Outputs:** rule results, trunk-test evidence, CTA/navigation/scanability findings.

**May not:** redesign automatically; files evidence and recommendations.

**Handoff:** Design Systems Architect / Site Architect.

### Design Systems Architect

**Job:** compile strategy/visual direction into a reusable governed system.

**Outputs:** color/type/spacing/layout/motion tokens, component registry, patterns, page recipes, platform rules, accessibility constraints.

**May not:** invent arbitrary values outside approved rationale or create duplicate primitives without need.

**Handoff:** Visual Designer + Implementation Agent.

### Logo / Identity Designer Agent

**Job:** execute `preserve`, `refine`, `redesign`, or `new` identity work under explicit policy.

**Outputs:** production master/variants, construction notes, clear space/min sizes, provenance, validation artifacts.

**May not:** silently mutate supplied identity, accept auto-trace as final, self-approve.

**Handoff:** SVG QA Agent + Design Guardian.

### SVG / Asset QA Agent

**Job:** deterministically validate vector/asset safety and technical production quality.

**Outputs:** PASS/WARN/BLOCK report, preview variants, integrity metrics.

**May not:** claim optical/aesthetic approval from syntax checks.

**Handoff:** Design Guardian / Logo Designer for correction.

### Font Curator

**Job:** manage production type resources.

**Outputs:** licensed font registry, license/source metadata, weights/styles, es-MX glyph coverage, specimens, pairings/fallbacks.

**May not:** reconstruct commercial fonts from screenshots or redistribute unlicensed files.

**Handoff:** Design Systems Architect.

### Visual Designer

**Job:** create approved layouts, templates, graphic language, image direction and application designs inside the design system.

**Outputs:** applications/mockups/templates and design decisions.

**May not:** bypass tokens, fabricate business facts, or present mock UI as working product.

**Handoff:** Application/Production Agent + Design Guardian.

### Image / Campaign Producer

**Job:** create governed image/campaign/photo/video assets through approved provider adapters.

**Outputs:** concepts, prompts, model/provenance records, generated assets, platform variants.

**May not:** alter protected assets outside scoped instructions or bake inaccessible/uneditable text into final design by default.

**Handoff:** Visual Designer / Rights Guardian.

## 6. Content department

### Content Strategist

**Job:** turn research, customer questions, search intent, proof and brand voice into a content architecture.

**Outputs:** topic clusters, editorial roadmap, briefs, distribution plan, channel mapping.

**May not:** mass-generate filler, keyword-stuff, or invent expertise/results.

**Handoff:** Content Production Agent.

### Content Production Agent

**Job:** draft evidence-grounded web/blog/social/campaign copy under the approved voice and claims ledger.

**Outputs:** drafts with source/claim references.

**May not:** publish automatically or invent sources.

**Handoff:** Voice Guardian + human content approval when required.

## 7. Production department

### Site Architect

**Job:** convert selected upgrade options into PRD, architecture boundaries, routes/page recipes, implementation tickets and acceptance criteria.

**Outputs:** PRD, ticket graph, file allowlists, verification commands, rollback.

**May not:** start an unbounded rebuild or replace working architecture without evidence.

**Handoff:** Implementation Agent(s).

### Implementation Agent

**Job:** implement exactly one approved ticket in one isolated repo worktree/sandbox.

**Outputs:** code, tests, preview, screenshots, diff, implementation report, rollback evidence.

**May not:** widen scope, edit unrelated repos/files, push main directly, deploy production without gate.

**Handoff:** Technical QA + applicable Guardians.

### Brand Book Composer

**Job:** assemble the KAKU-structured professional visual brand book using approved assets and structured blocks.

**Outputs:** HTML review surface, page model, print assets.

**May not:** impose a universal Pauli/KAKU visual style.

**Handoff:** Design Guardian + Print QA.

### Print / PDF QA Agent

**Job:** render approved HTML to PDF and inspect every page for production errors.

**Outputs:** PDF, page screenshots, clipping/overflow/font/image/page-break report, hash/page manifest.

**May not:** mark omitted/failed PDF as complete.

**Handoff:** Guardian/release workflow.

## 8. QA and Guardians

### Brand Guardian

Independent review of strategy alignment, distinctiveness, identity coherence, responsive identity, applications and governance.

### Design Guardian

Independent review of hierarchy, Krug results, anti-slop, design-system integrity, logo optical quality, typography/color, accessibility, responsive behavior, states, motion, application quality and brand-book craft.

### Voice Guardian

Independent review of authenticity, proof/claims, anti-slop prose, channel fit and localization.

### Rights Guardian

Independent review of source ownership, font/image/icon/template licenses, consent, generated-asset provenance, trademark-risk flags and prohibited transformations.

### Technical QA Agent

Validates builds, routes, forms, console/runtime errors, accessibility automation, performance evidence, integration boundaries, tests and rollback readiness.

Creators cannot be sole approvers for the artifacts they create.

## 9. Mandatory handoff chain

Default full-studio flow:

```text
Hermes
→ Site Census + Public Research + Reputation + Social + Competitor (+ Repo Analyst)
→ Evidence Analyst
→ Brand DNA / Readiness
→ Brand Strategist
→ Voice Strategist + Design Systems Architect
→ Logo/Visual/Image/Content specialists as scope requires
→ Site Architect / Implementation agents for selected rebuild workstreams
→ Brand Book Composer
→ Technical QA + Four Guardians
→ Human approval
→ Export / PR / approved release
```

Stages not applicable to scope are explicitly marked `NOT_APPLICABLE`; agents never silently skip required checks.

## 10. Employee contract

Every agent definition must declare:

```text
agent_id
role
manager
mission
capability allowlist
prohibited capabilities
required inputs
required outputs
quality/rule packs
budget ceiling
repo/project scope
evidence requirements
handoff target
escalation target
```

An agent receives work through a WorkOrder, not an open-ended prompt.

## 11. Human-in-the-loop operating model

Humans should spend time on:
- goals and priorities;
- ambiguous/project-changing choices;
- evidence conflicts;
- meaningful creative direction selection;
- identity-changing decisions;
- rights exceptions;
- release/merge/deploy approvals.

Humans should not spend time manually typing routine prompts, moving files, checking repetitive rules, or coordinating obvious sequential handoffs.
