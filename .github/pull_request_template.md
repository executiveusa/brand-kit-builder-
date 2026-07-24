## Phase

Phase `<NN>` — `<phase-name>`

## OpenSpec change

`openspec/changes/<change-id>.md`

## Beads

- `<bead-id>` — `<description>`

## What changed

<!-- Concise summary of the change -->

## Why

<!-- Business reason and phase objective -->

## Risk tier

LOW | MEDIUM | HIGH

## Verification

- [ ] `npm run check` passes
- [ ] `npm test` passes
- [ ] No new P0 or P1 findings
- [ ] Rollback receipt exists at `ops/rollback/<phase-id>.json`
- [ ] No secrets, credentials, or private keys introduced
- [ ] No fabricated proof, claims, metrics, or testimonials
- [ ] No emojis used as interface icons
- [ ] Bilingual EN / es-MX integrity maintained

## Rollback

Revert this squash merge. See `ops/rollback/<phase-id>.json` for commands.

## GRINION gates

- [ ] OpenSpec verify passes
- [ ] Beads verified
- [ ] CI green
- [ ] No conflicts
- [ ] No unresolved review threads
- [ ] File scope valid
- [ ] No unexpected dependencies
