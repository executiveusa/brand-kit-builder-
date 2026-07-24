import { createEvidenceRecord, EVIDENCE_VERIFICATION_STATES } from "../../apps/studio/contracts.js";
import { AgentError } from "../agent/errors.mjs";

export const RESEARCH_MODULE_VERSION = "1.0.0";

export const RESEARCH_AGENT_TYPES = [
  "public-research",
  "reputation",
  "social-presence",
  "competitor-category",
  "evidence-analyst"
];

export const RESEARCH_AGENT_DEFINITIONS = {
  "public-research": {
    name: "Public Research Agent",
    description: "Gathers general public web information about the brand",
    allowed_sources: ["website", "search-results", "news", "blog-posts", "publications"],
    prohibited_actions: ["login-bypass", "private-scraping", "authentication-evasion", "inventing-evidence"],
    output_type: "evidence-records"
  },
  "reputation": {
    name: "Reputation Agent",
    description: "Gathers public reviews and reputation themes",
    allowed_sources: ["review-platforms", "public-testimonials", "news"],
    prohibited_actions: ["login-bypass", "fake-reviews", "private-reviews", "invented-testimonials"],
    output_type: "reputation-summary"
  },
  "social-presence": {
    name: "Social Presence Agent",
    description: "Discovers and analyzes public social media profiles",
    allowed_sources: ["public-social-profiles", "public-posts", "public-metrics"],
    prohibited_actions: ["login-bypass", "private-profiles", "login-required-content", "dm-scraping"],
    output_type: "social-presence-summary"
  },
  "competitor-category": {
    name: "Competitor/Category Agent",
    description: "Identifies competitors and category conventions",
    allowed_sources: ["public-competitor-sites", "industry-reports", "search-results"],
    prohibited_actions: ["login-bypass", "private-competitor-data", "ndc-violations", "inventing-evidence"],
    output_type: "competitor-analysis"
  },
  "evidence-analyst": {
    name: "Evidence Analyst",
    description: "Analyzes collected evidence for conflicts, confidence, and verification",
    allowed_sources: ["collected-evidence"],
    prohibited_actions: ["login-bypass", "inventing-evidence", "altering-verification-state"],
    output_type: "evidence-analysis"
  }
};

export const SOURCE_TYPES = [
  "website",
  "review",
  "social",
  "news",
  "repository",
  "publication",
  "search-results",
  "industry-report",
  "public-profile",
  "blog-post"
];

export function createResearchAgent(agentType, config = {}) {
  if (!RESEARCH_AGENT_TYPES.includes(agentType)) {
    throw new AgentError("INVALID_RESEARCH_AGENT", "Unknown research agent type.", { agent_type: agentType, allowed: RESEARCH_AGENT_TYPES });
  }
  const definition = RESEARCH_AGENT_DEFINITIONS[agentType];
  return {
    agent_type: agentType,
    name: definition.name,
    description: definition.description,
    allowed_sources: [...definition.allowed_sources],
    prohibited_actions: [...definition.prohibited_actions],
    project_id: config.project_id || null,
    started_at: new Date().toISOString(),
    evidence: [],
    findings: []
  };
}

export function addEvidence(agent, evidenceInput) {
  if (!agent || !Array.isArray(agent.evidence)) {
    throw new AgentError("INVALID_AGENT", "Agent must have an evidence array.");
  }
  const evidence = createEvidenceRecord({
    ...evidenceInput,
    project_id: agent.project_id
  });
  if (!SOURCE_TYPES.includes(evidence.source_type)) {
    throw new AgentError("INVALID_SOURCE_TYPE", "Evidence source type is not allowed.", { source_type: evidence.source_type, allowed: SOURCE_TYPES });
  }
  if (!EVIDENCE_VERIFICATION_STATES.includes(evidence.verification_state)) {
    throw new AgentError("INVALID_VERIFICATION_STATE", "Evidence verification state is invalid.", { verification_state: evidence.verification_state, allowed: EVIDENCE_VERIFICATION_STATES });
  }
  agent.evidence.push(evidence);
  return evidence;
}

export function analyzeEvidenceConflicts(evidence) {
  if (!Array.isArray(evidence) || evidence.length === 0) {
    return { conflicts: [], has_conflicts: false };
  }
  const byClaim = new Map();
  for (const ev of evidence) {
    const key = ev.claim?.toLowerCase().trim();
    if (!key) continue;
    if (!byClaim.has(key)) byClaim.set(key, []);
    byClaim.get(key).push(ev);
  }
  const conflicts = [];
  for (const [claim, records] of byClaim) {
    const states = [...new Set(records.map((r) => r.verification_state))];
    if (states.includes("conflicting") || (states.length > 1 && states.includes("verified") && states.includes("unverified"))) {
      conflicts.push({ claim, records, conflicting_states: states });
    }
  }
  return { conflicts, has_conflicts: conflicts.length > 0 };
}

export function calculateConfidence(evidence) {
  if (!Array.isArray(evidence) || evidence.length === 0) return 0;
  const weights = { verified: 1.0, inferred: 0.5, unverified: 0.2, conflicting: 0.0 };
  const totalWeight = evidence.reduce((sum, ev) => sum + (weights[ev.verification_state] || 0), 0);
  return Number((totalWeight / evidence.length).toFixed(2));
}

export function filterPublicClaims(evidence) {
  return evidence.filter((ev) => ev.usable_for_public_claims === true && ev.verification_state === "verified");
}

export function createReputationSummary(agent) {
  if (!agent || agent.agent_type !== "reputation") {
    throw new AgentError("INVALID_AGENT", "Reputation summary requires a reputation agent.");
  }
  const positive = agent.evidence.filter((ev) => ev.claim?.toLowerCase().includes("positive") || ev.claim?.toLowerCase().includes("good") || ev.claim?.toLowerCase().includes("excellent"));
  const negative = agent.evidence.filter((ev) => ev.claim?.toLowerCase().includes("negative") || ev.claim?.toLowerCase().includes("bad") || ev.claim?.toLowerCase().includes("poor") || ev.claim?.toLowerCase().includes("complaint"));
  const themes = new Map();
  for (const ev of agent.evidence) {
    const words = (ev.claim || "").toLowerCase().split(/\s+/);
    for (const word of words) {
      if (word.length > 4 && !["about", "their", "there", "would", "could", "should"].includes(word)) {
        themes.set(word, (themes.get(word) || 0) + 1);
      }
    }
  }
  const topThemes = [...themes.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([word, count]) => ({ word, count }));
  return {
    schema_version: "1.0",
    project_id: agent.project_id,
    agent_type: "reputation",
    total_reviews: agent.evidence.length,
    positive_themes: positive.map((ev) => ev.claim),
    negative_themes: negative.map((ev) => ev.claim),
    recurring_topics: topThemes,
    verified_reviews: agent.evidence.filter((ev) => ev.verification_state === "verified").length,
    unverified_reviews: agent.evidence.filter((ev) => ev.verification_state === "unverified").length,
    confidence: calculateConfidence(agent.evidence),
    generated_at: new Date().toISOString()
  };
}

export function createSocialPresenceSummary(agent) {
  if (!agent || agent.agent_type !== "social-presence") {
    throw new AgentError("INVALID_AGENT", "Social presence summary requires a social-presence agent.");
  }
  const platforms = new Map();
  for (const ev of agent.evidence) {
    const platform = ev.source_url ? new URL(ev.source_url).hostname.replace("www.", "").split(".")[0] : "unknown";
    if (!platforms.has(platform)) platforms.set(platform, []);
    platforms.get(platform).push(ev);
  }
  const platformList = [...platforms.entries()].map(([platform, records]) => ({
    platform,
    profile_count: records.length,
    active: records.some((r) => r.verification_state === "verified"),
    consistency_score: calculateConfidence(records)
  }));
  return {
    schema_version: "1.0",
    project_id: agent.project_id,
    agent_type: "social-presence",
    platforms: platformList,
    total_profiles: agent.evidence.length,
    consistent_profiles: agent.evidence.filter((ev) => ev.verification_state === "verified").length,
    abandoned_or_conflicting: agent.evidence.filter((ev) => ev.verification_state === "conflicting" || ev.verification_state === "unverified").length,
    generated_at: new Date().toISOString()
  };
}

export function createCompetitorAnalysis(agent) {
  if (!agent || agent.agent_type !== "competitor-category") {
    throw new AgentError("INVALID_AGENT", "Competitor analysis requires a competitor-category agent.");
  }
  const competitors = agent.evidence.map((ev) => ({
    name: ev.claim,
    source: ev.source_url,
    verified: ev.verification_state === "verified",
    confidence: ev.confidence
  }));
  return {
    schema_version: "1.0",
    project_id: agent.project_id,
    agent_type: "competitor-category",
    competitor_count: competitors.length,
    competitors,
    verified_competitors: competitors.filter((c) => c.verified).length,
    category_conventions: agent.findings.filter((f) => f.type === "convention"),
    differentiation_gaps: agent.findings.filter((f) => f.type === "gap"),
    generated_at: new Date().toISOString()
  };
}

export function createEvidenceAnalysis(agent, allEvidence) {
  if (!agent || agent.agent_type !== "evidence-analyst") {
    throw new AgentError("INVALID_AGENT", "Evidence analysis requires an evidence-analyst agent.");
  }
  const conflictAnalysis = analyzeEvidenceConflicts(allEvidence);
  const confidence = calculateConfidence(allEvidence);
  const publicClaims = filterPublicClaims(allEvidence);
  return {
    schema_version: "1.0",
    project_id: agent.project_id,
    agent_type: "evidence-analyst",
    total_evidence: allEvidence.length,
    verified: allEvidence.filter((ev) => ev.verification_state === "verified").length,
    inferred: allEvidence.filter((ev) => ev.verification_state === "inferred").length,
    unverified: allEvidence.filter((ev) => ev.verification_state === "unverified").length,
    conflicting: allEvidence.filter((ev) => ev.verification_state === "conflicting").length,
    overall_confidence: confidence,
    conflicts: conflictAnalysis.conflicts,
    has_conflicts: conflictAnalysis.has_conflicts,
    public_claims_available: publicClaims.length,
    public_claims_eligible: allEvidence.filter((ev) => ev.usable_for_public_claims).length,
    generated_at: new Date().toISOString()
  };
}

export function validateResearchPolicy(agent, action) {
  if (!agent || !agent.prohibited_actions) {
    throw new AgentError("INVALID_AGENT", "Agent must have prohibited_actions defined.");
  }
  if (agent.prohibited_actions.includes(action)) {
    throw new AgentError("RESEARCH_POLICY_VIOLATION", `Action ${action} is prohibited for agent type ${agent.agent_type}.`, { action, agent_type: agent.agent_type });
  }
  return true;
}

export function assertPublicOnly(evidence) {
  if (!evidence) return true;
  if (Array.isArray(evidence)) {
    for (const ev of evidence) {
      if (ev.source_url && (ev.source_url.includes("login") || ev.source_url.includes("auth") || ev.source_url.includes("private"))) {
        throw new AgentError("PRIVATE_DATA_VIOLATION", "Evidence source appears to require authentication.", { source_url: ev.source_url });
      }
    }
  }
  return true;
}
