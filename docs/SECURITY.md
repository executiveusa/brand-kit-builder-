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

All state reads and writes are resolved beneath the configured workspace root. The engine rejects:

- `..` path traversal;
- absolute paths supplied as relative artifact paths;
- null bytes;
- symbolic-link segments in write paths;
- symlink or non-file stage artifacts;
- project IDs and idempotency keys outside the safe identifier grammar.

Project artifacts live under:

```text
projects/<project-id>/
```

Machine state lives under:

```text
.brand-kit-builder/
```

CLI JSON files outside the workspace should be streamed through stdin rather than passed as direct input paths.

## Secret guard

Input objects are recursively inspected for secret-like keys such as:

- API keys
- tokens
- passwords
- private keys
- authorization headers
- cookies and sessions

Non-empty values under those keys are rejected with `SECRET_GUARD`. Credentials must be supplied to future provider adapters through a runtime vault or approved environment integration, never through project JSON.

## Source gate

- Every project requires at least one explicit source record.
- Primary and governing sources must be marked as accessed before readiness or generation.
- Unresolved source conflicts block the pipeline.
- The source stage writes the canonical source ledger from validated completion input.

## Work-order integrity

- Stage order cannot be skipped.
- Only one active work order is allowed per project stage.
- Every job uses a globally unique idempotency key.
- Reusing a key for another project or stage fails.
- Completion requires the same project, stage, and idempotency key as the bound work order.
- Direct completion without a work order fails.
- MCP calls are serialized to reduce local state races.

## Artifact integrity

Completion requires a manifest containing exactly the stage's required outputs. The engine rejects missing, extra, duplicate, directory, and symlink artifacts. Every completed artifact receives:

- project-relative path;
- media type;
- byte size;
- SHA-256 hash.

A caller-supplied SHA-256 value is verified when present.

## Owner approval boundary

Agent project intake, JSON CLI payloads, JavaScript SDK intake, and MCP tools cannot supply approvals. Non-empty or empty `approvals` fields in project intake are rejected.

The only supported approval path is the local interactive CLI command. It requires:

- a real terminal on stdin and stderr;
- the typed project owner name;
- the exact project-and-action confirmation phrase;
- a passing readiness gate;
- a completed guardian stage;
- all four guardians passing.

MCP does not expose an approval tool. Approval is rechecked at export work-order creation and completion.

This protects against accidental or cooperative agent bypass. It is not cryptographic proof of human identity against a process with arbitrary local code execution or write access to the workspace. A signed public-key approval adapter is the next security layer before untrusted multi-agent or remote operation.

## Quality and release gates

- The 20-axis readiness schema must be complete.
- Strategy and later generation stages require a passing readiness gate.
- Export checks guardians and owner approval at work-order creation and completion.
- Export requires all four guardians, zero P0 findings, zero unresolved P1 findings, and explicit owner approval.

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

- Local JSON writes are atomic but not yet protected by a cross-process lock. Use one MCP server process per workspace and avoid concurrent CLI writers.
- Authentication is delegated to the local machine and MCP host because the server uses stdio only.
- Model-provider, browser, PDF-rendering, and GitHub-write adapters are not enabled in this core.
- Production deployment remains outside this interface and requires a separate approved integration.

## Reporting a problem

Do not include secrets, private client data, or proprietary assets in an issue. Record the error code, sanitized input shape, branch, commit SHA, and reproduction steps.
