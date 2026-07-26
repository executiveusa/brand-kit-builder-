/**
 * Usage Guide & Onboarding — Phase 20: BKB-GUIDE-001
 *
 * Contextual help system for Pauli Brand Studio.
 * Provides inline guidance, tooltips, onboarding checklists, and contextual tips.
 */

const VERSION = "1.0.0";

/* ─── Guide Topics ───────────────────────────────────────────────────────── */

const GUIDE_TOPICS = [
  {
    id: "getting-started",
    title: { en: "Getting Started", es: "Primeros Pasos" },
    description: {
      en: "Learn the basics of creating your first brand kit.",
      es: "Aprende los conceptos básicos para crear tu primer brand kit.",
    },
    dataHelp: "guide-getting-started",
    priority: 1,
  },
  {
    id: "intake",
    title: { en: "Project Intake", es: "Captura del Proyecto" },
    description: {
      en: "Fill in your brand details to start the analysis.",
      es: "Completa los detalles de tu marca para iniciar el análisis.",
    },
    dataHelp: "guide-intake",
    priority: 2,
  },
  {
    id: "analysis",
    title: { en: "Brand Analysis", es: "Análisis de Marca" },
    description: {
      en: "Review your brand scorecard and actionable tickets.",
      es: "Revisa la tarjeta de puntuación de tu marca y los tickets accionables.",
    },
    dataHelp: "guide-analysis",
    priority: 3,
  },
  {
    id: "design-system",
    title: { en: "Design System", es: "Sistema de Diseño" },
    description: {
      en: "Explore tokens, components, patterns, and fonts.",
      es: "Explora tokens, componentes, patrones y fuentes.",
    },
    dataHelp: "guide-design-system",
    priority: 4,
  },
  {
    id: "logo",
    title: { en: "Logo Creation", es: "Creación de Logo" },
    description: {
      en: "Generate and refine your logo concepts.",
      es: "Genera y refina los conceptos de tu logo.",
    },
    dataHelp: "guide-logo",
    priority: 5,
  },
  {
    id: "export",
    title: { en: "Exporting", es: "Exportación" },
    description: {
      en: "Export your brand kit in multiple formats.",
      es: "Exporta tu brand kit en múltiples formatos.",
    },
    dataHelp: "guide-export",
    priority: 6,
  },
  {
    id: "keyboard-shortcuts",
    title: { en: "Keyboard Shortcuts", es: "Atajos de Teclado" },
    description: {
      en: "Speed up your workflow with keyboard shortcuts.",
      es: "Acelera tu flujo de trabajo con atajos de teclado.",
    },
    dataHelp: "guide-keyboard-shortcuts",
    priority: 7,
  },
];

/* ─── Tooltips ───────────────────────────────────────────────────────────── */

const TOOLTIPS = {
  "tooltip.project-name": {
    en: "Enter a descriptive name for your brand kit project",
    es: "Introduce un nombre descriptivo para tu proyecto de brand kit",
  },
  "tooltip.brand-url": {
    en: "Paste your website URL for analysis",
    es: "Pega la URL de tu sitio web para análisis",
  },
  "tooltip.color-palette": {
    en: "Select primary and secondary brand colors",
    es: "Selecciona los colores primarios y secundarios de tu marca",
  },
  "tooltip.typography": {
    en: "Choose heading and body fonts for your brand",
    es: "Elige fuentes para títulos y cuerpo de tu marca",
  },
  "tooltip.export-format": {
    en: "Choose the output format for your brand kit",
    es: "Elige el formato de salida para tu brand kit",
  },
  "tooltip.guardian-score": {
    en: "Guardian scores must be 8.0+ to proceed",
    es: "Las puntuaciones del guardian deben ser 8.0+ para continuar",
  },
  "tooltip.language-toggle": {
    en: "Switch between English and Spanish",
    es: "Cambia entre inglés y español",
  },
  "tooltip.tour-restart": {
    en: "Restart the guided tour from the beginning",
    es: "Reinicia el tour guiado desde el principio",
  },
};

/* ─── Onboarding Checklist ──────────────────────────────────────────────── */

const ONBOARDING_CHECKLIST = [
  {
    id: "create-project",
    title: { en: "Create your first project", es: "Crea tu primer proyecto" },
    description: {
      en: "Click 'Create Project' to start building your brand kit.",
      es: "Haz clic en 'Crear Proyecto' para empezar a construir tu brand kit.",
    },
    completed: false,
  },
  {
    id: "fill-intake",
    title: { en: "Complete the intake form", es: "Completa el formulario de intake" },
    description: {
      en: "Fill in your brand name, URL, and description.",
      es: "Completa el nombre de tu marca, URL y descripción.",
    },
    completed: false,
  },
  {
    id: "run-analysis",
    title: { en: "Run brand analysis", es: "Ejecuta el análisis de marca" },
    description: {
      en: "Let the analyzer evaluate your brand across 14 categories.",
      es: "Deja que el analizador evalúe tu marca en 14 categorías.",
    },
    completed: false,
  },
  {
    id: "review-scorecard",
    title: { en: "Review your scorecard", es: "Revisa tu tarjeta de puntuación" },
    description: {
      en: "Check your scores and review actionable tickets.",
      es: "Revisa tus puntuaciones y los tickets accionables.",
    },
    completed: false,
  },
  {
    id: "create-logo",
    title: { en: "Create a logo concept", es: "Crea un concepto de logo" },
    description: {
      en: "Generate logo concepts and refine your favorite.",
      es: "Genera conceptos de logo y refina tu favorito.",
    },
    completed: false,
  },
  {
    id: "export-kit",
    title: { en: "Export your brand kit", es: "Exporta tu brand kit" },
    description: {
      en: "Download your brand kit in SVG, PNG, or PDF.",
      es: "Descarga tu brand kit en SVG, PNG o PDF.",
    },
    completed: false,
  },
];

/* ─── Keyboard Shortcuts ─────────────────────────────────────────────────── */

const KEYBOARD_SHORTCUTS = [
  { keys: ["Ctrl", "N"], action: { en: "New Project", es: "Nuevo Proyecto" }, dataHelp: "shortcut-new-project" },
  { keys: ["Ctrl", "S"], action: { en: "Save", es: "Guardar" }, dataHelp: "shortcut-save" },
  { keys: ["Ctrl", "E"], action: { en: "Export", es: "Exportar" }, dataHelp: "shortcut-export" },
  { keys: ["Ctrl", "/"], action: { en: "Toggle Help", es: "Alternar Ayuda" }, dataHelp: "shortcut-toggle-help" },
  { keys: ["?"], action: { en: "Show Shortcuts", es: "Mostrar Atajos" }, dataHelp: "shortcut-show" },
  { keys: ["Escape"], action: { en: "Close/Cancel", es: "Cerrar/Cancelar" }, dataHelp: "shortcut-close" },
];

/* ─── Guide State ────────────────────────────────────────────────────────── */

function createGuideState() {
  return {
    current_topic: null,
    checklist: ONBOARDING_CHECKLIST.map(item => ({ ...item })),
    completed_topics: [],
    dismissed_tooltips: [],
    tour_completed: false,
    language: "en",
  };
}

function openTopic(state, topicId) {
  const topic = GUIDE_TOPICS.find(t => t.id === topicId);
  if (!topic) return state;
  return { ...state, current_topic: topicId };
}

function closeTopic(state) {
  return { ...state, current_topic: null };
}

function completeChecklistItem(state, itemId) {
  return {
    ...state,
    checklist: state.checklist.map(item =>
      item.id === itemId ? { ...item, completed: true } : item
    ),
  };
}

function dismissTooltip(state, tooltipId) {
  if (state.dismissed_tooltips.includes(tooltipId)) return state;
  return { ...state, dismissed_tooltips: [...state.dismissed_tooltips, tooltipId] };
}

function getCompletionPercentage(state) {
  const total = state.checklist.length;
  const completed = state.checklist.filter(item => item.completed).length;
  return Math.round((completed / total) * 100);
}

/* ─── Validation ─────────────────────────────────────────────────────────── */

function validateGuideTopic(topicId) {
  const topic = GUIDE_TOPICS.find(t => t.id === topicId);
  return { valid: !!topic, topic: topic || null };
}

function validateGuideState(state) {
  const errors = [];
  if (!state) errors.push("State is required");
  if (state && !Array.isArray(state.checklist)) errors.push("checklist must be an array");
  if (state && !Array.isArray(state.dismissed_tooltips)) errors.push("dismissed_tooltips must be an array");
  return { valid: errors.length === 0, errors };
}

function validateAllTranslations() {
  const missing = [];
  for (const topic of GUIDE_TOPICS) {
    if (!topic.title.en || !topic.title.es) missing.push(`topic:${topic.id}:title`);
    if (!topic.description.en || !topic.description.es) missing.push(`topic:${topic.id}:description`);
  }
  for (const [key, val] of Object.entries(TOOLTIPS)) {
    if (!val.en || !val.es) missing.push(`tooltip:${key}`);
  }
  for (const item of ONBOARDING_CHECKLIST) {
    if (!item.title.en || !item.title.es) missing.push(`checklist:${item.id}:title`);
    if (!item.description.en || !item.description.es) missing.push(`checklist:${item.id}:description`);
  }
  return { valid: missing.length === 0, missing };
}

/* ─── Exports ────────────────────────────────────────────────────────────── */

export {
  VERSION,
  GUIDE_TOPICS,
  TOOLTIPS,
  ONBOARDING_CHECKLIST,
  KEYBOARD_SHORTCUTS,
  createGuideState,
  openTopic,
  closeTopic,
  completeChecklistItem,
  dismissTooltip,
  getCompletionPercentage,
  validateGuideTopic,
  validateGuideState,
  validateAllTranslations,
};
