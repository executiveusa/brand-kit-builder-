#!/usr/bin/env node
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
import { fromCli } from '../runtime/src/normalize.mjs'
import { fromCliV2 } from '../runtime/src/one-hands.mjs'
import { createReferenceBuilder, createReferenceGuardian, runFactory } from '../../studio/_system/runtime/src/factory.mjs'
import { oneHandsCapabilities, prepareOneHandsOutcome } from '../../studio/_system/runtime/src/one-hands.mjs'

const VERSION = '0.2.0'

function json(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`)
}

function fail(message, code = 1) {
  process.stderr.write(`${message}\n`)
  process.exitCode = code
}

function usage() {
  return `PARÉ / Pauli Brand Studio CLI v${VERSION}

Usage:
  pdfactory capabilities
  pdfactory workflows [--root <path>]
  pdfactory normalize --tenant <id> --project <id> --outcome <text> [options]
  pdfactory normalize-v2 --tenant <id> --project <id> --outcome <text> [routing]
  pdfactory plan --tenant <id> --project <id> --outcome <text> [routing] [--root <path>]
  pdfactory run-reference --tenant <id> --project <id> --outcome <text> [options]

Base options:
  --attachments <a,b,c>
  --protected <a,b,c>
  --constraints <a,b,c>
  --requires-approval <true|false>

V2 routing:
  --workflow <brand-kit.v1|seo.v1|social.v2|flipbook.v1|sovereign-install.v1|product-audit.v1>
  --stage <00_intake|10_strategy|20_design|30_validate|40_deliver|50_publish>
  --step <step-id>
  --action <action>
  --outputs <a,b,c>
  --approval-required <true|false>

Runtime options:
  --root <path>                  Brand Studio repo root
  --compact                      Print one-line JSON
  --help

Design law:
  CLI is only a transport. Canonical truth remains in ICM/manifests.
  Provider/model credentials never enter canonical work orders.
  External publish, client installation and production promotion require recorded human approval.
`
}

export function capabilities() {
  return {
    system: 'PARÉ',
    studio: 'Pauli Brand Studio',
    operator: 'One Hands',
    architecture: 'ICM',
    ownership_model: 'sovereign-installable',
    repo: 'executiveusa/brand-kit-builder-',
    stages: ['00_intake', '10_strategy', '20_design', '30_validate', '40_deliver', '50_publish'],
    gates: ['G0', 'G1', 'G2', 'G3', 'G4', 'G5'],
    workflows: ['brand-kit.v1', 'seo.v1', 'social.v2', 'flipbook.v1', 'sovereign-install.v1', 'product-audit.v1'],
    skills: ['brand-discovery', 'collins-level', 'svg-engineering', 'seo', 'humanize', 'design-guardian', 'gauntlet', 'design-proof', 'design-delivery'],
    transports: { cli: 'live', mcp_stdio: 'live', rest: 'contract/runtime', folder_drop: 'normalized', local: 'normalized' },
    commands: ['capabilities', 'workflows', 'normalize', 'normalize-v2', 'plan', 'run-reference'],
    laws: ['strategy-before-styling', 'builder-and-critic-separated', 'no-evidence-no-completion', 'approval-before-external-publish-or-production', 'client-owns-installation-and-brand-intelligence']
  }
}

function splitRoot(argv) {
  const clean = []
  let root
  let compact = false
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--root') {
      root = argv[i + 1]
      i += 1
      continue
    }
    if (argv[i] === '--compact') {
      compact = true
      continue
    }
    clean.push(argv[i])
  }
  return { argv: clean, root, compact }
}

export async function execute(argv, { cwd = process.cwd(), env = process.env } = {}) {
  const [command, ...rest] = argv
  if (!command || command === '--help' || command === '-h' || command === 'help') return { kind: 'text', value: usage() }
  if (command === '--version' || command === '-v' || command === 'version') return { kind: 'text', value: VERSION }
  if (command === 'capabilities') return { kind: 'json', value: capabilities() }

  const parsed = splitRoot(rest)
  const root = resolve(parsed.root || env.PAULI_BRAND_STUDIO_ROOT || cwd)

  if (command === 'workflows') {
    return { kind: 'json', value: await oneHandsCapabilities(root), compact: parsed.compact }
  }
  if (command === 'normalize') {
    return { kind: 'json', value: fromCli(parsed.argv), compact: parsed.compact }
  }
  if (command === 'normalize-v2') {
    return { kind: 'json', value: fromCliV2(parsed.argv), compact: parsed.compact }
  }
  if (command === 'plan') {
    const request = fromCliV2(parsed.argv)
    const value = await prepareOneHandsOutcome({ input: request, root })
    return { kind: 'json', value, compact: parsed.compact }
  }
  if (command === 'run-reference') {
    const request = fromCli(parsed.argv)
    const value = await runFactory({ request, root, builder: createReferenceBuilder(), guardian: createReferenceGuardian() })
    return { kind: 'json', value, compact: parsed.compact }
  }
  throw new Error(`unknown command: ${command}`)
}

export async function main(argv = process.argv.slice(2)) {
  try {
    const result = await execute(argv)
    if (result.kind === 'text') process.stdout.write(`${result.value}\n`)
    else if (result.compact) process.stdout.write(`${JSON.stringify(result.value)}\n`)
    else json(result.value)
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error), 2)
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main()
