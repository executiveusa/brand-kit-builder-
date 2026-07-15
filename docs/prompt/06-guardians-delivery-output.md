## 19. GUARDIAN REVIEW

The agent that creates a design may not be the sole approver.

Run independent passes:

### Brand Guardian

Checks strategy, differentiation, logo integrity, applications, coherence, and governance.

### Design Guardian

Checks Krug usability, hierarchy, anti-slop, accessibility, responsive behavior, states, motion, and technical feasibility.

### Voice Guardian

Checks authenticity, proof, claim safety, platform rules, localization, and Stop-Slop score.

### Rights Guardian

Checks licenses, attribution, consent, provenance, trademark risk flags, and prohibited asset transformations.

Guardians file findings. They do not hide or silently waive them.

---

## 20. REPOSITORY AND DELIVERY WORKFLOW

Follow:

`CONTEXT LOAD -> PLAN -> IMPLEMENT -> TEST -> FIX -> COMMIT -> PREVIEW -> VERIFY -> HANDOFF -> NOTIFY`

Before code changes:

- assign `bead_id: ZTE-YYYYMMDD-NNNN`;
- inspect memory and sources;
- inspect `AGENTS.md`;
- inspect last five commits, issues, PRs, CI, framework, package manager, and existing patterns;
- create plan, acceptance criteria, risk tier, file allowlist, and rollback;
- create OpenSpec files;
- create Beads tasks or checkpoint fallback.

Branch:

`zte/{bead_id}/{short-description}`

Commit:

`[ZTE][{bead_id}] {action}: {what changed} | {why}`

Pull request must include:

- source ledger;
- plan;
- screenshots before and after;
- scorecards;
- tests;
- accessibility evidence;
- rollback;
- unresolved risks;
- handoff link or files.

Never push secrets. Never write credentials into source, prompts, logs, screenshots, or reports.

Production deployment requires explicit Bambu approval during the first 30 days and whenever the master pipeline requires it.

---

## 21. REQUIRED OUTPUT PACKAGE

Create only the parts relevant to scope, but a full brand-studio engagement should produce:

```text
PAULI_BRAND_STUDIO_OUTPUT/
├── README.md
├── source-ledger.json
├── capability-matrix.json
├── repo-snapshot.json
├── source-conflicts.md
├── decision-log.md
├── discovery/
│   ├── intake.json
│   ├── interview-log.md
│   ├── confidence-matrix.json
│   └── prebuild-score.json
├── strategy/
│   ├── brand-strategy.md
│   ├── brand-strategy.json
│   └── creative-brief.html
├── voice/
│   ├── brand-voice.md
│   ├── brand-voice.json
│   ├── voice-examples.html
│   ├── approved-phrases.json
│   └── claims-ledger.json
├── visual/
│   ├── visual-direction.md
│   ├── design-dials.json
│   ├── design-tokens.json
│   ├── design-tokens.css
│   ├── logo-spec.md
│   ├── icon-system.md
│   ├── image-direction.md
│   ├── image-prompt-library.md
│   ├── image-prompt-library.json
│   └── asset-manifest.json
├── assets/
│   ├── logos/
│   ├── icons/
│   ├── patterns/
│   ├── illustrations/
│   ├── photography/
│   ├── mockups/
│   └── social/
├── brandbook/
│   ├── brandbook.html
│   ├── brandbook.pdf
│   └── brandbook-print.css
├── product/
│   ├── website-or-artifact/
│   └── component-specs.json
├── audit/
│   ├── audit.html
│   ├── prd.html
│   ├── fix-lab.html
│   ├── implementation-report.html
│   ├── screenshots/
│   └── final-score.json
├── handoff/
│   ├── handoff.html
│   ├── handoff.md
│   ├── acceptance-matrix.json
│   └── rollback.md
├── openspec/changes/{change-id}/
├── beads/checkpoints/
└── ops/reports/
```

Package approved deliverables into `brand-kit.zip` and commit them to the assigned repository when requested and permitted.

---
