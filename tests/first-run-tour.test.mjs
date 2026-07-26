import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  VERSION,
  TOUR_STEPS,
  KEYBOARD_SHORTCUTS,
  A11Y_REQUIREMENTS,
  createTourState,
  startTour,
  nextStep,
  prevStep,
  skipTour,
  getCurrentStep,
  handleKeyPress,
  validateTourStep,
  validateTourState,
  validateA11y,
} from "../src/design-system/first-run-tour.mjs";

describe("first-run tour", () => {
  it("exports VERSION string", () => {
    assert.equal(VERSION, "1.0.0");
  });

  it("TOUR_STEPS has 7 steps", () => {
    assert.equal(TOUR_STEPS.length, 7);
  });

  it("every step has id, order, target, position, title, description", () => {
    for (const step of TOUR_STEPS) {
      assert.ok(step.id);
      assert.ok(step.order > 0);
      assert.ok(step.target);
      assert.ok(["center", "top", "bottom", "left", "right"].includes(step.position));
      assert.ok(step.title.en);
      assert.ok(step.title.es);
      assert.ok(step.description.en);
      assert.ok(step.description.es);
      assert.ok(step.dataHelp);
      assert.ok(step.ariaLabel.en);
      assert.ok(step.ariaLabel.es);
    }
  });

  it("steps are in order", () => {
    const orders = TOUR_STEPS.map(s => s.order);
    assert.deepEqual(orders, [1, 2, 3, 4, 5, 6, 7]);
  });

  it("first step is welcome", () => {
    assert.equal(TOUR_STEPS[0].id, "welcome");
  });

  it("last step is complete", () => {
    assert.equal(TOUR_STEPS[6].id, "complete");
  });

  it("KEYBOARD_SHORTCUTS has next, back, skip", () => {
    assert.ok(KEYBOARD_SHORTCUTS.next);
    assert.ok(KEYBOARD_SHORTCUTS.back);
    assert.ok(KEYBOARD_SHORTCUTS.skip);
  });

  it("escape is in skip shortcuts", () => {
    assert.ok(KEYBOARD_SHORTCUTS.skip.includes("Escape"));
  });

  it("A11Y_REQUIREMENTS has 8 requirements", () => {
    assert.equal(A11Y_REQUIREMENTS.length, 8);
  });

  it("every a11y requirement has id, description, severity", () => {
    for (const req of A11Y_REQUIREMENTS) {
      assert.ok(req.id);
      assert.ok(req.description);
      assert.ok(["P0", "P1"].includes(req.severity));
    }
  });
});

describe("createTourState", () => {
  it("creates initial state", () => {
    const state = createTourState();
    assert.equal(state.current_step, 0);
    assert.equal(state.status, "pending");
    assert.equal(state.total_steps, 7);
    assert.equal(state.language, "en");
  });
});

describe("startTour", () => {
  it("starts pending tour", () => {
    const state = createTourState();
    const started = startTour(state);
    assert.equal(started.status, "active");
    assert.equal(started.current_step, 0);
  });

  it("restarts completed tour", () => {
    const state = { ...createTourState(), status: "completed", completed_at: "2026-01-01" };
    const restarted = startTour(state);
    assert.equal(restarted.status, "restarted");
    assert.equal(restarted.current_step, 0);
    assert.equal(restarted.completed_at, null);
  });
});

describe("nextStep", () => {
  it("advances to next step", () => {
    const state = { ...createTourState(), status: "active", current_step: 0 };
    const next = nextStep(state);
    assert.equal(next.current_step, 1);
  });

  it("completes at last step", () => {
    const state = { ...createTourState(), status: "active", current_step: 6 };
    const next = nextStep(state);
    assert.equal(next.status, "completed");
    assert.ok(next.completed_at);
  });

  it("does nothing when not active", () => {
    const state = { ...createTourState(), status: "pending", current_step: 0 };
    const next = nextStep(state);
    assert.equal(next.current_step, 0);
  });
});

describe("prevStep", () => {
  it("goes back to previous step", () => {
    const state = { ...createTourState(), status: "active", current_step: 2 };
    const prev = prevStep(state);
    assert.equal(prev.current_step, 1);
  });

  it("stays at first step", () => {
    const state = { ...createTourState(), status: "active", current_step: 0 };
    const prev = prevStep(state);
    assert.equal(prev.current_step, 0);
  });

  it("does nothing when not active", () => {
    const state = { ...createTourState(), status: "pending", current_step: 2 };
    const prev = prevStep(state);
    assert.equal(prev.current_step, 2);
  });
});

describe("skipTour", () => {
  it("skips active tour", () => {
    const state = { ...createTourState(), status: "active" };
    const skipped = skipTour(state);
    assert.equal(skipped.status, "skipped");
    assert.ok(skipped.skipped_at);
  });
});

describe("getCurrentStep", () => {
  it("returns current step", () => {
    const state = { ...createTourState(), current_step: 3 };
    const step = getCurrentStep(state);
    assert.equal(step.id, "analysis");
  });

  it("returns null for invalid step", () => {
    const state = { ...createTourState(), current_step: 99 };
    assert.equal(getCurrentStep(state), null);
  });
});

describe("handleKeyPress", () => {
  it("advances on ArrowRight", () => {
    const state = { ...createTourState(), status: "active", current_step: 0 };
    const result = handleKeyPress("ArrowRight", state);
    assert.equal(result.action, "next");
    assert.equal(result.state.current_step, 1);
  });

  it("goes back on ArrowLeft", () => {
    const state = { ...createTourState(), status: "active", current_step: 2 };
    const result = handleKeyPress("ArrowLeft", state);
    assert.equal(result.action, "back");
    assert.equal(result.state.current_step, 1);
  });

  it("skips on Escape", () => {
    const state = { ...createTourState(), status: "active", current_step: 0 };
    const result = handleKeyPress("Escape", state);
    assert.equal(result.action, "skip");
    assert.equal(result.state.status, "skipped");
  });

  it("does nothing for unknown key", () => {
    const state = { ...createTourState(), status: "active", current_step: 0 };
    const result = handleKeyPress("a", state);
    assert.equal(result.action, null);
  });

  it("does nothing when not active", () => {
    const state = { ...createTourState(), status: "pending", current_step: 0 };
    const result = handleKeyPress("ArrowRight", state);
    assert.equal(result.action, null);
  });
});

describe("validateTourStep", () => {
  it("accepts valid step", () => {
    assert.ok(validateTourStep("welcome").valid);
  });

  it("rejects unknown step", () => {
    assert.ok(!validateTourStep("unknown").valid);
  });
});

describe("validateTourState", () => {
  it("accepts valid state", () => {
    const state = createTourState();
    assert.ok(validateTourState(state).valid);
  });

  it("rejects null state", () => {
    assert.ok(!validateTourState(null).valid);
  });
});

describe("validateA11y", () => {
  it("returns all requirements as passed", () => {
    const results = validateA11y();
    assert.equal(results.length, 8);
    assert.ok(results.every(r => r.passed));
  });
});
