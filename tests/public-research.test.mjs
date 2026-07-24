import { test } from "node:test";
import assert from "node:assert/strict";
import {
  RESEARCH_MODULE_VERSION,
  RESEARCH_AGENT_TYPES,
  RESEARCH_AGENT_DEFINITIONS,
  SOURCE_TYPES,
  createResearchAgent,
  addEvidence,
  analyzeEvidenceConflicts,
  calculateConfidence,
  filterPublicClaims,
  createReputationSummary,
  createSocialPresenceSummary,
  createCompetitorAnalysis,
  createEvidenceAnalysis,
  validateResearchPolicy,
  assertPublicOnly
} from "../src/research/public-research.mjs";
import { AgentError } from "../src/agent/errors.mjs";

test("research module defines 5 agent types", () => {
  assert.equal(RESEARCH_AGENT_TYPES.length, 5);
  assert.ok(RESEARCH_AGENT_TYPES.includes("public-research"));
  assert.ok(RESEARCH_AGENT_TYPES.includes("reputation"));
  assert.ok(RESEARCH_AGENT_TYPES.includes("social-presence"));
  assert.ok(RESEARCH_AGENT_TYPES.includes("competitor-category"));
  assert.ok(RESEARCH_AGENT_TYPES.includes("evidence-analyst"));
});

test("every agent definition has prohibited actions", () => {
  for (const [type, def] of Object.entries(RESEARCH_AGENT_DEFINITIONS)) {
    assert.ok(def.prohibited_actions.length > 0, `Agent ${type} must have prohibited actions`);
    assert.ok(def.prohibited_actions.includes("login-bypass") || def.prohibited_actions.includes("private-scraping") || def.prohibited_actions.includes("inventing-evidence"), `Agent ${type} must prohibit private/login access`);
  }
});

test("createResearchAgent creates valid agent", () => {
  const agent = createResearchAgent("reputation", { project_id: "test-1" });
  assert.equal(agent.agent_type, "reputation");
  assert.equal(agent.project_id, "test-1");
  assert.ok(Array.isArray(agent.evidence));
  assert.ok(Array.isArray(agent.allowed_sources));
  assert.ok(Array.isArray(agent.prohibited_actions));
});

test("createResearchAgent rejects unknown agent type", () => {
  assert.throws(() => createResearchAgent("unknown"), AgentError);
});

test("addEvidence creates valid EvidenceRecord", () => {
  const agent = createResearchAgent("reputation", { project_id: "test-1" });
  const evidence = addEvidence(agent, {
    evidence_id: "ev-1",
    claim: "Customers love the product",
    source_url: "https://reviews.example.com/1",
    source_type: "review",
    confidence: 0.9,
    verification_state: "verified",
    usable_for_public_claims: true
  });
  assert.equal(evidence.project_id, "test-1");
  assert.equal(evidence.verification_state, "verified");
  assert.equal(agent.evidence.length, 1);
});

test("addEvidence rejects invalid source type", () => {
  const agent = createResearchAgent("reputation", { project_id: "test-1" });
  assert.throws(() => addEvidence(agent, {
    evidence_id: "ev-1",
    source_type: "invalid-type",
    verification_state: "verified"
  }), AgentError);
});

test("addEvidence rejects invalid verification state", () => {
  const agent = createResearchAgent("reputation", { project_id: "test-1" });
  assert.throws(() => addEvidence(agent, {
    evidence_id: "ev-1",
    source_type: "review",
    verification_state: "invalid-state"
  }), AgentError);
});

test("analyzeEvidenceConflicts detects conflicting states", () => {
  const evidence = [
    { claim: "Great service", verification_state: "verified", source_url: "https://a.com" },
    { claim: "Great service", verification_state: "unverified", source_url: "https://b.com" }
  ];
  const result = analyzeEvidenceConflicts(evidence);
  assert.equal(result.has_conflicts, true);
  assert.ok(result.conflicts.length > 0);
});

test("analyzeEvidenceConflicts returns no conflicts for consistent evidence", () => {
  const evidence = [
    { claim: "Great service", verification_state: "verified", source_url: "https://a.com" },
    { claim: "Great service", verification_state: "verified", source_url: "https://b.com" }
  ];
  const result = analyzeEvidenceConflicts(evidence);
  assert.equal(result.has_conflicts, false);
});

test("analyzeEvidenceConflicts handles empty evidence", () => {
  const result = analyzeEvidenceConflicts([]);
  assert.equal(result.has_conflicts, false);
  assert.equal(result.conflicts.length, 0);
});

test("calculateConfidence returns 1.0 for all verified", () => {
  const evidence = [
    { verification_state: "verified" },
    { verification_state: "verified" }
  ];
  assert.equal(calculateConfidence(evidence), 1.0);
});

test("calculateConfidence returns 0 for empty evidence", () => {
  assert.equal(calculateConfidence([]), 0);
});

test("calculateConfidence weights inferred lower than verified", () => {
  const evidence = [
    { verification_state: "verified" },
    { verification_state: "inferred" }
  ];
  const confidence = calculateConfidence(evidence);
  assert.ok(confidence > 0.5 && confidence < 1.0);
});

test("filterPublicClaims returns only verified public claims", () => {
  const evidence = [
    { claim: "A", verification_state: "verified", usable_for_public_claims: true },
    { claim: "B", verification_state: "unverified", usable_for_public_claims: true },
    { claim: "C", verification_state: "verified", usable_for_public_claims: false }
  ];
  const filtered = filterPublicClaims(evidence);
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].claim, "A");
});

test("createReputationSummary produces valid summary", () => {
  const agent = createResearchAgent("reputation", { project_id: "test-1" });
  addEvidence(agent, { evidence_id: "ev-1", claim: "positive experience", source_url: "https://reviews.example.com/1", source_type: "review", verification_state: "verified", usable_for_public_claims: true });
  addEvidence(agent, { evidence_id: "ev-2", claim: "negative complaint", source_url: "https://reviews.example.com/2", source_type: "review", verification_state: "verified", usable_for_public_claims: true });
  const summary = createReputationSummary(agent);
  assert.equal(summary.project_id, "test-1");
  assert.equal(summary.total_reviews, 2);
  assert.ok(summary.positive_themes.length >= 0);
  assert.ok(summary.negative_themes.length >= 0);
});

test("createReputationSummary rejects non-reputation agent", () => {
  const agent = createResearchAgent("social-presence", { project_id: "test-1" });
  assert.throws(() => createReputationSummary(agent), AgentError);
});

test("createSocialPresenceSummary produces valid summary", () => {
  const agent = createResearchAgent("social-presence", { project_id: "test-1" });
  addEvidence(agent, { evidence_id: "ev-1", claim: "Instagram profile active", source_url: "https://instagram.com/example", source_type: "social", verification_state: "verified", usable_for_public_claims: true });
  addEvidence(agent, { evidence_id: "ev-2", claim: "Twitter profile abandoned", source_url: "https://twitter.com/example", source_type: "social", verification_state: "unverified", usable_for_public_claims: false });
  const summary = createSocialPresenceSummary(agent);
  assert.equal(summary.total_profiles, 2);
  assert.ok(summary.platforms.length > 0);
});

test("createCompetitorAnalysis produces valid analysis", () => {
  const agent = createResearchAgent("competitor-category", { project_id: "test-1" });
  addEvidence(agent, { evidence_id: "ev-1", claim: "Competitor A", source_url: "https://competitor-a.com", source_type: "website", verification_state: "verified", usable_for_public_claims: true });
  addEvidence(agent, { evidence_id: "ev-2", claim: "Competitor B", source_url: "https://competitor-b.com", source_type: "website", verification_state: "inferred", usable_for_public_claims: false });
  const analysis = createCompetitorAnalysis(agent);
  assert.equal(analysis.competitor_count, 2);
  assert.equal(analysis.verified_competitors, 1);
});

test("createEvidenceAnalysis produces conflict report", () => {
  const agent = createResearchAgent("evidence-analyst", { project_id: "test-1" });
  const allEvidence = [
    { evidence_id: "ev-1", claim: "A", verification_state: "verified", source_url: "https://a.com", usable_for_public_claims: true },
    { evidence_id: "ev-2", claim: "A", verification_state: "unverified", source_url: "https://b.com", usable_for_public_claims: true }
  ];
  const analysis = createEvidenceAnalysis(agent, allEvidence);
  assert.equal(analysis.total_evidence, 2);
  assert.equal(analysis.has_conflicts, true);
  assert.ok(analysis.overall_confidence > 0);
});

test("validateResearchPolicy blocks prohibited actions", () => {
  const agent = createResearchAgent("reputation", { project_id: "test-1" });
  assert.throws(() => validateResearchPolicy(agent, "login-bypass"), AgentError);
  assert.throws(() => validateResearchPolicy(agent, "fake-reviews"), AgentError);
});

test("validateResearchPolicy allows non-prohibited actions", () => {
  const agent = createResearchAgent("reputation", { project_id: "test-1" });
  assert.equal(validateResearchPolicy(agent, "gather-public-reviews"), true);
});

test("assertPublicOnly blocks login-required sources", () => {
  const evidence = [{ source_url: "https://example.com/loginrequired" }];
  assert.throws(() => assertPublicOnly(evidence), AgentError);
});

test("assertPublicOnly allows public sources", () => {
  const evidence = [{ source_url: "https://example.com/about" }];
  assert.equal(assertPublicOnly(evidence), true);
});

test("source types include all required types", () => {
  for (const type of ["website", "review", "social", "news", "repository"]) {
    assert.ok(SOURCE_TYPES.includes(type), `Source type ${type} must be defined`);
  }
});

test("deterministic: same evidence produces same confidence", () => {
  const evidence = [
    { verification_state: "verified" },
    { verification_state: "verified" },
    { verification_state: "inferred" }
  ];
  const c1 = calculateConfidence(evidence);
  const c2 = calculateConfidence(evidence);
  assert.equal(c1, c2);
});
