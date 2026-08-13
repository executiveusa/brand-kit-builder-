import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile, appendFile } from 'node:fs/promises'
import path from 'node:path'

const QUALITY_FLOOR = 8.5
const MAX_ATTEMPTS = 3
const STAGES = [
  { name: '00_intake', role: 'Interviewer', output: 'brief.md', gate: 'G1' },
  { name: '10_strategy', role: 'Strategist', output: 'strategy.md', gate: 'G2' },
  { name: '20_design', role: 'Creative Director', output: 'design-direction.md', gate: 'G3' },
]

const sha256 = (value) => createHash('sha256').update(value).digest('hex')
const safeSegment = (value, name) => {
  if (typeof value !== 'string' || !value.trim()) throw new TypeError(`${name} is required`)
  const cleaned = value.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '')
  if (!cleaned) throw new TypeError(`${name} has no safe filesystem characters`)
  return cleaned
}

async function ensure(file) { await mkdir(path.dirname(file), { recursive: true }) }
async function put(file, content) { await ensure(file); await writeFile(file, content, 'utf8'); return { path: file, sha256: sha256(content) } }
async function event(ledger, payload) { await ensure(ledger); await appendFile(ledger, `${JSON.stringify(payload)}\n`, 'utf8') }

export function createHttpProvider({ name, kind, url, token }) {
  if (!name || !kind || !url) throw new TypeError('provider name, kind and url are required')
  return {
    name, kind,
    async execute(payload) {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error(`provider ${name} failed: ${response.status}`)
      return response.json()
    },
  }
}

export function createReferenceBuilder() {
  return {
    name: 'reference-builder', kind: 'builder',
    async execute({ stage, role, request, prior, retry_notes = [] }) {
      const facts = [
        `# ${role} — ${stage}`,
        '',
        `Outcome: ${request.outcome}`,
        `Tenant: ${request.tenant}`,
        `Project: ${request.project}`,
        '',
        '## Source-bound constraints',
        ...(request.constraints?.length ? request.constraints.map((item) => `- ${item}`) : ['- None supplied.']),
        '',
        '## Protected items',
        ...(request.protected_items?.length ? request.protected_items.map((item) => `- ${item}`) : ['- None supplied.']),
        '',
        `Prior stage receipts: ${prior.length}`,
        ...(retry_notes.length ? ['', '## Guardian retry notes', ...retry_notes.map((item) => `- ${item}`)] : []),
        '',
        '> Reference worker output: this proves orchestration and source preservation. It does not invent missing strategy, claims, visual assets, or research.',
      ]
      return { content: facts.join('\n'), metadata: { mode: 'reference-worker' } }
    },
  }
}

export function createReferenceGuardian({ scores = [9] } = {}) {
  let calls = 0
  return {
    name: 'reference-guardian', kind: 'guardian',
    async execute({ stage, artifact }) {
      const score = scores[Math.min(calls++, scores.length - 1)]
      return {
        score,
        passed: score >= QUALITY_FLOOR,
        notes: score >= QUALITY_FLOOR ? [] : [`${stage} scored ${score}; revise against the supplied constraints without inventing facts.`],
        artifact_sha256: sha256(artifact),
      }
    },
  }
}

export async function runFactory({ request, root, builder, guardian, now = () => new Date().toISOString() }) {
  if (!request || typeof request !== 'object') throw new TypeError('request is required')
  if (!builder || builder.kind !== 'builder') throw new TypeError('builder provider is required')
  if (!guardian || guardian.kind !== 'guardian') throw new TypeError('guardian provider is required')
  if (builder === guardian) throw new Error('builder and guardian must be independent provider objects')

  const tenant = safeSegment(request.tenant, 'tenant')
  const project = safeSegment(request.project, 'project')
  if (!request.outcome?.trim()) throw new TypeError('outcome is required')
  const workOrderId = request.work_order_id || `WO-${now().slice(0,10).replaceAll('-','')}-0001`
  const projectRoot = path.join(root, 'studio', 'projects', tenant, project)
  const ledger = path.join(projectRoot, '_ledger', 'events.jsonl')
  const receipts = []
  await event(ledger, { at: now(), work_order_id: workOrderId, state: 'running', gate: 'G0', event: 'work_order.started' })

  const prior = []
  for (const spec of STAGES) {
    let retryNotes = []
    let passed = false
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
      await event(ledger, { at: now(), work_order_id: workOrderId, stage: spec.name, role: spec.role, attempt, event: 'worker.started' })
      const built = await builder.execute({ stage: spec.name, role: spec.role, request, prior, retry_notes: retryNotes, attempt })
      if (!built?.content || typeof built.content !== 'string') throw new Error(`${builder.name} returned no content`)
      const file = path.join(projectRoot, spec.name, spec.output)
      const outputReceipt = await put(file, built.content)
      const verdict = await guardian.execute({ stage: spec.name, role: spec.role, request, artifact: built.content, receipt: outputReceipt, attempt })
      const score = Number(verdict?.score)
      if (!Number.isFinite(score)) throw new Error(`${guardian.name} returned no numeric score`)
      await event(ledger, { at: now(), work_order_id: workOrderId, stage: spec.name, gate: spec.gate, attempt, score, passed: score >= QUALITY_FLOOR, notes: verdict.notes ?? [], event: 'guardian.judged' })
      if (score >= QUALITY_FLOOR && verdict.passed !== false) {
        passed = true
        const receipt = { stage: spec.name, gate: spec.gate, ...outputReceipt, score, attempt }
        receipts.push(receipt)
        prior.push(receipt)
        await event(ledger, { at: now(), work_order_id: workOrderId, stage: spec.name, gate: spec.gate, attempt, event: 'gate.passed' })
        break
      }
      retryNotes = Array.isArray(verdict.notes) ? verdict.notes : [`Guardian score ${score} below ${QUALITY_FLOOR}.`]
      await event(ledger, { at: now(), work_order_id: workOrderId, stage: spec.name, attempt, notes: retryNotes, event: attempt < MAX_ATTEMPTS ? 'retry.queued' : 'work_order.escalated' })
    }
    if (!passed) {
      return { work_order_id: workOrderId, state: 'escalated', stage: spec.name, gate: spec.gate, receipts, ledger }
    }
  }

  const scorecard = JSON.stringify({ work_order_id: workOrderId, quality_floor: QUALITY_FLOOR, guardian: guardian.name, receipts }, null, 2)
  const scoreReceipt = await put(path.join(projectRoot, '30_validate', 'scorecard.json'), scorecard)
  receipts.push({ stage: '30_validate', gate: 'G4', ...scoreReceipt })
  await event(ledger, { at: now(), work_order_id: workOrderId, stage: '30_validate', gate: 'G4', event: 'gate.passed' })

  const delivery = [
    '# Delivery hold', '',
    `Work order: ${workOrderId}`,
    `Outcome: ${request.outcome.trim()}`,
    '',
    'All automated stages passed the configured quality floor.',
    'Publishing is intentionally blocked until the G5 human approval is recorded.',
  ].join('\n')
  const deliveryReceipt = await put(path.join(projectRoot, '40_deliver', 'delivery.md'), delivery)
  receipts.push({ stage: '40_deliver', gate: 'G5', ...deliveryReceipt })
  await event(ledger, { at: now(), work_order_id: workOrderId, stage: '40_deliver', gate: 'G5', requires_human: true, event: 'gate.pending' })

  return { work_order_id: workOrderId, state: 'gate_pending', stage: '40_deliver', gate: 'G5', requires_human: true, receipts, ledger, project_root: projectRoot }
}

export async function readLedger(file) {
  const content = await readFile(file, 'utf8')
  return content.trim().split('\n').filter(Boolean).map((line) => JSON.parse(line))
}
