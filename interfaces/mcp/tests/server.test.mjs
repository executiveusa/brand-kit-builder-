import test from 'node:test'
import assert from 'node:assert/strict'
import { handleRpc } from '../server.mjs'

test('initialize exposes MCP server identity', async () => {
  const response = await handleRpc({ jsonrpc: '2.0', id: 1, method: 'initialize', params: {} })
  assert.equal(response.result.serverInfo.name, 'pauli-design-factory')
  assert.ok(response.result.capabilities.tools)
})

test('tools/list exposes canonical Design Factory tools', async () => {
  const response = await handleRpc({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} })
  const names = response.result.tools.map((tool) => tool.name)
  assert.deepEqual(names, ['design_factory_normalize', 'design_factory_run_reference', 'design_factory_capabilities'])
})

test('normalize tool returns transport-neutral ICM contract', async () => {
  const response = await handleRpc({
    jsonrpc: '2.0', id: 3, method: 'tools/call',
    params: { name: 'design_factory_normalize', arguments: { tenant: 'Pauli', project: 'Hermes', outcome: 'Create a product UI' } }
  })
  assert.equal(response.result.isError, undefined)
  const payload = JSON.parse(response.result.content[0].text)
  assert.equal(payload.version, 'interface-request.v1')
  assert.equal(payload.tenant, 'Pauli')
  assert.equal(payload.project, 'Hermes')
  assert.equal(payload.outcome, 'Create a product UI')
  assert.match(payload.idempotency_key, /^[a-f0-9]{64}$/)
})

test('capabilities tells cold agents how to route', async () => {
  const response = await handleRpc({ jsonrpc: '2.0', id: 4, method: 'tools/call', params: { name: 'design_factory_capabilities', arguments: {} } })
  const payload = JSON.parse(response.result.content[0].text)
  assert.equal(payload.architecture, 'ICM')
  assert.equal(payload.transports.mcp_stdio, 'live')
  assert.ok(payload.skills.includes('gauntlet'))
})
