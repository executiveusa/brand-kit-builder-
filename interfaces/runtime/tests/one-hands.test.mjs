import test from 'node:test'
import assert from 'node:assert/strict'
import {
  approveWorkOrder,
  assertActionAuthorized,
  compileWorkOrder,
  fromCliV2,
  fromFolderDropV2,
  fromLocalV2,
  fromMcpV2,
  fromRestV2,
  normalizeRequestV2,
  requiresHumanApproval,
  workflowReceipt,
} from '../src/one-hands.mjs'

const base = {
  tenant: 'acme',
  project: 'launch',
  outcome: 'Build the approved launch brand kit.',
  attachments: ['logo.svg', 'brief.md'],
  protected_items: ['wordmark'],
  constraints: ['no invented claims'],
  workflow_id: 'brand-kit.v1',
  parent_stage: '20_design',
  step_id: 'svg',
  action: 'engineer-svg-system',
  requested_outputs: ['logo-primary.svg', 'symbol.svg'],
}

const expected = normalizeRequestV2(base)

test('v2 REST, MCP, folder-drop and local requests normalize identically', () => {
  const variants = [
    fromRestV2(base),
    fromMcpV2(base),
    fromFolderDropV2({ request: base }),
    fromLocalV2(base),
  ]
  for (const actual of variants) assert.deepEqual(actual, expected)
})

test('v2 CLI normalizes routing fields and semantic ordering', () => {
  const actual = fromCliV2([
    '--tenant','acme','--project','launch','--outcome','Build the approved launch brand kit.',
    '--attachments','brief.md,logo.svg','--protected','wordmark','--constraints','no invented claims',
    '--workflow','brand-kit.v1','--stage','20_design','--step','svg','--action','engineer-svg-system',
    '--outputs','symbol.svg,logo-primary.svg',
  ])
  assert.deepEqual(actual, expected)
})

test('transport credentials and model/provider hints do not enter canonical v2 request', () => {
  const actual = fromRestV2({ ...base, authorization: 'secret', api_key: 'secret', model: 'provider-x', provider: 'vendor-y' })
  assert.deepEqual(actual, expected)
  for (const key of ['authorization', 'api_key', 'model', 'provider']) assert.equal(key in actual, false)
})

test('schedule, publish and promote actions require human approval', () => {
  assert.equal(requiresHumanApproval('postiz-schedule'), true)
  assert.equal(requiresHumanApproval('postiz-publish'), true)
  assert.equal(requiresHumanApproval('production-promote'), true)
  assert.equal(requiresHumanApproval('engineer-svg-system'), false)
})

test('work order compiles with stable request idempotency and pending approval when sensitive', () => {
  const request = normalizeRequestV2({ ...base, workflow_id: 'social.v2', parent_stage: '50_publish', step_id: 'schedule', action: 'postiz-schedule' })
  const workOrder = compileWorkOrder(request, { work_order_id: 'WO-20260902-0001', created_at: '2026-09-02T21:00:00.000Z' })
  assert.equal(workOrder.idempotency_key, request.idempotency_key)
  assert.equal(workOrder.approval.required, true)
  assert.equal(workOrder.approval.status, 'pending')
  assert.throws(() => assertActionAuthorized(workOrder), /approval required/)
})

test('sensitive action accepts only recorded approval evidence', () => {
  const request = normalizeRequestV2({ ...base, workflow_id: 'social.v2', parent_stage: '50_publish', step_id: 'publish', action: 'postiz-publish' })
  const workOrder = compileWorkOrder(request, { work_order_id: 'WO-20260902-0002', created_at: '2026-09-02T21:00:00.000Z' })
  const approved = approveWorkOrder(workOrder, {
    approved_by: 'owner',
    approved_at: '2026-09-02T21:01:00.000Z',
    evidence_ref: 'approvals/AP-20260902-0001.json',
  })
  assert.equal(assertActionAuthorized(approved), true)
  assert.equal(approved.approval.status, 'approved')
})

test('workflow receipt carries approval state without secret/provider fields', () => {
  const request = normalizeRequestV2(base)
  const workOrder = compileWorkOrder(request, { work_order_id: 'WO-20260902-0003', created_at: '2026-09-02T21:00:00.000Z' })
  const receipt = workflowReceipt(workOrder, { state: 'candidate', notes: ['ready for independent review'] })
  assert.equal(receipt.version, 'workflow-receipt.v2')
  assert.equal(receipt.workflow_id, 'brand-kit.v1')
  assert.equal(receipt.approval.status, 'not_required')
  assert.equal('provider' in receipt, false)
  assert.equal('authorization' in receipt, false)
})
