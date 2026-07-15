# Security Model

## Trust boundary

Brand Kit Builder is an in-house local workflow engine. It treats every agent payload, source description, artifact manifest, and project identifier as untrusted input.

The core does not:

- expose an HTTP server;
- make external model calls;
- collect telemetry;
- execute arbitrary shell commands;
- install dependencies;
- read environment secrets into project state;
- deploy or merge code.

## Filesystem boundary

All reads and writes are resolved beneath the configured workspace root. The engine rejects:

- `..` path traversal;
- absolute paths supplied as relative artifact paths;
- null bytes;
- symbolic-link segments in write paths;
- project IDs and idempotency keys outside the safe identifier grammar.

Project artifacts live under:

```text
projects/<project-id>/
```

Machine state lives under:

```text
.brand-kit-builder/
```

## Secret guard

Input objects are recursively inspected for secret-like keys such as:

- API keys
- tokens
- passwords
- private keys
- authorization headers
- cookies and sessions

Non-empty values under those keys are rejected with `SECRET_GUARD`. Credentials must be supplied to future provider adapters through a runtime vault or approved environment integration, never through project JSON.

## Integrity and evidence gates

- A project requires at least one explicit source record.
- The 20-axis readiness schema must be complete.
- Strategy and later generation stages require a passing readiness gate.
- Stage order cannot be skipped.
- Completion requires every declared output file to exist.
- Export requires all four guardians and explicit owner approval.
- Duplicate idempotency keys cannot create duplicate jobs.

## Cost circuit breakers

The local core enforces the studio limits:

- maximum 1,000 cents reserved for one job;
- maximum 5,000 cents reserved per UTC day.

The usage ledger is stored locally and does not contain payment credentials.

## Error behavior

Errors are returned as structured JSON:

```json
{
  "ok": false,
  "error": {
    "code": "PATH_GUARD",
    "message": "The requested path escapes the workspace root.",
    "details": {}
  }
}
```

Stable codes let orchestrators halt, retry safely, or route a human approval without parsing prose.

## Known limits of this hardening phase

- Artifact presence is verified; cryptographic artifact hash verification is reserved for the next phase.
- Local JSON state is atomic but not yet protected by a multi-process lock.
- Authentication is delegated to the local machine and MCP host because the server uses stdio only.
- Model-provider, browser, PDF-rendering, and GitHub-write adapters are not enabled in this core.
- Production deployment remains outside this interface and requires a separate approved integration.

## Reporting a problem

Do not include secrets, private client data, or proprietary assets in an issue. Record the error code, sanitized input shape, branch, commit SHA, and reproduction steps.
