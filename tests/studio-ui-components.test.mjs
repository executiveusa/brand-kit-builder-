import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  VERSION,
  STUDIO_COMPONENTS,
  BILINGUAL_LABELS,
  DATA_HELP_DESCRIPTIONS,
  NAVIGATION_STRUCTURE,
  validateComponent,
  validateComponentProps,
  validateBilingualLabel,
  validateDataHelp,
  validateNavItem,
} from "../src/design-system/studio-ui-components.mjs";

describe("studio UI components", () => {
  it("exports VERSION string", () => {
    assert.equal(VERSION, "1.0.0");
  });

  it("STUDIO_COMPONENTS has 10 components", () => {
    assert.equal(Object.keys(STUDIO_COMPONENTS).length, 10);
  });

  it("every component has id, name, description, variants, states, required_props", () => {
    for (const [id, comp] of Object.entries(STUDIO_COMPONENTS)) {
      assert.equal(comp.id, id);
      assert.ok(comp.name);
      assert.ok(comp.description);
      assert.ok(Array.isArray(comp.variants));
      assert.ok(Array.isArray(comp.states));
      assert.ok(Array.isArray(comp.required_props));
      assert.equal(comp.bilingual, true);
    }
  });

  it("button has 5 variants", () => {
    assert.equal(STUDIO_COMPONENTS.button.variants.length, 5);
  });

  it("button has dataHelp in required props", () => {
    assert.ok(STUDIO_COMPONENTS.button.required_props.includes("dataHelp"));
  });

  it("modal has dataHelp in required props", () => {
    assert.ok(STUDIO_COMPONENTS.modal.required_props.includes("dataHelp"));
  });

  it("BILINGUAL_LABELS has 5 categories", () => {
    assert.equal(Object.keys(BILINGUAL_LABELS).length, 5);
  });

  it("every bilingual label has en and es", () => {
    for (const [category, labels] of Object.entries(BILINGUAL_LABELS)) {
      for (const [key, label] of Object.entries(labels)) {
        assert.ok(label.en, `${category}.${key} missing English`);
        assert.ok(label.es, `${category}.${key} missing Spanish`);
      }
    }
  });

  it("DATA_HELP_DESCRIPTIONS has 15 entries", () => {
    assert.equal(Object.keys(DATA_HELP_DESCRIPTIONS).length, 15);
  });

  it("every data-help has en and es", () => {
    for (const [id, desc] of Object.entries(DATA_HELP_DESCRIPTIONS)) {
      assert.ok(desc.en, `${id} missing English`);
      assert.ok(desc.es, `${id} missing Spanish`);
    }
  });

  it("NAVIGATION_STRUCTURE has main and footer", () => {
    assert.ok(NAVIGATION_STRUCTURE.main);
    assert.ok(NAVIGATION_STRUCTURE.footer);
  });

  it("main navigation has 6 items", () => {
    assert.equal(NAVIGATION_STRUCTURE.main.length, 6);
  });

  it("footer navigation has 2 items", () => {
    assert.equal(NAVIGATION_STRUCTURE.footer.length, 2);
  });

  it("every nav item has id, label_en, label_es, icon, data_help", () => {
    const allItems = [...NAVIGATION_STRUCTURE.main, ...NAVIGATION_STRUCTURE.footer];
    for (const item of allItems) {
      assert.ok(item.id);
      assert.ok(item.label_en);
      assert.ok(item.label_es);
      assert.ok(item.icon);
      assert.ok(item.data_help);
    }
  });
});

describe("validateComponent", () => {
  it("accepts button", () => {
    assert.ok(validateComponent("button").valid);
  });

  it("accepts modal", () => {
    assert.ok(validateComponent("modal").valid);
  });

  it("accepts toast", () => {
    assert.ok(validateComponent("toast").valid);
  });

  it("rejects unknown component", () => {
    assert.ok(!validateComponent("datepicker").valid);
  });
});

describe("validateComponentProps", () => {
  it("accepts valid button props", () => {
    const result = validateComponentProps("button", { label: "Save", variant: "primary", dataHelp: "save-changes" });
    assert.equal(result.valid, true);
  });

  it("rejects missing props", () => {
    const result = validateComponentProps("button", { label: "Save" });
    assert.equal(result.valid, false);
    assert.ok(result.error.includes("variant"));
  });

  it("rejects unknown component", () => {
    assert.ok(!validateComponentProps("unknown", {}).valid);
  });
});

describe("validateBilingualLabel", () => {
  it("accepts valid label", () => {
    const result = validateBilingualLabel("button", "primary");
    assert.equal(result.valid, true);
    assert.equal(result.en, "Continue");
    assert.equal(result.es, "Continuar");
  });

  it("accepts nav label", () => {
    const result = validateBilingualLabel("nav", "home");
    assert.equal(result.valid, true);
    assert.equal(result.en, "Home");
    assert.equal(result.es, "Inicio");
  });

  it("rejects unknown category", () => {
    assert.ok(!validateBilingualLabel("unknown", "primary").valid);
  });

  it("rejects unknown key", () => {
    assert.ok(!validateBilingualLabel("button", "unknown").valid);
  });
});

describe("validateDataHelp", () => {
  it("accepts valid data-help", () => {
    const result = validateDataHelp("create-project");
    assert.equal(result.valid, true);
    assert.ok(result.en);
    assert.ok(result.es);
  });

  it("accepts export data-help", () => {
    const result = validateDataHelp("export-brand-kit");
    assert.equal(result.valid, true);
  });

  it("rejects unknown data-help", () => {
    assert.ok(!validateDataHelp("unknown-action").valid);
  });
});

describe("validateNavItem", () => {
  it("accepts dashboard", () => {
    assert.ok(validateNavItem("dashboard").valid);
  });

  it("accepts help from footer", () => {
    assert.ok(validateNavItem("help").valid);
  });

  it("returns item details", () => {
    const result = validateNavItem("dashboard");
    assert.equal(result.item.id, "dashboard");
    assert.equal(result.item.label_en, "Dashboard");
  });

  it("rejects unknown nav item", () => {
    assert.ok(!validateNavItem("nonexistent").valid);
  });
});
