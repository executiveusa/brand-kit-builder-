import readline from 'node:readline'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
import { fromMcp } from '../runtime/src/normalize.mjs'
import { fromMcpV2, validateWorkOrder } from '../runtime/src/one-hands.mjs'
import { createReferenceBuilder, createReferenceGuardian, runFactory } from '../../studio/_system/runtime/src/factory.mjs'
import { oneHandsCapabilities, prepareOneHandsOutcome } from '../../studio/_system/runtime/src/one-hands.mjs'

const PROTOCOL_VERSION = '2024-11-05'

const v1RequestSchema = {
  type: 'object',
  required: ['tenant', 'project', 'outcome'],
  properties: {
    tenant: { type: 'string' },
    project: { type: 'string' },
    outcome: { type: 'string' },
    attachments: { type: 'array', items: { type: 'string' } },
    protected_items: { type: 'array', items: { type: 'string' } },
    constraints: { type: 'array', items: { type: 'string' } },
    requires_approval: { type: 'boolean' }
  },
  additionalProperties: true
}

const v2RequestSchema = {
  ...v1RequestSchema,
  properties: {
    ...v1RequestSchema.properties,
    workflow_id: { type: 'string' },
    parent_stage: { type: 'string' },
    step_id: { type: 'string' },
    action: { type: 'string' },
    requested_outputs: { type: 'array', items: { type: 'string' } },
    approval_required: { type: 'boolean' },
    include_workflows: { type: 'array', items: { type: 'string' } },
    root: { type: 'string' }
  }
}

const tools = [
  {
    name: 'design_factory_normalize',
    description: 'Normalize a legacy Pauli Design Factory request into the v1 transport-neutral ICM request contract and idempotency key.',
    inputSchema: v1RequestSchema
  },
  {
    name: 'design_factory_run_reference',
    description: 'Run the deterministic local reference Design Factory orchestration through ICM stages and stop at the G5 human approval gate. This proves wiring; it does not fabricate research or finished creative assets.',
    inputSchema: {
      ...v1RequestSchema,
      properties: {
        ...v1RequestSchema.properties,
        root: { type: 'string', description: 'Optional Brand Studio repository root. Defaults to PAULI_BRAND_STUDIO_ROOT or current working directory.' }
      }
    }
  },
  {
    name: 'design_factory_capabilities',
    description: 'Return the legacy Design Factory stage/quality surface. Kept for backwards compatibility.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false }
  },
  {
    name: 'brand_studio_normalize_v2',
    description: 'Normalize an agent request into PARÉ interface-request.v2 with workflow routing and semantic idempotency. Provider/auth fields are discarded.',
    inputSchema: v2RequestSchema
  },
  {
    name: 'brand_studio_workflow_list',
    description: 'List the canonical PARÉ workflows, ICM stages and approval boundaries from the repository workflow registry.',
    inputSchema: { type: 'object', properties: { root: { type: 'string' } }, additionalProperties: false }
  },
  {
    name: 'brand_studio_plan',
    description: 'Have One Hands compile an outcome into a full versioned workflow plan and work-order.v2 set without executing or publishing anything.',
    inputSchema: v2RequestSchema
  },
  {
    name: 'brand_studio_work_order_validate',
    description: 'Validate a work-order.v2 object and enforce PARÉ sensitive-action approval requirements.',
    inputSchema: {
      type: 'object',
      required: ['work_order'],
      properties: { work_order: { type: 'object', additionalProperties: true } },
      additionalProperties: false
    }
  }
]

function textResult(value) {
  return { content: [{ type: 'text', text: JSON.stringify(value, null, 2) }] }
}

function errorResult(error) {
  return { isError: true, content: [{ type: 'text', text: error instanceof Error ? error.message : String(error) }] }
}

function rootFrom(args = {}) {
  return resolve(args.root || process.env.PAULI_BRAND_STUDIO_ROOT || process.cwd())
}

export async function callTool(name, args = {}) {
  if (name === 'design_factory_normalize') return textResult(fromMcp(args))
  if (name === 'design_factory_capabilities') {
    return textResult({
      system: 'Pauli Design Factory',
      architecture: 'ICM',
      repo: 'executiveusa/brand-kit-builder-',
      stages: ['00_intake', '10_strategy', '20_design', '30_validate', '40_deliver', '50_publish'],
      gates: ['G0', 'G1', 'G2', 'G3', 'G4', 'G5'],
      skills: ['brand-discovery', 'collins-level', 'design-guardian', 'gauntlet', 'design-proof', 'design-delivery'],
      transports: { mcp_stdio: 'live', rest: 'contract-defined; deployment/runtime separate', cli: 'live', folder_drop: 'normalized', local: 'normalized' },
      laws: ['strategy-before-styling', 'builder-and-critic-separated', 'no-evidence-no-completion', 'G5-human-approval-before-publish']
    })
  }
  if (name === 'design_factory_run_reference') {
    const request = fromMcp(args)
    const result = await runFactory({ request, root: rootFrom(args), builder: createReferenceBuilder(), guardian: createReferenceGuardian() })
    return textResult(result)
  }
  if (name === 'brand_studio_normalize_v2') return textResult(fromMcpV2(args))
  if (name === 'brand_studio_workflow_list') return textResult(await oneHandsCapabilities(rootFrom(args)))
  if (name === 'brand_studio_plan') {
    const request = fromMcpV2(args)
    return textResult(await prepareOneHandsOutcome({ input: { ...request, include_workflows: args.include_workflows }, root: rootFrom(args) }))
  }
  if (name === 'brand_studio_work_order_validate') {
    validateWorkOrder(args.work_order)
    return textResult({ valid: true, version: 'work-order.v2', work_order_id: args.work_order.work_order_id })
  }
  throw new Error(`unknown tool: ${name}`)
}

export async function handleRpc(message) {
  if (!message || message.jsonrpc !== '2.0') throw new Error('invalid JSON-RPC request')
  const { id, method, params = {} } = message
  if (method === 'initialize') {
    return { jsonrpc: '2.0', id, result: { protocolVersion: PROTOCOL_VERSION, capabilities: { tools: {} }, serverInfo: { name: 'pare-brand-studio', version: '0.2.0' } } }
  }
  if (method === 'tools/list') return { jsonrpc: '2.0', id, result: { tools } }
  if (method === 'tools/call') {
    try {
      return { jsonrpc: '2.0', id, result: await callTool(params.name, params.arguments || {}) }
    } catch (error) {
      return { jsonrpc: '2.0', id, result: errorResult(error) }
    }
  }
  if (method?.startsWith('notifications/')) return null
  return { jsonrpc: '2.0', id, error: { code: -32601, message: `Method not found: ${method}` } }
}

export async function serve() {
  const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity })
  for await (const line of rl) {
    if (!line.trim()) continue
    try {
      const response = await handleRpc(JSON.parse(line))
      if (response) process.stdout.write(`${JSON.stringify(response)}\n`)
    } catch (error) {
      process.stdout.write(`${JSON.stringify({ jsonrpc: '2.0', id: null, error: { code: -32603, message: error instanceof Error ? error.message : String(error) } })}\n`)
    }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) serve()
