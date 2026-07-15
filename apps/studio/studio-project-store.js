import { BrandProjectStore, STAGES, voiceIsComplete } from './project-store.js';
import { brandbookIsComplete, buildBrandbookDraft } from './kaku-brandbook.js';

function now() { return new Date().toISOString(); }
function nonEmpty(value) { return Boolean(String(value ?? '').trim()); }
function validHex(value) { return /^#[0-9a-f]{6}$/i.test(String(value || '')); }

export function blankVisualSystem() {
  return {
    selected_territory: '',
    logo_policy: 'preserve',
    logo_notes: '',
    colors: { primary: '#173f35', secondary: '#2f6a49', accent: '#d76a43', background: '#f3efe6', text: '#161a18' },
    typography: { display: '', body: '', scale: 'balanced', rules: '' },
    imagery: { direction: '', lighting: '', composition: '', people: '', forbidden: '' },
    illustration: '', icon_family: '', patterns_textures: '', layout_rules: '', motion_rules: '',
    applications: [], accessibility_notes: '', updated_at: null
  };
}

export function normalizeVisualSystem(visual = {}) {
  const base = blankVisualSystem();
  return {
    ...base,
    ...visual,
    colors: { ...base.colors, ...(visual.colors || {}) },
    typography: { ...base.typography, ...(visual.typography || {}) },
    imagery: { ...base.imagery, ...(visual.imagery || {}) },
    applications: Array.isArray(visual.applications) ? [...new Set(visual.applications.filter(nonEmpty))] : []
  };
}

export function visualIsComplete(visual = {}, strategy = {}) {
  const normalized = normalizeVisualSystem(visual);
  const territoryIds = new Set((strategy.territories || []).map((territory) => territory.id));
  const territorySelected = territoryIds.has(normalized.selected_territory);
  const colorsComplete = Object.values(normalized.colors).every(validHex);
  const typographyComplete = [normalized.typography.display, normalized.typography.body, normalized.typography.rules].every(nonEmpty);
  const imageryComplete = [normalized.imagery.direction, normalized.imagery.lighting, normalized.imagery.composition, normalized.imagery.forbidden].every(nonEmpty);
  const systemComplete = [normalized.logo_policy, normalized.icon_family, normalized.layout_rules, normalized.motion_rules, normalized.accessibility_notes].every(nonEmpty);
  return territorySelected && colorsComplete && typographyComplete && imageryComplete && systemComplete && normalized.applications.length >= 3;
}

export class StudioProjectStore extends BrandProjectStore {
  constructor(storage) {
    super(storage);
    for (const projectId of Object.keys(this.state.projects)) this.reconcileStudio(projectId, false);
    this.persist();
  }

  reconcileStudio(projectId, persist = true) {
    const project = this.state.projects[projectId];
    if (!project) throw new Error(`Unknown project: ${projectId}`);
    project.visual = normalizeVisualSystem(project.visual);
    const voiceReady = voiceIsComplete(project.voice);
    const visualComplete = voiceReady && visualIsComplete(project.visual, project.strategy);
    if (!project.brandbook && visualComplete) project.brandbook = buildBrandbookDraft(project, project.languages?.includes('es-MX') && !project.languages?.includes('en') ? 'es-MX' : 'en');
    const bookComplete = visualComplete && brandbookIsComplete(project.brandbook);
    project.stages.visual.status = voiceReady ? (visualComplete ? 'complete' : 'active') : 'locked';
    project.stages.brandbook.status = visualComplete ? (bookComplete ? 'complete' : 'active') : 'locked';
    project.stages.guardian.status = bookComplete ? (project.stages.guardian.status === 'complete' ? 'complete' : 'active') : 'locked';
    if (project.stages.export.status !== 'complete') project.stages.export.status = 'locked';
    project.current_stage = STAGES.find((stage) => project.stages[stage].status === 'active') || 'export';
    project.updated_at = now();
    if (persist) this.persist();
    return this.get(projectId);
  }

  create(input) {
    const project = super.create(input);
    return this.reconcileStudio(project.project_id);
  }

  update(projectId, updater) {
    super.update(projectId, updater);
    return this.reconcileStudio(projectId);
  }

  saveVisual(projectId, visual) {
    return this.update(projectId, (project) => {
      project.visual = normalizeVisualSystem({ ...project.visual, ...visual, colors: { ...project.visual?.colors, ...(visual.colors || {}) }, typography: { ...project.visual?.typography, ...(visual.typography || {}) }, imagery: { ...project.visual?.imagery, ...(visual.imagery || {}) }, updated_at: now() });
      return project;
    });
  }

  seedBrandbook(projectId, locale = 'en') {
    return this.update(projectId, (project) => {
      project.brandbook = buildBrandbookDraft(project, locale);
      return project;
    });
  }

  saveBrandbookSection(projectId, sectionId, patch) {
    return this.update(projectId, (project) => {
      if (!project.brandbook) project.brandbook = buildBrandbookDraft(project, 'en');
      const section = project.brandbook.sections.find((item) => item.id === sectionId);
      if (!section) throw new Error(`Unknown brand-book section: ${sectionId}`);
      Object.assign(section, patch);
      project.brandbook.updated_at = now();
      return project;
    });
  }

  saveBrandbookAnnex(projectId, annexId, patch) {
    return this.update(projectId, (project) => {
      if (!project.brandbook) project.brandbook = buildBrandbookDraft(project, 'en');
      const annex = project.brandbook.annexes.find((item) => item.id === annexId);
      if (!annex) throw new Error(`Unknown brand-book annex: ${annexId}`);
      Object.assign(annex, patch);
      project.brandbook.updated_at = now();
      return project;
    });
  }

  ensureDemoProject() {
    const project = super.ensureDemoProject();
    return this.reconcileStudio(project.project_id);
  }
}
