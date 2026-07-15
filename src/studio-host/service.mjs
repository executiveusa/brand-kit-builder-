import { AgentError, asAgentError, createAgentContext, createProject, getProject, inspectCapabilities, validateProject } from '../agent/index.mjs';
import { syncStudioReleaseEvidence } from '../agent/studio-sync.mjs';
import { StudioSnapshotStore } from './snapshot-store.mjs';

const MUTATING_COMMANDS = new Set([
  'sync-studio-project', 'create-project', 'save-intake', 'answer-discovery', 'update-source', 'add-source', 'save-readiness',
  'save-strategy', 'save-voice', 'save-visual-system', 'save-brandbook-section', 'save-brandbook-annex', 'save-guardian-review',
  'record-export-package', 'apply-draft-controls'
]);

const READ_COMMANDS = new Set([
  'inspect', 'load-studio-state', 'get-core-project', 'validate-core-project', 'inspect-export-approval',
  'open-source', 'open-source-ledger'
]);

function coreProjectInput(snapshot) {
  return {
    project_id: snapshot.project_id,
    name: snapshot.name,
    classification: snapshot.classification || 'greenfield',
    owner: snapshot.intake?.approval_authority || 'Bambu',
    primary_audience: snapshot.intake?.audience || 'unknown',
    business_goal: snapshot.intake?.business_goal || 'unknown',
    primary_action: snapshot.intake?.primary_action || 'unknown',
    languages: Array.isArray(snapshot.languages) && snapshot.languages.length ? snapshot.languages : ['en'],
    protected_assets: (snapshot.sources || []).filter((source) => ['logo', 'image', 'files'].includes(source.type)).map((source) => source.source_id),
    sources: (snapshot.sources || []).map((source) => ({
      source_id: source.source_id,
      type: source.type || 'brief',
      location: source.location || 'confirmed-brief',
      trust_level: source.trust_level || 'primary',
      accessed: Boolean(source.accessed),
      hash_or_commit: source.hash_or_commit || 'unknown',
      license: source.license || source.rights_status || 'unknown',
      applicable_rules: Array.isArray(source.applicable_rules) ? source.applicable_rules : [],
      conflicts: (source.conflicts || []).filter((conflict) => !conflict?.resolved),
      notes: source.notes || ''
    }))
  };
}

async function ensureCoreProject(context, snapshot) {
  try {
    return await getProject(context, snapshot.project_id);
  } catch (error) {
    if (error?.code !== 'PROJECT_NOT_FOUND') throw error;
    return createProject(context, coreProjectInput(snapshot));
  }
}

function approvedRecord(project, action = 'export') {
  const approval = (project.approvals || []).find((item) => item.action === action && item.status === 'approved' && item.approved_by === project.owner);
  const sync = project.studio_sync;
  if (!approval || !sync?.evidence_sha256 || !sync?.synchronized_at) return null;
  const approvedAt = Date.parse(approval.approved_at);
  const synchronizedAt = Date.parse(sync.synchronized_at);
  if (!Number.isFinite(approvedAt) || !Number.isFinite(synchronizedAt) || approvedAt < synchronizedAt) return null;
  return {
    project_id: project.project_id,
    action,
    status: 'approved',
    source: 'agent-core',
    approved_by: approval.approved_by,
    approved_at: approval.approved_at,
    approval_id: approval.confirmation_sha256,
    evidence_sha256: sync.evidence_sha256,
    channel: approval.channel
  };
}

export async function createStudioCommandService(workspaceRoot) {
  const context = await createAgentContext(workspaceRoot);
  const snapshots = new StudioSnapshotStore(context.root);

  async function synchronizeSnapshot(command, payload) {
    const snapshot = payload?.project_snapshot;
    if (!snapshot) return { snapshot: null, core_project: null, release_sync: null };
    const clean = await snapshots.upsertSnapshot(snapshot);
    const coreProject = await ensureCoreProject(context, clean);
    let releaseSync = null;
    try {
      releaseSync = await syncStudioReleaseEvidence(context, clean);
    } catch (error) {
      releaseSync = { ok: false, error: asAgentError(error).toJSON().error };
    }
    await snapshots.appendEvent(command, payload);
    return { snapshot: clean, core_project: coreProject.project, release_sync: releaseSync };
  }

  async function invoke(command, payload = {}) {
    try {
      if (!MUTATING_COMMANDS.has(command) && !READ_COMMANDS.has(command)) {
        throw new AgentError('HOST_COMMAND_NOT_ALLOWED', 'The local studio host does not allow this command.', { command, allowed: [...READ_COMMANDS, ...MUTATING_COMMANDS].sort() }, 403);
      }

      if (command === 'inspect') {
        return { ok: true, host: { connected: true, transport: 'localhost-session', arbitrary_shell: false, direct_filesystem: false }, core: inspectCapabilities() };
      }
      if (command === 'load-studio-state') return { ok: true, state: await snapshots.load() };

      const synchronization = await synchronizeSnapshot(command, payload);
      const projectId = payload?.project_id || synchronization.snapshot?.project_id;

      if (command === 'get-core-project') return getProject(context, projectId);
      if (command === 'validate-core-project') return validateProject(context, projectId);
      if (command === 'inspect-export-approval') {
        const { project } = await getProject(context, projectId);
        return { ok: true, approval: approvedRecord(project, payload?.action || 'export'), evidence_sha256: project.studio_sync?.evidence_sha256 || null };
      }
      if (command === 'open-source' || command === 'open-source-ledger') {
        return { ok: true, handled: false, reason: 'The dependency-free web host does not open arbitrary local files. Use the future desktop file adapter.' };
      }

      if (!synchronization.snapshot) await snapshots.appendEvent(command, payload);
      return {
        ok: true,
        command,
        project_id: projectId || null,
        persisted: Boolean(synchronization.snapshot),
        release_sync: synchronization.release_sync
      };
    } catch (error) {
      const agentError = asAgentError(error);
      return { ...agentError.toJSON(), status: agentError.status };
    }
  }

  return { context, snapshots, invoke };
}

export { MUTATING_COMMANDS, READ_COMMANDS, approvedRecord };
