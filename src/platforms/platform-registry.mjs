export const PLATFORM_REGISTRY_VERSION = "1.0.0";

export const PLATFORM_IDS = [
  "instagram",
  "linkedin",
  "youtube",
  "tiktok",
  "facebook",
  "x",
  "email",
  "web",
  "print",
  "presentation",
  "proposal",
  "advertising"
];

export const PLATFORM_SPECS = {
  instagram: {
    id: "instagram",
    name: "Instagram",
    version: "1.0.0",
    retrieved_at: "2026-07-24",
    source: "https://help.instagram.com/",
    formats: [
      {
        id: "feed-square",
        name: "Feed Post (Square)",
        aspect_ratio: "1:1",
        dimensions: { width: 1080, height: 1080, unit: "px" },
        safe_zone: { top: 250, right: 250, bottom: 250, left: 250 },
        max_text_length: 2200,
        max_hashtags: 30,
        file_types: ["jpg", "png"],
        max_file_size_mb: 30
      },
      {
        id: "feed-portrait",
        name: "Feed Post (Portrait)",
        aspect_ratio: "4:5",
        dimensions: { width: 1080, height: 1350, unit: "px" },
        safe_zone: { top: 250, right: 250, bottom: 400, left: 250 },
        max_text_length: 2200,
        max_hashtags: 30,
        file_types: ["jpg", "png"],
        max_file_size_mb: 30
      },
      {
        id: "story",
        name: "Story",
        aspect_ratio: "9:16",
        dimensions: { width: 1080, height: 1920, unit: "px" },
        safe_zone: { top: 250, right: 80, bottom: 500, left: 80 },
        max_text_length: 2200,
        max_hashtags: 30,
        file_types: ["jpg", "png", "mp4"],
        max_file_size_mb: 30,
        max_video_duration_s: 60
      },
      {
        id: "reel",
        name: "Reel",
        aspect_ratio: "9:16",
        dimensions: { width: 1080, height: 1920, unit: "px" },
        safe_zone: { top: 250, right: 80, bottom: 500, left: 80 },
        max_text_length: 2200,
        file_types: ["mp4"],
        max_file_size_mb: 100,
        max_video_duration_s: 90
      }
    ],
    accessibility_constraints: {
      min_contrast_ratio: 4.5,
      requires_alt_text: true,
      caption_recommended: true
    },
    tone_guidance: {
      en: "Visual-first. Authentic. Concise captions.",
      es: "Visual primero. Autentico. Textos concisos."
    }
  },

  linkedin: {
    id: "linkedin",
    name: "LinkedIn",
    version: "1.0.0",
    retrieved_at: "2026-07-24",
    source: "https://www.linkedin.com/help/",
    formats: [
      {
        id: "feed-image",
        name: "Feed Image Post",
        aspect_ratio: "1.91:1",
        dimensions: { width: 1200, height: 627, unit: "px" },
        safe_zone: { top: 100, right: 100, bottom: 100, left: 100 },
        max_text_length: 3000,
        file_types: ["jpg", "png"],
        max_file_size_mb: 20
      },
      {
        id: "feed-square",
        name: "Feed Square Post",
        aspect_ratio: "1:1",
        dimensions: { width: 1200, height: 1200, unit: "px" },
        safe_zone: { top: 100, right: 100, bottom: 100, left: 100 },
        max_text_length: 3000,
        file_types: ["jpg", "png"],
        max_file_size_mb: 20
      },
      {
        id: "carousel",
        name: "Carousel Document",
        aspect_ratio: "4:5",
        dimensions: { width: 1080, height: 1350, unit: "px" },
        safe_zone: { top: 100, right: 100, bottom: 100, left: 100 },
        max_pages: 10,
        file_types: ["pdf"],
        max_file_size_mb: 100
      },
      {
        id: "profile-banner",
        name: "Profile Banner",
        aspect_ratio: "3:1",
        dimensions: { width: 1584, height: 528, unit: "px" },
        safe_zone: { top: 50, right: 200, bottom: 50, left: 200 },
        file_types: ["jpg", "png"],
        max_file_size_mb: 8
      }
    ],
    accessibility_constraints: {
      min_contrast_ratio: 4.5,
      requires_alt_text: true,
      caption_recommended: true
    },
    tone_guidance: {
      en: "Professional. Value-driven. Evidence-backed.",
      es: "Profesional. Orientado a valor. Basado en evidencia."
    }
  },

  youtube: {
    id: "youtube",
    name: "YouTube",
    version: "1.0.0",
    retrieved_at: "2026-07-24",
    source: "https://support.google.com/youtube/",
    formats: [
      {
        id: "thumbnail",
        name: "Video Thumbnail",
        aspect_ratio: "16:9",
        dimensions: { width: 1280, height: 720, unit: "px" },
        safe_zone: { top: 50, right: 50, bottom: 100, left: 50 },
        file_types: ["jpg", "png", "gif"],
        max_file_size_mb: 2,
        max_text_overlay: "Keep text under 20% of thumbnail area"
      },
      {
        id: "short",
        name: "YouTube Short",
        aspect_ratio: "9:16",
        dimensions: { width: 1080, height: 1920, unit: "px" },
        safe_zone: { top: 200, right: 80, bottom: 400, left: 80 },
        max_video_duration_s: 60,
        file_types: ["mp4"],
        max_file_size_mb: 256
      },
      {
        id: "channel-banner",
        name: "Channel Banner",
        aspect_ratio: "16:9",
        dimensions: { width: 2560, height: 1440, unit: "px" },
        safe_zone: { top: 200, right: 400, bottom: 200, left: 400 },
        file_types: ["jpg", "png"],
        max_file_size_mb: 6
      }
    ],
    accessibility_constraints: {
      min_contrast_ratio: 4.5,
      requires_alt_text: false,
      caption_required: true,
      transcript_recommended: true
    },
    tone_guidance: {
      en: "Engaging. Clear hook in first 5 seconds. Value-focused.",
      es: "Atractivo. Gancho claro en los primeros 5 segundos. Enfocado en valor."
    }
  },

  tiktok: {
    id: "tiktok",
    name: "TikTok",
    version: "1.0.0",
    retrieved_at: "2026-07-24",
    source: "https://www.tiktok.com/help/",
    formats: [
      {
        id: "video",
        name: "Video Post",
        aspect_ratio: "9:16",
        dimensions: { width: 1080, height: 1920, unit: "px" },
        safe_zone: { top: 150, right: 80, bottom: 450, left: 80 },
        max_video_duration_s: 600,
        max_text_length: 2200,
        file_types: ["mp4", "mov"],
        max_file_size_mb: 287
      }
    ],
    accessibility_constraints: {
      min_contrast_ratio: 4.5,
      caption_required: true
    },
    tone_guidance: {
      en: "Trend-aware. Authentic. Hook in first 2 seconds.",
      es: "Consciente de tendencias. Autentico. Gancho en los primeros 2 segundos."
    }
  },

  facebook: {
    id: "facebook",
    name: "Facebook",
    version: "1.0.0",
    retrieved_at: "2026-07-24",
    source: "https://www.facebook.com/help/",
    formats: [
      {
        id: "feed-image",
        name: "Feed Image",
        aspect_ratio: "1.91:1",
        dimensions: { width: 1200, height: 628, unit: "px" },
        safe_zone: { top: 100, right: 100, bottom: 100, left: 100 },
        max_text_length: 5000,
        file_types: ["jpg", "png"],
        max_file_size_mb: 30
      },
      {
        id: "feed-square",
        name: "Feed Square",
        aspect_ratio: "1:1",
        dimensions: { width: 1200, height: 1200, unit: "px" },
        safe_zone: { top: 100, right: 100, bottom: 100, left: 100 },
        max_text_length: 5000,
        file_types: ["jpg", "png"],
        max_file_size_mb: 30
      },
      {
        id: "cover",
        name: "Cover Photo",
        aspect_ratio: "2.7:1",
        dimensions: { width: 1640, height: 624, unit: "px" },
        safe_zone: { top: 50, right: 200, bottom: 50, left: 200 },
        file_types: ["jpg", "png"],
        max_file_size_mb: 10
      }
    ],
    accessibility_constraints: {
      min_contrast_ratio: 4.5,
      requires_alt_text: true,
      caption_recommended: true
    },
    tone_guidance: {
      en: "Community-oriented. Conversational. Visual storytelling.",
      es: "Orientado a comunidad. Conversacional. Narracion visual."
    }
  },

  x: {
    id: "x",
    name: "X (formerly Twitter)",
    version: "1.0.0",
    retrieved_at: "2026-07-24",
    source: "https://help.x.com/",
    formats: [
      {
        id: "single-image",
        name: "Single Image Post",
        aspect_ratio: "16:9",
        dimensions: { width: 1600, height: 900, unit: "px" },
        safe_zone: { top: 50, right: 50, bottom: 50, left: 50 },
        max_text_length: 280,
        file_types: ["jpg", "png"],
        max_file_size_mb: 5
      },
      {
        id: "header",
        name: "Profile Header",
        aspect_ratio: "3:1",
        dimensions: { width: 1500, height: 500, unit: "px" },
        safe_zone: { top: 50, right: 200, bottom: 50, left: 200 },
        file_types: ["jpg", "png"],
        max_file_size_mb: 10
      }
    ],
    accessibility_constraints: {
      min_contrast_ratio: 4.5,
      requires_alt_text: true
    },
    tone_guidance: {
      en: "Concise. Direct. Timely.",
      es: "Conciso. Directo. Oportuno."
    }
  },

  email: {
    id: "email",
    name: "Email",
    version: "1.0.0",
    retrieved_at: "2026-07-24",
    source: "internal",
    formats: [
      {
        id: "newsletter",
        name: "Newsletter",
        aspect_ratio: "variable",
        dimensions: { width: 600, height: null, unit: "px" },
        safe_zone: { top: 0, right: 20, bottom: 0, left: 20 },
        max_subject_length: 60,
        max_preheader_length: 100,
        file_types: ["html"],
        notes: "Width 600px is industry standard. Test on mobile and desktop clients."
      },
      {
        id: "transactional",
        name: "Transactional Email",
        aspect_ratio: "variable",
        dimensions: { width: 600, height: null, unit: "px" },
        safe_zone: { top: 0, right: 20, bottom: 0, left: 20 },
        file_types: ["html"],
        notes: "Keep transactional emails focused on a single action."
      }
    ],
    accessibility_constraints: {
      min_contrast_ratio: 4.5,
      requires_alt_text: true,
      plain_text_fallback: true
    },
    tone_guidance: {
      en: "Clear subject line. Single purpose. Actionable CTA.",
      es: "Asunto claro. Un proposito. CTA accionable."
    }
  },

  web: {
    id: "web",
    name: "Web",
    version: "1.0.0",
    retrieved_at: "2026-07-24",
    source: "internal",
    formats: [
      {
        id: "hero-desktop",
        name: "Hero (Desktop)",
        aspect_ratio: "21:9",
        dimensions: { width: 2560, height: 1097, unit: "px" },
        safe_zone: { top: 100, right: 200, bottom: 100, left: 200 },
        file_types: ["jpg", "png", "webp", "svg"],
        notes: "Design for multiple breakpoints. Use responsive images."
      },
      {
        id: "hero-mobile",
        name: "Hero (Mobile)",
        aspect_ratio: "9:16",
        dimensions: { width: 750, height: 1334, unit: "px" },
        safe_zone: { top: 100, right: 40, bottom: 200, left: 40 },
        file_types: ["jpg", "png", "webp", "svg"],
        notes: "Touch targets minimum 44x44px. Content visible without scroll."
      },
      {
        id: "og-image",
        name: "Open Graph Image",
        aspect_ratio: "1.91:1",
        dimensions: { width: 1200, height: 630, unit: "px" },
        safe_zone: { top: 50, right: 50, bottom: 50, left: 50 },
        file_types: ["jpg", "png"],
        notes: "Used for social sharing previews."
      },
      {
        id: "favicon",
        name: "Favicon",
        aspect_ratio: "1:1",
        dimensions: { width: 32, height: 32, unit: "px" },
        safe_zone: { top: 2, right: 2, bottom: 2, left: 2 },
        file_types: ["ico", "png", "svg"],
        notes: "Also provide 16x16 and 180x180 for Apple touch icon."
      }
    ],
    accessibility_constraints: {
      min_contrast_ratio: 4.5,
      requires_alt_text: true,
      keyboard_navigation: true,
      wcag_version: "2.2",
      level: "AA"
    },
    tone_guidance: {
      en: "Clear hierarchy. Obvious next action. Scannable content.",
      es: "Jerarquia clara. Siguiente accion obvia. Contenido escaneable."
    }
  },

  print: {
    id: "print",
    name: "Print",
    version: "1.0.0",
    retrieved_at: "2026-07-24",
    source: "internal",
    formats: [
      {
        id: "business-card",
        name: "Business Card",
        aspect_ratio: "1.75:1",
        dimensions: { width: 85, height: 55, unit: "mm" },
        safe_zone: { top: 3, right: 3, bottom: 3, left: 3 },
        bleed: 3,
        resolution_dpi: 300,
        color_profile: "CMYK",
        file_types: ["pdf", "ai"]
      },
      {
        id: "a4-flyer",
        name: "A4 Flyer",
        aspect_ratio: "1:1.414",
        dimensions: { width: 210, height: 297, unit: "mm" },
        safe_zone: { top: 10, right: 10, bottom: 15, left: 10 },
        bleed: 3,
        resolution_dpi: 300,
        color_profile: "CMYK",
        file_types: ["pdf", "ai"]
      },
      {
        id: "poster-a3",
        name: "A3 Poster",
        aspect_ratio: "1:1.414",
        dimensions: { width: 297, height: 420, unit: "mm" },
        safe_zone: { top: 15, right: 15, bottom: 20, left: 15 },
        bleed: 3,
        resolution_dpi: 300,
        color_profile: "CMYK",
        file_types: ["pdf", "ai"]
      },
      {
        id: "letterhead",
        name: "Letterhead",
        aspect_ratio: "1:1.414",
        dimensions: { width: 210, height: 297, unit: "mm" },
        safe_zone: { top: 20, right: 15, bottom: 20, left: 15 },
        bleed: 3,
        resolution_dpi: 300,
        color_profile: "CMYK",
        file_types: ["pdf", "ai"]
      }
    ],
    accessibility_constraints: {
      min_font_size_pt: 8,
      min_contrast_ratio: 4.5,
      notes: "Consider visual impairment in font size and contrast choices."
    },
    tone_guidance: {
      en: "Tactile. Durable. Legible at intended reading distance.",
      es: "Tactil. Duradero. Legible a la distancia de lectura prevista."
    }
  },

  presentation: {
    id: "presentation",
    name: "Presentation",
    version: "1.0.0",
    retrieved_at: "2026-07-24",
    source: "internal",
    formats: [
      {
        id: "slide-16x9",
        name: "Slide 16:9",
        aspect_ratio: "16:9",
        dimensions: { width: 1920, height: 1080, unit: "px" },
        safe_zone: { top: 80, right: 100, bottom: 80, left: 100 },
        file_types: ["pptx", "pdf", "key"],
        notes: "Keep one idea per slide. Minimize text. Use visual evidence."
      },
      {
        id: "slide-4x3",
        name: "Slide 4:3",
        aspect_ratio: "4:3",
        dimensions: { width: 1024, height: 768, unit: "px" },
        safe_zone: { top: 60, right: 80, bottom: 60, left: 80 },
        file_types: ["pptx", "pdf", "key"]
      }
    ],
    accessibility_constraints: {
      min_contrast_ratio: 4.5,
      min_font_size_pt: 18,
      notes: "Ensure slides are legible from the back of the room."
    },
    tone_guidance: {
      en: "One idea per slide. Visual over text. Speaker supports, slide leads.",
      es: "Una idea por diapositiva. Visual sobre texto. El orador apoya, la diapositiva guia."
    }
  },

  proposal: {
    id: "proposal",
    name: "Proposal",
    version: "1.0.0",
    retrieved_at: "2026-07-24",
    source: "internal",
    formats: [
      {
        id: "proposal-document",
        name: "Proposal Document",
        aspect_ratio: "1:1.414",
        dimensions: { width: 210, height: 297, unit: "mm" },
        safe_zone: { top: 25, right: 20, bottom: 25, left: 20 },
        bleed: 3,
        resolution_dpi: 300,
        color_profile: "CMYK",
        file_types: ["pdf", "docx"],
        notes: "Include scope, timeline, deliverables, acceptance criteria, and terms."
      }
    ],
    accessibility_constraints: {
      min_font_size_pt: 10,
      min_contrast_ratio: 4.5,
      notes: "Structured headings. Table of contents. Clear section numbering."
    },
    tone_guidance: {
      en: "Professional. Specific. Evidence-backed. Clear next steps.",
      es: "Profesional. Especifico. Basado en evidencia. Pasos siguientes claros."
    }
  },

  advertising: {
    id: "advertising",
    name: "Advertising",
    version: "1.0.0",
    retrieved_at: "2026-07-24",
    source: "internal",
    formats: [
      {
        id: "display-leaderboard",
        name: "Display Leaderboard",
        aspect_ratio: "8:1",
        dimensions: { width: 728, height: 90, unit: "px" },
        safe_zone: { top: 10, right: 10, bottom: 10, left: 10 },
        file_types: ["jpg", "png", "gif", "html5"],
        max_file_size_kb: 150
      },
      {
        id: "display-rectangle",
        name: "Display Rectangle",
        aspect_ratio: "3:2",
        dimensions: { width: 300, height: 250, unit: "px" },
        safe_zone: { top: 10, right: 10, bottom: 10, left: 10 },
        file_types: ["jpg", "png", "gif", "html5"],
        max_file_size_kb: 150
      },
      {
        id: "display-skyscraper",
        name: "Display Skyscraper",
        aspect_ratio: "1:4",
        dimensions: { width: 160, height: 600, unit: "px" },
        safe_zone: { top: 10, right: 10, bottom: 10, left: 10 },
        file_types: ["jpg", "png", "gif", "html5"],
        max_file_size_kb: 150
      }
    ],
    accessibility_constraints: {
      min_contrast_ratio: 4.5,
      requires_alt_text: true,
      max_animation_duration_s: 30,
      notes: "Provide stop-animation control for motion-sensitive users."
    },
    tone_guidance: {
      en: "Attention-grabbing. Clear value proposition. Single CTA.",
      es: "Llama la atencion. Propuesta de valor clara. Un solo CTA."
    }
  }
};

export function getPlatformSpec(platformId) {
  const spec = PLATFORM_SPECS[platformId];
  if (!spec) {
    throw new Error(`Unknown platform: ${platformId}. Available: ${PLATFORM_IDS.join(", ")}`);
  }
  return spec;
}

export function getPlatformFormat(platformId, formatId) {
  const spec = getPlatformSpec(platformId);
  const format = spec.formats.find((f) => f.id === formatId);
  if (!format) {
    throw new Error(`Unknown format: ${formatId} for platform ${platformId}`);
  }
  return format;
}

export function listPlatforms() {
  return PLATFORM_IDS.map((id) => ({
    id,
    name: PLATFORM_SPECS[id].name,
    format_count: PLATFORM_SPECS[id].formats.length,
    version: PLATFORM_SPECS[id].version,
    retrieved_at: PLATFORM_SPECS[id].retrieved_at
  }));
}

export function listFormats(platformId) {
  const spec = getPlatformSpec(platformId);
  return spec.formats.map((f) => ({
    id: f.id,
    name: f.name,
    aspect_ratio: f.aspect_ratio,
    dimensions: f.dimensions
  }));
}

export function validatePlatformAsset(platformId, formatId, assetProperties) {
  const spec = getPlatformSpec(platformId);
  const format = getPlatformFormat(platformId, formatId);
  const errors = [];
  const warnings = [];
  if (assetProperties.width && assetProperties.height) {
    if (assetProperties.width !== format.dimensions.width || assetProperties.height !== format.dimensions.height) {
      errors.push(`Dimensions mismatch: expected ${format.dimensions.width}x${format.dimensions.height}, got ${assetProperties.width}x${assetProperties.height}`);
    }
  }
  if (assetProperties.file_type && format.file_types && !format.file_types.includes(assetProperties.file_type)) {
    errors.push(`File type not supported: ${assetProperties.file_type}. Allowed: ${format.file_types.join(", ")}`);
  }
  if (assetProperties.file_size_mb && format.max_file_size_mb && assetProperties.file_size_mb > format.max_file_size_mb) {
    errors.push(`File too large: ${assetProperties.file_size_mb}MB exceeds ${format.max_file_size_mb}MB limit`);
  }
  if (assetProperties.file_size_kb && format.max_file_size_kb && assetProperties.file_size_kb > format.max_file_size_kb) {
    errors.push(`File too large: ${assetProperties.file_size_kb}KB exceeds ${format.max_file_size_kb}KB limit`);
  }
  if (assetProperties.text_length && format.max_text_length && assetProperties.text_length > format.max_text_length) {
    warnings.push(`Text length ${assetProperties.text_length} exceeds recommended max ${format.max_text_length}`);
  }
  if (assetProperties.video_duration_s && format.max_video_duration_s && assetProperties.video_duration_s > format.max_video_duration_s) {
    errors.push(`Video duration ${assetProperties.video_duration_s}s exceeds ${format.max_video_duration_s}s limit`);
  }
  const a11y = spec.accessibility_constraints;
  if (assetProperties.contrast_ratio && a11y?.min_contrast_ratio && assetProperties.contrast_ratio < a11y.min_contrast_ratio) {
    warnings.push(`Contrast ratio ${assetProperties.contrast_ratio} below recommended ${a11y.min_contrast_ratio}`);
  }
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    platform: platformId,
    format: formatId
  };
}
