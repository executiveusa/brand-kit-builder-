import { access, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { PREBUILD_AXES, STAGES } from "../src/agent/constants.mjs";
import { inspectCapabilities } from "../src/agent/orchestrator.mjs";
import { scorePrebuild } from "../src/agent/prebuild.mjs";

const root = process.cwd();
const requiredFiles = [
  "AGENTS.md",
  "README.md",
  "docs/PAULI_BRAND_STUDIO_MASTER_SYSTEM_PROMPT_INDEX.md",
  "docs/AGENT_API.md",
  "docs/SECURITY.md",
  "skills/brand-kit-builder-agent/SKILL.md",
  "config/policy.json",
  "schemas/project.schema.json",
  "schemas/source-ledger.schema.json",
  "schemas/job.schema.json",
  "schemas/stage-completion.schema.json",
  "bin/brand-kit-builder.mjs",
  "bin/brand-kit-builder-mcp.mjs",
  "src/agent/orchestrator.mjs",
  "src/agent/security.mjs",
  "src/agent/store.mjs",
  "examples/agent/create-project.json",
  "examples/agent/run-stage.json",
  "examples/agent/complete-intake.json",
  "examples/agent/complete-sources.json"
];
const jsonFiles = requiredFiles.filter((file) => file.endsWith(".json"));

for (const file of requiredFiles) await access(path.join(root, file));
for (const file of jsonFiles) JSON.parse(await readFile(path.join(root, file), "utf8"));

const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
if (!packageJson.bin?.["brand-kit-builder"] || !packageJson.bin?.["brand-kit-builder-mcp"]) {
  throw new Error("Both CLI and MCP binaries must be declared.");
}
if (PREBUILD_AXES.length !== 20) throw new Error(`Expected 20 prebuild axes, received ${PREBUILD_AXES.length}.`);
if (STAGES.length !== 9) throw new Error(`Expected 9 workflow stages, received ${STAGES.length}.`);
const readiness = scorePrebuild(Object.fromEntries(PREBUILD_AXES.map((axis) => [axis, 8.5])));
if (readiness.gate !== "PASS") throw new Error("Canonical readiness fixture did not pass.");
const capabilities = inspectCapabilities();
if (capabilities.network_listener !== false || capabilities.external_model_calls !== false || capabilities.telemetry !== false) {
  throw new Error("Agent hardening must remain local, provider-neutral, and telemetry-free.");
}
if (capabilities.limits?.max_job_cost_cents !== 1000 || capabilities.limits?.max_daily_cost_cents !== 5000) {
  throw new Error("Cost circuit breakers do not match studio policy.");
}
if (capabilities.capabilities?.agent_supplied_approvals !== false) {
  throw new Error("Agent-supplied approvals must remain disabled.");
}

const projectSchema = JSON.parse(await readFile(path.join(root, "schemas/project.schema.json"), "utf8"));
if (projectSchema.properties?.approvals) {
  throw new Error("Project intake schema must not accept approvals.");
}
const mcpSource = await readFile(path.join(root, "bin/brand-kit-builder-mcp.mjs"), "utf8");
if (mcpSource.includes("brand_kit_approve")) {
  throw new Error("Owner approval must not be exposed as an MCP tool.");
}
const cliSource = await readFile(path.join(root, "bin/brand-kit-builder.mjs"), "utf8");
if (!cliSource.includes("INTERACTIVE_APPROVAL_REQUIRED") || !cliSource.includes("process.stdin.isTTY")) {
  throw new Error("Interactive local approval gate is missing.");
}

process.stdout.write(`${JSON.stringify({
  ok: true,
  checked_files: requiredFiles.length,
  prebuild_axes: PREBUILD_AXES.length,
  stages: STAGES.length,
  interfaces: ["json-cli", "mcp-stdio"],
  network_listener: capabilities.network_listener,
  agent_supplied_approvals: capabilities.capabilities.agent_supplied_approvals
}, null, 2)}\n`);
