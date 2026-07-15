import test from 'node:test';
import assert from 'node:assert/strict';
import { MemoryStorage, PREBUILD_AXES } from '../apps/studio/project-store.js';
import { StudioProjectStore } from '../apps/studio/studio-project-store.js';
import { DIGITAL_ANNEXES, KAKU_SECTIONS, brandbookIsComplete, buildBrandbookDraft, renderBrandbookDocument } from '../apps/studio/kaku-brandbook.js';

const strategy = {
  positioning: 'Evidence-led brand system.', promise: 'Clear work people can trust.', reasons_to_believe: 'Governed sources and approvals.', values: 'Clarity and respect.',
  message_hierarchy: { primary: 'Build clarity.', support: 'Keep evidence connected.', cta: 'Start a project' },
  proof_ledger: [{ claim: 'Claims are traced.', source: 'brief.md', status: 'confirmed' }],
  territories: [1, 2, 3].map((index) => ({ id: `territory-${index}`, name: `Territory ${index}`, concept: `Concept ${index}`, mood: `Mood ${index}`, avoid: `Avoid ${index}` }))
};
const voice = { identity: 'Direct and grounded.', audience_language: 'Use customer language.', prohibited_language: 'No hype.', real_phrases: 'Clear work.', true_stories: 'Approved stories only.', channel_rules: 'Concise web and contextual social.', localization_rules: 'Natural Mexican Spanish.', examples: 'We make useful systems.', axes: { direct: 70, warm: 50, playful: 20, concise: 75 } };
const visual = { selected_territory: 'territory-1', logo_policy: 'preserve', logo_notes: 'Preserve supplied geometry.', colors: { primary: '#173F35', secondary: '#2F6A49', accent: '#D76A43', background: '#F3EFE6', text: '#161A18' }, typography: { display: 'Editorial serif', body: 'Humanist sans', scale: 'balanced', rules: 'Readable hierarchy.' }, imagery: { direction: 'Documentary.', lighting: 'Natural light.', composition: 'Context first.', people: 'Real participants.', forbidden: 'No stereotypes.' }, illustration: 'Editorial diagrams.', icon_family: 'Phosphor', patterns_textures: 'Material texture.', layout_rules: 'Clear grid.', motion_rules: 'Purposeful and reduced-motion safe.', applications: ['website', 'social', 'presentation'], accessibility_notes: 'WCAG AA contrast.' };

function completeProject() {
  const store = new StudioProjectStore(new MemoryStorage());
  let project = store.create({ name: 'KAKU Test', source_type: 'idea', business_goal: 'Grow', audience: 'Teams', primary_action: 'Contact', approval_authority: 'Bambu', constraints: 'Two weeks', languages: ['en', 'es-MX'] });
  project = store.saveReadinessScores(project.project_id, Object.fromEntries(PREBUILD_AXES.map((axis) => [axis.id, 9])));
  project = store.saveStrategy(project.project_id, strategy);
  project = store.saveVoice(project.project_id, voice);
  project = store.saveVisual(project.project_id, visual);
  return { store, project };
}

test('uses the exact 13-part KAKU sequence and 10 annexes', () => {
  assert.deepEqual(KAKU_SECTIONS.map((section) => section.id), ['cover', 'creative-rationale', 'master-logo', 'symbol-anatomy', 'logo-system', 'logo-context', 'typography', 'color-behavior', 'color-palette', 'stationery', 'product-application', 'digital-application', 'closing']);
  assert.equal(DIGITAL_ANNEXES.length, 10);
});

test('builds a bilingual source-derived draft without approving it', () => {
  const { project } = completeProject();
  const draft = buildBrandbookDraft(project, 'es-MX');
  assert.equal(draft.sections.length, 13);
  assert.equal(draft.annexes.length, 10);
  assert.equal(draft.sections.every((section) => section.approved === false), true);
  assert.match(draft.sections[0].content, /KAKU Test/);
  assert.equal(brandbookIsComplete(draft), false);
});

test('self-contained renderer produces all core and annex pages', () => {
  const { project } = completeProject();
  project.brandbook = buildBrandbookDraft(project, 'en');
  const html = renderBrandbookDocument(project, 'en');
  assert.match(html, /<!doctype html>/i);
  assert.equal((html.match(/class="page"/g) || []).length, 13);
  assert.equal((html.match(/class="page annex"/g) || []).length, 10);
  assert.equal(/<script|https?:\/\//i.test(html), false);
});

test('Guardian review unlocks only after every page and annex is complete', () => {
  const { store, project } = completeProject();
  assert.equal(project.stages.brandbook.status, 'active');
  let current = store.seedBrandbook(project.project_id, 'en');
  for (const section of current.brandbook.sections) current = store.saveBrandbookSection(project.project_id, section.id, { content: section.content || section.id, approved: true, source_refs: ['brief.md'] });
  for (const annex of current.brandbook.annexes) current = store.saveBrandbookAnnex(project.project_id, annex.id, { content: annex.content || annex.id, included: true });
  assert.equal(brandbookIsComplete(current.brandbook), true);
  assert.equal(current.stages.brandbook.status, 'complete');
  assert.equal(current.stages.guardian.status, 'active');
  assert.equal(current.stages.export.status, 'locked');
});
