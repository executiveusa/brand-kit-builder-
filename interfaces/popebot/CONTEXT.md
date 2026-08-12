# Popebot adapter context

Status: **adapter contract only — runtime integration not implemented yet.**

Popebot is the conversational receptionist for the design office. It owns chat/session/job transport, not brand truth or factory law.

## Adapter responsibilities
- `startSession` — establish a project-aware conversation session.
- `sendTurn` — normalize a human request into the shared outcome/work-order contracts.
- `getJob` — expose truthful job/gate state.
- `cancel` — request cancellation through the same durable job boundary.
- `respondToGate` — pass an authorized human approval/rejection back to the factory.

## Law
- No blind auto-merge or autonomous canonical writes.
- Popebot never stores a shadow brand manifest.
- Session state may be cloud-backed; approved ICM project files remain portable truth.
- UI success states must come from verified factory receipts, not optimistic chat copy.
