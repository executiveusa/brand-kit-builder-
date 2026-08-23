# CLI adapter context

Status: **live local runtime — tested.**

The CLI provides cheap local/operator access to the same canonical normalization and reference-factory contracts used by the other Design Factory interfaces.

## Commands

```bash
pdfactory capabilities
pdfactory normalize --tenant <id> --project <id> --outcome <text>
pdfactory run-reference --tenant <id> --project <id> --outcome <text> --root <repo-root>
```

Long form is also available as `pauli-design-factory` when installed through the package bin mapping.

### `capabilities`
Returns ICM stages, gates, skills, transport status, commands and factory laws. Agents should call this first when they do not already know the Design Factory contract.

### `normalize`
Passes CLI arguments through `interfaces/runtime/src/normalize.mjs#fromCli` and prints canonical `interface-request.v1` JSON with its stable idempotency key.

### `run-reference`
Runs the deterministic local reference orchestration through the shared factory runtime. It proves request → ICM stage → guardian → receipt wiring and intentionally stops at **G5 human approval**. It does not fabricate research or finished creative assets and it does not publish.

## Agent routing preference
For agents with shell access and a local Design Factory checkout:

1. **CLI first** for capabilities, normalization, deterministic local reference runs, CI, scripts and cron — lowest protocol overhead.
2. **MCP** when tool discovery, cross-harness interoperability or structured tool calling is more useful than raw shell execution.
3. **REST** only when a remote Design Factory endpoint has been deployed and verified.

## Law
- Commands are thin adapters over canonical contracts; CLI does not own brand truth.
- Local execution remains usable without Supabase for portable project packs.
- Mutating commands must preserve the same approval/idempotency rules as every other interface.
- No secret values are printed into logs or portable exports.
- Canonical brand/design truth remains approved ICM files and manifests.
- G5 human approval cannot be bypassed from this CLI.
