import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  VERSION,
  FONT_CATALOG,
  FONT_NAMES,
  HEADING_FONTS,
  BODY_FONTS,
  MONO_FONTS,
  PAIRING_RULES,
  GALLERY_CATEGORIES,
  SAMPLE_PAIRINGS,
  validateFontName,
  validateFontWeight,
  validateFontStyle,
  validatePairing,
  validateFontFaceDeclaration,
  getFontByName,
  getFontsByCategory,
  getFontsByRole,
  generateFontFaces,
} from "../src/design-system/font-gallery.mjs";

describe("font gallery", () => {
  it("exports VERSION string", () => {
    assert.equal(VERSION, "1.0.0");
  });

  it("FONT_CATALOG has 15 fonts", () => {
    assert.equal(Object.keys(FONT_CATALOG).length, 15);
  });

  it("every font has category, weights, styles, subsets, license, source", () => {
    for (const [name, font] of Object.entries(FONT_CATALOG)) {
      assert.ok(font.category, `${name} missing category`);
      assert.ok(Array.isArray(font.weights), `${name} missing weights`);
      assert.ok(Array.isArray(font.styles), `${name} missing styles`);
      assert.ok(Array.isArray(font.subsets), `${name} missing subsets`);
      assert.ok(font.license, `${name} missing license`);
      assert.ok(font.source, `${name} missing source`);
      assert.ok(font.description, `${name} missing description`);
    }
  });

  it("HEADING_FONTS has 6 fonts", () => {
    assert.equal(HEADING_FONTS.length, 6);
  });

  it("BODY_FONTS has 7 fonts", () => {
    assert.equal(BODY_FONTS.length, 7);
  });

  it("MONO_FONTS has 3 fonts", () => {
    assert.equal(MONO_FONTS.length, 3);
  });

  it("GALLERY_CATEGORIES has 3 categories", () => {
    assert.equal(GALLERY_CATEGORIES.length, 3);
  });

  it("SAMPLE_PAIRINGS has 6 pairings", () => {
    assert.equal(SAMPLE_PAIRINGS.length, 6);
  });

  it("every sample pairing heading is in FONT_CATALOG", () => {
    for (const p of SAMPLE_PAIRINGS) {
      assert.ok(FONT_CATALOG[p.heading], `heading ${p.heading} not in catalog`);
    }
  });

  it("every sample pairing body is in FONT_CATALOG", () => {
    for (const p of SAMPLE_PAIRINGS) {
      assert.ok(FONT_CATALOG[p.body], `body ${p.body} not in catalog`);
    }
  });

  it("all fonts have weight 400 or 500 for body use", () => {
    for (const name of BODY_FONTS) {
      const weights = FONT_CATALOG[name].weights;
      assert.ok(weights.includes(400) || weights.includes(500), `${name} missing usable weight`);
    }
  });

  it("all heading fonts have weight 700 (except display-only)", () => {
    for (const name of HEADING_FONTS) {
      const weights = FONT_CATALOG[name].weights;
      if (weights.length <= 2) continue;
      assert.ok(weights.includes(700), `${name} missing weight 700`);
    }
  });
});

describe("validateFontName", () => {
  it("accepts Inter", () => {
    assert.ok(validateFontName("Inter").valid);
  });

  it("accepts Merriweather", () => {
    assert.ok(validateFontName("Merriweather").valid);
  });

  it("accepts JetBrains Mono", () => {
    assert.ok(validateFontName("JetBrains Mono").valid);
  });

  it("rejects UnknownFont", () => {
    assert.ok(!validateFontName("UnknownFont").valid);
  });
});

describe("validateFontWeight", () => {
  it("accepts weight 400 for Inter", () => {
    assert.ok(validateFontWeight("Inter", 400).valid);
  });

  it("accepts weight 700 for Playfair Display", () => {
    assert.ok(validateFontWeight("Playfair Display", 700).valid);
  });

  it("rejects weight 100 for Open Sans", () => {
    assert.ok(!validateFontWeight("Open Sans", 100).valid);
  });

  it("rejects unknown font", () => {
    assert.ok(!validateFontWeight("UnknownFont", 400).valid);
  });
});

describe("validateFontStyle", () => {
  it("accepts italic for Inter", () => {
    assert.ok(validateFontStyle("Inter", "italic").valid);
  });

  it("rejects italic for Space Grotesk", () => {
    assert.ok(!validateFontStyle("Space Grotesk", "italic").valid);
  });

  it("rejects unknown font", () => {
    assert.ok(!validateFontStyle("UnknownFont", "normal").valid);
  });
});

describe("validatePairing", () => {
  it("accepts Space Grotesk + Source Serif 4", () => {
    const result = validatePairing("Space Grotesk", "Source Serif 4");
    assert.equal(result.valid, true);
  });

  it("accepts Playfair Display + Inter", () => {
    const result = validatePairing("Playfair Display", "Inter");
    assert.equal(result.valid, true);
  });

  it("warns on same-category pairing (Inter + DM Sans)", () => {
    const result = validatePairing("Inter", "DM Sans");
    assert.equal(result.valid, true);
    assert.ok(result.warnings.length > 0);
  });

  it("rejects monospace as body font", () => {
    const result = validatePairing("Inter", "JetBrains Mono");
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.toLowerCase().includes("monospace")));
  });

  it("rejects unknown heading font", () => {
    const result = validatePairing("UnknownFont", "Inter");
    assert.equal(result.valid, false);
  });

  it("rejects missing fonts", () => {
    const result = validatePairing(null, null);
    assert.equal(result.valid, false);
  });
});

describe("validateFontFaceDeclaration", () => {
  it("generates declaration for Inter 400 normal", () => {
    const result = validateFontFaceDeclaration("Inter", 400, "normal");
    assert.equal(result.valid, true);
    assert.equal(result.declaration["font-family"], '"Inter"');
    assert.equal(result.declaration["font-weight"], "400");
    assert.equal(result.declaration["font-style"], "normal");
    assert.equal(result.declaration["font-display"], "swap");
  });

  it("generates declaration for Merriweather 700 italic", () => {
    const result = validateFontFaceDeclaration("Merriweather", 700, "italic");
    assert.equal(result.valid, true);
    assert.equal(result.declaration["font-style"], "italic");
  });

  it("rejects unknown font", () => {
    const result = validateFontFaceDeclaration("UnknownFont");
    assert.equal(result.valid, false);
  });
});

describe("getFontByName", () => {
  it("returns Inter data", () => {
    const font = getFontByName("Inter");
    assert.ok(font);
    assert.equal(font.category, "sans-serif");
  });

  it("returns null for unknown", () => {
    assert.equal(getFontByName("UnknownFont"), null);
  });
});

describe("getFontsByCategory", () => {
  it("returns serif fonts", () => {
    const serifs = getFontsByCategory("serif");
    assert.ok(serifs.includes("Playfair Display"));
    assert.ok(serifs.includes("Source Serif 4"));
    assert.ok(serifs.includes("Lora"));
  });

  it("returns monospace fonts", () => {
    const monos = getFontsByCategory("monospace");
    assert.ok(monos.includes("JetBrains Mono"));
    assert.ok(monos.includes("Fira Code"));
  });
});

describe("getFontsByRole", () => {
  it("returns heading fonts", () => {
    const headings = getFontsByRole("heading");
    assert.equal(headings.length, 6);
    assert.ok(headings.includes("Inter"));
  });

  it("returns body fonts", () => {
    const bodies = getFontsByRole("body");
    assert.equal(bodies.length, 7);
    assert.ok(bodies.includes("Source Serif 4"));
  });

  it("returns mono fonts", () => {
    const monos = getFontsByRole("mono");
    assert.equal(monos.length, 3);
  });

  it("returns empty for unknown role", () => {
    assert.equal(getFontsByRole("unknown").length, 0);
  });
});

describe("generateFontFaces", () => {
  it("generates faces for Inter (common weights 300-700 x styles)", () => {
    const faces = generateFontFaces("Inter");
    assert.ok(faces.length >= 5);
    assert.ok(faces[0]["font-family"]);
    assert.ok(faces[0]["font-display"]);
  });

  it("generates faces for DM Serif Display (weight 400 x 2 styles)", () => {
    const faces = generateFontFaces("DM Serif Display");
    assert.ok(faces.length >= 2);
  });

  it("returns empty for unknown font", () => {
    assert.equal(generateFontFaces("UnknownFont").length, 0);
  });
});
