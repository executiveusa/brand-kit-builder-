#!/usr/bin/env node
import { readFile } from "node:fs/promises";
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

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const options = { workspace: process.cwd(), input: "-" };
  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    if (token === "--workspace" || token === "--input" || token === "--project-id") {
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

async function main() {
  const { command, options } = parseArgs(process.argv.slice(2));
  if (!command || command === "help" || command === "--help") {
    return {
      ok: true,
      usage: "brand-kit-builder <inspect|score-prebuild|create-project|get-project|validate-project|run-stage|complete-stage> [--workspace PATH] [--input FILE|-] [--project-id ID]"
    };
  }
  if (command === "inspect") return inspectCapabilities();

  const context = await createAgentContext(options.workspace);
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
