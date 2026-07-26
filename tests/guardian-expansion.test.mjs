import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  VERSION,
  GUARDIAN_TYPES,
  scoreGuardian,
  generateGuardianReport,
  validateGuardianType,
  validateRuleResult,
  getGuardianRules,
  getBlockingRules,
} from "../src/design-system/guardian-expansion.mjs";

describe("guardian expansion", () => {
  it("exports VERSION string", () => {
    assert.equal(VERSION, "1.0.0");
  });

  it("GUARDIAN_TYPES has 4 types", () => {
    assert.equal(Object.keys(GUARDIAN_TYPES).length, 4);
  });

  it("every guardian type has required fields", () => {
    for (const [id, type] of Object.entries(GUARDIAN_TYPES)) {
      assert.equal(type.id, id);
      assert.ok(type.name);
      assert.ok(type.description);
      assert.ok(Array.isArray(type.rules));
      assert.ok(type.rules.length >= 4);
      assert.ok(type.pass_threshold > 0);
      assert.ok(type.weight > 0);
    }
  });

  it("design_consistency has 5 rules", () => {
    assert.equal(GUARDIAN_TYPES.design_consistency.rules.length, 5);
  });

  it("accessibility has 6 rules", () => {
    assert.equal(GUARDIAN_TYPES.accessibility.rules.length, 6);
  });

  it("performance has 5 rules", () => {
    assert.equal(GUARDIAN_TYPES.performance.rules.length, 5);
  });

  it("security has 5 rules", () => {
    assert.equal(GUARDIAN_TYPES.security.rules.length, 5);
  });

  it("every rule has id, name, description, severity", () => {
    for (const guardian of Object.values(GUARDIAN_TYPES)) {
      for (const rule of guardian.rules) {
        assert.ok(rule.id);
        assert.ok(rule.name);
        assert.ok(rule.description);
        assert.ok(["P0", "P1", "P2"].includes(rule.severity));
      }
    }
  });

  it("weights sum to 1.0", () => {
    const totalWeight = Object.values(GUARDIAN_TYPES).reduce((sum, g) => sum + g.weight, 0);
    assert.equal(totalWeight, 1.0);
  });
});

describe("validateGuardianType", () => {
  it("accepts design_consistency", () => {
    assert.ok(validateGuardianType("design_consistency").valid);
  });

  it("accepts accessibility", () => {
    assert.ok(validateGuardianType("accessibility").valid);
  });

  it("accepts performance", () => {
    assert.ok(validateGuardianType("performance").valid);
  });

  it("accepts security", () => {
    assert.ok(validateGuardianType("security").valid);
  });

  it("rejects unknown type", () => {
    assert.ok(!validateGuardianType("unknown").valid);
  });
});

describe("validateRuleResult", () => {
  it("accepts valid rule result", () => {
    const result = validateRuleResult("design_consistency", "color_palette", true);
    assert.equal(result.valid, true);
    assert.ok(result.rule);
  });

  it("rejects unknown guardian type", () => {
    assert.ok(!validateRuleResult("unknown", "color_palette", true).valid);
  });

  it("rejects unknown rule", () => {
    assert.ok(!validateRuleResult("design_consistency", "unknown_rule", true).valid);
  });
});

describe("getGuardianRules", () => {
  it("returns rules for design_consistency", () => {
    const rules = getGuardianRules("design_consistency");
    assert.equal(rules.length, 5);
  });

  it("returns empty for unknown type", () => {
    assert.equal(getGuardianRules("unknown").length, 0);
  });
});

describe("getBlockingRules", () => {
  it("returns P0 rules from all guardians", () => {
    const blocking = getBlockingRules();
    assert.ok(blocking.length >= 8);
    assert.ok(blocking.every(r => r.severity === "P0"));
  });

  it("every blocking rule has guardian field", () => {
    const blocking = getBlockingRules();
    for (const rule of blocking) {
      assert.ok(rule.guardian);
      assert.ok(GUARDIAN_TYPES[rule.guardian]);
    }
  });
});

describe("scoreGuardian", () => {
  it("scores passing guardian", () => {
    const results = GUARDIAN_TYPES.design_consistency.rules.map(r => ({
      rule_id: r.id,
      passed: true,
    }));
    const score = scoreGuardian("design_consistency", results);
    assert.equal(score.valid, true);
    assert.equal(score.passes, true);
    assert.equal(score.score, 1);
    assert.equal(score.blocking, false);
  });

  it("scores failing guardian with P0 failure", () => {
    const results = GUARDIAN_TYPES.design_consistency.rules.map(r => ({
      rule_id: r.id,
      passed: r.id !== "color_palette",
      message: r.id === "color_palette" ? "Arbitrary hex found" : "",
    }));
    const score = scoreGuardian("design_consistency", results);
    assert.equal(score.valid, true);
    assert.equal(score.blocking, true);
    assert.ok(score.p0_failures > 0);
  });

  it("scores below threshold", () => {
    const results = GUARDIAN_TYPES.design_consistency.rules.map((r, i) => ({
      rule_id: r.id,
      passed: i < 2,
    }));
    const score = scoreGuardian("design_consistency", results);
    assert.equal(score.passes, false);
  });

  it("rejects unknown guardian type", () => {
    const score = scoreGuardian("unknown", []);
    assert.equal(score.valid, false);
  });
});

describe("generateGuardianReport", () => {
  it("generates report for passing guardians", () => {
    const scores = {};
    for (const [type, guardian] of Object.entries(GUARDIAN_TYPES)) {
      const results = guardian.rules.map(r => ({ rule_id: r.id, passed: true }));
      scores[type] = scoreGuardian(type, results);
    }
    const report = generateGuardianReport(scores);
    assert.equal(report.all_guardians_pass, true);
    assert.equal(report.recommendation, "approved");
    assert.equal(report.has_p0_failures, false);
    assert.equal(report.has_blocking, false);
  });

  it("generates report for failing guardian", () => {
    const scores = {};
    for (const [type, guardian] of Object.entries(GUARDIAN_TYPES)) {
      const results = guardian.rules.map(r => ({ rule_id: r.id, passed: true }));
      scores[type] = scoreGuardian(type, results);
    }
    scores.security = scoreGuardian("security", GUARDIAN_TYPES.security.rules.map(r => ({
      rule_id: r.id,
      passed: r.id !== "no_secrets",
    })));
    const report = generateGuardianReport(scores);
    assert.equal(report.all_guardians_pass, false);
    assert.equal(report.has_blocking, true);
    assert.equal(report.recommendation, "blocked");
  });

  it("includes generated_at timestamp", () => {
    const report = generateGuardianReport({});
    assert.ok(report.generated_at);
  });
});
