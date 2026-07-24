import { test } from "node:test";
import assert from "node:assert/strict";
import {
  ANALYZER_VERSION,
  SCORE_CATEGORIES,
  REBUILD_OPTIONS,
  createScorecardCategory,
  createScorecard,
  createRebuildChecklist,
  createPRD,
  createImplementationTicket,
  decomposePRDToTickets,
  analyzeBrand,
  generatePRDFromAnalysis
} from "../src/research/brand-analyzer.mjs";

test("analyzer defines 14 score categories", () => {
  assert.equal(SCORE_CATEGORIES.length, 14);
  for (const cat of SCORE_CATEGORIES) {
    assert.ok(typeof cat === "string" && cat.length > 0);
  }
});

test("rebuild options define 15 selectable workstreams", () => {
  assert.equal(REBUILD_OPTIONS.length, 15);
  for (const option of REBUILD_OPTIONS) {
    assert.ok(option.id, "Option must have id");
    assert.ok(option.label, "Option must have label");
    assert.ok(["high", "medium", "low"].includes(option.impact), "Option must have valid impact");
    assert.ok(["high", "medium", "low"].includes(option.cost), "Option must have valid cost");
    assert.equal(option.evidence_required, true, "All options must require evidence");
  }
});

test("createScorecardCategory produces valid structure", () => {
  const cat = createScorecardCategory("clarity", { score: 7.5, severity: "P1" });
  assert.equal(cat.category, "clarity");
  assert.equal(cat.score, 7.5);
  assert.equal(cat.severity, "P1");
  assert.ok(Array.isArray(cat.rules_triggered));
  assert.ok(Array.isArray(cat.evidence));
  assert.equal(cat.pass_threshold, 8.0);
});

test("createScorecard produces overall score", () => {
  const scorecard = createScorecard({
    project_id: "test-1",
    categories: {
      clarity: { score: 8 },
      scanability: { score: 7 },
      hierarchy: { score: 9 }
    }
  });
  assert.ok(scorecard.overall_score > 0);
  assert.equal(scorecard.project_id, "test-1");
});

test("createScorecard handles empty categories", () => {
  const scorecard = createScorecard({});
  assert.equal(scorecard.overall_score, null);
  assert.equal(Object.keys(scorecard.categories).length, 14);
});

test("createRebuildChecklist marks selected options", () => {
  const checklist = createRebuildChecklist(["clarify_positioning", "repair_accessibility"]);
  assert.equal(checklist.selected_count, 2);
  assert.ok(checklist.items.find((i) => i.id === "clarify_positioning").selected);
  assert.ok(!checklist.items.find((i) => i.id === "rewrite_messaging").selected);
});

test("createRebuildChecklist calculates impact and cost totals", () => {
  const checklist = createRebuildChecklist(["clarify_positioning", "repair_accessibility"]);
  assert.ok(checklist.total_impact > 0);
  assert.ok(checklist.total_cost > 0);
});

test("createPRD produces valid PRD structure", () => {
  const prd = createPRD({
    project_id: "test-1",
    title: "Test PRD",
    summary: "A test",
    upgrade_goals: ["Improve clarity"],
    rebuild_scope: ["clarify_positioning"],
    acceptance_criteria: ["Pass Krug rules"]
  });
  assert.equal(prd.project_id, "test-1");
  assert.equal(prd.title, "Test PRD");
  assert.ok(Array.isArray(prd.upgrade_goals));
  assert.ok(Array.isArray(prd.acceptance_criteria));
});

test("createImplementationTicket produces valid ticket", () => {
  const ticket = createImplementationTicket({
    ticket_id: "BKB-UPGRADE-TEST",
    title: "Test ticket",
    scope: ["test"],
    acceptance_criteria: ["Pass tests"]
  });
  assert.equal(ticket.ticket_id, "BKB-UPGRADE-TEST");
  assert.ok(Array.isArray(ticket.scope));
  assert.ok(Array.isArray(ticket.acceptance_criteria));
});

test("decomposePRDToTickets creates one ticket per selected option", () => {
  const prd = createPRD({ project_id: "test-1" });
  const checklist = createRebuildChecklist(["clarify_positioning", "repair_accessibility"]);
  const tickets = decomposePRDToTickets(prd, checklist);
  assert.equal(tickets.length, 2);
  assert.ok(tickets.every((t) => t.ticket_id.startsWith("BKB-UPGRADE-")));
});

test("analyzeBrand produces scorecard with rule results", () => {
  const analysis = analyzeBrand({
    project_id: "test-1",
    source_url: "https://example.com",
    site_census: { evidence: [{ claim: "Page crawled", verification_state: "verified", source_url: "https://example.com" }] },
    public_research: { evidence: [] },
    design_surface: {
      primary_heading: "Welcome",
      primary_action: "Start",
      interactive_inventory: [{ id: "btn1", is_primary: true, clickable: true, visually_obvious: true }],
      semantic_structure: [{ tag: "h1", text: "Welcome" }],
      content_priority: [{ id: "c1", visual_weight: 10, information_priority: 10 }],
      route_map: [{ id: "nav1" }],
      active_nav_state: { current_location_visible: true },
      exit_paths: [{ id: "flow1", has_exit: true }],
      mobile_viewport: { removes_essential_context: false, touch_targets_below_min: false },
      claims_ledger: [{ id: "c1", verified: true }],
      hero_content: { has_logo_strip: false, has_feature_cards: false, has_testimonials: false, brand_specific_rationale: true },
      component_inventory: [{ id: "card1", nested_depth: 0 }],
      layout_rationale: { is_bento: false },
      metric_sources: [{ id: "m1", source: "survey" }],
      icon_inventory: [{ id: "i1", family: "Phosphor", is_emoji: false }],
      motion_inventory: [{ id: "m1", purpose: "feedback", type: "fade", applied_to: "single" }],
      copy_analysis: [{ id: "c1", text: "Specific brand copy" }],
      data_audit: { has_placeholder_as_real: false, has_lorem_ipsum: false, has_fake_testimonials: false },
      design_rationale: { has_generic_gradient_blobs: false, business_rationale: true }
    }
  });
  assert.equal(analysis.project_id, "test-1");
  assert.ok(analysis.scorecard);
  assert.ok(analysis.rule_summary);
  assert.equal(analysis.rule_summary.gate, "PASS");
});

test("analyzeBrand recommends rebuild options for low scores", () => {
  const analysis = analyzeBrand({
    project_id: "test-1",
    source_url: "https://example.com",
    design_surface: {
      primary_heading: "",
      primary_action: "",
      interactive_inventory: [{ id: "btn1", is_primary: false, clickable: true, visually_obvious: false }],
      semantic_structure: [],
      content_priority: [],
      route_map: [],
      active_nav_state: { current_location_visible: false },
      exit_paths: [{ id: "flow1", has_exit: false }],
      mobile_viewport: { removes_essential_context: true, touch_targets_below_min: true },
      claims_ledger: [{ id: "c1", verified: false }],
      hero_content: { has_logo_strip: true, has_feature_cards: true, has_testimonials: true, brand_specific_rationale: false },
      component_inventory: [{ id: "card1", nested_depth: 3 }, { id: "card2", nested_depth: 3 }, { id: "card3", nested_depth: 3 }],
      layout_rationale: { is_bento: true, information_model_justification: false },
      metric_sources: [{ id: "m1", source: "unknown" }],
      icon_inventory: [{ id: "i1", family: "emoji", is_emoji: true }],
      motion_inventory: [{ id: "m1", purpose: "decorative", type: "fade-up", applied_to: "all" }],
      copy_analysis: [{ id: "c1", text: "Transform your business" }],
      data_audit: { has_placeholder_as_real: true, has_lorem_ipsum: false, has_fake_testimonials: false },
      design_rationale: { has_generic_gradient_blobs: true, business_rationale: false }
    }
  });
  assert.ok(analysis.recommended_rebuild_options.length > 0, "Should recommend rebuild options for low scores");
  assert.equal(analysis.rule_summary.gate, "BLOCK");
});

test("analyzeBrand handles missing design surface", () => {
  const analysis = analyzeBrand({
    project_id: "test-1",
    source_url: "https://example.com",
    site_census: { evidence: [] },
    public_research: { evidence: [] }
  });
  assert.ok(analysis.scorecard);
  assert.equal(analysis.rule_summary.total, 0);
});

test("generatePRDFromAnalysis creates PRD and tickets from selected options", () => {
  const analysis = analyzeBrand({
    project_id: "test-1",
    source_url: "https://example.com",
    design_surface: {
      primary_heading: "Test",
      primary_action: "Go",
      interactive_inventory: [{ id: "btn1", is_primary: true, clickable: true, visually_obvious: true }],
      semantic_structure: [{ tag: "h1", text: "Test" }],
      content_priority: [{ id: "c1", visual_weight: 10, information_priority: 10 }],
      route_map: [{ id: "nav1" }],
      active_nav_state: { current_location_visible: true },
      exit_paths: [{ id: "flow1", has_exit: true }],
      mobile_viewport: { removes_essential_context: false, touch_targets_below_min: false },
      claims_ledger: [{ id: "c1", verified: true }],
      hero_content: { has_logo_strip: false, has_feature_cards: false, has_testimonials: false, brand_specific_rationale: true },
      component_inventory: [{ id: "card1", nested_depth: 0 }],
      layout_rationale: { is_bento: false },
      metric_sources: [{ id: "m1", source: "survey" }],
      icon_inventory: [{ id: "i1", family: "Phosphor", is_emoji: false }],
      motion_inventory: [{ id: "m1", purpose: "feedback", type: "fade", applied_to: "single" }],
      copy_analysis: [{ id: "c1", text: "Specific copy" }],
      data_audit: { has_placeholder_as_real: false, has_lorem_ipsum: false, has_fake_testimonials: false },
      design_rationale: { has_generic_gradient_blobs: false, business_rationale: true }
    }
  });
  const { prd, tickets, checklist } = generatePRDFromAnalysis(analysis, ["clarify_positioning", "repair_accessibility"]);
  assert.equal(prd.project_id, "test-1");
  assert.ok(prd.summary.includes("2 upgrade workstreams"));
  assert.equal(tickets.length, 2);
  assert.equal(checklist.selected_count, 2);
});

test("scorecard never emits unexplained aggregate only", () => {
  const analysis = analyzeBrand({
    project_id: "test-1",
    source_url: "https://example.com",
    design_surface: {
      primary_heading: "Test",
      primary_action: "Go",
      interactive_inventory: [{ id: "btn1", is_primary: true, clickable: true, visually_obvious: true }],
      semantic_structure: [{ tag: "h1", text: "Test" }],
      content_priority: [{ id: "c1", visual_weight: 10, information_priority: 10 }],
      route_map: [{ id: "nav1" }],
      active_nav_state: { current_location_visible: true },
      exit_paths: [{ id: "flow1", has_exit: true }],
      mobile_viewport: { removes_essential_context: false, touch_targets_below_min: false },
      claims_ledger: [{ id: "c1", verified: true }],
      hero_content: { has_logo_strip: false, has_feature_cards: false, has_testimonials: false, brand_specific_rationale: true },
      component_inventory: [{ id: "card1", nested_depth: 0 }],
      layout_rationale: { is_bento: false },
      metric_sources: [{ id: "m1", source: "survey" }],
      icon_inventory: [{ id: "i1", family: "Phosphor", is_emoji: false }],
      motion_inventory: [{ id: "m1", purpose: "feedback", type: "fade", applied_to: "single" }],
      copy_analysis: [{ id: "c1", text: "Specific copy" }],
      data_audit: { has_placeholder_as_real: false, has_lorem_ipsum: false, has_fake_testimonials: false },
      design_rationale: { has_generic_gradient_blobs: false, business_rationale: true }
    }
  });
  for (const cat of SCORE_CATEGORIES) {
    const category = analysis.scorecard.categories[cat];
    assert.ok(category, `Category ${cat} must exist in scorecard`);
    assert.ok(Array.isArray(category.rules_triggered), `Category ${cat} must have rules_triggered array`);
  }
});

test("deterministic: same analysis input produces same scorecard", () => {
  const input = {
    project_id: "test-1",
    source_url: "https://example.com",
    design_surface: {
      primary_heading: "Test",
      primary_action: "Go",
      interactive_inventory: [{ id: "btn1", is_primary: true, clickable: true, visually_obvious: true }],
      semantic_structure: [{ tag: "h1", text: "Test" }],
      content_priority: [{ id: "c1", visual_weight: 10, information_priority: 10 }],
      route_map: [{ id: "nav1" }],
      active_nav_state: { current_location_visible: true },
      exit_paths: [{ id: "flow1", has_exit: true }],
      mobile_viewport: { removes_essential_context: false, touch_targets_below_min: false },
      claims_ledger: [{ id: "c1", verified: true }],
      hero_content: { has_logo_strip: false, has_feature_cards: false, has_testimonials: false, brand_specific_rationale: true },
      component_inventory: [{ id: "card1", nested_depth: 0 }],
      layout_rationale: { is_bento: false },
      metric_sources: [{ id: "m1", source: "survey" }],
      icon_inventory: [{ id: "i1", family: "Phosphor", is_emoji: false }],
      motion_inventory: [{ id: "m1", purpose: "feedback", type: "fade", applied_to: "single" }],
      copy_analysis: [{ id: "c1", text: "Specific copy" }],
      data_audit: { has_placeholder_as_real: false, has_lorem_ipsum: false, has_fake_testimonials: false },
      design_rationale: { has_generic_gradient_blobs: false, business_rationale: true }
    }
  };
  const a1 = analyzeBrand(input);
  const a2 = analyzeBrand(input);
  assert.equal(a1.scorecard.overall_score, a2.scorecard.overall_score);
  assert.deepEqual(a1.recommended_rebuild_options, a2.recommended_rebuild_options);
});
