# Agent Error Codes

| Code | Meaning | Agent action |
|---|---|---|
| `INVALID_IDENTIFIER` | Project or job identifier is unsafe | Correct the identifier; do not retry unchanged |
| `SECRET_GUARD` | Secret-like material was included | Remove it and use an approved vault integration |
| `PATH_GUARD` | A path escapes the workspace | Use a project-relative path |
| `SYMLINK_GUARD` | A write path crosses a symbolic link | Replace it with a real directory path |
| `SOURCE_REQUIRED` | No explicit source record exists | Add a brief, URL, repository, file, logo, or image source |
| `PREBUILD_AXIS_MISMATCH` | Readiness is not exactly 20 axes | Supply every required axis once |
| `PREBUILD_GATE_FAILED` | Evidence or readiness is below threshold | Continue discovery and source work |
| `STAGE_ORDER_GUARD` | A prior stage is incomplete | Complete the named prior stage |
| `ARTIFACT_MANIFEST_INCOMPLETE` | Required output paths are absent from the manifest | Add every required path |
| `ARTIFACT_NOT_FOUND` | A declared artifact does not exist | Create and verify the file inside the project workspace |
| `GUARDIAN_GATE_FAILED` | A guardian failed or severe findings remain | Resolve findings and rerun review |
| `APPROVAL_REQUIRED` | Owner approval is missing | Stop and obtain explicit Bambu approval |
| `COST_GUARD` | Per-job or daily reservation limit would be exceeded | Stop or obtain a policy override outside this interface |
| `PROJECT_EXISTS` | Project ID is already in use | Load the project or choose a new ID |
| `PROJECT_NOT_FOUND` | Project state does not exist | Create the project or correct the ID |
| `CORRUPT_STATE` | Stored JSON cannot be parsed | Halt, preserve evidence, and restore from a known-good copy |

The same error three consecutive times triggers `LOOP_GUARD`: stop automatic retries and escalate with sanitized context.
