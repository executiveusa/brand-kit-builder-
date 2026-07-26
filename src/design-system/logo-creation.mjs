/**
 * Logo Creation — Phase 13: BKB-LOGO-002
 *
 * Logo generation pipeline, SVG builders, refinement workflow,
 * and approval gate for Pauli Brand Studio.
 */

const VERSION = "1.0.0";

/* ─── Logo Generation Pipeline Stages ───────────────────────────────────── */

const PIPELINE_STAGES = [
  { id: "brief",     name: "Brief Intake",      description: "Collect brand name, industry, style preferences, color direction" },
  { id: "concept",   name: "Concept Generation", description: "Generate 3-5 logo concepts based on brief" },
  { id: "sketch",    name: "Sketch & Refine",    description: "Render concepts as SVG, iterate on top 2" },
  { id: "validate",  name: "Validation",         description: "Run SVG validation, accessibility, platform compliance" },
  { id: "present",   name: "Presentation",       description: "Show logo in context: light/dark, small/large, on mockups" },
  { id: "approve",   name: "Approval Gate",      description: "Human approval required before finalizing" },
  { id: "export",    name: "Export",             description: "Export all formats: SVG, PNG 1x/2x/3x, PDF, ICO" },
];

/* ─── Concept Templates ─────────────────────────────────────────────────── */

const CONCEPT_TEMPLATES = {
  geometric: {
    id: "geometric",
    name: "Geometric Abstract",
    description: "Clean geometric shapes forming a recognizable mark",
    elements: ["circles", "squares", "triangles", "hexagons", "lines"],
    style: "minimal, precise, modern",
    best_for: ["technology", "finance", "consulting", "architecture"],
  },
  wordmark: {
    id: "wordmark",
    name: "Typographic Wordmark",
    description: "Stylized text-based logo, no separate symbol",
    elements: ["custom-letterforms", "ligatures", "stylized-letters"],
    style: "elegant, distinctive, memorable",
    best_for: ["fashion", "luxury", "editorial", "law"],
  },
  monogram: {
    id: "monogram",
    name: "Monogram / Lettermark",
    description: "Initials or letters combined into a mark",
    elements: ["initials", "interlocking-letters", "stacked-letters"],
    style: "classic, sophisticated, timeless",
    best_for: ["personal-brand", "consulting", "architecture", "law"],
  },
  abstract: {
    id: "abstract",
    name: "Abstract Symbol",
    description: "Non-representational shape with brand meaning",
    elements: ["flowing-shapes", "dynamic-forms", "organic-paths"],
    style: "creative, fluid, distinctive",
    best_for: ["creative", "entertainment", "wellness", "technology"],
  },
  emblem: {
    id: "emblem",
    name: "Emblem / Badge",
    description: "Text contained within a symbol or shape",
    elements: ["circle-badge", "shield", "ribbon", "seal"],
    style: "traditional, trustworthy, established",
    best_for: ["automotive", "food", "sports", "education"],
  },
  mascot: {
    id: "mascot",
    name: "Mascot / Character",
    description: "Illustrated character representing the brand",
    elements: ["character", "animal", "person", "object"],
    style: "friendly, approachable, fun",
    best_for: ["food", "sports", "children", "gaming"],
  },
};

/* ─── SVG Builder Helpers ───────────────────────────────────────────────── */

function svgRoot(viewBox = "0 0 200 200", attrs = {}) {
  const attrStr = Object.entries({ viewBox, xmlns: "http://www.w3.org/2000/svg", ...attrs })
    .map(([k, v]) => `${k}="${v}"`).join(" ");
  return `<svg ${attrStr}>`;
}

function svgCircle(cx, cy, r, fill = "#1A1A2E", attrs = {}) {
  const attrStr = Object.entries({ cx, cy, r, fill, ...attrs })
    .map(([k, v]) => `${k}="${v}"`).join(" ");
  return `<circle ${attrStr}/>`;
}

function svgRect(x, y, width, height, fill = "#1A1A2E", attrs = {}) {
  const attrStr = Object.entries({ x, y, width, height, fill, ...attrs })
    .map(([k, v]) => `${k}="${v}"`).join(" ");
  return `<rect ${attrStr}/>`;
}

function svgPath(d, fill = "#1A1A2E", attrs = {}) {
  const attrStr = Object.entries({ d, fill, ...attrs })
    .map(([k, v]) => `${k}="${v}"`).join(" ");
  return `<path ${attrStr}/>`;
}

function svgText(x, y, text, fill = "#1A1A2E", attrs = {}) {
  const attrStr = Object.entries({ x, y, fill, ...attrs })
    .map(([k, v]) => `${k}="${v}"`).join(" ");
  return `<text ${attrStr}>${text}</text>`;
}

function svgGroup(children, attrs = {}) {
  const attrStr = Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(" ");
  return `<g ${attrStr}>${children.join("")}</g>`;
}

function svgDefs(inner) {
  return `<defs>${inner}</defs>`;
}

function svgLinearGradient(id, stops, attrs = {}) {
  const stopStr = stops.map(s =>
    `<stop offset="${s.offset}" stop-color="${s.color}" stop-opacity="${s.opacity || 1}"/>`
  ).join("");
  const attrStr = Object.entries({ id, ...attrs }).map(([k, v]) => `${k}="${v}"`).join(" ");
  return `<linearGradient ${attrStr}>${stopStr}</linearGradient>`;
}

function svgRadialGradient(id, stops, attrs = {}) {
  const stopStr = stops.map(s =>
    `<stop offset="${s.offset}" stop-color="${s.color}" stop-opacity="${s.opacity || 1}"/>`
  ).join("");
  const attrStr = Object.entries({ id, ...attrs }).map(([k, v]) => `${k}="${v}"`).join(" ");
  return `<radialGradient ${attrStr}>${stopStr}</radialGradient>`;
}

/* ─── Logo Generation Functions ─────────────────────────────────────────── */

function generateConcept(brief, template) {
  const tmpl = CONCEPT_TEMPLATES[template];
  if (!tmpl) return null;
  return {
    id: `${brief.brand_name.toLowerCase().replace(/\s+/g, "-")}-${template}`,
    template,
    brand_name: brief.brand_name,
    industry: brief.industry,
    elements: tmpl.elements,
    style: tmpl.style,
    svg: null,
    colors: brief.colors || { primary: "#1A1A2E", secondary: "#2563EB" },
    status: "draft",
    created_at: new Date().toISOString(),
  };
}

function generateGeometricLogo(brandName, colors = {}) {
  const primary = colors.primary || "#1A1A2E";
  const secondary = colors.secondary || "#2563EB";
  const letter = brandName.charAt(0).toUpperCase();
  const svg = [
    svgRoot("0 0 200 200", { width: "200", height: "200" }),
    svgDefs(svgLinearGradient("grad1", [
      { offset: "0%", color: primary },
      { offset: "100%", color: secondary },
    ], { x1: "0%", y1: "0%", x2: "100%", y2: "100%" })),
    svgCircle(100, 100, 80, "url(#grad1)"),
    svgText(100, 115, letter, "#FFFFFF", {
      "font-family": "Inter, sans-serif",
      "font-size": "72",
      "font-weight": "700",
      "text-anchor": "middle",
    }),
    "</svg>",
  ].join("\n");
  return { svg, letter, colors: { primary, secondary } };
}

function generateWordmarkLogo(brandName, colors = {}) {
  const primary = colors.primary || "#1A1A2E";
  const width = Math.max(200, brandName.length * 20);
  const svg = [
    svgRoot(`0 0 ${width} 60`, { width: String(width), height: "60" }),
    svgText(width / 2, 42, brandName, primary, {
      "font-family": "Inter, sans-serif",
      "font-size": "36",
      "font-weight": "700",
      "text-anchor": "middle",
    }),
    "</svg>",
  ].join("\n");
  return { svg, brandName, colors: { primary } };
}

function generateMonogramLogo(brandName, colors = {}) {
  const primary = colors.primary || "#1A1A2E";
  const secondary = colors.secondary || "#2563EB";
  const words = brandName.split(/\s+/).filter(Boolean);
  const initials = words.slice(0, 2).map(w => w.charAt(0).toUpperCase()).join("");
  const svg = [
    svgRoot("0 0 120 120", { width: "120", height: "120" }),
    svgDefs(svgLinearGradient("grad-mono", [
      { offset: "0%", color: primary },
      { offset: "100%", color: secondary },
    ], { x1: "0%", y1: "0%", x2: "100%", y2: "100%" })),
    svgRect(10, 10, 100, 100, "url(#grad-mono)", { rx: "12" }),
    svgText(60, 72, initials, "#FFFFFF", {
      "font-family": "Inter, sans-serif",
      "font-size": "42",
      "font-weight": "700",
      "text-anchor": "middle",
    }),
    "</svg>",
  ].join("\n");
  return { svg, initials, colors: { primary, secondary } };
}

/* ─── Refinement Workflow ────────────────────────────────────────────────── */

const REFINEMENT_AXES = [
  { id: "clarity",      label: "Clarity",       min: 1, max: 5, description: "Is the logo immediately recognizable?" },
  { id: "memorability",  label: "Memorability", min: 1, max: 5, description: "Will people remember this logo?" },
  { id: "versatility",  label: "Versatility",  min: 1, max: 5, description: "Does it work across sizes and contexts?" },
  { id: "relevance",    label: "Relevance",     min: 1, max: 5, description: "Does it fit the brand and industry?" },
  { id: "uniqueness",   label: "Uniqueness",    min: 1, max: 5, description: "Is it distinct from competitors?" },
  { id: "simplicity",   label: "Simplicity",    min: 1, max: 5, description: "Is it clean and uncluttered?" },
];

function scoreRefinement(concept, scores) {
  const issues = [];
  for (const axis of REFINEMENT_AXES) {
    const score = scores[axis.id];
    if (score === undefined || score === null) {
      issues.push(`${axis.id}: missing score`);
    } else if (score < axis.min || score > axis.max) {
      issues.push(`${axis.id}: score ${score} out of range ${axis.min}-${axis.max}`);
    }
  }
  if (issues.length > 0) return { valid: false, issues };

  const values = REFINEMENT_AXES.map(a => scores[a.id]);
  const avg = values.reduce((s, v) => s + v, 0) / values.length;
  const min = Math.min(...values);
  const passes = avg >= 3.5 && min >= 2;

  return {
    valid: true,
    scores,
    average: Math.round(avg * 100) / 100,
    min_score: min,
    passes,
    recommendation: passes ? "approved" : "needs_revision",
    low_axes: REFINEMENT_AXES.filter(a => scores[a.id] < 3).map(a => a.id),
  };
}

/* ─── Approval Gate ──────────────────────────────────────────────────────── */

function checkApprovalGate(concept, refinementScore, svgValidation) {
  const blockers = [];
  const warnings = [];

  if (!concept) blockers.push("No concept provided");
  if (!svgValidation?.valid) blockers.push("SVG validation failed");
  if (refinementScore && !refinementScore.passes) blockers.push("Refinement score below threshold");
  if (refinementScore?.min_score < 2) blockers.push("Critical axis below minimum (2)");

  if (refinementScore?.low_axes?.length > 0) {
    warnings.push(`Low scoring axes: ${refinementScore.low_axes.join(", ")}`);
  }

  return {
    approved: blockers.length === 0,
    blockers,
    warnings,
    next_step: blockers.length === 0 ? "export" : "revise",
  };
}

/* ─── Exports ────────────────────────────────────────────────────────────── */

export {
  VERSION,
  PIPELINE_STAGES,
  CONCEPT_TEMPLATES,
  REFINEMENT_AXES,
  generateConcept,
  generateGeometricLogo,
  generateWordmarkLogo,
  generateMonogramLogo,
  scoreRefinement,
  checkApprovalGate,
  svgRoot,
  svgCircle,
  svgRect,
  svgPath,
  svgText,
  svgGroup,
  svgDefs,
  svgLinearGradient,
  svgRadialGradient,
};
