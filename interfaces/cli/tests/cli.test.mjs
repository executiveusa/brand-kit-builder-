import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import os from 'node:os'
import path from 'node:path'
import { capabilities, execute } from '../cli.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..')

test('capabilities reports live CLI, PARÉ identity and ICM stages', () => {
  const value = capabilities()
  assert.equal(value.system, 'PARÉ')
  assert.equal(value.operator, 'One Hands')
  assert.equal(value.architecture, 'ICM')
  assert.equal(value.transports.cli, 'live')
  assert.ok(value.stages.includes('30_validate'))
  assert.ok(value.commands.includes('run-reference'))
  assert.ok(value.commands.includes('plan'))
  assert.ok(value.workflows.includes('seo.v1'))
})

test('normalize uses the same canonical legacy CLI normalizer', async () => {
  const result = await execute(['normalize', '--tenant', 'acme', '--project', 'launch', '--outcome', 'Create a brand system', '--constraints', 'no gradients,mobile first'])
  assert.equal(result.kind, 'json')
  assert.equal(result.value.version, 'interface-request.v1')
  assert.equal(result.value.tenant, 'acme')
  assert.equal(result.value.project, 'launch')
  assert.deepEqual(result.value.constraints, ['mobile first', 'no gradients'])
  assert.match(result.value.idempotency_key, /^[a-f0-9]{64}$/)
})

test('normalize-v2 carries workflow routing without transport/provider fields', async () => {
  const result = await execute([
    'normalize-v2', '--tenant', 'acme', '--project', 'launch', '--outcome', 'Create SVG masters',
    '--workflow', 'brand-kit.v1', '--stage', '20_design', '--step', 'svg', '--action', 'engineer-svg-system', '--outputs', 'symbol.svg,logo-primary.svg',
  ])
  assert.equal(result.value.version, 'interface-request.v2')
  assert.equal(result.value.workflow_id, 'brand-kit.v1')
  assert.equal(result.value.parent_stage, '20_design')
  assert.deepEqual(result.value.requested_outputs, ['logo-primary.svg', 'symbol.svg'])
})

test('workflows reads the canonical registry', async () => {
  const result = await execute(['workflows', '--root', repoRoot])
  assert.equal(result.value.system, 'PARÉ')
  assert.ok(result.value.workflows.some((item) => item.workflow_id === 'social.v2'))
})

test('plan compiles brand plus SEO/social from the requested outcome', async () => {
  const result = await execute([
    'plan', '--root', repoRoot,
    '--tenant', 'acme', '--project', 'launch', '--outcome', 'Build the brand, SEO and Instagram campaign.',
    '--workflow', 'brand-kit.v1', '--stage', '00_intake', '--step', 'intake', '--action', 'discover',
  ])
  assert.equal(result.value.version, 'one-hands-preflight.v1')
  assert.ok(result.value.plan.included_workflows.includes('seo.v1'))
  assert.ok(result.value.plan.included_workflows.includes('social.v2'))
  assert.ok(result.value.human_gates.some((item) => item.action === 'postiz-publish'))
})

test('run-reference creates ICM receipts and stops at G5', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'pauli-design-cli-'))
  const result = await execute(['run-reference', '--tenant', 'acme', '--project', 'launch', '--outcome', 'Create a brand system', '--root', root])
  assert.equal(result.value.state, 'gate_pending')
  assert.equal(result.value.gate, 'G5')
  assert.equal(result.value.requires_human, true)
  const ledger = await readFile(result.value.ledger, 'utf8')
  assert.match(ledger, /"event":"gate.pending"/)
  assert.match(ledger, /"gate":"G4"/)
})

test('missing required fields fail closed', async () => {
  await assert.rejects(() => execute(['normalize', '--tenant', 'acme']), /project is required/)
})
