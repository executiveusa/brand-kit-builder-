import { BrandProjectStore, PREBUILD_AXES, STAGES } from './project-store.js';
import { QUESTIONS, copy as text, currentLocale as locale, stageLabel } from './brand-copy.js';

function esc(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}
function checked(value) { return value ? 'checked' : ''; }
function selected(value, expected) { return value === expected ? 'selected' : ''; }

export class BrandTools {
  constructor({ agentBridge, toast } = {}) {
    this.agentBridge = agentBridge;
    this.toast = toast || (() => {});
    this.store = new BrandProjectStore();
    this.project = null;
  }

  async initialize() {
    this.store.ensureDemoProject();
    this.project = this.store.getCurrent();
    this.mount();
    this.bind();
    this.renderChrome();
    window.addEventListener('pauli:locale-change', () => {
      this.renderChrome();
      if (this.dialog?.open) this.openStage(this.dialog.dataset.stage || this.project.current_stage);
      if (this.library?.open) this.openLibrary();
    });
    return this.project;
  }

  mount() {
    const sourceSummary = document.getElementById('source-summary');
    if (sourceSummary && !document.getElementById('open-current-stage')) {
      sourceSummary.insertAdjacentHTML('beforeend', `<div class="stage-launcher"><button id="open-current-stage" class="primary-button full-width" type="button" data-help="Open the working form for the current stage" title="Open the working form for the current stage">${text('openStage')}</button><span id="readiness-score-pill" class="readiness-score-pill" data-help="Live readiness gate score" title="Live readiness gate score">0.0</span></div>`);
    }
    if (!document.getElementById('brand-tools-dialog')) {
      document.body.insertAdjacentHTML('beforeend', `<dialog id="brand-tools-dialog" class="workbench-dialog"><div class="workbench-shell"><header class="workbench-header"><div><p class="eyebrow">Pauli Brand Studio</p><h2 id="workbench-title"></h2><p id="workbench-help"></p></div><button type="button" class="icon-button" data-workbench-close data-help="closeWorkbench" aria-label="${text('close')}" title="${text('close')}"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button></header><div id="workbench-content" class="workbench-content"></div></div></dialog>`);
    }
    if (!document.getElementById('project-library-dialog')) {
      document.body.insertAdjacentHTML('beforeend', `<dialog id="project-library-dialog" class="workbench-dialog compact-dialog"><div class="workbench-shell"><header class="workbench-header"><div><p class="eyebrow">Pauli Brand Studio</p><h2>${text('projectLibrary')}</h2></div><button type="button" class="icon-button" data-library-close data-help="closeProjectLibrary" aria-label="${text('close')}" title="${text('close')}"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button></header><div id="project-library-content" class="workbench-content"></div></div></dialog>`);
    }
    this.dialog = document.getElementById('brand-tools-dialog');
    this.library = document.getElementById('project-library-dialog');
  }

  bind() {
    document.getElementById('project-switcher')?.addEventListener('click', () => this.openLibrary());
    document.getElementById('new-project-button')?.addEventListener('click', () => this.openNewProject());
    document.getElementById('open-current-stage')?.addEventListener('click', () => this.openStage(this.project.current_stage));
    document.querySelectorAll('.workflow-step').forEach((button) => button.addEventListener('click', () => this.openStage(button.dataset.stage)));
    this.dialog.querySelector('[data-workbench-close]').addEventListener('click', () => this.dialog.close());
    this.library.querySelector('[data-library-close]').addEventListener('click', () => this.library.close());
  }

  renderChrome() {
    this.project = this.store.getCurrent();
    if (!this.project) return;
    document.getElementById('project-name').textContent = this.project.name;
    const completed = STAGES.filter((stage) => this.project.stages[stage].status === 'complete').length;
    document.getElementById('project-progress').textContent = `${completed} / ${STAGES.length}`;
    document.getElementById('readiness-score-pill').textContent = this.project.readiness.overall.toFixed(1);
    document.getElementById('readiness-score-pill').classList.toggle('is-pass', this.project.readiness.gate === 'PASS');
    const primary = this.project.sources.filter((source) => source.trust_level === 'primary').length;
    const reference = this.project.sources.filter((source) => ['reference', 'inspiration'].includes(source.trust_level)).length;
    const conflicts = this.project.sources.flatMap((source) => source.conflicts || []).filter((conflict) => !conflict.resolved).length;
    const summary = document.querySelector('#source-summary dl');
    if (summary) summary.innerHTML = `<div><dt>${locale() === 'es-MX' ? 'Primarias' : 'Primary'}</dt><dd>${primary}</dd></div><div><dt>${locale() === 'es-MX' ? 'Referencia' : 'Reference'}</dt><dd>${reference}</dd></div><div><dt>${locale() === 'es-MX' ? 'Conflictos' : 'Conflicts'}</dt><dd class="${conflicts ? 'warn' : ''}">${conflicts}</dd></div>`;
    const blocker = document.querySelector('#source-summary > p');
    if (blocker) blocker.textContent = this.blockerText();
    document.getElementById('open-current-stage').textContent = text('openStage');
    document.querySelectorAll('.workflow-step').forEach((button) => {
      const stage = button.dataset.stage;
      const status = this.project.stages[stage].status;
      button.classList.toggle('is-complete', status === 'complete');
      button.classList.toggle('is-active', status === 'active');
      button.setAttribute('aria-disabled', String(status === 'locked'));
      const state = button.querySelector('.step-state');
      if (state) state.textContent = status === 'complete' ? (locale() === 'es-MX' ? 'Listo' : 'Done') : status === 'active' ? (locale() === 'es-MX' ? 'Activo' : 'Active') : (locale() === 'es-MX' ? 'Bloqueado' : 'Locked');
    });
  }

  blockerText() {
    if (this.project.stages.intake.status !== 'complete') return text('intakeBlocked');
    if (this.project.stages.sources.status !== 'complete') return text('sourceBlocked');
    if (this.project.readiness.gate !== 'PASS') return text('readinessBlocked');
    return locale() === 'es-MX' ? 'La estrategia está lista para comenzar.' : 'Strategy is ready to begin.';
  }

  openLibrary() {
    const projects = this.store.list();
    const content = this.library.querySelector('#project-library-content');
    content.innerHTML = projects.length ? `<div class="project-list">${projects.map((project) => `<button type="button" class="project-list-item ${project.project_id === this.project.project_id ? 'is-current' : ''}" data-project-id="${esc(project.project_id)}" data-help="switchToProject" title="${text('switchProject')}" aria-label="${text('switchProject')}: ${esc(project.name)}"><span><strong>${esc(project.name)}</strong><small>${esc(project.market || stageLabel(project.current_stage))}</small></span><span>${project.project_id === this.project.project_id ? text('current') : project.readiness.overall.toFixed(1)}</span></button>`).join('')}</div>` : `<p>${text('noProjects')}</p>`;
    content.querySelectorAll('[data-project-id]').forEach((button) => button.addEventListener('click', () => {
      this.store.setCurrent(button.dataset.projectId);
      this.project = this.store.getCurrent();
      this.library.close();
      this.renderChrome();
    }));
    this.library.showModal();
  }

  openNewProject() {
    this.dialog.dataset.stage = 'new-project';
    this.dialog.querySelector('#workbench-title').textContent = text('newProject');
    this.dialog.querySelector('#workbench-help').textContent = locale() === 'es-MX' ? 'Empieza con una fuente real. Puedes agregar más después.' : 'Start with one real source. You can add more later.';
    this.dialog.querySelector('#workbench-content').innerHTML = `<form id="new-project-form" class="workbench-form"><div class="field-grid"><label><span>${text('name')}</span><input name="name" required maxlength="120"></label><label><span>${text('market')}</span><input name="market" maxlength="120"></label><label><span>${text('sourceType')}</span><select name="source_type"><option value="idea">${text('idea')}</option><option value="url">${text('url')}</option><option value="repo">${text('repo')}</option><option value="files">${text('files')}</option><option value="logo">${text('logo')}</option><option value="image">${text('image')}</option></select></label><label><span>${text('sourceLocation')}</span><input name="source_location" maxlength="240"></label></div><fieldset><legend>${text('language')}</legend><label class="check-row"><input type="checkbox" name="languages" value="en" checked> English</label><label class="check-row"><input type="checkbox" name="languages" value="es-MX"> Español de México</label></fieldset><footer class="dialog-actions"><button type="button" class="secondary-button" data-cancel data-help="cancelNewProject" aria-label="${text('cancel')}">${text('cancel')}</button><button type="submit" class="primary-button" data-help="createProject" aria-label="${text('create')}">${text('create')}</button></footer></form>`;
    const form = this.dialog.querySelector('#new-project-form');
    form.querySelector('[data-cancel]').addEventListener('click', () => this.dialog.close());
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const languages = data.getAll('languages');
      this.project = this.store.create({ name: data.get('name'), market: data.get('market'), source_type: data.get('source_type'), source_location: data.get('source_location'), languages });
      await this.agentBridge?.invoke('create-project', this.project);
      this.renderChrome();
      this.openStage('intake');
    });
    this.dialog.showModal();
  }

  openStage(stage) {
    this.project = this.store.getCurrent();
    const status = this.project.stages[stage]?.status || 'locked';
    this.dialog.dataset.stage = stage;
    this.dialog.querySelector('#workbench-title').textContent = stageLabel(stage);
    const content = this.dialog.querySelector('#workbench-content');
    if (status === 'locked') {
      this.dialog.querySelector('#workbench-help').textContent = text('lockedBody');
      content.innerHTML = `<section class="locked-panel"><strong>${text('lockedTitle')}</strong><p>${text('lockedBody')}</p><p>${esc(this.blockerText())}</p></section>`;
    } else if (stage === 'intake') this.renderIntake(content);
    else if (stage === 'sources') this.renderSources(content);
    else if (stage === 'readiness') this.renderReadiness(content);
    else content.innerHTML = `<section class="locked-panel"><strong>${stageLabel(stage)}</strong><p>${locale() === 'es-MX' ? 'Esta etapa se construirá en la siguiente fase, usando el proyecto y la evidencia ya guardados.' : 'This stage is the next build phase and will use the project and evidence already stored.'}</p></section>`;
    if (!this.dialog.open) this.dialog.showModal();
  }

  renderIntake(content) {
    this.dialog.querySelector('#workbench-help').textContent = text('intakeHelp');
    const intake = this.project.intake;
    const qIndex = Math.min(this.project.discovery.current_question || 0, QUESTIONS.length - 1);
    const question = QUESTIONS[qIndex];
    const known = [intake.business_goal, intake.audience, intake.primary_action].filter(Boolean).join(' · ');
    content.innerHTML = `<div class="stage-grid"><form id="intake-form" class="workbench-form"><h3>${text('intakeTitle')}</h3><div class="field-grid"><label><span>${text('goal')}</span><textarea name="business_goal" rows="3" required>${esc(intake.business_goal)}</textarea></label><label><span>${text('audience')}</span><textarea name="audience" rows="3" required>${esc(intake.audience)}</textarea></label><label><span>${text('action')}</span><input name="primary_action" value="${esc(intake.primary_action)}" required></label><label><span>${text('approver')}</span><input name="approval_authority" value="${esc(intake.approval_authority)}" required></label><label><span>${text('market')}</span><input name="market" value="${esc(this.project.market)}"></label><label><span>${text('constraints')}</span><textarea name="constraints" rows="3">${esc(intake.constraints)}</textarea></label></div><fieldset><legend>${text('language')}</legend><label class="check-row"><input type="checkbox" name="languages" value="en" ${checked(this.project.languages.includes('en'))}> English</label><label class="check-row"><input type="checkbox" name="languages" value="es-MX" ${checked(this.project.languages.includes('es-MX'))}> Español de México</label></fieldset><button class="primary-button" type="submit" data-help="saveIntake" aria-label="${text('saveIntake')}">${text('saveIntake')}</button></form><section class="discovery-card"><p class="eyebrow">${text('discoveryTitle')}</p><h3>${qIndex + 1}. ${locale() === 'es-MX' ? question.es : question.en}</h3><dl><div><dt>${text('known')}</dt><dd>${esc(known || (locale() === 'es-MX' ? 'Todavía falta información.' : 'More information is still needed.'))}</dd></div><div><dt>${text('recommendation')}</dt><dd>${esc(locale() === 'es-MX' ? question.recEs : question.recEn)}</dd></div></dl><label><span>${text('answer')}</span><textarea id="discovery-answer" rows="5">${esc(this.project.discovery.answers[question.id] || '')}</textarea></label><button id="save-discovery-answer" class="secondary-button" type="button" data-help="saveDiscoveryAnswer" aria-label="${qIndex === QUESTIONS.length - 1 ? text('completeInterview') : text('saveNext')}">${qIndex === QUESTIONS.length - 1 ? text('completeInterview') : text('saveNext')}</button></section></div>`;
    content.querySelector('#intake-form').addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      this.project = this.store.saveIntake(this.project.project_id, { business_goal: data.get('business_goal'), audience: data.get('audience'), primary_action: data.get('primary_action'), approval_authority: data.get('approval_authority'), market: data.get('market'), constraints: data.get('constraints'), languages: data.getAll('languages') });
      await this.agentBridge?.invoke('save-intake', { project_id: this.project.project_id, intake: this.project.intake });
      this.renderChrome();
      this.openStage('intake');
    });
    content.querySelector('#save-discovery-answer').addEventListener('click', async () => {
      const answer = content.querySelector('#discovery-answer').value;
      if (!answer.trim()) return content.querySelector('#discovery-answer').focus();
      this.project = this.store.answerDiscovery(this.project.project_id, question.id, answer);
      await this.agentBridge?.invoke('answer-discovery', { project_id: this.project.project_id, question_id: question.id, answer });
      this.renderChrome();
      this.openStage('intake');
    });
  }

  renderSources(content) {
    this.dialog.querySelector('#workbench-help').textContent = text('sourcesHelp');
    const rows = this.project.sources.map((source) => {
      const unresolved = (source.conflicts || []).find((conflict) => !conflict.resolved);
      return `<tr><td><strong>${esc(source.type)}</strong><small>${esc(source.location)}</small></td><td><select data-source-field="trust_level" data-source-id="${esc(source.source_id)}"><option value="primary" ${selected(source.trust_level, 'primary')}>${text('primary')}</option><option value="governing" ${selected(source.trust_level, 'governing')}>${text('governing')}</option><option value="reference" ${selected(source.trust_level, 'reference')}>${text('reference')}</option><option value="inspiration" ${selected(source.trust_level, 'inspiration')}>${text('inspiration')}</option></select></td><td><select data-source-field="rights_status" data-source-id="${esc(source.source_id)}"><option value="unknown" ${selected(source.rights_status, 'unknown')}>${text('unknown')}</option><option value="owned" ${selected(source.rights_status, 'owned')}>${text('owned')}</option><option value="licensed" ${selected(source.rights_status, 'licensed')}>${text('licensed')}</option><option value="cleared" ${selected(source.rights_status, 'cleared')}>${text('cleared')}</option><option value="public-domain" ${selected(source.rights_status, 'public-domain')}>${text('publicDomain')}</option></select></td><td><label class="switch-row"><input type="checkbox" data-source-field="accessed" data-source-id="${esc(source.source_id)}" ${checked(source.accessed)}><span>${text('accessed')}</span></label></td><td>${unresolved ? `<button type="button" class="text-button" data-resolve-source="${esc(source.source_id)}" data-help="resolveSourceConflict" title="${esc(unresolved.note)}" aria-label="${text('resolve')}: ${esc(unresolved.note)}">${text('resolve')}</button>` : text('none')}</td></tr>`;
    }).join('');
    content.innerHTML = `<section><div class="section-heading"><div><h3>${text('sourcesTitle')}</h3><p>${text('sourcesHelp')}</p></div></div><div class="table-wrap"><table class="source-table"><thead><tr><th>${text('location')}</th><th>${text('trust')}</th><th>${text('rights')}</th><th>${text('accessed')}</th><th>${text('conflict')}</th></tr></thead><tbody>${rows || `<tr><td colspan="5">${text('none')}</td></tr>`}</tbody></table></div><form id="add-source-form" class="inline-form"><select name="type"><option value="brief">${text('brief')}</option><option value="url">${text('url')}</option><option value="repo">${text('repo')}</option><option value="logo">${text('logo')}</option><option value="image">${text('image')}</option><option value="files">${text('files')}</option></select><input name="location" aria-label="${text('location')}" placeholder="${text('sourceLocation')}" required><select name="trust_level"><option value="primary">${text('primary')}</option><option value="governing">${text('governing')}</option><option value="reference">${text('reference')}</option><option value="inspiration">${text('inspiration')}</option></select><button class="primary-button" type="submit" data-help="addSource" aria-label="${text('addSource')}">${text('addSource')}</button></form></section>`;
    content.querySelectorAll('[data-source-field]').forEach((control) => control.addEventListener('change', async () => {
      const value = control.type === 'checkbox' ? control.checked : control.value;
      this.project = this.store.updateSource(this.project.project_id, control.dataset.sourceId, { [control.dataset.sourceField]: value });
      await this.agentBridge?.invoke('update-source', { project_id: this.project.project_id, source_id: control.dataset.sourceId, field: control.dataset.sourceField, value });
      this.renderChrome();
      this.openStage('sources');
    }));
    content.querySelectorAll('[data-resolve-source]').forEach((button) => button.addEventListener('click', () => {
      this.project = this.store.update(this.project.project_id, (project) => {
        const source = project.sources.find((item) => item.source_id === button.dataset.resolveSource);
        source.conflicts = (source.conflicts || []).map((conflict) => ({ ...conflict, resolved: true }));
        return project;
      });
      this.renderChrome();
      this.openStage('sources');
    }));
    content.querySelector('#add-source-form').addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      this.project = this.store.addSource(this.project.project_id, { type: data.get('type'), location: data.get('location'), trust_level: data.get('trust_level'), accessed: false, rights_status: 'unknown' });
      await this.agentBridge?.invoke('add-source', { project_id: this.project.project_id, source: this.project.sources.at(-1) });
      this.renderChrome();
      this.openStage('sources');
    });
  }

  renderReadiness(content) {
    this.dialog.querySelector('#workbench-help').textContent = text('readinessHelp');
    const readiness = this.project.readiness;
    content.innerHTML = `<section><div class="readiness-hero ${readiness.gate === 'PASS' ? 'is-pass' : ''}"><div><span>${text('overall')}</span><strong>${readiness.overall.toFixed(1)}</strong></div><b>${readiness.gate === 'PASS' ? text('pass') : text('fail')}</b></div><form id="readiness-form"><div class="readiness-grid">${PREBUILD_AXES.map((axis) => `<label class="readiness-axis ${axis.critical ? 'is-critical' : ''}"><span><strong>${esc(locale() === 'es-MX' ? axis.es : axis.en)}</strong>${axis.critical ? `<small>${text('critical')}</small>` : ''}</span><input type="range" min="0" max="10" step="0.5" name="${esc(axis.id)}" value="${readiness.scores[axis.id]}"><output>${Number(readiness.scores[axis.id]).toFixed(1)}</output></label>`).join('')}</div><button class="primary-button" type="submit" data-help="saveReadinessScores" aria-label="${text('saveScores')}">${text('saveScores')}</button></form></section>`;
    content.querySelectorAll('.readiness-axis input').forEach((input) => input.addEventListener('input', () => { input.nextElementSibling.textContent = Number(input.value).toFixed(1); }));
    content.querySelector('#readiness-form').addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const scores = Object.fromEntries(PREBUILD_AXES.map((axis) => [axis.id, Number(data.get(axis.id))]));
      this.project = this.store.saveReadinessScores(this.project.project_id, scores);
      await this.agentBridge?.invoke('save-readiness', { project_id: this.project.project_id, scores, result: this.project.readiness });
      this.renderChrome();
      this.openStage('readiness');
    });
  }
}
