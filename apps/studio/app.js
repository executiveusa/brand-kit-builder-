import { agentBridge } from './agent-bridge.js';
import { applyLocale, translate } from './i18n.js';
import { ProductTour } from './tour.js';

const state = {
  locale: localStorage.getItem('pauli-brand-studio-locale') || 'en',
  view: 'brandbook', device: 'desktop', zoom: 100, changes: 0, inspector: 'design', dock: 'files'
};

const tour = new ProductTour();
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function toast(messageKey) {
  const region = $('#toast-region');
  const node = document.createElement('div');
  node.className = 'toast';
  node.textContent = translate(messageKey, state.locale);
  region.append(node);
  setTimeout(() => node.remove(), 3200);
}

function markChange() {
  state.changes += 1;
  $('#change-count').textContent = String(state.changes);
}

function setView(view) {
  state.view = view;
  $$('.canvas-tab').forEach((button) => {
    const active = button.dataset.view === view;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-selected', String(active));
  });
  $$('[data-canvas-view]').forEach((panel) => panel.classList.toggle('is-hidden', panel.dataset.canvasView !== view));
}

function setDevice(device) {
  state.device = device;
  const frame = $('#canvas-frame');
  frame.classList.remove('device-desktop', 'device-tablet', 'device-mobile');
  frame.classList.add(`device-${device}`);
  $$('[data-device]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.device === device)));
}

function setZoom(next) {
  state.zoom = Math.max(60, Math.min(130, next));
  $('#canvas-frame').style.setProperty('--canvas-zoom', String(state.zoom / 100));
  $('#zoom-value').textContent = `${state.zoom}%`;
}

function setInspector(panel) {
  state.inspector = panel;
  $$('[data-inspector]').forEach((button) => {
    const active = button.dataset.inspector === panel;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-selected', String(active));
  });
  $$('[data-inspector-panel]').forEach((body) => body.classList.toggle('is-hidden', body.dataset.inspectorPanel !== panel));
}

function setDock(panel) {
  state.dock = panel;
  $$('[data-dock]').forEach((button) => button.classList.toggle('is-active', button.dataset.dock === panel));
  $$('[data-dock-panel]').forEach((body) => body.classList.toggle('is-hidden', body.dataset.dockPanel !== panel));
}

function updateColor(input) {
  const variable = { 'primary-color': '--primary', 'accent-color': '--accent', 'paper-color': '--paper' }[input.id];
  if (variable) document.documentElement.style.setProperty(variable, input.value);
  input.nextElementSibling.textContent = input.value.toUpperCase();
  markChange();
}

function updateTypography() {
  const style = $('#display-font').value;
  const fonts = {
    editorial: "Georgia, 'Times New Roman', serif",
    humanist: "'Trebuchet MS', Inter, system-ui, sans-serif",
    modern: "Arial, Inter, system-ui, sans-serif"
  };
  document.documentElement.style.setProperty('--font-display', fonts[style]);
  const scale = $('#type-scale');
  document.documentElement.style.fontSize = `${scale.value}%`;
  scale.nextElementSibling.textContent = `${scale.value}%`;
  markChange();
}

function updateRange(input) {
  input.nextElementSibling.textContent = input.value;
  markChange();
}

async function runAction(command, payload = {}) {
  const result = await agentBridge.invoke(command, payload);
  if (result.demo) toast('toast.demo');
  return result;
}

function bindEvents() {
  $$('[data-locale-button]').forEach((button) => button.addEventListener('click', () => {
    state.locale = applyLocale(button.dataset.localeButton);
  }));
  $('#tour-button').addEventListener('click', () => tour.start({ force: true }));
  $('#new-project-button').addEventListener('click', () => $('#new-project-dialog').showModal());
  $('#project-switcher').addEventListener('click', () => runAction('list-projects'));

  $$('.workflow-step').forEach((button) => button.addEventListener('click', () => {
    if (button.classList.contains('is-complete') || button.classList.contains('is-active')) return runAction('open-stage', { stage: button.dataset.stage });
    toast('toast.blocked');
  }));

  $$('.canvas-tab').forEach((button) => button.addEventListener('click', () => setView(button.dataset.view)));
  $$('[data-device]').forEach((button) => button.addEventListener('click', () => setDevice(button.dataset.device)));
  $$('[data-zoom]').forEach((button) => button.addEventListener('click', () => setZoom(state.zoom + (button.dataset.zoom === 'in' ? 10 : -10))));
  $('[data-action="comment-mode"]').addEventListener('click', () => {
    $('#canvas-comment-pin').classList.remove('is-hidden');
    toast('toast.comment');
  });
  $('#canvas-comment-pin').addEventListener('click', () => setDock('comments'));

  $$('[data-dock]').forEach((button) => button.addEventListener('click', () => setDock(button.dataset.dock)));
  $('[data-action="open-files"]').addEventListener('click', () => setDock('files'));
  $$('.file-list button').forEach((button) => button.addEventListener('click', () => runAction('open-source', { label: button.querySelector('strong').textContent })));

  $$('[data-inspector]').forEach((button) => button.addEventListener('click', () => setInspector(button.dataset.inspector)));
  $$('input[type="color"]').forEach((input) => input.addEventListener('input', () => updateColor(input)));
  $('#display-font').addEventListener('change', updateTypography);
  $('#type-scale').addEventListener('input', updateTypography);
  $$('input[type="range"]:not(#type-scale)').forEach((input) => input.addEventListener('input', () => updateRange(input)));
  $('[data-action="reset-controls"]').addEventListener('click', () => {
    document.documentElement.removeAttribute('style');
    state.changes = 0;
    $('#change-count').textContent = '0';
    toast('toast.reset');
  });
  $('[data-action="open-ledger"]').addEventListener('click', () => runAction('open-source-ledger'));
  $('#apply-controls').addEventListener('click', async () => {
    await runAction('apply-draft-controls', { changes: state.changes });
    state.changes = 0;
    $('#change-count').textContent = '0';
    toast('toast.saved');
  });

  $$('[data-source-choice]').forEach((button) => button.addEventListener('click', () => {
    $$('[data-source-choice]').forEach((item) => item.classList.remove('is-selected'));
    button.classList.add('is-selected');
    $('#continue-project').disabled = false;
    $('#continue-project').dataset.source = button.dataset.sourceChoice;
  }));
  $('#new-project-dialog').addEventListener('close', () => {
    if ($('#new-project-dialog').returnValue === 'default') runAction('create-project', { source_type: $('#continue-project').dataset.source });
  });

  $$('[data-help]').forEach((element) => {
    if (!element.getAttribute('title')) element.setAttribute('title', element.getAttribute('aria-label') || element.textContent.trim().replace(/\s+/g, ' ').slice(0, 100));
  });
}

async function initialize() {
  state.locale = applyLocale(state.locale);
  bindEvents();
  const capabilities = await agentBridge.inspect();
  if (agentBridge.connected && capabilities?.ok) {
    $('#agent-status span:last-child').textContent = translate('agent.connected', state.locale);
    $('#agent-status').classList.add('is-connected');
  }
  requestAnimationFrame(() => tour.start());
}

initialize();
