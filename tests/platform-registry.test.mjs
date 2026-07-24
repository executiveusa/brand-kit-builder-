import { test } from "node:test";
import assert from "node:assert/strict";
import {
  PLATFORM_REGISTRY_VERSION,
  PLATFORM_IDS,
  PLATFORM_SPECS,
  getPlatformSpec,
  getPlatformFormat,
  listPlatforms,
  listFormats,
  validatePlatformAsset
} from "../src/platforms/platform-registry.mjs";

test("platform registry defines 12 platforms", () => {
  assert.equal(PLATFORM_IDS.length, 12);
  for (const id of ["instagram", "linkedin", "youtube", "tiktok", "facebook", "x", "email", "web", "print", "presentation", "proposal", "advertising"]) {
    assert.ok(PLATFORM_IDS.includes(id), `Platform ${id} must be defined`);
  }
});

test("every platform spec has required fields", () => {
  for (const id of PLATFORM_IDS) {
    const spec = PLATFORM_SPECS[id];
    assert.ok(spec.id, `Platform ${id} missing id`);
    assert.ok(spec.name, `Platform ${id} missing name`);
    assert.ok(spec.version, `Platform ${id} missing version`);
    assert.ok(spec.retrieved_at, `Platform ${id} missing retrieved_at`);
    assert.ok(spec.source, `Platform ${id} missing source`);
    assert.ok(Array.isArray(spec.formats), `Platform ${id} missing formats`);
    assert.ok(spec.formats.length > 0, `Platform ${id} must have at least one format`);
    assert.ok(spec.accessibility_constraints, `Platform ${id} missing accessibility_constraints`);
    assert.ok(spec.tone_guidance, `Platform ${id} missing tone_guidance`);
    assert.ok(spec.tone_guidance.en, `Platform ${id} missing tone_guidance.en`);
    assert.ok(spec.tone_guidance.es, `Platform ${id} missing tone_guidance.es`);
  }
});

test("every format has dimensions and safe_zone", () => {
  for (const id of PLATFORM_IDS) {
    const spec = PLATFORM_SPECS[id];
    for (const format of spec.formats) {
      assert.ok(format.id, `Format in ${id} missing id`);
      assert.ok(format.name, `Format ${format.id} in ${id} missing name`);
      assert.ok(format.aspect_ratio, `Format ${format.id} in ${id} missing aspect_ratio`);
      assert.ok(format.dimensions, `Format ${format.id} in ${id} missing dimensions`);
      assert.ok(format.dimensions.width, `Format ${format.id} in ${id} missing dimensions.width`);
      assert.ok(format.dimensions.unit, `Format ${format.id} in ${id} missing dimensions.unit`);
      assert.ok(format.safe_zone, `Format ${format.id} in ${id} missing safe_zone`);
      assert.ok(Array.isArray(format.file_types), `Format ${format.id} in ${id} missing file_types`);
    }
  }
});

test("getPlatformSpec returns valid spec", () => {
  const spec = getPlatformSpec("instagram");
  assert.equal(spec.id, "instagram");
  assert.equal(spec.name, "Instagram");
});

test("getPlatformSpec throws for unknown platform", () => {
  assert.throws(() => getPlatformSpec("unknown"), /Unknown platform/);
});

test("getPlatformFormat returns valid format", () => {
  const format = getPlatformFormat("instagram", "feed-square");
  assert.equal(format.id, "feed-square");
  assert.equal(format.aspect_ratio, "1:1");
});

test("getPlatformFormat throws for unknown format", () => {
  assert.throws(() => getPlatformFormat("instagram", "unknown"), /Unknown format/);
});

test("listPlatforms returns all platforms with metadata", () => {
  const platforms = listPlatforms();
  assert.equal(platforms.length, 12);
  for (const p of platforms) {
    assert.ok(p.id);
    assert.ok(p.name);
    assert.ok(p.format_count > 0);
    assert.ok(p.version);
    assert.ok(p.retrieved_at);
  }
});

test("listFormats returns all formats for a platform", () => {
  const formats = listFormats("instagram");
  assert.ok(formats.length >= 3);
  for (const f of formats) {
    assert.ok(f.id);
    assert.ok(f.name);
    assert.ok(f.aspect_ratio);
    assert.ok(f.dimensions);
  }
});

test("validatePlatformAsset passes for valid asset", () => {
  const result = validatePlatformAsset("instagram", "feed-square", {
    width: 1080,
    height: 1080,
    file_type: "jpg",
    file_size_mb: 5
  });
  assert.equal(result.valid, true);
  assert.equal(result.errors.length, 0);
});

test("validatePlatformAsset fails for dimension mismatch", () => {
  const result = validatePlatformAsset("instagram", "feed-square", {
    width: 800,
    height: 800,
    file_type: "jpg"
  });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.includes("Dimensions mismatch")));
});

test("validatePlatformAsset fails for unsupported file type", () => {
  const result = validatePlatformAsset("instagram", "feed-square", {
    width: 1080,
    height: 1080,
    file_type: "bmp"
  });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.includes("File type not supported")));
});

test("validatePlatformAsset fails for oversized file", () => {
  const result = validatePlatformAsset("instagram", "feed-square", {
    width: 1080,
    height: 1080,
    file_type: "jpg",
    file_size_mb: 50
  });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.includes("File too large")));
});

test("validatePlatformAsset warns for text length over limit", () => {
  const result = validatePlatformAsset("instagram", "feed-square", {
    width: 1080,
    height: 1080,
    file_type: "jpg",
    text_length: 3000
  });
  assert.equal(result.valid, true);
  assert.ok(result.warnings.some((w) => w.includes("Text length")));
});

test("validatePlatformAsset fails for video duration over limit", () => {
  const result = validatePlatformAsset("youtube", "short", {
    width: 1080,
    height: 1920,
    file_type: "mp4",
    video_duration_s: 120
  });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.includes("Video duration")));
});

test("validatePlatformAsset warns for low contrast", () => {
  const result = validatePlatformAsset("instagram", "feed-square", {
    width: 1080,
    height: 1080,
    file_type: "jpg",
    contrast_ratio: 2.0
  });
  assert.equal(result.valid, true);
  assert.ok(result.warnings.some((w) => w.includes("Contrast")));
});

test("print formats include bleed and DPI", () => {
  const spec = getPlatformSpec("print");
  for (const format of spec.formats) {
    assert.ok(format.bleed, `Print format ${format.id} must have bleed`);
    assert.ok(format.resolution_dpi, `Print format ${format.id} must have resolution_dpi`);
    assert.ok(format.color_profile, `Print format ${format.id} must have color_profile`);
  }
});

test("bilingual tone guidance for all platforms", () => {
  for (const id of PLATFORM_IDS) {
    const spec = PLATFORM_SPECS[id];
    assert.ok(spec.tone_guidance.en, `Platform ${id} must have English tone guidance`);
    assert.ok(spec.tone_guidance.es, `Platform ${id} must have Spanish tone guidance`);
  }
});

test("accessibility constraints defined for all platforms", () => {
  for (const id of PLATFORM_IDS) {
    const spec = PLATFORM_SPECS[id];
    assert.ok(spec.accessibility_constraints, `Platform ${id} must have accessibility constraints`);
    assert.ok(spec.accessibility_constraints.min_contrast_ratio, `Platform ${id} must define min contrast ratio`);
  }
});

test("instagram has at least 4 formats", () => {
  const spec = getPlatformSpec("instagram");
  assert.ok(spec.formats.length >= 4, "Instagram should have feed-square, feed-portrait, story, reel");
});

test("web platform includes OG image format", () => {
  const spec = getPlatformSpec("web");
  assert.ok(spec.formats.find((f) => f.id === "og-image"), "Web platform must include Open Graph image format");
});

test("web platform includes favicon format", () => {
  const spec = getPlatformSpec("web");
  assert.ok(spec.formats.find((f) => f.id === "favicon"), "Web platform must include favicon format");
});
