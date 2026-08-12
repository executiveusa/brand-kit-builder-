# CLI adapter context

Status: **contract surface only — runtime not implemented yet.**

The CLI will provide local/operator access to the same project, work-order, guardian and export contracts used by the web and REST surfaces.

## Law
- Commands must be thin adapters over canonical contracts.
- Local execution must remain usable without Supabase when operating a portable project pack.
- Mutating commands require the same approval/idempotency rules as other interfaces.
- No secret values are printed into logs or portable exports.
