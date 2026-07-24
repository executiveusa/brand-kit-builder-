# Stage 10 — Design System

Version: 1.0.0

## Objective
Compile approved brand truth into enforceable visual tokens, components, patterns, page recipes, typography, imagery, motion, and production rules.

## Entry criteria
Strategy/voice/direction approved enough for production; protected assets and rights status known.

## Inputs
Approved strategy, voice, visual territory, evidence, existing design tokens/components/assets when brownfield.

## Required references
`../../_config/krug-rules.yaml`, `../../_config/anti-slop-rules.yaml`, `../../shared/artifact-contract.md`.

## Allowed capabilities/tools
Design-system compiler, font registry, asset inspection, accessible color/type/layout tooling.

## Process
Preserve reusable existing system first; define typed color/type/spacing/radius/border/shadow/layout/motion tokens; choose one icon family; define component variants/states and page recipes; define image/illustration/pattern rules; validate accessibility/localization.

## Outputs
`design-system/` tokens, component registry, pattern/page recipes, font selections/license refs, design-system review HTML, rule results.

## Acceptance criteria
No arbitrary production values outside registered tokens without documented exception; component/state coverage explicit; English/es-MX behavior considered; accessibility constraints encoded; existing useful components reused.

## Human decision gate
Material visual-system direction conflict, font/license choice with cost or rights impact, or replacement of approved existing system.

## Prohibited actions
Universal Pauli styling, mixed icon families, unlicensed fonts/assets, duplicate component creation without need.

## Failure/escalation
Rights/accessibility conflict blocks affected token/asset choice and returns a bounded decision.

## Handoff target
Content Plan, Rebuild Options, asset/logo/application production.

## Rollback
Restore prior design-system version and token registry.
