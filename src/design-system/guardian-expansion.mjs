/**
 * Guardian Expansion — Phase 15: BKB-GUARDIAN-001
 *
 * Extended guardian types, rules, validation, scoring, and report generation
 * for Pauli Brand Studio.
 */

const VERSION = "1.0.0";

/* ─── Guardian Types ────────────────────────────────────────────────────── */

const GUARDIAN_TYPES = {
  design_consistency: {
    id: "design_consistency",
    name: "Design Consistency Guardian",
    description: "Ensures visual consistency across all brand touchpoints",
    rules: [
      { id: "color_palette", name: "Color Palette Compliance", description: "All colors must come from the approved palette", severity: "P0" },
      { id: "typography_scale", name: "Typography Scale Compliance", description: "All text must use approved type scale tokens", severity: "P0" },
      { id: "spacing_scale", name: "Spacing Scale Compliance", description: "All spacing must use approved spacing tokens", severity: "P1" },
      { id: "component_usage", name: "Component Usage", description: "All UI must use registered components", severity: "P1" },
      { id: "icon_family", name: "Icon Family Compliance", description: "All icons must be from approved families", severity: "P0" },
    ],
    pass_threshold: 0.9,
    weight: 0.25,
  },
  accessibility: {
    id: "accessibility",
    name: "Accessibility Guardian",
    description: "Ensures WCAG 2.1 AA compliance across all outputs",
    rules: [
      { id: "contrast_ratio", name: "Contrast Ratio", description: "Text must meet 4.5:1 contrast ratio (3:1 for large text)", severity: "P0" },
      { id: "alt_text", name: "Alt Text", description: "All images must have descriptive alt text", severity: "P0" },
      { id: "heading_hierarchy", name: "Heading Hierarchy", description: "Headings must follow logical hierarchy", severity: "P1" },
      { id: "focus_states", name: "Focus States", description: "All interactive elements must have visible focus", severity: "P0" },
      { id: "aria_labels", name: "ARIA Labels", description: "Interactive elements must have accessible names", severity: "P0" },
      { id: "color_independence", name: "Color Independence", description: "Information must not rely solely on color", severity: "P1" },
    ],
    pass_threshold: 0.85,
    weight: 0.25,
  },
  performance: {
    id: "performance",
    name: "Performance Guardian",
    description: "Ensures optimal performance across all outputs",
    rules: [
      { id: "asset_size", name: "Asset Size", description: "Images must be optimized for web delivery", severity: "P1" },
      { id: "font_loading", name: "Font Loading", description: "Fonts must use font-display: swap", severity: "P1" },
      { id: "lazy_loading", name: "Lazy Loading", description: "Below-fold images must use lazy loading", severity: "P2" },
      { id: "responsive_images", name: "Responsive Images", description: "Images must use srcset for multiple densities", severity: "P1" },
      { id: "critical_css", name: "Critical CSS", description: "Above-fold styles must be inlined", severity: "P2" },
    ],
    pass_threshold: 0.8,
    weight: 0.2,
  },
  security: {
    id: "security",
    name: "Security Guardian",
    description: "Ensures security best practices across all outputs",
    rules: [
      { id: "no_secrets", name: "No Secrets", description: "No API keys, tokens, or credentials in source", severity: "P0" },
      { id: "no_external_scripts", name: "No External Scripts", description: "No unauthorized external script loading", severity: "P0" },
      { id: "svg_safety", name: "SVG Safety", description: "SVGs must not contain script tags or event handlers", severity: "P0" },
      { id: "content_security", name: "Content Security", description: "No eval(), innerHTML, or dangerous patterns", severity: "P0" },
      { id: "dependency_audit", name: "Dependency Audit", description: "All dependencies must be from approved sources", severity: "P1" },
    ],
    pass_threshold: 1.0,
    weight: 0.3,
  },
};

/* ─── Guardian Scoring ──────────────────────────────────────────────────── */

function scoreGuardian(guardianType, ruleResults) {
  const guardian = GUARDIAN_TYPES[guardianType];
  if (!guardian) return { valid: false, error: `Unknown guardian type: ${guardianType}` };

  const totalRules = guardian.rules.length;
  const passedRules = ruleResults.filter(r => r.passed).length;
  const score = totalRules > 0 ? passedRules / totalRules : 0;
  const passes = score >= guardian.pass_threshold;

  const failedRules = guardian.rules
    .filter(rule => !ruleResults.find(r => r.rule_id === rule.id)?.passed)
    .map(rule => ({
      rule_id: rule.id,
      name: rule.name,
      severity: rule.severity,
      message: ruleResults.find(r => r.rule_id === rule.id)?.message || "Failed",
    }));

  const p0Failures = failedRules.filter(r => r.severity === "P0");
  const p1Failures = failedRules.filter(r => r.severity === "P1");

  return {
    valid: true,
    guardian: guardianType,
    score: Math.round(score * 100) / 100,
    passes,
    threshold: guardian.pass_threshold,
    total_rules: totalRules,
    passed_rules: passedRules,
    failed_rules: failedRules,
    p0_failures: p0Failures.length,
    p1_failures: p1Failures.length,
    blocking: p0Failures.length > 0,
    weight: guardian.weight,
  };
}

/* ─── Guardian Report ────────────────────────────────────────────────────── */

function generateGuardianReport(guardianScores) {
  const totalWeight = Object.values(GUARDIAN_TYPES).reduce((sum, g) => sum + g.weight, 0);
  let weightedSum = 0;
  const guardians = [];
  let hasP0 = false;
  let hasBlocking = false;

  for (const [type, score] of Object.entries(guardianScores)) {
    if (!score.valid) continue;
    weightedSum += score.score * score.weight;
    guardians.push({ type, ...score });
    if (score.p0_failures > 0) hasP0 = true;
    if (score.blocking) hasBlocking = true;
  }

  const overallScore = totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 100) / 100 : 0;
  const allPass = guardians.every(g => g.passes);

  return {
    version: VERSION,
    overall_score: overallScore,
    all_guardians_pass: allPass,
    has_p0_failures: hasP0,
    has_blocking: hasBlocking,
    guardians,
    generated_at: new Date().toISOString(),
    recommendation: allPass ? "approved" : hasBlocking ? "blocked" : "needs_revision",
  };
}

/* ─── Validation Functions ──────────────────────────────────────────────── */

export function validateGuardianType(type) {
  return { valid: type in GUARDIAN_TYPES };
}

export function validateRuleResult(guardianType, ruleId, passed, message = "") {
  const guardian = GUARDIAN_TYPES[guardianType];
  if (!guardian) return { valid: false, error: `Unknown guardian type: ${guardianType}` };
  const rule = guardian.rules.find(r => r.id === ruleId);
  if (!rule) return { valid: false, error: `Unknown rule: ${ruleId} in ${guardianType}` };
  return { valid: true, rule };
}

export function getGuardianRules(guardianType) {
  const guardian = GUARDIAN_TYPES[guardianType];
  if (!guardian) return [];
  return guardian.rules;
}

export function getBlockingRules() {
  const blocking = [];
  for (const [type, guardian] of Object.entries(GUARDIAN_TYPES)) {
    for (const rule of guardian.rules) {
      if (rule.severity === "P0") blocking.push({ guardian: type, ...rule });
    }
  }
  return blocking;
}

/* ─── Exports ────────────────────────────────────────────────────────────── */

export {
  VERSION,
  GUARDIAN_TYPES,
  scoreGuardian,
  generateGuardianReport,
};
