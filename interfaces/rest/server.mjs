import http from 'node:http'
import { readFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { extname, resolve, sep } from 'node:path'
import { fromRest } from '../runtime/src/normalize.mjs'
import { fromRestV2, validateWorkOrder } from '../runtime/src/one-hands.mjs'
import { createDaryaHttpWorker, oneHandsCapabilities, prepareOneHandsOutcome } from '../../studio/_system/runtime/src/one-hands.mjs'
import { createPostizAdapter } from '../../studio/_system/adapters/postiz/adapter.mjs'

const MAX_BODY_BYTES = 1_000_000
const CONTENT_TYPES = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.mjs', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.webp', 'image/webp'],
  ['.ico', 'image/x-icon'],
  ['.woff2', 'font/woff2'],
])

function json(res, status, value) {
  const body = JSON.stringify(value)
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(body),
    'cache-control': 'no-store',
  })
  res.end(body)
}

function error(res, status, message) {
  json(res, status, { error: message })
}

async function readJson(req) {
  const chunks = []
  let total = 0
  for await (const chunk of req) {
    total += chunk.length
    if (total > MAX_BODY_BYTES) throw Object.assign(new Error('request body too large'), { statusCode: 413 })
    chunks.push(chunk)
  }
  if (!chunks.length) return {}
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    throw Object.assign(new Error('invalid JSON body'), { statusCode: 400 })
  }
}

function bearer(req) {
  const value = req.headers.authorization
  if (!value || !value.startsWith('Bearer ')) return ''
  return value.slice('Bearer '.length)
}

function authorized(req, apiToken, allowInsecureLocal) {
  if (apiToken) return bearer(req) === apiToken
  if (!allowInsecureLocal) return false
  const address = req.socket.remoteAddress || ''
  return address === '127.0.0.1' || address === '::1' || address === '::ffff:127.0.0.1'
}

function inside(root, file) {
  return file === root || file.startsWith(`${root}${sep}`)
}

async function staticFile(webRoot, pathname) {
  if (!webRoot) return null
  const root = resolve(webRoot)
  let decoded
  try { decoded = decodeURIComponent(pathname) } catch { return null }
  const requested = decoded === '/' ? '/index.html' : decoded
  const candidate = resolve(root, `.${requested}`)
  if (!inside(root, candidate)) return null
  try {
    const body = await readFile(candidate)
    return { body, contentType: CONTENT_TYPES.get(extname(candidate).toLowerCase()) || 'application/octet-stream', immutable: requested.startsWith('/assets/') }
  } catch (cause) {
    if (cause?.code !== 'ENOENT' && cause?.code !== 'EISDIR') throw cause
  }
  if (extname(requested)) return null
  try {
    const fallback = resolve(root, 'index.html')
    const body = await readFile(fallback)
    return { body, contentType: 'text/html; charset=utf-8', immutable: false }
  } catch (cause) {
    if (cause?.code === 'ENOENT') return null
    throw cause
  }
}

function sendStatic(res, file) {
  res.writeHead(200, {
    'content-type': file.contentType,
    'content-length': file.body.length,
    'cache-control': file.immutable ? 'public, max-age=31536000, immutable' : 'no-cache',
    'x-content-type-options': 'nosniff',
    'referrer-policy': 'strict-origin-when-cross-origin',
  })
  res.end(file.body)
}

export function createPareRestServer({
  root = process.env.PAULI_BRAND_STUDIO_ROOT || process.cwd(),
  apiToken = process.env.PARE_API_TOKEN || '',
  allowInsecureLocal = process.env.PARE_ALLOW_INSECURE_LOCAL === 'true',
  webDist = process.env.PARE_WEB_DIST || '',
  postizBaseUrl = process.env.POSTIZ_BASE_URL || '',
  postizApiKey = process.env.POSTIZ_API_KEY || '',
  daryaWorkerUrl = process.env.DARYA_WORKER_URL || '',
  daryaWorkerToken = process.env.DARYA_WORKER_TOKEN || '',
  fetchImpl = fetch,
} = {}) {
  const repoRoot = resolve(root)

  return http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url || '/', 'http://localhost')
      if (req.method === 'GET' && url.pathname === '/health') {
        return json(res, 200, { status: 'ok', product: 'PARÉ', service: 'brand-studio-rest' })
      }

      if (url.pathname.startsWith('/v1/') || url.pathname.startsWith('/v2/')) {
        if (!authorized(req, apiToken, allowInsecureLocal)) return error(res, 401, 'unauthorized')

        if (req.method === 'GET' && url.pathname === '/v1/capabilities') {
          return json(res, 200, await oneHandsCapabilities(repoRoot))
        }
        if (req.method === 'GET' && url.pathname === '/v1/workflows') {
          const capabilities = await oneHandsCapabilities(repoRoot)
          return json(res, 200, { workflows: capabilities.workflows })
        }
        if (req.method === 'POST' && url.pathname === '/v1/normalize') {
          return json(res, 200, fromRest(await readJson(req)))
        }
        if (req.method === 'POST' && url.pathname === '/v2/normalize') {
          return json(res, 200, fromRestV2(await readJson(req)))
        }
        if (req.method === 'POST' && url.pathname === '/v2/plan') {
          const input = await readJson(req)
          const normalized = fromRestV2(input)
          return json(res, 200, await prepareOneHandsOutcome({ input: { ...normalized, include_workflows: input.include_workflows }, root: repoRoot }))
        }
        if (req.method === 'POST' && url.pathname === '/v2/work-orders/validate') {
          const body = await readJson(req)
          validateWorkOrder(body.work_order)
          return json(res, 200, { valid: true, work_order_id: body.work_order.work_order_id })
        }
        if (req.method === 'GET' && url.pathname === '/v1/postiz/integrations') {
          if (!postizBaseUrl || !postizApiKey) return error(res, 503, 'Postiz adapter is not configured')
          const adapter = createPostizAdapter({ baseUrl: postizBaseUrl, apiKey: postizApiKey, fetchImpl })
          return json(res, 200, await adapter.integrations())
        }
        if (req.method === 'POST' && url.pathname === '/v1/postiz/schedule') {
          if (!postizBaseUrl || !postizApiKey) return error(res, 503, 'Postiz adapter is not configured')
          const body = await readJson(req)
          validateWorkOrder(body.work_order)
          const adapter = createPostizAdapter({ baseUrl: postizBaseUrl, apiKey: postizApiKey, fetchImpl })
          return json(res, 200, await adapter.schedule({ workOrder: body.work_order, payload: body.payload, rollback_ref: body.rollback_ref }))
        }
        if (req.method === 'POST' && url.pathname === '/v1/darya/dispatch') {
          if (!daryaWorkerUrl) return error(res, 503, 'Darya worker is not configured')
          const body = await readJson(req)
          const worker = createDaryaHttpWorker({
            name: body.name || 'darya-worker',
            kind: body.kind || 'builder',
            url: daryaWorkerUrl,
            token: daryaWorkerToken,
            fetchImpl,
          })
          return json(res, 200, await worker.execute(body.payload || {}))
        }
        return error(res, 404, 'not found')
      }

      if (req.method === 'GET') {
        const file = await staticFile(webDist, url.pathname)
        if (file) return sendStatic(res, file)
      }
      return error(res, 404, 'not found')
    } catch (cause) {
      const status = Number.isInteger(cause?.statusCode) ? cause.statusCode : (cause instanceof TypeError ? 400 : 500)
      return error(res, status, cause instanceof Error ? cause.message : String(cause))
    }
  })
}

export async function start({ host = process.env.HOST || '127.0.0.1', port = Number(process.env.PORT || 8788) } = {}) {
  const apiToken = process.env.PARE_API_TOKEN || ''
  const allowInsecureLocal = process.env.PARE_ALLOW_INSECURE_LOCAL === 'true'
  if (!apiToken && !allowInsecureLocal) {
    throw new Error('PARE_API_TOKEN is required unless PARE_ALLOW_INSECURE_LOCAL=true for loopback-only development')
  }
  if (!apiToken && host !== '127.0.0.1' && host !== '::1' && host !== 'localhost') {
    throw new Error('insecure local mode may bind only to loopback')
  }
  const server = createPareRestServer({ apiToken, allowInsecureLocal })
  await new Promise((resolvePromise, reject) => {
    server.once('error', reject)
    server.listen(port, host, resolvePromise)
  })
  process.stdout.write(`PARÉ REST listening on ${host}:${port}\n`)
  return server
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  start().catch((cause) => {
    process.stderr.write(`${cause instanceof Error ? cause.message : String(cause)}\n`)
    process.exitCode = 1
  })
}
