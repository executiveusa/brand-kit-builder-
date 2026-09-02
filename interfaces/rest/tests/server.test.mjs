import test from 'node:test'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { createPareRestServer } from '../server.mjs'
import { approveWorkOrder, compileWorkOrder, normalizeRequestV2 } from '../../runtime/src/one-hands.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..')

async function withServer(options, fn) {
  const server = createPareRestServer({ root: repoRoot, apiToken: 'test-token', ...options })
  await new Promise((resolvePromise, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolvePromise)
  })
  const { port } = server.address()
  try {
    await fn(`http://127.0.0.1:${port}`)
  } finally {
    await new Promise((resolvePromise) => server.close(resolvePromise))
  }
}

function auth(extra = {}) {
  return { authorization: 'Bearer test-token', 'content-type': 'application/json', ...extra }
}

async function jsonResponse(response) {
  const value = await response.json()
  return { response, value }
}

test('health is public but capabilities require authentication', async () => {
  await withServer({}, async (base) => {
    const health = await jsonResponse(await fetch(`${base}/health`))
    assert.equal(health.response.status, 200)
    assert.equal(health.value.product, 'PARÉ')
    const denied = await jsonResponse(await fetch(`${base}/v1/capabilities`))
    assert.equal(denied.response.status, 401)
    const allowed = await jsonResponse(await fetch(`${base}/v1/capabilities`, { headers: auth() }))
    assert.equal(allowed.response.status, 200)
    assert.equal(allowed.value.operator, 'One Hands')
  })
})

test('REST exposes v1 compatibility and v2 One Hands planning', async () => {
  await withServer({}, async (base) => {
    const source = { tenant: 'acme', project: 'launch', outcome: 'Build the brand, SEO and Instagram campaign.' }
    const legacy = await jsonResponse(await fetch(`${base}/v1/normalize`, { method: 'POST', headers: auth(), body: JSON.stringify(source) }))
    assert.equal(legacy.value.version, 'interface-request.v1')
    const v2 = await jsonResponse(await fetch(`${base}/v2/normalize`, { method: 'POST', headers: auth(), body: JSON.stringify({ ...source, workflow_id: 'brand-kit.v1', parent_stage: '00_intake', step_id: 'intake', action: 'discover' }) }))
    assert.equal(v2.value.version, 'interface-request.v2')
    const plan = await jsonResponse(await fetch(`${base}/v2/plan`, { method: 'POST', headers: auth(), body: JSON.stringify({ ...source, workflow_id: 'brand-kit.v1', parent_stage: '00_intake', step_id: 'intake', action: 'discover' }) }))
    assert.equal(plan.value.version, 'one-hands-preflight.v1')
    assert.ok(plan.value.plan.included_workflows.includes('seo.v1'))
    assert.ok(plan.value.plan.included_workflows.includes('social.v2'))
    assert.ok(plan.value.human_gates.some((item) => item.action === 'postiz-publish'))
  })
})

test('Postiz schedule fails before outbound fetch when work order lacks approval', async () => {
  let outbound = 0
  await withServer({
    postizBaseUrl: 'https://postiz.example', postizApiKey: 'secret',
    fetchImpl: async () => { outbound += 1; throw new Error('must not call provider') },
  }, async (base) => {
    const request = normalizeRequestV2({ tenant: 'acme', project: 'launch', outcome: 'Schedule content', workflow_id: 'social.v2', parent_stage: '50_publish', step_id: 'schedule', action: 'postiz-schedule' })
    const workOrder = compileWorkOrder(request, { work_order_id: 'WO-20260902-0100', created_at: '2026-09-02T21:00:00.000Z' })
    const result = await jsonResponse(await fetch(`${base}/v1/postiz/schedule`, { method: 'POST', headers: auth(), body: JSON.stringify({ work_order: workOrder, payload: {} }) }))
    assert.equal(result.response.status, 500)
    assert.match(result.value.error, /approval required/)
    assert.equal(outbound, 0)
  })
})

test('approved Postiz schedule calls configured provider without echoing API key in receipt', async () => {
  const calls = []
  await withServer({
    postizBaseUrl: 'https://postiz.example', postizApiKey: 'postiz-runtime-secret',
    fetchImpl: async (url, options) => {
      calls.push({ url, options })
      return { ok: true, status: 200, async json() { return { id: 'post-1' } } }
    },
  }, async (base) => {
    const request = normalizeRequestV2({ tenant: 'acme', project: 'launch', outcome: 'Schedule content', workflow_id: 'social.v2', parent_stage: '50_publish', step_id: 'schedule', action: 'postiz-schedule' })
    const pending = compileWorkOrder(request, { work_order_id: 'WO-20260902-0101', created_at: '2026-09-02T21:00:00.000Z' })
    const workOrder = approveWorkOrder(pending, { approved_by: 'owner', evidence_ref: 'approvals/AP-101.json', approved_at: '2026-09-02T21:01:00.000Z' })
    const result = await jsonResponse(await fetch(`${base}/v1/postiz/schedule`, { method: 'POST', headers: auth(), body: JSON.stringify({ work_order: workOrder, payload: { posts: [] } }) }))
    assert.equal(result.response.status, 200)
    assert.equal(calls[0].url, 'https://postiz.example/public/v1/posts')
    assert.equal(calls[0].options.headers.Authorization, 'postiz-runtime-secret')
    assert.equal(JSON.stringify(result.value).includes('postiz-runtime-secret'), false)
  })
})

test('Darya dispatch is unavailable unless a worker is explicitly configured', async () => {
  await withServer({}, async (base) => {
    const result = await jsonResponse(await fetch(`${base}/v1/darya/dispatch`, { method: 'POST', headers: auth(), body: JSON.stringify({ payload: {} }) }))
    assert.equal(result.response.status, 503)
  })
})
