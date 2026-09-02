import { readFile } from 'node:fs/promises'
import path from 'node:path'

const REGISTRY_PATH = path.join('studio', '_system', 'workflows', 'registry.v1.json')

export async function loadWorkflowRegistry(root = process.cwd()) {
  const file = path.join(root, REGISTRY_PATH)
  const parsed = JSON.parse(await readFile(file, 'utf8'))
  if (parsed?.version !== 'workflow-registry.v1' || !Array.isArray(parsed.workflows)) {
    throw new TypeError('invalid workflow registry')
  }
  const ids = new Set()
  for (const workflow of parsed.workflows) {
    if (!workflow?.workflow_id) throw new TypeError('workflow_id is required')
    if (ids.has(workflow.workflow_id)) throw new TypeError(`duplicate workflow_id: ${workflow.workflow_id}`)
    ids.add(workflow.workflow_id)
  }
  return parsed
}

export function listWorkflows(registry) {
  if (!registry?.workflows) throw new TypeError('workflow registry is required')
  return registry.workflows.map((workflow) => ({
    workflow_id: workflow.workflow_id,
    name: workflow.name,
    description: workflow.description,
    parent_stages: workflow.parent_stages,
    steps: workflow.steps?.map(({ step_id, parent_stage, action, approval_required }) => ({ step_id, parent_stage, action, approval_required })) ?? [],
    quality_floor: workflow.quality_floor,
  }))
}

export function resolveWorkflow(registry, workflowId) {
  const workflow = registry?.workflows?.find((item) => item.workflow_id === workflowId)
  if (!workflow) throw new TypeError(`unknown workflow: ${workflowId}`)
  return workflow
}

export function resolveWorkflowStep(registry, workflowId, stepId) {
  const workflow = resolveWorkflow(registry, workflowId)
  const step = workflow.steps?.find((item) => item.step_id === stepId)
  if (!step) throw new TypeError(`unknown step ${stepId} for workflow ${workflowId}`)
  return step
}

export function compileWorkflowPlan(registry, workflowId, { include = [] } = {}) {
  const selected = [resolveWorkflow(registry, workflowId)]
  for (const id of include) {
    if (!selected.some((item) => item.workflow_id === id)) selected.push(resolveWorkflow(registry, id))
  }
  const steps = selected.flatMap((workflow) => workflow.steps.map((step, index) => ({
    workflow_id: workflow.workflow_id,
    sequence: index + 1,
    ...step,
  })))
  return {
    version: 'workflow-plan.v1',
    primary_workflow: workflowId,
    included_workflows: selected.map((item) => item.workflow_id),
    steps,
    human_gates: steps.filter((step) => step.approval_required).map((step) => ({ workflow_id: step.workflow_id, step_id: step.step_id, action: step.action })),
  }
}

export function inferCompanionWorkflows(outcome = '') {
  const text = String(outcome).toLowerCase()
  const include = ['seo.v1']
  if (/social|instagram|linkedin|tiktok|facebook|youtube|campaign|post|content/.test(text)) include.push('social.v2')
  if (/book|brand book|flipbook|interactive document/.test(text)) include.push('flipbook.v1')
  if (/install|self[- ]host|sovereign|on[- ]prem|server|vps/.test(text)) include.push('sovereign-install.v1')
  return [...new Set(include)]
}
