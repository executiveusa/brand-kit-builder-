import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  VERSION,
  EN,
  ES,
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  TRANSLATIONS,
  getLanguage,
  setLanguage,
  onLanguageChange,
  t,
  getTranslationKeys,
  getSupportedLanguages,
  validateTranslations,
  initLanguage,
} from "../src/i18n/bilingual-support.mjs";

describe("bilingual support", () => {
  it("exports VERSION string", () => {
    assert.equal(VERSION, "1.0.0");
  });

  it("EN and ES constants", () => {
    assert.equal(EN, "en");
    assert.equal(ES, "es");
  });

  it("DEFAULT_LANGUAGE is EN", () => {
    assert.equal(DEFAULT_LANGUAGE, EN);
  });

  it("SUPPORTED_LANGUAGES includes en and es", () => {
    assert.deepEqual(SUPPORTED_LANGUAGES, [EN, ES]);
  });

  it("TRANSLATIONS has keys", () => {
    assert.ok(Object.keys(TRANSLATIONS).length > 0);
  });

  it("every translation has en and es", () => {
    for (const [key, val] of Object.entries(TRANSLATIONS)) {
      assert.ok(val.en, `${key} missing en`);
      assert.ok(val.es, `${key} missing es`);
    }
  });
});

describe("getLanguage", () => {
  it("returns default language initially", () => {
    assert.equal(getLanguage(), DEFAULT_LANGUAGE);
  });
});

describe("setLanguage", () => {
  it("changes language", () => {
    setLanguage(ES);
    assert.equal(getLanguage(), ES);
    setLanguage(EN);
    assert.equal(getLanguage(), EN);
  });

  it("returns true on change", () => {
    assert.equal(setLanguage(ES), true);
    setLanguage(EN);
  });

  it("returns false if same language", () => {
    setLanguage(EN);
    assert.equal(setLanguage(EN), false);
  });

  it("returns false for unsupported language", () => {
    assert.equal(setLanguage("fr"), false);
  });
});

describe("onLanguageChange", () => {
  it("notifies listener on change", () => {
    let notified = null;
    const unsub = onLanguageChange(lang => { notified = lang; });
    setLanguage(ES);
    assert.equal(notified, ES);
    setLanguage(EN);
    unsub();
  });

  it("unsubscribe stops notifications", () => {
    let count = 0;
    const unsub = onLanguageChange(() => { count++; });
    setLanguage(ES);
    unsub();
    setLanguage(EN);
    assert.equal(count, 1);
  });
});

describe("t()", () => {
  it("returns translation for current language", () => {
    setLanguage(EN);
    assert.equal(t("nav.dashboard"), "Dashboard");
  });

  it("returns translation for specified language", () => {
    assert.equal(t("nav.dashboard", ES), "Panel");
  });

  it("returns key if not found", () => {
    assert.equal(t("nonexistent.key"), "nonexistent.key");
  });

  it("returns key if language not found", () => {
    assert.equal(t("nav.dashboard", "fr"), "Dashboard");
  });
});

describe("getTranslationKeys", () => {
  it("returns array of keys", () => {
    const keys = getTranslationKeys();
    assert.ok(Array.isArray(keys));
    assert.ok(keys.length > 0);
    assert.ok(keys.includes("nav.dashboard"));
  });
});

describe("getSupportedLanguages", () => {
  it("returns copy of supported languages", () => {
    const langs = getSupportedLanguages();
    assert.deepEqual(langs, [EN, ES]);
    langs.push("fr");
    assert.deepEqual(getSupportedLanguages(), [EN, ES]);
  });
});

describe("validateTranslations", () => {
  it("validates all translations are complete", () => {
    const result = validateTranslations();
    assert.equal(result.valid, true);
    assert.equal(result.missing.length, 0);
  });
});

describe("initLanguage", () => {
  it("initializes without error", () => {
    initLanguage();
  });
});
