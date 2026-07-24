import { evaluateAllKrug, evaluateAllSlop, summarizeResults } from "../../apps/studio/rules-engine.js";
import { calculateConfidence, analyzeEvidenceConflicts, filterPublicClaims } from "./public-research.mjs";

export const ANALYZER_VERSION = "1.0.0";

export const SCORE_CATEGORIES = [
  "clarity",
  "scanability",
  "hierarchy",
  "interaction_obviousness",
  "navigation",
  "distinctiveness",
  "design_system_consistency",
  "typography",
  "color",
  "spacing_layout",
  "responsive_quality",
  "accessibility",
  "proof_integrity",
  "anti_slop_compliance"
];

export const REBUILD_OPTIONS = [
  { id: "clarify_positioning", label: "Clarify positioning and offer", impact: "high", cost: "medium", evidence_required: true },
  { id: "rewrite_messaging", label: "Rewrite website messaging", impact: "high", cost: "medium", evidence_required: true },
  { id: "rebuild_ia", label: "Rebuild information architecture", impact: "high", cost: "high", evidence_required: true },
  { id: "refresh_visual_identity", label: "Refresh visual identity", impact: "medium", cost: "medium", evidence_required: true },
  { id: "replace_design_system", label: "Replace the entire design system", impact: "high", cost: "high", evidence_required: true },
  { id: "rebuild_frontend", label: "Rebuild the website frontend", impact: "high", cost: "high", evidence_required: true },
  { id: "repair_accessibility", label: "Repair accessibility", impact: "high", cost: "medium", evidence_required: true },
  { id: "improve_performance", label: "Improve performance", impact: "medium", cost: "medium", evidence_required: true },
  { id: "create_bilingual_content", label: "Create a bilingual content system", impact: "medium", cost: "medium", evidence_required: true },
  { id: "build_blog_search", label: "Build a blog and search strategy", impact: "medium", cost: "medium", evidence_required: true },
  { id: "repair_reputation", label: "Repair local reputation presentation", impact: "medium", cost: "low", evidence_required: true },
  { id: "rebuild_social", label: "Rebuild social profiles and templates", impact: "low", cost: "low", evidence_required: true },
  { id: "create_photo_video", label: "Create a photo and video system", impact: "medium", cost: "high", evidence_required: true },
  { id: "create_brand_book", label: "Create a brand book", impact: "medium", cost: "medium", evidence_required: true },
  { id: "create_dev_handoff", label: "Create a developer and agent handoff", impact: "medium", cost: "low", evidence_required: true }
];

export function createScorecardCategory(category, input = {}) {
  return {
    category,
    score: Number.isFinite(input.score) ? input.score : null,
    rules_triggered: Array.isArray(input.rules_triggered) ? input.rules_triggered : [],
    evidence: Array.isArray(input.evidence) ? input.evidence : [],
    severity: input.severity || null,
    recommended_action: input.recommended_action || null,
    pass_threshold: input.pass_threshold ?? 8.0
  };
}

export function createScorecard(input = {}) {
  const categories = {};
  for (const cat of SCORE_CATEGORIES) {
    categories[cat] = createScorecardCategory(cat, input.categories?.[cat] || {});
  }
  const scores = Object.values(categories).map((c) => c.score).filter((s) => Number.isFinite(s));
  const overall = scores.length > 0 ? Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)) : null;
  return {
    schema_version: "1.0",
    analyzer_version: ANALYZER_VERSION,
    project_id: input.project_id || null,
    source_url: input.source_url || null,
    categories,
    overall_score: overall,
    evidence_count: input.evidence_count || 0,
    confidence: input.confidence || 0,
    generated_at: new Date().toISOString()
  };
}

export function createRebuildChecklist(selectedOptions = []) {
  const selected = new Set(selectedOptions);
  const items = REBUILD_OPTIONS.map((option) => ({
    ...option,
    selected: selected.has(option.id),
    evidence_provided: false
  }));
  const selectedItems = items.filter((i) => i.selected);
  return {
    schema_version: "1.0",
    items,
    selected_count: selectedItems.length,
    total_impact: selectedItems.reduce((sum, i) => sum + (i.impact === "high" ? 3 : i.impact === "medium" ? 2 : 1), 0),
    total_cost: selectedItems.reduce((sum, i) => sum + (i.cost === "high" ? 3 : i.cost === "medium" ? 2 : 1), 0),
    generated_at: new Date().toISOString()
  };
}

export function createPRD(input = {}) {
  return {
    schema_version: "1.0",
    prd_version: ANALYZER_VERSION,
    project_id: input.project_id || null,
    title: input.title || "Brand Upgrade PRD",
    summary: input.summary || "",
    current_state: input.current_state || null,
    upgrade_goals: Array.isArray(input.upgrade_goals) ? input.upgrade_goals : [],
    rebuild_scope: Array.isArray(input.rebuild_scope) ? input.rebuild_scope : [],
    acceptance_criteria: Array.isArray(input.acceptance_criteria) ? input.acceptance_criteria : [],
    rollback_plan: input.rollback_plan || null,
    evidence_references: Array.isArray(input.evidence_references) ? input.evidence_references : [],
    created_at: new Date().toISOString()
  };
}

export function createImplementationTicket(input = {}) {
  return {
    schema_version: "1.0",
    ticket_id: input.ticket_id || "",
    prd_id: input.prd_id || null,
    title: input.title || "",
    description: input.description || "",
    scope: Array.isArray(input.scope) ? input.scope : [],
    acceptance_criteria: Array.isArray(input.acceptance_criteria) ? input.acceptance_criteria : [],
    evidence_required: Array.isArray(input.evidence_required) ? input.evidence_required : [],
    estimated_cost: input.estimated_cost || "unknown",
    risk_level: input.risk_level || "medium",
    dependencies: Array.isArray(input.dependencies) ? input.dependencies : [],
    created_at: new Date().toISOString()
  };
}

export function decomposePRDToTickets(prd, rebuildChecklist) {
  const tickets = [];
  const selectedItems = rebuildChecklist.items.filter((i) => i.selected);
  for (const item of selectedItems) {
    const ticket = createImplementationTicket({
      ticket_id: `BKB-UPGRADE-${item.id.toUpperCase()}`,
      prd_id: prd.project_id,
      title: item.label,
      description: `Upgrade workstream: ${item.label}. Impact: ${item.impact}. Cost: ${item.cost}.`,
      scope: [item.id],
      acceptance_criteria: [
        `Complete ${item.label} with evidence-backed decisions`,
        "Pass all applicable Krug and anti-slop rules",
        "Guardian review passed"
      ],
      evidence_required: item.evidence_required ? ["source-ledger", "before-after-comparison"] : [],
      estimated_cost: item.cost,
      risk_level: item.impact === "high" ? "high" : "medium"
    });
    tickets.push(ticket);
  }
  return tickets;
}

export function analyzeBrand(input = {}) {
  const { project_id, source_url, site_census, public_research, design_surface } = input;
  const allEvidence = [
    ...(site_census?.evidence || []),
    ...(public_research?.evidence || [])
  ];
  const conflictAnalysis = analyzeEvidenceConflicts(allEvidence);
  const confidence = calculateConfidence(allEvidence);
  const publicClaims = filterPublicClaims(allEvidence);

  const krugResults = design_surface ? evaluateAllKrug(design_surface) : [];
  const slopResults = design_surface ? evaluateAllSlop(design_surface) : [];
  const ruleSummary = summarizeResults([...krugResults, ...slopResults]);

  const categories = {};
  for (const cat of SCORE_CATEGORIES) {
    const relevantRules = [...krugResults, ...slopResults].filter((r) => {
      if (cat === "clarity") return r.rule_id.includes("CLARITY") || r.rule_id.includes("CTA");
      if (cat === "scanability") return r.rule_id.includes("SCAN");
      if (cat === "hierarchy") return r.rule_id.includes("HIER");
      if (cat === "interaction_obviousness") return r.rule_id.includes("CLICK");
      if (cat === "navigation") return r.rule_id.includes("NAV") || r.rule_id.includes("LOCATION");
      if (cat === "distinctiveness") return r.rule_id.includes("AI-DEFAULT") || r.rule_id.includes("HERO");
      if (cat === "design_system_consistency") return r.rule_id.includes("CARD") || r.rule_id.includes("BENTO") || r.rule_id.includes("ICON");
      if (cat === "typography") return r.rule_id.includes("COPY");
      if (cat === "color") return r.rule_id.includes("AI-DEFAULT");
      if (cat === "spacing_layout") return r.rule_id.includes("CARD") || r.rule_id.includes("BENTO");
      if (cat === "responsive_quality") return r.rule_id.includes("MOBILE");
      if (cat === "accessibility") return r.rule_id.includes("CLICK") || r.rule_id.includes("NAV");
      if (cat === "proof_integrity") return r.rule_id.includes("CLAIM") || r.rule_id.includes("PLACEHOLDER") || r.rule_id.includes("METRIC");
      if (cat === "anti_slop_compliance") return r.rule_id.startsWith("SLOP");
      return false;
    });
    const blockingRules = relevantRules.filter((r) => r.status === "BLOCK");
    const warningRules = relevantRules.filter((r) => r.status === "WARN");
    let score = 10;
    for (const r of blockingRules) score -= 2;
    for (const r of warningRules) score -= 1;
    score = Math.max(0, Math.min(10, score));
    categories[cat] = createScorecardCategory(cat, {
      score: relevantRules.length > 0 ? score : null,
      rules_triggered: relevantRules.map((r) => ({ rule_id: r.rule_id, status: r.status, severity: r.severity })),
      evidence: relevantRules.map((r) => r.evidence).filter(Boolean),
      severity: blockingRules.length > 0 ? "P0" : warningRules.length > 0 ? "P1" : null,
      recommended_action: blockingRules.length > 0 ? blockingRules[0].remediation : warningRules.length > 0 ? warningRules[0].remediation : null
    });
  }

  const scorecard = createScorecard({
    project_id,
    source_url,
    categories,
    evidence_count: allEvidence.length,
    confidence
  });

  const recommendedOptions = REBUILD_OPTIONS.filter((option) => {
    if (option.id === "clarify_positioning") return categories.clarity?.score !== null && categories.clarity.score < 8;
    if (option.id === "rewrite_messaging") return categories.clarity?.score !== null && categories.clarity.score < 7;
    if (option.id === "rebuild_ia") return categories.navigation?.score !== null && categories.navigation.score < 7;
    if (option.id === "refresh_visual_identity") return categories.distinctiveness?.score !== null && categories.distinctiveness.score < 7;
    if (option.id === "replace_design_system") return categories.design_system_consistency?.score !== null && categories.design_system_consistency.score < 6;
    if (option.id === "rebuild_frontend") return categories.responsive_quality?.score !== null && categories.responsive_quality.score < 6;
    if (option.id === "repair_accessibility") return categories.accessibility?.score !== null && categories.accessibility.score < 7;
    if (option.id === "improve_performance") return categories.responsive_quality?.score !== null && categories.responsive_quality.score < 7;
    if (option.id === "repair_reputation") return public_research?.reputation?.confidence !== undefined && public_research.reputation.confidence < 0.5;
    if (option.id === "rebuild_social") return public_research?.social?.abandoned_or_conflicting > 0;
    if (option.id === "create_brand_book") return categories.distinctiveness?.score !== null && categories.distinctiveness.score < 7;
    if (option.id === "create_dev_handoff") return categories.design_system_consistency?.score !== null && categories.design_system_consistency.score < 8;
    return false;
  }).map((o) => o.id);

  const checklist = createRebuildChecklist(recommendedOptions);

  return {
    schema_version: "1.0",
    analyzer_version: ANALYZER_VERSION,
    project_id,
    source_url,
    scorecard,
    rule_summary: ruleSummary,
    conflict_analysis: conflictAnalysis,
    public_claims_available: publicClaims.length,
    recommended_rebuild_options: recommendedOptions,
    rebuild_checklist: checklist,
    analyzed_at: new Date().toISOString()
  };
}

export function generatePRDFromAnalysis(analysis, selectedOptions = []) {
  const checklist = createRebuildChecklist(selectedOptions);
  const selected = checklist.items.filter((i) => i.selected);
  const prd = createPRD({
    project_id: analysis.project_id,
    title: `Brand Upgrade PRD — ${analysis.project_id || "Untitled"}`,
    summary: `Overall score: ${analysis.scorecard.overall_score ?? "N/A"}/10. ${selected.length} upgrade workstreams selected.`,
    current_state: {
      overall_score: analysis.scorecard.overall_score,
      confidence: analysis.scorecard.confidence,
      evidence_count: analysis.scorecard.evidence_count,
      conflicts: analysis.conflict_analysis.has_conflicts
    },
    upgrade_goals: selected.map((i) => i.label),
    rebuild_scope: selected.map((i) => i.id),
    acceptance_criteria: [
      "All selected upgrade workstreams completed with evidence",
      "Krug and anti-slop gates pass",
      "Guardian review passed",
      "No fabricated proof or claims"
    ],
    rollback_plan: "Revert upgrade commits. Original state preserved in git history.",
    evidence_references: analysis.scorecard.categories[Object.keys(analysis.scorecard.categories)[0]]?.evidence?.slice(0, 5) || []
  });
  const tickets = decomposePRDToTickets(prd, checklist);
  return { prd, tickets, checklist };
}
