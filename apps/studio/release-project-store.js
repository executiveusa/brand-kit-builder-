import { STAGES } from './project-store.js';
import { StudioProjectStore } from './studio-project-store.js';
import { GUARDIAN_ORDER, blankGuardian, evaluateGuardian, guardianGate, validExportApproval } from './guardian-export-domain.js';

function now() { return new Date().toISOString(); }
function clone(value) { return value == null ? value : structuredClone(value); }

export class ReleaseProjectStore extends StudioProjectStore {
  constructor(storage) {
    super(storage);
    for (const projectId of Object.keys(this.state.projects)) this.reconcileRelease(projectId, false);
    this.persist();
  }

  reconcileRelease(projectId, persist = true) {
    const project = this.state.projects[projectId];
    if (!project) throw new Error(`Unknown project: ${projectId}`);
    project.guardians = project.guardians || {};
    for (const name of GUARDIAN_ORDER) project.guardians[name] = { ...blankGuardian(name), ...(project.guardians[name] || {}), name };
    project.release_summary = guardianGate(project);
    const brandbookComplete = project.stages.brandbook.status === 'complete';
    project.stages.guardian.status = brandbookComplete ? (project.release_summary.passed ? 'complete' : 'active') : 'locked';
    const approvalReady = validExportApproval(project);
    const exported = Boolean(project.export_package?.generated_at);
    project.stages.export.status = project.release_summary.passed ? (exported && approvalReady ? 'complete' : 'active') : 'locked';
    project.current_stage = STAGES.find((stage) => project.stages[stage].status === 'active') || 'export';
    project.updated_at = now();
    if (persist) this.persist();
    return this.get(projectId);
  }

  hydrateFromHost(hostState) {
    if (!hostState?.projects || Object.keys(hostState.projects).length === 0) return this.getCurrent();
    const projects = {};
    for (const [projectId, source] of Object.entries(hostState.projects)) {
      const project = clone(source);
      delete project.approvals;
      delete project.export_approval;
      delete project.export_package;
      if (project.release_summary) delete project.release_summary.approval;
      projects[projectId] = project;
    }
    this.state = {
      version: 2,
      current_project_id: projects[hostState.current_project_id] ? hostState.current_project_id : Object.keys(projects)[0],
      projects
    };
    for (const projectId of Object.keys(projects)) {
      super.update(projectId, (project) => project);
      this.reconcileRelease(projectId, false);
    }
    this.persist();
    return this.getCurrent();
  }

  create(input) {
    const project = super.create(input);
    return this.reconcileRelease(project.project_id);
  }

  update(projectId, updater) {
    super.update(projectId, updater);
    return this.reconcileRelease(projectId);
  }

  saveGuardian(projectId, name, review) {
    return this.update(projectId, (project) => {
      project.guardians = project.guardians || {};
      project.guardians[name] = evaluateGuardian(name, review);
      project.export_approval = null;
      project.export_package = null;
      return project;
    });
  }

  syncExportApproval(projectId, approval) {
    if (!approval || approval.source !== 'agent-core' || approval.project_id !== projectId || approval.action !== 'export' || approval.status !== 'approved' || !approval.evidence_sha256) {
      throw new Error('Only a verified read response from the agent core may synchronize export approval for current evidence.');
    }
    return this.update(projectId, (project) => {
      project.export_approval = {
        project_id: projectId,
        action: 'export',
        status: 'approved',
        source: 'agent-core',
        approved_by: String(approval.approved_by || ''),
        approved_at: String(approval.approved_at || ''),
        approval_id: String(approval.approval_id || ''),
        evidence_sha256: String(approval.evidence_sha256 || '')
      };
      return project;
    });
  }

  clearStaleApproval(projectId) {
    return this.update(projectId, (project) => {
      project.export_approval = null;
      project.export_package = null;
      return project;
    });
  }

  markExported(projectId, manifest) {
    return this.update(projectId, (project) => {
      if (!validExportApproval(project)) throw new Error('Human export approval is required before marking a package complete.');
      if (!guardianGate(project).passed) throw new Error('All Guardians must pass before export.');
      project.export_package = { generated_at: now(), manifest };
      return project;
    });
  }

  ensureDemoProject() {
    const project = super.ensureDemoProject();
    return this.reconcileRelease(project.project_id);
  }
}
