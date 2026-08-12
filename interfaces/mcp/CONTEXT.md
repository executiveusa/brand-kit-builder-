# MCP adapter context

Status: **contract surface only — runtime not implemented yet.**

This adapter will expose Pauli Brand Studio projects, work orders, manifests, artifacts and approvals through MCP while preserving the same contracts used by REST.

## Law
- Normalize MCP tool/resource calls into `studio/_system/schemas/` contracts.
- Do not duplicate business logic from the factory.
- Do not claim tools are live until runtime implementation and smoke tests exist.
- Tenant and approval boundaries must match the REST/local surfaces.
