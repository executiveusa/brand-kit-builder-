import { access, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { PREBUILD_AXES, STAGES } from "../src/agent/constants.mjs";
import { inspectCapabilities } from "../src/agent/orchestrator.mjs";
import { scorePrebuild } from "../src/agent/prebuild.mjs";

const root = process.cwd();
const requiredFiles = [
  "AGENTS.md",
  "docs/PAULI_BRAND_STUDIO_MASTER_SYSTEM_PROMPT_INDEX.md",
  "config/policy.json",
  "schemas/project.schema.json",
  "schemas/source-ledger.schema.json",
  "schemas/job.schema.json",
  "schemas/stage-completion.schema.json",
  "bin/brand-kit-builder.mjs",
  "src/agent/orchestrator.mjs",
  "examples/agent/create-project.json",
  "examples/agent/run-stage.json"
];
const jsonFiles = requiredFiles.filter((file) => file.endsWith(".json"));

for (const file of requiredFiles) await access(path.join(root, file));
for (const file of jsonFiles) JSON.parse(await readFile(path.join(root, file), "utf8"));

if (PREBUILD_AXES.length !== 20) throw new Error(`Expected 20 prebuild axes, received ${PREBUILD_AXES.length}.`);
if (STAGES.length !== 9) throw new Error(`Expected 9 workflow stages, received ${STAGES.length}.`);
const readiness = scorePrebuild(Object.fromEntries(PREBUILD_AXES.map((axis) => [axis, 8.5])));
if (readiness.gate !== "PASS") throw new Error("Canonical readiness fixture did not pass.");
const capabilities = inspectCapabilities();
if (capabilities.network_listener !== false || capabilities.external_model_calls !== false) {
  throw new Error("Foundation hardening must remain local and provider-neutral.");
}

process.stdout.write(`${JSON.stringify({
  ok: true,
  checked_files: requiredFiles.length,
  prebuild_axes: PREBUILD_AXES.length,
  stages: STAGES.length,
  interface: capabilities.interface
}, null, 2)}\n`);
