export const CANONICAL_VERSION = '0.3.0';
export const SCHEMA_VERSION = '1.0';
export const STUDIO_SCHEMA_VERSION = '2.1';

export const STAGES = [
  'intake',
  'sources',
  'readiness',
  'strategy',
  'voice',
  'visual',
  'brandbook',
  'guardian',
  'export'
];

export const STAGE_OUTPUTS = {
  intake: ['discovery/intake.json', 'discovery/interview-log.md'],
  sources: ['source-ledger.json', 'source-conflicts.md'],
  readiness: ['discovery/prebuild-score.json'],
  strategy: ['strategy/brand-strategy.json', 'strategy/creative-brief.html'],
  voice: ['voice/brand-voice.json', 'voice/voice-examples.html', 'voice/claims-ledger.json'],
  visual: ['visual/design-tokens.json', 'visual/image-prompt-library.json', 'visual/asset-manifest.json'],
  brandbook: ['brandbook/brandbook.html', 'brandbook/brandbook.pdf'],
  guardian: ['audit/guardian-report.json', 'audit/implementation-report.html'],
  export: ['exports/brand-kit.zip', 'handoff/handoff.html', 'handoff/acceptance-matrix.json']
};

export const GATED_STAGES = new Set(['strategy', 'voice', 'visual', 'brandbook', 'guardian', 'export']);
export const OWNER_APPROVAL_STAGES = new Set(['export']);

export const PREBUILD_AXES = [
  {
    id: 'source_completeness',
    critical: true,
    en: 'Source completeness',
    es: 'Fuentes completas'
  },
  {
    id: 'business_clarity',
    critical: false,
    en: 'Business clarity',
    es: 'Claridad del negocio'
  },
  {
    id: 'audience_clarity',
    critical: false,
    en: 'Audience clarity',
    es: 'Claridad de audiencia'
  },
  {
    id: 'offer_and_conversion_clarity',
    critical: false,
    en: 'Offer and conversion clarity',
    es: 'Claridad de oferta y conversión'
  },
  {
    id: 'differentiation',
    critical: false,
    en: 'Differentiation',
    es: 'Diferenciación'
  },
  {
    id: 'brand_purpose_and_values',
    critical: false,
    en: 'Purpose and values',
    es: 'Propósito y valores'
  },
  {
    id: 'proof_and_claim_safety',
    critical: true,
    en: 'Proof and claim safety',
    es: 'Pruebas y seguridad de afirmaciones'
  },
  {
    id: 'voice_evidence',
    critical: false,
    en: 'Voice evidence',
    es: 'Evidencia de voz'
  },
  {
    id: 'visual_evidence',
    critical: false,
    en: 'Visual evidence',
    es: 'Evidencia visual'
  },
  {
    id: 'logo_status',
    critical: false,
    en: 'Logo status',
    es: 'Estado del logo'
  },
  {
    id: 'application_requirements',
    critical: false,
    en: 'Application requirements',
    es: 'Aplicaciones necesarias'
  },
  {
    id: 'accessibility_requirements',
    critical: false,
    en: 'Accessibility requirements',
    es: 'Requisitos de accesibilidad'
  },
  {
    id: 'language_and_localization_requirements',
    critical: false,
    en: 'Language and localization',
    es: 'Idioma y localización'
  },
  {
    id: 'rights_and_licensing_status',
    critical: true,
    en: 'Rights and licensing',
    es: 'Derechos y licencias'
  },
  {
    id: 'technical_environment_clarity',
    critical: false,
    en: 'Technical environment',
    es: 'Entorno técnico'
  },
  {
    id: 'deliverable_scope',
    critical: false,
    en: 'Deliverable scope',
    es: 'Alcance de entregables'
  },
  {
    id: 'approval_authority',
    critical: true,
    en: 'Approval authority',
    es: 'Autoridad de aprobación'
  },
  {
    id: 'budget_time_and_production_constraints',
    critical: false,
    en: 'Budget, time, and production constraints',
    es: 'Límites de presupuesto, tiempo y producción'
  },
  {
    id: 'repository_and_handoff_readiness',
    critical: false,
    en: 'Repository and handoff readiness',
    es: 'Preparación de repositorio y entrega'
  },
  {
    id: 'contradiction_resolution',
    critical: true,
    en: 'Contradiction resolution',
    es: 'Resolución de contradicciones'
  }
];

export const PREBUILD_AXIS_IDS = PREBUILD_AXES.map((axis) => axis.id);
export const CRITICAL_PREBUILD_AXIS_IDS = PREBUILD_AXES.filter((axis) => axis.critical).map((axis) => axis.id);
export const CRITICAL_PREBUILD_AXES = new Set(CRITICAL_PREBUILD_AXIS_IDS);

export const STUDIO_AXIS_ALIASES = {
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

export const GUARDIAN_NAMES = ['brand', 'design', 'voice', 'rights'];
export const GUARDIAN_LABELS = {
  brand: { en: 'Brand Guardian', es: 'Guardián de marca' },
  design: { en: 'Design Guardian', es: 'Guardián de diseño' },
  voice: { en: 'Voice Guardian', es: 'Guardián de voz' },
  rights: { en: 'Rights Guardian', es: 'Guardián de derechos' }
};

export const SOURCE_TRUST_LEVELS = new Set(['primary', 'governing', 'reference', 'inspiration']);

export const PROJECT_CLASSIFICATIONS = new Set([
  'greenfield',
  'brownfield',
  'hybrid',
  'recovery',
  'asset-extension',
  'brand-refresh',
  'full-rebrand'
]);

export const RELEASE_FLOOR = 8.5;
export const RELEASE_TARGET = 9.0;
export const CRITICAL_AXIS_FLOOR = 8.0;
export const MAX_JOB_COST_CENTS = 1000;
export const MAX_DAILY_COST_CENTS = 5000;

export const CAPABILITY_DESCRIPTOR = {
  create_project: true,
  validate_project: true,
  score_prebuild: true,
  create_stage_work_order: true,
  complete_stage_with_artifact_evidence: true,
  artifact_hashing: true,
  idempotent_jobs: true,
  filesystem_sandbox: true,
  secret_rejection: true,
  owner_approval_gate: true,
  agent_supplied_approvals: false,
  daily_cost_guard: true
};

export const APPROVAL_STATE_MACHINE = {
  pending: ['approved', 'rejected'],
  approved: ['revoked'],
  rejected: ['pending'],
  revoked: ['pending']
};

export const ARTIFACT_STATUSES = ['pending', 'ready', 'completed', 'rejected', 'omitted'];

export const EVIDENCE_VERIFICATION_STATES = ['verified', 'inferred', 'unverified', 'conflicting'];

export const DOMAIN_OBJECTS = [
  'BrandProject',
  'EvidenceRecord',
  'WorkOrder',
  'DesignDecision',
  'Artifact',
  'GuardianReview',
  'Approval',
  'Release',
  'LogoAsset',
  'LogoManifest',
  'DesignFingerprint',
  'DesignTokens',
  'CapabilityDescriptor',
  'JobRecord'
];

export function createBrandProjectShell(input = {}) {
  return {
    schema_version: SCHEMA_VERSION,
    project_id: input.project_id || '',
    name: input.name || '',
    classification: input.classification || 'greenfield',
    owner: input.owner || 'Bambu',
    primary_audience: input.primary_audience || 'unknown',
    business_goal: input.business_goal || 'unknown',
    primary_action: input.primary_action || 'unknown',
    languages: Array.isArray(input.languages) && input.languages.length ? input.languages : ['en'],
    protected_assets: Array.isArray(input.protected_assets) ? input.protected_assets : [],
    sources: Array.isArray(input.sources) ? input.sources : [],
    readiness: input.readiness || null,
    stages: Object.fromEntries(STAGES.map((stage) => [stage, { status: 'pending' }])),
    guardians: Object.fromEntries(GUARDIAN_NAMES.map((name) => [name, { status: 'pending', findings: [] }])),
    guardian_summary: { p0: 0, unresolved_p1: 0 },
    approvals: [],
    created_at: input.created_at || new Date().toISOString(),
    updated_at: input.updated_at || new Date().toISOString()
  };
}

export function createEvidenceRecord(input = {}) {
  return {
    schema_version: SCHEMA_VERSION,
    evidence_id: input.evidence_id || '',
    project_id: input.project_id || '',
    claim: input.claim || '',
    source_url: input.source_url || '',
    source_type: input.source_type || 'website',
    retrieved_at: input.retrieved_at || new Date().toISOString(),
    confidence: Number(input.confidence) || 0,
    verification_state: input.verification_state || 'unverified',
    conflicts: Array.isArray(input.conflicts) ? input.conflicts : [],
    usable_for_public_claims: Boolean(input.usable_for_public_claims)
  };
}

export function createWorkOrder(input = {}) {
  return {
    schema_version: SCHEMA_VERSION,
    job_id: input.job_id || '',
    idempotency_key: input.idempotency_key || '',
    project_id: input.project_id || '',
    stage: input.stage || '',
    status: input.status || 'ready',
    requested_by: input.requested_by || 'in-house-agent',
    created_at: input.created_at || new Date().toISOString(),
    estimated_cost_cents: Number(input.estimated_cost_cents) || 0,
    required_outputs: input.required_outputs || [],
    constraints: input.constraints || {},
    completion_command: input.completion_command || 'complete-stage'
  };
}

export function createGuardianReview(input = {}) {
  return {
    schema_version: SCHEMA_VERSION,
    guardian: input.guardian || '',
    status: input.status || 'pending',
    reviewer_name: input.reviewer_name || '',
    reviewer_role: input.reviewer_role || '',
    independent_confirmed: Boolean(input.independent_confirmed),
    summary: input.summary || '',
    findings: Array.isArray(input.findings) ? input.findings : []
  };
}

export function createApproval(input = {}) {
  return {
    action: input.action || '',
    approved_by: input.approved_by || '',
    status: input.status || 'pending',
    approved_at: input.approved_at || null,
    channel: input.channel || 'interactive-local-cli',
    confirmation_sha256: input.confirmation_sha256 || ''
  };
}

export function createArtifact(input = {}) {
  return {
    path: input.path || '',
    media_type: input.media_type || 'application/octet-stream',
    size_bytes: Number(input.size_bytes) || 0,
    sha256: input.sha256 || '',
    status: input.status || 'pending',
    provenance: input.provenance || null
  };
}

export function createCapabilityDescriptor() {
  return {
    version: CANONICAL_VERSION,
    interface: 'local-cli-json',
    network_listener: false,
    external_model_calls: false,
    telemetry: false,
    capabilities: { ...CAPABILITY_DESCRIPTOR },
    limits: {
      max_job_cost_cents: MAX_JOB_COST_CENTS,
      max_daily_cost_cents: MAX_DAILY_COST_CENTS,
      release_floor: RELEASE_FLOOR,
      owner_approval_required_for: [...OWNER_APPROVAL_STAGES]
    }
  };
}
