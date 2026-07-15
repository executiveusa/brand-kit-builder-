# Pauli Brand Studio

A bilingual, dependency-free in-house brand design application built from the most useful interaction patterns identified in Open CoDesign and governed by the Pauli Brand Studio operating system.

## Current workflow

```text
project intake
→ source ledger
→ discovery interview
→ 20-axis readiness gate
→ brand strategy
→ brand voice
→ visual system
→ exact KAKU brand book
→ four Guardian reviews
→ human-approved ZIP export
```

The interface includes:

- three-panel creative workspace;
- live preview canvas and responsive viewport controls;
- project library and local project persistence;
- English and Mexican Spanish;
- one-question-at-a-time discovery;
- source trust, access, rights, and conflict controls;
- evidence-gated strategy, voice, and visual tools;
- exact 13-part KAKU sequence and ten digital annexes;
- Brand, Design, Voice, and Rights Guardian reviews;
- source-traceable local HTML, JSON, CSS, and ZIP output;
- files, comments, claims, rights, history, and deliverable dock;
- optional host bridge for the guarded Brand Kit Builder core;
- first-run product tour.

## Run

From the repository root:

```bash
npm run studio
```

Open `http://127.0.0.1:4173`.

The server binds only to localhost. The browser shell makes no network requests. When no desktop host bridge is present, host actions remain in demo mode.

## Human export approval

The browser cannot create export approval. After all four Guardians pass, the project owner records approval from a real local terminal:

```bash
node bin/brand-kit-builder.mjs approve \
  --workspace ./workspace \
  --project-id <project-id> \
  --action export
```

The desktop host may then expose the approved record through the read-only `inspect-export-approval` bridge command. The browser accepts only records marked with `source: "agent-core"` and matching the current project.

## Export package

An approved browser package contains:

- `brandbook.html`
- `brandbook-print.css`
- strategy, voice, visual-system, source, claims, Guardian, token, asset, and handoff JSON
- CSS design tokens
- SHA-256 file manifest
- README
- dependency-free stored ZIP archive

PDF is intentionally excluded until an approved local Playwright/PDF adapter renders the HTML and a person visually checks every page.

## Tour behavior

- Starts automatically once per browser profile.
- Completion is stored under `pauli-brand-studio-tour-v1-complete`.
- Restart from the **Tour / Recorrido** button.
- Force with `?tour=1`.

## Host bridge

A desktop wrapper may expose:

```js
window.brandKitBuilderHost = {
  invoke(command, payload) {
    // Route only approved commands to the guarded CLI/MCP adapter.
  }
};
```

The shell never receives provider secrets, never grants its own approval, and does not bypass the guarded agent core.
