# Design Factory Walk Test

A cold-start agent passes only if it can answer all questions below from repository files alone, without chat history.

1. What is this? — Pauli Brand Studio, the design factory.
2. What does this repo own? — Brand strategy, design systems, governed creative production, validation, delivery, and publishing contracts.
3. Where do I start? — `AGENTS.md` → `CONTEXT.md` → `studio/CONTEXT.md` → `studio/_system/contracts/ICM.md`.
4. What stage am I in? — One of `00_intake`, `10_strategy`, `20_design`, `30_validate`, `40_deliver`, `50_publish`.
5. What may I read/write? — ICM stage law defines scope. Never write outside the assigned stage.
6. Which skills apply? — Follow `studio/_system/skills/CONTEXT.md` and the stage instructions/work order.
7. What quality bar applies? — `DESIGN_STANDARD.json`, Guardians, Collins-Level, and Gauntlet where required.
8. How do I prove completion? — Produce the required artifacts plus evidence/scorecard/receipt in the project ledger or validation stage.
9. What happens on failure? — Return one largest gap to the owning stage; builder repairs; independent critic reruns.
10. Where does the next agent resume? — The current ICM files, handoff packet, ledger events, and approved manifests.

## Pass condition
The agent can state: PURPOSE, OWNER, STAGE, READ SCOPE, WRITE SCOPE, REQUIRED SKILLS, REQUIRED OUTPUT, PASS BAR, PROOF, and NEXT HANDOFF.

If any are unknown, emit `WALK_TEST_FAIL` and stop before editing.
