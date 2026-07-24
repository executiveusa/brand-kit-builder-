export const RULE_ENGINE_VERSION = '1.0.0';

export const RULE_STATUSES = ['PASS', 'WARN', 'BLOCK', 'NOT_APPLICABLE'];

export const KRUG_RULES = [
  {
    id: 'KRUG-CLARITY-001',
    version: '1.0.0',
    title: 'Purpose, audience, and next action are immediately understandable',
    severity: 'P1',
    category: 'clarity',
    evidence_required: ['primary_heading', 'primary_action'],
    description: 'A user must understand the page purpose within 5 seconds.'
  },
  {
    id: 'KRUG-CTA-001',
    version: '1.0.0',
    title: 'One dominant primary action exists for the current task context',
    severity: 'P1',
    category: 'clarity',
    evidence_required: ['interactive_inventory'],
    description: 'No competing primary actions. One obvious next step.'
  },
  {
    id: 'KRUG-SCAN-001',
    version: '1.0.0',
    title: 'Headings, labels, and grouping support scanning',
    severity: 'P2',
    category: 'scanability',
    evidence_required: ['semantic_structure'],
    description: 'Users scan rather than read. Headings must support quick comprehension.'
  },
  {
    id: 'KRUG-HIER-001',
    version: '1.0.0',
    title: 'Visual hierarchy matches real information priority',
    severity: 'P1',
    category: 'hierarchy',
    evidence_required: ['content_priority'],
    description: 'Visual weight must follow information importance.'
  },
  {
    id: 'KRUG-CLICK-001',
    version: '1.0.0',
    title: 'Interactive elements are recognizable without hover',
    severity: 'P1',
    category: 'interaction',
    evidence_required: ['interactive_inventory'],
    description: 'Clickability must be obvious. No hover-only discovery.'
  },
  {
    id: 'KRUG-NAV-001',
    version: '1.0.0',
    title: 'Navigation and current location are obvious',
    severity: 'P1',
    category: 'navigation',
    evidence_required: ['route_map'],
    description: 'Users must know where they are and how to navigate.'
  },
  {
    id: 'KRUG-LOCATION-001',
    version: '1.0.0',
    title: 'Current location is visibly indicated in navigation',
    severity: 'P1',
    category: 'navigation',
    evidence_required: ['active_nav_state'],
    description: 'Current page/section must be visually distinguished in nav.'
  },
  {
    id: 'KRUG-RECOVERY-001',
    version: '1.0.0',
    title: 'Users can exit modals, forms, and dead ends obviously',
    severity: 'P1',
    category: 'recovery',
    evidence_required: ['exit_paths'],
    description: 'Every flow must have an obvious way out.'
  },
  {
    id: 'KRUG-MOBILE-001',
    version: '1.0.0',
    title: 'Primary workflow remains comfortable and complete on mobile',
    severity: 'P1',
    category: 'responsive',
    evidence_required: ['mobile_viewport'],
    description: 'Mobile must not remove essential context or actions.'
  }
];

export const SLOP_CATEGORIES = [
  'STRUCTURE', 'COPY', 'VISUALS', 'COMPONENTS', 'PROOF',
  'INTERACTION', 'TYPOGRAPHY', 'COLOR', 'MOTION', 'RESPONSIVE',
  'ACCESSIBILITY', 'AI-DEFAULT-PATTERNS'
];

export const SLOP_RULES = [
  {
    id: 'SLOP-CLAIM-001',
    version: '1.0.0',
    title: 'No fabricated or unverified metrics, testimonials, awards, partners, or urgency',
    severity: 'P0',
    category: 'PROOF',
    evidence_required: ['claims_ledger'],
    description: 'Every public claim must have verified evidence. No invented metrics.',
    score_cap: 6.5
  },
  {
    id: 'SLOP-HERO-001',
    version: '1.0.0',
    title: 'Hero composition and copy must be brand-specific and task-specific',
    severity: 'P2',
    category: 'STRUCTURE',
    evidence_required: ['hero_content'],
    description: 'No generic hero → logo strip → 3 feature cards → testimonials → CTA without justification.'
  },
  {
    id: 'SLOP-CARD-001',
    version: '1.0.0',
    title: 'Avoid unnecessary nested, floating, and repetitive card shells',
    severity: 'P2',
    category: 'COMPONENTS',
    evidence_required: ['component_inventory'],
    description: 'No card-in-card-in-card. No decorative card shells.'
  },
  {
    id: 'SLOP-BENTO-001',
    version: '1.0.0',
    title: 'Bento layouts require information-architecture justification',
    severity: 'P2',
    category: 'STRUCTURE',
    evidence_required: ['layout_rationale'],
    description: 'No decorative bento grids without information-model reason.'
  },
  {
    id: 'SLOP-METRIC-001',
    version: '1.0.0',
    title: 'Metric cards require real evidence and decision value',
    severity: 'P1',
    category: 'PROOF',
    evidence_required: ['metric_sources'],
    description: 'No fake metric cards. Every number needs a source.'
  },
  {
    id: 'SLOP-ICON-001',
    version: '1.0.0',
    title: 'Avoid repetitive icon-card patterns and mixed icon families',
    severity: 'P2',
    category: 'COMPONENTS',
    evidence_required: ['icon_inventory'],
    description: 'One icon family. No emoji icons. No repetitive icon-card sections.'
  },
  {
    id: 'SLOP-MOTION-001',
    version: '1.0.0',
    title: 'Motion must support understanding, feedback, or narrative without blocking tasks',
    severity: 'P1',
    category: 'MOTION',
    evidence_required: ['motion_inventory'],
    description: 'No default fade-up/stagger on every element. No decorative motion.'
  },
  {
    id: 'SLOP-COPY-001',
    version: '1.0.0',
    title: 'Public copy must be specific enough that it cannot be swapped onto any competitor unchanged',
    severity: 'P2',
    category: 'COPY',
    evidence_required: ['copy_analysis'],
    description: 'No "Transform your business", "Unlock your potential", "Reimagine what\'s possible".'
  },
  {
    id: 'SLOP-PLACEHOLDER-001',
    version: '1.0.0',
    title: 'Placeholder or demo data may not be represented as real business state',
    severity: 'P0',
    category: 'PROOF',
    evidence_required: ['data_audit'],
    description: 'No Lorem ipsum, no fake testimonials, no placeholder metrics shown as real.',
    score_cap: 6.5
  },
  {
    id: 'SLOP-AI-DEFAULT-001',
    version: '1.0.0',
    title: 'Design choices need project rationale beyond model-generation convenience',
    severity: 'P2',
    category: 'AI-DEFAULT-PATTERNS',
    evidence_required: ['design_rationale'],
    description: 'No generic AI patterns: gradient blobs, glassmorphism, oversized type, all-caps labels.',
    score_cap: 7.0
  }
];

export const SCORE_CAPS = {
  SLOP_CLAIM_MAX: 6.5,
  SLOP_PLACEHOLDER_MAX: 6.5,
  SLOP_AI_DEFAULT_MAX: 7.0,
  RELEASE_FLOOR: 8.5
};

export function createRuleResult(rule, status, evidence, options = {}) {
  if (!RULE_STATUSES.includes(status)) {
    throw new Error(`Invalid rule status: ${status}. Must be one of ${RULE_STATUSES.join(', ')}`);
  }
  if (status !== 'NOT_APPLICABLE') {
    const provided = Object.keys(evidence || {});
    const missing = rule.evidence_required.filter((key) => !provided.includes(key));
    if (missing.length > 0) {
      throw new Error(`Rule ${rule.id} requires evidence: ${missing.join(', ')}`);
    }
  }
  return {
    rule_id: rule.id,
    rule_version: rule.version,
    status,
    severity: rule.severity,
    evidence: evidence || {},
    affected_surface: options.affected_surface || null,
    confidence: options.confidence ?? 1.0,
    remediation: options.remediation || null,
    score_impact: options.score_impact ?? 0,
    reviewer: options.reviewer || 'rules-engine',
    waiver: options.waiver || null,
    evaluated_at: new Date().toISOString()
  };
}

export function evaluateKrugClarity(surface) {
  const rule = KRUG_RULES.find((r) => r.id === 'KRUG-CLARITY-001');
  if (!surface || typeof surface !== 'object' || (surface.primary_heading === undefined && surface.primary_action === undefined)) {
    return createRuleResult(rule, 'NOT_APPLICABLE', {});
  }
  const heading = surface.primary_heading;
  const action = surface.primary_action;
  if (!heading || String(heading).trim().length < 3) {
    return createRuleResult(rule, 'BLOCK', { primary_heading: heading, primary_action: action }, {
      remediation: 'Add a clear primary heading that communicates the page purpose.',
      score_impact: -2.0
    });
  }
  if (!action || String(action).trim().length < 2) {
    return createRuleResult(rule, 'WARN', { primary_heading: heading, primary_action: action }, {
      remediation: 'Add a clear primary action (button or link).',
      score_impact: -1.0
    });
  }
  return createRuleResult(rule, 'PASS', { primary_heading: heading, primary_action: action });
}

export function evaluateKrugCTA(surface) {
  const rule = KRUG_RULES.find((r) => r.id === 'KRUG-CTA-001');
  if (!surface || !Array.isArray(surface.interactive_inventory)) {
    return createRuleResult(rule, 'NOT_APPLICABLE', {});
  }
  const primaryActions = surface.interactive_inventory.filter((item) => item.is_primary);
  if (primaryActions.length === 0) {
    return createRuleResult(rule, 'BLOCK', { interactive_inventory: surface.interactive_inventory }, {
      remediation: 'No primary action found. Add one dominant CTA.',
      score_impact: -2.0
    });
  }
  if (primaryActions.length > 1) {
    return createRuleResult(rule, 'WARN', { interactive_inventory: surface.interactive_inventory }, {
      remediation: `${primaryActions.length} competing primary actions. Reduce to one dominant CTA.`,
      score_impact: -1.0
    });
  }
  return createRuleResult(rule, 'PASS', { interactive_inventory: surface.interactive_inventory });
}

export function evaluateKrugScan(surface) {
  const rule = KRUG_RULES.find((r) => r.id === 'KRUG-SCAN-001');
  if (!surface || !Array.isArray(surface.semantic_structure)) {
    return createRuleResult(rule, 'NOT_APPLICABLE', {});
  }
  const headings = surface.semantic_structure.filter((el) => el.tag === 'h1' || el.tag === 'h2' || el.tag === 'h3');
  if (headings.length === 0) {
    return createRuleResult(rule, 'BLOCK', { semantic_structure: surface.semantic_structure }, {
      remediation: 'No heading structure found. Add semantic headings for scannability.',
      score_impact: -1.5
    });
  }
  const h1Count = surface.semantic_structure.filter((el) => el.tag === 'h1').length;
  if (h1Count !== 1) {
    return createRuleResult(rule, 'WARN', { semantic_structure: surface.semantic_structure }, {
      remediation: h1Count === 0 ? 'Add exactly one H1 heading.' : 'Multiple H1 headings found. Use only one.',
      score_impact: -0.5
    });
  }
  return createRuleResult(rule, 'PASS', { semantic_structure: surface.semantic_structure });
}

export function evaluateKrugHierarchy(surface) {
  const rule = KRUG_RULES.find((r) => r.id === 'KRUG-HIER-001');
  if (!surface || !Array.isArray(surface.content_priority)) {
    return createRuleResult(rule, 'NOT_APPLICABLE', {});
  }
  const sorted = [...surface.content_priority].sort((a, b) => (b.visual_weight || 0) - (a.visual_weight || 0));
  const prioritySorted = [...surface.content_priority].sort((a, b) => (b.information_priority || 0) - (a.information_priority || 0));
  const mismatched = sorted.filter((item, i) => item.id !== prioritySorted[i].id);
  if (mismatched.length > Math.ceil(sorted.length * 0.3)) {
    return createRuleResult(rule, 'WARN', { content_priority: surface.content_priority }, {
      remediation: 'Visual hierarchy does not match information priority. Reorder elements.',
      score_impact: -1.0
    });
  }
  return createRuleResult(rule, 'PASS', { content_priority: surface.content_priority });
}

export function evaluateKrugClick(surface) {
  const rule = KRUG_RULES.find((r) => r.id === 'KRUG-CLICK-001');
  if (!surface || !Array.isArray(surface.interactive_inventory)) {
    return createRuleResult(rule, 'NOT_APPLICABLE', {});
  }
  const notObvious = surface.interactive_inventory.filter((item) => item.clickable && !item.visually_obvious);
  if (notObvious.length > 0) {
    return createRuleResult(rule, 'BLOCK', { interactive_inventory: surface.interactive_inventory }, {
      remediation: `${notObvious.length} interactive elements are not visually obvious. Add button/link styling.`,
      affected_surface: notObvious.map((item) => item.id),
      score_impact: -2.0
    });
  }
  const falseClickable = surface.interactive_inventory.filter((item) => !item.clickable && item.looks_clickable);
  if (falseClickable.length > 0) {
    return createRuleResult(rule, 'WARN', { interactive_inventory: surface.interactive_inventory }, {
      remediation: `${falseClickable.length} non-interactive elements look clickable. Remove misleading styling.`,
      affected_surface: falseClickable.map((item) => item.id),
      score_impact: -0.5
    });
  }
  return createRuleResult(rule, 'PASS', { interactive_inventory: surface.interactive_inventory });
}

export function evaluateKrugNav(surface) {
  const rule = KRUG_RULES.find((r) => r.id === 'KRUG-NAV-001');
  if (!surface || !Array.isArray(surface.route_map)) {
    return createRuleResult(rule, 'NOT_APPLICABLE', {});
  }
  if (surface.route_map.length === 0) {
    return createRuleResult(rule, 'WARN', { route_map: surface.route_map }, {
      remediation: 'No navigation structure found.',
      score_impact: -0.5
    });
  }
  return createRuleResult(rule, 'PASS', { route_map: surface.route_map });
}

export function evaluateKrugLocation(surface) {
  const rule = KRUG_RULES.find((r) => r.id === 'KRUG-LOCATION-001');
  if (!surface || !surface.active_nav_state) {
    return createRuleResult(rule, 'NOT_APPLICABLE', {});
  }
  if (!surface.active_nav_state.current_location_visible) {
    return createRuleResult(rule, 'BLOCK', { active_nav_state: surface.active_nav_state }, {
      remediation: 'Current location is not visually indicated in navigation. Add active state.',
      score_impact: -1.5
    });
  }
  return createRuleResult(rule, 'PASS', { active_nav_state: surface.active_nav_state });
}

export function evaluateKrugRecovery(surface) {
  const rule = KRUG_RULES.find((r) => r.id === 'KRUG-RECOVERY-001');
  if (!surface || !Array.isArray(surface.exit_paths)) {
    return createRuleResult(rule, 'NOT_APPLICABLE', {});
  }
  const deadEnds = surface.exit_paths.filter((path) => !path.has_exit);
  if (deadEnds.length > 0) {
    return createRuleResult(rule, 'BLOCK', { exit_paths: surface.exit_paths }, {
      remediation: `${deadEnds.length} dead-end flows found. Add obvious exit paths (back, close, cancel).`,
      affected_surface: deadEnds.map((path) => path.id),
      score_impact: -2.0
    });
  }
  return createRuleResult(rule, 'PASS', { exit_paths: surface.exit_paths });
}

export function evaluateKrugMobile(surface) {
  const rule = KRUG_RULES.find((r) => r.id === 'KRUG-MOBILE-001');
  if (!surface || !surface.mobile_viewport) {
    return createRuleResult(rule, 'NOT_APPLICABLE', {});
  }
  const mv = surface.mobile_viewport;
  if (mv.removes_essential_context) {
    return createRuleResult(rule, 'BLOCK', { mobile_viewport: mv }, {
      remediation: 'Mobile layout removes essential context. Keep primary information visible.',
      score_impact: -2.0
    });
  }
  if (mv.touch_targets_below_min) {
    return createRuleResult(rule, 'WARN', { mobile_viewport: mv }, {
      remediation: 'Touch targets below minimum size (44x44px). Increase target sizes.',
      score_impact: -1.0
    });
  }
  return createRuleResult(rule, 'PASS', { mobile_viewport: mv });
}

const GENERIC_COPY_PATTERNS = [
  /transform\s+your\s+business/i,
  /unlock\s+your\s+potential/i,
  /reimagine\s+what/i,
  /empower\s+your\s+team/i,
  /seamlessly\s+integrate/i,
  /leverage\s+cutting.edge/i,
  /revolutionize\s+your/i,
  /disrupt\s+the\s+industry/i,
  /game.changer/i,
  /one.stop.solution/i
];

export function evaluateSlopClaim(surface) {
  const rule = SLOP_RULES.find((r) => r.id === 'SLOP-CLAIM-001');
  if (!surface || !Array.isArray(surface.claims_ledger)) {
    return createRuleResult(rule, 'NOT_APPLICABLE', {});
  }
  const unverified = surface.claims_ledger.filter((claim) => !claim.verified);
  if (unverified.length > 0) {
    return createRuleResult(rule, 'BLOCK', { claims_ledger: surface.claims_ledger }, {
      remediation: `${unverified.length} unverified claims found. Remove or verify with evidence.`,
      affected_surface: unverified.map((c) => c.id),
      score_impact: -3.0
    });
  }
  return createRuleResult(rule, 'PASS', { claims_ledger: surface.claims_ledger });
}

export function evaluateSlopHero(surface) {
  const rule = SLOP_RULES.find((r) => r.id === 'SLOP-HERO-001');
  if (!surface || !surface.hero_content) {
    return createRuleResult(rule, 'NOT_APPLICABLE', {});
  }
  const hc = surface.hero_content;
  const isGeneric = hc.has_logo_strip && hc.has_feature_cards && hc.has_testimonials && !hc.brand_specific_rationale;
  if (isGeneric) {
    return createRuleResult(rule, 'WARN', { hero_content: hc }, {
      remediation: 'Generic hero structure (logo strip + feature cards + testimonials) without brand justification.',
      score_impact: -1.0
    });
  }
  return createRuleResult(rule, 'PASS', { hero_content: hc });
}

export function evaluateSlopCard(surface) {
  const rule = SLOP_RULES.find((r) => r.id === 'SLOP-CARD-001');
  if (!surface || !Array.isArray(surface.component_inventory)) {
    return createRuleResult(rule, 'NOT_APPLICABLE', {});
  }
  const nestedCards = surface.component_inventory.filter((c) => c.nested_depth && c.nested_depth > 1);
  if (nestedCards.length > 2) {
    return createRuleResult(rule, 'WARN', { component_inventory: surface.component_inventory }, {
      remediation: `${nestedCards.length} deeply nested card containers. Flatten the structure.`,
      score_impact: -0.5
    });
  }
  return createRuleResult(rule, 'PASS', { component_inventory: surface.component_inventory });
}

export function evaluateSlopBento(surface) {
  const rule = SLOP_RULES.find((r) => r.id === 'SLOP-BENTO-001');
  if (!surface || !surface.layout_rationale) {
    return createRuleResult(rule, 'NOT_APPLICABLE', {});
  }
  if (surface.layout_rationale.is_bento && !surface.layout_rationale.information_model_justification) {
    return createRuleResult(rule, 'WARN', { layout_rationale: surface.layout_rationale }, {
      remediation: 'Bento layout without information-model justification. Document why bento is appropriate.',
      score_impact: -0.5
    });
  }
  return createRuleResult(rule, 'PASS', { layout_rationale: surface.layout_rationale });
}

export function evaluateSlopMetric(surface) {
  const rule = SLOP_RULES.find((r) => r.id === 'SLOP-METRIC-001');
  if (!surface || !Array.isArray(surface.metric_sources)) {
    return createRuleResult(rule, 'NOT_APPLICABLE', {});
  }
  const unsourced = surface.metric_sources.filter((m) => !m.source || m.source === 'unknown');
  if (unsourced.length > 0) {
    return createRuleResult(rule, 'BLOCK', { metric_sources: surface.metric_sources }, {
      remediation: `${unsourced.length} metrics without sources. Remove or provide evidence.`,
      affected_surface: unsourced.map((m) => m.id),
      score_impact: -2.0
    });
  }
  return createRuleResult(rule, 'PASS', { metric_sources: surface.metric_sources });
}

export function evaluateSlopIcon(surface) {
  const rule = SLOP_RULES.find((r) => r.id === 'SLOP-ICON-001');
  if (!surface || !Array.isArray(surface.icon_inventory)) {
    return createRuleResult(rule, 'NOT_APPLICABLE', {});
  }
  const families = new Set(surface.icon_inventory.map((i) => i.family).filter(Boolean));
  const hasEmoji = surface.icon_inventory.some((i) => i.is_emoji);
  if (hasEmoji) {
    return createRuleResult(rule, 'BLOCK', { icon_inventory: surface.icon_inventory }, {
      remediation: 'Emoji used as interface icons. Replace with approved open-source icon family.',
      score_impact: -2.0
    });
  }
  if (families.size > 1) {
    return createRuleResult(rule, 'WARN', { icon_inventory: surface.icon_inventory }, {
      remediation: `Multiple icon families (${families.size}). Use one consistent family.`,
      score_impact: -0.5
    });
  }
  return createRuleResult(rule, 'PASS', { icon_inventory: surface.icon_inventory });
}

export function evaluateSlopMotion(surface) {
  const rule = SLOP_RULES.find((r) => r.id === 'SLOP-MOTION-001');
  if (!surface || !Array.isArray(surface.motion_inventory)) {
    return createRuleResult(rule, 'NOT_APPLICABLE', {});
  }
  const decorative = surface.motion_inventory.filter((m) => m.purpose === 'decorative');
  const fadeUpAll = surface.motion_inventory.filter((m) => m.type === 'fade-up' && m.applied_to === 'all');
  if (decorative.length > 2) {
    return createRuleResult(rule, 'WARN', { motion_inventory: surface.motion_inventory }, {
      remediation: `${decorative.length} decorative motion elements. Remove motion that doesn't support understanding.`,
      score_impact: -1.0
    });
  }
  if (fadeUpAll.length > 0) {
    return createRuleResult(rule, 'WARN', { motion_inventory: surface.motion_inventory }, {
      remediation: 'Default fade-up applied to every element. Use motion purposefully.',
      score_impact: -0.5
    });
  }
  return createRuleResult(rule, 'PASS', { motion_inventory: surface.motion_inventory });
}

export function evaluateSlopCopy(surface) {
  const rule = SLOP_RULES.find((r) => r.id === 'SLOP-COPY-001');
  if (!surface || !Array.isArray(surface.copy_analysis)) {
    return createRuleResult(rule, 'NOT_APPLICABLE', {});
  }
  const generic = surface.copy_analysis.filter((item) => GENERIC_COPY_PATTERNS.some((pattern) => pattern.test(item.text)));
  if (generic.length > 0) {
    return createRuleResult(rule, 'WARN', { copy_analysis: surface.copy_analysis }, {
      remediation: `${generic.length} generic AI copy patterns detected. Replace with brand-specific language.`,
      affected_surface: generic.map((g) => g.id),
      score_impact: -1.0
    });
  }
  return createRuleResult(rule, 'PASS', { copy_analysis: surface.copy_analysis });
}

export function evaluateSlopPlaceholder(surface) {
  const rule = SLOP_RULES.find((r) => r.id === 'SLOP-PLACEHOLDER-001');
  if (!surface || !surface.data_audit) {
    return createRuleResult(rule, 'NOT_APPLICABLE', {});
  }
  const da = surface.data_audit;
  if (da.has_placeholder_as_real || da.has_lorem_ipsum || da.has_fake_testimonials) {
    return createRuleResult(rule, 'BLOCK', { data_audit: da }, {
      remediation: 'Placeholder or demo data represented as real. Remove or clearly mark as sample.',
      score_impact: -3.0
    });
  }
  return createRuleResult(rule, 'PASS', { data_audit: da });
}

export function evaluateSlopAiDefault(surface) {
  const rule = SLOP_RULES.find((r) => r.id === 'SLOP-AI-DEFAULT-001');
  if (!surface || !surface.design_rationale) {
    return createRuleResult(rule, 'NOT_APPLICABLE', {});
  }
  const dr = surface.design_rationale;
  const aiPatterns = [];
  if (dr.has_generic_gradient_blobs) aiPatterns.push('generic gradient blobs');
  if (dr.has_random_glassmorphism) aiPatterns.push('random glassmorphism');
  if (dr.has_oversized_type_for_novelty) aiPatterns.push('oversized type for novelty');
  if (dr.has_all_caps_label_proliferation) aiPatterns.push('all-caps label proliferation');
  if (aiPatterns.length > 0 && !dr.business_rationale) {
    return createRuleResult(rule, 'WARN', { design_rationale: dr }, {
      remediation: `AI-default patterns without business rationale: ${aiPatterns.join(', ')}.`,
      score_impact: -1.0
    });
  }
  return createRuleResult(rule, 'PASS', { design_rationale: dr });
}

const KRUG_EVALUATORS = {
  'KRUG-CLARITY-001': evaluateKrugClarity,
  'KRUG-CTA-001': evaluateKrugCTA,
  'KRUG-SCAN-001': evaluateKrugScan,
  'KRUG-HIER-001': evaluateKrugHierarchy,
  'KRUG-CLICK-001': evaluateKrugClick,
  'KRUG-NAV-001': evaluateKrugNav,
  'KRUG-LOCATION-001': evaluateKrugLocation,
  'KRUG-RECOVERY-001': evaluateKrugRecovery,
  'KRUG-MOBILE-001': evaluateKrugMobile
};

const SLOP_EVALUATORS = {
  'SLOP-CLAIM-001': evaluateSlopClaim,
  'SLOP-HERO-001': evaluateSlopHero,
  'SLOP-CARD-001': evaluateSlopCard,
  'SLOP-BENTO-001': evaluateSlopBento,
  'SLOP-METRIC-001': evaluateSlopMetric,
  'SLOP-ICON-001': evaluateSlopIcon,
  'SLOP-MOTION-001': evaluateSlopMotion,
  'SLOP-COPY-001': evaluateSlopCopy,
  'SLOP-PLACEHOLDER-001': evaluateSlopPlaceholder,
  'SLOP-AI-DEFAULT-001': evaluateSlopAiDefault
};

export function evaluateRule(ruleId, surface) {
  const evaluator = KRUG_EVALUATORS[ruleId] || SLOP_EVALUATORS[ruleId];
  if (!evaluator) throw new Error(`Unknown rule: ${ruleId}`);
  return evaluator(surface);
}

export function evaluateAllKrug(surface) {
  return KRUG_RULES.map((rule) => evaluateRule(rule.id, surface));
}

export function evaluateAllSlop(surface) {
  return SLOP_RULES.map((rule) => evaluateRule(rule.id, surface));
}

export function evaluateAll(surface) {
  return [...evaluateAllKrug(surface), ...evaluateAllSlop(surface)];
}

export function summarizeResults(results) {
  const p0 = results.filter((r) => r.severity === 'P0' && r.status === 'BLOCK').length;
  const p1 = results.filter((r) => r.severity === 'P1' && r.status === 'BLOCK').length;
  const p2 = results.filter((r) => r.severity === 'P2' && r.status === 'WARN').length;
  const passed = results.filter((r) => r.status === 'PASS').length;
  const blocked = results.filter((r) => r.status === 'BLOCK').length;
  const warned = results.filter((r) => r.status === 'WARN').length;
  const notApplicable = results.filter((r) => r.status === 'NOT_APPLICABLE').length;
  const totalScoreImpact = results.reduce((sum, r) => sum + r.score_impact, 0);
  const hasP0 = p0 > 0;
  const hasUnresolvedP1 = p1 > 0;
  const gate = !hasP0 && !hasUnresolvedP1 ? 'PASS' : 'BLOCK';
  return {
    total: results.length,
    passed,
    blocked,
    warned,
    not_applicable: notApplicable,
    p0,
    p1,
    p2,
    total_score_impact: totalScoreImpact,
    gate,
    has_p0: hasP0,
    has_unresolved_p1: hasUnresolvedP1
  };
}

export function applyWaiver(result, waiver) {
  if (!waiver || !waiver.reason || !waiver.approved_by) {
    throw new Error('Waiver requires reason and approved_by');
  }
  if (waiver.approved_by === 'agent' || waiver.approved_by === 'ai') {
    throw new Error('Agent self-waiver is prohibited. Waiver must be approved by a human.');
  }
  return {
    ...result,
    waiver: {
      reason: waiver.reason,
      approved_by: waiver.approved_by,
      scope: waiver.scope || 'this-evaluation',
      approved_at: waiver.approved_at || new Date().toISOString()
    },
    status: 'PASS'
  };
}

export function applyScoreCap(results) {
  let cappedScore = 10.0;
  for (const result of results) {
    const rule = [...KRUG_RULES, ...SLOP_RULES].find((r) => r.id === result.rule_id);
    if (rule && rule.score_cap && result.status !== 'PASS' && result.status !== 'NOT_APPLICABLE') {
      cappedScore = Math.min(cappedScore, rule.score_cap);
    }
  }
  return cappedScore;
}
