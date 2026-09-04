# Montage — Launch Checklist

## Brand
- [x] Governing idea locked: **Many moments. One story.**
- [x] Positioning locked.
- [x] Voice locked.
- [x] Production SVG mark created.
- [x] Wordmark / lockup / reverse variants created.
- [x] Color and type tokens defined.
- [x] Application stress test passed.
- [x] Commercial desirability passed.
- [x] Portable brand kit manifest created.
- [x] Social reel, square, video end-card, and watermark templates created.
- [x] PARÉ brand-kit repository deployed successfully to Vercel production.

## Product surface
- [x] Launch hero uses the exact approved definition.
- [x] Hero demonstrates multiple scenes resolving into one montage.
- [x] Slider behavior exists on desktop with reduced-motion support.
- [x] Primary CTA is `Start a Montage`.
- [x] Workflow is visible: Bring clips → Find moments → Build montage → Export.
- [x] Google Drive + OneDrive capability is represented accurately.
- [x] Protected source-master behavior is represented accurately.
- [x] Media Library is linked from primary navigation.
- [x] Mobile hierarchy is simplified.
- [x] Product brand-launch PR #49 passed branch freshness, Phase 10 generation, GRINIONS, typecheck/build, and browser/local-footage acceptance.
- [x] Product brand-launch PR #49 merged to `main` at `c9996392c09103293c783b97350939c4f0d42433`.
- [ ] Montage production Vercel project created on the current `pauli-4426's projects` team.
- [ ] Production URL verified after project import/deploy.
- [ ] Server secrets verified on production runtime.
- [ ] Google Drive production connection test.
- [ ] OneDrive production connection test.
- [ ] Export-back capability stays disabled until separate publish permission is implemented and reviewed.

## Hosting evidence
PARÉ / Brand Kit Builder is live on Vercel and the latest Montage brand-kit commit deployed `READY` to production.

The Montage product repo is still wired to an older Vercel integration that reports the legacy team's free-deployment quota failure. The current writable Vercel team does not yet contain a project linked to `executiveusa/pauli-montage-video-agent`. Do not mark the Montage app publicly launched until that project exists and its runtime is verified.

## Temporary launch/demo photography
The initial marketing hero may use free Unsplash demo photography while first-party Montage showcase footage is assembled. Replace demo photography with Montage-produced/user-owned showcase work as soon as available.

Selected launch references:
- Thierry Lemaitre — mountain sunrise — Unsplash.
- Mehrpouya H — cinematic portrait — Unsplash.
- Nihar Reddy Jangam — surfer/action — Unsplash.
- Mathew Schwartz — city at night — Unsplash.
- David Schultz — concert/live event — Unsplash.

## Release rule
Do not call the Montage product fully launched until the production URL and cloud connection paths are verified. Build success alone is not runtime proof.
