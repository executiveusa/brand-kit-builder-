import { renderBrandbookDocument } from './kaku-brandbook.js';
import { guardianGate, releaseGate } from './guardian-export-domain.js';
import { createStoredZip } from './zip-store.js';

const encoder = new TextEncoder();

function json(value) { return `${JSON.stringify(value, null, 2)}\n`; }
function safeName(value) { return String(value || 'brand-kit').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'brand-kit'; }
async function sha256(content) {
  const bytes = content instanceof Uint8Array ? content : encoder.encode(String(content));
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function designTokens(project) {
  const visual = project.visual || {};
  return {
    schema_version: '1.0',
    project_id: project.project_id,
    color: visual.colors,
    typography: visual.typography,
    layout: { rules: visual.layout_rules, applications: visual.applications },
    motion: { rules: visual.motion_rules, reduced_motion_required: true },
    accessibility: { notes: visual.accessibility_notes },
    iconography: { family: visual.icon_family },
    generated_at: new Date().toISOString()
  };
}

function tokenCss(tokens) {
  const colors = tokens.color || {};
  return `:root {\n  --brand-color-primary: ${colors.primary};\n  --brand-color-secondary: ${colors.secondary};\n  --brand-color-accent: ${colors.accent};\n  --brand-color-background: ${colors.background};\n  --brand-color-text: ${colors.text};\n  --brand-font-display: ${JSON.stringify(tokens.typography?.display || 'serif')};\n  --brand-font-body: ${JSON.stringify(tokens.typography?.body || 'sans-serif')};\n}\n\n@media (prefers-reduced-motion: reduce) {\n  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }\n}\n`;
}

const printCss = `@page { size: A4; margin: 0; }\n* { box-sizing: border-box; }\nbody { margin: 0; print-color-adjust: exact; -webkit-print-color-adjust: exact; }\n.page { width: 210mm !important; min-height: 297mm !important; margin: 0 !important; page-break-after: always; break-after: page; box-shadow: none !important; }\n.page:last-child { page-break-after: auto; }\n`;

function sourceLedger(project) {
  return {
    schema_version: '1.0', project_id: project.project_id,
    sources: (project.sources || []).map((source) => ({
      source_id: source.source_id, type: source.type, location: source.location, trust_level: source.trust_level,
      accessed: source.accessed, rights_status: source.rights_status, conflicts: source.conflicts || [], notes: source.notes || ''
    }))
  };
}

function guardianReport(project) {
  const gate = guardianGate(project);
  return {
    schema_version: '1.0', project_id: project.project_id, passed: gate.passed,
    p0: gate.p0, unresolved_p1: gate.unresolved_p1, failing_guardians: gate.failing_guardians,
    guardians: gate.guardians, generated_at: new Date().toISOString()
  };
}

function assetManifest(project) {
  return {
    schema_version: '1.0', project_id: project.project_id,
    protected_assets: (project.sources || []).filter((source) => ['logo', 'image', 'files'].includes(source.type)).map((source) => ({
      source_id: source.source_id, location: source.location, rights_status: source.rights_status, trust_level: source.trust_level,
      mutation_policy: source.type === 'logo' ? project.visual?.logo_policy || 'preserve' : 'preserve unless explicitly approved'
    })),
    generated_assets: [],
    note: 'This phase does not generate external images or mutate supplied assets.'
  };
}

function claimsLedger(project) {
  return {
    schema_version: '1.0', project_id: project.project_id,
    claims: project.strategy?.proof_ledger || [],
    rule: 'Only confirmed claims may be published without additional approval.'
  };
}

function handoff(project, fileNames) {
  return {
    schema_version: '1.0', project_id: project.project_id, name: project.name,
    languages: project.languages, primary_action: project.intake?.primary_action,
    approval_authority: project.intake?.approval_authority,
    files: fileNames,
    implementation_rules: [
      'Preserve approved copy, claims, routes, protected assets, and token names.',
      'Use one coherent icon family and accessible labels.',
      'Keep the primary action obvious on desktop and mobile.',
      'Re-run Brand, Design, Voice, and Rights Guardians after material changes.',
      'Do not deploy or publish without the project owner approval process.'
    ]
  };
}

function readme(project) {
  return `# ${project.name} brand kit\n\nThis package was generated from an approved Pauli Brand Studio project.\n\n## Included\n\n- Interactive local HTML brand book\n- Print stylesheet\n- Strategy, voice, visual-system, source, claims, Guardian, and token JSON\n- CSS design tokens\n- Asset manifest\n- Developer/design handoff\n\n## PDF\n\nA PDF is not included in the browser-generated package. Render brandbook.html with brandbook-print.css through the approved local Playwright/PDF host adapter, then visually verify every page before release.\n\n## Approval\n\nApproved by: ${project.export_approval?.approved_by}\nApproved at: ${project.export_approval?.approved_at}\nApproval ID: ${project.export_approval?.approval_id}\n`;
}

export async function buildExportPackage(project, locale = project.brandbook?.locale || 'en') {
  const gate = releaseGate(project);
  if (!gate.passed) {
    const error = new Error(`Release blocked: ${gate.blockers.join(', ')}`);
    error.code = 'RELEASE_GATE_FAILED';
    error.details = gate;
    throw error;
  }

  const tokens = designTokens(project);
  const rawFiles = [
    { path: 'brandbook.html', media_type: 'text/html', content: renderBrandbookDocument(project, locale) },
    { path: 'brandbook-print.css', media_type: 'text/css', content: printCss },
    { path: 'design-tokens.json', media_type: 'application/json', content: json(tokens) },
    { path: 'design-tokens.css', media_type: 'text/css', content: tokenCss(tokens) },
    { path: 'brand-strategy.json', media_type: 'application/json', content: json(project.strategy) },
    { path: 'brand-voice.json', media_type: 'application/json', content: json(project.voice) },
    { path: 'visual-system.json', media_type: 'application/json', content: json(project.visual) },
    { path: 'source-ledger.json', media_type: 'application/json', content: json(sourceLedger(project)) },
    { path: 'claims-ledger.json', media_type: 'application/json', content: json(claimsLedger(project)) },
    { path: 'guardian-report.json', media_type: 'application/json', content: json(guardianReport(project)) },
    { path: 'asset-manifest.json', media_type: 'application/json', content: json(assetManifest(project)) }
  ];
  const handoffFile = { path: 'handoff.json', media_type: 'application/json', content: json(handoff(project, rawFiles.map((file) => file.path))) };
  const readmeFile = { path: 'README.md', media_type: 'text/markdown', content: readme(project) };
  rawFiles.push(handoffFile, readmeFile);

  const files = [];
  for (const file of rawFiles) {
    const bytes = encoder.encode(file.content);
    files.push({ ...file, bytes, bytes_length: bytes.length, sha256: await sha256(bytes) });
  }
  const manifest = {
    schema_version: '1.0', project_id: project.project_id, package_name: `${safeName(project.name)}-brand-kit`,
    generated_at: new Date().toISOString(), approval: project.export_approval,
    files: files.map(({ path, media_type, bytes_length, sha256 }) => ({ path, media_type, bytes: bytes_length, sha256 })),
    omitted: [{ path: 'brandbook.pdf', reason: 'Requires the approved local PDF renderer and page-by-page visual verification.' }]
  };
  const manifestContent = json(manifest);
  const manifestBytes = encoder.encode(manifestContent);
  files.push({ path: 'package-manifest.json', media_type: 'application/json', content: manifestContent, bytes: manifestBytes, bytes_length: manifestBytes.length, sha256: await sha256(manifestBytes) });
  const zipBytes = createStoredZip(files);
  return { package_name: manifest.package_name, manifest, files, zip_bytes: zipBytes };
}
