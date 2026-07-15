import { strategyIsComplete, voiceIsComplete } from './project-store.js';
import { strategyVoiceCopy as copy } from './strategy-voice-copy.js';

function esc(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}
function selected(value, expected) { return value === expected ? 'selected' : ''; }
function locale() { return document.documentElement.dataset.locale === 'es-MX' ? 'es-MX' : 'en'; }
function readText(form, name) { return String(new FormData(form).get(name) || '').trim(); }

function proofRow(item = {}, index = 0) {
  return `<tr data-proof-row><td><input name="proof_claim_${index}" value="${esc(item.claim)}" aria-label="${copy('claim')} ${index + 1}" required></td><td><input name="proof_source_${index}" value="${esc(item.source)}" aria-label="${copy('source')} ${index + 1}" placeholder="${copy('sourceHint')}" required></td><td><select name="proof_status_${index}" aria-label="${copy('status')} ${index + 1}"><option value="confirmed" ${selected(item.status, 'confirmed')}>${copy('confirmed')}</option><option value="provisional" ${selected(item.status, 'provisional')}>${copy('provisional')}</option><option value="blocked" ${selected(item.status, 'blocked')}>${copy('blocked')}</option></select></td><td><button class="text-button" type="button" data-remove-proof title="${copy('remove')}">${copy('remove')}</button></td></tr>`;
}

function territoryCard(territory, index) {
  return `<article class="territory-card"><h4>${copy('territory')} ${index + 1}</h4><label><span>${copy('territoryName')}</span><input name="territory_name_${index}" value="${esc(territory.name)}" required></label><label><span>${copy('concept')}</span><textarea name="territory_concept_${index}" rows="4" required>${esc(territory.concept)}</textarea></label><label><span>${copy('mood')}</span><textarea name="territory_mood_${index}" rows="4" required>${esc(territory.mood)}</textarea></label><label><span>${copy('avoid')}</span><textarea name="territory_avoid_${index}" rows="3" required>${esc(territory.avoid)}</textarea></label></article>`;
}

function strategyPayload(form) {
  const data = new FormData(form);
  const proof = [...form.querySelectorAll('[data-proof-row]')].map((row) => ({
    claim: row.querySelector('input[name^="proof_claim_"]').value.trim(),
    source: row.querySelector('input[name^="proof_source_"]').value.trim(),
    status: row.querySelector('select[name^="proof_status_"]').value
  })).filter((item) => item.claim || item.source);
  const territories = [0, 1, 2].map((index) => ({
    id: `territory-${index + 1}`,
    name: String(data.get(`territory_name_${index}`) || '').trim(),
    concept: String(data.get(`territory_concept_${index}`) || '').trim(),
    mood: String(data.get(`territory_mood_${index}`) || '').trim(),
    avoid: String(data.get(`territory_avoid_${index}`) || '').trim()
  }));
  return {
    positioning: readText(form, 'positioning'), promise: readText(form, 'promise'), reasons_to_believe: readText(form, 'reasons_to_believe'), values: readText(form, 'values'),
    message_hierarchy: { primary: readText(form, 'message_primary'), support: readText(form, 'message_support'), cta: readText(form, 'message_cta') },
    proof_ledger: proof, territories
  };
}

function voicePayload(form) {
  const data = new FormData(form);
  return {
    identity: readText(form, 'identity'), audience_language: readText(form, 'audience_language'), prohibited_language: readText(form, 'prohibited_language'),
    real_phrases: readText(form, 'real_phrases'), true_stories: readText(form, 'true_stories'), channel_rules: readText(form, 'channel_rules'),
    localization_rules: readText(form, 'localization_rules'), examples: readText(form, 'examples'),
    axes: { direct: Number(data.get('axis_direct')), warm: Number(data.get('axis_warm')), playful: Number(data.get('axis_playful')), concise: Number(data.get('axis_concise')) }
  };
}

export function installStrategyVoiceTools(brandTools) {
  const originalOpenStage = brandTools.openStage.bind(brandTools);

  function prepareDialog(stage, title, help) {
    brandTools.project = brandTools.store.getCurrent();
    if (brandTools.dialog.open) brandTools.dialog.close();
    brandTools.dialog.dataset.stage = stage;
    brandTools.dialog.querySelector('#workbench-title').textContent = title;
    brandTools.dialog.querySelector('#workbench-help').textContent = help;
    brandTools.dialog.showModal();
    return brandTools.dialog.querySelector('#workbench-content');
  }

  function renderStrategy() {
    const project = brandTools.store.getCurrent();
    if (!['active', 'complete'].includes(project.stages.strategy.status)) return originalOpenStage('strategy');
    const strategy = project.strategy;
    const content = prepareDialog('strategy', copy('strategyTitle'), copy('strategyHelp'));
    const proof = strategy.proof_ledger.length ? strategy.proof_ledger : [{ claim: '', source: '', status: 'provisional' }];
    const complete = strategyIsComplete(strategy);
    content.innerHTML = `<form id="strategy-form" class="strategy-form"><section class="strategy-section"><header><div><h3>${copy('strategyTitle')}</h3><p>${copy('strategyHelp')}</p></div></header><div class="message-grid"><label class="wide"><span>${copy('positioning')}</span><textarea name="positioning" rows="4" required>${esc(strategy.positioning)}</textarea></label><label><span>${copy('promise')}</span><textarea name="promise" rows="4" required>${esc(strategy.promise)}</textarea></label><label><span>${copy('reasons')}</span><textarea name="reasons_to_believe" rows="4" required>${esc(strategy.reasons_to_believe)}</textarea></label><label class="wide"><span>${copy('values')}</span><textarea name="values" rows="4" required>${esc(strategy.values)}</textarea></label></div></section><section class="strategy-section"><header><div><h3>${copy('messages')}</h3></div></header><div class="message-grid"><label class="wide"><span>${copy('primaryMessage')}</span><textarea name="message_primary" rows="3" required>${esc(strategy.message_hierarchy.primary)}</textarea></label><label><span>${copy('supportMessage')}</span><textarea name="message_support" rows="3" required>${esc(strategy.message_hierarchy.support)}</textarea></label><label><span>${copy('cta')}</span><input name="message_cta" value="${esc(strategy.message_hierarchy.cta)}" required></label></div></section><section class="strategy-section"><header><div><h3>${copy('proofLedger')}</h3><p>${copy('proofHelp')}</p></div><button id="add-proof-row" class="secondary-button" type="button">${copy('addClaim')}</button></header><div class="table-wrap"><table class="proof-table"><thead><tr><th>${copy('claim')}</th><th>${copy('source')}</th><th>${copy('status')}</th><th></th></tr></thead><tbody id="proof-rows">${proof.map(proofRow).join('')}</tbody></table></div></section><section class="strategy-section"><header><div><h3>${copy('territories')}</h3><p>${copy('territoriesHelp')}</p></div></header><div class="territory-grid">${strategy.territories.map(territoryCard).join('')}</div></section><div class="completion-note ${complete ? 'is-complete' : ''}">${complete ? copy('strategyComplete') : copy('strategyIncomplete')}</div><footer class="form-footer"><span>${copy('saved')}: ${strategy.updated_at ? new Date(strategy.updated_at).toLocaleString(locale()) : '—'}</span><button class="primary-button" type="submit">${copy('saveStrategy')}</button></footer></form>`;
    const form = content.querySelector('#strategy-form');
    const proofRows = content.querySelector('#proof-rows');
    const bindRemovers = () => proofRows.querySelectorAll('[data-remove-proof]').forEach((button) => { button.onclick = () => { if (proofRows.children.length === 1) { const row = button.closest('tr'); row.querySelectorAll('input').forEach((input) => { input.value = ''; }); return; } button.closest('tr').remove(); }; });
    bindRemovers();
    content.querySelector('#add-proof-row').addEventListener('click', () => { proofRows.insertAdjacentHTML('beforeend', proofRow({}, proofRows.children.length)); bindRemovers(); proofRows.lastElementChild.querySelector('input').focus(); });
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const payload = strategyPayload(form);
      brandTools.project = brandTools.store.saveStrategy(project.project_id, payload);
      await brandTools.agentBridge?.invoke('save-strategy', { project_id: project.project_id, strategy: payload, complete: strategyIsComplete(payload) });
      brandTools.renderChrome();
      renderStrategy();
    });
  }

  function axis(label, name, value) {
    return `<div class="voice-axis"><label for="${name}">${label}</label><input id="${name}" name="${name}" type="range" min="0" max="100" value="${Number(value)}"><output>${Number(value)}</output></div>`;
  }

  function renderVoice() {
    const project = brandTools.store.getCurrent();
    if (!['active', 'complete'].includes(project.stages.voice.status)) return originalOpenStage('voice');
    const voice = project.voice;
    const complete = voiceIsComplete(voice);
    const content = prepareDialog('voice', copy('voiceTitle'), copy('voiceHelp'));
    content.innerHTML = `<form id="voice-form" class="voice-form"><section class="voice-section"><header><div><h3>${copy('voiceTitle')}</h3><p>${copy('voiceHelp')}</p></div></header><div class="voice-grid"><label class="wide"><span>${copy('voiceIdentity')}</span><textarea name="identity" rows="4" required>${esc(voice.identity)}</textarea></label><label><span>${copy('audienceLanguage')}</span><textarea name="audience_language" rows="4" required>${esc(voice.audience_language)}</textarea></label><label><span>${copy('prohibited')}</span><textarea name="prohibited_language" rows="4" required>${esc(voice.prohibited_language)}</textarea></label><label><span>${copy('phrases')}</span><textarea name="real_phrases" rows="5" required>${esc(voice.real_phrases)}</textarea></label><label><span>${copy('stories')}</span><textarea name="true_stories" rows="5">${esc(voice.true_stories)}</textarea></label><label class="wide"><span>${copy('channels')}</span><textarea name="channel_rules" rows="5" required>${esc(voice.channel_rules)}</textarea></label><label class="wide"><span>${copy('localization')}</span><textarea name="localization_rules" rows="5" required>${esc(voice.localization_rules)}</textarea></label><label class="wide"><span>${copy('examples')}</span><textarea name="examples" rows="6" required>${esc(voice.examples)}</textarea></label></div></section><section class="voice-section"><header><div><h3>${copy('voiceAxes')}</h3></div></header><div class="voice-axis-grid">${axis(copy('direct'), 'axis_direct', voice.axes.direct)}${axis(copy('warm'), 'axis_warm', voice.axes.warm)}${axis(copy('playful'), 'axis_playful', voice.axes.playful)}${axis(copy('concise'), 'axis_concise', voice.axes.concise)}</div></section><div class="completion-note ${complete ? 'is-complete' : ''}">${complete ? copy('voiceComplete') : copy('voiceIncomplete')}</div><footer class="form-footer"><span>${copy('saved')}: ${voice.updated_at ? new Date(voice.updated_at).toLocaleString(locale()) : '—'}</span><button class="primary-button" type="submit">${copy('saveVoice')}</button></footer></form>`;
    const form = content.querySelector('#voice-form');
    form.querySelectorAll('.voice-axis input').forEach((input) => input.addEventListener('input', () => { input.nextElementSibling.textContent = input.value; }));
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const payload = voicePayload(form);
      brandTools.project = brandTools.store.saveVoice(project.project_id, payload);
      await brandTools.agentBridge?.invoke('save-voice', { project_id: project.project_id, voice: payload, complete: voiceIsComplete(payload) });
      const sample = document.getElementById('voice-sample');
      if (sample && payload.examples) sample.textContent = payload.examples.split(/\r?\n/).find(Boolean) || payload.examples;
      brandTools.renderChrome();
      renderVoice();
    });
  }

  brandTools.openStage = (stage) => {
    if (stage === 'strategy') return renderStrategy();
    if (stage === 'voice') return renderVoice();
    return originalOpenStage(stage);
  };

  return { renderStrategy, renderVoice };
}
