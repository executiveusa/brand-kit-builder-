import { randomBytes } from 'node:crypto';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { createStudioCommandService } from '../src/studio-host/service.mjs';

const MAX_BODY_BYTES = 1024 * 1024;
const contentTypes = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml'
};

function resolveRequest(root, urlPath) {
  const decoded = decodeURIComponent(String(urlPath || '/').split('?')[0]);
  const requested = decoded === '/' ? '/index.html' : decoded;
  const resolved = path.resolve(root, `.${requested}`);
  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) throw new Error('PATH_GUARD');
  return resolved;
}

async function readJsonBody(request) {
  let size = 0;
  const chunks = [];
  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      const error = new Error('REQUEST_TOO_LARGE');
      error.status = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function hostBootstrap(sessionToken, nonce) {
  return `<script nonce="${nonce}">(function(){const token=${JSON.stringify(sessionToken)};const endpoint='/__brand-kit-builder/invoke';window.brandKitBuilderHost=Object.freeze({invoke:async function(command,payload){const response=await fetch(endpoint,{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json','X-Pauli-Studio-Session':token},body:JSON.stringify({command:command,payload:payload||{}})});const result=await response.json();return result;}});})();</script>`;
}

function securityHeaders(nonce, allowConnect = false) {
  return {
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Cross-Origin-Resource-Policy': 'same-origin',
    'Referrer-Policy': 'no-referrer',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
    'Content-Security-Policy': `default-src 'self'; script-src 'self' 'nonce-${nonce}'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src ${allowConnect ? "'self'" : "'none'"}; font-src 'self'; frame-src 'self' blob:; frame-ancestors 'none'; base-uri 'none'; form-action 'self'; object-src 'none'`
  };
}

export async function createStudioHost(options = {}) {
  const repositoryRoot = path.resolve(options.repositoryRoot || process.cwd());
  const staticRoot = path.resolve(options.staticRoot || path.join(repositoryRoot, 'apps/studio'));
  const workspaceRoot = path.resolve(options.workspaceRoot || process.env.BKB_WORKSPACE || path.join(repositoryRoot, 'workspace'));
  const bindHost = options.host || '127.0.0.1';
  const port = Number(options.port ?? process.env.PORT ?? 4173);
  const origin = `http://${bindHost}:${port}`;
  const sessionToken = randomBytes(32).toString('hex');
  const nonce = randomBytes(18).toString('base64url');
  const service = await createStudioCommandService(workspaceRoot);

  const server = createServer(async (request, response) => {
    try {
      if (request.url?.split('?')[0] === '/__brand-kit-builder/invoke') {
        if (request.method !== 'POST') {
          response.writeHead(405, { ...securityHeaders(nonce, true), Allow: 'POST', 'Content-Type': 'application/json; charset=utf-8' });
          response.end(JSON.stringify({ ok: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'POST is required.' } }));
          return;
        }
        const requestOrigin = request.headers.origin;
        const expectedOrigins = new Set([origin, `http://localhost:${port}`, `http://127.0.0.1:${port}`]);
        if (requestOrigin && !expectedOrigins.has(requestOrigin)) {
          response.writeHead(403, { ...securityHeaders(nonce, true), 'Content-Type': 'application/json; charset=utf-8' });
          response.end(JSON.stringify({ ok: false, error: { code: 'ORIGIN_GUARD', message: 'The request origin is not allowed.' } }));
          return;
        }
        if (request.headers['x-pauli-studio-session'] !== sessionToken) {
          response.writeHead(403, { ...securityHeaders(nonce, true), 'Content-Type': 'application/json; charset=utf-8' });
          response.end(JSON.stringify({ ok: false, error: { code: 'SESSION_GUARD', message: 'The local studio session is invalid.' } }));
          return;
        }
        const body = await readJsonBody(request);
        const result = await service.invoke(body.command, body.payload || {});
        const status = Number(result.status) || (result.ok === false ? 400 : 200);
        response.writeHead(status, { ...securityHeaders(nonce, true), 'Content-Type': 'application/json; charset=utf-8' });
        response.end(JSON.stringify(result));
        return;
      }

      const filePath = resolveRequest(staticRoot, request.url || '/');
      const info = await stat(filePath);
      if (!info.isFile()) throw new Error('NOT_FOUND');
      const extension = path.extname(filePath);
      let body = await readFile(filePath);
      if (extension === '.html' && path.basename(filePath) === 'index.html') {
        const html = body.toString('utf8');
        body = Buffer.from(html.replace('</head>', `${hostBootstrap(sessionToken, nonce)}\n</head>`), 'utf8');
      }
      response.writeHead(200, {
        ...securityHeaders(nonce, true),
        'Content-Type': contentTypes[extension] || 'application/octet-stream',
        'Content-Length': body.length
      });
      response.end(body);
    } catch (error) {
      const status = Number(error?.status) || (error?.message === 'REQUEST_TOO_LARGE' ? 413 : 404);
      response.writeHead(status, { ...securityHeaders(nonce, true), 'Content-Type': 'application/json; charset=utf-8' });
      response.end(JSON.stringify({ ok: false, error: { code: error?.message || 'NOT_FOUND', message: status === 404 ? 'Not found.' : 'The request could not be processed.' } }));
    }
  });

  return {
    server,
    service,
    sessionToken,
    nonce,
    staticRoot,
    workspaceRoot,
    async listen() {
      await new Promise((resolve, reject) => {
        server.once('error', reject);
        server.listen(port, bindHost, () => { server.off('error', reject); resolve(); });
      });
      const address = server.address();
      const actualPort = typeof address === 'object' && address ? address.port : port;
      return `http://${bindHost}:${actualPort}`;
    },
    async close() {
      if (!server.listening) return;
      await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    }
  };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const host = await createStudioHost();
  const url = await host.listen();
  process.stdout.write(`Pauli Brand Studio host: ${url}\nWorkspace: ${host.workspaceRoot}\n`);
}
