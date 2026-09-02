import test from 'node:test'
import assert from 'node:assert/strict'
import { createPostizAdapter } from '../../adapters/postiz/adapter.mjs'
import { approveWorkOrder, compileWorkOrder, normalizeRequestV2 } from '../../../../interfaces/runtime/src/one-hands.mjs'

function scheduledWorkOrder() {
  const request = normalizeRequestV2({
    tenant: 'acme', project: 'launch', outcome: 'Schedule approved social content.',
    workflow_id: 'social.v2', parent_stage: '50_publish', step_id: 'schedule', action: 'postiz-schedule',
  })
  return compileWorkOrder(request, { work_order_id: 'WO-20260902-0090', created_at: '2026-09-02T21:00:00.000Z' })
}

test('Postiz adapter rejects schedule without recorded human approval', async () => {
  const adapter = createPostizAdapter({
    baseUrl: 'https://postiz.example', apiKey: 'runtime-only',
    fetchImpl: async () => { throw new Error('fetch must not run before approval') },
  })
  await assert.rejects(() => adapter.schedule({ workOrder: scheduledWorkOrder(), payload: { type: 'draft' } }), /approval required/)
})

test('Postiz adapter uses the public API only after approval and does not persist API key in receipt', async () => {
  const calls = []
  const adapter = createPostizAdapter({
    baseUrl: 'https://postiz.example/', apiKey: 'runtime-only',
    fetchImpl: async (url, options) => {
      calls.push({ url, options })
      return { ok: true, status: 200, async json() { return { id: 'provider-post-1', accepted: true } } }
    },
  })
  const workOrder = approveWorkOrder(scheduledWorkOrder(), {
    approved_by: 'owner', approved_at: '2026-09-02T21:01:00.000Z', evidence_ref: 'approvals/AP-1.json',
  })
  const result = await adapter.schedule({ workOrder, payload: { posts: [{ integration: 'explicit-channel-id', value: [{ content: 'Approved copy' }] }] }, now: () => '2026-09-02T21:02:00.000Z' })
  assert.equal(calls[0].url, 'https://postiz.example/public/v1/posts')
  assert.equal(calls[0].options.headers.Authorization, 'runtime-only')
  assert.equal(result.receipt.approval.status, 'approved')
  assert.equal(JSON.stringify(result.receipt).includes('runtime-only'), false)
})

test('Postiz integrations and listing are read-only public API calls', async () => {
  const calls = []
  const adapter = createPostizAdapter({
    baseUrl: 'https://postiz.example', apiKey: 'runtime-only',
    fetchImpl: async (url, options) => {
      calls.push({ url, options })
      return { ok: true, status: 200, async json() { return [] } }
    },
  })
  await adapter.integrations()
  await adapter.listPosts({ page: 1 })
  assert.equal(calls[0].url, 'https://postiz.example/public/v1/integrations')
  assert.equal(calls[0].options.method, 'GET')
  assert.equal(calls[1].url, 'https://postiz.example/public/v1/posts?page=1')
})
