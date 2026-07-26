/**
 * Studio UI Components — Phase 17: BKB-STUDIO-002
 *
 * Accessible, bilingual UI component definitions for Pauli Brand Studio.
 * Every component has EN/ES labels, data-help descriptions, and ARIA attributes.
 */

const VERSION = "1.0.0";

/* ─── Component Registry ────────────────────────────────────────────────── */

const STUDIO_COMPONENTS = {
  button: {
    id: "button",
    name: "Button",
    description: "Action trigger with label, variant, and state",
    variants: ["primary", "secondary", "ghost", "danger", "success"],
    sizes: ["sm", "md", "lg"],
    states: ["default", "hover", "active", "disabled", "loading"],
    required_props: ["label", "variant", "dataHelp"],
    accessible_pattern: "Button must have visible label and data-help description",
    bilingual: true,
  },
  input: {
    id: "input",
    name: "Input",
    description: "Text input with label, validation, and helper text",
    variants: ["default", "error", "disabled"],
    sizes: ["sm", "md", "lg"],
    states: ["default", "focus", "error", "disabled"],
    required_props: ["type", "label", "dataHelp"],
    accessible_pattern: "Input must have visible label, aria-describedby for errors",
    bilingual: true,
  },
  select: {
    id: "select",
    name: "Select",
    description: "Dropdown selection with options",
    variants: ["default", "multi"],
    sizes: ["sm", "md", "lg"],
    states: ["default", "focus", "disabled"],
    required_props: ["label", "options", "dataHelp"],
    accessible_pattern: "Select must have label, options with values",
    bilingual: true,
  },
  card: {
    id: "card",
    name: "Card",
    description: "Content container with optional actions",
    variants: ["default", "elevated", "outlined", "interactive"],
    sizes: ["sm", "md", "lg"],
    states: ["default", "hover", "selected"],
    required_props: ["content"],
    accessible_pattern: "Interactive card must have role and keyboard support",
    bilingual: true,
  },
  modal: {
    id: "modal",
    name: "Modal",
    description: "Overlay dialog with focus trap",
    variants: ["default", "fullscreen", "confirmation"],
    sizes: ["sm", "md", "lg"],
    states: ["closed", "open"],
    required_props: ["title", "content", "dataHelp"],
    accessible_pattern: "Modal must trap focus, have close button, aria-modal",
    bilingual: true,
  },
  toast: {
    id: "toast",
    name: "Toast",
    description: "Transient notification message",
    variants: ["info", "success", "warning", "error"],
    sizes: ["sm", "md"],
    states: ["showing", "hiding"],
    required_props: ["message", "variant"],
    accessible_pattern: "Toast must have role=status or role=alert",
    bilingual: true,
  },
  tabs: {
    id: "tabs",
    name: "Tabs",
    description: "Tabbed navigation with panels",
    variants: ["underline", "pills", "enclosed"],
    sizes: ["sm", "md"],
    states: ["default"],
    required_props: ["tabs", "dataHelp"],
    accessible_pattern: "Tabs must have role=tablist, role=tab, aria-selected",
    bilingual: true,
  },
  breadcrumb: {
    id: "breadcrumb",
    name: "Breadcrumb",
    description: "Navigation path showing current location",
    variants: ["default", "collapsed"],
    sizes: ["sm", "md"],
    states: ["default"],
    required_props: ["items", "dataHelp"],
    accessible_pattern: "Breadcrumb must have nav element, aria-label, current page aria-current",
    bilingual: true,
  },
  tooltip: {
    id: "tooltip",
    name: "Tooltip",
    description: "Contextual hint on hover or focus",
    variants: ["default", "interactive"],
    sizes: ["sm", "md"],
    states: ["hidden", "visible"],
    required_props: ["content", "target"],
    accessible_pattern: "Tooltip must have aria-describedby on target",
    bilingual: true,
  },
  progress: {
    id: "progress",
    name: "Progress",
    description: "Progress indicator for multi-step workflows",
    variants: ["bar", "circular", "steps"],
    sizes: ["sm", "md"],
    states: ["indeterminate", "determinate"],
    required_props: ["value", "max", "label"],
    accessible_pattern: "Progress must have role=progressbar, aria-valuenow, aria-valuemax",
    bilingual: true,
  },
};

/* ─── Bilingual Labels ──────────────────────────────────────────────────── */

const BILINGUAL_LABELS = {
  button: {
    primary:   { en: "Continue",       es: "Continuar" },
    secondary: { en: "Go Back",        es: "Volver" },
    ghost:     { en: "Cancel",         es: "Cancelar" },
    danger:    { en: "Delete",         es: "Eliminar" },
    success:   { en: "Save",           es: "Guardar" },
  },
  nav: {
    home:      { en: "Home",           es: "Inicio" },
    projects:  { en: "Projects",       es: "Proyectos" },
    settings:  { en: "Settings",       es: "Configuración" },
    help:      { en: "Help",           es: "Ayuda" },
  },
  status: {
    draft:     { en: "Draft",          es: "Borrador" },
    review:    { en: "In Review",      es: "En Revisión" },
    approved:  { en: "Approved",       es: "Aprobado" },
    published: { en: "Published",      es: "Publicado" },
  },
  form: {
    required:  { en: "Required",       es: "Requerido" },
    optional:  { en: "Optional",       es: "Opcional" },
    save:      { en: "Save",           es: "Guardar" },
    cancel:    { en: "Cancel",         es: "Cancelar" },
    submit:    { en: "Submit",         es: "Enviar" },
  },
  tour: {
    next:      { en: "Next",           es: "Siguiente" },
    back:      { en: "Back",           es: "Atrás" },
    skip:      { en: "Skip Tour",      es: "Saltar Tour" },
    finish:    { en: "Finish",         es: "Finalizar" },
  },
};

/* ─── data-help Descriptions ────────────────────────────────────────────── */

const DATA_HELP_DESCRIPTIONS = {
  "create-project":    { en: "Start a new brand kit project",       es: "Iniciar un nuevo proyecto de brand kit" },
  "save-changes":      { en: "Save all changes to the current project", es: "Guardar todos los cambios del proyecto actual" },
  "export-brand-kit":  { en: "Export the brand kit in all formats",  es: "Exportar el brand kit en todos los formatos" },
  "run-analysis":      { en: "Run brand analysis on the current project", es: "Ejecutar análisis de marca en el proyecto actual" },
  "view-guidelines":   { en: "View brand guidelines and rules",     es: "Ver lineamientos y reglas de marca" },
  "open-settings":     { en: "Open project settings",               es: "Abrir configuración del proyecto" },
  "navigate-home":     { en: "Go to the home dashboard",            es: "Ir al panel de inicio" },
  "start-tour":        { en: "Start the guided tour",               es: "Iniciar el tour guiado" },
  "skip-tour":         { en: "Skip the guided tour",                es: "Saltar el tour guiado" },
  "restart-tour":      { en: "Restart the guided tour from the beginning", es: "Reiniciar el tour guiado desde el inicio" },
  "close-modal":       { en: "Close this dialog",                   es: "Cerrar este diálogo" },
  "undo-action":       { en: "Undo the last action",                es: "Deshacer la última acción" },
  "redo-action":       { en: "Redo the last undone action",         es: "Rehacer la última acción deshecha" },
  "toggle-sidebar":    { en: "Show or hide the sidebar",            es: "Mostrar u ocultar la barra lateral" },
  "search":            { en: "Search projects and settings",        es: "Buscar proyectos y configuración" },
};

/* ─── Navigation Structure ──────────────────────────────────────────────── */

const NAVIGATION_STRUCTURE = {
  main: [
    { id: "dashboard",  label_en: "Dashboard",  label_es: "Panel",        icon: "house",        data_help: "navigate-home" },
    { id: "projects",   label_en: "Projects",   label_es: "Proyectos",    icon: "folder",       data_help: "create-project" },
    { id: "analyze",    label_en: "Analyze",    label_es: "Analizar",     icon: "chart-bar",    data_help: "run-analysis" },
    { id: "design",     label_en: "Design",     label_es: "Diseñar",      icon: "paint-brush",  data_help: "view-guidelines" },
    { id: "export",     label_en: "Export",     label_es: "Exportar",     icon: "download",     data_help: "export-brand-kit" },
    { id: "settings",   label_en: "Settings",   label_es: "Configuración",icon: "gear",         data_help: "open-settings" },
  ],
  footer: [
    { id: "help",       label_en: "Help",       label_es: "Ayuda",        icon: "question",     data_help: "help" },
    { id: "tour",       label_en: "Tour",       label_es: "Tour",         icon: "map",          data_help: "start-tour" },
  ],
};

/* ─── Validation Functions ──────────────────────────────────────────────── */

export function validateComponent(componentId) {
  return { valid: componentId in STUDIO_COMPONENTS };
}

export function validateComponentProps(componentId, props) {
  const component = STUDIO_COMPONENTS[componentId];
  if (!component) return { valid: false, error: `Unknown component: ${componentId}` };
  const missing = component.required_props.filter(p => !(p in props));
  return {
    valid: missing.length === 0,
    error: missing.length > 0 ? `Missing required props: ${missing.join(", ")}` : null,
  };
}

export function validateBilingualLabel(category, key) {
  const labels = BILINGUAL_LABELS[category];
  if (!labels) return { valid: false, error: `Unknown label category: ${category}` };
  const label = labels[key];
  if (!label) return { valid: false, error: `Unknown label key: ${key}` };
  return { valid: true, en: label.en, es: label.es };
}

export function validateDataHelp(dataHelpId) {
  const desc = DATA_HELP_DESCRIPTIONS[dataHelpId];
  if (!desc) return { valid: false, error: `Unknown data-help: ${dataHelpId}` };
  return { valid: true, en: desc.en, es: desc.es };
}

export function validateNavItem(navId) {
  const main = NAVIGATION_STRUCTURE.main.find(n => n.id === navId);
  const footer = NAVIGATION_STRUCTURE.footer.find(n => n.id === navId);
  return { valid: !!(main || footer), item: main || footer || null };
}

/* ─── Exports ────────────────────────────────────────────────────────────── */

export {
  VERSION,
  STUDIO_COMPONENTS,
  BILINGUAL_LABELS,
  DATA_HELP_DESCRIPTIONS,
  NAVIGATION_STRUCTURE,
};
