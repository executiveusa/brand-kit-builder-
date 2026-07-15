import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

function runMcp(lines, workspace) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["bin/brand-kit-builder-mcp.mjs"], {
      cwd: process.cwd(),
      env: { ...process.env, BKB_WORKSPACE: workspace },
      stdio: ["pipe", "pipe", "pipe"]
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) return reject(new Error(`MCP exited ${code}: ${stderr}`));
      resolve(stdout.trim().split("\n").filter(Boolean).map((line) => JSON.parse(line)));
    });
    child.stdin.end(`${lines.join("\n")}\n`);
  });
}

test("MCP initializes and lists guarded tools", async (t) => {
  const workspace = await mkdtemp(path.join(os.tmpdir(), "brand-kit-mcp-"));
  t.after(() => rm(workspace, { recursive: true, force: true }));
  const responses = await runMcp([
    JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "test", version: "1" } } }),
    JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }),
    JSON.stringify({ jsonrpc: "2.0", id: 2, method: "tools/list", params: {} })
  ], workspace);
  assert.equal(responses[0].result.serverInfo.name, "pauli-brand-kit-builder");
  assert.equal(responses[1].result.tools.length, 7);
  assert.ok(responses[1].result.tools.some((tool) => tool.name === "brand_kit_run_stage"));
});
