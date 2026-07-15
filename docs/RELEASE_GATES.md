# Release Gates

A project may advance only when its current gate passes.

## Prebuild gate

- all 20 readiness axes present;
- overall score at least 8.5;
- critical axes at least 8.0;
- source records present;
- proof, rights, approval authority, and contradiction status resolved.

## Stage gate

- prior stage completed;
- required work order exists;
- outputs remain inside the project workspace;
- completion manifest contains every required path;
- every declared artifact exists.

## Guardian gate

- Brand Guardian: passed;
- Design Guardian: passed;
- Voice Guardian: passed;
- Rights Guardian: passed;
- P0 findings: zero;
- unresolved P1 findings: zero.

## Export gate

- all earlier gates passed;
- explicit Bambu approval recorded for `export`;
- single-job and daily cost guards pass;
- no secret-like input;
- no path or symlink violation.

## Production gate

Production deployment is not implemented by the current local agent core. Any future deployment adapter must remain disabled until separately approved by Bambu.
