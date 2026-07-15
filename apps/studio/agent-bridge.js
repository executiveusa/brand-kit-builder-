const EVENT_NAME = 'pauli-brand-studio-command';

export class AgentBridge {
  constructor() {
    this.host = window.brandKitBuilderHost ?? null;
  }

  get connected() {
    return Boolean(this.host && typeof this.host.invoke === 'function');
  }

  async invoke(command, payload = {}) {
    const safePayload = structuredClone(payload);
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { command, payload: safePayload } }));
    if (this.connected) return this.host.invoke(command, safePayload);
    return { ok: true, demo: true, command, payload: safePayload };
  }

  async inspect() {
    return this.invoke('inspect', {});
  }
}

export const agentBridge = new AgentBridge();
