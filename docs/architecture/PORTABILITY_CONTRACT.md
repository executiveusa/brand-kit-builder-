# Portability contract — sovereign brand intelligence

## Goal
A completed studio project must remain understandable and operable when copied away from the original web app, cloud database, or model provider.

The portable unit is the **intelligence pack**, not the entire cloud runtime.

## Portable intelligence pack

```text
<project-slug>.pauli/
├── AGENTS.md                  # project-level router
├── CONTEXT.md                 # project contract + current stage
├── manifest/
│   ├── brand-manifest.json
│   ├── version.json
│   └── approvals.json
├── 00_intake/
├── 10_strategy/
├── 20_design/
├── 30_validate/
├── 40_deliver/
├── 50_publish/
├── _ledger/
│   ├── work-orders/
│   ├── routes/
│   ├── evaluations/
│   ├── approvals/
│   └── events.jsonl
├── assets/
│   ├── manifest.json          # hash, provenance, MIME, size, local/cloud location
│   └── portable/              # selected files required offline
└── portability.json
```

## What must work offline
- Read identity, strategy, voice, design tokens, constraints, and approved decisions.
- Determine current project status from files.
- Generate a smallest-sufficient context packet for a task.
- Produce new proposals into the correct stage without needing Supabase.
- Run deterministic local validation that has no external dependency.
- Hand the project to another compatible LLM/agent through `AGENTS.md` + stage `CONTEXT.md` files.

External research, cloud rendering, provider-specific image generation, publishing, and shared collaboration may require a network and credentials.

## Cloud ownership split

### Filesystem / ICM owns
- approved brand manifest and versioned project intelligence;
- source briefs and protected constraints;
- strategy and voice documents;
- design tokens and design decisions;
- provenance and rights records;
- guardian receipts and human approvals;
- portable asset index;
- final delivery package.

### Supabase may own operational cloud state
- users, tenants, memberships, and permissions;
- active sessions;
- job queue/status and cloud worker leases;
- approval-request notifications;
- sync cursor/state;
- asset mirror metadata and signed-access policy;
- activity/audit index for web UI queries.

Supabase records must carry a file/manifest version or content hash when they reference portable truth. The database must not silently become an alternate editable copy of the brand manifest.

## Sync rules
1. **Files → cloud index** is the normal direction for brand truth.
2. Cloud edits create **proposals**, never silent canonical mutations.
3. Approved proposals produce a new manifest/file version, then cloud indexes update.
4. Conflicts stop automatic promotion and create a decision work order.
5. Sync operations are idempotent and emit receipts.

## USB profile
The Pauli project pack is designed to sit inside a portable agent data directory such as Hermes USB.

Recommended mount:

```text
hermes-portable/
└── data/
    ├── skills/
    ├── memories/
    └── workspaces/
        └── pauli-brand-studio/
            └── projects/
                └── <project-slug>.pauli/
```

The portable agent reads the project router and stage contract before work. The agent does not need the full Pauli Studio source repo to understand a sealed project package if the pack includes the relevant contract snapshot/version identifiers.

## Secrets
Secrets are **not** part of the intelligence pack.

A portable pack may contain symbolic secret requirements such as:

```json
{
  "requires": ["OPENAI_API_KEY", "FAL_KEY"],
  "source": "local-vault-or-host-environment"
}
```

but never secret values.

For USB use, encrypted secret storage must be separate from ordinary project files and explicitly unlocked by the owner. Losing a portable drive must not automatically expose long-lived production credentials.

## Heavy assets
Portability is about intelligence first. Large video/source-image/render files may stay in cloud/object storage if the portable pack contains:
- cryptographic hash;
- provenance;
- dimensions/type/size;
- canonical relative logical name;
- retrieval location(s);
- offline-required flag.

`offline-required: true` assets must be copied into `assets/portable/` during export.

## Provider independence
Project files may name required capabilities (`image.generate`, `pdf.render`, `web.research`) but should not hardwire one model/provider unless an approved decision requires it. Runtime adapters resolve capabilities to available providers.

## Portability acceptance test
A pack passes only if a fresh compatible agent with no prior conversation can:
1. open the pack;
2. explain the brand and current project stage;
3. identify protected items and hard bans;
4. locate the next permitted task;
5. produce a valid proposal in the correct stage;
6. do so without reading a cloud database.
