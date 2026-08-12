# Acceptance: POLISH Design Office Phase 2

## Build
- `npm run build` exits 0 in an environment with package access.
- `npm run lint` exits 0.
- No package-manager switch or secret modification.

## Functional
- Header links resolve to visible sections.
- `Open studio` resolves to the composer.
- Quick prompts populate the composer.
- Submit creates the expected deterministic route steps.
- `/demo-brand-book.html` opens from the app.
- No network/database/agent job is created by the local preview interaction.

## Accessibility
- Skip link is keyboard reachable.
- All controls are keyboard operable.
- Focus indication remains visible.
- Composer has a programmatic label.
- Route result announces through `aria-live`.
- Reduced-motion preference is honored.

## Responsive screenshots
Required evidence:
- desktop 1440 full/hero/nav/composer/footer
- tablet 768 full
- mobile 390 full/nav/composer

## Quality
- No P0 issues.
- No unresolved P1 issues before merge.
- No fake metrics, testimonials, partnerships, backend states, or runtime claims.
- Design audit may not exceed the governing screenshot-evidence cap until rendered screenshots exist.

## Rollback
Revert the Phase 2 PR/merge. No database or production deployment rollback is required because this phase must not mutate either.
