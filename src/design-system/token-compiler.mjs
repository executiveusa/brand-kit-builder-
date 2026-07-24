/**
 * Design System Compiler — Phase 10: BKB-DESIGN-SYSTEM-001
 *
 * Canonical design-token source for Pauli Brand Studio.
 * Validates colors, typography, spacing, radii, shadows, gradients, borders,
 * elevation, layout, and motion tokens.
 *
 * CI validator rejects arbitrary hex, spacing, fonts, icons, components,
 * breakpoints, radii, shadows, gradients, and hardcoded brand values.
 */

const VERSION = "1.0.0";

/* ─── Color Palette (validated) ─────────────────────────────────────────── */

const COLOR_PALETTE = {
  black:    { hex: "#000000", oklch: "oklch(0.0 0.0 0)",      role: "neutral" },
  white:    { hex: "#FFFFFF", oklch: "oklch(1.0 0.0 0)",       role: "neutral" },
  charcoal: { hex: "#1A1A2E", oklch: "oklch(0.15 0.02 260)",   role: "neutral-dark" },
  graphite: { hex: "#2D2D3F", oklch: "oklch(0.22 0.02 260)",   role: "neutral-dark" },
  slate:    { hex: "#6B7280", oklch: "oklch(0.50 0.02 260)",   role: "neutral-mid" },
  ash:      { hex: "#9CA3AF", oklch: "oklch(0.65 0.02 260)",   role: "neutral-mid" },
  silver:   { hex: "#E5E7EB", oklch: "oklch(0.91 0.01 260)",   role: "neutral-light" },
  snow:     { hex: "#F9FAFB", oklch: "oklch(0.98 0.00 0)",     role: "neutral-lightest" },
  azure:    { hex: "#2563EB", oklch: "oklch(0.55 0.20 260)",   role: "primary" },
  "azure-light": { hex: "#3B82F6", oklch: "oklch(0.62 0.18 260)", role: "primary-light" },
  "azure-dark":  { hex: "#1D4ED8", oklch: "oklch(0.48 0.22 260)", role: "primary-dark" },
  emerald:  { hex: "#059669", oklch: "oklch(0.60 0.18 155)",   role: "positive" },
  ruby:     { hex: "#DC2626", oklch: "oklch(0.55 0.22 25)",    role: "negative" },
  amber:    { hex: "#D97706", oklch: "oklch(0.65 0.16 70)",    role: "warning" },
};

const ALLOWED_HEX_VALUES = new Set(Object.values(COLOR_PALETTE).map(c => c.hex));

/* ─── Semantic Tokens ───────────────────────────────────────────────────── */

const SEMANTIC_TOKENS = {
  "text-primary":     COLOR_PALETTE.charcoal.hex,
  "text-secondary":   COLOR_PALETTE.slate.hex,
  "text-muted":       COLOR_PALETTE.ash.hex,
  "text-inverse":     COLOR_PALETTE.white.hex,
  "text-on-primary":  COLOR_PALETTE.white.hex,
  "surface-primary":  COLOR_PALETTE.white.hex,
  "surface-secondary": COLOR_PALETTE.snow.hex,
  "surface-elevated": COLOR_PALETTE.white.hex,
  "border-default":   COLOR_PALETTE.silver.hex,
  "border-strong":    COLOR_PALETTE.ash.hex,
  "accent-primary":   COLOR_PALETTE.azure.hex,
  "accent-success":   COLOR_PALETTE.emerald.hex,
  "accent-danger":    COLOR_PALETTE.ruby.hex,
  "accent-warning":   COLOR_PALETTE.amber.hex,
};

/* ─── Typography Scale ──────────────────────────────────────────────────── */

const TYPE_SCALE = {
  "display-lg":  { size: "3rem",     weight: 800, line_height: "1.1", tracking: "-0.02em", font_family: "heading" },
  "display-md":  { size: "2.25rem",  weight: 700, line_height: "1.15", tracking: "-0.015em", font_family: "heading" },
  "display-sm":  { size: "1.875rem", weight: 700, line_height: "1.2", tracking: "-0.01em", font_family: "heading" },
  "h1":          { size: "1.5rem",   weight: 700, line_height: "1.25", tracking: "-0.01em", font_family: "heading" },
  "h2":          { size: "1.25rem",  weight: 600, line_height: "1.3", tracking: "-0.005em", font_family: "heading" },
  "h3":          { size: "1.125rem", weight: 600, line_height: "1.35", tracking: "0", font_family: "heading" },
  "body-lg":     { size: "1.125rem", weight: 400, line_height: "1.6", tracking: "0", font_family: "body" },
  "body-md":     { size: "1rem",     weight: 400, line_height: "1.6", tracking: "0", font_family: "body" },
  "body-sm":     { size: "0.875rem", weight: 400, line_height: "1.5", tracking: "0.005em", font_family: "body" },
  "caption":     { size: "0.75rem",  weight: 500, line_height: "1.4", tracking: "0.01em", font_family: "body" },
  "overline":    { size: "0.6875rem",weight: 600, line_height: "1.4", tracking: "0.08em", font_family: "body" },
  "code":        { size: "0.875rem", weight: 400, line_height: "1.5", tracking: "0", font_family: "mono" },
};

const TYPE_ALLOWED_FAMILIES = ["heading", "body", "mono"];

/* ─── Spacing Scale (rem) ───────────────────────────────────────────────── */

const SPACING_SCALE = [0, 0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24];

const SPACING_TOKENS = {
  "space-0":   "0",
  "space-px":  "1px",
  "space-0.5": "0.125rem",
  "space-1":   "0.25rem",
  "space-1.5": "0.375rem",
  "space-2":   "0.5rem",
  "space-2.5": "0.625rem",
  "space-3":   "0.75rem",
  "space-4":   "1rem",
  "space-5":   "1.25rem",
  "space-6":   "1.5rem",
  "space-8":   "2rem",
  "space-10":  "2.5rem",
  "space-12":  "3rem",
  "space-16":  "4rem",
  "space-20":  "5rem",
  "space-24":  "6rem",
  "space-32":  "8rem",
};

const ALLOWED_SPACING_REM = new Set(SPACING_SCALE);

/* ─── Radius Scale ──────────────────────────────────────────────────────── */

const RADIUS_TOKENS = {
  "radius-none":   "0",
  "radius-sm":     "0.25rem",
  "radius-md":     "0.5rem",
  "radius-lg":     "0.75rem",
  "radius-xl":     "1rem",
  "radius-2xl":    "1.5rem",
  "radius-full":   "9999px",
};

const ALLOWED_RADIUS_REM = new Set([0, 0.25, 0.5, 0.75, 1, 1.5, 9999]);

/* ─── Shadow Scale ──────────────────────────────────────────────────────── */

const SHADOW_TOKENS = {
  "shadow-none":   "none",
  "shadow-xs":     "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  "shadow-sm":     "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
  "shadow-md":     "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
  "shadow-lg":     "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
  "shadow-xl":     "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
};

const ALLOWED_SHADOW_KEYS = new Set(Object.keys(SHADOW_TOKENS));

/* ─── Gradient Tokens ───────────────────────────────────────────────────── */

const GRADIENT_TOKENS = {
  "gradient-brand":  "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
  "gradient-surface": "linear-gradient(180deg, #FFFFFF 0%, #F9FAFB 100%)",
  "gradient-elevated": "linear-gradient(180deg, #FFFFFF 0%, #F3F4F6 100%)",
};

const ALLOWED_GRADIENT_KEYS = new Set(Object.keys(GRADIENT_TOKENS));

/* ─── Border Tokens ─────────────────────────────────────────────────────── */

const BORDER_TOKENS = {
  "border-width-thin":   "1px",
  "border-width-medium": "2px",
  "border-width-thick":  "4px",
  "border-style-solid":  "solid",
  "border-style-dashed": "dashed",
};

/* ─── Elevation Tokens ──────────────────────────────────────────────────── */

const ELEVATION_TOKENS = {
  "elevation-0": { shadow: "shadow-none", z_index: 0 },
  "elevation-1": { shadow: "shadow-xs",  z_index: 10 },
  "elevation-2": { shadow: "shadow-sm",  z_index: 20 },
  "elevation-3": { shadow: "shadow-md",  z_index: 30 },
  "elevation-4": { shadow: "shadow-lg",  z_index: 40 },
  "elevation-5": { shadow: "shadow-xl",  z_index: 50 },
};

/* ─── Layout / Breakpoint Tokens ────────────────────────────────────────── */

const BREAKPOINT_TOKENS = {
  "bp-sm":  "640px",
  "bp-md":  "768px",
  "bp-lg":  "1024px",
  "bp-xl":  "1280px",
  "bp-2xl": "1536px",
};

const CONTAINER_TOKENS = {
  "container-sm":  "640px",
  "container-md":  "768px",
  "container-lg":  "1024px",
  "container-xl":  "1280px",
  "container-2xl": "1440px",
};

const GRID_TOKENS = {
  "grid-columns":  12,
  "grid-gutter":   "1.5rem",
  "grid-margin":   "2rem",
};

const ALLOWED_BREAKPOINT_KEYS = new Set(Object.keys(BREAKPOINT_TOKENS));

/* ─── Motion Tokens ─────────────────────────────────────────────────────── */

const MOTION_TOKENS = {
  "duration-instant":  "0ms",
  "duration-fast":     "100ms",
  "duration-normal":   "200ms",
  "duration-slow":     "300ms",
  "duration-slower":   "500ms",
  "easing-default":    "cubic-bezier(0.4, 0, 0.2, 1)",
  "easing-in":         "cubic-bezier(0.4, 0, 1, 1)",
  "easing-out":        "cubic-bezier(0, 0, 0.2, 1)",
  "easing-in-out":     "cubic-bezier(0.4, 0, 0.2, 1)",
};

const ALLOWED_DURATION_KEYS = new Set(Object.keys(MOTION_TOKENS).filter(k => k.startsWith("duration-")));
const ALLOWED_EASING_KEYS   = new Set(Object.keys(MOTION_TOKENS).filter(k => k.startsWith("easing-")));

/* ─── Component Registry ────────────────────────────────────────────────── */

const COMPONENT_REGISTRY = {
  button: {
    variants: ["primary", "secondary", "ghost", "danger"],
    sizes: ["sm", "md", "lg"],
    tokens: {
      padding:     { sm: "space-2 space-3", md: "space-2.5 space-4", lg: "space-3 space-5" },
      font:        { sm: "body-sm", md: "body-md", lg: "body-lg" },
      radius:      "radius-md",
      shadow:      "shadow-none",
      transition:  "duration-normal easing-default",
    },
    required_props: ["label", "variant"],
  },
  input: {
    variants: ["default", "error", "disabled"],
    sizes: ["sm", "md", "lg"],
    tokens: {
      padding:     { sm: "space-2 space-2.5", md: "space-2.5 space-3", lg: "space-3 space-4" },
      font:        { sm: "body-sm", md: "body-md", lg: "body-lg" },
      radius:      "radius-md",
      border:      "border-width-thin border-style-solid border-default",
    },
    required_props: ["type"],
  },
  card: {
    variants: ["default", "elevated", "outlined"],
    tokens: {
      padding:     "space-6",
      radius:      "radius-lg",
      shadow:      { default: "shadow-none", elevated: "shadow-md", outlined: "shadow-none" },
      border:      { default: "none", outlined: "border-width-thin border-style-solid border-default" },
    },
  },
  badge: {
    variants: ["neutral", "primary", "success", "danger", "warning"],
    tokens: {
      padding:     "space-1 space-2.5",
      radius:      "radius-full",
      font:        "caption",
    },
  },
  avatar: {
    variants: ["circle", "rounded", "square"],
    sizes: ["sm", "md", "lg", "xl"],
    tokens: {
      radius:      { circle: "radius-full", rounded: "radius-lg", square: "radius-md" },
      size:        { sm: "32px", md: "40px", lg: "56px", xl: "80px" },
    },
  },
  modal: {
    variants: ["default", "fullscreen"],
    tokens: {
      padding:     "space-6",
      radius:      "radius-xl",
      shadow:      "shadow-xl",
      overlay:     "rgba(0, 0, 0, 0.5)",
      z_index:     "elevation-5",
    },
  },
  navigation: {
    variants: ["horizontal", "vertical"],
    tokens: {
      padding:     "space-4 space-6",
      font:        "body-md",
      shadow:      "shadow-sm",
    },
  },
};

const ALLOWED_COMPONENT_KEYS = new Set(Object.keys(COMPONENT_REGISTRY));

/* ─── Pattern Library ───────────────────────────────────────────────────── */

const PATTERN_LIBRARY = {
  "hero-section": {
    tokens: ["display-lg", "body-lg", "space-16", "elevation-0"],
    layout: "full-width",
    required: ["heading", "description", "primary-cta"],
  },
  "feature-grid": {
    tokens: ["display-sm", "body-md", "space-8", "elevation-0"],
    layout: "grid-3",
    required: ["features-array"],
  },
  "cta-banner": {
    tokens: ["h2", "body-lg", "space-12", "elevation-2"],
    layout: "full-width",
    required: ["heading", "cta-text"],
  },
  "testimonials": {
    tokens: ["body-lg", "caption", "space-8", "elevation-1"],
    layout: "carousel",
    required: ["testimonials-array"],
  },
  "pricing-table": {
    tokens: ["display-sm", "h2", "body-md", "space-6", "elevation-2"],
    layout: "grid-3",
    required: ["plans-array"],
  },
  "footer": {
    tokens: ["body-sm", "caption", "space-12", "elevation-0"],
    layout: "multi-column",
    required: ["copyright", "links"],
  },
};

const PAGE_RECIPES = {
  landing: {
    patterns: ["hero-section", "feature-grid", "cta-banner", "testimonials", "footer"],
    required_sections: ["hero", "features", "cta"],
  },
  about: {
    patterns: ["hero-section", "feature-grid", "footer"],
    required_sections: ["mission", "team"],
  },
  contact: {
    patterns: ["hero-section", "cta-banner", "footer"],
    required_sections: ["form", "info"],
  },
  pricing: {
    patterns: ["hero-section", "pricing-table", "cta-banner", "footer"],
    required_sections: ["plans", "faq"],
  },
};

/* ─── Icon Families (allowed) ───────────────────────────────────────────── */

const ALLOWED_ICON_FAMILIES = ["phosphor", "radix", "tabler"];

/* ─── Validation Functions ──────────────────────────────────────────────── */

export function validateHex(hex) {
  if (!hex || typeof hex !== "string") return { valid: false, error: "Hex must be a non-empty string" };
  const normalized = hex.trim().toUpperCase();
  if (!/^#[0-9A-F]{6}$/.test(normalized) && !/^#[0-9A-F]{3}$/.test(normalized)) {
    return { valid: false, error: `Invalid hex format: ${hex}` };
  }
  const isAllowed = ALLOWED_HEX_VALUES.has(normalized) || ALLOWED_HEX_VALUES.has(hex);
  return {
    valid: isAllowed,
    error: isAllowed ? null : `Arbitrary hex ${hex} is not in the allowed palette`,
  };
}

export function validateSpacing(value) {
  if (value === undefined || value === null) return { valid: false, error: "Spacing value required" };
  if (value === "0" || value === 0) return { valid: true };
  const str = String(value).trim();
  if (str.endsWith("rem")) {
    const num = parseFloat(str);
    if (ALLOWED_SPACING_REM.has(num)) return { valid: true };
    return { valid: false, error: `Arbitrary spacing ${value} not in scale` };
  }
  if (str.endsWith("px")) {
    const px = parseInt(str, 10);
    const rem = px / 16;
    if (ALLOWED_SPACING_REM.has(rem)) return { valid: true };
    return { valid: false, error: `Pixel value ${value} not in spacing scale` };
  }
  return { valid: false, error: `Spacing must be rem or px, got: ${value}` };
}

export function validateRadius(value) {
  if (!value) return { valid: false, error: "Radius value required" };
  const str = String(value).trim();
  if (str === "9999px" || str === "9999") return { valid: true };
  if (str.endsWith("rem")) {
    const num = parseFloat(str);
    if (ALLOWED_RADIUS_REM.has(num)) return { valid: true };
    return { valid: false, error: `Arbitrary radius ${value} not in scale` };
  }
  return { valid: false, error: `Radius must be rem or 9999px, got: ${value}` };
}

export function validateShadow(value) {
  if (!value || value === "none") return { valid: true };
  if (ALLOWED_SHADOW_KEYS.has(value)) return { valid: true };
  return { valid: false, error: `Arbitrary shadow "${value}" not in token registry` };
}

export function validateGradient(value) {
  if (!value) return { valid: true };
  if (ALLOWED_GRADIENT_KEYS.has(value)) return { valid: true };
  if (typeof value === "string" && value.startsWith("linear-gradient")) {
    return { valid: false, error: `Arbitrary gradient "${value.slice(0, 50)}..." not in token registry` };
  }
  return { valid: true };
}

export function validateTypography(token) {
  if (!token) return { valid: false, error: "Typography token required" };
  const def = TYPE_SCALE[token];
  if (!def) return { valid: false, error: `Unknown type token: ${token}` };
  if (!TYPE_ALLOWED_FAMILIES.includes(def.font_family)) {
    return { valid: false, error: `Disallowed font family: ${def.font_family}` };
  }
  return { valid: true };
}

export function validateBreakpoint(key) {
  return { valid: ALLOWED_BREAKPOINT_KEYS.has(key) };
}

export function validateComponent(name) {
  return { valid: ALLOWED_COMPONENT_KEYS.has(name) };
}

export function validateIconFamily(family) {
  return { valid: ALLOWED_ICON_FAMILIES.includes(family) };
}

export function validateElevationToken(key) {
  return { valid: key in ELEVATION_TOKENS };
}

export function validateMotionToken(key, value) {
  if (ALLOWED_DURATION_KEYS.has(key) || ALLOWED_EASING_KEYS.has(key)) return { valid: true };
  return { valid: false, error: `Unknown motion token: ${key}` };
}

/* ─── Pattern Validation ─────────────────────────────────────────────────── */

export function validatePattern(patternId) {
  const pattern = PATTERN_LIBRARY[patternId];
  if (!pattern) return { valid: false, error: `Unknown pattern: ${patternId}` };
  const tokenIssues = pattern.tokens.map(t => {
    if (TYPE_SCALE[t]) return { valid: true };
    if (SPACING_TOKENS[t]) return { valid: true };
    if (ELEVATION_TOKENS[t]) return { valid: true };
    return { valid: false, error: `Unresolved token: ${t}` };
  }).filter(r => !r.valid);
  if (tokenIssues.length > 0) return { valid: false, error: tokenIssues.map(i => i.error).join("; ") };
  return { valid: true };
}

/* ─── Full Brand Spec Compiler ───────────────────────────────────────────── */

export function compileBrandSpec(brandInput) {
  const errors = [];
  const warnings = [];
  const tokens = {};

  if (brandInput.colors) {
    tokens.colors = {};
    for (const [key, hex] of Object.entries(brandInput.colors)) {
      const v = validateHex(hex);
      if (!v.valid) { errors.push(`color.${key}: ${v.error}`); }
      else { tokens.colors[key] = { hex, semantic: SEMANTIC_TOKENS[key] || null }; }
    }
  }

  if (brandInput.typography) {
    tokens.typography = {};
    for (const [key, tokenName] of Object.entries(brandInput.typography)) {
      const v = validateTypography(tokenName);
      if (!v.valid) { errors.push(`typography.${key}: ${v.error}`); }
      else { tokens.typography[key] = TYPE_SCALE[tokenName]; }
    }
  }

  if (brandInput.spacing) {
    tokens.spacing = {};
    for (const [key, value] of Object.entries(brandInput.spacing)) {
      const v = validateSpacing(value);
      if (!v.valid) { errors.push(`spacing.${key}: ${v.error}`); }
      else { tokens.spacing[key] = value; }
    }
  }

  if (brandInput.radius) {
    tokens.radius = {};
    for (const [key, value] of Object.entries(brandInput.radius)) {
      const v = validateRadius(value);
      if (!v.valid) { errors.push(`radius.${key}: ${v.error}`); }
      else { tokens.radius[key] = value; }
    }
  }

  if (brandInput.components) {
    tokens.components = {};
    for (const name of brandInput.components) {
      const v = validateComponent(name);
      if (!v.valid) { errors.push(`component.${name}: ${v.error}`); }
      else { tokens.components[name] = COMPONENT_REGISTRY[name]; }
    }
  }

  if (brandInput.patterns) {
    tokens.patterns = {};
    for (const pid of brandInput.patterns) {
      const v = validatePattern(pid);
      if (!v.valid) { errors.push(`pattern.${pid}: ${v.error}`); }
      else { tokens.patterns[pid] = PATTERN_LIBRARY[pid]; }
    }
  }

  return {
    version: VERSION,
    valid: errors.length === 0,
    errors,
    warnings,
    tokens,
  };
}

/* ─── Exports ────────────────────────────────────────────────────────────── */

export {
  VERSION,
  COLOR_PALETTE,
  SEMANTIC_TOKENS,
  TYPE_SCALE,
  TYPE_ALLOWED_FAMILIES,
  SPACING_SCALE,
  SPACING_TOKENS,
  ALLOWED_SPACING_REM,
  RADIUS_TOKENS,
  ALLOWED_RADIUS_REM,
  SHADOW_TOKENS,
  ALLOWED_SHADOW_KEYS,
  GRADIENT_TOKENS,
  ALLOWED_GRADIENT_KEYS,
  BORDER_TOKENS,
  ELEVATION_TOKENS,
  BREAKPOINT_TOKENS,
  ALLOWED_BREAKPOINT_KEYS,
  CONTAINER_TOKENS,
  GRID_TOKENS,
  MOTION_TOKENS,
  ALLOWED_DURATION_KEYS,
  ALLOWED_EASING_KEYS,
  COMPONENT_REGISTRY,
  ALLOWED_COMPONENT_KEYS,
  PATTERN_LIBRARY,
  PAGE_RECIPES,
  ALLOWED_ICON_FAMILIES,
};
