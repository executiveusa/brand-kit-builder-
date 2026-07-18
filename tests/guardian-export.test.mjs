import test from 'node:test';
import assert from 'node:assert/strict';
import { MemoryStorage, PREBUILD_AXES } from '../apps/studio/project-store.js';
import { ReleaseProjectStore } from '../apps/studio/release-project-store.js';
import { GUARDIAN_DEFINITIONS, GUARDIAN_ORDER, guardianGate, releaseGate } from '../apps/studio/guardian-export-domain.js';
import { buildExportPackage } from '../apps/studio/export-package.js';
import { crc32, createStoredZip } from '../apps/studio/zip-store.js';

const strategy = {
  positioning: 'Evidence-led brand system.', promise: 'Clear work people can trust.', reasons_to_believe: 'Governed sources and approvals.', values: 'Clarity and respect.',
  message_hierarchy: { primary: 'Build clarity.', support: 'Keep evidence connected.', cta: 'Start a project' },
  proof_ledger: [{ claim: 'Claims are traced.', source: 'brief.md', status: 'confirmed' }],
  territories: [1, 2, 3].map((index) => ({ id: `territory-${index}`, name: `Territory ${index}`, concept: `Concept ${index}`, mood: `Mood ${index}`, avoid: `Avoid ${index}` }))
};
const voice = { identity: 'Direct and grounded.', audience_language: 'Use customer language.', prohibited_language: 'No hype.', real_phrases: 'Clear work.', true_stories: 'Approved stories only.', channel_rules: 'Concise web and contextual social.', localization_rules: 'Natural Mexican Spanish.', examples: 'We make useful systems.', axes: { direct: 70, warm: 50, playful: 20, concise: 75 } };
const visual = { selected_territory: 'territory-1', logo_policy: 'preserve', logo_notes: 'Preserve supplied geometry.', colors: { primary: '#173F35', secondary: '#2F6A49', accent: '#D76A43', background: '#F3EFE6', text: '#161A18' }, typography: { display: 'Editorial serif', body: 'Humanist sans', scale: 'balanced', rules: 'Readable hierarchy.' }, imagery: { direction: 'Documentary.', lighting: 'Natural light.', composition: 'Context first.', people: 'Real participants.', forbidden: 'No stereotypes.' }, illustration: 'Editorial diagrams.', icon_family: 'Phosphor', patterns_textures: 'Material texture.', layout_rules: 'Clear grid.', motion_rules: 'Purposeful and reduced-motion safe.', applications: ['website', 'social', 'presentation'], accessibility_notes: 'WCAG AA contrast.' };

function passedReview(name, findings = []) {
  return {
    name,
    reviewer_name: `Reviewer ${name}`,
    reviewer_role: `${name} reviewer`,
    independent_confirmed: true,
    summary: `${name} review completed against approved evidence.`,
    checks: Object.fromEntries(GUARDIAN_DEFINITIONS[name].checks.map(([id]) => [id, true])),
    findings
  };
}

function buildCompleteBook(store, projectId) {
  let project = store.seedBrandbook(projectId, 'en');
  for (const section of project.brandbook.sections) project = store.saveBrandbookSection(projectId, section.id, { content: section.content || section.id, approved: true, source_refs: ['brief.md'] });
  for (const annex of project.brandbook.annexes) project = store.saveBrandbookAnnex(projectId, annex.id, { content: annex.content || annex.id, included: true });
  return project;
}

function releaseReadyStore() {
  const store = new ReleaseProjectStore(new MemoryStorage());
  let project = store.create({ name: 'Release Brand', source_type: 'idea', business_goal: 'Grow', audience: 'Teams', primary_action: 'Contact', approval_authority: 'Bambu', constraints: 'Two weeks', languages: ['en', 'es-MX'] });
  project = store.saveReadinessScores(project.project_id, Object.fromEntries(PREBUILD_AXES.map((axis) => [axis.id, 9])));
  project = store.saveStrategy(project.project_id, strategy);
  project = store.saveVoice(project.project_id, voice);
  project = store.saveVisual(project.project_id, visual);
  project = buildCompleteBook(store, project.project_id);
  return { store, project };
}

test('Guardian stage activates after the full brand book is approved', () => {
  const { project } = releaseReadyStore();
  assert.equal(project.stages.brandbook.status, 'complete');
  assert.equal(project.stages.guardian.status, 'active');
  assert.equal(project.stages.export.status, 'locked');
});

test('an unresolved P1 finding blocks its Guardian and export', () => {
  const { store, project } = releaseReadyStore();
  let current = project;
  for (const name of GUARDIAN_ORDER) {
    const findings = name === 'design' ? [{ severity: 'P1', title: 'Contrast failure', evidence: 'Page 8', recommendation: 'Raise contrast', resolved: false }] : [];
    current = store.saveGuardian(project.project_id, name, passedReview(name, findings));
  }
  const gate = guardianGate(current);
  assert.equal(gate.passed, false);
  assert.equal(gate.unresolved_p1, 1);
  assert.ok(gate.failing_guardians.includes('design'));
  assert.equal(current.stages.export.status, 'locked');
});

test('all four independent Guardian passes unlock export preparation', () => {
  const { store, project } = releaseReadyStore();
  let current = project;
  for (const name of GUARDIAN_ORDER) current = store.saveGuardian(project.project_id, name, passedReview(name));
  assert.equal(guardianGate(current).passed, true);
  assert.equal(current.stages.guardian.status, 'complete');
  assert.equal(current.stages.export.status, 'active');
  assert.equal(releaseGate(current).passed, false);
  assert.deepEqual(releaseGate(current).blockers, ['human_export_approval']);
});

test('browser state cannot synchronize an unverified export approval', () => {
  const { store, project } = releaseReadyStore();
  assert.throws(() => store.syncExportApproval(project.project_id, { project_id: project.project_id, action: 'export', status: 'approved', source: 'browser', approved_by: 'Agent' }), /agent core/i);
});

test('approved package contains hashed files in a valid stored ZIP', async () => {
  const { store, project } = releaseReadyStore();
  let current = project;
  for (const name of GUARDIAN_ORDER) current = store.saveGuardian(project.project_id, name, passedReview(name));
  current = store.syncExportApproval(project.project_id, {
    project_id: project.project_id,
    action: 'export',
    status: 'approved',
    source: 'agent-core',
    approved_by: 'Bambu',
    approved_at: '2026-07-15T20:45:00Z',
    approval_id: 'approval-test-1',
    evidence_sha256: 'a'.repeat(64)
  });
  assert.equal(releaseGate(current).passed, true);
  const output = await buildExportPackage(current, 'en');
  assert.equal(output.zip_bytes[0], 0x50);
  assert.equal(output.zip_bytes[1], 0x4b);
  assert.ok(output.files.length >= 14);
  assert.ok(output.manifest.files.every((file) => /^[a-f0-9]{64}$/.test(file.sha256)));
  assert.ok(output.manifest.files.some((file) => file.path === 'brandbook.html'));
  assert.ok(output.manifest.omitted.some((file) => file.path === 'brandbook.pdf'));
  current = store.markExported(project.project_id, output.manifest);
  assert.equal(current.stages.export.status, 'complete');
});

test('stored ZIP writer produces deterministic CRC and end record', () => {
  const bytes = new TextEncoder().encode('brand');
  assert.equal(crc32(bytes), 475199832);
  const zip = createStoredZip([{ path: 'test.txt', bytes }], new Date('2026-01-01T00:00:00Z'));
  assert.deepEqual([...zip.slice(0, 4)], [0x50, 0x4b, 0x03, 0x04]);
  assert.deepEqual([...zip.slice(-22, -18)], [0x50, 0x4b, 0x05, 0x06]);
});
