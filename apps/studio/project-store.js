export const PROJECT_STORAGE_KEY = 'pauli-brand-studio-projects-v2';

export const STAGES = ['intake', 'sources', 'readiness', 'strategy', 'voice', 'visual', 'brandbook', 'guardian', 'export'];

export const PREBUILD_AXES = [
  { id: 'source_completeness', critical: true, en: 'Source completeness', es: 'Fuentes completas' },
  { id: 'business_clarity', critical: true, en: 'Business clarity', es: 'Claridad del negocio' },
  { id: 'audience_clarity', critical: false, en: 'Audience clarity', es: 'Claridad de audiencia' },
  { id: 'offer_conversion_clarity', critical: false, en: 'Offer and conversion clarity', es: 'Claridad de oferta y conversión' },
  { id: 'differentiation', critical: false, en: 'Differentiation', es: 'Diferenciación' },
  { id: 'purpose_values', critical: false, en: 'Purpose and values', es: 'Propósito y valores' },
  { id: 'proof_claim_safety', critical: true, en: 'Proof and claim safety', es: 'Pruebas y seguridad de afirmaciones' },
  { id: 'voice_evidence', critical: false, en: 'Voice evidence', es: 'Evidencia de voz' },
  { id: 'visual_evidence', critical: false, en: 'Visual evidence', es: 'Evidencia visual' },
  { id: 'logo_status', critical: false, en: 'Logo status', es: 'Estado del logo' },
  { id: 'application_requirements', critical: false, en: 'Application requirements', es: 'Aplicaciones necesarias' },
  { id: 'accessibility_requirements', critical: false, en: 'Accessibility requirements', es: 'Requisitos de accesibilidad' },
  { id: 'localization_requirements', critical: false, en: 'Language and localization', es: 'Idioma y localización' },
  { id: 'rights_licensing', critical: true, en: 'Rights and licensing', es: 'Derechos y licencias' },
  { id: 'technical_environment', critical: false, en: 'Technical environment', es: 'Entorno técnico' },
  { id: 'deliverable_scope', critical: false, en: 'Deliverable scope', es: 'Alcance de entregables' },
  { id: 'approval_authority', critical: true, en: 'Approval authority', es: 'Autoridad de aprobación' },
  { id: 'production_constraints', critical: false, en: 'Budget, time, and production constraints', es: 'Límites de presupuesto, tiempo y producción' },
  { id: 'handoff_readiness', critical: false, en: 'Repository and handoff readiness', es: 'Preparación de repositorio y entrega' },
  { id: 'contradiction_resolution', critical: true, en: 'Contradiction resolution', es: 'Resolución de contradicciones' }
];

const DEMO_PROJECT_ID = 'kupuri-media-demo';

function now() { return new Date().toISOString(); }
function deepClone(value) { return value == null ? value : JSON.parse(JSON.stringify(value)); }
function safeSlug(value) {
  const slug = String(value ?? '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 64);
  return slug || `brand-${Date.now().toString(36)}`;
}
function nonEmpty(value) { return Boolean(String(value ?? '').trim()); }
function splitLines(value) { return Array.isArray(value) ? value.filter(nonEmpty) : String(value ?? '').split(/\r?\n/).map((item) => item.trim()).filter(Boolean); }

export class MemoryStorage {
  constructor() { this.map = new Map(); }
  getItem(key) { return this.map.has(key) ? this.map.get(key) : null; }
  setItem(key, value) { this.map.set(key, String(value)); }
  removeItem(key) { this.map.delete(key); }
}

function browserStorage() {
  try {
    if (globalThis.localStorage) {
      const probe = '__pauli_brand_studio_probe__';
      globalThis.localStorage.setItem(probe, '1');
      globalThis.localStorage.removeItem(probe);
      return globalThis.localStorage;
    }
  } catch {}
  return new MemoryStorage();
}

function normalizeSource(source, index = 0) {
  return {
    source_id: source.source_id || `source-${Date.now().toString(36)}-${index}`,
    type: source.type || 'brief',
    location: String(source.location || 'confirmed-brief').trim(),
    trust_level: source.trust_level || 'primary',
    accessed: Boolean(source.accessed),
    rights_status: source.rights_status || 'unknown',
    conflicts: Array.isArray(source.conflicts) ? source.conflicts : [],
    notes: source.notes || '',
    added_at: source.added_at || now()
  };
}

function blankStages() { return Object.fromEntries(STAGES.map((stage, index) => [stage, { status: index === 0 ? 'active' : 'locked' }])); }
function blankStrategy() {
  return {
    positioning: '', promise: '', reasons_to_believe: '', values: '',
    message_hierarchy: { primary: '', support: '', cta: '' },
    proof_ledger: [],
    territories: [1, 2, 3].map((index) => ({ id: `territory-${index}`, name: '', concept: '', mood: '', avoid: '' })),
    updated_at: null
  };
}
function blankVoice() {
  return {
    identity: '', audience_language: '', prohibited_language: '', real_phrases: '', true_stories: '', channel_rules: '', localization_rules: '', examples: '',
    axes: { direct: 50, warm: 50, playful: 30, concise: 60 }, updated_at: null
  };
}
function normalizeStrategy(strategy = {}) {
  const base = blankStrategy();
  const territories = Array.isArray(strategy.territories) ? strategy.territories.slice(0, 3) : [];
  while (territories.length < 3) territories.push(base.territories[territories.length]);
  return {
    ...base, ...strategy,
    message_hierarchy: { ...base.message_hierarchy, ...(strategy.message_hierarchy || {}) },
    proof_ledger: Array.isArray(strategy.proof_ledger) ? strategy.proof_ledger : [],
    territories: territories.map((territory, index) => ({ ...base.territories[index], ...(territory || {}), id: territory?.id || `territory-${index + 1}` }))
  };
}
function normalizeVoice(voice = {}) { const base = blankVoice(); return { ...base, ...voice, axes: { ...base.axes, ...(voice.axes || {}) } }; }
function normalizeProject(project) {
  const normalized = { ...project };
  normalized.schema_version = '2.1';
  normalized.intake = { business_goal: '', audience: '', primary_action: '', approval_authority: '', constraints: '', ...(project.intake || {}) };
  normalized.languages = Array.isArray(project.languages) && project.languages.length ? [...new Set(project.languages)] : ['en'];
  normalized.sources = Array.isArray(project.sources) ? project.sources.map(normalizeSource) : [];
  normalized.discovery = { current_question: 0, answers: {}, ...(project.discovery || {}) };
  normalized.readiness = { scores: {}, overall: 0, gate: 'FAIL', gaps: [], ...(project.readiness || {}) };
  normalized.stages = { ...blankStages(), ...(project.stages || {}) };
  normalized.strategy = normalizeStrategy(project.strategy);
  normalized.voice = normalizeVoice(project.voice);
  normalized.created_at = project.created_at || now();
  normalized.updated_at = project.updated_at || now();
  return normalized;
}

export function createProjectRecord(input = {}) {
  const projectId = safeSlug(input.project_id || input.name);
  const initialSource = input.source_type ? normalizeSource({
    source_id: 'initial-source',
    type: input.source_type,
    location: input.source_location || (input.source_type === 'idea' ? 'confirmed-brief' : 'pending'),
    trust_level: 'primary',
    accessed: input.source_type === 'idea',
    rights_status: input.source_type === 'idea' ? 'owned' : 'unknown'
  }) : null;
  return normalizeProject({
    project_id: projectId, name: String(input.name || 'Untitled brand').trim(),
    classification: input.classification || 'greenfield', market: String(input.market || '').trim(),
    languages: Array.isArray(input.languages) && input.languages.length ? [...new Set(input.languages)] : ['en'],
    intake: { business_goal: input.business_goal || '', audience: input.audience || '', primary_action: input.primary_action || '', approval_authority: input.approval_authority || '', constraints: input.constraints || '' },
    sources: initialSource ? [initialSource] : [], discovery: { current_question: 0, answers: {} },
    readiness: { scores: {}, overall: 0, gate: 'FAIL', gaps: [] }, stages: blankStages(), current_stage: 'intake', created_at: now(), updated_at: now()
  });
}

function hasAnswer(project, id) { return nonEmpty(project.discovery?.answers?.[id]); }
function hasSourceType(project, types) { return project.sources.some((source) => types.includes(source.type)); }
function sourceGate(project) {
  const primary = project.sources.filter((source) => ['primary', 'governing'].includes(source.trust_level));
  const unresolved = project.sources.flatMap((source) => source.conflicts || []).filter((conflict) => !conflict.resolved);
  return { passed: primary.length > 0 && primary.every((source) => source.accessed) && unresolved.length === 0, unresolved };
}
function rightsGate(project) {
  const relevant = project.sources.filter((source) => source.type !== 'idea' && source.type !== 'brief');
  return relevant.length === 0 || relevant.every((source) => ['owned', 'licensed', 'cleared', 'public-domain'].includes(source.rights_status));
}

function derivedScore(project, axisId) {
  const source = sourceGate(project); const rights = rightsGate(project); const intake = project.intake || {}; const languages = project.languages || [];
  const answers = project.discovery?.answers || {}; const answerCount = Object.values(answers).filter(nonEmpty).length; const base = Math.min(9, 4 + answerCount * 0.45);
  switch (axisId) {
    case 'source_completeness': return source.passed ? 9 : Math.max(3, 5 + project.sources.filter((item) => item.accessed).length);
    case 'business_clarity': return intake.business_goal ? 8.5 : hasAnswer(project, 'business_story') ? 8 : 4;
    case 'audience_clarity': return intake.audience ? 8.5 : hasAnswer(project, 'audience_pain') ? 8 : 4;
    case 'offer_conversion_clarity': return intake.primary_action ? 8.5 : hasAnswer(project, 'offer') ? 8 : 4;
    case 'differentiation': return hasAnswer(project, 'differentiation') ? 8.5 : base;
    case 'purpose_values': return hasAnswer(project, 'values') ? 8.5 : base;
    case 'proof_claim_safety': return hasAnswer(project, 'proof') ? 8.5 : 4;
    case 'voice_evidence': return hasAnswer(project, 'voice') ? 8.5 : base;
    case 'visual_evidence': return hasSourceType(project, ['image', 'logo', 'website', 'url', 'files']) ? 8 : 5;
    case 'logo_status': return hasSourceType(project, ['logo']) ? 9 : hasAnswer(project, 'applications') ? 7 : 5;
    case 'application_requirements': return hasAnswer(project, 'applications') ? 8.5 : base;
    case 'accessibility_requirements': return hasAnswer(project, 'accessibility') ? 8.5 : 5;
    case 'localization_requirements': return languages.length > 1 ? 9 : languages.length === 1 ? 8 : 4;
    case 'rights_licensing': return rights ? 9 : 4;
    case 'technical_environment': return hasSourceType(project, ['repo', 'repository', 'url', 'website']) ? 8.5 : 6;
    case 'deliverable_scope': return hasAnswer(project, 'applications') ? 8.5 : 5;
    case 'approval_authority': return intake.approval_authority ? 9 : 4;
    case 'production_constraints': return intake.constraints ? 8.5 : 6;
    case 'handoff_readiness': return hasSourceType(project, ['repo', 'repository']) ? 8.5 : 6;
    case 'contradiction_resolution': return source.unresolved.length === 0 ? 9 : 3;
    default: return base;
  }
}

export function calculateReadiness(project) {
  const scores = {};
  for (const axis of PREBUILD_AXES) {
    const explicit = Number(project.readiness?.scores?.[axis.id]);
    scores[axis.id] = Number.isFinite(explicit) ? Math.max(0, Math.min(10, explicit)) : derivedScore(project, axis.id);
  }
  const overall = Number((Object.values(scores).reduce((sum, score) => sum + score, 0) / PREBUILD_AXES.length).toFixed(1));
  const criticalGaps = PREBUILD_AXES.filter((axis) => axis.critical && scores[axis.id] < 8).map((axis) => axis.id);
  const gaps = PREBUILD_AXES.filter((axis) => scores[axis.id] < 8).map((axis) => axis.id);
  const source = sourceGate(project);
  const gate = overall >= 8.5 && criticalGaps.length === 0 && source.passed ? 'PASS' : 'FAIL';
  return { scores, overall, gate, critical_gaps: criticalGaps, gaps, source_gate: source.passed };
}

export function strategyIsComplete(strategy = {}) {
  const normalized = normalizeStrategy(strategy);
  const messages = normalized.message_hierarchy;
  const territoriesComplete = normalized.territories.length === 3 && normalized.territories.every((territory) => nonEmpty(territory.name) && nonEmpty(territory.concept) && nonEmpty(territory.mood) && nonEmpty(territory.avoid));
  const proofComplete = normalized.proof_ledger.length > 0 && normalized.proof_ledger.every((item) => nonEmpty(item.claim) && nonEmpty(item.source) && ['confirmed', 'provisional', 'blocked'].includes(item.status));
  return [normalized.positioning, normalized.promise, normalized.reasons_to_believe, normalized.values, messages.primary, messages.support, messages.cta].every(nonEmpty) && territoriesComplete && proofComplete;
}

export function voiceIsComplete(voice = {}) {
  const normalized = normalizeVoice(voice);
  return [normalized.identity, normalized.audience_language, normalized.prohibited_language, normalized.real_phrases, normalized.channel_rules, normalized.localization_rules, normalized.examples].every(nonEmpty);
}

function reconcileStages(inputProject) {
  const project = normalizeProject(inputProject);
  const intakeComplete = Boolean(project.intake.business_goal && project.intake.audience && project.intake.primary_action && project.intake.approval_authority);
  const sourcesComplete = sourceGate(project).passed;
  const readiness = calculateReadiness(project); project.readiness = readiness;
  const strategyComplete = strategyIsComplete(project.strategy);
  const voiceComplete = voiceIsComplete(project.voice);
  project.stages.intake.status = intakeComplete ? 'complete' : 'active';
  project.stages.sources.status = intakeComplete ? (sourcesComplete ? 'complete' : 'active') : 'locked';
  project.stages.readiness.status = sourcesComplete ? (readiness.gate === 'PASS' ? 'complete' : 'active') : 'locked';
  project.stages.strategy.status = readiness.gate === 'PASS' ? (strategyComplete ? 'complete' : 'active') : 'locked';
  project.stages.voice.status = strategyComplete ? (voiceComplete ? 'complete' : 'active') : 'locked';
  project.stages.visual.status = voiceComplete ? (project.stages.visual.status === 'complete' ? 'complete' : 'active') : 'locked';
  for (const stage of ['brandbook', 'guardian', 'export']) if (project.stages[stage].status !== 'complete') project.stages[stage].status = 'locked';
  project.current_stage = STAGES.find((stage) => project.stages[stage].status === 'active') || 'export';
  project.updated_at = now();
  return project;
}

export class BrandProjectStore {
  constructor(storage = browserStorage()) { this.storage = storage; this.state = this.load(); }
  load() {
    try {
      const parsed = JSON.parse(this.storage.getItem(PROJECT_STORAGE_KEY) || 'null');
      if (parsed?.version === 2 && parsed.projects) {
        parsed.projects = Object.fromEntries(Object.entries(parsed.projects).map(([id, project]) => [id, reconcileStages(project)]));
        return parsed;
      }
    } catch {}
    return { version: 2, current_project_id: null, projects: {} };
  }
  persist() { this.storage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(this.state)); }
  list() { return Object.values(this.state.projects).map(deepClone).sort((a, b) => b.updated_at.localeCompare(a.updated_at)); }
  get(projectId) { return deepClone(this.state.projects[projectId] || null); }
  getCurrent() { return this.get(this.state.current_project_id); }
  setCurrent(projectId) { if (!this.state.projects[projectId]) throw new Error(`Unknown project: ${projectId}`); this.state.current_project_id = projectId; this.persist(); return this.getCurrent(); }
  create(input) { const project = reconcileStages(createProjectRecord(input)); let projectId = project.project_id; let suffix = 2; while (this.state.projects[projectId]) projectId = `${project.project_id}-${suffix++}`; project.project_id = projectId; this.state.projects[projectId] = project; this.state.current_project_id = projectId; this.persist(); return deepClone(project); }
  update(projectId, updater) { const current = this.state.projects[projectId]; if (!current) throw new Error(`Unknown project: ${projectId}`); const draft = deepClone(current); const result = typeof updater === 'function' ? updater(draft) || draft : { ...draft, ...updater }; this.state.projects[projectId] = reconcileStages(result); this.persist(); return this.get(projectId); }
  addSource(projectId, source) { return this.update(projectId, (project) => { project.sources.push(normalizeSource(source, project.sources.length)); return project; }); }
  updateSource(projectId, sourceId, patch) { return this.update(projectId, (project) => { const source = project.sources.find((item) => item.source_id === sourceId); if (!source) throw new Error(`Unknown source: ${sourceId}`); Object.assign(source, patch); return project; }); }
  saveIntake(projectId, intake) { return this.update(projectId, (project) => { project.intake = { ...project.intake, ...intake }; if (Array.isArray(intake.languages)) project.languages = [...new Set(intake.languages)]; if (typeof intake.market === 'string') project.market = intake.market; return project; }); }
  answerDiscovery(projectId, questionId, answer) { return this.update(projectId, (project) => { project.discovery.answers[questionId] = String(answer || '').trim(); project.discovery.current_question = Math.min(project.discovery.current_question + 1, 9); return project; }); }
  saveReadinessScores(projectId, scores) { return this.update(projectId, (project) => { project.readiness.scores = { ...project.readiness.scores, ...scores }; return project; }); }
  saveStrategy(projectId, strategy) { return this.update(projectId, (project) => { project.strategy = normalizeStrategy({ ...project.strategy, ...strategy, message_hierarchy: { ...project.strategy?.message_hierarchy, ...(strategy.message_hierarchy || {}) }, updated_at: now() }); return project; }); }
  saveVoice(projectId, voice) { return this.update(projectId, (project) => { project.voice = normalizeVoice({ ...project.voice, ...voice, axes: { ...project.voice?.axes, ...(voice.axes || {}) }, updated_at: now() }); return project; }); }
  ensureDemoProject() {
    if (this.state.projects[DEMO_PROJECT_ID]) { if (!this.state.current_project_id) this.setCurrent(DEMO_PROJECT_ID); return this.get(DEMO_PROJECT_ID); }
    const demo = createProjectRecord({ project_id: DEMO_PROJECT_ID, name: 'Kupuri Media', source_type: 'idea', market: 'Mexico City', languages: ['en', 'es-MX'], business_goal: 'Build a clear bilingual creative studio brand.', audience: 'Purpose-led organizations and founders.', primary_action: 'Start a project', approval_authority: 'Bambu', constraints: 'Preserve cultural context and source traceability.' });
    demo.sources = [normalizeSource({ source_id: 'brief', type: 'brief', location: 'brand-brief.md', trust_level: 'primary', accessed: true, rights_status: 'owned' }), normalizeSource({ source_id: 'logo', type: 'logo', location: 'kupuri-logo.svg', trust_level: 'governing', accessed: true, rights_status: 'owned' }), normalizeSource({ source_id: 'website', type: 'url', location: 'kupuri-media-main-site.vercel.app', trust_level: 'reference', accessed: true, rights_status: 'owned', conflicts: [{ id: 'naming', note: 'Confirm public display name.', resolved: false }] })];
    demo.discovery.answers = { business_story: 'A Mexico City creative studio connecting culture, business, and community.', audience_pain: 'Clients need clearer stories and practical systems.', offer: 'Strategy, storytelling, and digital experiences.', differentiation: 'Culturally grounded work with practical delivery.', values: 'Context, clarity, usefulness, and community.', voice: 'Direct, warm, professional, and grounded.', proof: 'Use only confirmed projects and approved client evidence.', applications: 'Website, social media, presentations, and client handoff.', accessibility: 'Readable contrast, keyboard access, and bilingual clarity.' };
    this.state.projects[DEMO_PROJECT_ID] = reconcileStages(demo); this.state.current_project_id = DEMO_PROJECT_ID; this.persist(); return this.get(DEMO_PROJECT_ID);
  }
}

export { splitLines };
