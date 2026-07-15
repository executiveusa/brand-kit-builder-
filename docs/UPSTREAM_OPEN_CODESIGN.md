# Open CoDesign upstream extraction map

## Source

- Archive: `open-codesign-main.zip`, supplied by the repository owner during ZTE-20260715-0004
- Upstream project: Open CoDesign by OpenCoworkAI Contributors
- License: MIT
- Review date: 2026-07-15

## Decision

Open CoDesign is used as a donor architecture and interaction reference, not as a renamed product. Pauli Brand Studio owns the workflow, brand intelligence, source rules, KAKU sequence, Guardian gates, visual identity, language, and release controls.

## Patterns integrated into the custom studio

| Upstream pattern | Custom implementation |
|---|---|
| Three-panel workspace | Workflow rail, Brand Canvas, Brand Controls inspector |
| Preview pane and toolbar | Brand book, logo, social, and website previews with desktop/tablet/mobile modes |
| Tweak panel | Controlled color, typography, imagery, and voice adjustments |
| Files panel | Source-aware project dock with protected and approved states |
| Inline comments | Comment mode and canvas pin linked to the comments panel |
| Ask modal | New-project source chooser and future one-question discovery interview surface |
| Permission dialog | Human approval remains in the hardened local core, outside browser agent control |
| Working status | Visible local agent/demo status in the top bar |
| Runtime bridge | `window.brandKitBuilderHost.invoke(command, payload)` cooperative desktop bridge |
| Localization architecture | English and Mexican Spanish dictionaries with full-key parity |
| Exporter concept | Reserved for controlled HTML, PDF, PPTX, Markdown, and ZIP adapters |
| UI-kit decomposition | Reserved for agent-readable token and component handoff packages |

## Components deliberately not copied

- Open CoDesign name, logo, palette, typography, screenshots, sample gallery, or product copy
- Chinese localization and Chinese documentation
- Unrestricted shell execution
- Automatic model-provider access
- Auto-update and installer infrastructure
- Cloud sync, public marketplace, or account system
- Any path that could bypass Brand Kit Builder readiness, Guardian, rights, approval, secret, path, or cost controls

## Steve Krug adaptation

The custom interface applies these usability decisions:

- visible text labels for primary actions;
- one clear purpose per panel;
- ordered stages and explicit locked states;
- no mystery navigation or hidden hover-only actions;
- persistent project, quality, language, and agent status;
- clear active states for tabs and viewport modes;
- reversible draft controls;
- first-run guided tour with skip, back, next, and restart;
- keyboard focus, skip link, semantic landmarks, and reduced-motion support;
- responsive simplification rather than shrinking the desktop interface.

## Future extraction candidates

Before importing code, perform a dedicated security and license review for:

- PDF/PPTX/ZIP exporters
- visual parity checks
- UI-kit decomposition
- browser preview error capture
- image-generation adapters
- provider abstraction
- desktop packaging
