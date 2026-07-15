import test from "node:test";
import assert from "node:assert/strict";
import { PREBUILD_AXES } from "../src/agent/constants.mjs";
import { assertPrebuildPassed, scorePrebuild } from "../src/agent/prebuild.mjs";

function allScores(value) {
  return Object.fromEntries(PREBUILD_AXES.map((axis) => [axis, value]));
}

test("passes a complete 8.5 readiness profile", () => {
  const result = scorePrebuild(allScores(8.5));
  assert.equal(result.gate, "PASS");
  assert.equal(result.overall, 8.5);
  assert.equal(result.critical_gaps.length, 0);
});

test("fails when a critical axis is below 8 even if the average is high", () => {
  const scores = allScores(9);
  scores.rights_and_licensing_status = 7.5;
  const result = scorePrebuild(scores);
  assert.equal(result.gate, "FAIL");
  assert.equal(result.critical_gaps[0].axis, "rights_and_licensing_status");
  assert.throws(() => assertPrebuildPassed(scores), (error) => error?.code === "PREBUILD_GATE_FAILED");
});

test("rejects incomplete score sets", () => {
  assert.throws(() => scorePrebuild({ source_completeness: 9 }), (error) => error?.code === "PREBUILD_AXIS_MISMATCH");
});
