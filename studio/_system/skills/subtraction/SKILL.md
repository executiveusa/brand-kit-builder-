# Subtraction Skill

Purpose: prevent overbuilding in PARÉ software, interfaces, workflows and brand deliverables.

## Ladder
After understanding the real problem and current implementation, stop at the first rung that solves it safely:
1. Does this need to exist? If no, remove/skip it.
2. Does the repository already solve it? Reuse it.
3. Does the runtime/standard library solve it? Use that.
4. Does the platform/browser/native capability solve it? Use that.
5. Does an already-installed dependency solve it? Reuse it.
6. Can the existing component/function/contract be extended without creating a second authority? Extend it.
7. Only then add the minimum new implementation that works.

## Never subtract
Do not remove or weaken:
- security or trust-boundary validation;
- accessibility;
- data-loss recovery;
- provenance/rights evidence;
- owner control;
- rollback;
- independent validation;
- required user information;
- truthful error/loading/degraded states.

## Design version
For every element ask:
- does this help understand, decide, act, verify, recover or succeed?
- can the system infer it safely?
- can it appear only when needed?
- can two elements be combined without losing clarity?

Stop removing when the next removal would damage usefulness, confidence, accessibility or control.
