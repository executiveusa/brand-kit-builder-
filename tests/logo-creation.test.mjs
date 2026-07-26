import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
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
} from "../src/design-system/logo-creation.mjs";

describe("logo creation", () => {
  it("exports VERSION string", () => {
    assert.equal(VERSION, "1.0.0");
  });

  it("PIPELINE_STAGES has 7 stages", () => {
    assert.equal(PIPELINE_STAGES.length, 7);
  });

  it("pipeline stages are in order", () => {
    const ids = PIPELINE_STAGES.map(s => s.id);
    assert.deepEqual(ids, ["brief", "concept", "sketch", "validate", "present", "approve", "export"]);
  });

  it("CONCEPT_TEMPLATES has 6 templates", () => {
    assert.equal(Object.keys(CONCEPT_TEMPLATES).length, 6);
  });

  it("every template has id, name, description, elements, style, best_for", () => {
    for (const [id, tmpl] of Object.entries(CONCEPT_TEMPLATES)) {
      assert.equal(tmpl.id, id);
      assert.ok(tmpl.name);
      assert.ok(tmpl.description);
      assert.ok(Array.isArray(tmpl.elements));
      assert.ok(tmpl.style);
      assert.ok(Array.isArray(tmpl.best_for));
    }
  });

  it("REFINEMENT_AXES has 6 axes", () => {
    assert.equal(REFINEMENT_AXES.length, 6);
  });

  it("every axis has id, label, min, max, description", () => {
    for (const axis of REFINEMENT_AXES) {
      assert.ok(axis.id);
      assert.ok(axis.label);
      assert.equal(axis.min, 1);
      assert.equal(axis.max, 5);
      assert.ok(axis.description);
    }
  });
});

describe("SVG builders", () => {
  it("svgRoot creates valid SVG root", () => {
    const root = svgRoot("0 0 100 100");
    assert.ok(root.includes('<svg'));
    assert.ok(root.includes('viewBox="0 0 100 100"'));
    assert.ok(root.includes('xmlns="http://www.w3.org/2000/svg"'));
  });

  it("svgCircle creates circle element", () => {
    const circle = svgCircle(50, 50, 40, "#FF0000");
    assert.ok(circle.includes("<circle"));
    assert.ok(circle.includes('cx="50"'));
    assert.ok(circle.includes('cy="50"'));
    assert.ok(circle.includes('r="40"'));
    assert.ok(circle.includes('fill="#FF0000"'));
  });

  it("svgRect creates rect element", () => {
    const rect = svgRect(10, 20, 100, 50, "#00FF00");
    assert.ok(rect.includes("<rect"));
    assert.ok(rect.includes('x="10"'));
    assert.ok(rect.includes('y="20"'));
    assert.ok(rect.includes('width="100"'));
    assert.ok(rect.includes('height="50"'));
  });

  it("svgPath creates path element", () => {
    const path = svgPath("M0 0 L100 100", "#0000FF");
    assert.ok(path.includes("<path"));
    assert.ok(path.includes('d="M0 0 L100 100"'));
  });

  it("svgText creates text element", () => {
    const text = svgText(50, 50, "Hello", "#333", { "font-size": "24" });
    assert.ok(text.includes("<text"));
    assert.ok(text.includes("Hello"));
    assert.ok(text.includes('font-size="24"'));
  });

  it("svgGroup wraps children", () => {
    const g = svgGroup(["<circle/>", "<rect/>"], { class: "mark" });
    assert.ok(g.startsWith("<g"));
    assert.ok(g.includes("<circle/>"));
    assert.ok(g.includes("<rect/>"));
    assert.ok(g.includes('class="mark"'));
  });

  it("svgDefs wraps definitions", () => {
    const d = svgDefs("<linearGradient/>");
    assert.ok(d.startsWith("<defs>"));
    assert.ok(d.includes("<linearGradient/>"));
    assert.ok(d.endsWith("</defs>"));
  });

  it("svgLinearGradient creates gradient with stops", () => {
    const grad = svgLinearGradient("g1", [
      { offset: "0%", color: "#000" },
      { offset: "100%", color: "#FFF" },
    ]);
    assert.ok(grad.includes('id="g1"'));
    assert.ok(grad.includes('offset="0%"'));
    assert.ok(grad.includes('stop-color="#000"'));
  });

  it("svgRadialGradient creates gradient", () => {
    const grad = svgRadialGradient("rg1", [
      { offset: "0%", color: "#FFF" },
      { offset: "100%", color: "#000" },
    ]);
    assert.ok(grad.includes('id="rg1"'));
    assert.ok(grad.includes("radialGradient"));
  });
});

describe("generateConcept", () => {
  it("generates concept from brief and template", () => {
    const brief = { brand_name: "Acme Corp", industry: "technology", colors: { primary: "#000", secondary: "#F00" } };
    const concept = generateConcept(brief, "geometric");
    assert.ok(concept);
    assert.equal(concept.template, "geometric");
    assert.equal(concept.brand_name, "Acme Corp");
    assert.equal(concept.status, "draft");
  });

  it("returns null for unknown template", () => {
    const brief = { brand_name: "Test" };
    assert.equal(generateConcept(brief, "nonexistent"), null);
  });
});

describe("generateGeometricLogo", () => {
  it("generates SVG with letter", () => {
    const result = generateGeometricLogo("Acme");
    assert.ok(result.svg.includes("<svg"));
    assert.ok(result.svg.includes("A"));
    assert.ok(result.svg.includes("</svg>"));
  });

  it("uses custom colors", () => {
    const result = generateGeometricLogo("Test", { primary: "#FF0000", secondary: "#00FF00" });
    assert.ok(result.svg.includes("#FF0000"));
  });
});

describe("generateWordmarkLogo", () => {
  it("generates SVG with brand name", () => {
    const result = generateWordmarkLogo("Acme Corp");
    assert.ok(result.svg.includes("<svg"));
    assert.ok(result.svg.includes("Acme Corp"));
  });

  it("width scales with name length", () => {
    const short = generateWordmarkLogo("X");
    const long = generateWordmarkLogo("Very Long Brand Name");
    const shortWidth = parseInt(short.svg.match(/viewBox="0 0 (\d+)/)[1]);
    const longWidth = parseInt(long.svg.match(/viewBox="0 0 (\d+)/)[1]);
    assert.ok(longWidth > shortWidth);
  });
});

describe("generateMonogramLogo", () => {
  it("generates SVG with initials", () => {
    const result = generateMonogramLogo("Acme Corp");
    assert.ok(result.svg.includes("<svg"));
    assert.ok(result.svg.includes("AC"));
  });

  it("handles single word", () => {
    const result = generateMonogramLogo("Google");
    assert.ok(result.svg.includes("G"));
  });
});

describe("scoreRefinement", () => {
  it("approves high-scoring concept", () => {
    const concept = { id: "test" };
    const scores = { clarity: 5, memorability: 4, versatility: 4, relevance: 5, uniqueness: 4, simplicity: 4 };
    const result = scoreRefinement(concept, scores);
    assert.equal(result.valid, true);
    assert.equal(result.passes, true);
    assert.equal(result.recommendation, "approved");
  });

  it("rejects low-scoring concept", () => {
    const concept = { id: "test" };
    const scores = { clarity: 2, memorability: 2, versatility: 3, relevance: 2, uniqueness: 2, simplicity: 2 };
    const result = scoreRefinement(concept, scores);
    assert.equal(result.valid, true);
    assert.equal(result.passes, false);
    assert.equal(result.recommendation, "needs_revision");
  });

  it("reports low axes", () => {
    const concept = { id: "test" };
    const scores = { clarity: 4, memorability: 4, versatility: 4, relevance: 4, uniqueness: 2, simplicity: 4 };
    const result = scoreRefinement(concept, scores);
    assert.ok(result.low_axes.includes("uniqueness"));
  });

  it("rejects missing scores", () => {
    const concept = { id: "test" };
    const scores = { clarity: 4 };
    const result = scoreRefinement(concept, scores);
    assert.equal(result.valid, false);
    assert.ok(result.issues.length > 0);
  });

  it("rejects out-of-range scores", () => {
    const concept = { id: "test" };
    const scores = { clarity: 6, memorability: 4, versatility: 4, relevance: 4, uniqueness: 4, simplicity: 4 };
    const result = scoreRefinement(concept, scores);
    assert.equal(result.valid, false);
  });
});

describe("checkApprovalGate", () => {
  it("approves valid concept with passing score and valid SVG", () => {
    const concept = { id: "test" };
    const refinement = { passes: true, min_score: 3, low_axes: [] };
    const svgValidation = { valid: true };
    const result = checkApprovalGate(concept, refinement, svgValidation);
    assert.equal(result.approved, true);
    assert.equal(result.next_step, "export");
  });

  it("blocks when SVG validation fails", () => {
    const concept = { id: "test" };
    const refinement = { passes: true, min_score: 3 };
    const svgValidation = { valid: false };
    const result = checkApprovalGate(concept, refinement, svgValidation);
    assert.equal(result.approved, false);
    assert.ok(result.blockers.some(b => b.includes("SVG")));
  });

  it("blocks when refinement fails", () => {
    const concept = { id: "test" };
    const refinement = { passes: false, min_score: 3 };
    const svgValidation = { valid: true };
    const result = checkApprovalGate(concept, refinement, svgValidation);
    assert.equal(result.approved, false);
  });

  it("blocks when critical axis below minimum", () => {
    const concept = { id: "test" };
    const refinement = { passes: false, min_score: 1 };
    const svgValidation = { valid: true };
    const result = checkApprovalGate(concept, refinement, svgValidation);
    assert.equal(result.approved, false);
    assert.ok(result.blockers.some(b => b.includes("below minimum")));
  });

  it("blocks when no concept", () => {
    const result = checkApprovalGate(null, null, null);
    assert.equal(result.approved, false);
    assert.ok(result.blockers.some(b => b.includes("No concept")));
  });
});
