## 16. HTML-FIRST PRODUCTION AND HOST ROUTING

Use HTML as the primary human review surface for audits, design decisions, prototypes, fixes, reports, and handoffs.

Required files when applicable:

```text
audit.html
prd.html
creative-brief.html
brandbook.html
voice-examples.html
fix-lab.html
implementation-report.html
handoff.html
batch-audit-index.html
```

### Environment routing

- **Standalone document:** produce a complete self-contained HTML document.
- **Production website/app:** follow the existing repository framework and architecture.
- **Claude-compatible artifact iframe:** follow the exact compatible artifact constraints from the supplied artifact skill.
- **ChatGPT or another artifact host:** detect and follow that host's current constraints. Do not assume Claude-specific APIs, storage, or markup.
- **PDF:** author from the appropriate HTML, DOCX, or slide source, render, and visually verify.

Every visual fix follows:

`evidence -> audit.html -> prd.html -> fix-lab.html -> approval -> implementation -> implementation-report.html`

No screenshot evidence means no visual QA claim.

---

## 17. DESIGN HANDOFF CONTRACT

When a design is ready for engineering, create a complete handoff that specifies rather than implies.

Required sections:

- overview and user context;
- layout and grid;
- design tokens;
- components, variants, and props;
- default, hover, focus, active, selected, disabled, loading, empty, error, offline, and success states;
- click, tap, keyboard, gesture, and navigation behavior;
- responsive breakpoints and behavior;
- content limits, truncation, long text, international text, missing data, and slow connection behavior;
- motion trigger, property, duration, easing, and reduced-motion fallback;
- accessibility roles, names, focus order, announcements, contrast, and touch targets;
- edge cases;
- file allowlist;
- implementation risks;
- acceptance criteria;
- screenshot references;
- rollback path.

Use tokens as the source of truth. Include raw values in the token table for implementation, but components should reference token names.

Outputs:

```text
handoff.html
handoff.md
component-specs.json
acceptance-matrix.json
```

---

## 18. AUDIT AND RELEASE SCORING

Score every completed project on these 20 axes:

1. Strategic clarity
2. Audience specificity
3. Offer and CTA clarity
4. Creative rationale
5. Distinctiveness
6. Logo system integrity
7. Typography
8. Color and contrast
9. Image and media system
10. Voice authenticity
11. Information architecture
12. Steve Krug usability
13. Accessibility
14. Responsive and native feel
15. Interaction states
16. Motion purpose and restraint
17. Anti-slop score
18. Performance and technical stability
19. Rights, provenance, and claim safety
20. Handoff and governance completeness

Scoring:

```text
0.0-5.9 fail
6.0-6.9 weak
7.0-7.9 usable but not client-ready
8.0-8.4 good but blocked from release
8.5-8.9 approval-ready
9.0-9.4 strong client-ready
9.5-10 exceptional
```

Caps:

- Any P0 issue caps the total at 6.9.
- Fake claims cap the total at 6.5.
- Generic AI-slop caps the total at 7.0.
- Unclear primary CTA caps the total at 7.4.
- Broken mobile behavior caps the total at 7.4.
- Broken links, buttons, routes, or forms cap the total at 7.9.
- Accessibility blockers cap the total at 7.9.
- Missing screenshot evidence caps audit quality at 6.9.
- Missing rollback before edits caps implementation quality at 6.9.
- Missing source ledger or repository inspection blocks the build entirely.

Release requires:

- overall score at least 8.5;
- target score 9.0;
- no P0 or unresolved P1 issue;
- every critical axis at least 8.0;
- Brand Guardian approval;
- Design Guardian approval;
- Voice Guardian approval for public copy;
- rights/provenance check;
- mobile, keyboard, reduced-motion, link, form, console, and performance evidence;
- rollback proof;
- user approval where required.

---
