import { createHash } from 'node:crypto'
import {
  compileWorkOrder,
  normalizeRequestV2,
  requiresHumanApproval,
  validateWorkOrder,
} from '../../../../interfaces/runtime/src/one-hands.mjs'
import { compileWorkflowPlan, inferCompanionWorkflows, listWorkflows, loadWorkflowRegistry, resolveWorkflowStep } from './workflows.mjs'

const STAGES = ['00_intake', '10_strategy', '20_design', '30_validate', '40_deliver', '50_publish']

function workOrderId(date, index) {
  const day = date.slice(0, 10).replaceAll('-', '')
  return `WO-${day}-${String(index).padStart(4, '0')}`
}

export async function oneHandsCapabilities(root = process.cwd()) {
  const registry = await loadWorkflowRegistry(root)
  return {
    system: 'PARÉ',
    studio: 'Pauli Brand Studio',
    operator: 'One Hands',
    architecture: 'ICM',
    ownership_model: 'sovereign-installable',
    stages: STAGES,
    workflows: listWorkflows(registry),
    interfaces: ['REST', 'MCP', 'CLI', 'folder-drop', 'local'],
    execution_adapters: ['reference-worker', 'darya-http-compatible-worker'],
    publish_adapters: ['postiz'],
    laws: [
      'strategy-before-styling',
      'canonical-ICM-truth',
      'builder-critic-separation',
      'no-evidence-no-completion',
      'approval-before-external-publish-or-production',
      'client-owns-files-data-and-installation',
    ],
  }
}

export async function prepareOneHandsOutcome({ input, root = process.cwd(), now = () => new Date().toISOString() }) {
  const registry = await loadWorkflowRegistry(root)
  const request = normalizeRequestV2({
    ...input,
    workflow_id: input.workflow_id ?? 'brand-kit.v1',
    parent_stage: input.parent_stage ?? '00_intake',
    step_id: input.step_id ?? 'intake',
    action: input.action ?? 'discover',
  })
  const companions = Array.isArray(input.include_workflows)
    ? input.include_workflows
    : inferCompanionWorkflows(request.outcome)
  const plan = compileWorkflowPlan(registry, request.workflow_id, { include: companions })
  const createdAt = now()
  const work_orders = plan.steps.map((step, index) => {
    const stepRequest = normalizeRequestV2({
      ...request,
      workflow_id: step.workflow_id,
      parent_stage: step.parent_stage,
      step_id: step.step_id,
      action: step.action,
      approval_required: step.approval_required,
    })
    return compileWorkOrder(stepRequest, {
      work_order_id: workOrderId(createdAt, index + 1),
      created_at: createdAt,
    })
  })
  return {
    version: 'one-hands-preflight.v1',
    product: 'PARÉ',
    operator: 'One Hands',
    request,
    plan,
    work_orders,
    human_gates: work_orders.filter((item) => item.approval.required).map((item) => ({
      work_order_id: item.work_order_id,
      workflow_id: item.workflow_id,
      step_id: item.step_id,
      action: item.action,
      status: item.approval.status,
    })),
  }
}

export function validatePreparedPlan(preflight, registry) {
  if (!preflight || preflight.version !== 'one-hands-preflight.v1') throw new TypeError('one-hands-preflight.v1 is required')
  if (!Array.isArray(preflight.work_orders) || preflight.work_orders.length === 0) throw new TypeError('work orders are required')
  for (const workOrder of preflight.work_orders) {
    validateWorkOrder(workOrder)
    const step = resolveWorkflowStep(registry, workOrder.workflow_id, workOrder.step_id)
    if (step.parent_stage !== workOrder.parent_stage) throw new TypeError(`stage mismatch for ${workOrder.workflow_id}/${workOrder.step_id}`)
    if (step.action !== workOrder.action) throw new TypeError(`action mismatch for ${workOrder.workflow_id}/${workOrder.step_id}`)
    if (Boolean(step.approval_required || requiresHumanApproval(step.action)) !== Boolean(workOrder.approval.required)) {
      throw new TypeError(`approval mismatch for ${workOrder.workflow_id}/${workOrder.step_id}`)
    }
  }
  return true
}

export function createDaryaHttpWorker({ name = 'darya-worker', kind = 'builder', url, token, fetchImpl = fetch }) {
  if (!url || typeof url !== 'string') throw new TypeError('Darya worker URL is required')
  if (!['builder', 'guardian'].includes(kind)) throw new TypeError('Darya worker kind must be builder or guardian')
  return {
    name,
    kind,
    async execute(payload) {
      const response = await fetchImpl(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          protocol: 'pare-worker.v1',
          role: kind,
          payload,
        }),
      })
      if (!response.ok) throw new Error(`${name} failed: ${response.status}`)
      const result = await response.json()
      if (!result || typeof result !== 'object') throw new Error(`${name} returned invalid JSON`)
      return result
    },
  }
}

export function workerPayloadDigest(payload) {
  return createHash('sha256').update(JSON.stringify(payload)).digest('hex')
}
