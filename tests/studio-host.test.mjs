import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, symlink } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { PREBUILD_AXES } from '../apps/studio/project-store.js';
import { buildBrandbookDraft } from '../apps/studio/kaku-brandbook.js';
import { GUARDIAN_DEFINITIONS, GUARDIAN_ORDER } from '../apps/studio/guardian-export-domain.js';
import { createStudioCommandService } from '../src/studio-host/service.mjs';
import { StudioSnapshotStore } from '../src/studio-host/snapshot-store.mjs';
import { recordOwnerApproval } from '../src/agent/orchestrator.mjs';
import { createStudioHost } from '../scripts/studio-host.mjs';

const strategy = {
  positioning: 'Evidence-led brand system.', promise: 'Clear work people can trust.', reasons_to_believe: 'Governed sources and approvals.', values: 'Clarity and respect.',
  message_hierarchy: { primary: 'Build clarity.', support: 'Keep evidence connected.', cta: 'Start a project' },
  proof_ledger: [{ claim: 'Claims are traced.', source: 'brief.md', status: 'confirmed' }],
  territories: [1, 2, 3].map((index) => ({ id: `territory-${index}`, name: `Territory ${index}`, concept: `Concept ${index}`, mood: `Mood ${index}`, avoid: `Avoid ${index}` }))
};
const voice = { identity: 'Direct and grounded.', audience_language: 'Use customer language.', prohibited_language: 'No hype.', real_phrases: 'Clear work.', true_stories: 'Approved stories only.', channel_rules: 'Concise web and contextual social.', localization_rules: 'Natural Mexican Spanish.', examples: 'We make useful systems.', axes: { direct: 70, warm: 50, playful: 20, concise: 75 } };
const visual = { selected_territory: 'territory-1', logo_policy: 'preserve', logo_notes: 'Preserve supplied geometry.', colors: { primary: '#173F35', secondary: '#2F6A49', accent: '#D76A43', background: '#F3EFE6', text: '#161A18' }, typography: { display: 'Editorial serif', body: 'Humanist sans', scale: 'balanced', rules: 'Readable hierarchy.' }, imagery: { direction: 'Documentary.', lighting: 'Natural light.', composition: 'Context first.', people: 'Real participants.', forbidden: 'No stereotypes.' }, illustration: 'Editorial diagrams.', icon_family: 'Phosphor', patterns_textures: 'Material texture.', layout_rules: 'Clear grid.', motion_rules: 'Purposeful and reduced-motion safe.', applications: ['website', 'social', 'presentation'], accessibility_notes: 'WCAG AA contrast.' };

function releaseSnapshot() {
  const snapshot = {
    schema_version: '2.1', project_id: 'host-brand', name: 'Host Brand', classification: 'greenfield', market: 'Mexico', languages: ['en', 'es-MX'],
    intake: { business_goal: 'Build a trusted brand.', audience: 'Purpose-led teams.', primary_action: 'Start a project', approval_authority: 'Bambu', constraints: 'Use verified evidence.' },
    sources: [{ source_id: 'brief', type: 'brief', location: 'brand-brief.md', trust_level: 'primary', accessed: true, rights_status: 'owned', conflicts: [], notes: '' }],
    readiness: { scores: Object.fromEntries(PREBUILD_AXES.map((axis) => [axis.id, 9])), overall: 9, gate: 'PASS', gaps: [] },
    strategy, voice, visual,
    guardians: Object.fromEntries(GUARDIAN_ORDER.map((name) => [name, {
      name, reviewer_name: `Reviewer ${name}`, reviewer_role: `${name} specialist`, independent_confirmed: true,
      summary: `${name} review passed.`, checks: Object.fromEntries(GUARDIAN_DEFINITIONS[name].checks.map(([id]) => [id, true])), findings: [], status: 'passed'
    }]))
  };
  snapshot.brandbook = buildBrandbookDraft(snapshot, 'en');
  snapshot.brandbook.sections = snapshot.brandbook.sections.map((section) => ({ ...section, approved: true, source_refs: ['brand-brief.md'], content: section.content || section.id }));
  snapshot.brandbook.annexes = snapshot.brandbook.annexes.map((annex) => ({ ...annex, included: true, content: annex.content || annex.id }));
  return snapshot;
}

async function tempWorkspace(t, prefix) {
  const workspace = await mkdtemp(path.join(os.tmpdir(), prefix));
  t.after(() => rm(workspace, { recursive: true, force: true }));
  return workspace;
}

test('command service persists snapshots, creates the core project, and syncs complete evidence', async (t) => {
  const workspace = await tempWorkspace(t, 'pauli-host-service-');
  const service = await createStudioCommandService(workspace);
  const snapshot = releaseSnapshot();
  const result = await service.invoke('sync-studio-project', { project_id: snapshot.project_id, project_snapshot: snapshot });
  assert.equal(result.ok, true);
  assert.equal(result.persisted, true);
  assert.equal(result.release_sync.ok, true);
  assert.match(result.release_sync.evidence_sha256, /^[a-f0-9]{64}$/);
  const state = await service.snapshots.load();
  assert.equal(state.projects[snapshot.project_id].name, 'Host Brand');
  const core = await service.invoke('get-core-project', { project_id: snapshot.project_id });
  assert.equal(core.project.owner, 'Bambu');
  assert.equal(core.project.guardian_summary.p0, 0);
  const ledger = JSON.parse(await readFile(path.join(workspace, 'projects', snapshot.project_id, 'source-ledger.json'), 'utf8'));
  assert.deepEqual(ledger.sources, core.project.sources);
  assert.equal(ledger.evidence_sha256, result.release_sync.evidence_sha256);
});

test('canonical source ledger updates when synchronized Studio sources change', async (t) => {
  const workspace = await tempWorkspace(t, 'pauli-host-ledger-');
  const service = await createStudioCommandService(workspace);
  const snapshot = releaseSnapshot();
  await service.invoke('sync-studio-project', { project_id: snapshot.project_id, project_snapshot: snapshot });
  snapshot.sources.push({ source_id: 'site', type: 'url', location: 'https://example.test', trust_level: 'reference', accessed: true, rights_status: 'owned', conflicts: [], notes: 'Current website.' });
  const result = await service.invoke('sync-studio-project', { project_id: snapshot.project_id, project_snapshot: snapshot });
  assert.equal(result.release_sync.ok, true);
  const ledger = JSON.parse(await readFile(path.join(workspace, 'projects', snapshot.project_id, 'source-ledger.json'), 'utf8'));
  assert.equal(ledger.sources.length, 2);
  assert.equal(ledger.sources.find((source) => source.source_id === 'site').location, 'https://example.test');
  assert.equal(ledger.evidence_sha256, result.release_sync.evidence_sha256);
});

test('snapshot persistence strips browser-authored approval and export state', async (t) => {
  const workspace = await tempWorkspace(t, 'pauli-host-strip-');
  const service = await createStudioCommandService(workspace);
  const snapshot = releaseSnapshot();
  snapshot.export_approval = { status: 'approved', source: 'browser' };
  snapshot.export_package = { generated_at: new Date().toISOString() };
  const result = await service.invoke('sync-studio-project', { project_id: snapshot.project_id, project_snapshot: snapshot });
  assert.equal(result.ok, true);
  const stored = (await service.snapshots.load()).projects[snapshot.project_id];
  assert.equal(stored.export_approval, undefined);
  assert.equal(stored.export_package, undefined);
  assert.equal(result.release_sync.ok, true);
});

test('unchanged evidence preserves approval while material changes make it stale', async (t) => {
  const workspace = await tempWorkspace(t, 'pauli-host-approval-');
  const service = await createStudioCommandService(workspace);
  const snapshot = releaseSnapshot();
  const initial = await service.invoke('sync-studio-project', { project_id: snapshot.project_id, project_snapshot: snapshot });
  const synchronizedAt = initial.release_sync.synchronized_at;
  await recordOwnerApproval(service.context, {
    project_id: snapshot.project_id,
    action: 'export',
    approved_by: 'Bambu',
    interactive: true,
    confirmation: 'APPROVE host-brand export'
  });
  const approved = await service.invoke('inspect-export-approval', { project_id: snapshot.project_id, action: 'export' });
  assert.equal(approved.ok, true);
  assert.equal(approved.approval.source, 'agent-core');
  assert.match(approved.approval.evidence_sha256, /^[a-f0-9]{64}$/);

  await new Promise((resolve) => setTimeout(resolve, 8));
  const unchangedSnapshot = structuredClone(snapshot);
  const unchanged = await service.invoke('sync-studio-project', { project_id: snapshot.project_id, project_snapshot: unchangedSnapshot });
  assert.equal(unchanged.release_sync.synchronized_at, synchronizedAt);
  const stillApproved = await service.invoke('inspect-export-approval', { project_id: snapshot.project_id, action: 'export' });
  assert.equal(stillApproved.approval.approval_id, approved.approval.approval_id);

  await new Promise((resolve) => setTimeout(resolve, 8));
  const changed = structuredClone(snapshot);
  changed.strategy.promise = 'A materially changed promise.';
  const changedResult = await service.invoke('sync-studio-project', { project_id: changed.project_id, project_snapshot: changed });
  assert.notEqual(changedResult.release_sync.synchronized_at, synchronizedAt);
  const stale = await service.invoke('inspect-export-approval', { project_id: changed.project_id, action: 'export' });
  assert.equal(stale.approval, null);
});

test('snapshot and event writes reject symlinked state directories', { skip: process.platform === 'win32' }, async (t) => {
  const workspace = await tempWorkspace(t, 'pauli-host-symlink-workspace-');
  const outside = await tempWorkspace(t, 'pauli-host-symlink-outside-');
  await symlink(outside, path.join(workspace, '.brand-kit-builder'), 'dir');
  const snapshots = new StudioSnapshotStore(workspace);
  await assert.rejects(
    () => snapshots.save({ version: 1, current_project_id: null, projects: {} }),
    (error) => error?.code === 'SYMLINK_GUARD'
  );
  await assert.rejects(
    () => snapshots.appendEvent('save-intake', { project_id: 'host-brand' }),
    (error) => error?.code === 'SYMLINK_GUARD'
  );
});

test('local host injects a session bridge and rejects unauthorized API calls', async (t) => {
  const workspace = await tempWorkspace(t, 'pauli-http-host-');
  const host = await createStudioHost({ workspaceRoot: workspace, port: 0 });
  t.after(() => host.close());
  const url = await host.listen();
  const page = await fetch(url);
  assert.equal(page.status, 200);
  const html = await page.text();
  assert.match(html, /window\.brandKitBuilderHost/);
  assert.match(page.headers.get('content-security-policy'), /connect-src 'self'/);

  const denied = await fetch(`${url}/__brand-kit-builder/invoke`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'inspect', payload: {} })
  });
  assert.equal(denied.status, 403);

  const allowed = await fetch(`${url}/__brand-kit-builder/invoke`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Pauli-Studio-Session': host.sessionToken },
    body: JSON.stringify({ command: 'inspect', payload: {} })
  });
  assert.equal(allowed.status, 200);
  assert.equal((await allowed.json()).host.connected, true);
});

test('host rejects commands outside its explicit allowlist', async (t) => {
  const workspace = await tempWorkspace(t, 'pauli-host-allowlist-');
  const service = await createStudioCommandService(workspace);
  const result = await service.invoke('run-shell', { command: 'rm -rf /' });
  assert.equal(result.ok, false);
  assert.equal(result.error.code, 'HOST_COMMAND_NOT_ALLOWED');
  assert.equal(result.status, 403);
});
