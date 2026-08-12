# Vercel context

Status: **delivery architecture only — no production deployment is performed in Phase 1.**

Vercel is the cloud delivery surface for the human web application and preview deployments. It does not own brand intelligence or project truth.

## Law
- Preview deployments may be used for browser QA once the app is integrated.
- Production deployment remains a separate explicit owner approval gate.
- Environment secrets stay in deployment secret storage, never repository files or portable project packs.
- Deployment status must be verified from Vercel/CI before the UI or reports claim success.
- A failed production health check requires rollback to the last verified deployment.
