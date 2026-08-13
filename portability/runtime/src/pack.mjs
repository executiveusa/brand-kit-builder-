import { createHash } from 'node:crypto'
import { cp, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'

const STAGES = ['00_intake','10_strategy','20_design','30_validate','40_deliver','50_publish']
const SECRET_PATTERNS = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\bsk-[A-Za-z0-9_-]{16,}\b/,
  /\bsb_secret_[A-Za-z0-9_-]{12,}\b/,
  /\b(?:api[_-]?key|secret|token|password)\s*[:=]\s*["']?[A-Za-z0-9_\-./+]{16,}/i,
]
const sha256 = (value) => createHash('sha256').update(value).digest('hex')

async function files(root, current = root) {
  const out = []
  for (const entry of await readdir(current, { withFileTypes: true })) {
    const full = path.join(current, entry.name)
    if (entry.isDirectory()) out.push(...await files(root, full))
    else if (entry.isFile()) out.push(path.relative(root, full).replaceAll(path.sep, '/'))
  }
  return out.sort()
}

async function assertNoSecrets(root) {
  for (const relative of await files(root)) {
    const full = path.join(root, relative)
    const info = await stat(full)
    if (info.size > 2_000_000) continue
    const text = await readFile(full, 'utf8').catch(() => '')
    if (SECRET_PATTERNS.some((pattern) => pattern.test(text))) throw new Error(`secret-like material rejected: ${relative}`)
  }
}

function router(meta) {
  return `# AGENTS — ${meta.project}\n\nCold start:\n1. Read CONTEXT.md.\n2. Read portability.json.\n3. Read manifest/brand-manifest.json when present.\n4. Read only the current stage and required prior receipts.\n5. Never invent credentials or write outside the current/next permitted stage.\n\nCanonical truth is inside this pack. Cloud state is optional.\n`
}

function context(meta) {
  return `# CONTEXT — ${meta.project}\n\nTenant: ${meta.tenant}\nProject: ${meta.project}\nCurrent stage: ${meta.current_stage}\nNext permitted action: ${meta.next_action}\n\nProtected items:\n${(meta.protected_items ?? []).map((x)=>`- ${x}`).join('\n') || '- none declared'}\n\nHard bans:\n${(meta.hard_bans ?? []).map((x)=>`- ${x}`).join('\n') || '- none declared'}\n`
}

export async function exportPack({ source, destination, metadata }) {
  if (!source || !destination || !metadata?.tenant || !metadata?.project) throw new TypeError('source, destination and metadata tenant/project are required')
  await assertNoSecrets(source)
  await mkdir(destination, { recursive: true })
  for (const stage of [...STAGES, '_ledger', 'assets', 'manifest']) {
    const from = path.join(source, stage)
    if (await stat(from).then(()=>true).catch(()=>false)) await cp(from, path.join(destination, stage), { recursive: true })
  }
  await writeFile(path.join(destination, 'AGENTS.md'), router(metadata), 'utf8')
  await writeFile(path.join(destination, 'CONTEXT.md'), context(metadata), 'utf8')
  const portability = {
    version: 'pauli-portability.v1', tenant: metadata.tenant, project: metadata.project,
    current_stage: metadata.current_stage ?? '00_intake', next_action: metadata.next_action ?? 'Review intake.',
    protected_items: metadata.protected_items ?? [], hard_bans: metadata.hard_bans ?? [],
    requires: [...new Set(metadata.requires ?? [])].sort(), secret_source: 'local-vault-or-host-environment',
  }
  await writeFile(path.join(destination, 'portability.json'), JSON.stringify(portability, null, 2), 'utf8')
  await assertNoSecrets(destination)
  const manifest = []
  for (const relative of await files(destination)) {
    if (relative === 'integrity.json') continue
    const bytes = await readFile(path.join(destination, relative))
    manifest.push({ path: relative, sha256: sha256(bytes), size: bytes.length })
  }
  await writeFile(path.join(destination, 'integrity.json'), JSON.stringify({ version:'pauli-integrity.v1', files: manifest }, null, 2), 'utf8')
  return { destination, files: manifest.length, integrity_sha256: sha256(await readFile(path.join(destination, 'integrity.json'))) }
}

export async function verifyPack(pack) {
  const index = JSON.parse(await readFile(path.join(pack, 'integrity.json'), 'utf8'))
  for (const item of index.files) {
    const bytes = await readFile(path.join(pack, item.path))
    if (sha256(bytes) !== item.sha256 || bytes.length !== item.size) return { ok: false, path: item.path }
  }
  return { ok: true, files: index.files.length }
}

export async function coldStart(pack) {
  const integrity = await verifyPack(pack)
  if (!integrity.ok) throw new Error(`integrity failed: ${integrity.path}`)
  const data = JSON.parse(await readFile(path.join(pack, 'portability.json'), 'utf8'))
  return {
    tenant: data.tenant,
    project: data.project,
    current_stage: data.current_stage,
    next_action: data.next_action,
    protected_items: data.protected_items,
    hard_bans: data.hard_bans,
    requires: data.requires,
    network_required_to_understand: false,
  }
}
