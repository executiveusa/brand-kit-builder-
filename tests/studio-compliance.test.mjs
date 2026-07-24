import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const read = (file) => readFile(path.join(root, file), "utf8");

const jsFilesWithButtons = [
  "apps/studio/brand-tools.js",
  "apps/studio/strategy-voice-tools.js",
  "apps/studio/visual-tools.js",
  "apps/studio/brandbook-tools.js",
  "apps/studio/guardian-export-tools.js",
  "apps/studio/tour.js"
];

test("dynamically generated buttons in JS files have data-help", async () => {
  for (const file of jsFilesWithButtons) {
    const source = await read(file);
    const buttonMatches = [...source.matchAll(/<button\b[^>]*>/g)];
    for (const match of buttonMatches) {
      const tag = match[0];
      assert.match(tag, /data-help=/, `${file}: button missing data-help: ${tag.slice(0, 80)}`);
    }
  }
});

test("dynamically generated buttons have accessible names", async () => {
  for (const file of jsFilesWithButtons) {
    const source = await read(file);
    const buttonMatches = [...source.matchAll(/<button\b([\s\S]*?)>([\s\S]*?)<\/button>/g)];
    for (const [, attrs, body] of buttonMatches) {
      const plainText = body.replace(/<[^>]+>/g, "").trim();
      const hasName = /aria-label=/.test(attrs) || plainText.length > 0 || /\$\{.*text\(|\$\{.*copy\(|\$\{.*translate\(/.test(body);
      assert.equal(hasName, true, `${file}: button missing accessible name: ${body.slice(0, 60)}`);
    }
  }
});

test("no emoji characters in studio JS button content", async () => {
  const emojiPattern = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}]/u;
  for (const file of jsFilesWithButtons) {
    const source = await read(file);
    assert.equal(emojiPattern.test(source), false, `${file}: emoji characters are not allowed as interface icons`);
  }
});

test("tour dialog has keyboard navigation and ARIA semantics", async () => {
  const tour = await read("apps/studio/tour.js");
  assert.match(tour, /Escape/, "Tour must handle Escape key to close");
  assert.match(tour, /ArrowRight/, "Tour must handle ArrowRight for next step");
  assert.match(tour, /ArrowLeft/, "Tour must handle ArrowLeft for previous step");
  assert.match(tour, /setAttribute\(.role.,\s*.dialog.\)/, "Tour card must have role=dialog");
  assert.match(tour, /setAttribute\(.aria-modal./, "Tour card must have aria-modal");
  assert.match(tour, /setAttribute\(.aria-labelledby./, "Tour card must have aria-labelledby");
});

test("dialog close buttons have aria-label", async () => {
  const brandTools = await read("apps/studio/brand-tools.js");
  const closeButtons = [...brandTools.matchAll(/<button[^>]*data-(?:workbench|library)-close[^>]*>/g)];
  for (const match of closeButtons) {
    assert.match(match[0], /aria-label=/, "Dialog close button must have aria-label");
  }
});

test("focus management: tour returns focus to tour button on finish", async () => {
  const tour = await read("apps/studio/tour.js");
  assert.match(tour, /tour-button.*focus/, "Tour must return focus to the tour button when finished");
});

test("form submit buttons have data-help", async () => {
  for (const file of jsFilesWithButtons) {
    const source = await read(file);
    const submitMatches = [...source.matchAll(/<button[^>]*type="submit"[^>]*>/g)];
    for (const match of submitMatches) {
      assert.match(match[0], /data-help=/, `${file}: submit button missing data-help: ${match[0].slice(0, 80)}`);
    }
  }
});
