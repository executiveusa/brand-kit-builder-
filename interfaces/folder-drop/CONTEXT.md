# Folder-drop adapter context

Status: **contract surface only — watcher/runtime not implemented yet.**

This adapter defines the filesystem handoff boundary for local agents, USB workspaces, and other systems that exchange project packs without a cloud dependency.

## Law
- Inputs must resolve to a tenant/project workspace and a valid work-order/context contract.
- Outputs must include receipts and content hashes.
- Folder-drop never bypasses protected-item, rights, guardian, or approval gates.
- Partial writes must be detectable and recoverable; atomic handoff is required in the runtime phase.
