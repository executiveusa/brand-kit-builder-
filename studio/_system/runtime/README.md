# Factory runtime

Executable G0→G5 orchestration for Pauli Brand Studio.

## What is live in this package
- deterministic project-stage output paths;
- append-only event ledger;
- SHA-256 output receipts;
- independent builder/guardian provider roles;
- 8.5 Guardian quality floor;
- failure notes injected into retry context;
- three-attempt escalation;
- G5 human hold before publish;
- injectable HTTP provider adapter.

## Provider boundary
`createHttpProvider()` accepts a runtime URL and optional token. That endpoint may be Hermes, a model gateway, a local agent, or another compatible worker. The factory does not choose its own provider and does not place provider credentials in project files.

The bundled `createReferenceBuilder()` and `createReferenceGuardian()` exist for deterministic CI and architecture proof. Reference-worker content explicitly refuses to invent missing research, claims, strategy or visual assets. It is not a production creative model.

## Runtime contract
A builder returns `{ content, metadata? }`.
A Guardian returns `{ score, passed, notes }` and never edits the builder output.

The factory writes only inside `studio/projects/<tenant>/<project>/` and its `_ledger`.

A successful automated run ends at `40_deliver / G5 / gate_pending`. Publishing requires a separately recorded human approval.
