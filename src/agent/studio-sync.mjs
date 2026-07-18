import { createHash } from 'node:crypto';
import { AgentError } from './errors.mjs';
import { assertNoSecretLikeData, assertSafeIdentifier } from './security.mjs';
import { assertPrebuildPassed, scorePrebuild } from './prebuild.mjs';
import { getProject } from './orchestrator.mjs';
import { strategyIsComplete, voiceIsComplete } from '../../apps/studio/project-store.js';
import { visualIsComplete } from '../../apps/studio/studio-project-store.js';
import { brandbookIsComplete } from '../../apps/studio/kaku-brandbook.js';
import { GUARDIAN_ORDER, guardianGate } from '../../apps/studio/guardian-export-domain.js';

const AXIS_MAP = {
  source_completeness: 'source_completeness',
  business_clarity: 'business_clarity',
  audience_clarity: 'audience_clarity',
  offer_conversion_clarity: 'offer_and_conversion_clarity',
  differentiation: 'differentiation',
  purpose_values: 'brand_purpose_and_values',
  proof_claim_safety: 'proof_and_claim_safety',
  voice_evidence: 'voice_evidence',
  visual_evidence: 'visual_evidence',
  logo_status: 'logo_status',
  application_requirements: 'application_requirements',
  accessibility_requirements: 'accessibility_requirements',
  localization_requirements: 'language_and_localization_requirements',
  rights_licensing: 'rights_and_licensing_status',
  technical_environment: 'technical_environment_clarity',
  deliverable_scope: 'deliverable_scope',
  approval_authority: 'approval_authority',
  production_constraints: 'budget_time_and_production_constraints',
  handoff_readiness: 'repository_and_handoff_readiness',
  contradiction_resolution: 'contradiction_resolution'
};

function now() { return new Date().toISOString(); }
function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  return value;
}
function hashEvidence(value) { return createHash('sha256').update(JSON.stringify(canonicalize(value))).digest('hex'); }

function normalizeSources(sources) {
  if (!Array.isArray(sources) || sources.length === 0) throw new AgentError('SOURCE_REQUIRED', 'Studio synchronization requires explicit sources.');
  const normalized = sources.map((source, index) => {
    const sourceId = assertSafeIdentifier(source?.source_id, `sources[${index}].source_id`);
    const trust = source?.trust_level;
    if (!['primary', 'governing', 'reference', 'inspiration'].includes(trust)) throw new AgentError('INVALID_SOURCE_TRUST', 'Studio source trust level is invalid.', { source_id: sourceId });
    const unresolved = (source.conflicts || []).filter((conflict) => !conflict?.resolved);
    if (unresolved.length) throw new AgentError('SOURCE_CONFLICT', 'Studio sources contain unresolved conflicts.', { source_id: sourceId, unresolved: unresolved.length }, 409);
    if (['primary', 'governing'].includes(trust) && source.accessed !== true) throw new AgentError('SOURCE_NOT_ACCESSED', 'Primary and governing sources must be inspected.', { source_id: sourceId }, 409);
    if (!String(source.location || '').trim()) throw new AgentError('INVALID_SOURCE', 'Every studio source requires a location.', { source_id: sourceId });
    return {
      source_id: sourceId,
      type: String(source.type || 'brief'),
      location: String(source.location),
      trust_level: trust,
      accessed: Boolean(source.accessed),
      hash_or_commit: String(source.hash_or_commit || 'unknown'),
      license: String(source.license || source.rights_status || 'unknown'),
      applicable_rules: Array.isArray(source.applicable_rules) ? source.applicable_rules : [],
      conflicts: [],
      notes: String(source.notes || '')
    };
  });
  if (!normalized.some((source) => ['primary', 'governing'].includes(source.trust_level))) throw new AgentError('SOURCE_REQUIRED', 'At least one primary or governing source is required.');
  return normalized;
}

function normalizeReadiness(readiness) {
  const browserScores = readiness?.scores || {};
  const coreScores = {};
  for (const [browserKey, coreKey] of Object.entries(AXIS_MAP)) {
    const value = Number(browserScores[browserKey]);
    if (!Number.isFinite(value)) throw new AgentError('PREBUILD_AXIS_MISMATCH', 'Studio readiness is missing a required axis.', { axis: browserKey });
    coreScores[coreKey] = value;
  }
  const scored = scorePrebuild(coreScores);
  assertPrebuildPassed(scored);
  return scored;
}

function assertReleaseEvidence(snapshot) {
  const missing = [];
  if (!strategyIsComplete(snapshot.strategy)) missing.push('strategy');
  if (!voiceIsComplete(snapshot.voice)) missing.push('voice');
  if (!visualIsComplete(snapshot.visual, snapshot.strategy)) missing.push('visual');
  if (!brandbookIsComplete(snapshot.brandbook)) missing.push('brandbook');
  const guardian = guardianGate(snapshot);
  if (!guardian.passed) missing.push('guardian');
  if (missing.length) throw new AgentError('STUDIO_EVIDENCE_GATE_FAILED', 'Studio release evidence is incomplete.', { missing, guardian }, 409);
  return guardian;
}

function releaseEvidence(snapshot, sources, readiness, guardian) {
  return {
    project_id: snapshot.project_id,
    name: snapshot.name,
    classification: snapshot.classification,
    market: snapshot.market,
    languages: snapshot.languages,
    intake: snapshot.intake,
    sources,
    readiness: readiness.scores,
    strategy: snapshot.strategy,
    voice: snapshot.voice,
    visual: snapshot.visual,
    brandbook: snapshot.brandbook,
    guardians: guardian.guardians,
    guardian_summary: { p0: guardian.p0, unresolved_p1: guardian.unresolved_p1 }
  };
}

export async function syncStudioReleaseEvidence(context, snapshot) {
  assertNoSecretLikeData(snapshot);
  const projectId = assertSafeIdentifier(snapshot?.project_id, 'project_id');
  if (snapshot?.approvals || snapshot?.export_approval || snapshot?.export_package) {
    throw new AgentError('APPROVAL_INJECTION', 'Studio snapshots may not supply approvals or completed export records.', {}, 403);
  }
  const { project } = await getProject(context, projectId);
  if (project.name !== snapshot.name) throw new AgentError('PROJECT_IDENTITY_MISMATCH', 'Studio and agent-core project names do not match.', { core_name: project.name, studio_name: snapshot.name }, 409);
  const sources = normalizeSources(snapshot.sources);
  const readiness = normalizeReadiness(snapshot.readiness);
  const guardian = assertReleaseEvidence(snapshot);
  const evidence = releaseEvidence(snapshot, sources, readiness, guardian);
  const evidenceSha256 = hashEvidence(evidence);
  const previousSync = project.studio_sync;
  const synchronizedAt = previousSync?.evidence_sha256 === evidenceSha256 && previousSync?.synchronized_at
    ? previousSync.synchronized_at
    : now();

  project.sources = sources;
  project.readiness = readiness;
  project.guardians = Object.fromEntries(GUARDIAN_ORDER.map((name) => [name, {
    status: 'passed',
    reviewer_name: guardian.guardians[name].reviewer_name,
    reviewer_role: guardian.guardians[name].reviewer_role,
    independent_confirmed: guardian.guardians[name].independent_confirmed,
    summary: guardian.guardians[name].summary,
    findings: guardian.guardians[name].findings
  }]));
  project.guardian_summary = { p0: guardian.p0, unresolved_p1: guardian.unresolved_p1 };
  project.studio_sync = {
    evidence_sha256: evidenceSha256,
    synchronized_at: synchronizedAt,
    schema_version: String(snapshot.schema_version || 'unknown'),
    channel: 'local-studio-host'
  };
  project.updated_at = now();
  await context.store.saveSourceLedger(projectId, {
    schema_version: '1.0',
    project_id: projectId,
    sources,
    generated_at: synchronizedAt
  });
  await context.store.saveProject(project);
  return { ok: true, project_id: projectId, evidence_sha256: evidenceSha256, synchronized_at: project.studio_sync.synchronized_at };
}
