export class AgentError extends Error {
  constructor(code, message, details = {}, status = 400) {
    super(message);
    this.name = "AgentError";
    this.code = code;
    this.details = details;
    this.status = status;
  }

  toJSON() {
    return {
      ok: false,
      error: {
        code: this.code,
        message: this.message,
        details: this.details
      }
    };
  }
}

export function asAgentError(error) {
  if (error instanceof AgentError) return error;
  return new AgentError("INTERNAL_ERROR", "The agent operation failed.", {
    cause: error instanceof Error ? error.message : String(error)
  }, 500);
}
