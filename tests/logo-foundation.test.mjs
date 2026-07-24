import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  VERSION,
  LOGO_TYPES,
  SVG_RULES,
  PLACEMENT_RULES,
  FILE_FORMATS,
  USAGE_GUIDELINES,
  createLogoSpec,
  validateLogoType,
  validateLogoVariant,
  validateSvgContent,
  validateClearSpace,
  validateLogoSize,
  validateLogoBackground,
  validateFileFormat,
} from "../src/design-system/logo-foundation.mjs";

describe("logo foundation", () => {
  it("exports VERSION string", () => {
    assert.equal(VERSION, "1.0.0");
  });

  it("LOGO_TYPES has 5 types", () => {
    assert.equal(Object.keys(LOGO_TYPES).length, 5);
  });

  it("every logo type has required fields", () => {
    for (const [id, type] of Object.entries(LOGO_TYPES)) {
      assert.equal(type.id, id);
      assert.ok(type.name);
      assert.ok(type.description);
      assert.ok(type.usage);
      assert.ok(Array.isArray(type.variants));
      assert.ok(type.min_width_px > 0);
      assert.ok(type.min_height_px > 0);
    }
  });

  it("SVG_RULES has required fields", () => {
    assert.ok(SVG_RULES.max_file_size_kb > 0);
    assert.ok(Array.isArray(SVG_RULES.allowed_elements));
    assert.ok(Array.isArray(SVG_RULES.forbidden_elements));
    assert.ok(Array.isArray(SVG_RULES.forbidden_attributes));
    assert.ok(Array.isArray(SVG_RULES.required_root_attributes));
  });

  it("SVG_RULES forbids script, iframe, filter", () => {
    assert.ok(SVG_RULES.forbidden_elements.includes("script"));
    assert.ok(SVG_RULES.forbidden_elements.includes("iframe"));
    assert.ok(SVG_RULES.forbidden_elements.includes("filter"));
  });

  it("SVG_RULES forbids onload, onclick", () => {
    assert.ok(SVG_RULES.forbidden_attributes.includes("onload"));
    assert.ok(SVG_RULES.forbidden_attributes.includes("onclick"));
  });

  it("PLACEMENT_RULES has clear_space, minimum_size, backgrounds", () => {
    assert.ok(PLACEMENT_RULES.clear_space);
    assert.ok(PLACEMENT_RULES.minimum_size);
    assert.ok(PLACEMENT_RULES.backgrounds);
  });

  it("PLACEMENT_RULES has 4 background allowed types", () => {
    assert.equal(PLACEMENT_RULES.backgrounds.allowed.length, 4);
  });

  it("FILE_FORMATS has 5 formats", () => {
    assert.equal(Object.keys(FILE_FORMATS).length, 5);
  });

  it("every file format has extension, mime, use", () => {
    for (const [id, fmt] of Object.entries(FILE_FORMATS)) {
      assert.ok(fmt.extension.startsWith("."), `${id} missing extension`);
      assert.ok(fmt.mime, `${id} missing mime`);
      assert.ok(fmt.use, `${id} missing use`);
    }
  });

  it("SVG is required format", () => {
    assert.equal(FILE_FORMATS.svg.required, true);
  });

  it("PNG is required format", () => {
    assert.equal(FILE_FORMATS.png.required, true);
  });

  it("USAGE_GUIDELINES has do and dont lists", () => {
    assert.ok(Array.isArray(USAGE_GUIDELINES.do));
    assert.ok(Array.isArray(USAGE_GUIDELINES.dont));
    assert.ok(USAGE_GUIDELINES.do.length >= 5);
    assert.ok(USAGE_GUIDELINES.dont.length >= 5);
  });

  it("createLogoSpec returns default spec", () => {
    const spec = createLogoSpec();
    assert.equal(spec.type, "primary");
    assert.equal(spec.variant, "horizontal");
    assert.ok(spec.created_at);
    assert.equal(spec.version, "1.0.0");
  });

  it("createLogoSpec accepts overrides", () => {
    const spec = createLogoSpec({ type: "mark", variant: "circle" });
    assert.equal(spec.type, "mark");
    assert.equal(spec.variant, "circle");
  });
});

describe("validateLogoType", () => {
  it("accepts primary", () => {
    assert.ok(validateLogoType("primary").valid);
  });

  it("accepts mark", () => {
    assert.ok(validateLogoType("mark").valid);
  });

  it("accepts lockup", () => {
    assert.ok(validateLogoType("lockup").valid);
  });

  it("rejects unknown type", () => {
    assert.ok(!validateLogoType("supreme").valid);
  });
});

describe("validateLogoVariant", () => {
  it("accepts horizontal for primary", () => {
    assert.ok(validateLogoVariant("primary", "horizontal").valid);
  });

  it("accepts stacked for primary", () => {
    assert.ok(validateLogoVariant("primary", "stacked").valid);
  });

  it("accepts circle for mark", () => {
    assert.ok(validateLogoVariant("mark", "circle").valid);
  });

  it("rejects circle for primary", () => {
    assert.ok(!validateLogoVariant("primary", "circle").valid);
  });

  it("rejects unknown type", () => {
    assert.ok(!validateLogoVariant("supreme", "horizontal").valid);
  });
});

describe("validateSvgContent", () => {
  it("accepts valid SVG", () => {
    const svg = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40"/></svg>';
    assert.ok(validateSvgContent(svg).valid);
  });

  it("rejects non-SVG string", () => {
    assert.ok(!validateSvgContent("not svg").valid);
  });

  it("rejects SVG with script tag", () => {
    const svg = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><script>alert("xss")</script></svg>';
    assert.ok(!validateSvgContent(svg).valid);
  });

  it("rejects SVG with onload attribute", () => {
    const svg = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" onload="alert(1)"><circle/></svg>';
    assert.ok(!validateSvgContent(svg).valid);
  });

  it("rejects SVG with iframe", () => {
    const svg = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><iframe src="evil.com"/></svg>';
    assert.ok(!validateSvgContent(svg).valid);
  });

  it("rejects SVG with filter", () => {
    const svg = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><filter><feGaussianBlur/></filter></svg>';
    assert.ok(!validateSvgContent(svg).valid);
  });

  it("rejects SVG missing viewBox", () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><circle/></svg>';
    assert.ok(!validateSvgContent(svg).valid);
  });

  it("rejects SVG missing xmlns", () => {
    const svg = '<svg viewBox="0 0 100 100"><circle/></svg>';
    assert.ok(!validateSvgContent(svg).valid);
  });

  it("rejects null", () => {
    assert.ok(!validateSvgContent(null).valid);
  });

  it("warns on many colors", () => {
    const svg = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect fill="#FF0000"/><rect fill="#00FF00"/><rect fill="#0000FF"/><rect fill="#FFFF00"/><rect fill="#FF00FF"/><rect fill="#00FFFF"/><rect fill="#800000"/><rect fill="#008000"/><rect fill="#000080"/></svg>';
    const result = validateSvgContent(svg);
    assert.ok(result.warnings.length > 0);
  });
});

describe("validateClearSpace", () => {
  it("accepts adequate clear space", () => {
    const result = validateClearSpace(200, 50, 60);
    assert.ok(result.valid);
  });

  it("rejects insufficient clear space", () => {
    const result = validateClearSpace(200, 50, 10);
    assert.ok(!result.valid);
  });

  it("reports minimum required", () => {
    const result = validateClearSpace(200, 50, 10);
    assert.ok(result.minimum_required >= 16);
  });
});

describe("validateLogoSize", () => {
  it("accepts valid digital size", () => {
    assert.ok(validateLogoSize(120, 40, "digital").valid);
  });

  it("rejects undersized digital logo", () => {
    assert.ok(!validateLogoSize(50, 15, "digital").valid);
  });

  it("accepts valid print size", () => {
    assert.ok(validateLogoSize(25, 8, "print").valid);
  });

  it("rejects unknown context", () => {
    assert.ok(!validateLogoSize(100, 100, "unknown").valid);
  });
});

describe("validateLogoBackground", () => {
  it("accepts solid-light", () => {
    assert.ok(validateLogoBackground("solid-light").valid);
  });

  it("accepts solid-dark", () => {
    assert.ok(validateLogoBackground("solid-dark").valid);
  });

  it("accepts gradient-subtle", () => {
    assert.ok(validateLogoBackground("gradient-subtle").valid);
  });

  it("rejects busy-photography", () => {
    assert.ok(!validateLogoBackground("busy-photography").valid);
  });

  it("rejects rainbow-gradient", () => {
    assert.ok(!validateLogoBackground("rainbow-gradient").valid);
  });
});

describe("validateFileFormat", () => {
  it("accepts svg", () => {
    assert.ok(validateFileFormat("svg").valid);
  });

  it("accepts png", () => {
    assert.ok(validateFileFormat("png").valid);
  });

  it("accepts pdf", () => {
    assert.ok(validateFileFormat("pdf").valid);
  });

  it("accepts ico", () => {
    assert.ok(validateFileFormat("ico").valid);
  });

  it("rejects webp", () => {
    assert.ok(!validateFileFormat("webp").valid);
  });

  it("returns format details", () => {
    const result = validateFileFormat("svg");
    assert.equal(result.format.extension, ".svg");
    assert.equal(result.format.mime, "image/svg+xml");
  });
});
