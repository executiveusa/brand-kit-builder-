# Design Factory Skills Router

Load only the skills required by the current ICM stage or work order.

| Stage / need | Required skill |
|---|---|
| `00_intake` discovery | `brand-discovery/SKILL.md` |
| strategy or creative direction | `collins-level/SKILL.md` |
| any design release candidate | `design-guardian/SKILL.md` |
| independent validation | `gauntlet/SKILL.md` |
| proof / release evidence | `design-proof/SKILL.md` |
| packaging / handoff | `design-delivery/SKILL.md` |

## Laws
- Skills do not own canonical brand truth. Approved ICM files and manifests do.
- A skill may guide judgment but may not bypass stage read/write scope.
- Builders cannot approve their own output.
- Failed validation returns a bounded repair packet to the owning stage.
- Do not preload every skill. Use the smallest sufficient context packet.
