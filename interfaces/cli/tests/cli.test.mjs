import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, readFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { capabilities, execute } from '../cli.mjs'

test('capabilities reports live CLI and ICM stages', () => {
  const value = capabilities()
  assert.equal(value.architecture, 'ICM')
  assert.equal(value.transports.cli, 'live')
  assert.ok(value.stages.includes('30_validate'))
  assert.ok(value.commands.includes('run-reference'))
})

test('normalize uses the same canonical CLI normalizer', async () => {
  const result = await execute(['normalize', '--tenant', 'acme', '--project', 'launch', '--outcome', 'Create a brand system', '--constraints', 'no gradients,mobile first'])
  assert.equal(result.kind, 'json')
  assert.equal(result.value.tenant, 'acme')
  assert.equal(result.value.project, 'launch')
  assert.deepEqual(result.value.constraints, ['mobile first', 'no gradients'])
  assert.match(result.value.idempotency_key, /^[a-f0-9]{64}$/)
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
