/**
 * Cost & Budget Guard — Phase 21: BKB-COST-001
 *
 * Enforces budget limits across providers, analyses, and exports.
 * Tracks spending, validates against limits, and prevents overages.
 */

const VERSION = "1.0.0";

/* ─── Cost Limits (from contracts.js) ────────────────────────────────────── */

const COST_LIMITS = {
  analysis: {
    siteCrawl: { maxCost: 0.05, unit: "USD" },
    publicResearch: { maxCost: 0.10, unit: "USD" },
    brandAnalysis: { maxCost: 0.15, unit: "USD" },
  },
  generation: {
    logoDesign: { maxCost: 0.25, unit: "USD" },
    assetProduction: { maxCost: 0.20, unit: "USD" },
    brandBook: { maxCost: 0.30, unit: "USD" },
  },
  export: {
    singleFormat: { maxCost: 0.05, unit: "USD" },
    allFormats: { maxCost: 0.15, unit: "USD" },
  },
  daily: { maxCost: 5.00, unit: "USD" },
  monthly: { maxCost: 50.00, unit: "USD" },
  perProject: { maxCost: 10.00, unit: "USD" },
};

/* ─── Provider Cost Rates ────────────────────────────────────────────────── */

const PROVIDER_RATES = {
  "openai-gpt4": { inputPer1k: 0.03, outputPer1k: 0.06 },
  "openai-gpt35": { inputPer1k: 0.0015, outputPer1k: 0.002 },
  "anthropic-claude": { inputPer1k: 0.015, outputPer1k: 0.075 },
  "dalle3": { perImage: 0.04 },
  "stable-diffusion": { perImage: 0.002 },
  "local": { perImage: 0.00 },
};

/* ─── Budget State ───────────────────────────────────────────────────────── */

function createBudgetState() {
  return {
    daily: { spent: 0, limit: COST_LIMITS.daily.maxCost, date: todayKey() },
    monthly: { spent: 0, limit: COST_LIMITS.monthly.maxCost, date: monthKey() },
    projects: {},
    transactions: [],
  };
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function monthKey() {
  return new Date().toISOString().slice(0, 7);
}

function resetDailyIfNewDay(state) {
  const today = todayKey();
  if (state.daily.date !== today) {
    return { ...state, daily: { spent: 0, limit: COST_LIMITS.daily.maxCost, date: today } };
  }
  return state;
}

function resetMonthlyIfNewMonth(state) {
  const month = monthKey();
  if (state.monthly.date !== month) {
    return { ...state, monthly: { spent: 0, limit: COST_LIMITS.monthly.maxCost, date: month } };
  }
  return state;
}

/* ─── Cost Estimation ────────────────────────────────────────────────────── */

function estimateProviderCost(provider, inputTokens, outputTokens) {
  const rate = PROVIDER_RATES[provider];
  if (!rate) return null;
  if (rate.inputPer1k !== undefined) {
    return (inputTokens / 1000) * rate.inputPer1k + (outputTokens / 1000) * rate.outputPer1k;
  }
  if (rate.perImage !== undefined) {
    return rate.perImage;
  }
  return null;
}

function estimateOperationCost(operation) {
  const limits = COST_LIMITS;
  switch (operation) {
    case "siteCrawl": return limits.analysis.siteCrawl.maxCost;
    case "publicResearch": return limits.analysis.publicResearch.maxCost;
    case "brandAnalysis": return limits.analysis.brandAnalysis.maxCost;
    case "logoDesign": return limits.generation.logoDesign.maxCost;
    case "assetProduction": return limits.generation.assetProduction.maxCost;
    case "brandBook": return limits.generation.brandBook.maxCost;
    case "singleFormat": return limits.export.singleFormat.maxCost;
    case "allFormats": return limits.export.allFormats.maxCost;
    default: return null;
  }
}

/* ─── Budget Checking ────────────────────────────────────────────────────── */

function canAfford(state, amount) {
  const fresh = resetDailyIfNewDay(resetMonthlyIfNewMonth(state));
  const remainingDaily = fresh.daily.limit - fresh.daily.spent;
  const remainingMonthly = fresh.monthly.limit - fresh.monthly.spent;
  return amount <= remainingDaily && amount <= remainingMonthly;
}

function getRemainingBudget(state) {
  const fresh = resetDailyIfNewDay(resetMonthlyIfNewMonth(state));
  return {
    daily: fresh.daily.limit - fresh.daily.spent,
    monthly: fresh.monthly.limit - fresh.monthly.spent,
  };
}

function getProjectSpent(state, projectId) {
  const project = state.projects[projectId];
  return project ? project.spent : 0;
}

/* ─── Recording Transactions ─────────────────────────────────────────────── */

function recordTransaction(state, { projectId, operation, amount, provider, description }) {
  const fresh = resetDailyIfNewDay(resetMonthlyIfNewMonth(state));

  if (amount < 0) throw new Error("Amount must be non-negative");
  if (!canAfford(fresh, amount)) throw new Error("Budget exceeded");

  const transaction = {
    id: `txn-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    projectId,
    operation,
    amount,
    provider,
    description,
    timestamp: new Date().toISOString(),
  };

  const projectSpent = (fresh.projects[projectId]?.spent || 0) + amount;
  const projectLimit = COST_LIMITS.perProject.maxCost;
  if (projectSpent > projectLimit) {
    throw new Error(`Project budget exceeded: $${projectSpent.toFixed(2)} > $${projectLimit}`);
  }

  return {
    daily: { ...fresh.daily, spent: fresh.daily.spent + amount },
    monthly: { ...fresh.monthly, spent: fresh.monthly.spent + amount },
    projects: {
      ...fresh.projects,
      [projectId]: { spent: projectSpent, limit: projectLimit },
    },
    transactions: [...fresh.transactions, transaction],
  };
}

/* ─── Validation ─────────────────────────────────────────────────────────── */

function validateBudgetState(state) {
  const errors = [];
  if (!state) errors.push("State is required");
  if (state) {
    if (typeof state.daily?.spent !== "number") errors.push("daily.spent must be a number");
    if (typeof state.monthly?.spent !== "number") errors.push("monthly.spent must be a number");
    if (!Array.isArray(state.transactions)) errors.push("transactions must be an array");
  }
  return { valid: errors.length === 0, errors };
}

function validateCostLimits() {
  const errors = [];
  if (COST_LIMITS.daily.maxCost <= 0) errors.push("daily.maxCost must be positive");
  if (COST_LIMITS.monthly.maxCost <= 0) errors.push("monthly.maxCost must be positive");
  if (COST_LIMITS.perProject.maxCost <= 0) errors.push("perProject.maxCost must be positive");
  if (COST_LIMITS.monthly.maxCost < COST_LIMITS.daily.maxCost) {
    errors.push("monthly.maxCost must be >= daily.maxCost");
  }
  return { valid: errors.length === 0, errors };
}

/* ─── Exports ────────────────────────────────────────────────────────────── */

export {
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
};
