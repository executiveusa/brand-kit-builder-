import { assertActionAuthorized, workflowReceipt } from '../../../../interfaces/runtime/src/one-hands.mjs'

function required(name, value) {
  if (typeof value !== 'string' || !value.trim()) throw new TypeError(`${name} is required`)
  return value.trim()
}

function joinUrl(base, pathname) {
  return `${base.replace(/\/+$/, '')}${pathname}`
}

async function jsonResponse(response, label) {
  const body = await response.json().catch(() => null)
  if (!response.ok) {
    const detail = body && typeof body === 'object' ? JSON.stringify(body) : `status ${response.status}`
    throw new Error(`${label} failed: ${detail}`)
  }
  return body
}

export function createPostizAdapter({ baseUrl, apiKey, fetchImpl = fetch }) {
  const base = required('Postiz baseUrl', baseUrl)
  const key = required('Postiz apiKey', apiKey)

  async function request(pathname, { method = 'GET', body } = {}) {
    const response = await fetchImpl(joinUrl(base, pathname), {
      method,
      headers: {
        'content-type': 'application/json',
        Authorization: key,
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    })
    return jsonResponse(response, `Postiz ${method} ${pathname}`)
  }

  return {
    name: 'postiz',
    kind: 'publishing-adapter',

    async integrations() {
      return request('/public/v1/integrations')
    },

    async listPosts(filters = {}) {
      const query = new URLSearchParams()
      for (const [name, value] of Object.entries(filters)) {
        if (value !== undefined && value !== null) query.set(name, String(value))
      }
      const suffix = query.size ? `?${query.toString()}` : ''
      return request(`/public/v1/posts${suffix}`)
    },

    async schedule({ workOrder, payload, now = () => new Date().toISOString(), rollback_ref }) {
      assertActionAuthorized(workOrder)
      if (!['postiz-schedule', 'postiz-publish'].includes(workOrder.action)) {
        throw new TypeError(`Postiz adapter cannot execute action: ${workOrder.action}`)
      }
      const response = await request('/public/v1/posts', { method: 'POST', body: payload })
      return {
        response,
        receipt: workflowReceipt(workOrder, {
          state: 'complete',
          at: now(),
          evidence: [{ kind: 'postiz-response', ref: 'runtime-response' }],
          rollback_ref,
          notes: ['External Postiz request accepted. Provider response is runtime evidence; API key is never persisted in the receipt.'],
        }),
      }
    },
  }
}
