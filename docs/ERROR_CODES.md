# Agent Error Codes

| Code | Meaning | Agent action |
|---|---|---|
| `INVALID_IDENTIFIER` | Project or job identifier is unsafe | Correct the identifier; do not retry unchanged |
| `SECRET_GUARD` | Secret-like material was included | Remove it and use an approved vault integration |
| `PATH_GUARD` | A path escapes the workspace | Use a project-relative path |
| `SYMLINK_GUARD` | A write path crosses a symbolic link | Replace it with a real directory path |
| `SOURCE_REQUIRED` | No explicit source record exists | Add a brief, URL, repository, file, logo, or image source |
| `SOURCE_GATE_FAILED` | Primary/governing sources are unread or conflicted | Complete source inspection and resolve conflicts |
| `PREBUILD_AXIS_MISMATCH` | Readiness is not exactly 20 axes | Supply every required axis once |
| `PREBUILD_GATE_FAILED` | Evidence or readiness is below threshold | Continue discovery and source work |
| `STAGE_ORDER_GUARD` | A prior stage is incomplete | Complete the named prior stage |
| `STAGE_ALREADY_ACTIVE` | Another work order controls this stage | Resume or complete the active work order |
| `STAGE_ALREADY_COMPLETED` | The stage already passed | Validate the project and request the next stage |
| `IDEMPOTENCY_CONFLICT` | A key is bound to another project or stage | Use the original request or create a new unique key |
| `WORK_ORDER_REQUIRED` | Completion was submitted without a job | Call `run-stage` first |
| `WORK_ORDER_NOT_READY` | The job cannot be completed in its current state | Inspect the job and stop automatic retries |
| `WORK_ORDER_STATE_MISMATCH` | Project stage and job state disagree | Halt and inspect local state before recovery |
| `ARTIFACT_MANIFEST_MISMATCH` | Manifest is missing, duplicating, or adding paths | Submit exactly the required output paths |
| `ARTIFACT_NOT_FOUND` | A declared artifact does not exist | Create and verify the file inside the project workspace |
| `ARTIFACT_TYPE_GUARD` | Artifact is a directory or symlink | Replace it with a regular file |
| `ARTIFACT_HASH_MISMATCH` | Supplied SHA-256 does not match | Recompute the hash and inspect the artifact for mutation |
| `GUARDIAN_GATE_FAILED` | A guardian failed or severe findings remain | Resolve findings and rerun review |
| `APPROVAL_REQUIRED` | Owner approval is missing | Stop and obtain explicit Bambu approval |
| `COST_GUARD` | Per-job or daily reservation limit would be exceeded | Stop or obtain a policy override outside this interface |
| `PROJECT_EXISTS` | Project ID is already in use | Load the project or choose a new ID |
| `PROJECT_NOT_FOUND` | Project state does not exist | Create the project or correct the ID |
| `CORRUPT_STATE` | Stored JSON cannot be parsed | Halt, preserve evidence, and restore from a known-good copy |

The same error three consecutive times triggers `LOOP_GUARD`: stop automatic retries and escalate with sanitized context.
