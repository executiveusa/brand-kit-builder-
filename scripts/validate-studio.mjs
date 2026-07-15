import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const files = [
  'apps/studio/index.html', 'apps/studio/styles.css', 'apps/studio/i18n.js', 'apps/studio/agent-bridge.js', 'apps/studio/tour.js', 'apps/studio/app.js', 'apps/studio/README.md', 'scripts/serve-studio.mjs', 'docs/UPSTREAM_OPEN_CODESIGN.md', 'THIRD_PARTY_NOTICES.md'
];
for (const file of files) await access(path.join(root, file));
const content = Object.fromEntries(await Promise.all(files.map(async (file) => [file, await readFile(path.join(root, file), 'utf8')])));
const combined = Object.values(content).join('\n');
if (/\p{Script=Han}/u.test(combined)) throw new Error('Chinese/Han characters are not allowed in the custom studio source.');
if (/https?:\/\//.test(content['apps/studio/index.html'])) throw new Error('Studio HTML must not load remote assets.');
if (/\b(fetch|XMLHttpRequest|WebSocket)\s*\(/.test(combined)) throw new Error('Studio shell must not make direct network calls.');
if (!content['apps/studio/tour.js'].includes('TOUR_STORAGE_KEY')) throw new Error('First-run tour persistence is missing.');
if (!content['apps/studio/index.html'].includes('data-locale-button="es-MX"')) throw new Error('Mexican Spanish switch is missing.');
if (!content['apps/studio/index.html'].includes('id="tour-button"')) throw new Error('Tour restart button is missing.');
if (!content['apps/studio/agent-bridge.js'].includes('window.brandKitBuilderHost')) throw new Error('Host bridge contract is missing.');
process.stdout.write(`${JSON.stringify({ ok: true, files: files.length, locales: ['en', 'es-MX'], direct_network_calls: false, first_run_tour: true }, null, 2)}\n`);
