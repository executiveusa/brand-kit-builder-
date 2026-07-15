import test from 'node:test';
import assert from 'node:assert/strict';
import { BrandProjectStore, MemoryStorage, PREBUILD_AXES, calculateReadiness, strategyIsComplete, voiceIsComplete } from '../apps/studio/project-store.js';

function readyProject(store, name = 'Ready Brand') {
  let project = store.create({
    name, source_type: 'idea', business_goal: 'Grow', audience: 'Teams', primary_action: 'Contact', approval_authority: 'Bambu', constraints: 'Two weeks'
  });
  const scores = Object.fromEntries(PREBUILD_AXES.map((axis) => [axis.id, 9]));
  return store.saveReadinessScores(project.project_id, scores);
}

function completeStrategy() {
  return {
    positioning: 'For purpose-led teams, this is the clear brand system that turns evidence into useful communication.',
    promise: 'Clear work people can trust.',
    reasons_to_believe: 'Source traceability, bilingual delivery, and governed approvals.',
    values: 'Clarity, proof, respect, and usefulness.',
    message_hierarchy: { primary: 'Build clarity from evidence.', support: 'Strategy, voice, and design stay connected.', cta: 'Start the brand project' },
    proof_ledger: [{ claim: 'Every approved claim traces to a source.', source: 'brand-brief.md', status: 'confirmed' }],
    territories: [1, 2, 3].map((index) => ({ id: `territory-${index}`, name: `Direction ${index}`, concept: `Distinct strategic concept ${index}`, mood: `Specific visual mood ${index}`, avoid: `Avoid imitation ${index}` }))
  };
}

function completeVoice() {
  return {
    identity: 'Direct, warm, professional, and grounded.',
    audience_language: 'Use the words customers already use for their problem.',
    prohibited_language: 'No hype, fabricated proof, vague impact, or forced slang.',
    real_phrases: 'Clear work. Useful systems. Evidence first.',
    true_stories: 'Use only documented founder and client stories.',
    channel_rules: 'Website is concise; social adds context; proposals remain specific.',
    localization_rules: 'Write natural Mexican Spanish instead of literal translation.',
    examples: 'We turn confirmed ideas into a brand system your team can use.',
    axes: { direct: 70, warm: 55, playful: 25, concise: 75 }
  };
}

test('creates and persists a bilingual project', () => {
  const storage = new MemoryStorage();
  const store = new BrandProjectStore(storage);
  const project = store.create({ name: 'Estudio Norte', source_type: 'idea', languages: ['en', 'es-MX'], business_goal: 'Clarify the offer', audience: 'Local founders', primary_action: 'Book a call', approval_authority: 'Bambu' });
  assert.equal(project.project_id, 'estudio-norte');
  assert.deepEqual(project.languages, ['en', 'es-MX']);
  const reloaded = new BrandProjectStore(storage);
  assert.equal(reloaded.getCurrent().name, 'Estudio Norte');
  assert.equal(reloaded.getCurrent().schema_version, '2.1');
});

test('blocks readiness until sources and critical axes pass', () => {
  const store = new BrandProjectStore(new MemoryStorage());
  const project = store.create({ name: 'Blocked Brand', source_type: 'url', source_location: 'https://example.test', business_goal: 'Grow', audience: 'Teams', primary_action: 'Contact', approval_authority: 'Bambu' });
  assert.equal(project.readiness.gate, 'FAIL');
  assert.equal(project.stages.readiness.status, 'locked');
});

test('passes the 20-axis gate after accessed sources and complete scores', () => {
  const store = new BrandProjectStore(new MemoryStorage());
  const project = readyProject(store);
  assert.equal(project.readiness.gate, 'PASS');
  assert.equal(project.stages.strategy.status, 'active');
  assert.equal(project.stages.voice.status, 'locked');
});

test('reports all twenty readiness axes', () => {
  const project = { intake: {}, sources: [], discovery: { answers: {} }, readiness: { scores: {} }, languages: [] };
  const result = calculateReadiness(project);
  assert.equal(Object.keys(result.scores).length, 20);
  assert.ok(result.critical_gaps.length > 0);
});

test('strategy requires sourced proof and three distinct complete territories', () => {
  const incomplete = completeStrategy();
  incomplete.proof_ledger = [];
  assert.equal(strategyIsComplete(incomplete), false);
  assert.equal(strategyIsComplete(completeStrategy()), true);
});

test('completing strategy unlocks voice and completing voice unlocks visual', () => {
  const store = new BrandProjectStore(new MemoryStorage());
  let project = readyProject(store, 'Progressive Brand');
  project = store.saveStrategy(project.project_id, completeStrategy());
  assert.equal(project.stages.strategy.status, 'complete');
  assert.equal(project.stages.voice.status, 'active');
  assert.equal(project.stages.visual.status, 'locked');
  project = store.saveVoice(project.project_id, completeVoice());
  assert.equal(voiceIsComplete(project.voice), true);
  assert.equal(project.stages.voice.status, 'complete');
  assert.equal(project.stages.visual.status, 'active');
});

test('legacy version 2 projects migrate without losing intake data', () => {
  const storage = new MemoryStorage();
  storage.setItem('pauli-brand-studio-projects-v2', JSON.stringify({ version: 2, current_project_id: 'legacy', projects: { legacy: { project_id: 'legacy', name: 'Legacy Brand', intake: { business_goal: 'Keep this goal', audience: 'Teams', primary_action: 'Call', approval_authority: 'Bambu' }, sources: [{ source_id: 'brief', type: 'brief', location: 'brief', trust_level: 'primary', accessed: true, rights_status: 'owned' }], discovery: { answers: {} }, readiness: { scores: {} }, stages: {} } } }));
  const project = new BrandProjectStore(storage).getCurrent();
  assert.equal(project.intake.business_goal, 'Keep this goal');
  assert.equal(project.schema_version, '2.1');
  assert.equal(project.strategy.territories.length, 3);
  assert.equal(typeof project.voice.axes.direct, 'number');
});
