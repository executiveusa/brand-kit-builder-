import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  VERSION,
  COST_LIMITS,
  PROVIDER_RATES,
  createBudgetState,
  estimateProviderCost,
  estimateOperationCost,
  canAfford,
  getRemainingBudget,
  getProjectSpent,
  recordTransaction,
  resetDailyIfNewDay,
  resetMonthlyIfNewMonth,
  validateBudgetState,
  validateCostLimits,
} from "../src/budget/cost-guard.mjs";

describe("cost guard", () => {
  it("exports VERSION string", () => {
    assert.equal(VERSION, "1.0.0");
  });

  it("COST_LIMITS has analysis, generation, export, daily, monthly, perProject", () => {
    assert.ok(COST_LIMITS.analysis);
    assert.ok(COST_LIMITS.generation);
    assert.ok(COST_LIMITS.export);
    assert.ok(COST_LIMITS.daily);
    assert.ok(COST_LIMITS.monthly);
    assert.ok(COST_LIMITS.perProject);
  });

  it("PROVIDER_RATES has 6 providers", () => {
    assert.equal(Object.keys(PROVIDER_RATES).length, 6);
  });
});

describe("createBudgetState", () => {
  it("creates initial state", () => {
    const state = createBudgetState();
    assert.equal(state.daily.spent, 0);
    assert.equal(state.monthly.spent, 0);
    assert.deepEqual(state.projects, {});
    assert.deepEqual(state.transactions, []);
  });
});

describe("estimateProviderCost", () => {
  it("estimates GPT-4 cost", () => {
    const cost = estimateProviderCost("openai-gpt4", 1000, 500);
    assert.ok(cost > 0);
    assert.equal(cost, 0.03 + 0.03);
  });

  it("estimates GPT-3.5 cost", () => {
    const cost = estimateProviderCost("openai-gpt35", 1000, 1000);
    assert.ok(cost > 0);
    assert.equal(cost, 0.0015 + 0.002);
  });

  it("estimates DALL-E 3 cost", () => {
    const cost = estimateProviderCost("dalle3", 100, 100);
    assert.equal(cost, 0.04);
  });

  it("estimates Stable Diffusion cost", () => {
    const cost = estimateProviderCost("stable-diffusion", 100, 100);
    assert.equal(cost, 0.002);
  });

  it("estimates local cost as zero", () => {
    const cost = estimateProviderCost("local", 100, 100);
    assert.equal(cost, 0);
  });

  it("returns null for unknown provider", () => {
    assert.equal(estimateProviderCost("unknown", 100, 100), null);
  });
});

describe("estimateOperationCost", () => {
  it("estimates siteCrawl cost", () => {
    assert.equal(estimateOperationCost("siteCrawl"), 0.05);
  });

  it("estimates logoDesign cost", () => {
    assert.equal(estimateOperationCost("logoDesign"), 0.25);
  });

  it("returns null for unknown operation", () => {
    assert.equal(estimateOperationCost("unknown"), null);
  });
});

describe("canAfford", () => {
  it("returns true for small amount", () => {
    const state = createBudgetState();
    assert.ok(canAfford(state, 1.00));
  });

  it("returns false for amount exceeding daily limit", () => {
    const state = createBudgetState();
    assert.ok(!canAfford(state, 6.00));
  });
});

describe("getRemainingBudget", () => {
  it("returns full budget initially", () => {
    const state = createBudgetState();
    const remaining = getRemainingBudget(state);
    assert.equal(remaining.daily, 5.00);
    assert.equal(remaining.monthly, 50.00);
  });
});

describe("getProjectSpent", () => {
  it("returns 0 for unknown project", () => {
    const state = createBudgetState();
    assert.equal(getProjectSpent(state, "proj-1"), 0);
  });
});

describe("recordTransaction", () => {
  it("records transaction and updates spent", () => {
    const state = createBudgetState();
    const updated = recordTransaction(state, {
      projectId: "proj-1",
      operation: "siteCrawl",
      amount: 0.05,
      provider: "local",
      description: "Test crawl",
    });
    assert.equal(updated.daily.spent, 0.05);
    assert.equal(updated.monthly.spent, 0.05);
    assert.equal(updated.transactions.length, 1);
    assert.equal(updated.transactions[0].projectId, "proj-1");
  });

  it("throws on negative amount", () => {
    const state = createBudgetState();
    assert.throws(() => recordTransaction(state, {
      projectId: "proj-1",
      operation: "test",
      amount: -1,
      provider: "local",
      description: "Negative",
    }));
  });

  it("throws when budget exceeded", () => {
    const state = createBudgetState();
    assert.throws(() => recordTransaction(state, {
      projectId: "proj-1",
      operation: "test",
      amount: 6.00,
      provider: "local",
      description: "Over budget",
    }));
  });

  it("throws when project budget exceeded", () => {
    let state = createBudgetState();
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    state = { ...state, daily: { ...state.daily, date: yesterday, spent: 0 } };
    state = recordTransaction(state, {
      projectId: "proj-1",
      operation: "test",
      amount: 4.00,
      provider: "local",
      description: "Day 1",
    });
    state = { ...state, daily: { ...state.daily, date: yesterday, spent: 0 } };
    state = recordTransaction(state, {
      projectId: "proj-1",
      operation: "test",
      amount: 4.00,
      provider: "local",
      description: "Day 2",
    });
    state = { ...state, daily: { ...state.daily, date: yesterday, spent: 0 } };
    assert.throws(() => recordTransaction(state, {
      projectId: "proj-1",
      operation: "test",
      amount: 4.00,
      provider: "local",
      description: "Over project limit",
    }));
  });
});

describe("validateBudgetState", () => {
  it("accepts valid state", () => {
    assert.ok(validateBudgetState(createBudgetState()).valid);
  });

  it("rejects null state", () => {
    assert.ok(!validateBudgetState(null).valid);
  });
});

describe("validateCostLimits", () => {
  it("validates cost limits are consistent", () => {
    assert.ok(validateCostLimits().valid);
  });
});
