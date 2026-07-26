/**
 * KAKU Visual Brand Book Renderer — Phase 16: BKB-KAKU-001
 *
 * Compiles all design system data into a structured brand book format
 * with sections for colors, typography, spacing, components, patterns,
 * logos, fonts, and guardian reports.
 */

const VERSION = "1.0.0";

/* ─── Brand Book Sections ───────────────────────────────────────────────── */

const BRAND_BOOK_SECTIONS = [
  { id: "cover",      name: "Cover",              description: "Brand name, logo, tagline, version" },
  { id: "palette",    name: "Color Palette",      description: "All colors with hex, OKLCH, roles" },
  { id: "typography", name: "Typography",         description: "Type scale, font pairs, weight ranges" },
  { id: "spacing",    name: "Spacing & Layout",   description: "Spacing scale, breakpoints, grid" },
  { id: "components", name: "Components",         description: "Component library with tokens" },
  { id: "patterns",   name: "Patterns & Recipes", description: "Layout patterns and page recipes" },
  { id: "logos",      name: "Logo Usage",         description: "Logo types, placement, do's and don'ts" },
  { id: "fonts",      name: "Font Gallery",       description: "Available fonts, pairings, specimens" },
  { id: "assets",     name: "Asset Guidelines",   description: "Asset types, formats, production rules" },
  { id: "guardians",  name: "Quality Guardians",  description: "Guardian rules, thresholds, scoring" },
  { id: "motion",     name: "Motion & Animation", description: "Duration, easing, interaction patterns" },
  { id: "icons",      name: "Iconography",        description: "Icon families, sizes, usage rules" },
];

/* ─── Brand Book Data Structure ─────────────────────────────────────────── */

function createBrandBookData(brandInput) {
  return {
    version: VERSION,
    brand_name: brandInput.brand_name || "Untitled Brand",
    tagline: brandInput.tagline || "",
    created_at: new Date().toISOString(),
    sections: {},
    metadata: {
      generator: "KAKU Visual Brand Book Renderer",
      schema_version: "1.0.0",
      total_sections: BRAND_BOOK_SECTIONS.length,
    },
  };
}

/* ─── Section Renderers ─────────────────────────────────────────────────── */

function renderCoverSection(data) {
  return {
    id: "cover",
    brand_name: data.brand_name,
    tagline: data.tagline,
    version: data.version,
    logo_url: data.logo_url || null,
    primary_color: data.primary_color || "#1A1A2E",
    secondary_color: data.secondary_color || "#2563EB",
  };
}

function renderPaletteSection(colors) {
  return {
    id: "palette",
    colors: Object.entries(colors || {}).map(([name, hex]) => ({
      name,
      hex,
      oklch: null,
      role: "custom",
    })),
    total_colors: Object.keys(colors || {}).length,
  };
}

function renderTypographySection(typography) {
  return {
    id: "typography",
    heading_font: typography?.heading || "Inter",
    body_font: typography?.body || "Inter",
    mono_font: typography?.mono || "JetBrains Mono",
    type_scale: typography?.scale || "default",
    weight_range: typography?.weights || [400, 500, 600, 700],
  };
}

function renderSpacingSection(spacing) {
  return {
    id: "spacing",
    scale: spacing?.scale || "default",
    base_unit: spacing?.base_unit || "0.25rem",
    breakpoints: spacing?.breakpoints || ["640px", "768px", "1024px", "1280px", "1536px"],
    grid_columns: spacing?.grid_columns || 12,
    grid_gutter: spacing?.grid_gutter || "1.5rem",
  };
}

function renderComponentsSection(components) {
  return {
    id: "components",
    total_components: Object.keys(components || {}).length,
    components: Object.entries(components || {}).map(([name, config]) => ({
      name,
      variants: config.variants || [],
      tokens: config.tokens || {},
    })),
  };
}

function renderPatternsSection(patterns, recipes) {
  return {
    id: "patterns",
    total_patterns: Object.keys(patterns || {}).length,
    patterns: Object.entries(patterns || {}).map(([id, pattern]) => ({
      id,
      name: pattern.name || id,
      tokens: pattern.tokens || [],
      layout: pattern.layout || "default",
    })),
    page_recipes: Object.entries(recipes || {}).map(([id, recipe]) => ({
      id,
      patterns: recipe.patterns || [],
      required_sections: recipe.required_sections || [],
    })),
  };
}

function renderLogosSection(logoTypes, placementRules) {
  return {
    id: "logos",
    types: Object.entries(logoTypes || {}).map(([id, type]) => ({
      id,
      name: type.name,
      variants: type.variants || [],
      min_size: { width: type.min_width_px, height: type.min_height_px },
    })),
    placement: placementRules || {},
  };
}

function renderFontsSection(fontCatalog, pairings) {
  return {
    id: "fonts",
    total_fonts: Object.keys(fontCatalog || {}).length,
    fonts: Object.entries(fontCatalog || {}).map(([name, font]) => ({
      name,
      category: font.category,
      weights: font.weights || [],
      role: font.role || "body",
    })),
    sample_pairings: pairings || [],
  };
}

function renderAssetsSection(assetTypes, exportFormats) {
  return {
    id: "assets",
    asset_types: Object.keys(assetTypes || {}),
    export_formats: Object.keys(exportFormats || {}),
  };
}

function renderGuardiansSection(guardianTypes) {
  return {
    id: "guardians",
    total_guardians: Object.keys(guardianTypes || {}).length,
    guardians: Object.entries(guardianTypes || {}).map(([id, type]) => ({
      id,
      name: type.name,
      rules_count: type.rules?.length || 0,
      pass_threshold: type.pass_threshold,
      weight: type.weight,
    })),
    total_rules: Object.values(guardianTypes || {}).reduce((sum, g) => sum + (g.rules?.length || 0), 0),
  };
}

function renderMotionSection(motionTokens) {
  return {
    id: "motion",
    durations: Object.entries(motionTokens || {})
      .filter(([k]) => k.startsWith("duration-"))
      .map(([k, v]) => ({ name: k, value: v })),
    easings: Object.entries(motionTokens || {})
      .filter(([k]) => k.startsWith("easing-"))
      .map(([k, v]) => ({ name: k, value: v })),
  };
}

function renderIconsSection(iconFamilies, allowedFamilies) {
  return {
    id: "icons",
    allowed_families: allowedFamilies || ["phosphor", "radix", "tabler"],
    forbidden_families: ["fontawesome", "material-icons", "ionicons"],
    usage_rules: [
      "Use only approved icon families",
      "Maintain consistent icon weight within a context",
      "Icons must have accessible labels when interactive",
      "Do not use emoji as icons",
    ],
  };
}

/* ─── Full Brand Book Renderer ──────────────────────────────────────────── */

function renderBrandBook(brandInput) {
  const book = createBrandBookData(brandInput);

  book.sections.cover = renderCoverSection(brandInput);
  book.sections.palette = renderPaletteSection(brandInput.colors);
  book.sections.typography = renderTypographySection(brandInput.typography);
  book.sections.spacing = renderSpacingSection(brandInput.spacing);
  book.sections.components = renderComponentsSection(brandInput.components);
  book.sections.patterns = renderPatternsSection(brandInput.patterns, brandInput.recipes);
  book.sections.logos = renderLogosSection(brandInput.logo_types, brandInput.placement_rules);
  book.sections.fonts = renderFontsSection(brandInput.font_catalog, brandInput.pairings);
  book.sections.assets = renderAssetsSection(brandInput.asset_types, brandInput.export_formats);
  book.sections.guardians = renderGuardiansSection(brandInput.guardian_types);
  book.sections.motion = renderMotionSection(brandInput.motion_tokens);
  book.sections.icons = renderIconsSection(brandInput.icon_families, brandInput.allowed_icon_families);

  book.metadata.sections_rendered = Object.keys(book.sections).length;

  return book;
}

/* ─── Validation ─────────────────────────────────────────────────────────── */

export function validateBrandBook(book) {
  const errors = [];
  if (!book?.brand_name) errors.push("Missing brand_name");
  if (!book?.sections) errors.push("Missing sections");
  if (!book?.metadata) errors.push("Missing metadata");

  if (book?.sections) {
    for (const section of BRAND_BOOK_SECTIONS) {
      if (!book.sections[section.id]) {
        errors.push(`Missing section: ${section.name}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    sections_present: book?.sections ? Object.keys(book.sections).length : 0,
    sections_expected: BRAND_BOOK_SECTIONS.length,
  };
}

export function getSectionById(book, sectionId) {
  if (!book?.sections) return null;
  return book.sections[sectionId] || null;
}

/* ─── Exports ────────────────────────────────────────────────────────────── */

export {
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
};
