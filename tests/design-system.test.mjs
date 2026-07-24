import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  VERSION,
  validateHex,
  validateSpacing,
  validateRadius,
  validateShadow,
  validateGradient,
  validateTypography,
  validateBreakpoint,
  validateComponent,
  validateIconFamily,
  validateElevationToken,
  validatePattern,
  compileBrandSpec,
  COLOR_PALETTE,
  SEMANTIC_TOKENS,
  TYPE_SCALE,
  SPACING_TOKENS,
  RADIUS_TOKENS,
  SHADOW_TOKENS,
  GRADIENT_TOKENS,
  ELEVATION_TOKENS,
  BREAKPOINT_TOKENS,
  CONTAINER_TOKENS,
  GRID_TOKENS,
  MOTION_TOKENS,
  COMPONENT_REGISTRY,
  PATTERN_LIBRARY,
  PAGE_RECIPES,
  ALLOWED_ICON_FAMILIES,
} from "../src/design-system/token-compiler.mjs";

describe("token compiler", () => {
  it("exports VERSION string", () => {
    assert.equal(typeof VERSION, "string");
    assert.equal(VERSION, "1.0.0");
  });

  it("COLOR_PALETTE has 14 colors with hex and role", () => {
    const keys = Object.keys(COLOR_PALETTE);
    assert.equal(keys.length, 14);
    for (const k of keys) {
      assert.ok(COLOR_PALETTE[k].hex.startsWith("#"), `${k} missing hex`);
      assert.ok(COLOR_PALETTE[k].role, `${k} missing role`);
    }
  });

  it("SEMANTIC_TOKENS has 14 tokens referencing palette hex values", () => {
    const keys = Object.keys(SEMANTIC_TOKENS);
    assert.equal(keys.length, 14);
    for (const k of keys) {
      assert.ok(SEMANTIC_TOKENS[k].startsWith("#"), `${k} missing hex`);
    }
  });

  it("TYPE_SCALE has 12 scale levels", () => {
    assert.equal(Object.keys(TYPE_SCALE).length, 12);
  });

  it("SPACING_TOKENS has 18 spacing values", () => {
    assert.equal(Object.keys(SPACING_TOKENS).length, 18);
  });

  it("RADIUS_TOKENS has 7 radius values", () => {
    assert.equal(Object.keys(RADIUS_TOKENS).length, 7);
  });

  it("SHADOW_TOKENS has 6 shadow values", () => {
    assert.equal(Object.keys(SHADOW_TOKENS).length, 6);
  });

  it("GRADIENT_TOKENS has 3 gradient values", () => {
    assert.equal(Object.keys(GRADIENT_TOKENS).length, 3);
  });

  it("ELEVATION_TOKENS has 6 elevation levels", () => {
    assert.equal(Object.keys(ELEVATION_TOKENS).length, 6);
  });

  it("BREAKPOINT_TOKENS has 5 breakpoints", () => {
    assert.equal(Object.keys(BREAKPOINT_TOKENS).length, 5);
  });

  it("CONTAINER_TOKENS has 5 containers", () => {
    assert.equal(Object.keys(CONTAINER_TOKENS).length, 5);
  });

  it("GRID_TOKENS has columns, gutter, margin", () => {
    assert.equal(GRID_TOKENS["grid-columns"], 12);
    assert.ok(GRID_TOKENS["grid-gutter"]);
    assert.ok(GRID_TOKENS["grid-margin"]);
  });

  it("MOTION_TOKENS has 5 durations and 4 easings", () => {
    const durations = Object.keys(MOTION_TOKENS).filter(k => k.startsWith("duration-"));
    const easings   = Object.keys(MOTION_TOKENS).filter(k => k.startsWith("easing-"));
    assert.equal(durations.length, 5);
    assert.equal(easings.length, 4);
  });

  it("COMPONENT_REGISTRY has 7 components", () => {
    assert.equal(Object.keys(COMPONENT_REGISTRY).length, 7);
  });

  it("PATTERN_LIBRARY has 6 patterns", () => {
    assert.equal(Object.keys(PATTERN_LIBRARY).length, 6);
  });

  it("PAGE_RECIPES has 4 page types", () => {
    assert.equal(Object.keys(PAGE_RECIPES).length, 4);
  });
});

describe("validateHex", () => {
  it("accepts palette black", () => {
    assert.ok(validateHex("#000000").valid);
  });

  it("accepts palette azure", () => {
    assert.ok(validateHex("#2563EB").valid);
  });

  it("rejects arbitrary hex not in palette", () => {
    assert.ok(!validateHex("#FF5733").valid);
  });

  it("rejects invalid hex format", () => {
    assert.ok(!validateHex("red").valid);
  });

  it("rejects empty string", () => {
    assert.ok(!validateHex("").valid);
  });

  it("rejects null", () => {
    assert.ok(!validateHex(null).valid);
  });
});

describe("validateSpacing", () => {
  it("accepts 1rem", () => {
    assert.ok(validateSpacing("1rem").valid);
  });

  it("accepts 0", () => {
    assert.ok(validateSpacing("0").valid);
  });

  it("accepts 0.5rem", () => {
    assert.ok(validateSpacing("0.5rem").valid);
  });

  it("accepts 16px (maps to 1rem)", () => {
    assert.ok(validateSpacing("16px").valid);
  });

  it("rejects arbitrary 1.23rem", () => {
    assert.ok(!validateSpacing("1.23rem").valid);
  });

  it("rejects arbitrary 25px (1.5625rem not in scale)", () => {
    assert.ok(!validateSpacing("25px").valid);
  });

  it("rejects null", () => {
    assert.ok(!validateSpacing(null).valid);
  });
});

describe("validateRadius", () => {
  it("accepts 0.5rem", () => {
    assert.ok(validateRadius("0.5rem").valid);
  });

  it("accepts 9999px", () => {
    assert.ok(validateRadius("9999px").valid);
  });

  it("rejects arbitrary 0.33rem", () => {
    assert.ok(!validateRadius("0.33rem").valid);
  });
});

describe("validateShadow", () => {
  it("accepts shadow-md", () => {
    assert.ok(validateShadow("shadow-md").valid);
  });

  it("accepts none", () => {
    assert.ok(validateShadow("none").valid);
  });

  it("rejects arbitrary shadow", () => {
    assert.ok(!validateShadow("0 2px 8px rgba(0,0,0,0.2)").valid);
  });
});

describe("validateGradient", () => {
  it("accepts gradient-brand", () => {
    assert.ok(validateGradient("gradient-brand").valid);
  });

  it("rejects arbitrary linear-gradient", () => {
    assert.ok(!validateGradient("linear-gradient(45deg, #FF5733, #33FF57)").valid);
  });

  it("accepts null", () => {
    assert.ok(validateGradient(null).valid);
  });
});

describe("validateTypography", () => {
  it("accepts h1", () => {
    assert.ok(validateTypography("h1").valid);
  });

  it("accepts display-lg", () => {
    assert.ok(validateTypography("display-lg").valid);
  });

  it("accepts code", () => {
    assert.ok(validateTypography("code").valid);
  });

  it("rejects unknown token", () => {
    assert.ok(!validateTypography("body-xxl").valid);
  });

  it("rejects null", () => {
    assert.ok(!validateTypography(null).valid);
  });
});

describe("validateBreakpoint", () => {
  it("accepts bp-md", () => {
    assert.ok(validateBreakpoint("bp-md").valid);
  });

  it("rejects bp-sm_md", () => {
    assert.ok(!validateBreakpoint("bp-sm_md").valid);
  });
});

describe("validateComponent", () => {
  it("accepts button", () => {
    assert.ok(validateComponent("button").valid);
  });

  it("accepts card", () => {
    assert.ok(validateComponent("card").valid);
  });

  it("rejects toaster", () => {
    assert.ok(!validateComponent("toaster").valid);
  });
});

describe("validateIconFamily", () => {
  it("accepts phosphor", () => {
    assert.ok(validateIconFamily("phosphor").valid);
  });

  it("accepts radix", () => {
    assert.ok(validateIconFamily("radix").valid);
  });

  it("accepts tabler", () => {
    assert.ok(validateIconFamily("tabler").valid);
  });

  it("rejects fontawesome", () => {
    assert.ok(!validateIconFamily("fontawesome").valid);
  });

  it("rejects material-icons", () => {
    assert.ok(!validateIconFamily("material-icons").valid);
  });
});

describe("validateElevationToken", () => {
  it("accepts elevation-0", () => {
    assert.ok(validateElevationToken("elevation-0").valid);
  });

  it("accepts elevation-5", () => {
    assert.ok(validateElevationToken("elevation-5").valid);
  });

  it("rejects elevation-99", () => {
    assert.ok(!validateElevationToken("elevation-99").valid);
  });
});

describe("validatePattern", () => {
  it("accepts hero-section", () => {
    assert.ok(validatePattern("hero-section").valid);
  });

  it("accepts feature-grid", () => {
    assert.ok(validatePattern("feature-grid").valid);
  });

  it("accepts footer", () => {
    assert.ok(validatePattern("footer").valid);
  });

  it("rejects unknown pattern", () => {
    assert.ok(!validatePattern("mega-footer-2000").valid);
  });
});

describe("compileBrandSpec", () => {
  it("compiles valid brand input", () => {
    const result = compileBrandSpec({
      colors: { primary: "#2563EB", text: "#1A1A2E" },
      typography: { heading: "h1", body: "body-md" },
      spacing: { sm: "0.5rem", md: "1rem" },
      radius: { md: "0.5rem" },
      components: ["button", "card"],
      patterns: ["hero-section"],
    });
    assert.equal(result.valid, true);
    assert.equal(result.errors.length, 0);
    assert.ok(result.tokens.colors);
    assert.ok(result.tokens.typography);
  });

  it("rejects arbitrary hex in brand input", () => {
    const result = compileBrandSpec({
      colors: { primary: "#FF5733" },
    });
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes("#FF5733")));
  });

  it("rejects arbitrary spacing in brand input", () => {
    const result = compileBrandSpec({
      spacing: { gap: "1.23rem" },
    });
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes("1.23rem")));
  });

  it("rejects unknown component", () => {
    const result = compileBrandSpec({
      components: ["button", "toaster"],
    });
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes("toaster")));
  });

  it("rejects unknown pattern", () => {
    const result = compileBrandSpec({
      patterns: ["hero-section", "mega-footer-2000"],
    });
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes("mega-footer-2000")));
  });

  it("validates all four page recipes exist", () => {
    const recipes = ["landing", "about", "contact", "pricing"];
    for (const r of recipes) {
      assert.ok(PAGE_RECIPES[r], `Recipe ${r} missing`);
      assert.ok(PAGE_RECIPES[r].patterns.length > 0, `${r} has no patterns`);
    }
  });
});
