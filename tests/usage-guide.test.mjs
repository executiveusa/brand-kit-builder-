import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
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
} from "../src/guide/usage-guide.mjs";

describe("usage guide", () => {
  it("exports VERSION string", () => {
    assert.equal(VERSION, "1.0.0");
  });

  it("GUIDE_TOPICS has 7 topics", () => {
    assert.equal(GUIDE_TOPICS.length, 7);
  });

  it("every topic has id, title, description, dataHelp, priority", () => {
    for (const topic of GUIDE_TOPICS) {
      assert.ok(topic.id);
      assert.ok(topic.title.en);
      assert.ok(topic.title.es);
      assert.ok(topic.description.en);
      assert.ok(topic.description.es);
      assert.ok(topic.dataHelp);
      assert.ok(topic.priority > 0);
    }
  });

  it("TOOLTIPS has 8 tooltips", () => {
    assert.equal(Object.keys(TOOLTIPS).length, 8);
  });

  it("every tooltip has en and es", () => {
    for (const [key, val] of Object.entries(TOOLTIPS)) {
      assert.ok(val.en, `${key} missing en`);
      assert.ok(val.es, `${key} missing es`);
    }
  });

  it("ONBOARDING_CHECKLIST has 6 items", () => {
    assert.equal(ONBOARDING_CHECKLIST.length, 6);
  });

  it("every checklist item has id, title, description, completed", () => {
    for (const item of ONBOARDING_CHECKLIST) {
      assert.ok(item.id);
      assert.ok(item.title.en);
      assert.ok(item.title.es);
      assert.ok(item.description.en);
      assert.ok(item.description.es);
      assert.equal(item.completed, false);
    }
  });

  it("KEYBOARD_SHORTCUTS has 6 shortcuts", () => {
    assert.equal(KEYBOARD_SHORTCUTS.length, 6);
  });

  it("every shortcut has keys, action, dataHelp", () => {
    for (const shortcut of KEYBOARD_SHORTCUTS) {
      assert.ok(Array.isArray(shortcut.keys));
      assert.ok(shortcut.keys.length > 0);
      assert.ok(shortcut.action.en);
      assert.ok(shortcut.action.es);
      assert.ok(shortcut.dataHelp);
    }
  });
});

describe("createGuideState", () => {
  it("creates initial state", () => {
    const state = createGuideState();
    assert.equal(state.current_topic, null);
    assert.equal(state.checklist.length, 6);
    assert.equal(state.completed_topics.length, 0);
    assert.equal(state.dismissed_tooltips.length, 0);
    assert.equal(state.tour_completed, false);
  });
});

describe("openTopic", () => {
  it("opens valid topic", () => {
    const state = createGuideState();
    const opened = openTopic(state, "getting-started");
    assert.equal(opened.current_topic, "getting-started");
  });

  it("ignores invalid topic", () => {
    const state = createGuideState();
    const opened = openTopic(state, "nonexistent");
    assert.equal(opened.current_topic, null);
  });
});

describe("closeTopic", () => {
  it("closes open topic", () => {
    const state = { ...createGuideState(), current_topic: "getting-started" };
    const closed = closeTopic(state);
    assert.equal(closed.current_topic, null);
  });
});

describe("completeChecklistItem", () => {
  it("completes item", () => {
    const state = createGuideState();
    const completed = completeChecklistItem(state, "create-project");
    const item = completed.checklist.find(i => i.id === "create-project");
    assert.equal(item.completed, true);
  });

  it("does not affect other items", () => {
    const state = createGuideState();
    const completed = completeChecklistItem(state, "create-project");
    const other = completed.checklist.find(i => i.id === "fill-intake");
    assert.equal(other.completed, false);
  });
});

describe("dismissTooltip", () => {
  it("dismisses tooltip", () => {
    const state = createGuideState();
    const dismissed = dismissTooltip(state, "tooltip.project-name");
    assert.ok(dismissed.dismissed_tooltips.includes("tooltip.project-name"));
  });

  it("does not duplicate", () => {
    let state = createGuideState();
    state = dismissTooltip(state, "tooltip.project-name");
    state = dismissTooltip(state, "tooltip.project-name");
    assert.equal(state.dismissed_tooltips.filter(t => t === "tooltip.project-name").length, 1);
  });
});

describe("getCompletionPercentage", () => {
  it("returns 0 for no completions", () => {
    const state = createGuideState();
    assert.equal(getCompletionPercentage(state), 0);
  });

  it("returns 100 for all completions", () => {
    let state = createGuideState();
    for (const item of ONBOARDING_CHECKLIST) {
      state = completeChecklistItem(state, item.id);
    }
    assert.equal(getCompletionPercentage(state), 100);
  });

  it("returns 50 for half completions", () => {
    let state = createGuideState();
    state = completeChecklistItem(state, "create-project");
    state = completeChecklistItem(state, "fill-intake");
    state = completeChecklistItem(state, "run-analysis");
    assert.equal(getCompletionPercentage(state), 50);
  });
});

describe("validateGuideTopic", () => {
  it("accepts valid topic", () => {
    assert.ok(validateGuideTopic("getting-started").valid);
  });

  it("rejects invalid topic", () => {
    assert.ok(!validateGuideTopic("nonexistent").valid);
  });
});

describe("validateGuideState", () => {
  it("accepts valid state", () => {
    assert.ok(validateGuideState(createGuideState()).valid);
  });

  it("rejects null state", () => {
    assert.ok(!validateGuideState(null).valid);
  });
});

describe("validateAllTranslations", () => {
  it("validates all translations are complete", () => {
    const result = validateAllTranslations();
    assert.equal(result.valid, true);
    assert.equal(result.missing.length, 0);
  });
});
