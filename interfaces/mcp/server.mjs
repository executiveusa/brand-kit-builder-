import readline from 'node:readline'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
import { fromMcp } from '../runtime/src/normalize.mjs'
import { createReferenceBuilder, createReferenceGuardian, runFactory } from '../../studio/_system/runtime/src/factory.mjs'

const PROTOCOL_VERSION = '2024-11-05'

const tools = [
  {
    name: 'design_factory_normalize',
    description: 'Normalize a Pauli Design Factory request into the canonical transport-neutral ICM request contract and idempotency key.',
    inputSchema: {
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
  },
  {
    name: 'design_factory_run_reference',
    description: 'Run the deterministic local reference Design Factory orchestration through ICM stages and stop at the G5 human approval gate. This proves wiring; it does not fabricate research or finished creative assets.',
    inputSchema: {
      type: 'object',
      required: ['tenant', 'project', 'outcome'],
      properties: {
        tenant: { type: 'string' },
        project: { type: 'string' },
        outcome: { type: 'string' },
        attachments: { type: 'array', items: { type: 'string' } },
        protected_items: { type: 'array', items: { type: 'string' } },
        constraints: { type: 'array', items: { type: 'string' } },
        requires_approval: { type: 'boolean' },
        root: { type: 'string', description: 'Optional Design Factory repository root. Defaults to PAULI_BRAND_STUDIO_ROOT or current working directory.' }
      },
      additionalProperties: true
    }
  },
  {
    name: 'design_factory_capabilities',
    description: 'Return the canonical Design Factory stages, quality gates, and integration surfaces so an agent can pass the walk test before choosing a workflow.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false }
  }
]

function textResult(value) {
  return { content: [{ type: 'text', text: JSON.stringify(value, null, 2) }] }
}

function errorResult(error) {
  return { isError: true, content: [{ type: 'text', text: error instanceof Error ? error.message : String(error) }] }
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
      transports: { mcp_stdio: 'live', rest: 'contract-defined; deployment/runtime separate', cli: 'normalized', folder_drop: 'normalized', local: 'normalized' },
      laws: ['strategy-before-styling', 'builder-and-critic-separated', 'no-evidence-no-completion', 'G5-human-approval-before-publish']
    })
  }
  if (name === 'design_factory_run_reference') {
    const request = fromMcp(args)
    const root = resolve(args.root || process.env.PAULI_BRAND_STUDIO_ROOT || process.cwd())
    const result = await runFactory({ request, root, builder: createReferenceBuilder(), guardian: createReferenceGuardian() })
    return textResult(result)
  }
  throw new Error(`unknown tool: ${name}`)
}

export async function handleRpc(message) {
  if (!message || message.jsonrpc !== '2.0') throw new Error('invalid JSON-RPC request')
  const { id, method, params = {} } = message
  if (method === 'initialize') {
    return { jsonrpc: '2.0', id, result: { protocolVersion: PROTOCOL_VERSION, capabilities: { tools: {} }, serverInfo: { name: 'pauli-design-factory', version: '0.1.0' } } }
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
