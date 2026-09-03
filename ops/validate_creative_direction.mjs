import fs from 'node:fs';

const readJson = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));
const mustExist = (path) => {
  if (!fs.existsSync(path)) throw new Error(`Missing required creative-direction file: ${path}`);
};
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const requiredFiles = [
  'studio/_system/contracts/CREATIVE_DIRECTION.md',
  'studio/_system/skills/creative-direction/SKILL.md',
  'studio/_system/schemas/creative-direction.v1.json',
  'studio/_system/workflows/registry.v1.json',
  'studio/_system/contracts/ICM.md',
  'AGENTS.md',
  'CONTEXT.md',
  'README.md'
];
requiredFiles.forEach(mustExist);

const registry = readJson('studio/_system/workflows/registry.v1.json');
const schema = readJson('studio/_system/schemas/creative-direction.v1.json');
const standard = readJson('studio/_system/governance/DESIGN_STANDARD.json');

const workflow = registry.workflows.find((item) => item.workflow_id === 'creative-direction.v1');
assert(workflow, 'creative-direction.v1 must be registered');

const exactSteps = [
  'governing-idea',
  'territories',
  'distinctiveness',
  'territory-selection',
  'brand-behavior',
  'stress-test',
  'commercial-desirability',
  'proof'
];
assert(JSON.stringify(workflow.steps.map((step) => step.step_id)) === JSON.stringify(exactSteps), 'creative-direction.v1 sequence drifted');
assert(workflow.steps.find((step) => step.step_id === 'territory-selection')?.approval_required === true, 'human territory selection must remain approval-gated');
assert(workflow.steps.find((step) => step.step_id === 'distinctiveness')?.required_verdict === 'OWNABLE', 'distinctiveness must require OWNABLE');

for (const id of ['governing-idea', 'distinctiveness', 'brand-behavior', 'stress-test', 'commercial-desirability']) {
  const step = workflow.steps.find((item) => item.step_id === id);
  assert(step?.min_score === 9, `${id} must retain a 9.0 floor`);
}

const brandKit = registry.workflows.find((item) => item.workflow_id === 'brand-kit.v1');
assert(brandKit, 'brand-kit.v1 missing');
for (const id of ['governing-idea', 'distinctiveness', 'territory-selection', 'behavior', 'stress-test', 'commercial-desirability']) {
  assert(brandKit.steps.some((step) => step.step_id === id), `brand-kit.v1 missing ${id}`);
}
assert(brandKit.quality_floor >= 9, 'brand-kit.v1 quality floor must be at least 9.0');

const requiredSchemaKeys = ['governing_idea', 'distinctiveness', 'brand_behavior', 'stress_test', 'commercial_desirability', 'provenance'];
for (const key of requiredSchemaKeys) assert(schema.required.includes(key), `creative-direction schema missing required key ${key}`);
assert(standard.minimum_ship_score >= 9, 'Design standard must retain >= 9.0 minimum ship score');
assert(standard.builder_may_self_approve === false, 'Builder self-approval must remain prohibited');
assert(standard.done_requires_evidence === true, 'Evidence must remain required');

console.log('creative-direction hardening: PASS');
