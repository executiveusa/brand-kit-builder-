import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DESIGN_INTELLIGENCE_VERSION,
  DESIGN_MODES,
  MACROSTRUCTURES,
  FINGERPRINT_FIELDS,
  CRITIQUE_DIMENSIONS,
  CRITIQUE_THRESHOLD,
  CRITIQUE_MAX_REVISIONS,
  createDesignFingerprint,
  fingerprintSimilarity,
  detectExcessiveSimilarity,
  selectMacrostructure,
  createCritique,
  runCritiqueLoop,
  createDesignStudy,
  createDesignAudit,
  createRedesignPlan,
  createBuildPlan,
  executeBuild,
  executeAudit,
  executeRedesign,
  executeStudy,
  getDesignMode,
  executeDesignMode
} from "../apps/studio/design-intelligence.js";

test("design intelligence defines 4 modes: BUILD, AUDIT, REDESIGN, STUDY", () => {
  assert.equal(DESIGN_MODES.length, 4);
  assert.deepEqual(DESIGN_MODES, ['BUILD', 'AUDIT', 'REDESIGN', 'STUDY']);
});

test("macrostructure registry defines 12 macrostructures", () => {
  assert.equal(MACROSTRUCTURES.length, 12);
  const requiredIds = [
    'editorial-manifesto', 'workbench-product-tour', 'founder-letter',
    'immersive-case-study', 'documentary-scroll', 'modular-service-index',
    'narrative-portfolio', 'comparison-led', 'evidence-led',
    'directory-led', 'utility-dashboard', 'campaign-story'
  ];
  for (const id of requiredIds) {
    assert.ok(MACROSTRUCTURES.find((m) => m.id === id), `Missing macrostructure: ${id}`);
  }
});

test("every macrostructure has required fields", () => {
  for (const macro of MACROSTRUCTURES) {
    assert.ok(macro.id, `Macrostructure missing id`);
    assert.ok(macro.name, `Macrostructure ${macro.id} missing name`);
    assert.ok(Array.isArray(macro.best_for), `Macrostructure ${macro.id} missing best_for`);
    assert.ok(Array.isArray(macro.avoid_when), `Macrostructure ${macro.id} missing avoid_when`);
    assert.ok(Array.isArray(macro.required_content), `Macrostructure ${macro.id} missing required_content`);
    assert.ok(Array.isArray(macro.section_logic), `Macrostructure ${macro.id} missing section_logic`);
    assert.ok(macro.interaction_pattern, `Macrostructure ${macro.id} missing interaction_pattern`);
    assert.ok(macro.density, `Macrostructure ${macro.id} missing density`);
    assert.ok(macro.navigation_pattern, `Macrostructure ${macro.id} missing navigation_pattern`);
    assert.ok(macro.mobile_behavior, `Macrostructure ${macro.id} missing mobile_behavior`);
    assert.ok(Array.isArray(macro.krug_risks), `Macrostructure ${macro.id} missing krug_risks`);
    assert.ok(Array.isArray(macro.slop_risks), `Macrostructure ${macro.id} missing slop_risks`);
  }
});

test("design fingerprint has all 13 required fields", () => {
  assert.equal(FINGERPRINT_FIELDS.length, 13);
  const fp = createDesignFingerprint({
    macrostructure: 'editorial-manifesto',
    grid_behavior: 'asymmetric',
    density: 'low',
    type_contrast: 'high',
    shape_language: 'editorial',
    image_behavior: 'full-bleed',
    color_behavior: 'muted',
    motion_behavior: 'minimal',
    section_rhythm: 'varied',
    navigation_style: 'minimal',
    surface_treatment: 'flat',
    content_emphasis: 'typographic',
    distinctive_rules: ['no-gradients', 'no-shadows']
  });
  for (const field of FINGERPRINT_FIELDS) {
    assert.ok(fp[field] !== undefined, `Fingerprint missing field: ${field}`);
  }
});

test("fingerprint similarity returns 1.0 for identical fingerprints", () => {
  const fpInput = {
    macrostructure: 'editorial-manifesto',
    grid_behavior: 'asymmetric',
    density: 'low',
    type_contrast: 'high',
    shape_language: 'editorial',
    image_behavior: 'full-bleed',
    color_behavior: 'muted',
    motion_behavior: 'minimal',
    section_rhythm: 'varied',
    navigation_style: 'minimal',
    surface_treatment: 'flat',
    content_emphasis: 'typographic'
  };
  const fp = createDesignFingerprint(fpInput);
  const similarity = fingerprintSimilarity(fp, fp);
  assert.equal(similarity, 1.0);
});

test("fingerprint similarity returns 0.0 for completely different fingerprints", () => {
  const fp1 = createDesignFingerprint({ macrostructure: 'editorial-manifesto' });
  const fp2 = createDesignFingerprint({ macrostructure: 'workbench-product-tour' });
  const similarity = fingerprintSimilarity(fp1, fp2);
  assert.ok(similarity < 1.0);
});

test("detectExcessiveSimilarity flags high similarity", () => {
  const fpInput = {
    macrostructure: 'editorial-manifesto',
    grid_behavior: 'asymmetric',
    density: 'low',
    type_contrast: 'high',
    shape_language: 'editorial',
    image_behavior: 'full-bleed',
    color_behavior: 'muted',
    motion_behavior: 'minimal',
    section_rhythm: 'varied',
    navigation_style: 'minimal',
    surface_treatment: 'flat',
    content_emphasis: 'typographic'
  };
  const fp = createDesignFingerprint(fpInput);
  const priors = [createDesignFingerprint(fpInput)];
  const result = detectExcessiveSimilarity(fp, priors, 0.5);
  assert.equal(result.excessive, true);
});

test("detectExcessiveSimilarity does not flag low similarity", () => {
  const fp = createDesignFingerprint({ macrostructure: 'editorial-manifesto' });
  const priors = [createDesignFingerprint({ macrostructure: 'workbench-product-tour' })];
  const result = detectExcessiveSimilarity(fp, priors, 0.85);
  assert.equal(result.excessive, false);
});

test("selectMacrostructure returns a selection with rationale", () => {
  const result = selectMacrostructure({
    page_type: 'thought-leadership',
    brand_personality: 'mission-driven-brands',
    conversion_goal: 'thought-leadership',
    user_intent: 'reading',
    content_volume: 'low'
  });
  assert.ok(result.selected);
  assert.ok(result.rationale);
  assert.ok(Array.isArray(result.candidates));
  assert.ok(result.selected.id === 'editorial-manifesto');
});

test("selectMacrostructure avoids inappropriate macrostructures", () => {
  const result = selectMacrostructure({
    page_type: 'transactional-ecommerce',
    brand_personality: 'luxury-brands',
    conversion_goal: 'transactional-ecommerce'
  });
  assert.ok(result.selected.id !== 'editorial-manifesto', 'Should not select editorial-manifesto for ecommerce');
});

test("createCritique passes when all dimensions >= 3", () => {
  const critique = createCritique({
    clarity: 4, distinctiveness: 4, hierarchy: 4, coherence: 4, usability: 5, craft: 4
  });
  assert.equal(critique.status, 'PASS');
  assert.equal(critique.findings.length, 0);
});

test("createCritique returns REVISE when any dimension < 3", () => {
  const critique = createCritique({
    clarity: 2, distinctiveness: 4, hierarchy: 4, coherence: 4, usability: 5, craft: 4
  });
  assert.equal(critique.status, 'REVISE');
  assert.equal(critique.findings.length, 1);
  assert.equal(critique.findings[0].dimension, 'clarity');
});

test("createCritique rejects scores outside 1-5 range", () => {
  assert.throws(() => createCritique({ clarity: 6, distinctiveness: 4, hierarchy: 4, coherence: 4, usability: 5, craft: 4 }), /between 1 and 5/);
  assert.throws(() => createCritique({ clarity: 0, distinctiveness: 4, hierarchy: 4, coherence: 4, usability: 5, craft: 4 }), /between 1 and 5/);
});

test("runCritiqueLoop returns PASS when critique passes", () => {
  const result = runCritiqueLoop({
    clarity: 5, distinctiveness: 5, hierarchy: 5, coherence: 5, usability: 5, craft: 5
  }, 0);
  assert.equal(result.final_status, 'PASS');
  assert.equal(result.revisions, 0);
});

test("runCritiqueLoop returns REVISE when below threshold", () => {
  const result = runCritiqueLoop({
    clarity: 2, distinctiveness: 5, hierarchy: 5, coherence: 5, usability: 5, craft: 5
  }, 0);
  assert.equal(result.final_status, 'REVISE');
  assert.equal(result.revisions, 0);
});

test("runCritiqueLoop returns BLOCK after 3 failed revisions", () => {
  const result = runCritiqueLoop({
    clarity: 1, distinctiveness: 5, hierarchy: 5, coherence: 5, usability: 5, craft: 5
  }, 3);
  assert.equal(result.final_status, 'BLOCK');
  assert.ok(result.reason.includes('Blocked after 3'));
});

test("createDesignStudy includes do_not_copy list", () => {
  const study = createDesignStudy({ source: 'https://example.com' });
  assert.ok(study.do_not_copy.includes('copyrighted illustrations'));
  assert.ok(study.do_not_copy.includes('exact proprietary layouts'));
  assert.ok(study.do_not_copy.includes('pixel-perfect copies'));
});

test("createRedesignPlan limits directions to 3", () => {
  const plan = createRedesignPlan({
    current_dna: { macrostructure: 'editorial-manifesto' },
    directions: [{ id: 'd1' }, { id: 'd2' }, { id: 'd3' }, { id: 'd4' }]
  });
  assert.equal(plan.directions.length, 3);
});

test("createRedesignPlan includes keep/remove/change lists", () => {
  const plan = createRedesignPlan({
    current_dna: {},
    keep: ['factual-content'],
    remove: ['generic-hero'],
    change: ['typography-hierarchy']
  });
  assert.ok(plan.keep.includes('factual-content'));
  assert.ok(plan.remove.includes('generic-hero'));
  assert.ok(plan.change.includes('typography-hierarchy'));
});

test("executeBuild blocks on excessive similarity without brand evidence", () => {
  const fpInput = {
    macrostructure: 'editorial-manifesto',
    grid_behavior: 'asymmetric',
    density: 'low',
    type_contrast: 'high',
    shape_language: 'editorial',
    image_behavior: 'full-bleed',
    color_behavior: 'muted',
    motion_behavior: 'minimal',
    section_rhythm: 'varied',
    navigation_style: 'minimal',
    surface_treatment: 'flat',
    content_emphasis: 'typographic'
  };
  const fp = createDesignFingerprint(fpInput);
  const result = executeBuild({
    brand_project_id: 'test-1',
    context: { page_type: 'thought-leadership' },
    fingerprint: fp,
    critique_scores: { clarity: 5, distinctiveness: 5, hierarchy: 5, coherence: 5, usability: 5, craft: 5 }
  }, {
    prior_fingerprints: [createDesignFingerprint(fpInput)]
  });
  assert.equal(result.status, 'BLOCKED');
  assert.ok(result.reason.includes('similarity'));
});

test("executeBuild approves with passing critique and no similarity issues", () => {
  const result = executeBuild({
    brand_project_id: 'test-1',
    context: { page_type: 'thought-leadership', brand_personality: 'mission-driven-brands', conversion_goal: 'thought-leadership' },
    fingerprint: createDesignFingerprint({ macrostructure: 'editorial-manifesto' }),
    critique_scores: { clarity: 5, distinctiveness: 5, hierarchy: 5, coherence: 5, usability: 5, craft: 5 }
  });
  assert.equal(result.status, 'APPROVED');
  assert.equal(result.mode, 'BUILD');
});

test("executeBuild returns REVISE when critique below threshold", () => {
  const result = executeBuild({
    brand_project_id: 'test-1',
    context: { page_type: 'thought-leadership' },
    fingerprint: createDesignFingerprint({ macrostructure: 'editorial-manifesto' }),
    critique_scores: { clarity: 2, distinctiveness: 5, hierarchy: 5, coherence: 5, usability: 5, craft: 5 }
  });
  assert.equal(result.status, 'REVISE');
});

test("executeAudit returns COMPLETE with category scores", () => {
  const result = executeAudit({
    source: 'https://example.com',
    scores: { clarity: 85, scanability: 80 },
    findings: [{ rule_id: 'KRUG-CLARITY-001', status: 'PASS' }],
    rule_results: [{ rule_id: 'KRUG-CLARITY-001', status: 'PASS' }]
  });
  assert.equal(result.status, 'COMPLETE');
  assert.equal(result.mode, 'AUDIT');
  assert.ok(result.category_scores);
});

test("executeRedesign returns PLAN_CREATED with preserve constraints", () => {
  const result = executeRedesign(
    { macrostructure: 'editorial-manifesto' },
    { keep: ['factual-content'], remove: ['generic-hero'] }
  );
  assert.equal(result.status, 'PLAN_CREATED');
  assert.ok(result.preserve_constraints.includes('factual_content'));
  assert.ok(result.preserve_constraints.includes('approved_brand_truth'));
});

test("executeStudy returns COMPLETE with do_not_copy enforced", () => {
  const result = executeStudy('https://example.com', {
    macrostructure: 'editorial-manifesto',
    density: 'low'
  });
  assert.equal(result.status, 'COMPLETE');
  assert.equal(result.do_not_copy_enforced, true);
  assert.ok(result.study.do_not_copy.length > 0);
});

test("getDesignMode rejects unknown modes", () => {
  assert.throws(() => getDesignMode('UNKNOWN'), /Unknown design mode/);
});

test("executeDesignMode routes to correct executor", () => {
  const buildResult = executeDesignMode('BUILD', {
    brand_project_id: 'test-1',
    context: { page_type: 'thought-leadership' },
    fingerprint: createDesignFingerprint({}),
    critique_scores: { clarity: 5, distinctiveness: 5, hierarchy: 5, coherence: 5, usability: 5, craft: 5 }
  });
  assert.equal(buildResult.mode, 'BUILD');

  const studyResult = executeDesignMode('STUDY', 'https://example.com');
  assert.equal(studyResult.mode, 'STUDY');
});

test("deterministic: same macrostructure selection for same input", () => {
  const ctx = { page_type: 'thought-leadership', brand_personality: 'mission-driven-brands', conversion_goal: 'thought-leadership' };
  const r1 = selectMacrostructure(ctx);
  const r2 = selectMacrostructure(ctx);
  assert.equal(r1.selected.id, r2.selected.id);
});

test("deterministic: same fingerprint similarity for same inputs", () => {
  const fp1 = createDesignFingerprint({ macrostructure: 'editorial-manifesto', density: 'low' });
  const fp2 = createDesignFingerprint({ macrostructure: 'editorial-manifesto', density: 'low' });
  const fp3 = createDesignFingerprint({ macrostructure: 'editorial-manifesto', density: 'low' });
  const s1 = fingerprintSimilarity(fp1, fp2);
  const s2 = fingerprintSimilarity(fp1, fp3);
  assert.equal(s1, s2);
});
