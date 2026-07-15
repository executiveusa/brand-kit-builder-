export const APP_VERSION = "0.2.0";

export const PREBUILD_AXES = [
  "source_completeness",
  "business_clarity",
  "audience_clarity",
  "offer_and_conversion_clarity",
  "differentiation",
  "brand_purpose_and_values",
  "proof_and_claim_safety",
  "voice_evidence",
  "visual_evidence",
  "logo_status",
  "application_requirements",
  "accessibility_requirements",
  "language_and_localization_requirements",
  "rights_and_licensing_status",
  "technical_environment_clarity",
  "deliverable_scope",
  "approval_authority",
  "budget_time_and_production_constraints",
  "repository_and_handoff_readiness",
  "contradiction_resolution"
];

export const CRITICAL_PREBUILD_AXES = new Set([
  "source_completeness",
  "proof_and_claim_safety",
  "rights_and_licensing_status",
  "approval_authority",
  "contradiction_resolution"
]);

export const STAGES = [
  "intake",
  "sources",
  "readiness",
  "strategy",
  "voice",
  "visual",
  "brandbook",
  "guardian",
  "export"
];

export const STAGE_OUTPUTS = {
  intake: ["discovery/intake.json", "discovery/interview-log.md"],
  sources: ["source-ledger.json", "source-conflicts.md"],
  readiness: ["discovery/prebuild-score.json"],
  strategy: ["strategy/brand-strategy.json", "strategy/creative-brief.html"],
  voice: ["voice/brand-voice.json", "voice/voice-examples.html", "voice/claims-ledger.json"],
  visual: ["visual/design-tokens.json", "visual/image-prompt-library.json", "visual/asset-manifest.json"],
  brandbook: ["brandbook/brandbook.html", "brandbook/brandbook.pdf"],
  guardian: ["audit/guardian-report.json", "audit/implementation-report.html"],
  export: ["exports/brand-kit.zip", "handoff/handoff.html", "handoff/acceptance-matrix.json"]
};

export const GATED_STAGES = new Set(["strategy", "voice", "visual", "brandbook", "guardian", "export"]);
export const OWNER_APPROVAL_STAGES = new Set(["export"]);
