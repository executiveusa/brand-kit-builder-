/**
 * Bilingual Support — Phase 19: BKB-TRANSLATE-001
 *
 * EN/ES translation system for Pauli Brand Studio.
 * Provides translation keys, language switching, validation, and persistence.
 */

const VERSION = "1.0.0";

const EN = "en";
const ES = "es";
const DEFAULT_LANGUAGE = EN;
const SUPPORTED_LANGUAGES = [EN, ES];

/* ─── Translation Registry ──────────────────────────────────────────────── */

const TRANSLATIONS = {
  /* ── Navigation ──────────────────────────────────────────────────────── */
  "nav.dashboard": {
    en: "Dashboard",
    es: "Panel",
  },
  "nav.create": {
    en: "Create Project",
    es: "Crear Proyecto",
  },
  "nav.analysis": {
    en: "Analysis",
    es: "Análisis",
  },
  "nav.design-system": {
    en: "Design System",
    es: "Sistema de Diseño",
  },
  "nav.export": {
    en: "Export",
    es: "Exportar",
  },
  "nav.help": {
    en: "Help",
    es: "Ayuda",
  },

  /* ── Tour ────────────────────────────────────────────────────────────── */
  "tour.welcome": {
    en: "Welcome to Pauli Brand Studio",
    es: "Bienvenido a Pauli Brand Studio",
  },
  "tour.dashboard": {
    en: "Your Dashboard",
    es: "Tu Panel",
  },
  "tour.create-project": {
    en: "Create a Project",
    es: "Crear un Proyecto",
  },
  "tour.analysis": {
    en: "Brand Analysis",
    es: "Análisis de Marca",
  },
  "tour.design-system": {
    en: "Design System",
    es: "Sistema de Diseño",
  },
  "tour.export": {
    en: "Export Your Brand Kit",
    es: "Exporta tu Brand Kit",
  },
  "tour.complete": {
    en: "You're All Set!",
    es: "¡Todo Listo!",
  },

  /* ── Common Actions ──────────────────────────────────────────────────── */
  "action.save": {
    en: "Save",
    es: "Guardar",
  },
  "action.cancel": {
    en: "Cancel",
    es: "Cancelar",
  },
  "action.delete": {
    en: "Delete",
    es: "Eliminar",
  },
  "action.edit": {
    en: "Edit",
    es: "Editar",
  },
  "action.next": {
    en: "Next",
    es: "Siguiente",
  },
  "action.back": {
    en: "Back",
    es: "Atrás",
  },
  "action.skip": {
    en: "Skip",
    es: "Saltar",
  },
  "action.finish": {
    en: "Finish",
    es: "Finalizar",
  },
  "action.restart": {
    en: "Restart Tour",
    es: "Reiniciar Tour",
  },
  "action.export": {
    en: "Export",
    es: "Exportar",
  },

  /* ── Status Messages ─────────────────────────────────────────────────── */
  "status.loading": {
    en: "Loading…",
    es: "Cargando…",
  },
  "status.saving": {
    en: "Saving…",
    es: "Guardando…",
  },
  "status.success": {
    en: "Success",
    es: "Éxito",
  },
  "status.error": {
    en: "Error",
    es: "Error",
  },
  "status.warning": {
    en: "Warning",
    es: "Advertencia",
  },
  "status.info": {
    en: "Info",
    es: "Info",
  },

  /* ── Validation Messages ─────────────────────────────────────────────── */
  "validation.required": {
    en: "This field is required",
    es: "Este campo es obligatorio",
  },
  "validation.invalid-email": {
    en: "Please enter a valid email",
    es: "Por favor, introduce un email válido",
  },
  "validation.too-short": {
    en: "Text is too short",
    es: "El texto es demasiado corto",
  },
  "validation.too-long": {
    en: "Text is too long",
    es: "El texto es demasiado largo",
  },

  /* ── Guardian Messages ───────────────────────────────────────────────── */
  "guardian.pass": {
    en: "All checks passed",
    es: "Todas las verificaciones pasaron",
  },
  "guardian.fail": {
    en: "Some checks failed",
    es: "Algunas verificaciones fallaron",
  },
  "guardian.blocked": {
    en: "Blocked by guardian",
    es: "Bloqueado por guardian",
  },

  /* ── Export Messages ─────────────────────────────────────────────────── */
  "export.ready": {
    en: "Your brand kit is ready to export",
    es: "Tu brand kit está listo para exportar",
  },
  "export.choose-format": {
    en: "Choose an export format",
    es: "Elige un formato de exportación",
  },
  "export.complete": {
    en: "Export complete",
    es: "Exportación completa",
  },
};

/* ─── Language State ─────────────────────────────────────────────────────── */

let currentLanguage = DEFAULT_LANGUAGE;
let languageListeners = [];

/**
 * Get the current language.
 * @returns {string} Current language code (en or es).
 */
export function getLanguage() {
  return currentLanguage;
}

/**
 * Set the current language and notify listeners.
 * @param {string} lang - Language code (en or es).
 * @returns {boolean} True if language changed, false otherwise.
 */
export function setLanguage(lang) {
  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    return false;
  }
  if (lang === currentLanguage) {
    return false;
  }
  currentLanguage = lang;
  persistLanguage(lang);
  notifyListeners(lang);
  return true;
}

/**
 * Subscribe to language changes.
 * @param {Function} listener - Callback receiving new language code.
 * @returns {Function} Unsubscribe function.
 */
export function onLanguageChange(listener) {
  languageListeners.push(listener);
  return () => {
    languageListeners = languageListeners.filter(l => l !== listener);
  };
}

function notifyListeners(lang) {
  for (const listener of languageListeners) {
    try {
      listener(lang);
    } catch {
      /* ignore listener errors */
    }
  }
}

/* ─── Translation Retrieval ──────────────────────────────────────────────── */

/**
 * Get a translation for the given key and language.
 * @param {string} key - Translation key.
 * @param {string} [lang] - Language code (defaults to current language).
 * @returns {string} Translated string, or the key itself if not found.
 */
export function t(key, lang) {
  const language = lang || currentLanguage;
  const entry = TRANSLATIONS[key];
  if (!entry) {
    return key;
  }
  return entry[language] || entry[DEFAULT_LANGUAGE] || key;
}

/**
 * Get all keys in the translation registry.
 * @returns {string[]} Array of translation keys.
 */
export function getTranslationKeys() {
  return Object.keys(TRANSLATIONS);
}

/**
 * Get all supported languages.
 * @returns {string[]} Array of supported language codes.
 */
export function getSupportedLanguages() {
  return [...SUPPORTED_LANGUAGES];
}

/* ─── Validation ─────────────────────────────────────────────────────────── */

/**
 * Validate that all translation keys have entries for all supported languages.
 * @returns {{ valid: boolean, missing: string[] }} Validation result.
 */
export function validateTranslations() {
  const missing = [];
  for (const key of Object.keys(TRANSLATIONS)) {
    for (const lang of SUPPORTED_LANGUAGES) {
      if (!TRANSLATIONS[key][lang]) {
        missing.push(`${key}:${lang}`);
      }
    }
  }
  return { valid: missing.length === 0, missing };
}

/* ─── Persistence ────────────────────────────────────────────────────────── */

const STORAGE_KEY = "pauli-studio-language";

/**
 * Persist language preference.
 * @param {string} lang - Language code.
 */
function persistLanguage(lang) {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, lang);
    }
  } catch {
    /* ignore storage errors */
  }
}

/**
 * Load persisted language preference.
 * @returns {string|null} Persisted language code, or null.
 */
function loadPersistedLanguage() {
  try {
    if (typeof localStorage !== "undefined") {
      return localStorage.getItem(STORAGE_KEY);
    }
  } catch {
    /* ignore storage errors */
  }
  return null;
}

/**
 * Initialize language from persistence.
 * Call this once at startup.
 */
export function initLanguage() {
  const persisted = loadPersistedLanguage();
  if (persisted && SUPPORTED_LANGUAGES.includes(persisted)) {
    currentLanguage = persisted;
  }
}

/* ─── Exports ────────────────────────────────────────────────────────────── */

export {
  VERSION,
  EN,
  ES,
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  TRANSLATIONS,
};
