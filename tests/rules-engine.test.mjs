import { test } from "node:test";
import assert from "node:assert/strict";
import {
  RULE_ENGINE_VERSION,
  RULE_STATUSES,
  KRUG_RULES,
  SLOP_RULES,
  SLOP_CATEGORIES,
  SCORE_CAPS,
  createRuleResult,
  evaluateRule,
  evaluateAllKrug,
  evaluateAllSlop,
  evaluateAll,
  summarizeResults,
  applyWaiver,
  applyScoreCap,
  evaluateKrugClarity,
  evaluateKrugCTA,
  evaluateKrugClick,
  evaluateKrugLocation,
  evaluateKrugRecovery,
  evaluateSlopClaim,
  evaluateSlopIcon,
  evaluateSlopCopy,
  evaluateSlopPlaceholder,
  evaluateSlopAiDefault
} from "../apps/studio/rules-engine.js";

test("rules engine defines exactly 9 Krug rules", () => {
  assert.equal(KRUG_RULES.length, 9);
  const requiredIds = ['KRUG-CLARITY-001', 'KRUG-CTA-001', 'KRUG-SCAN-001', 'KRUG-HIER-001', 'KRUG-CLICK-001', 'KRUG-NAV-001', 'KRUG-LOCATION-001', 'KRUG-RECOVERY-001', 'KRUG-MOBILE-001'];
  for (const id of requiredIds) {
    assert.ok(KRUG_RULES.find((r) => r.id === id), `Missing Krug rule: ${id}`);
  }
});

test("rules engine defines required anti-slop rules", () => {
  const requiredIds = ['SLOP-CLAIM-001', 'SLOP-HERO-001', 'SLOP-CARD-001', 'SLOP-BENTO-001', 'SLOP-METRIC-001', 'SLOP-ICON-001', 'SLOP-MOTION-001', 'SLOP-COPY-001', 'SLOP-PLACEHOLDER-001', 'SLOP-AI-DEFAULT-001'];
  for (const id of requiredIds) {
    assert.ok(SLOP_RULES.find((r) => r.id === id), `Missing slop rule: ${id}`);
  }
});

test("rules engine defines 12 anti-slop categories", () => {
  assert.equal(SLOP_CATEGORIES.length, 12);
});

test("rule statuses include PASS, WARN, BLOCK, NOT_APPLICABLE", () => {
  assert.deepEqual(RULE_STATUSES, ['PASS', 'WARN', 'BLOCK', 'NOT_APPLICABLE']);
});

test("createRuleResult requires evidence for non-NOT_APPLICABLE results", () => {
  const rule = KRUG_RULES[0];
  assert.throws(() => createRuleResult(rule, 'PASS', {}), /requires evidence/);
});

test("createRuleResult does not require evidence for NOT_APPLICABLE", () => {
  const rule = KRUG_RULES[0];
  const result = createRuleResult(rule, 'NOT_APPLICABLE', {});
  assert.equal(result.status, 'NOT_APPLICABLE');
});

test("createRuleResult rejects invalid status", () => {
  const rule = KRUG_RULES[0];
  assert.throws(() => createRuleResult(rule, 'INVALID', { primary_heading: 'test' }), /Invalid rule status/);
});

test("createRuleResult produces all required fields", () => {
  const rule = KRUG_RULES[0];
  const result = createRuleResult(rule, 'PASS', { primary_heading: 'Welcome', primary_action: 'Start' });
  assert.equal(result.rule_id, rule.id);
  assert.equal(result.rule_version, rule.version);
  assert.equal(result.status, 'PASS');
  assert.equal(result.severity, rule.severity);
  assert.ok(result.evidence);
  assert.ok(result.confidence !== undefined);
  assert.ok(result.score_impact !== undefined);
  assert.ok(result.reviewer);
  assert.ok(result.evaluated_at);
});

test("KRUG-CLARITY-001 blocks when no heading", () => {
  const result = evaluateKrugClarity({ primary_heading: '', primary_action: 'Start' });
  assert.equal(result.status, 'BLOCK');
  assert.equal(result.severity, 'P1');
});

test("KRUG-CLARITY-001 warns when no action", () => {
  const result = evaluateKrugClarity({ primary_heading: 'Welcome', primary_action: '' });
  assert.equal(result.status, 'WARN');
});

test("KRUG-CLARITY-001 passes with clear heading and action", () => {
  const result = evaluateKrugClarity({ primary_heading: 'Build your brand', primary_action: 'Start project' });
  assert.equal(result.status, 'PASS');
});

test("KRUG-CTA-001 blocks when no primary action", () => {
  const result = evaluateKrugCTA({ interactive_inventory: [{ id: 'btn1', is_primary: false, clickable: true, visually_obvious: true }] });
  assert.equal(result.status, 'BLOCK');
});

test("KRUG-CTA-001 warns when multiple primary actions", () => {
  const result = evaluateKrugCTA({ interactive_inventory: [
    { id: 'btn1', is_primary: true, clickable: true, visually_obvious: true },
    { id: 'btn2', is_primary: true, clickable: true, visually_obvious: true }
  ]});
  assert.equal(result.status, 'WARN');
});

test("KRUG-CLICK-001 blocks when interactive elements not obvious", () => {
  const result = evaluateKrugClick({ interactive_inventory: [{ id: 'btn1', clickable: true, visually_obvious: false }] });
  assert.equal(result.status, 'BLOCK');
});

test("KRUG-LOCATION-001 blocks when current location not visible", () => {
  const result = evaluateKrugLocation({ active_nav_state: { current_location_visible: false } });
  assert.equal(result.status, 'BLOCK');
});

test("KRUG-RECOVERY-001 blocks on dead ends", () => {
  const result = evaluateKrugRecovery({ exit_paths: [{ id: 'flow1', has_exit: false }] });
  assert.equal(result.status, 'BLOCK');
});

test("SLOP-CLAIM-001 blocks on unverified claims", () => {
  const result = evaluateSlopClaim({ claims_ledger: [{ id: 'c1', claim: '99% satisfaction', verified: false }] });
  assert.equal(result.status, 'BLOCK');
  assert.equal(result.severity, 'P0');
});

test("SLOP-CLAIM-001 passes on verified claims", () => {
  const result = evaluateSlopClaim({ claims_ledger: [{ id: 'c1', claim: '99% satisfaction', verified: true }] });
  assert.equal(result.status, 'PASS');
});

test("SLOP-ICON-001 blocks on emoji icons", () => {
  const result = evaluateSlopIcon({ icon_inventory: [{ id: 'i1', family: 'emoji', is_emoji: true }] });
  assert.equal(result.status, 'BLOCK');
});

test("SLOP-ICON-001 warns on mixed icon families", () => {
  const result = evaluateSlopIcon({ icon_inventory: [
    { id: 'i1', family: 'Phosphor', is_emoji: false },
    { id: 'i2', family: 'Tabler', is_emoji: false }
  ]});
  assert.equal(result.status, 'WARN');
});

test("SLOP-COPY-001 detects generic AI copy patterns", () => {
  const result = evaluateSlopCopy({ copy_analysis: [{ id: 'c1', text: 'Transform your business today' }] });
  assert.equal(result.status, 'WARN');
});

test("SLOP-COPY-001 passes on specific copy", () => {
  const result = evaluateSlopCopy({ copy_analysis: [{ id: 'c1', text: 'Mexico City creative studio for purpose-led organizations' }] });
  assert.equal(result.status, 'PASS');
});

test("SLOP-PLACEHOLDER-001 blocks on placeholder as real", () => {
  const result = evaluateSlopPlaceholder({ data_audit: { has_placeholder_as_real: true, has_lorem_ipsum: false, has_fake_testimonials: false } });
  assert.equal(result.status, 'BLOCK');
  assert.equal(result.severity, 'P0');
});

test("SLOP-AI-DEFAULT-001 warns on generic gradient blobs without rationale", () => {
  const result = evaluateSlopAiDefault({ design_rationale: { has_generic_gradient_blobs: true, business_rationale: false } });
  assert.equal(result.status, 'WARN');
});

test("SLOP-AI-DEFAULT-001 passes with business rationale", () => {
  const result = evaluateSlopAiDefault({ design_rationale: { has_generic_gradient_blobs: true, business_rationale: true } });
  assert.equal(result.status, 'PASS');
});

test("evaluateAllKrug returns 9 results", () => {
  const results = evaluateAllKrug({});
  assert.equal(results.length, 9);
  for (const result of results) {
    assert.equal(result.status, 'NOT_APPLICABLE');
  }
});

test("evaluateAllSlop returns 10 results", () => {
  const results = evaluateAllSlop({});
  assert.equal(results.length, 10);
});

test("evaluateAll returns 19 results", () => {
  const results = evaluateAll({});
  assert.equal(results.length, 19);
});

test("summarizeResults counts P0 blocks correctly", () => {
  const results = [
    createRuleResult(SLOP_RULES[0], 'BLOCK', { claims_ledger: [] }, { score_impact: -3 }),
    createRuleResult(KRUG_RULES[0], 'PASS', { primary_heading: 'x', primary_action: 'y' })
  ];
  const summary = summarizeResults(results);
  assert.equal(summary.p0, 1);
  assert.equal(summary.gate, 'BLOCK');
  assert.equal(summary.has_p0, true);
});

test("summarizeResults passes when no P0 or P1 blocks", () => {
  const results = [
    createRuleResult(KRUG_RULES[0], 'PASS', { primary_heading: 'x', primary_action: 'y' }),
    createRuleResult(SLOP_RULES[1], 'WARN', { hero_content: {} })
  ];
  const summary = summarizeResults(results);
  assert.equal(summary.gate, 'PASS');
  assert.equal(summary.has_p0, false);
});

test("applyWaiver requires reason and approved_by", () => {
  const result = createRuleResult(KRUG_RULES[0], 'BLOCK', { primary_heading: '', primary_action: '' });
  assert.throws(() => applyWaiver(result, {}), /requires reason/);
});

test("applyWaiver prohibits agent self-waiver", () => {
  const result = createRuleResult(KRUG_RULES[0], 'BLOCK', { primary_heading: '', primary_action: '' });
  assert.throws(() => applyWaiver(result, { reason: 'test', approved_by: 'agent' }), /Agent self-waiver is prohibited/);
});

test("applyWaiver changes status to PASS with valid waiver", () => {
  const result = createRuleResult(KRUG_RULES[0], 'BLOCK', { primary_heading: '', primary_action: '' });
  const waived = applyWaiver(result, { reason: 'Legacy page, approved exception', approved_by: 'Bambu' });
  assert.equal(waived.status, 'PASS');
  assert.equal(waived.waiver.approved_by, 'Bambu');
});

test("applyScoreCap caps at 6.5 for SLOP-CLAIM-001 block", () => {
  const results = [
    evaluateSlopClaim({ claims_ledger: [{ id: 'c1', verified: false }] })
  ];
  const cap = applyScoreCap(results);
  assert.equal(cap, 6.5);
});

test("applyScoreCap caps at 7.0 for SLOP-AI-DEFAULT-001 warning", () => {
  const results = [
    evaluateSlopAiDefault({ design_rationale: { has_generic_gradient_blobs: true, business_rationale: false } })
  ];
  const cap = applyScoreCap(results);
  assert.equal(cap, 7.0);
});

test("applyScoreCap returns 10.0 when all pass", () => {
  const results = [
    evaluateSlopClaim({ claims_ledger: [{ id: 'c1', verified: true }] })
  ];
  const cap = applyScoreCap(results);
  assert.equal(cap, 10.0);
});

test("deterministic: same input produces same output", () => {
  const surface = { primary_heading: 'Test', primary_action: 'Go' };
  const r1 = evaluateKrugClarity(surface);
  const r2 = evaluateKrugClarity(surface);
  assert.equal(r1.status, r2.status);
  assert.equal(r1.rule_id, r2.rule_id);
  assert.deepEqual(r1.evidence, r2.evidence);
});

test("evaluateRule throws on unknown rule id", () => {
  assert.throws(() => evaluateRule('UNKNOWN-001', {}), /Unknown rule/);
});

test("full surface evaluation produces gate PASS for compliant surface", () => {
  const surface = {
    primary_heading: 'Build your brand',
    primary_action: 'Start project',
    interactive_inventory: [{ id: 'btn1', is_primary: true, clickable: true, visually_obvious: true }],
    semantic_structure: [{ tag: 'h1', text: 'Build your brand' }, { tag: 'h2', text: 'Strategy' }],
    content_priority: [{ id: 'c1', visual_weight: 10, information_priority: 10 }],
    route_map: [{ id: 'nav1', label: 'Home' }],
    active_nav_state: { current_location_visible: true },
    exit_paths: [{ id: 'flow1', has_exit: true }],
    mobile_viewport: { removes_essential_context: false, touch_targets_below_min: false },
    claims_ledger: [{ id: 'c1', verified: true }],
    hero_content: { has_logo_strip: false, has_feature_cards: false, has_testimonials: false, brand_specific_rationale: true },
    component_inventory: [{ id: 'card1', nested_depth: 0 }],
    layout_rationale: { is_bento: false },
    metric_sources: [{ id: 'm1', source: 'survey-2024' }],
    icon_inventory: [{ id: 'i1', family: 'Phosphor', is_emoji: false }],
    motion_inventory: [{ id: 'm1', purpose: 'feedback', type: 'fade', applied_to: 'single' }],
    copy_analysis: [{ id: 'c1', text: 'Mexico City creative studio' }],
    data_audit: { has_placeholder_as_real: false, has_lorem_ipsum: false, has_fake_testimonials: false },
    design_rationale: { has_generic_gradient_blobs: false, business_rationale: true }
  };
  const results = evaluateAll(surface);
  const summary = summarizeResults(results);
  assert.equal(summary.gate, 'PASS');
  assert.equal(summary.has_p0, false);
});
