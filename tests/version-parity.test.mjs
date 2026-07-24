import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { APP_VERSION } from "../src/agent/constants.mjs";

test("APP_VERSION matches package.json version", async () => {
  const packageJsonPath = path.join(process.cwd(), "package.json");
  const packageJsonContent = await readFile(packageJsonPath, "utf8");
  const packageJson = JSON.parse(packageJsonContent);
  assert.equal(APP_VERSION, packageJson.version, `Version drift: APP_VERSION=${APP_VERSION} but package.json.version=${packageJson.version}`);
});

test("MCP serverInfo uses APP_VERSION", async () => {
  const mcpSource = await readFile(path.join(process.cwd(), "bin/brand-kit-builder-mcp.mjs"), "utf8");
  assert.ok(mcpSource.includes("APP_VERSION"), "MCP server must import and use APP_VERSION for serverInfo.version");
  assert.ok(!mcpSource.includes('version: "0.2.0"') && !mcpSource.includes('version: "0.3.0"'), "MCP serverInfo must not hard-code a version string");
});
