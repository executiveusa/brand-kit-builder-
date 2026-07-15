import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { assertNoSecretLikeData, assertSafeIdentifier, resolveInside } from "../src/agent/security.mjs";

function expectCode(fn, code) {
  assert.throws(fn, (error) => error?.code === code);
}

test("rejects secret-like values in nested agent input", () => {
  expectCode(() => assertNoSecretLikeData({ project: { api_key: "do-not-store" } }), "SECRET_GUARD");
});

test("allows empty secret-like placeholders", () => {
  assert.doesNotThrow(() => assertNoSecretLikeData({ api_key: "" }));
});

test("rejects workspace traversal", () => {
  const root = path.join(path.sep, "tmp", "brand-kit-root");
  expectCode(() => resolveInside(root, "../outside"), "PATH_GUARD");
});

test("accepts stable machine identifiers", () => {
  assert.equal(assertSafeIdentifier("job-2026.07_v1"), "job-2026.07_v1");
  expectCode(() => assertSafeIdentifier("../../job"), "INVALID_IDENTIFIER");
});
