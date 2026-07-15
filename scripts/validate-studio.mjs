import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { PREBUILD_AXES, strategyIsComplete, voiceIsComplete } from '../apps/studio/project-store.js';
import { visualIsComplete } from '../apps/studio/studio-project-store.js';

const root = process.cwd();
const files = [
  'apps/studio/index.html',
  'apps/studio/styles.css',
  'apps/studio/phase-2.css',
  'apps/studio/strategy-voice.css',
  'apps/studio/visual-system.css',
  'apps/studio/i18n.js',
  'apps/studio/agent-bridge.js',
  'apps/studio/tour.js',
  'apps/studio/app.js',
  'apps/studio/project-store.js',
  'apps/studio/studio-project-store.js',
  'apps/studio/brand-copy.js',
  'apps/studio/brand-tools.js',
  'apps/studio/strategy-voice-copy.js',
  'apps/studio/strategy-voice-tools.js',
  'apps/studio/visual-copy.js',
  'apps/studio/visual-tools.js',
  'apps/studio/README.md',
  'scripts/serve-studio.mjs',
  'docs/UPSTREAM_OPEN_CODESIGN.md',
  'THIRD_PARTY_NOTICES.md'
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
if (!content['apps/studio/app.js'].includes("./brand-tools.js")) throw new Error('Phase 2 brand tools are not connected to the studio shell.');
if (!content['apps/studio/app.js'].includes("./strategy-voice-tools.js")) throw new Error('Strategy and voice tools are not connected to the studio shell.');
if (!content['apps/studio/app.js'].includes("./visual-tools.js")) throw new Error('Visual-system tools are not connected to the studio shell.');
if (!content['apps/studio/app.js'].includes("./visual-system.css")) throw new Error('Visual-system styling is not loaded.');
if (!content['apps/studio/app.js'].includes('new StudioProjectStore')) throw new Error('StudioProjectStore is not active.');
if (PREBUILD_AXES.length !== 20) throw new Error(`Expected 20 readiness axes, found ${PREBUILD_AXES.length}.`);
if (!content['apps/studio/brand-tools.js'].includes('save-readiness')) throw new Error('Readiness persistence bridge is missing.');
if (!content['apps/studio/strategy-voice-tools.js'].includes("'save-strategy'")) throw new Error('Strategy persistence bridge is missing.');
if (!content['apps/studio/strategy-voice-tools.js'].includes("'save-voice'")) throw new Error('Voice persistence bridge is missing.');
if (!content['apps/studio/visual-tools.js'].includes("'save-visual-system'")) throw new Error('Visual-system persistence bridge is missing.');
if (strategyIsComplete({}) || voiceIsComplete({}) || visualIsComplete({}, {})) throw new Error('Empty strategy, voice, or visual systems must remain incomplete.');
process.stdout.write(`${JSON.stringify({ ok: true, files: files.length, locales: ['en', 'es-MX'], direct_network_calls: false, first_run_tour: true, prebuild_axes: PREBUILD_AXES.length, project_persistence: true, strategy_workspace: true, voice_workspace: true, visual_workspace: true }, null, 2)}\n`);
