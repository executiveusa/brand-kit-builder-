import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(process.cwd(), 'apps/studio');
const port = Number(process.env.PORT || 4173);
const contentTypes = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml' };

function resolveRequest(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const requested = decoded === '/' ? '/index.html' : decoded;
  const resolved = path.resolve(root, `.${requested}`);
  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) throw new Error('PATH_GUARD');
  return resolved;
}

const server = createServer(async (request, response) => {
  try {
    const filePath = resolveRequest(request.url || '/');
    const info = await stat(filePath);
    if (!info.isFile()) throw new Error('NOT_FOUND');
    const body = await readFile(filePath);
    response.writeHead(200, {
      'Content-Type': contentTypes[path.extname(filePath)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'none'; font-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'"
    });
    response.end(body);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
});

server.listen(port, '127.0.0.1', () => {
  process.stdout.write(`Pauli Brand Studio: http://127.0.0.1:${port}\n`);
});
