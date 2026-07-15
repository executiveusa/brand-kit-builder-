import { AgentError } from "./errors.mjs";
import { CRITICAL_PREBUILD_AXES, PREBUILD_AXES } from "./constants.mjs";

function round(value, precision = 2) {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

export function scorePrebuild(scores) {
  if (!scores || typeof scores !== "object" || Array.isArray(scores)) {
    throw new AgentError("INVALID_PREBUILD_SCORES", "Prebuild scores must be an object keyed by the 20 required axes.");
  }

  const missing = PREBUILD_AXES.filter((axis) => !(axis in scores));
  const extra = Object.keys(scores).filter((axis) => !PREBUILD_AXES.includes(axis));
  if (missing.length || extra.length) {
    throw new AgentError("PREBUILD_AXIS_MISMATCH", "Prebuild scores must contain exactly the required 20 axes.", { missing, extra });
  }

  const normalized = {};
  for (const axis of PREBUILD_AXES) {
    const score = Number(scores[axis]);
    if (!Number.isFinite(score) || score < 0 || score > 10) {
      throw new AgentError("INVALID_PREBUILD_SCORE", `Score for ${axis} must be between 0 and 10.`, { axis, received: scores[axis] });
    }
    normalized[axis] = round(score, 2);
  }

  const overall = round(PREBUILD_AXES.reduce((sum, axis) => sum + normalized[axis], 0) / PREBUILD_AXES.length, 2);
  const criticalGaps = [...CRITICAL_PREBUILD_AXES]
    .filter((axis) => normalized[axis] < 8)
    .map((axis) => ({ axis, score: normalized[axis], required: 8 }));
  const generalGaps = PREBUILD_AXES
    .filter((axis) => normalized[axis] < 8)
    .map((axis) => ({ axis, score: normalized[axis], required: 8 }));
  const gate = overall >= 8.5 && criticalGaps.length === 0 ? "PASS" : "FAIL";

  return {
    scores: normalized,
    overall,
    gate,
    threshold: 8.5,
    critical_floor: 8,
    critical_gaps: criticalGaps,
    gaps: generalGaps,
    next_action: gate === "PASS"
      ? "Proceed to the next gated stage."
      : "Resolve missing evidence and low-scoring axes before generation."
  };
}

export function assertPrebuildPassed(readiness) {
  const result = scorePrebuild(readiness?.scores ?? readiness);
  if (result.gate !== "PASS") {
    throw new AgentError("PREBUILD_GATE_FAILED", "The project has not passed the 8.5 prebuild gate.", result, 409);
  }
  return result;
}
