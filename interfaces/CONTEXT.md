# Interfaces context

This folder contains **doors into the same Pauli Brand Studio contracts**. Interfaces do not own brand truth and must not create parallel business logic.

## Routes
- `rest/API.md` — HTTP contract for projects, work orders, manifests, renderings, guardians and knowledge.
- `mcp/` — planned MCP tool/resource adapter.
- `cli/` — planned local command adapter.
- `folder-drop/` — planned filesystem handoff adapter.
- `popebot/` — planned conversation/session/job adapter.

## Law
Every interface normalizes requests into the same work-order/context/receipt contracts under `../studio/_system/`. Interface-specific state is transport/session state only. Canonical brand intelligence remains in approved ICM project files and manifests.
