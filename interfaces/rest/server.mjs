import http from 'node:http'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
import { fromRest } from '../runtime/src/normalize.mjs'
import { fromRestV2, validateWorkOrder } from '../runtime/src/one-hands.mjs'
import { createDaryaHttpWorker, oneHandsCapabilities, prepareOneHandsOutcome } from '../../studio/_system/runtime/src/one-hands.mjs'
import { createPostizAdapter } from '../../studio/_system/adapters/postiz/adapter.mjs'

const MAX_BODY_BYTES = 1_000_000

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

export function createPareRestServer({
  root = process.env.PAULI_BRAND_STUDIO_ROOT || process.cwd(),
  apiToken = process.env.PARE_API_TOKEN || '',
  allowInsecureLocal = process.env.PARE_ALLOW_INSECURE_LOCAL === 'true',
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
