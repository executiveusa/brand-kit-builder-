import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { createReferenceBuilder, createReferenceGuardian, readLedger, runFactory } from '../src/factory.mjs'

const request = {
  work_order_id: 'WO-20260813-0001',
  tenant: 'acme', project: 'launch', outcome: 'Build the approved launch brand kit.',
  protected_items: ['wordmark'], constraints: ['no invented claims'], requires_approval: true,
}

async function temp() { return mkdtemp(path.join(os.tmpdir(), 'pauli-factory-')) }

test('happy path reaches G5 human hold with content-addressed receipts', async () => {
  const root = await temp()
  try {
    const result = await runFactory({ request, root, builder: createReferenceBuilder(), guardian: createReferenceGuardian(), now: () => '2026-08-13T00:00:00.000Z' })
    assert.equal(result.state, 'gate_pending')
    assert.equal(result.gate, 'G5')
    assert.equal(result.requires_human, true)
    assert.ok(result.receipts.length >= 5)
    for (const item of result.receipts) assert.match(item.sha256, /^[a-f0-9]{64}$/)
    const ledger = await readLedger(result.ledger)
    assert.equal(ledger[0].event, 'work_order.started')
    assert.equal(ledger.at(-1).event, 'gate.pending')
    assert.equal(ledger.at(-1).gate, 'G5')
    const delivery = await readFile(path.join(result.project_root, '40_deliver', 'delivery.md'), 'utf8')
    assert.match(delivery, /Publishing is intentionally blocked/)
  } finally { await rm(root, { recursive: true, force: true }) }
})

test('guardian failure notes enter retry context and second attempt can pass', async () => {
  const root = await temp()
  const seen = []
  const base = createReferenceBuilder()
  const builder = { ...base, name: 'retry-observer', async execute(payload) { seen.push(payload.retry_notes); return base.execute(payload) } }
  try {
    const result = await runFactory({ request, root, builder, guardian: createReferenceGuardian({ scores: [7, 9, 9, 9] }), now: () => '2026-08-13T00:00:00.000Z' })
    assert.equal(result.state, 'gate_pending')
    assert.deepEqual(seen[0], [])
    assert.match(seen[1][0], /scored 7/)
    const ledger = await readLedger(result.ledger)
    assert.ok(ledger.some((item) => item.event === 'retry.queued'))
  } finally { await rm(root, { recursive: true, force: true }) }
})

test('three failed guardian attempts escalate and never deliver', async () => {
  const root = await temp()
  try {
    const result = await runFactory({ request, root, builder: createReferenceBuilder(), guardian: createReferenceGuardian({ scores: [4, 5, 6] }), now: () => '2026-08-13T00:00:00.000Z' })
    assert.equal(result.state, 'escalated')
    assert.equal(result.stage, '00_intake')
    const ledger = await readLedger(result.ledger)
    assert.equal(ledger.at(-1).event, 'work_order.escalated')
  } finally { await rm(root, { recursive: true, force: true }) }
})

test('builder and guardian must be distinct roles and objects', async () => {
  const root = await temp()
  try {
    const builder = createReferenceBuilder()
    await assert.rejects(() => runFactory({ request, root, builder, guardian: builder }), /guardian provider is required|independent/)
  } finally { await rm(root, { recursive: true, force: true }) }
})

test('rerun with same work order keeps deterministic output paths', async () => {
  const root = await temp()
  try {
    const first = await runFactory({ request, root, builder: createReferenceBuilder(), guardian: createReferenceGuardian(), now: () => '2026-08-13T00:00:00.000Z' })
    const second = await runFactory({ request, root, builder: createReferenceBuilder(), guardian: createReferenceGuardian(), now: () => '2026-08-13T00:01:00.000Z' })
    assert.equal(first.project_root, second.project_root)
    assert.equal(first.receipts[0].path, second.receipts[0].path)
    assert.equal(first.receipts[0].sha256, second.receipts[0].sha256)
  } finally { await rm(root, { recursive: true, force: true }) }
})
