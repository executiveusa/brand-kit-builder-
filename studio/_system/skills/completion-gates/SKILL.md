# Completion Gates Skill

Purpose: prevent premature completion claims by converting acceptance criteria into runnable or explicitly manual evidence gates before substantial work begins.

## Gate format
Each independent required outcome gets:
- gate id;
- requirement;
- observation/check;
- expected success condition;
- evidence reference;
- owner;
- state.

States:
`WAITING | READY | IN_FLIGHT | VERIFIED | FAILED | ABANDONED`

`ABANDONED` is a handoff, never a success state.

## Rules
- Write acceptance gates before implementation when the change is substantial.
- A runnable gate passes only when its command/check succeeds and its expected condition is actually observed.
- Old evidence is not re-execution. Reverify before release when inputs changed.
- Do not convert a CI/build/deploy request into evidence of live production behavior.
- Consequential manual outcomes require proportional human evidence.
- Independent requirements may run in parallel only when write scopes are disjoint and ownership is explicit.
- A parent stage is Verified only when every non-abandoned required child gate is Verified and any abandoned child is handled as a visible handoff/blocker.

## Relationship to ICM
ICM controls scope and canonical state. Completion Gates prove the named outcome. Gauntlet judges quality. Proof assembles the release evidence.

These systems complement each other; none replaces another.
