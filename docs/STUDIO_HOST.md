# Guarded localhost Studio Host

## Purpose

The Pauli Brand Studio browser interface is served by a local Node.js host that connects approved browser actions to the hardened Brand Kit Builder agent core. The host exists to provide durable local project storage and read-only access to verified release approval without exposing arbitrary shell, filesystem, model-provider, GitHub-write, or deployment capabilities.

## Start

```bash
npm run studio
```

The default runtime binds to:

```text
http://127.0.0.1:4173
```

The default workspace is:

```text
./workspace
```

Override it explicitly:

```bash
BKB_WORKSPACE=/absolute/path/to/workspace npm run studio
```

A static browser-only preview remains available for UI debugging:

```bash
npm run studio:static
```

The static preview does not persist through the agent core and cannot inspect approval.

## Trust boundary

The host:

- binds only to `127.0.0.1` by default;
- creates a new random session token on every start;
- injects the session token into the served studio page;
- accepts API requests only through `POST /__brand-kit-builder/invoke`;
- requires the `X-Pauli-Studio-Session` header;
- enforces same-origin requests when an `Origin` header is present;
- limits request bodies to 1 MB;
- applies a restrictive Content Security Policy and security headers;
- resolves static files beneath `apps/studio` only;
- runs an explicit command allowlist;
- never invokes `child_process`, a shell, or arbitrary executables.

The session token is process-local. It is not stored in the repository, project JSON, browser local storage, logs, or exports.

## Project persistence

The host stores sanitized Studio snapshots beneath the configured workspace:

```text
.brand-kit-builder/
└── studio/
    ├── state.json
    └── events.ndjson
```

`state.json` is written atomically. Browser-authored approval and export records are removed before persistence.

The browser still keeps a local copy for fast rendering. On startup, a connected host becomes the durable source and hydrates the browser workspace.

## Allowed browser commands

The host accepts only named operations needed by the Studio workflow. Examples include:

- create or synchronize a Studio project;
- save intake and discovery answers;
- update source records;
- save readiness scores;
- save strategy, voice, visual-system, brand-book, and Guardian records;
- inspect core project state;
- inspect verified export approval;
- record a completed local export manifest.

Unknown commands fail with `HOST_COMMAND_NOT_ALLOWED`.

The host does not provide:

- arbitrary shell execution;
- arbitrary local file reads;
- arbitrary local file writes;
- model-provider access;
- browser automation;
- GitHub writes;
- MCP approval tools;
- production deployment.

## Core synchronization

When a complete Studio snapshot is available, the host validates and synchronizes release evidence into the agent core. Validation includes:

1. explicit primary or governing sources;
2. inspected sources and resolved conflicts;
3. all 20 readiness axes with a passing gate;
4. complete brand strategy;
5. complete brand voice;
6. complete visual system;
7. all 13 KAKU pages and ten annexes;
8. four passing Guardians;
9. no open P0 or P1 findings.

The synchronized evidence is canonicalized and hashed with SHA-256. The core stores:

```json
{
  "studio_sync": {
    "evidence_sha256": "...",
    "synchronized_at": "...",
    "schema_version": "...",
    "channel": "local-studio-host"
  }
}
```

Incomplete snapshots may still be stored locally, but they do not become release-ready core evidence.

## Human export approval

The Studio cannot create approval. After the release evidence is complete and synchronized, the project owner runs the existing interactive CLI command in a real terminal:

```bash
node bin/brand-kit-builder.mjs approve \
  --workspace ./workspace \
  --project-id <project-id> \
  --action export
```

The Studio then uses the read-only `inspect-export-approval` command. The host returns an approval only when:

- the core project contains a valid human terminal approval;
- the approval belongs to the project owner;
- synchronized release evidence exists;
- the approval timestamp is not older than the evidence synchronization time.

The returned browser record includes the synchronized `evidence_sha256`. Material evidence changes create a new synchronization timestamp, making the older approval stale.

Unchanged evidence preserves its original synchronization time, so recording or downloading an export does not invalidate a valid approval.

## Export package

After all four Guardians pass and current human approval is verified, the browser may generate the local approved ZIP package. The host records only the manifest event. It does not grant approval and does not deploy or publish the package.

## Operational rules

- Use one host process per workspace.
- Do not expose the host port beyond localhost.
- Do not proxy the host through a public tunnel.
- Do not add secrets to project snapshots.
- Restart the host to rotate the session token.
- Re-run Guardian review and human approval after material brand evidence changes.
- Keep production deployment as a separate explicitly approved integration.
