import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  VERSION,
  BRAND_BOOK_SECTIONS,
  createBrandBookData,
  renderBrandBook,
  renderCoverSection,
  renderPaletteSection,
  renderTypographySection,
  renderSpacingSection,
  renderComponentsSection,
  renderPatternsSection,
  renderLogosSection,
  renderFontsSection,
  renderAssetsSection,
  renderGuardiansSection,
  renderMotionSection,
  renderIconsSection,
  validateBrandBook,
  getSectionById,
} from "../src/design-system/kaku-renderer.mjs";

describe("KAKU renderer", () => {
  it("exports VERSION string", () => {
    assert.equal(VERSION, "1.0.0");
  });

  it("BRAND_BOOK_SECTIONS has 12 sections", () => {
    assert.equal(BRAND_BOOK_SECTIONS.length, 12);
  });

  it("every section has id, name, description", () => {
    for (const section of BRAND_BOOK_SECTIONS) {
      assert.ok(section.id);
      assert.ok(section.name);
      assert.ok(section.description);
    }
  });

  it("section ids are unique", () => {
    const ids = BRAND_BOOK_SECTIONS.map(s => s.id);
    assert.equal(new Set(ids).size, ids.length);
  });
});

describe("createBrandBookData", () => {
  it("creates brand book data with defaults", () => {
    const data = createBrandBookData({});
    assert.equal(data.brand_name, "Untitled Brand");
    assert.equal(data.version, "1.0.0");
    assert.ok(data.created_at);
    assert.equal(data.metadata.generator, "KAKU Visual Brand Book Renderer");
  });

  it("creates brand book with custom name", () => {
    const data = createBrandBookData({ brand_name: "Acme Corp" });
    assert.equal(data.brand_name, "Acme Corp");
  });
});

describe("section renderers", () => {
  it("renderCoverSection returns cover data", () => {
    const cover = renderCoverSection({ brand_name: "Acme", tagline: "Build better" });
    assert.equal(cover.id, "cover");
    assert.equal(cover.brand_name, "Acme");
    assert.equal(cover.tagline, "Build better");
  });

  it("renderPaletteSection returns palette data", () => {
    const palette = renderPaletteSection({ primary: "#FF0000", secondary: "#00FF00" });
    assert.equal(palette.id, "palette");
    assert.equal(palette.total_colors, 2);
    assert.ok(palette.colors.some(c => c.hex === "#FF0000"));
  });

  it("renderTypographySection returns typography data", () => {
    const typo = renderTypographySection({ heading: "Playfair Display", body: "Inter" });
    assert.equal(typo.id, "typography");
    assert.equal(typo.heading_font, "Playfair Display");
    assert.equal(typo.body_font, "Inter");
  });

  it("renderSpacingSection returns spacing data", () => {
    const spacing = renderSpacingSection({ base_unit: "0.5rem" });
    assert.equal(spacing.id, "spacing");
    assert.equal(spacing.base_unit, "0.5rem");
    assert.equal(spacing.grid_columns, 12);
  });

  it("renderComponentsSection returns components data", () => {
    const comps = renderComponentsSection({ button: { variants: ["primary"] } });
    assert.equal(comps.id, "components");
    assert.equal(comps.total_components, 1);
  });

  it("renderPatternsSection returns patterns data", () => {
    const patterns = renderPatternsSection(
      { hero: { name: "Hero" } },
      { landing: { patterns: ["hero"] } }
    );
    assert.equal(patterns.id, "patterns");
    assert.equal(patterns.total_patterns, 1);
    assert.equal(patterns.page_recipes.length, 1);
  });

  it("renderLogosSection returns logos data", () => {
    const logos = renderLogosSection(
      { primary: { name: "Primary", min_width_px: 120 } },
      { clear_space: { minimum_px: 16 } }
    );
    assert.equal(logos.id, "logos");
    assert.equal(logos.types.length, 1);
  });

  it("renderFontsSection returns fonts data", () => {
    const fonts = renderFontsSection(
      { Inter: { category: "sans-serif", weights: [400, 700] } },
      [{ heading: "Inter", body: "Lora" }]
    );
    assert.equal(fonts.id, "fonts");
    assert.equal(fonts.total_fonts, 1);
  });

  it("renderAssetsSection returns assets data", () => {
    const assets = renderAssetsSection(
      { logo: {}, pattern: {} },
      { svg: {}, png: {} }
    );
    assert.equal(assets.id, "assets");
    assert.equal(assets.asset_types.length, 2);
  });

  it("renderGuardiansSection returns guardians data", () => {
    const guardians = renderGuardiansSection({
      design: { name: "Design", rules: [{ id: "r1" }], pass_threshold: 0.9, weight: 0.25 },
    });
    assert.equal(guardians.id, "guardians");
    assert.equal(guardians.total_guardians, 1);
    assert.equal(guardians.total_rules, 1);
  });

  it("renderMotionSection returns motion data", () => {
    const motion = renderMotionSection({
      "duration-fast": "100ms",
      "easing-default": "cubic-bezier(0.4, 0, 0.2, 1)",
    });
    assert.equal(motion.id, "motion");
    assert.equal(motion.durations.length, 1);
    assert.equal(motion.easings.length, 1);
  });

  it("renderIconsSection returns icons data", () => {
    const icons = renderIconsSection({}, ["phosphor", "tabler"]);
    assert.equal(icons.id, "icons");
    assert.equal(icons.allowed_families.length, 2);
    assert.equal(icons.usage_rules.length, 4);
  });
});

describe("renderBrandBook", () => {
  it("renders full brand book with all 12 sections", () => {
    const book = renderBrandBook({
      brand_name: "Acme Corp",
      tagline: "Build better",
      colors: { primary: "#FF0000" },
      typography: { heading: "Inter" },
    });
    assert.equal(book.brand_name, "Acme Corp");
    assert.equal(book.metadata.sections_rendered, 12);
    assert.ok(book.sections.cover);
    assert.ok(book.sections.palette);
    assert.ok(book.sections.typography);
    assert.ok(book.sections.spacing);
    assert.ok(book.sections.components);
    assert.ok(book.sections.patterns);
    assert.ok(book.sections.logos);
    assert.ok(book.sections.fonts);
    assert.ok(book.sections.assets);
    assert.ok(book.sections.guardians);
    assert.ok(book.sections.motion);
    assert.ok(book.sections.icons);
  });

  it("uses defaults for missing input", () => {
    const book = renderBrandBook({});
    assert.equal(book.brand_name, "Untitled Brand");
    assert.equal(book.metadata.sections_rendered, 12);
  });
});

describe("validateBrandBook", () => {
  it("validates complete brand book", () => {
    const book = renderBrandBook({ brand_name: "Test" });
    const result = validateBrandBook(book);
    assert.equal(result.valid, true);
    assert.equal(result.errors.length, 0);
    assert.equal(result.sections_present, 12);
  });

  it("rejects book missing brand_name", () => {
    const result = validateBrandBook({ sections: {}, metadata: {} });
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes("brand_name")));
  });

  it("rejects book missing sections", () => {
    const result = validateBrandBook({ brand_name: "Test", metadata: {} });
    assert.equal(result.valid, false);
  });

  it("rejects book missing section", () => {
    const book = renderBrandBook({ brand_name: "Test" });
    delete book.sections.motion;
    const result = validateBrandBook(book);
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes("Motion")));
  });
});

describe("getSectionById", () => {
  it("returns section by id", () => {
    const book = renderBrandBook({ brand_name: "Test" });
    const section = getSectionById(book, "palette");
    assert.ok(section);
    assert.equal(section.id, "palette");
  });

  it("returns null for unknown section", () => {
    const book = renderBrandBook({ brand_name: "Test" });
    assert.equal(getSectionById(book, "nonexistent"), null);
  });

  it("returns null for null book", () => {
    assert.equal(getSectionById(null, "palette"), null);
  });
});
