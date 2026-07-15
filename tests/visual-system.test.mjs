import test from 'node:test';
import assert from 'node:assert/strict';
import { MemoryStorage, PREBUILD_AXES } from '../apps/studio/project-store.js';
import { StudioProjectStore, visualIsComplete } from '../apps/studio/studio-project-store.js';

function strategy() {
  return {
    positioning: 'Evidence-led brand system.', promise: 'Clear work people can trust.', reasons_to_believe: 'Governed sources and approvals.', values: 'Clarity and respect.',
    message_hierarchy: { primary: 'Build clarity.', support: 'Keep evidence connected.', cta: 'Start a project' },
    proof_ledger: [{ claim: 'Claims are traced.', source: 'brief.md', status: 'confirmed' }],
    territories: [1, 2, 3].map((index) => ({ id: `territory-${index}`, name: `Territory ${index}`, concept: `Concept ${index}`, mood: `Mood ${index}`, avoid: `Avoid ${index}` }))
  };
}

function voice() {
  return {
    identity: 'Direct and grounded.', audience_language: 'Use customer language.', prohibited_language: 'No hype.', real_phrases: 'Clear work.', true_stories: 'Approved stories only.',
    channel_rules: 'Concise web and contextual social.', localization_rules: 'Natural Mexican Spanish.', examples: 'We make useful systems.', axes: { direct: 70, warm: 50, playful: 20, concise: 75 }
  };
}

function visual() {
  return {
    selected_territory: 'territory-1', logo_policy: 'preserve', logo_notes: 'Preserve supplied geometry.',
    colors: { primary: '#173F35', secondary: '#2F6A49', accent: '#D76A43', background: '#F3EFE6', text: '#161A18' },
    typography: { display: 'Editorial serif', body: 'Humanist sans', scale: 'balanced', rules: 'Use a clear hierarchy and readable line lengths.' },
    imagery: { direction: 'Documentary and human.', lighting: 'Natural light.', composition: 'Context before detail.', people: 'Real community participants.', forbidden: 'No synthetic polish or stereotypes.' },
    illustration: 'Simple editorial diagrams.', icon_family: 'Phosphor', patterns_textures: 'Subtle material texture.', layout_rules: 'Strong grid, clear grouping, generous whitespace.', motion_rules: 'Purposeful motion with reduced-motion support.',
    applications: ['website', 'social', 'presentation'], accessibility_notes: 'WCAG AA contrast, keyboard access, readable type.'
  };
}

function readyStore() {
  const store = new StudioProjectStore(new MemoryStorage());
  let project = store.create({ name: 'Visual Brand', source_type: 'idea', business_goal: 'Grow', audience: 'Teams', primary_action: 'Contact', approval_authority: 'Bambu', constraints: 'Two weeks' });
  project = store.saveReadinessScores(project.project_id, Object.fromEntries(PREBUILD_AXES.map((axis) => [axis.id, 9])));
  project = store.saveStrategy(project.project_id, strategy());
  project = store.saveVoice(project.project_id, voice());
  return { store, project };
}

test('visual system remains incomplete without three priority applications', () => {
  const candidate = visual();
  candidate.applications = ['website', 'social'];
  assert.equal(visualIsComplete(candidate, { territories: strategy().territories }), false);
});

test('visual system requires an approved strategy territory', () => {
  const candidate = visual();
  candidate.selected_territory = 'unknown';
  assert.equal(visualIsComplete(candidate, { territories: strategy().territories }), false);
});

test('completing the visual system unlocks brand-book construction', () => {
  const { store, project } = readyStore();
  assert.equal(project.stages.visual.status, 'active');
  assert.equal(project.stages.brandbook.status, 'locked');
  const completed = store.saveVisual(project.project_id, visual());
  assert.equal(completed.stages.visual.status, 'complete');
  assert.equal(completed.stages.brandbook.status, 'active');
  assert.equal(visualIsComplete(completed.visual, completed.strategy), true);
});

test('existing projects receive safe visual defaults', () => {
  const storage = new MemoryStorage();
  storage.setItem('pauli-brand-studio-projects-v2', JSON.stringify({ version: 2, current_project_id: 'old', projects: { old: { project_id: 'old', name: 'Old', intake: {}, sources: [], discovery: { answers: {} }, readiness: { scores: {} }, stages: {} } } }));
  const project = new StudioProjectStore(storage).getCurrent();
  assert.equal(project.visual.logo_policy, 'preserve');
  assert.equal(project.visual.applications.length, 0);
  assert.equal(project.stages.visual.status, 'locked');
});
