import { createHash } from 'node:crypto'

const clean = (value) => typeof value === 'string' ? value.trim() : ''
const cleanList = (value) => Array.isArray(value) ? [...new Set(value.map(clean).filter(Boolean))].sort() : []

function required(name, value) {
  const result = clean(value)
  if (!result) throw new TypeError(`${name} is required`)
  return result
}

export function semanticKey(input) {
  const stable = JSON.stringify({
    tenant: required('tenant', input.tenant),
    project: required('project', input.project),
    outcome: required('outcome', input.outcome),
    attachments: cleanList(input.attachments),
    protected_items: cleanList(input.protected_items),
    constraints: cleanList(input.constraints),
    requires_approval: Boolean(input.requires_approval),
  })
  return createHash('sha256').update(stable).digest('hex')
}

export function normalizeRequest(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new TypeError('request must be an object')
  const request = {
    version: 'interface-request.v1',
    tenant: required('tenant', input.tenant),
    project: required('project', input.project),
    outcome: required('outcome', input.outcome),
    attachments: cleanList(input.attachments),
    protected_items: cleanList(input.protected_items),
    constraints: cleanList(input.constraints),
    requires_approval: Boolean(input.requires_approval),
  }
  return { ...request, idempotency_key: semanticKey(request) }
}

export function fromRest(body) {
  return normalizeRequest(body)
}

export function fromMcp(args) {
  return normalizeRequest(args)
}

export function fromCli(argv) {
  const pairs = new Map()
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index]?.replace(/^--/, '')
    if (key) pairs.set(key, argv[index + 1] ?? '')
  }
  return normalizeRequest({
    tenant: pairs.get('tenant'), project: pairs.get('project'), outcome: pairs.get('outcome'),
    attachments: pairs.get('attachments')?.split(',') ?? [],
    protected_items: pairs.get('protected')?.split(',') ?? [],
    constraints: pairs.get('constraints')?.split(',') ?? [],
    requires_approval: pairs.get('requires-approval') === 'true',
  })
}

export function fromFolderDrop(document) {
  return normalizeRequest(document?.request ?? document)
}

export function fromPopebot(turn) {
  return normalizeRequest({
    tenant: turn?.context?.tenant,
    project: turn?.context?.project,
    outcome: turn?.message,
    attachments: turn?.attachments,
    protected_items: turn?.context?.protected_items,
    constraints: turn?.context?.constraints,
    requires_approval: turn?.context?.requires_approval,
  })
}

export function fromLocal(input) {
  return normalizeRequest(input)
}

export function receipt({ work_order_id, state, request }) {
  const normalized = normalizeRequest(request)
  if (!clean(work_order_id)) throw new TypeError('work_order_id is required')
  if (!clean(state)) throw new TypeError('state is required')
  return {
    version: 'interface-receipt.v1',
    work_order_id: clean(work_order_id),
    state: clean(state),
    idempotency_key: normalized.idempotency_key,
    tenant: normalized.tenant,
    project: normalized.project,
  }
}
