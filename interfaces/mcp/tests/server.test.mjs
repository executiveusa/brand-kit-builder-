import test from 'node:test'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { handleRpc } from '../server.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..')

async function call(id, name, args = {}) {
  return handleRpc({ jsonrpc: '2.0', id, method: 'tools/call', params: { name, arguments: args } })
}

function payload(response) {
  return JSON.parse(response.result.content[0].text)
}

test('initialize exposes PARÉ MCP server identity', async () => {
  const response = await handleRpc({ jsonrpc: '2.0', id: 1, method: 'initialize', params: {} })
  assert.equal(response.result.serverInfo.name, 'pare-brand-studio')
  assert.ok(response.result.capabilities.tools)
})

test('tools/list preserves legacy tools and exposes One Hands workflow tools', async () => {
  const response = await handleRpc({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} })
  const names = response.result.tools.map((tool) => tool.name)
  for (const name of [
    'design_factory_normalize',
    'design_factory_run_reference',
    'design_factory_capabilities',
    'brand_studio_normalize_v2',
    'brand_studio_workflow_list',
    'brand_studio_plan',
    'brand_studio_work_order_validate',
  ]) assert.ok(names.includes(name), `missing ${name}`)
})

test('legacy normalize tool remains transport-neutral v1', async () => {
  const response = await call(3, 'design_factory_normalize', { tenant: 'Pauli', project: 'Hermes', outcome: 'Create a product UI' })
  assert.equal(response.result.isError, undefined)
  const value = payload(response)
  assert.equal(value.version, 'interface-request.v1')
  assert.equal(value.tenant, 'Pauli')
  assert.match(value.idempotency_key, /^[a-f0-9]{64}$/)
})

test('v2 normalize adds workflow routing and strips provider fields', async () => {
  const response = await call(4, 'brand_studio_normalize_v2', {
    tenant: 'Pauli', project: 'Brand', outcome: 'Build SVG masters', workflow_id: 'brand-kit.v1', parent_stage: '20_design', step_id: 'svg', action: 'engineer-svg-system',
    authorization: 'secret', model: 'provider-model',
  })
  const value = payload(response)
  assert.equal(value.version, 'interface-request.v2')
  assert.equal(value.workflow_id, 'brand-kit.v1')
  assert.equal('authorization' in value, false)
  assert.equal('model' in value, false)
})

test('workflow list tells cold agents how to route sovereign PARÉ', async () => {
  const response = await call(5, 'brand_studio_workflow_list', { root: repoRoot })
  const value = payload(response)
  assert.equal(value.system, 'PARÉ')
  assert.equal(value.operator, 'One Hands')
  assert.equal(value.ownership_model, 'sovereign-installable')
  assert.ok(value.workflows.some((item) => item.workflow_id === 'seo.v1'))
})

test('One Hands plan weaves SEO and requested social into one plan', async () => {
  const response = await call(6, 'brand_studio_plan', {
    root: repoRoot,
    tenant: 'Pauli', project: 'Brand', outcome: 'Build our brand, SEO and Instagram campaign.',
    workflow_id: 'brand-kit.v1', parent_stage: '00_intake', step_id: 'intake', action: 'discover',
  })
  const value = payload(response)
  assert.equal(value.version, 'one-hands-preflight.v1')
  assert.ok(value.plan.included_workflows.includes('seo.v1'))
  assert.ok(value.plan.included_workflows.includes('social.v2'))
  assert.ok(value.human_gates.some((item) => item.action === 'postiz-publish'))
})

test('work-order validation fails closed when a sensitive action does not require approval', async () => {
  const response = await call(7, 'brand_studio_work_order_validate', {
    work_order: {
      version: 'work-order.v2', work_order_id: 'WO-20260902-0001', workflow_id: 'social.v2', parent_stage: '50_publish', step_id: 'publish', action: 'postiz-publish',
      tenant: 'pauli', project: 'brand', outcome: 'Publish approved content', state: 'queued', attempt: 1,
      inputs: {}, requested_outputs: [], approval: { required: false, status: 'not_required' },
      idempotency_key: 'a'.repeat(64), created_at: '2026-09-02T21:00:00.000Z'
    }
  })
  assert.equal(response.result.isError, true)
  assert.match(response.result.content[0].text, /must require approval/)
})

test('legacy capabilities remain available', async () => {
  const response = await call(8, 'design_factory_capabilities', {})
  const value = payload(response)
  assert.equal(value.architecture, 'ICM')
  assert.equal(value.transports.mcp_stdio, 'live')
  assert.ok(value.skills.includes('gauntlet'))
})
