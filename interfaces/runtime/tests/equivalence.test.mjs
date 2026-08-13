import test from 'node:test'
import assert from 'node:assert/strict'
import { fromCli, fromFolderDrop, fromLocal, fromMcp, fromPopebot, fromRest, normalizeRequest, receipt } from '../src/normalize.mjs'

const base = {
  tenant: 'acme',
  project: 'launch',
  outcome: 'Build the approved launch brand kit.',
  attachments: ['logo.svg', 'brief.md'],
  protected_items: ['wordmark'],
  constraints: ['no invented claims'],
  requires_approval: true,
}

const expected = normalizeRequest(base)

test('REST, MCP, CLI, folder-drop, Popebot and local normalize to one semantic request', () => {
  const variants = [
    fromRest(base),
    fromMcp(base),
    fromCli(['--tenant','acme','--project','launch','--outcome','Build the approved launch brand kit.','--attachments','brief.md,logo.svg','--protected','wordmark','--constraints','no invented claims','--requires-approval','true']),
    fromFolderDrop({ request: base }),
    fromPopebot({ message: base.outcome, attachments: base.attachments, context: { tenant: base.tenant, project: base.project, protected_items: base.protected_items, constraints: base.constraints, requires_approval: true } }),
    fromLocal(base),
  ]
  for (const actual of variants) assert.deepEqual(actual, expected)
})

test('semantic idempotency survives ordering and whitespace differences', () => {
  const changedFormatting = normalizeRequest({ ...base, tenant: ' acme ', attachments: ['brief.md','logo.svg','brief.md'] })
  assert.equal(changedFormatting.idempotency_key, expected.idempotency_key)
})

test('transport-only fields cannot enter canonical request', () => {
  const actual = fromRest({ ...base, authorization: 'secret', model: 'provider-x', transport: 'rest' })
  assert.deepEqual(actual, expected)
  assert.equal('authorization' in actual, false)
  assert.equal('model' in actual, false)
})

test('missing tenant, project or outcome is rejected', () => {
  assert.throws(() => normalizeRequest({ ...base, tenant: '' }), /tenant is required/)
  assert.throws(() => normalizeRequest({ ...base, project: '' }), /project is required/)
  assert.throws(() => normalizeRequest({ ...base, outcome: '' }), /outcome is required/)
})

test('receipt is transport-neutral and bound to request idempotency', () => {
  assert.deepEqual(receipt({ work_order_id: 'WO-20260813-0001', state: 'queued', request: base }), {
    version: 'interface-receipt.v1',
    work_order_id: 'WO-20260813-0001',
    state: 'queued',
    idempotency_key: expected.idempotency_key,
    tenant: 'acme',
    project: 'launch',
  })
})
