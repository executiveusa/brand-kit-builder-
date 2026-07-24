/**
 * Font Gallery — Phase 11: BKB-FONT-001
 *
 * Font catalog, pairing rules, font-face declarations, and gallery data.
 * Fonts are available via Google Fonts CDN or self-hosted.
 */

const VERSION = "1.0.0";

/* ─── Font Catalog ──────────────────────────────────────────────────────── */

const FONT_CATALOG = {
  "Inter": {
    category: "sans-serif",
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    styles: ["normal", "italic"],
    subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext", "greek", "vietnamese"],
    axes: ["opsz"],
    license: "OFL-1.1",
    source: "google-fonts",
    pairs_well_with: ["Merriweather", "Source Serif 4", "Lora", "Playfair Display"],
    description: "Clean geometric sans-serif, excellent for headings and UI",
  },
  "Space Grotesk": {
    category: "sans-serif",
    weights: [300, 400, 500, 600, 700],
    styles: ["normal"],
    subsets: ["latin"],
    axes: [],
    license: "OFL-1.1",
    source: "google-fonts",
    pairs_well_with: ["Inter", "Source Serif 4", "Lora"],
    description: "Geometric sans with character, ideal for display and headings",
  },
  "Playfair Display": {
    category: "serif",
    weights: [400, 500, 600, 700, 800, 900],
    styles: ["normal", "italic"],
    subsets: ["latin", "latin-ext", "cyrillic"],
    axes: [],
    license: "OFL-1.1",
    source: "google-fonts",
    pairs_well_with: ["Inter", "Source Serif 4", "Lora", "Open Sans"],
    description: "High-contrast transitional serif for elegant headings",
  },
  "DM Serif Display": {
    category: "serif",
    weights: [400],
    styles: ["normal", "italic"],
    subsets: ["latin", "latin-ext"],
    axes: [],
    license: "OFL-1.1",
    source: "google-fonts",
    pairs_well_with: ["Inter", "DM Sans", "Source Serif 4"],
    description: "Modern serif display font with sharp terminals",
  },
  "Sora": {
    category: "sans-serif",
    weights: [100, 200, 300, 400, 500, 600, 700, 800],
    styles: ["normal"],
    subsets: ["latin", "latin-ext", "japanese"],
    axes: [],
    license: "OFL-1.1",
    source: "google-fonts",
    pairs_well_with: ["Inter", "Source Serif 4", "Nunito Sans"],
    description: "Geometric sans with rounded terminals, friendly and modern",
  },
  "Outfit": {
    category: "sans-serif",
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    styles: ["normal"],
    subsets: ["latin", "latin-ext"],
    axes: [],
    license: "OFL-1.1",
    source: "google-fonts",
    pairs_well_with: ["Merriweather", "Lora", "Source Serif 4"],
    description: "Geometric sans-serif with rounded shapes, approachable and clean",
  },
  "Source Serif 4": {
    category: "serif",
    weights: [200, 300, 400, 500, 600, 700, 800, 900],
    styles: ["normal", "italic"],
    subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext", "vietnamese"],
    axes: ["opsz"],
    license: "OFL-1.1",
    source: "google-fonts",
    pairs_well_with: ["Inter", "Source Sans 3", "DM Sans", "Outfit"],
    description: "Adobe serif, excellent for long-form reading",
  },
  "Lora": {
    category: "serif",
    weights: [400, 500, 600, 700],
    styles: ["normal", "italic"],
    subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext", "vietnamese"],
    axes: [],
    license: "OFL-1.1",
    source: "google-fonts",
    pairs_well_with: ["Inter", "Outfit", "Open Sans", "Montserrat"],
    description: "Calligraphic serif, warm and readable for body text",
  },
  "Merriweather": {
    category: "serif",
    weights: [300, 400, 700, 900],
    styles: ["normal", "italic"],
    subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext", "vietnamese"],
    axes: [],
    license: "OFL-1.1",
    source: "google-fonts",
    pairs_well_with: ["Inter", "Outfit", "Space Grotesk", "Sora"],
    description: "Serif designed for screens, sturdy and readable",
  },
  "DM Sans": {
    category: "sans-serif",
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    styles: ["normal", "italic"],
    subsets: ["latin", "latin-ext"],
    axes: ["opsz"],
    license: "OFL-1.1",
    source: "google-fonts",
    pairs_well_with: ["DM Serif Display", "Playfair Display", "Merriweather"],
    description: "Low-contrast geometric sans, great for body text",
  },
  "Nunito Sans": {
    category: "sans-serif",
    weights: [200, 300, 400, 500, 600, 700, 800, 900, 1000],
    styles: ["normal", "italic"],
    subsets: ["latin", "latin-ext", "vietnamese", "cyrillic"],
    axes: ["opsz"],
    license: "OFL-1.1",
    source: "google-fonts",
    pairs_well_with: ["Sora", "Outfit", "Playfair Display"],
    description: "Rounded sans-serif, friendly and readable",
  },
  "Open Sans": {
    category: "sans-serif",
    weights: [300, 400, 500, 600, 700, 800],
    styles: ["normal", "italic"],
    subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext", "greek", "vietnamese", "hebrew"],
    axes: [],
    license: "OFL-1.1",
    source: "google-fonts",
    pairs_well_with: ["Playfair Display", "Lora", "Merriweather"],
    description: "Humanist sans, neutral and highly readable",
  },
  "JetBrains Mono": {
    category: "monospace",
    weights: [100, 200, 300, 400, 500, 600, 700, 800],
    styles: ["normal", "italic"],
    subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext", "vietnamese"],
    axes: [],
    license: "OFL-1.1",
    source: "google-fonts",
    pairs_well_with: [],
    description: "Monospace with ligatures, ideal for code blocks",
  },
  "Fira Code": {
    category: "monospace",
    weights: [300, 400, 500, 600, 700],
    styles: ["normal"],
    subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext", "vietnamese"],
    axes: [],
    license: "OFL-1.1",
    source: "google-fonts",
    pairs_well_with: [],
    description: "Monospace with programming ligatures",
  },
  "Source Code Pro": {
    category: "monospace",
    weights: [200, 300, 400, 500, 600, 700, 800, 900],
    styles: ["normal", "italic"],
    subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext", "vietnamese"],
    axes: [],
    license: "OFL-1.1",
    source: "google-fonts",
    pairs_well_with: [],
    description: "Adobe monospace, clean and readable for code",
  },
};

const FONT_NAMES = Object.keys(FONT_CATALOG);
const HEADING_FONTS = ["Inter", "Space Grotesk", "Playfair Display", "DM Serif Display", "Sora", "Outfit"];
const BODY_FONTS    = ["Inter", "Source Serif 4", "Lora", "Merriweather", "DM Sans", "Nunito Sans", "Open Sans"];
const MONO_FONTS    = ["JetBrains Mono", "Fira Code", "Source Code Pro"];

/* ─── Font Pairing Rules ────────────────────────────────────────────────── */

const PAIRING_RULES = {
  "heading-body": {
    description: "Heading font pairs with body font — different category preferred (sans + serif)",
    validator: (heading, body) => {
      if (!heading || !body) return { valid: false, error: "Both heading and body fonts required" };
      if (!FONT_CATALOG[heading]) return { valid: false, error: `Unknown heading font: ${heading}` };
      if (!FONT_CATALOG[body])    return { valid: false, error: `Unknown body font: ${body}` };
      const hCat = FONT_CATALOG[heading].category;
      const bCat = FONT_CATALOG[body].category;
      if (hCat === bCat) {
        return { valid: true, warning: `Both fonts are ${hCat}; consider mixing categories for contrast` };
      }
      return { valid: true };
    },
  },
  "weight-range": {
    description: "Body font must include weight 400 and 700; heading must include 700",
    validator: (heading, body) => {
      if (!heading || !body) return { valid: false, error: "Both fonts required" };
      const hWeights = FONT_CATALOG[heading]?.weights || [];
      const bWeights = FONT_CATALOG[body]?.weights || [];
      const issues = [];
      if (!hWeights.includes(700)) issues.push(`${heading} missing weight 700 for headings`);
      if (!bWeights.includes(400)) issues.push(`${body} missing weight 400 for body`);
      if (!bWeights.includes(700)) issues.push(`${body} missing weight 700 for emphasis`);
      return { valid: issues.length === 0, error: issues.join("; ") || null };
    },
  },
  "readability": {
    description: "Body font must be serif or sans-serif (not display-only)",
    validator: (_heading, body) => {
      if (!body) return { valid: false, error: "Body font required" };
      const cat = FONT_CATALOG[body]?.category;
      if (cat === "monospace") return { valid: false, error: "Monospace fonts not suitable for body text" };
      return { valid: true };
    },
  },
  "no-mixing-roles": {
    description: "Heading font must not be used as body if it's a display-only face",
    validator: (heading) => {
      if (!heading) return { valid: true };
      const weights = FONT_CATALOG[heading]?.weights || [];
      if (weights.length <= 2) return { valid: false, error: `${heading} has only ${weights.length} weights — insufficient for body use` };
      return { valid: true };
    },
  },
};

/* ─── Font Face Declarations ────────────────────────────────────────────── */

function generateFontFace(fontName, weight = 400, style = "normal") {
  const font = FONT_CATALOG[fontName];
  if (!font) return null;
  const styleMap = { normal: "normal", italic: "italic", oblique: "oblique" };
  const weightStr = String(weight);
  const familyClean = fontName.replace(/\s+/g, "+");
  return {
    "font-family": `"${fontName}"`,
    "font-style": styleMap[style] || "normal",
    "font-weight": weightStr,
    "font-display": "swap",
    src: [
      `url(https://fonts.gstatic.com/s/${familyClean.toLowerCase()}/v1/${fontName.replace(/\s+/g, "")}.woff2) format("woff2")`,
      `url(https://fonts.gstatic.com/s/${familyClean.toLowerCase()}/v1/${fontName.replace(/\s+/g, "")}.woff) format("woff")`,
    ],
    "unicode-range": "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
  };
}

function generateFontFaces(fontName) {
  const font = FONT_CATALOG[fontName];
  if (!font) return [];
  const faces = [];
  const commonWeights = font.weights.filter(w => [300, 400, 500, 600, 700].includes(w));
  for (const w of commonWeights) {
    for (const s of font.styles) {
      faces.push(generateFontFace(fontName, w, s));
    }
  }
  return faces;
}

/* ─── Gallery Data ──────────────────────────────────────────────────────── */

const GALLERY_CATEGORIES = [
  { id: "heading", label: "Heading Fonts", fonts: HEADING_FONTS },
  { id: "body",    label: "Body Fonts",    fonts: BODY_FONTS },
  { id: "mono",    label: "Code Fonts",    fonts: MONO_FONTS },
];

const SAMPLE_PAIRINGS = [
  { heading: "Space Grotesk", body: "Source Serif 4", label: "Modern + Classic" },
  { heading: "Playfair Display", body: "Inter", label: "Elegant + Clean" },
  { heading: "DM Serif Display", body: "DM Sans", label: "Same Family Mix" },
  { heading: "Outfit", body: "Merriweather", label: "Friendly + Sturdy" },
  { heading: "Sora", body: "Nunito Sans", label: "Rounded Duo" },
  { heading: "Inter", body: "Lora", label: "Minimal + Warm" },
];

/* ─── Validation Functions ──────────────────────────────────────────────── */

export function validateFontName(name) {
  return { valid: name in FONT_CATALOG };
}

export function validateFontWeight(fontName, weight) {
  if (!FONT_CATALOG[fontName]) return { valid: false, error: `Unknown font: ${fontName}` };
  const valid = FONT_CATALOG[fontName].weights.includes(weight);
  return { valid, error: valid ? null : `Font ${fontName} does not include weight ${weight}` };
}

export function validateFontStyle(fontName, style) {
  if (!FONT_CATALOG[fontName]) return { valid: false, error: `Unknown font: ${fontName}` };
  const valid = FONT_CATALOG[fontName].styles.includes(style);
  return { valid, error: valid ? null : `Font ${fontName} does not include style ${style}` };
}

export function validatePairing(headingFont, bodyFont) {
  const results = Object.entries(PAIRING_RULES).map(([name, rule]) => ({
    rule: name,
    ...rule.validator(headingFont, bodyFont),
  }));
  const errors = results.filter(r => !r.valid).map(r => r.error);
  const warnings = results.filter(r => r.warning).map(r => r.warning);
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validateFontFaceDeclaration(fontName, weight = 400, style = "normal") {
  const face = generateFontFace(fontName, weight, style);
  if (!face) return { valid: false, error: `Unknown font: ${fontName}` };
  return { valid: true, declaration: face };
}

export function getFontByName(name) {
  return FONT_CATALOG[name] || null;
}

export function getFontsByCategory(category) {
  return FONT_NAMES.filter(n => FONT_CATALOG[n].category === category);
}

export function getFontsByRole(role) {
  if (role === "heading") return HEADING_FONTS;
  if (role === "body")    return BODY_FONTS;
  if (role === "mono")    return MONO_FONTS;
  return [];
}

/* ─── Exports ────────────────────────────────────────────────────────────── */

export {
  VERSION,
  FONT_CATALOG,
  FONT_NAMES,
  HEADING_FONTS,
  BODY_FONTS,
  MONO_FONTS,
  PAIRING_RULES,
  GALLERY_CATEGORIES,
  SAMPLE_PAIRINGS,
  generateFontFaces,
};
