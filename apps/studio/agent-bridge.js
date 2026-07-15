const EVENT_NAME = 'pauli-brand-studio-command';
const MUTATING_COMMANDS = new Set([
  'sync-studio-project', 'create-project', 'save-intake', 'answer-discovery', 'update-source', 'add-source', 'save-readiness',
  'save-strategy', 'save-voice', 'save-visual-system', 'save-brandbook-section', 'save-brandbook-annex', 'save-guardian-review',
  'record-export-package', 'apply-draft-controls'
]);

function safeSnapshot() {
  const current = window.pauliBrandTools?.store?.getCurrent?.();
  if (!current) return null;
  const snapshot = structuredClone(current);
  delete snapshot.approvals;
  delete snapshot.export_approval;
  delete snapshot.export_package;
  if (snapshot.release_summary) delete snapshot.release_summary.approval;
  return snapshot;
}

export class AgentBridge {
  constructor() {
    this.host = window.brandKitBuilderHost ?? null;
  }

  get connected() {
    return Boolean(this.host && typeof this.host.invoke === 'function');
  }

  async invoke(command, payload = {}) {
    const safePayload = structuredClone(payload);
    if (MUTATING_COMMANDS.has(command) && !safePayload.project_snapshot) {
      const snapshot = safeSnapshot();
      if (snapshot) safePayload.project_snapshot = snapshot;
    }
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { command, payload: structuredClone(safePayload) } }));
    if (!this.connected) return { ok: true, demo: true, command, payload: safePayload };
    try {
      return await this.host.invoke(command, safePayload);
    } catch (error) {
      return { ok: false, command, error: { code: 'HOST_BRIDGE_ERROR', message: String(error?.message || error) } };
    }
  }

  async inspect() {
    return this.invoke('inspect', {});
  }
}

export const agentBridge = new AgentBridge();
