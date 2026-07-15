#!/usr/bin/env node
import readline from "node:readline";
import process from "node:process";
import {
  asAgentError,
  completeStage,
  createAgentContext,
  createProject,
  getProject,
  inspectCapabilities,
  runStage,
  scorePrebuild,
  validateProject
} from "../src/agent/index.mjs";

const workspace = process.env.BKB_WORKSPACE || process.cwd();
const context = await createAgentContext(workspace);

const tools = [
  {
    name: "brand_kit_inspect",
    description: "Inspect Brand Kit Builder capabilities and hard safety limits.",
    inputSchema: { type: "object", additionalProperties: false, properties: {} }
  },
  {
    name: "brand_kit_score_prebuild",
    description: "Score the required 20-axis readiness gate without writing project state.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["scores"],
      properties: { scores: { type: "object", additionalProperties: { type: "number", minimum: 0, maximum: 10 } } }
    }
  },
  {
    name: "brand_kit_create_project",
    description: "Create a source-traceable brand project inside the configured workspace.",
    inputSchema: { type: "object", required: ["project_id", "name", "classification", "sources"], additionalProperties: true }
  },
  {
    name: "brand_kit_get_project",
    description: "Read the current machine state for one brand project.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["project_id"],
      properties: { project_id: { type: "string" } }
    }
  },
  {
    name: "brand_kit_validate_project",
    description: "Validate source, readiness, stage, and guardian state for one project.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["project_id"],
      properties: { project_id: { type: "string" } }
    }
  },
  {
    name: "brand_kit_run_stage",
    description: "Create an idempotent, gated work order for the next brand pipeline stage.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["project_id", "stage", "idempotency_key"],
      properties: {
        project_id: { type: "string" },
        stage: { type: "string" },
        idempotency_key: { type: "string" },
        requested_by: { type: "string" },
        estimated_cost_cents: { type: "integer", minimum: 0, maximum: 1000 }
      }
    }
  },
  {
    name: "brand_kit_complete_stage",
    description: "Mark a stage complete only after every required artifact exists in the project workspace.",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      required: ["project_id", "stage", "artifacts"],
      properties: {
        project_id: { type: "string" },
        stage: { type: "string" },
        artifacts: { type: "array", items: { type: "object", required: ["path"], properties: { path: { type: "string" } } } }
      }
    }
  }
];

async function callTool(name, args) {
  switch (name) {
    case "brand_kit_inspect":
      return inspectCapabilities();
    case "brand_kit_score_prebuild":
      return { ok: true, result: scorePrebuild(args?.scores) };
    case "brand_kit_create_project":
      return createProject(context, args);
    case "brand_kit_get_project":
      return getProject(context, args?.project_id);
    case "brand_kit_validate_project":
      return validateProject(context, args?.project_id);
    case "brand_kit_run_stage":
      return runStage(context, args);
    case "brand_kit_complete_stage":
      return completeStage(context, args);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function send(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

async function handle(message) {
  if (!message || message.jsonrpc !== "2.0") return;
  const { id, method, params } = message;
  if (method === "notifications/initialized") return;
  if (method === "initialize") {
    send({
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: "pauli-brand-kit-builder", version: "0.2.0" },
        instructions: "Use source-first stages in order. Export requires passed guardians and explicit Bambu approval."
      }
    });
    return;
  }
  if (method === "ping") {
    send({ jsonrpc: "2.0", id, result: {} });
    return;
  }
  if (method === "tools/list") {
    send({ jsonrpc: "2.0", id, result: { tools } });
    return;
  }
  if (method === "tools/call") {
    try {
      const result = await callTool(params?.name, params?.arguments ?? {});
      send({
        jsonrpc: "2.0",
        id,
        result: {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          structuredContent: result,
          isError: false
        }
      });
    } catch (error) {
      const agentError = asAgentError(error);
      const payload = agentError.toJSON();
      send({
        jsonrpc: "2.0",
        id,
        result: {
          content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
          structuredContent: payload,
          isError: true
        }
      });
    }
    return;
  }
  if (id !== undefined) {
    send({ jsonrpc: "2.0", id, error: { code: -32601, message: `Method not found: ${method}` } });
  }
}

const lines = readline.createInterface({ input: process.stdin, crlfDelay: Infinity, terminal: false });
lines.on("line", async (line) => {
  if (!line.trim()) return;
  try {
    await handle(JSON.parse(line));
  } catch (error) {
    send({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error", data: String(error?.message ?? error) } });
  }
});
