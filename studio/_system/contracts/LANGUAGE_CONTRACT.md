# PARÉ status language contract

These words have operational meaning. Interfaces, agents, receipts and human-facing status must not weaken or redefine them.

| Term | Required meaning |
|---|---|
| Draft | Agent-generated work. Not approved or canonical. |
| Candidate | Draft that passed creator checks and is ready for independent review. |
| Verified | Recorded evidence proves the named check passed. |
| Approved | An authorized human or explicitly authorized approval gate accepted the decision. |
| Canonical | Approved version stored in the project's ICM source of truth. |
| Official | Canonical, required validation passed, and included in the approved delivery package. |
| Preview | Executable/rendered non-production version for review. |
| Published | Externally released to the intended destination. |
| Production | Live authoritative external version. |
| Complete | Required outputs exist and required automated checks passed. |
| Done | Complete + proof exists + required human gates passed + rollback exists. |
| Build | Reversible branch/workspace-scoped creation or modification. |
| Repair | Bounded correction of a failed check followed by re-verification. |
| Approve | Human/authorized gate acceptance. A builder cannot manufacture this state. |
| Schedule | Create a future publishing action. Requires approval when it will affect an external channel. |
| Publish | Consequential external release. Requires recorded approval. |
| Promote | Move an accepted preview into production. Requires explicit production approval. |

## Fail-closed rule
When evidence is missing, use a weaker truthful status. Never infer `Verified`, `Official`, `Published`, `Production` or `Done` from intent, configuration, generated files, CI success or a deployment request.
