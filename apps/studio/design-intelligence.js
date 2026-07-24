export const DESIGN_INTELLIGENCE_VERSION = '1.0.0';

export const DESIGN_MODES = ['BUILD', 'AUDIT', 'REDESIGN', 'STUDY'];

export const MACROSTRUCTURES = [
  {
    id: 'editorial-manifesto',
    name: 'Editorial Manifesto',
    best_for: ['thought-leadership', 'mission-driven-brands', 'founder-led-stories'],
    avoid_when: ['transactional-ecommerce', 'high-sku-catalogs', 'utility-tools'],
    required_content: ['manifesto', 'point-of-view', 'evidence'],
    section_logic: ['hero-statement', 'manifesto-body', 'evidence-anchors', 'call-to-action'],
    interaction_pattern: 'narrative-scroll',
    density: 'low',
    navigation_pattern: 'minimal-anchor',
    mobile_behavior: 'single-column-scroll',
    krug_risks: ['KRUG-CTA-001', 'KRUG-NAV-001'],
    slop_risks: ['SLOP-COPY-001', 'SLOP-HERO-001']
  },
  {
    id: 'workbench-product-tour',
    name: 'Workbench Product Tour',
    best_for: ['saas-products', 'developer-tools', 'feature-rich-apps'],
    avoid_when: ['luxury-brands', 'single-product-stories', 'content-publications'],
    required_content: ['product-screenshots', 'feature-walkthrough', 'use-cases'],
    section_logic: ['hero-demo', 'feature-tour', 'use-cases', 'pricing', 'footer'],
    interaction_pattern: 'guided-tour',
    density: 'medium',
    navigation_pattern: 'sticky-tabbed',
    mobile_behavior: 'accordion-tour',
    krug_risks: ['KRUG-CLARITY-001', 'KRUG-MOBILE-001'],
    slop_risks: ['SLOP-CARD-001', 'SLOP-ICON-001']
  },
  {
    id: 'founder-letter',
    name: 'Founder Letter',
    best_for: ['personal-brands', 'small-studios', 'consultancy'],
    avoid_when: ['enterprise-b2b', 'marketplaces', 'government'],
    required_content: ['founder-photo', 'personal-story', 'invitation'],
    section_logic: ['portrait', 'letter-body', 'proof', 'invitation'],
    interaction_pattern: 'reading-flow',
    density: 'low',
    navigation_pattern: 'none',
    mobile_behavior: 'single-column',
    krug_risks: ['KRUG-CTA-001'],
    slop_risks: ['SLOP-STOCK-001']
  },
  {
    id: 'immersive-case-study',
    name: 'Immersive Case Study',
    best_for: ['agencies', 'professional-services', 'portfolio-sites'],
    avoid_when: ['self-serve-saas', 'news-sites', 'directories'],
    required_content: ['client-context', 'challenge', 'approach', 'outcome', 'evidence'],
    section_logic: ['context', 'challenge', 'approach', 'outcome', 'metrics', 'next'],
    interaction_pattern: 'documentary-scroll',
    density: 'medium',
    navigation_pattern: 'chapter-markers',
    mobile_behavior: 'stacked-chapters',
    krug_risks: ['KRUG-HIER-001', 'KRUG-SCAN-001'],
    slop_risks: ['SLOP-METRIC-001', 'SLOP-CLAIM-001']
  },
  {
    id: 'documentary-scroll',
    name: 'Documentary Scroll',
    best_for: ['nonprofits', 'impact-organizations', 'journalism'],
    avoid_when: ['dashboards', 'utility-tools', 'transactional-flows'],
    required_content: ['narrative-arc', 'visual-evidence', 'call-to-action'],
    section_logic: ['opening', 'context', 'evidence', 'turn', 'resolution', 'action'],
    interaction_pattern: 'scroll-driven-narrative',
    density: 'low',
    navigation_pattern: 'progress-indicator',
    mobile_behavior: 'continuous-scroll',
    krug_risks: ['KRUG-CTA-001', 'KRUG-MOBILE-001'],
    slop_risks: ['SLOP-MOTION-001']
  },
  {
    id: 'modular-service-index',
    name: 'Modular Service Index',
    best_for: ['consultancies', 'professional-services', 'multi-service-brands'],
    avoid_when: ['single-product-saas', 'personal-brands', 'editorial-sites'],
    required_content: ['service-list', 'descriptions', 'case-links'],
    section_logic: ['services-overview', 'service-detail-grid', 'process', 'contact'],
    interaction_pattern: 'browse-and-drill',
    density: 'medium',
    navigation_pattern: 'anchor-nav',
    mobile_behavior: 'accordion',
    krug_risks: ['KRUG-CLICK-001', 'KRUG-NAV-001'],
    slop_risks: ['SLOP-CARD-001', 'SLOP-ICON-001']
  },
  {
    id: 'narrative-portfolio',
    name: 'Narrative Portfolio',
    best_for: ['designers', 'artists', 'creative-studios'],
    avoid_when: ['ecommerce', 'saas', 'government'],
    required_content: ['work-samples', 'project-stories', 'contact'],
    section_logic: ['selected-work', 'project-1', 'project-2', 'project-3', 'about', 'contact'],
    interaction_pattern: 'gallery-flow',
    density: 'low',
    navigation_pattern: 'minimal',
    mobile_behavior: 'stacked-gallery',
    krug_risks: ['KRUG-NAV-001'],
    slop_risks: ['SLOP-STOCK-001']
  },
  {
    id: 'comparison-led',
    name: 'Comparison-Led',
    best_for: ['evaluated-purchases', 'b2b-tools', 'alternative-products'],
    avoid_when: ['luxury-brands', 'content-sites', 'personal-brands'],
    required_content: ['comparison-table', 'feature-matrix', 'evidence'],
    section_logic: ['problem', 'comparison', 'proof', 'cta'],
    interaction_pattern: 'scan-compare',
    density: 'high',
    navigation_pattern: 'sticky-header',
    mobile_behavior: 'collapsible-table',
    krug_risks: ['KRUG-MOBILE-001', 'KRUG-SCAN-001'],
    slop_risks: ['SLOP-METRIC-001']
  },
  {
    id: 'evidence-led',
    name: 'Evidence-Led',
    best_for: ['data-products', 'research-firms', 'regulated-industries'],
    avoid_when: ['lifestyle-brands', 'entertainment', 'impulse-purchases'],
    required_content: ['data-visualizations', 'sources', 'methodology'],
    section_logic: ['claim', 'evidence', 'methodology', 'sources', 'conclusion'],
    interaction_pattern: 'evidence-review',
    density: 'medium',
    navigation_pattern: 'sectioned',
    mobile_behavior: 'stacked-evidence',
    krug_risks: ['KRUG-HIER-001'],
    slop_risks: ['SLOP-CLAIM-001', 'SLOP-METRIC-001']
  },
  {
    id: 'directory-led',
    name: 'Directory-Led',
    best_for: ['resources', 'communities', 'marketplaces'],
    avoid_when: ['single-product-sites', 'narrative-brands', 'portfolio-sites'],
    required_content: ['directory-list', 'filters', 'detail-views'],
    section_logic: ['search', 'directory', 'filters', 'detail'],
    interaction_pattern: 'search-browse',
    density: 'high',
    navigation_pattern: 'breadcrumb',
    mobile_behavior: 'list-view',
    krug_risks: ['KRUG-NAV-001', 'KRUG-RECOVERY-001'],
    slop_risks: ['SLOP-CARD-001']
  },
  {
    id: 'utility-dashboard',
    name: 'Utility Dashboard',
    best_for: ['internal-tools', 'analytics', 'admin-panels'],
    avoid_when: ['marketing-sites', 'landing-pages', 'public-portfolios'],
    required_content: ['data-views', 'controls', 'status-indicators'],
    section_logic: ['sidebar', 'main-view', 'controls', 'status'],
    interaction_pattern: 'dashboard-control',
    density: 'high',
    navigation_pattern: 'sidebar-nav',
    mobile_behavior: 'collapsible-panels',
    krug_risks: ['KRUG-LOCATION-001', 'KRUG-RECOVERY-001'],
    slop_risks: ['SLOP-BENTO-001']
  },
  {
    id: 'campaign-story',
    name: 'Campaign Story',
    best_for: ['seasonal-campaigns', 'product-launches', 'limited-offers'],
    avoid_when: ['evergreen-content', 'corporate-sites', 'documentation'],
    required_content: ['campaign-hook', 'narrative', 'offer', 'deadline'],
    section_logic: ['hook', 'story', 'offer', 'urgency', 'cta'],
    interaction_pattern: 'campaign-flow',
    density: 'medium',
    navigation_pattern: 'linear',
    mobile_behavior: 'stacked-story',
    krug_risks: ['KRUG-CTA-001'],
    slop_risks: ['SLOP-CLAIM-001', 'SLOP-MOTION-001']
  }
];

export const FINGERPRINT_FIELDS = [
  'macrostructure',
  'grid_behavior',
  'density',
  'type_contrast',
  'shape_language',
  'image_behavior',
  'color_behavior',
  'motion_behavior',
  'section_rhythm',
  'navigation_style',
  'surface_treatment',
  'content_emphasis',
  'distinctive_rules'
];

export const CRITIQUE_DIMENSIONS = [
  'clarity',
  'distinctiveness',
  'hierarchy',
  'coherence',
  'usability',
  'craft'
];

export const CRITIQUE_THRESHOLD = 3;
export const CRITIQUE_MAX_REVISIONS = 3;

export function createDesignFingerprint(input = {}) {
  const fingerprint = {};
  for (const field of FINGERPRINT_FIELDS) {
    if (field === 'distinctive_rules') {
      fingerprint[field] = Array.isArray(input[field]) ? input[field] : [];
    } else {
      fingerprint[field] = input[field] || 'unspecified';
    }
  }
  return {
    schema_version: '1.0',
    fingerprint_version: DESIGN_INTELLIGENCE_VERSION,
    ...fingerprint,
    created_at: new Date().toISOString()
  };
}

export function fingerprintSimilarity(fp1, fp2) {
  if (!fp1 || !fp2) return 0;
  let matches = 0;
  let total = 0;
  for (const field of FINGERPRINT_FIELDS) {
    if (field === 'distinctive_rules') continue;
    total++;
    if (fp1[field] && fp2[field] && fp1[field] === fp2[field] && fp1[field] !== 'unspecified') {
      matches++;
    }
  }
  return total > 0 ? matches / total : 0;
}

export function detectExcessiveSimilarity(proposedFingerprint, priorFingerprints = [], threshold = 0.85) {
  const similar = [];
  for (const prior of priorFingerprints) {
    const score = fingerprintSimilarity(proposedFingerprint, prior);
    if (score >= threshold) {
      similar.push({ fingerprint: prior, similarity: score });
    }
  }
  return {
    excessive: similar.length > 0,
    threshold,
    matches: similar,
    max_similarity: similar.length > 0 ? Math.max(...similar.map((s) => s.similarity)) : 0
  };
}

export function selectMacrostructure(context = {}) {
  const {
    business_goal,
    user_intent,
    content_volume,
    page_type,
    brand_personality,
    conversion_goal
  } = context;

  const scored = MACROSTRUCTURES.map((macro) => {
    let score = 0;
    if (macro.best_for.includes(page_type)) score += 3;
    if (macro.best_for.includes(brand_personality)) score += 2;
    if (macro.best_for.includes(conversion_goal)) score += 2;
    if (macro.best_for.includes(user_intent)) score += 1;
    if (content_volume === 'high' && macro.density === 'high') score += 1;
    if (content_volume === 'low' && macro.density === 'low') score += 1;
    if (macro.avoid_when.includes(page_type)) score -= 5;
    if (macro.avoid_when.includes(brand_personality)) score -= 3;
    return { macro, score };
  });
  scored.sort((a, b) => b.score - a.score);
  const top = scored[0];
  const candidates = scored.filter((s) => s.score >= top.score - 1).map((s) => s.macro);
  return {
    selected: top.macro,
    candidates,
    scores: scored.map((s) => ({ id: s.macro.id, score: s.score })),
    rationale: `Selected ${top.macro.name} with score ${top.score} based on page_type=${page_type}, brand_personality=${brand_personality}, conversion_goal=${conversion_goal}`
  };
}

export function createCritique(scores = {}) {
  const normalized = {};
  for (const dim of CRITIQUE_DIMENSIONS) {
    const score = Number(scores[dim]);
    if (!Number.isFinite(score) || score < 1 || score > 5) {
      throw new Error(`Critique dimension ${dim} must be between 1 and 5, received ${scores[dim]}`);
    }
    normalized[dim] = score;
  }
  const belowThreshold = CRITIQUE_DIMENSIONS.filter((dim) => normalized[dim] < CRITIQUE_THRESHOLD);
  const status = belowThreshold.length > 0 ? 'REVISE' : 'PASS';
  const findings = belowThreshold.map((dim) => ({
    dimension: dim,
    score: normalized[dim],
    required: CRITIQUE_THRESHOLD,
    remediation: `${dim} score ${normalized[dim]} is below threshold ${CRITIQUE_THRESHOLD}. Revise required.`
  }));
  return {
    schema_version: '1.0',
    scores: normalized,
    status,
    findings,
    evaluated_at: new Date().toISOString()
  };
}

export function runCritiqueLoop(scores, revisionCount = 0) {
  const critique = createCritique(scores);
  if (critique.status === 'PASS') {
    return { critique, final_status: 'PASS', revisions: revisionCount };
  }
  if (revisionCount >= CRITIQUE_MAX_REVISIONS) {
    return {
      critique,
      final_status: 'BLOCK',
      revisions: revisionCount,
      reason: `Blocked after ${CRITIQUE_MAX_REVISIONS} failed revisions. Dimensions below threshold: ${critique.findings.map((f) => f.dimension).join(', ')}`
    };
  }
  return {
    critique,
    final_status: 'REVISE',
    revisions: revisionCount,
    reason: `Revision ${revisionCount + 1} required. Dimensions below threshold: ${critique.findings.map((f) => f.dimension).join(', ')}`
  };
}

export function createDesignStudy(input = {}) {
  return {
    schema_version: '1.0',
    study_version: DESIGN_INTELLIGENCE_VERSION,
    source: input.source || null,
    source_type: input.source_type || 'url',
    macrostructure: input.macrostructure || 'unspecified',
    density: input.density || 'unspecified',
    typography_behavior: input.typography_behavior || 'unspecified',
    color_behavior: input.color_behavior || 'unspecified',
    layout_principles: Array.isArray(input.layout_principles) ? input.layout_principles : [],
    interaction_principles: Array.isArray(input.interaction_principles) ? input.interaction_principles : [],
    distinctive_traits: Array.isArray(input.distinctive_traits) ? input.distinctive_traits : [],
    do_not_copy: Array.isArray(input.do_not_copy) ? input.do_not_copy : [
      'copyrighted illustrations',
      'exact proprietary layouts',
      'paid templates',
      'unique branded assets',
      'pixel-perfect copies'
    ],
    studied_at: new Date().toISOString()
  };
}

export function createDesignAudit(input = {}) {
  return {
    schema_version: '1.0',
    audit_version: DESIGN_INTELLIGENCE_VERSION,
    source: input.source || null,
    scores: input.scores || {},
    findings: Array.isArray(input.findings) ? input.findings : [],
    rule_results: Array.isArray(input.rule_results) ? input.rule_results : [],
    audited_at: new Date().toISOString()
  };
}

export function createRedesignPlan(input = {}) {
  return {
    schema_version: '1.0',
    redesign_version: DESIGN_INTELLIGENCE_VERSION,
    current_dna: input.current_dna || null,
    keep: Array.isArray(input.keep) ? input.keep : [],
    remove: Array.isArray(input.remove) ? input.remove : [],
    change: Array.isArray(input.change) ? input.change : [],
    directions: Array.isArray(input.directions) ? input.directions.slice(0, 3) : [],
    selected_direction: input.selected_direction || null,
    planned_at: new Date().toISOString()
  };
}

export function createBuildPlan(input = {}) {
  return {
    schema_version: '1.0',
    build_version: DESIGN_INTELLIGENCE_VERSION,
    brief: input.brief || null,
    macrostructure_selection: input.macrostructure_selection || null,
    design_fingerprint: input.design_fingerprint || null,
    critique: input.critique || null,
    krug_results: Array.isArray(input.krug_results) ? input.krug_results : [],
    slop_results: Array.isArray(input.slop_results) ? input.slop_results : [],
    status: input.status || 'pending',
    planned_at: new Date().toISOString()
  };
}

export function executeBuild(brief, options = {}) {
  if (!brief || !brief.brand_project_id) {
    throw new Error('Build requires a brief with brand_project_id');
  }
  const macrostructureSelection = selectMacrostructure(brief.context || {});
  const fingerprint = createDesignFingerprint(brief.fingerprint || {});
  const similarity = detectExcessiveSimilarity(fingerprint, options.prior_fingerprints || []);
  if (similarity.excessive && !brief.brand_evidence_supports_variation) {
    return {
      mode: 'BUILD',
      status: 'BLOCKED',
      reason: `Excessive similarity (${(similarity.max_similarity * 100).toFixed(0)}%) to prior Studio outputs without brand evidence supporting variation.`,
      similarity,
      macrostructure_selection: macrostructureSelection,
      fingerprint
    };
  }
  const critiqueResult = runCritiqueLoop(brief.critique_scores || {}, 0);
  if (critiqueResult.final_status === 'BLOCK') {
    return {
      mode: 'BUILD',
      status: 'BLOCKED',
      reason: critiqueResult.reason,
      critique: critiqueResult.critique,
      macrostructure_selection: macrostructureSelection,
      fingerprint
    };
  }
  const plan = createBuildPlan({
    brief,
    macrostructure_selection: macrostructureSelection,
    design_fingerprint: fingerprint,
    critique: critiqueResult.critique,
    status: critiqueResult.final_status === 'PASS' ? 'approved' : 'revise'
  });
  return {
    mode: 'BUILD',
    status: critiqueResult.final_status === 'PASS' ? 'APPROVED' : 'REVISE',
    plan,
    macrostructure_selection: macrostructureSelection,
    fingerprint,
    critique: critiqueResult.critique,
    revisions: critiqueResult.revisions
  };
}

export function executeAudit(surface, options = {}) {
  const audit = createDesignAudit({
    source: options.source || surface?.source || null,
    scores: surface?.scores || {},
    findings: surface?.findings || [],
    rule_results: surface?.rule_results || []
  });
  const categoryScores = {};
  const categories = [
    'clarity', 'scanability', 'hierarchy', 'interaction_obviousness',
    'navigation', 'distinctiveness', 'design_system_consistency',
    'typography', 'color', 'spacing', 'responsive_quality',
    'accessibility', 'proof_integrity', 'anti_slop_compliance'
  ];
  for (const cat of categories) {
    categoryScores[cat] = surface?.scores?.[cat] ?? null;
  }
  return {
    mode: 'AUDIT',
    status: 'COMPLETE',
    audit,
    category_scores: categoryScores,
    rule_results: audit.rule_results
  };
}

export function executeRedesign(currentDna, options = {}) {
  if (!currentDna) {
    throw new Error('Redesign requires current design DNA');
  }
  const plan = createRedesignPlan({
    current_dna: currentDna,
    keep: options.keep || [],
    remove: options.remove || [],
    change: options.change || [],
    directions: options.directions || []
  });
  return {
    mode: 'REDESIGN',
    status: 'PLAN_CREATED',
    plan,
    preserve_constraints: [
      'factual_content',
      'approved_brand_truth',
      'claims',
      'urls',
      'essential_functionality',
      'seo_critical_information'
    ]
  };
}

export function executeStudy(source, extractedDna = {}) {
  if (!source) {
    throw new Error('Study requires a source (URL, screenshot, or reference)');
  }
  const study = createDesignStudy({
    source,
    source_type: source.startsWith('http') ? 'url' : 'screenshot',
    ...extractedDna
  });
  return {
    mode: 'STUDY',
    status: 'COMPLETE',
    study,
    do_not_copy_enforced: true
  };
}

export function getDesignMode(mode) {
  if (!DESIGN_MODES.includes(mode)) {
    throw new Error(`Unknown design mode: ${mode}. Must be one of ${DESIGN_MODES.join(', ')}`);
  }
  return mode;
}

export function executeDesignMode(mode, input, options = {}) {
  const normalizedMode = getDesignMode(mode);
  switch (normalizedMode) {
    case 'BUILD':
      return executeBuild(input, options);
    case 'AUDIT':
      return executeAudit(input, options);
    case 'REDESIGN':
      return executeRedesign(input, options);
    case 'STUDY':
      return executeStudy(input, options);
    default:
      throw new Error(`Unimplemented design mode: ${normalizedMode}`);
  }
}
