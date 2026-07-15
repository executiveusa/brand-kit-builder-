export const KAKU_SECTIONS = [
  { id: 'cover', number: 1, en: 'Cover / identity', es: 'Portada / identidad' },
  { id: 'creative-rationale', number: 2, en: 'Creative rationale', es: 'Razonamiento creativo' },
  { id: 'master-logo', number: 3, en: 'Master logo reveal', es: 'Presentación del logo principal' },
  { id: 'symbol-anatomy', number: 4, en: 'Symbol anatomy and meaning', es: 'Anatomía y significado del símbolo' },
  { id: 'logo-system', number: 5, en: 'Logo system and uses', es: 'Sistema y usos del logo' },
  { id: 'logo-context', number: 6, en: 'Logo in context', es: 'Logo en contexto' },
  { id: 'typography', number: 7, en: 'Typography', es: 'Tipografía' },
  { id: 'color-behavior', number: 8, en: 'Color behavior', es: 'Comportamiento del color' },
  { id: 'color-palette', number: 9, en: 'Color palette and rationale', es: 'Paleta de color y razonamiento' },
  { id: 'stationery', number: 10, en: 'Stationery / primary business collateral', es: 'Papelería / materiales principales del negocio' },
  { id: 'product-application', number: 11, en: 'Product, packaging, merchandise, or service application', es: 'Aplicación de producto, empaque, mercancía o servicio' },
  { id: 'digital-application', number: 12, en: 'Website / digital application', es: 'Sitio web / aplicación digital' },
  { id: 'closing', number: 13, en: 'Closing / credits', es: 'Cierre / créditos' }
];

export const DIGITAL_ANNEXES = [
  { id: 'strategy', letter: 'A', en: 'Brand strategy', es: 'Estrategia de marca' },
  { id: 'voice', letter: 'B', en: 'Brand voice', es: 'Voz de marca' },
  { id: 'photography', letter: 'C', en: 'Photography and image prompting', es: 'Fotografía y prompts de imagen' },
  { id: 'graphic-language', letter: 'D', en: 'Illustration, iconography, patterns, and textures', es: 'Ilustración, iconografía, patrones y texturas' },
  { id: 'motion', letter: 'E', en: 'Motion identity', es: 'Identidad de movimiento' },
  { id: 'templates', letter: 'F', en: 'Social, presentation, proposal, and campaign templates', es: 'Plantillas de redes, presentaciones, propuestas y campañas' },
  { id: 'accessibility', letter: 'G', en: 'Accessibility and localization', es: 'Accesibilidad y localización' },
  { id: 'tokens', letter: 'H', en: 'Design tokens and component rules', es: 'Tokens de diseño y reglas de componentes' },
  { id: 'governance', letter: 'I', en: 'Governance, approvals, and change log', es: 'Gobernanza, aprobaciones y registro de cambios' },
  { id: 'handoff', letter: 'J', en: 'Developer and design handoff', es: 'Entrega para desarrollo y diseño' }
];

function now() { return new Date().toISOString(); }
function nonEmpty(value) { return Boolean(String(value ?? '').trim()); }
function lines(value) { return Array.isArray(value) ? value.filter(nonEmpty) : String(value ?? '').split(/\r?\n/).map((item) => item.trim()).filter(Boolean); }
function localeName(locale) { return locale === 'es-MX' ? 'es' : 'en'; }
function label(item, locale) { return item[localeName(locale)]; }
function list(items) { return items.filter(nonEmpty).map((item) => `• ${item}`).join('\n'); }

function territory(project) {
  return project.strategy?.territories?.find((item) => item.id === project.visual?.selected_territory) || project.strategy?.territories?.[0] || {};
}

function draftContent(project, id, locale = 'en') {
  const es = locale === 'es-MX';
  const visual = project.visual || {};
  const strategy = project.strategy || {};
  const voice = project.voice || {};
  const chosen = territory(project);
  const colors = visual.colors || {};
  const applications = visual.applications || [];
  const stamp = new Date().toISOString().slice(0, 10);
  const languageNames = (project.languages || []).map((item) => item === 'es-MX' ? 'Español de México' : 'English');
  const values = lines(strategy.values);
  switch (id) {
    case 'cover':
      return es ? `${project.name}\nSistema de marca\n${project.market || 'Mercado por confirmar'}\nIdiomas: ${languageNames.join(', ')}\nVersión de trabajo · ${stamp}` : `${project.name}\nBrand system\n${project.market || 'Market to confirm'}\nLanguages: ${languageNames.join(', ')}\nWorking version · ${stamp}`;
    case 'creative-rationale':
      return `${strategy.positioning || ''}\n\n${strategy.promise || ''}\n\n${list(values)}\n\n${chosen.concept || ''}`.trim();
    case 'master-logo':
      return es ? `Política: ${visual.logo_policy || 'por confirmar'}\n${visual.logo_notes || 'Agregar el arte aprobado y la explicación del logo.'}` : `Policy: ${visual.logo_policy || 'to confirm'}\n${visual.logo_notes || 'Add the approved artwork and master-logo explanation.'}`;
    case 'symbol-anatomy':
      return es ? `Explica únicamente elementos confirmados del símbolo, su relación y su significado.\n\nFuente actual: ${visual.logo_notes || 'Se requiere revisión humana del arte.'}` : `Explain only confirmed symbol elements, their relationship, and their meaning.\n\nCurrent source: ${visual.logo_notes || 'Human artwork review is required.'}`;
    case 'logo-system':
      return es ? `Decisión del logo: ${visual.logo_policy}\nReglas: ${visual.logo_notes}\nAplicaciones prioritarias: ${applications.join(', ')}` : `Logo decision: ${visual.logo_policy}\nRules: ${visual.logo_notes}\nPriority applications: ${applications.join(', ')}`;
    case 'logo-context':
      return es ? `Territorio: ${chosen.name || 'por confirmar'}\nContexto: ${chosen.mood || ''}\nAplicaciones: ${applications.join(', ')}` : `Territory: ${chosen.name || 'to confirm'}\nContext: ${chosen.mood || ''}\nApplications: ${applications.join(', ')}`;
    case 'typography':
      return es ? `Títulos: ${visual.typography?.display || ''}\nTexto: ${visual.typography?.body || ''}\nEscala: ${visual.typography?.scale || ''}\nReglas: ${visual.typography?.rules || ''}` : `Display: ${visual.typography?.display || ''}\nBody: ${visual.typography?.body || ''}\nScale: ${visual.typography?.scale || ''}\nRules: ${visual.typography?.rules || ''}`;
    case 'color-behavior':
      return es ? `Principal: ${colors.primary}\nAcento: ${colors.accent}\nFondo: ${colors.background}\nTexto: ${colors.text}\nAccesibilidad: ${visual.accessibility_notes || ''}` : `Primary: ${colors.primary}\nAccent: ${colors.accent}\nBackground: ${colors.background}\nText: ${colors.text}\nAccessibility: ${visual.accessibility_notes || ''}`;
    case 'color-palette':
      return es ? `Principal ${colors.primary}\nSecundario ${colors.secondary}\nAcento ${colors.accent}\nFondo ${colors.background}\nTexto ${colors.text}\n\nOrigen visual: ${chosen.mood || ''}` : `Primary ${colors.primary}\nSecondary ${colors.secondary}\nAccent ${colors.accent}\nBackground ${colors.background}\nText ${colors.text}\n\nVisual origin: ${chosen.mood || ''}`;
    case 'stationery':
      return es ? `Material principal recomendado: ${applications.includes('presentation') ? 'presentación y propuesta' : applications.includes('print') ? 'material impreso' : 'equivalente real del negocio'}\nMensaje principal: ${strategy.message_hierarchy?.primary || ''}\nCTA: ${strategy.message_hierarchy?.cta || ''}` : `Recommended primary collateral: ${applications.includes('presentation') ? 'presentation and proposal' : applications.includes('print') ? 'print collateral' : 'the closest real business equivalent'}\nPrimary message: ${strategy.message_hierarchy?.primary || ''}\nCTA: ${strategy.message_hierarchy?.cta || ''}`;
    case 'product-application':
      return es ? `Aplicaciones relevantes: ${applications.filter((item) => !['website', 'product'].includes(item)).join(', ') || 'servicio principal'}\nReglas de composición: ${visual.layout_rules || ''}\nTratamientos prohibidos: ${visual.imagery?.forbidden || ''}` : `Relevant applications: ${applications.filter((item) => !['website', 'product'].includes(item)).join(', ') || 'primary service'}\nLayout rules: ${visual.layout_rules || ''}\nForbidden treatments: ${visual.imagery?.forbidden || ''}`;
    case 'digital-application':
      return es ? `Mensaje principal: ${strategy.message_hierarchy?.primary || ''}\nApoyo: ${strategy.message_hierarchy?.support || ''}\nCTA: ${strategy.message_hierarchy?.cta || ''}\nComposición: ${visual.layout_rules || ''}\nMovimiento: ${visual.motion_rules || ''}` : `Primary message: ${strategy.message_hierarchy?.primary || ''}\nSupport: ${strategy.message_hierarchy?.support || ''}\nCTA: ${strategy.message_hierarchy?.cta || ''}\nLayout: ${visual.layout_rules || ''}\nMotion: ${visual.motion_rules || ''}`;
    case 'closing':
      return es ? `Propiedad: ${project.name}\nAprobación: ${project.intake?.approval_authority || 'por confirmar'}\nVersión: ${stamp}\nMantenimiento: registrar cada cambio, fuente y aprobación.` : `Ownership: ${project.name}\nApproval: ${project.intake?.approval_authority || 'to confirm'}\nVersion: ${stamp}\nMaintenance: record every change, source, and approval.`;
    default: return '';
  }
}

function annexContent(project, id, locale = 'en') {
  const es = locale === 'es-MX';
  const visual = project.visual || {};
  const strategy = project.strategy || {};
  const voice = project.voice || {};
  switch (id) {
    case 'strategy': return [strategy.positioning, strategy.promise, strategy.reasons_to_believe, strategy.values, strategy.message_hierarchy?.primary, strategy.message_hierarchy?.support, strategy.message_hierarchy?.cta].filter(nonEmpty).join('\n\n');
    case 'voice': return [voice.identity, voice.audience_language, voice.prohibited_language, voice.real_phrases, voice.channel_rules, voice.localization_rules, voice.examples].filter(nonEmpty).join('\n\n');
    case 'photography': return [visual.imagery?.direction, visual.imagery?.lighting, visual.imagery?.composition, visual.imagery?.people, visual.imagery?.forbidden].filter(nonEmpty).join('\n\n');
    case 'graphic-language': return [visual.illustration, visual.icon_family, visual.patterns_textures].filter(nonEmpty).join('\n\n');
    case 'motion': return visual.motion_rules || '';
    case 'templates': return (visual.applications || []).join(', ');
    case 'accessibility': return [visual.accessibility_notes, voice.localization_rules].filter(nonEmpty).join('\n\n');
    case 'tokens': return JSON.stringify({ colors: visual.colors, typography: visual.typography, spacing: visual.layout_rules }, null, 2);
    case 'governance': return es ? `Autoridad de aprobación: ${project.intake?.approval_authority || ''}\nCada cambio requiere fuente, responsable, fecha y estado.` : `Approval authority: ${project.intake?.approval_authority || ''}\nEvery change requires a source, owner, date, and status.`;
    case 'handoff': return es ? `Entregar HTML, PDF, tokens, manifiesto de materiales, prompts, componentes y registro de versiones.` : `Deliver HTML, PDF, tokens, asset manifest, prompts, components, and version log.`;
    default: return '';
  }
}

export function blankBrandbook() {
  return {
    schema_version: '1.0', locale: 'en',
    sections: KAKU_SECTIONS.map((section) => ({ id: section.id, title: section.en, content: '', approved: false, source_refs: [] })),
    annexes: DIGITAL_ANNEXES.map((annex) => ({ id: annex.id, title: annex.en, content: '', included: true })),
    updated_at: null
  };
}

export function buildBrandbookDraft(project, locale = 'en') {
  const existing = project.brandbook || blankBrandbook();
  const existingSections = new Map((existing.sections || []).map((section) => [section.id, section]));
  const existingAnnexes = new Map((existing.annexes || []).map((annex) => [annex.id, annex]));
  return {
    schema_version: '1.0', locale,
    sections: KAKU_SECTIONS.map((section) => {
      const prior = existingSections.get(section.id) || {};
      const generated = draftContent(project, section.id, locale);
      return { id: section.id, title: label(section, locale), content: prior.approved && nonEmpty(prior.content) ? prior.content : generated, approved: Boolean(prior.approved), source_refs: Array.isArray(prior.source_refs) ? prior.source_refs : [] };
    }),
    annexes: DIGITAL_ANNEXES.map((annex) => {
      const prior = existingAnnexes.get(annex.id) || {};
      return { id: annex.id, title: label(annex, locale), content: nonEmpty(prior.content) ? prior.content : annexContent(project, annex.id, locale), included: prior.included !== false };
    }),
    updated_at: now()
  };
}

export function normalizeBrandbook(brandbook = {}, project, locale = brandbook.locale || 'en') {
  const seeded = buildBrandbookDraft({ ...project, brandbook }, locale);
  return { ...seeded, updated_at: brandbook.updated_at || seeded.updated_at };
}

export function brandbookIsComplete(brandbook = {}) {
  const sections = Array.isArray(brandbook.sections) ? brandbook.sections : [];
  const annexes = Array.isArray(brandbook.annexes) ? brandbook.annexes : [];
  return sections.length === KAKU_SECTIONS.length && sections.every((section, index) => section.id === KAKU_SECTIONS[index].id && section.approved && nonEmpty(section.content)) && annexes.length === DIGITAL_ANNEXES.length && annexes.every((annex, index) => annex.id === DIGITAL_ANNEXES[index].id && annex.included && nonEmpty(annex.content));
}

function escapeHtml(value) { return String(value ?? '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]); }
function paragraphs(value) { return escapeHtml(value).split(/\n{2,}/).map((block) => `<p>${block.replace(/\n/g, '<br>')}</p>`).join(''); }

export function renderBrandbookDocument(project, locale = project.brandbook?.locale || 'en') {
  const brandbook = normalizeBrandbook(project.brandbook, project, locale);
  const colors = project.visual?.colors || {};
  const sections = brandbook.sections.map((section, index) => `<section class="page" id="${escapeHtml(section.id)}"><p class="number">${String(index + 1).padStart(2, '0')}</p><h2>${escapeHtml(section.title)}</h2>${paragraphs(section.content)}</section>`).join('');
  const annexes = brandbook.annexes.map((annex, index) => `<section class="page annex" id="annex-${escapeHtml(annex.id)}"><p class="number">${String.fromCharCode(65 + index)}</p><h2>${escapeHtml(annex.title)}</h2>${paragraphs(annex.content)}</section>`).join('');
  return `<!doctype html><html lang="${locale === 'es-MX' ? 'es-MX' : 'en'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(project.name)} · Brand book</title><style>:root{--primary:${colors.primary || '#173f35'};--accent:${colors.accent || '#d76a43'};--paper:${colors.background || '#f3efe6'};--ink:${colors.text || '#161a18'}}*{box-sizing:border-box}body{margin:0;background:#d9d6cf;color:var(--ink);font-family:Arial,sans-serif}.page{width:min(1100px,100%);min-height:760px;margin:24px auto;padding:72px;background:var(--paper);border-top:10px solid var(--primary)}.page:nth-child(3n){border-top-color:var(--accent)}.number{font-size:12px;letter-spacing:.16em;font-weight:700}.page h2{max-width:760px;margin:80px 0 32px;font-family:Georgia,serif;font-size:52px;line-height:1.05}.page p{max-width:760px;font-size:18px;line-height:1.65}.annex{background:#fff}.annex h2{font-size:40px}@media(max-width:700px){.page{margin:0;padding:36px 24px;min-height:100vh}.page h2{margin-top:44px;font-size:36px}.page p{font-size:16px}}@media print{body{background:#fff}.page{width:100%;margin:0;page-break-after:always;box-shadow:none}}</style></head><body>${sections}${annexes}</body></html>`;
}
