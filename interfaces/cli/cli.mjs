#!/usr/bin/env node
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
import { fromCli } from '../runtime/src/normalize.mjs'
import { createReferenceBuilder, createReferenceGuardian, runFactory } from '../../studio/_system/runtime/src/factory.mjs'

const VERSION = '0.1.0'

function json(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`)
}

function fail(message, code = 1) {
  process.stderr.write(`${message}\n`)
  process.exitCode = code
}

function usage() {
  return `Pauli Design Factory CLI v${VERSION}

Usage:
  pdfactory capabilities
  pdfactory normalize --tenant <id> --project <id> --outcome <text> [options]
  pdfactory run-reference --tenant <id> --project <id> --outcome <text> [options]

Options:
  --attachments <a,b,c>
  --protected <a,b,c>
  --constraints <a,b,c>
  --requires-approval <true|false>
  --root <path>                  Design Factory repo root for run-reference
  --compact                      Print one-line JSON
  --help

Design law:
  CLI is only a transport. Canonical truth remains in ICM/manifests.
  Reference execution stops at G5 human approval and never publishes.
`
}

export function capabilities() {
  return {
    system: 'Pauli Design Factory',
    architecture: 'ICM',
    repo: 'executiveusa/brand-kit-builder-',
    stages: ['00_intake', '10_strategy', '20_design', '30_validate', '40_deliver', '50_publish'],
    gates: ['G0', 'G1', 'G2', 'G3', 'G4', 'G5'],
    skills: ['brand-discovery', 'collins-level', 'design-guardian', 'gauntlet', 'design-proof', 'design-delivery'],
    transports: { cli: 'live', mcp_stdio: 'live', rest: 'contract-defined; deployment/runtime separate', folder_drop: 'normalized', local: 'normalized' },
    commands: ['capabilities', 'normalize', 'run-reference'],
    laws: ['strategy-before-styling', 'builder-and-critic-separated', 'no-evidence-no-completion', 'G5-human-approval-before-publish']
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
  if (command === 'normalize') {
    return { kind: 'json', value: fromCli(parsed.argv), compact: parsed.compact }
  }
  if (command === 'run-reference') {
    const request = fromCli(parsed.argv)
    const root = resolve(parsed.root || env.PAULI_BRAND_STUDIO_ROOT || cwd)
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
