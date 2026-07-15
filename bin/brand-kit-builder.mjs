#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
import process from "node:process";
import {
  asAgentError,
  completeStage,
  createAgentContext,
  createProject,
  getProject,
  inspectCapabilities,
  resolveInside,
  runStage,
  scorePrebuild,
  validateProject
} from "../src/agent/index.mjs";
import { recordOwnerApproval } from "../src/agent/orchestrator.mjs";
import { AgentError } from "../src/agent/errors.mjs";

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const options = { workspace: process.cwd(), input: "-" };
  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    if (token === "--workspace" || token === "--input" || token === "--project-id" || token === "--action") {
      const value = rest[index + 1];
      if (!value) throw new Error(`Missing value for ${token}`);
      options[token.slice(2).replaceAll("-", "_")] = value;
      index += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${token}`);
  }
  return { command, options };
}

async function readInput(workspaceRoot, source) {
  if (source === "-") {
    if (process.stdin.isTTY) return {};
    let body = "";
    for await (const chunk of process.stdin) body += chunk;
    return body.trim() ? JSON.parse(body) : {};
  }
  const inputPath = resolveInside(workspaceRoot, source);
  return JSON.parse(await readFile(inputPath, "utf8"));
}

async function recordInteractiveApproval(context, options) {
  if (!process.stdin.isTTY || !process.stderr.isTTY) {
    throw new AgentError("INTERACTIVE_APPROVAL_REQUIRED", "Approval requires a human-operated local terminal.", {
      remediation: "Run the approve command directly in a TTY. Approval is not available through stdin, MCP, CI, or agent JSON."
    }, 403);
  }
  const projectId = options.project_id;
  const action = options.action;
  if (!projectId || !action) {
    throw new AgentError("INVALID_APPROVAL_REQUEST", "approve requires --project-id and --action.");
  }
  const { project } = await getProject(context, projectId);
  const expected = `APPROVE ${projectId} ${action}`;
  const terminal = createInterface({ input: process.stdin, output: process.stderr });
  try {
    process.stderr.write(`Project: ${project.name}\nAction: ${action}\nOwner: ${project.owner}\n`);
    const approvedBy = (await terminal.question("Type the project owner name: ")).trim();
    const confirmation = (await terminal.question(`Type exactly '${expected}': `)).trim();
    return recordOwnerApproval(context, {
      project_id: projectId,
      action,
      approved_by: approvedBy,
      confirmation,
      interactive: true
    });
  } finally {
    terminal.close();
  }
}

async function main() {
  const { command, options } = parseArgs(process.argv.slice(2));
  if (!command || command === "help" || command === "--help") {
    return {
      ok: true,
      usage: "brand-kit-builder <inspect|score-prebuild|create-project|get-project|validate-project|run-stage|complete-stage|approve> [--workspace PATH] [--input FILE|-] [--project-id ID] [--action ACTION]"
    };
  }
  if (command === "inspect") return inspectCapabilities();

  const context = await createAgentContext(options.workspace);
  if (command === "approve") return recordInteractiveApproval(context, options);
  const input = await readInput(context.root, options.input);
  switch (command) {
    case "score-prebuild":
      return { ok: true, operation: command, result: scorePrebuild(input.scores ?? input) };
    case "create-project":
      return createProject(context, input);
    case "get-project":
      return getProject(context, options.project_id ?? input.project_id);
    case "validate-project":
      return validateProject(context, options.project_id ?? input.project_id);
    case "run-stage":
      return runStage(context, input);
    case "complete-stage":
      return completeStage(context, input);
    default:
      throw new Error(`Unknown command: ${command}`);
  }
}

try {
  const result = await main();
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
} catch (error) {
  const agentError = asAgentError(error);
  process.stderr.write(`${JSON.stringify(agentError.toJSON(), null, 2)}\n`);
  process.exitCode = agentError.status >= 500 ? 1 : 2;
}
