import { createHash } from 'node:crypto'
import { fromCli, fromFolderDrop, fromLocal, fromMcp, fromPopebot, fromRest } from './normalize.mjs'

const STAGES = new Set(['00_intake', '10_strategy', '20_design', '30_validate', '40_deliver', '50_publish'])
const SENSITIVE_ACTIONS = new Set([
  'postiz-schedule',
  'postiz-publish',
  'publish',
  'schedule',
  'promote',
  'production-promote',
  'install-on-owner-runtime',
])

const clean = (value) => typeof value === 'string' ? value.trim() : ''
const cleanList = (value) => Array.isArray(value) ? [...new Set(value.map(clean).filter(Boolean))].sort() : []

function required(name, value) {
  const result = clean(value)
  if (!result) throw new TypeError(`${name} is required`)
  return result
}

function stage(value) {
  const result = required('parent_stage', value)
  if (!STAGES.has(result)) throw new TypeError(`invalid parent_stage: ${result}`)
  return result
}

function transportBase(transport, input) {
  if (transport === 'rest') return fromRest(input)
  if (transport === 'mcp') return fromMcp(input)
  if (transport === 'folder-drop') return fromFolderDrop(input)
  if (transport === 'popebot') return fromPopebot(input)
  if (transport === 'local') return fromLocal(input)
  throw new TypeError(`unsupported transport: ${transport}`)
}

function routingFromCli(argv) {
  const pairs = new Map()
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index]?.replace(/^--/, '')
    if (key) pairs.set(key, argv[index + 1] ?? '')
  }
  return {
    workflow_id: pairs.get('workflow'),
    parent_stage: pairs.get('stage'),
    step_id: pairs.get('step'),
    action: pairs.get('action'),
    requested_outputs: pairs.get('outputs')?.split(',') ?? [],
    approval_required: pairs.get('approval-required') === 'true',
  }
}

function semanticPayload(request) {
  return {
    version: 'interface-request.v2',
    tenant: request.tenant,
    project: request.project,
    outcome: request.outcome,
    workflow_id: request.workflow_id,
    parent_stage: request.parent_stage,
    step_id: request.step_id,
    action: request.action,
    attachments: request.attachments,
    protected_items: request.protected_items,
    constraints: request.constraints,
    requested_outputs: request.requested_outputs,
    approval_required: request.approval_required,
  }
}

export function semanticKeyV2(request) {
  return createHash('sha256').update(JSON.stringify(semanticPayload(request))).digest('hex')
}

export function requiresHumanApproval(action) {
  const value = clean(action).toLowerCase()
  return SENSITIVE_ACTIONS.has(value) || /(^|[-_.])(publish|schedule|promote)([-_.]|$)/.test(value)
}

function normalizeRouting(base, input = {}) {
  const action = required('action', input.action ?? 'discover')
  const request = {
    version: 'interface-request.v2',
    tenant: base.tenant,
    project: base.project,
    outcome: base.outcome,
    workflow_id: required('workflow_id', input.workflow_id ?? 'brand-kit.v1'),
    parent_stage: stage(input.parent_stage ?? '00_intake'),
    step_id: required('step_id', input.step_id ?? action),
    action,
    attachments: cleanList(base.attachments),
    protected_items: cleanList(base.protected_items),
    constraints: cleanList(base.constraints),
    requested_outputs: cleanList(input.requested_outputs),
    approval_required: Boolean(input.approval_required || base.requires_approval || requiresHumanApproval(action)),
  }
  return { ...request, idempotency_key: semanticKeyV2(request) }
}

export function normalizeRequestV2(input, { transport = 'local' } = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new TypeError('request must be an object')
  const envelope = transport === 'folder-drop' ? (input.request ?? input) : input
  return normalizeRouting(transportBase(transport, input), envelope)
}

export function fromCliV2(argv) {
  return normalizeRouting(fromCli(argv), routingFromCli(argv))
}

export function fromRestV2(body) { return normalizeRequestV2(body, { transport: 'rest' }) }
export function fromMcpV2(args) { return normalizeRequestV2(args, { transport: 'mcp' }) }
export function fromFolderDropV2(document) { return normalizeRequestV2(document, { transport: 'folder-drop' }) }
export function fromPopebotV2(turn) {
  const routing = turn?.context?.routing ?? {}
  const base = fromPopebot(turn)
  return normalizeRouting(base, routing)
}
export function fromLocalV2(input) { return normalizeRequestV2(input, { transport: 'local' }) }

export function compileWorkOrder(request, {
  work_order_id,
  created_at = new Date().toISOString(),
  state = 'queued',
} = {}) {
  if (!request || request.version !== 'interface-request.v2') throw new TypeError('interface-request.v2 is required')
  const approvalRequired = Boolean(request.approval_required || requiresHumanApproval(request.action))
  const value = {
    version: 'work-order.v2',
    work_order_id: required('work_order_id', work_order_id),
    workflow_id: request.workflow_id,
    parent_stage: request.parent_stage,
    step_id: request.step_id,
    action: request.action,
    tenant: request.tenant,
    project: request.project,
    outcome: request.outcome,
    state,
    attempt: 1,
    inputs: {
      attachments: request.attachments,
      protected_items: request.protected_items,
      constraints: request.constraints,
    },
    requested_outputs: request.requested_outputs,
    approval: {
      required: approvalRequired,
      status: approvalRequired ? 'pending' : 'not_required',
    },
    idempotency_key: request.idempotency_key,
    created_at,
  }
  return validateWorkOrder(value)
}

export function validateWorkOrder(value) {
  if (!value || value.version !== 'work-order.v2') throw new TypeError('work-order.v2 is required')
  required('work_order_id', value.work_order_id)
  required('workflow_id', value.workflow_id)
  stage(value.parent_stage)
  required('step_id', value.step_id)
  required('action', value.action)
  required('tenant', value.tenant)
  required('project', value.project)
  required('outcome', value.outcome)
  if (!/^[a-f0-9]{64}$/.test(clean(value.idempotency_key))) throw new TypeError('idempotency_key must be sha256')
  if (!value.approval || typeof value.approval.required !== 'boolean') throw new TypeError('approval contract is required')
  if (requiresHumanApproval(value.action) && value.approval.required !== true) throw new TypeError(`action ${value.action} must require approval`)
  return value
}

export function assertActionAuthorized(workOrder) {
  validateWorkOrder(workOrder)
  if (!requiresHumanApproval(workOrder.action)) return true
  if (workOrder.approval.status !== 'approved') throw new Error(`approval required for action: ${workOrder.action}`)
  if (!clean(workOrder.approval.evidence_ref)) throw new Error(`approval evidence required for action: ${workOrder.action}`)
  return true
}

export function approveWorkOrder(workOrder, { approved_by, approved_at = new Date().toISOString(), evidence_ref } = {}) {
  validateWorkOrder(workOrder)
  if (!workOrder.approval.required) return { ...workOrder, approval: { required: false, status: 'not_required' } }
  return {
    ...workOrder,
    approval: {
      required: true,
      status: 'approved',
      approved_by: required('approved_by', approved_by),
      approved_at,
      evidence_ref: required('evidence_ref', evidence_ref),
    },
  }
}

export function workflowReceipt(workOrder, {
  state = workOrder.state,
  at = new Date().toISOString(),
  outputs = [],
  evidence = [],
  rollback_ref,
  notes = [],
} = {}) {
  validateWorkOrder(workOrder)
  return {
    version: 'workflow-receipt.v2',
    work_order_id: workOrder.work_order_id,
    workflow_id: workOrder.workflow_id,
    step_id: workOrder.step_id,
    action: workOrder.action,
    state,
    tenant: workOrder.tenant,
    project: workOrder.project,
    idempotency_key: workOrder.idempotency_key,
    at,
    outputs,
    evidence,
    approval: {
      required: workOrder.approval.required,
      status: workOrder.approval.status,
      ...(workOrder.approval.evidence_ref ? { evidence_ref: workOrder.approval.evidence_ref } : {}),
    },
    ...(rollback_ref ? { rollback_ref } : {}),
    notes: cleanList(notes),
  }
}
