import test from 'node:test'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { createDaryaHttpWorker, oneHandsCapabilities, prepareOneHandsOutcome, validatePreparedPlan, workerPayloadDigest } from '../src/one-hands.mjs'
import { loadWorkflowRegistry } from '../src/workflows.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..', '..', '..', '..')

test('One Hands advertises sovereign PARÉ workflows from the canonical registry', async () => {
  const value = await oneHandsCapabilities(root)
  assert.equal(value.system, 'PARÉ')
  assert.equal(value.operator, 'One Hands')
  assert.equal(value.ownership_model, 'sovereign-installable')
  assert.ok(value.workflows.some((item) => item.workflow_id === 'brand-kit.v1'))
  assert.ok(value.workflows.some((item) => item.workflow_id === 'seo.v1'))
  assert.ok(value.workflows.some((item) => item.workflow_id === 'social.v2'))
  assert.ok(value.publish_adapters.includes('postiz'))
})

test('brand outcome automatically includes SEO and social when requested', async () => {
  const prepared = await prepareOneHandsOutcome({
    root,
    now: () => '2026-09-02T21:00:00.000Z',
    input: {
      tenant: 'acme',
      project: 'launch',
      outcome: 'Build the brand kit, website SEO and Instagram campaign.',
      attachments: ['brief.md'],
      constraints: ['no invented claims'],
    },
  })
  assert.equal(prepared.product, 'PARÉ')
  assert.ok(prepared.plan.included_workflows.includes('brand-kit.v1'))
  assert.ok(prepared.plan.included_workflows.includes('seo.v1'))
  assert.ok(prepared.plan.included_workflows.includes('social.v2'))
  assert.ok(prepared.human_gates.some((item) => item.action === 'postiz-schedule'))
  assert.ok(prepared.human_gates.some((item) => item.action === 'postiz-publish'))
  const registry = await loadWorkflowRegistry(root)
  assert.equal(validatePreparedPlan(prepared, registry), true)
})

test('sovereign/self-host outcome includes installation workflow and approval gate', async () => {
  const prepared = await prepareOneHandsOutcome({
    root,
    now: () => '2026-09-02T21:00:00.000Z',
    input: { tenant: 'acme', project: 'internal', outcome: 'Install this sovereign brand system on our own VPS.' },
  })
  assert.ok(prepared.plan.included_workflows.includes('sovereign-install.v1'))
  assert.ok(prepared.human_gates.some((item) => item.action === 'install-on-owner-runtime'))
})

test('Darya adapter sends bounded worker protocol without changing canonical request shape', async () => {
  const calls = []
  const fetchImpl = async (url, options) => {
    calls.push({ url, options })
    return { ok: true, async json() { return { content: 'worker output' } } }
  }
  const worker = createDaryaHttpWorker({ url: 'http://darya.local/worker', token: 'runtime-secret', fetchImpl })
  const result = await worker.execute({ stage: '20_design', request: { outcome: 'Create SVG system' } })
  assert.equal(result.content, 'worker output')
  assert.equal(calls.length, 1)
  const body = JSON.parse(calls[0].options.body)
  assert.equal(body.protocol, 'pare-worker.v1')
  assert.equal(body.role, 'builder')
  assert.equal(calls[0].options.headers.authorization, 'Bearer runtime-secret')
  assert.match(workerPayloadDigest(body), /^[a-f0-9]{64}$/)
})
