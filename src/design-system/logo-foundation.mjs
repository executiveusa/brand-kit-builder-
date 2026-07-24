/**
 * Logo Foundation — Phase 12: BKB-LOGO-001
 *
 * Logo types, SVG validation rules, placement rules, format requirements,
 * and usage guidelines for Pauli Brand Studio.
 */

const VERSION = "1.0.0";

/* ─── Logo Types ────────────────────────────────────────────────────────── */

const LOGO_TYPES = {
  primary: {
    id: "primary",
    name: "Primary Logo",
    description: "Full logo with mark + wordmark, preferred for most uses",
    usage: "Default choice for brand presence, headers, hero sections",
    variants: ["horizontal", "stacked"],
    min_width_px: 120,
    min_height_px: 40,
    max_width_px: 600,
    aspect_ratios: { horizontal: "3:1", stacked: "1:1.5" },
  },
  secondary: {
    id: "secondary",
    name: "Secondary Logo",
    description: "Compact version for constrained spaces",
    usage: "Small headers, footers, favicons, app icons",
    variants: ["horizontal", "compact"],
    min_width_px: 80,
    min_height_px: 32,
    max_width_px: 300,
    aspect_ratios: { horizontal: "2.5:1", compact: "1:1" },
  },
  mark: {
    id: "mark",
    name: "Logo Mark",
    description: "Icon-only symbol, no text",
    usage: "App icons, social avatars, watermarks, favicons",
    variants: ["square", "circle"],
    min_width_px: 32,
    min_height_px: 32,
    max_width_px: 200,
    aspect_ratios: { square: "1:1", circle: "1:1" },
  },
  wordmark: {
    id: "wordmark",
    name: "Wordmark",
    description: "Text-only logotype, no symbol",
    usage: "Email signatures, plain contexts, legal text",
    variants: ["horizontal"],
    min_width_px: 100,
    min_height_px: 30,
    max_width_px: 400,
    aspect_ratios: { horizontal: "4:1" },
  },
  lockup: {
    id: "lockup",
    name: "Lockup",
    description: "Logo with tagline or descriptor",
    usage: "Formal presentations, print materials, legal",
    variants: ["horizontal", "stacked"],
    min_width_px: 150,
    min_height_px: 60,
    max_width_px: 500,
    aspect_ratios: { horizontal: "3:1.5", stacked: "1:2" },
  },
};

/* ─── SVG Validation Rules ──────────────────────────────────────────────── */

const SVG_RULES = {
  max_file_size_kb: 50,
  max_width: 2000,
  max_height: 2000,
  min_width: 32,
  min_height: 32,
  allowed_elements: [
    "svg", "g", "path", "circle", "rect", "ellipse", "line", "polyline",
    "polygon", "text", "tspan", "defs", "clipPath", "mask", "pattern",
    "linearGradient", "radialGradient", "stop", "use", "symbol",
    "metadata", "title", "desc",
  ],
  forbidden_elements: [
    "script", "iframe", "object", "embed", "foreignObject",
    "image", "video", "audio", "filter", "feBlend", "feColorMatrix",
    "feComponentTransfer", "feComposite", "feConvolveMatrix",
    "feDiffuseLighting", "feDisplacementMap", "feFlood", "feGaussianBlur",
    "feImage", "feMerge", "feMorphology", "feOffset", "feSpecularLighting",
    "feTile", "feTurbulence",
  ],
  allowed_attributes: [
    "viewBox", "xmlns", "width", "height", "fill", "stroke", "stroke-width",
    "stroke-linecap", "stroke-linejoin", "d", "cx", "cy", "r", "rx", "ry",
    "x", "y", "x1", "y1", "x2", "y2", "points", "transform", "opacity",
    "fill-opacity", "stroke-opacity", "font-family", "font-size", "font-weight",
    "text-anchor", "dominant-baseline", "id", "class", "style", "aria-hidden",
    "role", "clip-path", "mask", "gradientUnits", "spreadMethod", "fx", "fy",
    "offset", "stop-color", "stop-opacity", "preserveAspectRatio", "href",
    "d", "vector-effect", "stroke-dasharray", "stroke-dashoffset",
  ],
  forbidden_attributes: [
    "onload", "onclick", "onmouseover", "onmouseout", "onmousemove",
    "onerror", "onabort", "onresize", "onscroll", "onunload",
    "javascript:", "data:", "vbscript:",
  ],
  required_root_attributes: ["viewBox", "xmlns"],
  color_rules: {
    no_external_references: true,
    no_data_uris: true,
    max_colors: 8,
  },
};

/* ─── Logo Placement Rules ──────────────────────────────────────────────── */

const PLACEMENT_RULES = {
  clear_space: {
    description: "Minimum clear space around logo equal to height of the mark",
    unit: "relative",
    multiplier: 1,
    minimum_px: 16,
  },
  minimum_size: {
    digital: { width: 80, height: 24, unit: "px" },
    print: { width: 20, height: 6, unit: "mm" },
    favicon: { width: 16, height: 16, unit: "px" },
  },
  backgrounds: {
    allowed: ["solid-light", "solid-dark", "gradient-subtle", "image-with-overlay"],
    forbidden: ["busy-photography", "low-contrast", "rainbow-gradient"],
  },
  placement_examples: {
    header: { position: "top-left or top-center", max_width: "200px" },
    footer: { position: "bottom-left", max_width: "150px" },
    email: { position: "top", max_width: "180px" },
    social: { position: "center", max_width: "120px" },
    print: { position: "top-left or centered", min_width: "20mm" },
  },
};

/* ─── File Format Requirements ──────────────────────────────────────────── */

const FILE_FORMATS = {
  svg: {
    extension: ".svg",
    mime: "image/svg+xml",
    use: "Web, digital, scalable",
    required: true,
    color_mode: "RGB",
  },
  png: {
    extension: ".png",
    mime: "image/png",
    use: "Web fallback, email, social",
    required: true,
    color_mode: "RGBA",
    densities: ["1x", "2x", "3x"],
  },
  pdf: {
    extension: ".pdf",
    mime: "application/pdf",
    use: "Print, legal, formal documents",
    required: false,
    color_mode: "CMYK",
  },
  eps: {
    extension: ".eps",
    mime: "application/postscript",
    use: "Professional print, engraving",
    required: false,
    color_mode: "CMYK",
  },
  ico: {
    extension: ".ico",
    mime: "image/x-icon",
    use: "Browser favicon",
    required: false,
    sizes: [16, 32, 48],
  },
};

/* ─── Usage Guidelines ──────────────────────────────────────────────────── */

const USAGE_GUIDELINES = {
  do: [
    "Use official logo files from the brand kit",
    "Maintain clear space around the logo",
    "Use the logo on approved backgrounds",
    "Use SVG for digital, PDF for print",
    "Use the appropriate logo variant for the context",
    "Scale proportionally without distortion",
  ],
  dont: [
    "Recreate the logo from scratch",
    "Change logo colors outside the approved palette",
    "Add effects like shadows, glows, or 3D",
    "Rotate or skew the logo",
    "Place logo on busy photography without overlay",
    "Stretch or compress the logo",
    "Use low-resolution versions for print",
    "Animate the logo without approval",
  ],
};

/* ─── Logo Spec Object ──────────────────────────────────────────────────── */

function createLogoSpec(overrides = {}) {
  return {
    type: overrides.type || "primary",
    variant: overrides.variant || "horizontal",
    mark_url: overrides.mark_url || null,
    wordmark_url: overrides.wordmark_url || null,
    lockup_url: overrides.lockup_url || null,
    svg_content: overrides.svg_content || null,
    colors: overrides.colors || {
      primary: "#1A1A2E",
      secondary: "#2563EB",
      background: "#FFFFFF",
    },
    created_at: overrides.created_at || new Date().toISOString(),
    version: overrides.version || "1.0.0",
  };
}

/* ─── Validation Functions ──────────────────────────────────────────────── */

export function validateLogoType(type) {
  const valid = type in LOGO_TYPES;
  return { valid, error: valid ? null : `Unknown logo type: ${type}` };
}

export function validateLogoVariant(type, variant) {
  const logoType = LOGO_TYPES[type];
  if (!logoType) return { valid: false, error: `Unknown logo type: ${type}` };
  const valid = logoType.variants.includes(variant);
  return {
    valid,
    error: valid ? null : `Variant "${variant}" not available for ${type}. Allowed: ${logoType.variants.join(", ")}`,
  };
}

export function validateSvgContent(svgContent) {
  const errors = [];
  const warnings = [];

  if (!svgContent || typeof svgContent !== "string") {
    return { valid: false, errors: ["SVG content is required"], warnings };
  }

  if (!svgContent.trimStart().startsWith("<svg")) {
    return { valid: false, errors: ["Not valid SVG: does not start with <svg"], warnings };
  }

  const forbiddenElems = SVG_RULES.forbidden_elements;
  for (const elem of forbiddenElems) {
    const regex = new RegExp(`<${elem}[\\s>]`, "i");
    if (regex.test(svgContent)) {
      errors.push(`Forbidden element found: <${elem}>`);
    }
  }

  const forbiddenAttrs = SVG_RULES.forbidden_attributes;
  for (const attr of forbiddenAttrs) {
    if (svgContent.includes(attr)) {
      errors.push(`Forbidden attribute found: ${attr}`);
    }
  }

  for (const req of SVG_RULES.required_root_attributes) {
    if (!svgContent.includes(req)) {
      errors.push(`Missing required root attribute: ${req}`);
    }
  }

  const sizeKB = Buffer.byteLength(svgContent, "utf8") / 1024;
  if (sizeKB > SVG_RULES.max_file_size_kb) {
    errors.push(`SVG too large: ${sizeKB.toFixed(1)}KB exceeds ${SVG_RULES.max_file_size_kb}KB`);
  }

  const colorMatches = svgContent.match(/#[0-9A-Fa-f]{3,8}/g) || [];
  if (colorMatches.length > SVG_RULES.color_rules.max_colors) {
    warnings.push(`Many colors detected: ${colorMatches.length} (recommended max ${SVG_RULES.color_rules.max_colors})`);
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function validateClearSpace(logoWidth, logoHeight, clearSpacePx) {
  const minClear = Math.max(PLACEMENT_RULES.clear_space.minimum_px, logoHeight * PLACEMENT_RULES.clear_space.multiplier);
  const valid = clearSpacePx >= minClear;
  return {
    valid,
    error: valid ? null : `Clear space ${clearSpacePx}px below minimum ${minClear}px`,
    minimum_required: minClear,
  };
}

export function validateLogoSize(widthPx, heightPx, context = "digital") {
  const mins = PLACEMENT_RULES.minimum_size[context];
  if (!mins) return { valid: false, error: `Unknown context: ${context}` };
  const valid = widthPx >= mins.width && heightPx >= mins.height;
  return {
    valid,
    error: valid ? null : `Logo ${widthPx}x${heightPx}px below minimum ${mins.width}x${mins.height}px for ${context}`,
  };
}

export function validateLogoBackground(bgType) {
  const valid = PLACEMENT_RULES.backgrounds.allowed.includes(bgType);
  return {
    valid,
    error: valid ? null : `Background "${bgType}" not approved. Allowed: ${PLACEMENT_RULES.backgrounds.allowed.join(", ")}`,
  };
}

export function validateFileFormat(format) {
  return { valid: format in FILE_FORMATS, format: FILE_FORMATS[format] || null };
}

/* ─── Exports ────────────────────────────────────────────────────────────── */

export {
  VERSION,
  LOGO_TYPES,
  SVG_RULES,
  PLACEMENT_RULES,
  FILE_FORMATS,
  USAGE_GUIDELINES,
  createLogoSpec,
};
