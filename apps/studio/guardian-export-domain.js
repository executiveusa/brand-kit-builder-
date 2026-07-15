export const GUARDIAN_ORDER = ['brand', 'design', 'voice', 'rights'];

export const GUARDIAN_DEFINITIONS = {
  brand: {
    en: 'Brand Guardian', es: 'Guardian de marca',
    descriptionEn: 'Checks strategy, audience, offer, differentiation, proof, and brand coherence.',
    descriptionEs: 'Revisa estrategia, audiencia, oferta, diferenciación, pruebas y coherencia de marca.',
    checks: [
      ['positioning_alignment', 'Positioning matches confirmed business truth', 'El posicionamiento coincide con la verdad confirmada del negocio'],
      ['audience_fit', 'Audience needs and language are represented accurately', 'Las necesidades y el lenguaje de la audiencia están representados con precisión'],
      ['offer_clarity', 'Offer, promise, and primary action are clear', 'La oferta, la promesa y la acción principal son claras'],
      ['claim_traceability', 'Every public claim traces to approved evidence', 'Cada afirmación pública tiene evidencia aprobada'],
      ['distinctiveness', 'The system is distinct without imitating another brand', 'El sistema es distintivo sin imitar otra marca']
    ]
  },
  design: {
    en: 'Design Guardian', es: 'Guardian de diseño',
    descriptionEn: 'Checks hierarchy, usability, responsiveness, accessibility, craft, and implementation consistency.',
    descriptionEs: 'Revisa jerarquía, usabilidad, adaptación, accesibilidad, calidad y consistencia de implementación.',
    checks: [
      ['hierarchy', 'Visual hierarchy makes the next action obvious', 'La jerarquía visual hace evidente la siguiente acción'],
      ['krug_clarity', 'Pages pass Steve Krug clarity and trunk-test principles', 'Las páginas cumplen los principios de claridad y ubicación de Steve Krug'],
      ['responsive', 'The system remains usable on desktop, tablet, and mobile', 'El sistema sigue siendo usable en escritorio, tableta y móvil'],
      ['accessibility', 'Contrast, keyboard, focus, type, and motion requirements pass', 'Cumplen contraste, teclado, foco, tipografía y movimiento'],
      ['consistency', 'Tokens, components, spacing, and assets are applied consistently', 'Tokens, componentes, espacios y materiales se aplican de forma consistente']
    ]
  },
  voice: {
    en: 'Voice Guardian', es: 'Guardian de voz',
    descriptionEn: 'Checks directness, rhythm, trust, authenticity, density, and localization.',
    descriptionEs: 'Revisa claridad, ritmo, confianza, autenticidad, densidad y localización.',
    checks: [
      ['directness', 'Copy names the actor, action, and outcome directly', 'El texto nombra directamente a la persona, acción y resultado'],
      ['trust', 'No hype, filler, fake urgency, or unsupported language remains', 'No quedan exageración, relleno, urgencia falsa ni lenguaje sin respaldo'],
      ['authenticity', 'Real phrases and confirmed stories preserve the brand’s cadence', 'Las frases reales e historias confirmadas conservan la cadencia de la marca'],
      ['channel_fit', 'Website, social, sales, and support rules fit their channels', 'Las reglas de sitio, redes, ventas y soporte corresponden a cada canal'],
      ['localization', 'English and Mexican Spanish read naturally and preserve meaning', 'El inglés y el español de México suenan naturales y conservan el sentido']
    ]
  },
  rights: {
    en: 'Rights Guardian', es: 'Guardian de derechos',
    descriptionEn: 'Checks ownership, licenses, consent, protected assets, attribution, and legal handoff flags.',
    descriptionEs: 'Revisa propiedad, licencias, consentimiento, materiales protegidos, atribución y asuntos legales pendientes.',
    checks: [
      ['asset_provenance', 'Every sourced and generated asset has provenance', 'Cada material obtenido o generado tiene procedencia registrada'],
      ['logo_authority', 'Logo preservation or redesign authority is documented', 'La autoridad para conservar o rediseñar el logo está documentada'],
      ['font_icon_license', 'Font and icon licenses permit the intended use', 'Las licencias de tipografías e iconos permiten el uso previsto'],
      ['image_consent', 'Image rights, likeness consent, and cultural context are cleared', 'Los derechos de imagen, consentimiento y contexto cultural están autorizados'],
      ['legal_flags', 'Trademark and legal-review items are clearly assigned to humans', 'Los asuntos de marca registrada y revisión legal están asignados a personas']
    ]
  }
};

function now() { return new Date().toISOString(); }
function nonEmpty(value) { return Boolean(String(value ?? '').trim()); }

export function blankGuardian(name) {
  const definition = GUARDIAN_DEFINITIONS[name];
  if (!definition) throw new Error(`Unknown Guardian: ${name}`);
  return {
    name,
    reviewer_name: '',
    reviewer_role: '',
    independent_confirmed: false,
    summary: '',
    checks: Object.fromEntries(definition.checks.map(([id]) => [id, false])),
    findings: [],
    status: 'pending',
    reviewed_at: null
  };
}

export function normalizeFinding(finding = {}, index = 0) {
  return {
    finding_id: finding.finding_id || `finding-${Date.now().toString(36)}-${index}`,
    severity: ['P0', 'P1', 'P2'].includes(finding.severity) ? finding.severity : 'P2',
    title: String(finding.title || '').trim(),
    evidence: String(finding.evidence || '').trim(),
    recommendation: String(finding.recommendation || '').trim(),
    resolved: Boolean(finding.resolved),
    resolution_note: String(finding.resolution_note || '').trim()
  };
}

export function normalizeGuardian(name, review = {}) {
  const base = blankGuardian(name);
  return {
    ...base,
    ...review,
    name,
    checks: { ...base.checks, ...(review.checks || {}) },
    findings: Array.isArray(review.findings) ? review.findings.map(normalizeFinding) : []
  };
}

export function guardianPasses(review = {}) {
  const normalized = normalizeGuardian(review.name, review);
  const identityComplete = [normalized.reviewer_name, normalized.reviewer_role, normalized.summary].every(nonEmpty);
  const allChecksPass = Object.values(normalized.checks).every(Boolean);
  const severeOpen = normalized.findings.some((finding) => ['P0', 'P1'].includes(finding.severity) && !finding.resolved);
  return identityComplete && normalized.independent_confirmed && allChecksPass && !severeOpen;
}

export function evaluateGuardian(name, review = {}) {
  const normalized = normalizeGuardian(name, review);
  normalized.status = guardianPasses(normalized) ? 'passed' : 'failed';
  normalized.reviewed_at = now();
  return normalized;
}

export function guardianGate(project = {}) {
  const guardians = Object.fromEntries(GUARDIAN_ORDER.map((name) => [name, normalizeGuardian(name, project.guardians?.[name])]));
  const findings = Object.values(guardians).flatMap((guardian) => guardian.findings.map((finding) => ({ ...finding, guardian: guardian.name })));
  const p0 = findings.filter((finding) => finding.severity === 'P0' && !finding.resolved).length;
  const unresolvedP1 = findings.filter((finding) => finding.severity === 'P1' && !finding.resolved).length;
  const failing = GUARDIAN_ORDER.filter((name) => guardians[name].status !== 'passed' || !guardianPasses(guardians[name]));
  return { passed: failing.length === 0 && p0 === 0 && unresolvedP1 === 0, failing_guardians: failing, p0, unresolved_p1: unresolvedP1, findings, guardians };
}

export function validExportApproval(project, approval = project?.export_approval) {
  return Boolean(
    approval &&
    approval.project_id === project.project_id &&
    approval.action === 'export' &&
    approval.status === 'approved' &&
    approval.source === 'agent-core' &&
    nonEmpty(approval.approved_by) &&
    nonEmpty(approval.approved_at) &&
    nonEmpty(approval.approval_id)
  );
}

export function releaseGate(project = {}) {
  const guardian = guardianGate(project);
  const approval = validExportApproval(project);
  return { passed: guardian.passed && approval, guardian, approval, blockers: [...(guardian.passed ? [] : ['guardian_gate']), ...(approval ? [] : ['human_export_approval'])] };
}
