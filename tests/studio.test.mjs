import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const read = (file) => readFile(path.join(root, file), 'utf8');

function extractDictionarySource(source) {
  const transformed = source.replace('export const dictionaries =', 'globalThis.dictionaries =').replace(/export function[\s\S]*$/, '');
  const context = {};
  vm.createContext(context);
  vm.runInContext(transformed, context);
  return context.dictionaries;
}

function idsFromHtml(html) { return new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => `#${match[1]}`)); }

test('English and Mexican Spanish dictionaries have matching keys', async () => {
  const dictionaries = extractDictionarySource(await read('apps/studio/i18n.js'));
  assert.deepEqual(Object.keys(dictionaries.en).sort(), Object.keys(dictionaries['es-MX']).sort());
  assert.ok(Object.keys(dictionaries.en).length > 120);
});

test('studio source contains no Han characters or direct network calls', async () => {
  const files = ['index.html', 'styles.css', 'phase-2.css', 'strategy-voice.css', 'visual-system.css', 'brandbook.css', 'guardian-export.css', 'i18n.js', 'agent-bridge.js', 'tour.js', 'app.js', 'project-store.js', 'studio-project-store.js', 'release-project-store.js', 'brand-copy.js', 'brand-tools.js', 'strategy-voice-copy.js', 'strategy-voice-tools.js', 'visual-copy.js', 'visual-tools.js', 'kaku-brandbook.js', 'brandbook-copy.js', 'brandbook-tools.js', 'guardian-export-domain.js', 'guardian-export-copy.js', 'guardian-export-tools.js', 'export-package.js', 'zip-store.js'];
  const source = (await Promise.all(files.map((file) => read(`apps/studio/${file}`)))).join('\n');
  assert.equal(/\p{Script=Han}/u.test(source), false);
  assert.equal(/\b(fetch|XMLHttpRequest|WebSocket)\s*\(/.test(source), false);
  assert.equal(/<script[^>]+src="https?:/i.test(source), false);
  assert.equal(/<link[^>]+href="https?:/i.test(source), false);
});

test('every tour selector resolves to an element or declared data control', async () => {
  const html = await read('apps/studio/index.html');
  const tour = await read('apps/studio/tour.js');
  const ids = idsFromHtml(html);
  for (const [, selector] of tour.matchAll(/target:\s*'([^']+)'/g)) {
    if (selector.startsWith('#')) assert.ok(ids.has(selector), `Missing tour target ${selector}`);
    else {
      const attribute = selector.match(/^\[([^=\]]+)/)?.[1];
      assert.ok(attribute && html.includes(attribute), `Missing tour selector ${selector}`);
    }
  }
  assert.match(tour, /localStorage\.getItem\(TOUR_STORAGE_KEY\)/);
  assert.match(tour, /localStorage\.setItem\(TOUR_STORAGE_KEY/);
});

test('interactive controls expose help metadata and accessible names', async () => {
  const html = await read('apps/studio/index.html');
  const buttons = [...html.matchAll(/<button\b([\s\S]*?)>([\s\S]*?)<\/button>/g)];
  assert.ok(buttons.length >= 40);
  for (const [, attributes, body] of buttons) {
    assert.match(attributes, /data-help=/, `Button missing data-help: ${body.slice(0, 40)}`);
    const plainText = body.replace(/<[^>]+>/g, '').trim();
    const hasName = /aria-label=/.test(attributes) || /data-i18n=/.test(attributes) || /data-i18n=/.test(body) || plainText.length > 0;
    assert.equal(hasName, true, `Button missing accessible name: ${body.slice(0, 40)}`);
  }
});

test('phase 2 dialogs can rerender safely after a locale change', async () => {
  const app = await read('apps/studio/app.js');
  assert.match(app, /function hardenDialogRerenders/);
  assert.match(app, /if \(brandTools\.library\?\.open\) brandTools\.library\.close\(\)/);
  assert.match(app, /if \(stage === 'new-project'\) return brandTools\.openNewProject\(\)/);
  assert.match(app, /hardenDialogRerenders\(brandTools\)/);
});

test('strategy and voice editors are installed and use guarded bridge commands', async () => {
  const app = await read('apps/studio/app.js');
  const tools = await read('apps/studio/strategy-voice-tools.js');
  assert.match(app, /installStrategyVoiceTools\(brandTools\)/);
  assert.match(app, /\.\/strategy-voice\.css/);
  assert.match(tools, /brandTools\.agentBridge\?\.invoke\('save-strategy'/);
  assert.match(tools, /brandTools\.agentBridge\?\.invoke\('save-voice'/);
});

test('visual editor uses the release-aware store and guarded bridge command', async () => {
  const app = await read('apps/studio/app.js');
  const tools = await read('apps/studio/visual-tools.js');
  assert.match(app, /new ReleaseProjectStore\(\)/);
  assert.match(app, /installVisualTools\(brandTools\)/);
  assert.match(app, /\.\/visual-system\.css/);
  assert.match(tools, /brandTools\.agentBridge\?\.invoke\('save-visual-system'/);
});

test('KAKU editor is installed with local sandboxed preview and guarded saves', async () => {
  const app = await read('apps/studio/app.js');
  const tools = await read('apps/studio/brandbook-tools.js');
  assert.match(app, /installBrandbookTools\(brandTools\)/);
  assert.match(app, /\.\/brandbook\.css/);
  assert.match(tools, /sandbox="allow-same-origin"/);
  assert.match(tools, /renderBrandbookDocument/);
  assert.match(tools, /brandTools\.agentBridge\?\.invoke\('save-brandbook-section'/);
  assert.match(tools, /brandTools\.agentBridge\?\.invoke\('save-brandbook-annex'/);
});

test('Guardian and export tools inspect but never create approval', async () => {
  const app = await read('apps/studio/app.js');
  const tools = await read('apps/studio/guardian-export-tools.js');
  const store = await read('apps/studio/release-project-store.js');
  assert.match(app, /installGuardianExportTools\(brandTools\)/);
  assert.match(app, /\.\/guardian-export\.css/);
  assert.match(tools, /'inspect-export-approval'/);
  assert.match(tools, /'save-guardian-review'/);
  assert.match(tools, /buildExportPackage/);
  assert.doesNotMatch(tools, /grant-export-approval|approve-export|brand_kit_approve/);
  assert.match(store, /approval\.source !== 'agent-core'/);
});
