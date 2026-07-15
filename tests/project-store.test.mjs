import test from 'node:test';
import assert from 'node:assert/strict';
import { BrandProjectStore, MemoryStorage, PREBUILD_AXES, calculateReadiness } from '../apps/studio/project-store.js';

test('creates and persists a bilingual project', () => {
  const storage = new MemoryStorage();
  const store = new BrandProjectStore(storage);
  const project = store.create({
    name: 'Estudio Norte',
    source_type: 'idea',
    languages: ['en', 'es-MX'],
    business_goal: 'Clarify the offer',
    audience: 'Local founders',
    primary_action: 'Book a call',
    approval_authority: 'Bambu'
  });
  assert.equal(project.project_id, 'estudio-norte');
  assert.deepEqual(project.languages, ['en', 'es-MX']);
  const reloaded = new BrandProjectStore(storage);
  assert.equal(reloaded.getCurrent().name, 'Estudio Norte');
});

test('blocks readiness until sources and critical axes pass', () => {
  const store = new BrandProjectStore(new MemoryStorage());
  const project = store.create({
    name: 'Blocked Brand',
    source_type: 'url',
    source_location: 'https://example.test',
    business_goal: 'Grow',
    audience: 'Teams',
    primary_action: 'Contact',
    approval_authority: 'Bambu'
  });
  assert.equal(project.readiness.gate, 'FAIL');
  assert.equal(project.stages.readiness.status, 'locked');
});

test('passes the 20-axis gate after accessed sources and complete scores', () => {
  const store = new BrandProjectStore(new MemoryStorage());
  let project = store.create({
    name: 'Ready Brand',
    source_type: 'idea',
    business_goal: 'Grow',
    audience: 'Teams',
    primary_action: 'Contact',
    approval_authority: 'Bambu',
    constraints: 'Two weeks'
  });
  const scores = Object.fromEntries(PREBUILD_AXES.map((axis) => [axis.id, 9]));
  project = store.saveReadinessScores(project.project_id, scores);
  assert.equal(project.readiness.gate, 'PASS');
  assert.equal(project.stages.strategy.status, 'active');
});

test('reports all twenty readiness axes', () => {
  const project = { intake: {}, sources: [], discovery: { answers: {} }, readiness: { scores: {} }, languages: [] };
  const result = calculateReadiness(project);
  assert.equal(Object.keys(result.scores).length, 20);
  assert.ok(result.critical_gaps.length > 0);
});
