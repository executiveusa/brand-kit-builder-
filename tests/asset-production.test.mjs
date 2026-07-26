import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  VERSION,
  ASSET_TYPES,
  EXPORT_FORMATS,
  PRODUCTION_STAGES,
  validateAssetType,
  validateAssetFormat,
  validateAssetDimensions,
  validateAssetColors,
  validateExportFormat,
  validateProductionStage,
  createAssetSpec,
} from "../src/design-system/asset-production.mjs";

describe("asset production", () => {
  it("exports VERSION string", () => {
    assert.equal(VERSION, "1.0.0");
  });

  it("ASSET_TYPES has 8 types", () => {
    assert.equal(Object.keys(ASSET_TYPES).length, 8);
  });

  it("every asset type has required fields", () => {
    for (const [id, type] of Object.entries(ASSET_TYPES)) {
      assert.equal(type.id, id);
      assert.ok(type.name);
      assert.ok(type.description);
      assert.ok(Array.isArray(type.formats));
      assert.ok(Array.isArray(type.densities));
      assert.ok(type.max_colors > 0);
      assert.ok(type.min_width > 0);
      assert.ok(type.min_height > 0);
    }
  });

  it("EXPORT_FORMATS has 6 formats", () => {
    assert.equal(Object.keys(EXPORT_FORMATS).length, 6);
  });

  it("every export format has extension, mime, color_mode", () => {
    for (const [id, fmt] of Object.entries(EXPORT_FORMATS)) {
      assert.ok(fmt.extension.startsWith("."), `${id} missing extension`);
      assert.ok(fmt.mime, `${id} missing mime`);
      assert.ok(fmt.color_mode, `${id} missing color_mode`);
    }
  });

  it("PRODUCTION_STAGES has 7 stages", () => {
    assert.equal(PRODUCTION_STAGES.length, 7);
  });

  it("production stages are in order", () => {
    const ids = PRODUCTION_STAGES.map(s => s.id);
    assert.deepEqual(ids, ["design", "review", "refine", "validate", "export", "qc", "deliver"]);
  });

  it("logo type requires transparency", () => {
    assert.equal(ASSET_TYPES.logo.requires_transparency, true);
  });

  it("pattern type is tileable", () => {
    assert.equal(ASSET_TYPES.pattern.tileable, true);
  });

  it("social_card has aspect ratio", () => {
    assert.equal(ASSET_TYPES.social_card.aspect_ratio, "1.91:1");
  });
});

describe("validateAssetType", () => {
  it("accepts logo", () => {
    assert.ok(validateAssetType("logo").valid);
  });

  it("accepts pattern", () => {
    assert.ok(validateAssetType("pattern").valid);
  });

  it("accepts social_card", () => {
    assert.ok(validateAssetType("social_card").valid);
  });

  it("rejects unknown type", () => {
    assert.ok(!validateAssetType("animation").valid);
  });
});

describe("validateAssetFormat", () => {
  it("accepts svg for logo", () => {
    assert.ok(validateAssetFormat("logo", "svg").valid);
  });

  it("accepts png for logo", () => {
    assert.ok(validateAssetFormat("logo", "png").valid);
  });

  it("rejects jpg for logo", () => {
    assert.ok(!validateAssetFormat("logo", "jpg").valid);
  });

  it("accepts jpg for social_card", () => {
    assert.ok(validateAssetFormat("social_card", "jpg").valid);
  });

  it("rejects unknown type", () => {
    assert.ok(!validateAssetFormat("animation", "svg").valid);
  });
});

describe("validateAssetDimensions", () => {
  it("accepts valid logo dimensions", () => {
    assert.ok(validateAssetDimensions("logo", 200, 100).valid);
  });

  it("rejects undersized logo", () => {
    const result = validateAssetDimensions("logo", 16, 16);
    assert.ok(!result.valid);
    assert.ok(result.errors.some(e => e.includes("below minimum")));
  });

  it("rejects oversized logo", () => {
    const result = validateAssetDimensions("logo", 5000, 5000);
    assert.ok(!result.valid);
    assert.ok(result.errors.some(e => e.includes("exceeds maximum")));
  });

  it("rejects unknown type", () => {
    assert.ok(!validateAssetDimensions("animation", 100, 100).valid);
  });
});

describe("validateAssetColors", () => {
  it("accepts valid color count", () => {
    assert.ok(validateAssetColors("logo", 4).valid);
  });

  it("rejects too many colors", () => {
    const result = validateAssetColors("icon", 5);
    assert.ok(!result.valid);
    assert.ok(result.error.includes("exceeds maximum"));
  });

  it("rejects unknown type", () => {
    assert.ok(!validateAssetColors("animation", 4).valid);
  });
});

describe("validateExportFormat", () => {
  it("accepts svg", () => {
    assert.ok(validateExportFormat("svg").valid);
  });

  it("accepts webp", () => {
    assert.ok(validateExportFormat("webp").valid);
  });

  it("rejects bmp", () => {
    assert.ok(!validateExportFormat("bmp").valid);
  });

  it("returns format details", () => {
    const result = validateExportFormat("svg");
    assert.equal(result.format.extension, ".svg");
  });
});

describe("validateProductionStage", () => {
  it("accepts design", () => {
    assert.ok(validateProductionStage("design").valid);
  });

  it("accepts deliver", () => {
    assert.ok(validateProductionStage("deliver").valid);
  });

  it("rejects unknown stage", () => {
    assert.ok(!validateProductionStage("publish").valid);
  });
});

describe("createAssetSpec", () => {
  it("creates spec for logo with defaults", () => {
    const spec = createAssetSpec("logo");
    assert.ok(spec);
    assert.equal(spec.type, "logo");
    assert.equal(spec.status, "draft");
    assert.equal(spec.stage, "design");
    assert.ok(spec.formats.includes("svg"));
    assert.ok(spec.created_at);
  });

  it("creates spec with overrides", () => {
    const spec = createAssetSpec("logo", { name: "My Logo", dimensions: { width: 200, height: 200 } });
    assert.equal(spec.name, "My Logo");
    assert.equal(spec.dimensions.width, 200);
  });

  it("returns null for unknown type", () => {
    assert.equal(createAssetSpec("animation"), null);
  });
});
