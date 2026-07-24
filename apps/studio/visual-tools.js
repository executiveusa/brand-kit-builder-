import { visualIsComplete } from './studio-project-store.js';
import { visualCopy as copy } from './visual-copy.js';

function esc(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}
function selected(value, expected) { return value === expected ? 'selected' : ''; }
function checked(values, expected) { return values.includes(expected) ? 'checked' : ''; }
function locale() { return document.documentElement.dataset.locale === 'es-MX' ? 'es-MX' : 'en'; }

function colorToken(name, label, value) {
  return `<label class="color-token"><input type="color" name="${name}_picker" value="${esc(value)}" aria-label="${esc(label)}"><span><strong>${esc(label)}</strong><input type="text" name="${name}" value="${esc(value)}" pattern="#[0-9A-Fa-f]{6}" maxlength="7" required aria-label="${esc(label)} hex"></span></label>`;
}

function territoryChoice(territory, selectedId) {
  return `<label class="territory-choice"><input type="radio" name="selected_territory" value="${esc(territory.id)}" ${territory.id === selectedId ? 'checked' : ''} required><strong>${esc(territory.name || territory.id)}</strong><small>${esc(territory.concept || '')}</small><small>${esc(territory.mood || '')}</small></label>`;
}

function applicationChoice(id, values) {
  return `<label class="application-choice"><input type="checkbox" name="applications" value="${id}" ${checked(values, id)}><span>${copy(id)}</span></label>`;
}

function payloadFrom(form) {
  const data = new FormData(form);
  return {
    selected_territory: String(data.get('selected_territory') || ''),
    logo_policy: String(data.get('logo_policy') || 'preserve'),
    logo_notes: String(data.get('logo_notes') || '').trim(),
    colors: {
      primary: String(data.get('primary') || '').toUpperCase(), secondary: String(data.get('secondary') || '').toUpperCase(),
      accent: String(data.get('accent') || '').toUpperCase(), background: String(data.get('background') || '').toUpperCase(), text: String(data.get('text') || '').toUpperCase()
    },
    typography: {
      display: String(data.get('type_display') || '').trim(), body: String(data.get('type_body') || '').trim(),
      scale: String(data.get('type_scale') || 'balanced'), rules: String(data.get('type_rules') || '').trim()
    },
    imagery: {
      direction: String(data.get('image_direction') || '').trim(), lighting: String(data.get('image_lighting') || '').trim(),
      composition: String(data.get('image_composition') || '').trim(), people: String(data.get('image_people') || '').trim(), forbidden: String(data.get('image_forbidden') || '').trim()
    },
    illustration: String(data.get('illustration') || '').trim(), icon_family: String(data.get('icon_family') || '').trim(),
    patterns_textures: String(data.get('patterns_textures') || '').trim(), layout_rules: String(data.get('layout_rules') || '').trim(),
    motion_rules: String(data.get('motion_rules') || '').trim(), accessibility_notes: String(data.get('accessibility_notes') || '').trim(),
    applications: data.getAll('applications')
  };
}

export function installVisualTools(brandTools) {
  const originalOpenStage = brandTools.openStage.bind(brandTools);

  function applyPreview(visual) {
    const root = document.documentElement;
    root.style.setProperty('--primary', visual.colors.primary);
    root.style.setProperty('--accent', visual.colors.accent);
    root.style.setProperty('--paper', visual.colors.background);
    root.style.setProperty('--ink', visual.colors.text);
  }

  function renderVisual() {
    const project = brandTools.store.getCurrent();
    if (!['active', 'complete'].includes(project.stages.visual.status)) return originalOpenStage('visual');
    if (brandTools.dialog.open) brandTools.dialog.close();
    brandTools.dialog.dataset.stage = 'visual';
    brandTools.dialog.querySelector('#workbench-title').textContent = copy('title');
    brandTools.dialog.querySelector('#workbench-help').textContent = copy('help');
    const content = brandTools.dialog.querySelector('#workbench-content');
    const visual = project.visual;
    const complete = visualIsComplete(visual, project.strategy);
    const applications = ['website', 'social', 'presentation', 'print', 'packaging', 'merch', 'product', 'signage'];
    content.innerHTML = `<form id="visual-system-form" class="visual-form"><section class="visual-section"><header><div><h3>${copy('territory')}</h3><p>${copy('help')}</p></div></header><div class="territory-choice-grid">${project.strategy.territories.map((territory) => territoryChoice(territory, visual.selected_territory)).join('')}</div></section><section class="visual-section"><header><div><h3>${copy('logo')}</h3></div></header><div class="visual-grid"><label><span>${copy('logo')}</span><select name="logo_policy"><option value="preserve" ${selected(visual.logo_policy, 'preserve')}>${copy('preserve')}</option><option value="refine" ${selected(visual.logo_policy, 'refine')}>${copy('refine')}</option><option value="redesign" ${selected(visual.logo_policy, 'redesign')}>${copy('redesign')}</option></select></label><label><span>${copy('logoNotes')}</span><textarea name="logo_notes" rows="4">${esc(visual.logo_notes)}</textarea></label></div></section><section class="visual-section"><header><div><h3>${copy('colors')}</h3></div></header><div class="color-token-grid">${colorToken('primary', copy('primary'), visual.colors.primary)}${colorToken('secondary', copy('secondary'), visual.colors.secondary)}${colorToken('accent', copy('accent'), visual.colors.accent)}${colorToken('background', copy('background'), visual.colors.background)}${colorToken('text', copy('text'), visual.colors.text)}</div><div class="visual-preview-strip"><div class="visual-preview-primary">Aa</div><div class="visual-preview-accent">CTA</div><div class="visual-preview-paper">Body</div></div></section><section class="visual-section"><header><div><h3>${copy('typography')}</h3></div></header><div class="visual-grid"><label><span>${copy('display')}</span><input name="type_display" value="${esc(visual.typography.display)}" required></label><label><span>${copy('body')}</span><input name="type_body" value="${esc(visual.typography.body)}" required></label><label><span>${copy('scale')}</span><select name="type_scale"><option value="balanced" ${selected(visual.typography.scale, 'balanced')}>${copy('balanced')}</option><option value="compact" ${selected(visual.typography.scale, 'compact')}>${copy('compact')}</option><option value="expressive" ${selected(visual.typography.scale, 'expressive')}>${copy('expressive')}</option></select></label><label class="wide"><span>${copy('typeRules')}</span><textarea name="type_rules" rows="4" required>${esc(visual.typography.rules)}</textarea></label></div></section><section class="visual-section"><header><div><h3>${copy('imagery')}</h3></div></header><div class="visual-grid"><label><span>${copy('direction')}</span><textarea name="image_direction" required>${esc(visual.imagery.direction)}</textarea></label><label><span>${copy('lighting')}</span><textarea name="image_lighting" required>${esc(visual.imagery.lighting)}</textarea></label><label><span>${copy('composition')}</span><textarea name="image_composition" required>${esc(visual.imagery.composition)}</textarea></label><label><span>${copy('people')}</span><textarea name="image_people">${esc(visual.imagery.people)}</textarea></label><label class="wide"><span>${copy('forbidden')}</span><textarea name="image_forbidden" required>${esc(visual.imagery.forbidden)}</textarea></label></div></section><section class="visual-section"><header><div><h3>${copy('system')}</h3></div></header><div class="visual-grid"><label><span>${copy('illustration')}</span><textarea name="illustration">${esc(visual.illustration)}</textarea></label><label><span>${copy('icons')}</span><input name="icon_family" value="${esc(visual.icon_family)}" required></label><label><span>${copy('patterns')}</span><textarea name="patterns_textures">${esc(visual.patterns_textures)}</textarea></label><label><span>${copy('layout')}</span><textarea name="layout_rules" required>${esc(visual.layout_rules)}</textarea></label><label><span>${copy('motion')}</span><textarea name="motion_rules" required>${esc(visual.motion_rules)}</textarea></label><label><span>${copy('accessibility')}</span><textarea name="accessibility_notes" required>${esc(visual.accessibility_notes)}</textarea></label></div></section><section class="visual-section"><header><div><h3>${copy('applications')}</h3></div></header><div class="application-grid">${applications.map((application) => applicationChoice(application, visual.applications)).join('')}</div></section><div class="completion-note ${complete ? 'is-complete' : ''}">${complete ? copy('complete') : copy('incomplete')}</div><footer class="form-footer"><span>${copy('saved')}: ${visual.updated_at ? new Date(visual.updated_at).toLocaleString(locale()) : '—'}</span><button class="primary-button" type="submit" data-help="saveVisualSystem" aria-label="${copy('save')}">${copy('save')}</button></footer></form>`;
    const form = content.querySelector('#visual-system-form');
    form.querySelectorAll('.color-token').forEach((token) => {
      const picker = token.querySelector('input[type="color"]');
      const field = token.querySelector('input[type="text"]');
      picker.addEventListener('input', () => { field.value = picker.value.toUpperCase(); const draft = payloadFrom(form); applyPreview(draft); });
      field.addEventListener('change', () => { if (/^#[0-9a-f]{6}$/i.test(field.value)) picker.value = field.value; const draft = payloadFrom(form); applyPreview(draft); });
    });
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const payload = payloadFrom(form);
      brandTools.project = brandTools.store.saveVisual(project.project_id, payload);
      applyPreview(brandTools.project.visual);
      await brandTools.agentBridge?.invoke('save-visual-system', { project_id: project.project_id, visual: payload, complete: visualIsComplete(payload, project.strategy) });
      brandTools.renderChrome();
      renderVisual();
    });
    applyPreview(visual);
    brandTools.dialog.showModal();
  }

  brandTools.openStage = (stage) => stage === 'visual' ? renderVisual() : originalOpenStage(stage);
  return { renderVisual, applyPreview };
}
