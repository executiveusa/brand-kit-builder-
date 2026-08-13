import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { coldStart, exportPack, verifyPack } from '../src/pack.mjs'

async function fixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), 'pauli-pack-'))
  const source = path.join(root, 'source')
  await mkdir(path.join(source, '10_strategy'), { recursive: true })
  await mkdir(path.join(source, '20_design'), { recursive: true })
  await mkdir(path.join(source, '_ledger'), { recursive: true })
  await writeFile(path.join(source, '10_strategy', 'strategy.md'), '# Strategy\nApproved position: useful, specific, ownable.\n', 'utf8')
  await writeFile(path.join(source, '20_design', 'design-direction.md'), '# Design\nProtected wordmark. No generic gradients.\n', 'utf8')
  await writeFile(path.join(source, '_ledger', 'events.jsonl'), '{"event":"gate.passed","gate":"G3"}\n', 'utf8')
  return { root, source, destination: path.join(root, 'acme.pauli') }
}

test('export creates self-describing pack and cold-start needs no cloud', async () => {
  const f = await fixture()
  try {
    const exported = await exportPack({
      source: f.source,
      destination: f.destination,
      metadata: {
        tenant: 'acme', project: 'launch', current_stage: '20_design', next_action: 'Run independent validation.',
        protected_items: ['wordmark'], hard_bans: ['generic gradients'], requires: ['image.generate'],
      },
    })
    assert.ok(exported.files >= 6)
    const cold = await coldStart(f.destination)
    assert.deepEqual(cold, {
      tenant: 'acme', project: 'launch', current_stage: '20_design', next_action: 'Run independent validation.',
      protected_items: ['wordmark'], hard_bans: ['generic gradients'], requires: ['image.generate'], network_required_to_understand: false,
    })
    const agents = await readFile(path.join(f.destination, 'AGENTS.md'), 'utf8')
    assert.match(agents, /Cold start/)
    assert.doesNotMatch(agents, new RegExp(f.source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
  } finally { await rm(f.root, { recursive: true, force: true }) }
})

test('integrity verifier detects tampering', async () => {
  const f = await fixture()
  try {
    await exportPack({ source: f.source, destination: f.destination, metadata: { tenant:'acme', project:'launch' } })
    await writeFile(path.join(f.destination, '10_strategy', 'strategy.md'), 'tampered', 'utf8')
    const result = await verifyPack(f.destination)
    assert.equal(result.ok, false)
    assert.equal(result.path, '10_strategy/strategy.md')
    await assert.rejects(() => coldStart(f.destination), /integrity failed/)
  } finally { await rm(f.root, { recursive: true, force: true }) }
})

test('export rejects secret-like content before copying', async () => {
  const f = await fixture()
  try {
    await writeFile(path.join(f.source, '10_strategy', 'unsafe.txt'), 'api_key=abcdefghijklmnopqrstuvwxyz123456', 'utf8')
    await assert.rejects(
      () => exportPack({ source: f.source, destination: f.destination, metadata: { tenant:'acme', project:'launch' } }),
      /secret-like material rejected/,
    )
  } finally { await rm(f.root, { recursive: true, force: true }) }
})

test('requirements are symbolic and deduplicated, never secret values', async () => {
  const f = await fixture()
  try {
    await exportPack({ source: f.source, destination: f.destination, metadata: { tenant:'acme', project:'launch', requires:['image.generate','image.generate','web.research'] } })
    const data = JSON.parse(await readFile(path.join(f.destination, 'portability.json'), 'utf8'))
    assert.deepEqual(data.requires, ['image.generate','web.research'])
    assert.equal(data.secret_source, 'local-vault-or-host-environment')
  } finally { await rm(f.root, { recursive: true, force: true }) }
})
