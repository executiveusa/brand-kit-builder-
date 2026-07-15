# ZTE-20260715-0007 — Visual system phase

## Objective

Convert an approved strategy and completed voice system into a governed visual identity system that can be used consistently across digital and physical applications.

## Scope

- Extended studio project store and visual-system migration defaults
- Approved creative-territory selection
- Logo preservation, refinement, or approved-redesign policy
- Five semantic color tokens
- Display/body typography and hierarchy rules
- Image direction, lighting, composition, representation, and forbidden treatments
- Illustration, icon, pattern, layout, motion, and accessibility rules
- Priority application selection
- Live local canvas color preview
- Brand-book stage unlock only after visual completion
- English and Mexican Spanish visual workspace
- Guarded `save-visual-system` bridge event

## Acceptance criteria

- Visual work remains locked until strategy and voice are complete
- One approved strategy territory must be selected
- All color tokens use valid six-digit hexadecimal values
- Typography, imagery, icon, layout, motion, and accessibility rules are required
- At least three priority applications are selected
- Brand-book work remains locked until the visual system is complete
- Existing projects receive safe defaults without losing prior work
- Browser code makes no direct network calls
- Repository validation and all tests pass

## Risk

MEDIUM. The phase adds editable visual tokens and live browser preview but no image provider, font download, external asset mutation, production deployment, or approval bypass.

## Rollback

Close the pull request or revert the visual-system commits. Existing strategy and voice data remain compatible with the prior project store.
