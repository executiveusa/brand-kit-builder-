/**
 * Asset Production — Phase 14: BKB-ASSET-001
 *
 * Asset types, export formats, validation rules, and production pipeline
 * for Pauli Brand Studio.
 */

const VERSION = "1.0.0";

/* ─── Asset Types ───────────────────────────────────────────────────────── */

const ASSET_TYPES = {
  logo: {
    id: "logo",
    name: "Logo",
    description: "Brand mark, wordmark, or lockup",
    formats: ["svg", "png", "pdf", "ico"],
    densities: ["1x", "2x", "3x"],
    max_colors: 8,
    min_width: 32,
    min_height: 32,
    max_width: 2000,
    max_height: 2000,
    requires_transparency: true,
  },
  pattern: {
    id: "pattern",
    name: "Pattern",
    description: "Repeatable background pattern",
    formats: ["svg", "png"],
    densities: ["1x", "2x"],
    max_colors: 6,
    min_width: 64,
    min_height: 64,
    max_width: 512,
    max_height: 512,
    requires_transparency: false,
    tileable: true,
  },
  texture: {
    id: "texture",
    name: "Texture",
    description: "Subtle background texture",
    formats: ["png", "jpg"],
    densities: ["1x", "2x"],
    max_colors: 3,
    min_width: 256,
    min_height: 256,
    max_width: 2048,
    max_height: 2048,
    requires_transparency: false,
    tileable: true,
  },
  illustration: {
    id: "illustration",
    name: "Illustration",
    description: "Custom illustration or graphic",
    formats: ["svg", "png"],
    densities: ["1x", "2x", "3x"],
    max_colors: 16,
    min_width: 200,
    min_height: 200,
    max_width: 4000,
    max_height: 4000,
    requires_transparency: true,
  },
  icon: {
    id: "icon",
    name: "Icon",
    description: "UI icon or symbol",
    formats: ["svg", "png"],
    densities: ["1x", "2x", "3x"],
    max_colors: 2,
    min_width: 16,
    min_height: 16,
    max_width: 256,
    max_height: 256,
    requires_transparency: true,
    grid: "24x24 or 48x48",
  },
  badge: {
    id: "badge",
    name: "Badge",
    description: "Badge, seal, or certification mark",
    formats: ["svg", "png"],
    densities: ["1x", "2x", "3x"],
    max_colors: 6,
    min_width: 64,
    min_height: 64,
    max_width: 512,
    max_height: 512,
    requires_transparency: true,
  },
  social_card: {
    id: "social_card",
    name: "Social Card",
    description: "Open Graph / social media preview card",
    formats: ["png", "jpg"],
    densities: ["1x"],
    max_colors: 16,
    min_width: 600,
    min_height: 314,
    max_width: 1200,
    max_height: 630,
    requires_transparency: false,
    aspect_ratio: "1.91:1",
  },
  email_header: {
    id: "email_header",
    name: "Email Header",
    description: "Email signature or header graphic",
    formats: ["png", "jpg"],
    densities: ["1x", "2x"],
    max_colors: 8,
    min_width: 200,
    min_height: 60,
    max_width: 600,
    max_height: 200,
    requires_transparency: false,
  },
};

/* ─── Export Format Specs ────────────────────────────────────────────────── */

const EXPORT_FORMATS = {
  svg: {
    extension: ".svg",
    mime: "image/svg+xml",
    color_mode: "RGB",
    supports_transparency: true,
    scalable: true,
    use: "Web, digital, scalable",
  },
  png: {
    extension: ".png",
    mime: "image/png",
    color_mode: "RGBA",
    supports_transparency: true,
    scalable: false,
    use: "Web fallback, email, social",
    quality: 100,
  },
  jpg: {
    extension: ".jpg",
    mime: "image/jpeg",
    color_mode: "RGB",
    supports_transparency: false,
    scalable: false,
    use: "Photos, backgrounds, social",
    quality: 85,
  },
  pdf: {
    extension: ".pdf",
    mime: "application/pdf",
    color_mode: "CMYK",
    supports_transparency: true,
    scalable: true,
    use: "Print, legal, formal",
  },
  ico: {
    extension: ".ico",
    mime: "image/x-icon",
    color_mode: "RGBA",
    supports_transparency: true,
    scalable: false,
    use: "Browser favicon",
    sizes: [16, 32, 48],
  },
  webp: {
    extension: ".webp",
    mime: "image/webp",
    color_mode: "RGBA",
    supports_transparency: true,
    scalable: false,
    use: "Modern web, performance",
    quality: 85,
  },
};

/* ─── Production Pipeline Stages ────────────────────────────────────────── */

const PRODUCTION_STAGES = [
  { id: "design",    name: "Design",      description: "Create initial asset design" },
  { id: "review",    name: "Review",      description: "Design review and feedback" },
  { id: "refine",    name: "Refine",      description: "Apply feedback and polish" },
  { id: "validate",  name: "Validate",    description: "Run validation rules" },
  { id: "export",    name: "Export",      description: "Export all required formats" },
  { id: "qc",        name: "QC",          description: "Quality check exported files" },
  { id: "deliver",   name: "Deliver",     description: "Package and deliver assets" },
];

/* ─── Validation Functions ──────────────────────────────────────────────── */

export function validateAssetType(type) {
  const valid = type in ASSET_TYPES;
  return { valid, error: valid ? null : `Unknown asset type: ${type}` };
}

export function validateAssetFormat(assetType, format) {
  const type = ASSET_TYPES[assetType];
  if (!type) return { valid: false, error: `Unknown asset type: ${assetType}` };
  const valid = type.formats.includes(format);
  return {
    valid,
    error: valid ? null : `Format "${format}" not supported for ${assetType}. Allowed: ${type.formats.join(", ")}`,
  };
}

export function validateAssetDimensions(assetType, width, height) {
  const type = ASSET_TYPES[assetType];
  if (!type) return { valid: false, error: `Unknown asset type: ${assetType}` };
  const errors = [];
  if (width < type.min_width) errors.push(`Width ${width}px below minimum ${type.min_width}px`);
  if (width > type.max_width) errors.push(`Width ${width}px exceeds maximum ${type.max_width}px`);
  if (height < type.min_height) errors.push(`Height ${height}px below minimum ${type.min_height}px`);
  if (height > type.max_height) errors.push(`Height ${height}px exceeds maximum ${type.max_height}px`);
  return { valid: errors.length === 0, errors };
}

export function validateAssetColors(assetType, colorCount) {
  const type = ASSET_TYPES[assetType];
  if (!type) return { valid: false, error: `Unknown asset type: ${assetType}` };
  const valid = colorCount <= type.max_colors;
  return {
    valid,
    error: valid ? null : `Color count ${colorCount} exceeds maximum ${type.max_colors} for ${assetType}`,
  };
}

export function validateExportFormat(format) {
  return { valid: format in EXPORT_FORMATS, format: EXPORT_FORMATS[format] || null };
}

export function validateProductionStage(stage) {
  const valid = PRODUCTION_STAGES.some(s => s.id === stage);
  return { valid, error: valid ? null : `Unknown production stage: ${stage}` };
}

/* ─── Asset Spec Creator ─────────────────────────────────────────────────── */

export function createAssetSpec(type, overrides = {}) {
  const assetType = ASSET_TYPES[type];
  if (!assetType) return null;
  return {
    type,
    name: overrides.name || `Untitled ${assetType.name}`,
    formats: overrides.formats || assetType.formats,
    densities: overrides.densities || assetType.densities,
    dimensions: overrides.dimensions || { width: assetType.min_width, height: assetType.min_height },
    colors: overrides.colors || [],
    status: "draft",
    stage: "design",
    created_at: new Date().toISOString(),
    version: overrides.version || "1.0.0",
  };
}

/* ─── Exports ────────────────────────────────────────────────────────────── */

export {
  VERSION,
  ASSET_TYPES,
  EXPORT_FORMATS,
  PRODUCTION_STAGES,
};
