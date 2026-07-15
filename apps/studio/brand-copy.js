const COPY = {
  en: {
    openStage: 'Open current stage', readiness: 'Readiness', projectLibrary: 'Project library', switchProject: 'Switch project',
    newProject: 'Create a brand project', name: 'Project name', market: 'Primary market', sourceType: 'Starting source', sourceLocation: 'Source location or description',
    language: 'Working languages', create: 'Create project', cancel: 'Cancel', close: 'Close', current: 'Current', noProjects: 'No projects yet.',
    intakeTitle: 'Define the business before designing', intakeHelp: 'Complete the essential facts. The studio will not generate strategy or visuals until the readiness gate passes.',
    goal: 'Business goal', audience: 'Primary audience', action: 'Primary action', approver: 'Approval authority', constraints: 'Budget, time, legal, or production constraints', saveIntake: 'Save intake',
    discoveryTitle: 'Discovery interview', known: 'What is already known', recommendation: 'Recommendation', answer: 'Your confirmed answer', saveNext: 'Save and continue', completeInterview: 'Interview complete',
    sourcesTitle: 'Source ledger', sourcesHelp: 'Every source needs a trust level, access status, rights status, and resolved conflicts.', addSource: 'Add source', location: 'Location', trust: 'Trust', rights: 'Rights', accessed: 'Inspected', conflict: 'Conflict', resolve: 'Resolve', none: 'None',
    readinessTitle: '20-axis readiness gate', readinessHelp: 'Adjust only when evidence supports the score. Overall readiness must be 8.5 or higher and every critical axis must be at least 8.0.', overall: 'Overall score', pass: 'PASS', fail: 'BLOCKED', critical: 'Critical', saveScores: 'Save readiness scores',
    lockedTitle: 'This stage is still locked', lockedBody: 'Complete the previous stage and resolve the listed blockers first.', demoSaved: 'Saved locally. The desktop host can synchronize this project through the guarded agent core.',
    sourceBlocked: 'Inspect primary and governing sources and resolve conflicts.', intakeBlocked: 'Complete the goal, audience, action, and approval authority.', readinessBlocked: 'Raise readiness to 8.5 and clear every critical gap.',
    stageIntake: 'Intake', stageSources: 'Sources', stageReadiness: 'Readiness', stageStrategy: 'Strategy', stageVoice: 'Voice', stageVisual: 'Visual system', stageBrandbook: 'Brand book', stageGuardian: 'Guardian review', stageExport: 'Export',
    idea: 'Business idea', url: 'Live website', repo: 'Repository', files: 'Files and assets', logo: 'Logo', image: 'Image', brief: 'Brief', primary: 'Primary', governing: 'Governing', reference: 'Reference', inspiration: 'Inspiration', unknown: 'Unknown', owned: 'Owned', licensed: 'Licensed', cleared: 'Cleared', publicDomain: 'Public domain'
  },
  'es-MX': {
    openStage: 'Abrir etapa actual', readiness: 'Preparación', projectLibrary: 'Biblioteca de proyectos', switchProject: 'Cambiar proyecto',
    newProject: 'Crear proyecto de marca', name: 'Nombre del proyecto', market: 'Mercado principal', sourceType: 'Fuente inicial', sourceLocation: 'Ubicación o descripción de la fuente',
    language: 'Idiomas de trabajo', create: 'Crear proyecto', cancel: 'Cancelar', close: 'Cerrar', current: 'Actual', noProjects: 'Todavía no hay proyectos.',
    intakeTitle: 'Define el negocio antes de diseñar', intakeHelp: 'Completa los datos esenciales. El estudio no genera estrategia ni sistema visual hasta aprobar el filtro de preparación.',
    goal: 'Objetivo del negocio', audience: 'Audiencia principal', action: 'Acción principal', approver: 'Autoridad de aprobación', constraints: 'Límites de presupuesto, tiempo, legales o de producción', saveIntake: 'Guardar inicio',
    discoveryTitle: 'Entrevista de descubrimiento', known: 'Lo que ya sabemos', recommendation: 'Recomendación', answer: 'Tu respuesta confirmada', saveNext: 'Guardar y continuar', completeInterview: 'Entrevista terminada',
    sourcesTitle: 'Registro de fuentes', sourcesHelp: 'Cada fuente necesita nivel de confianza, estado de revisión, derechos y conflictos resueltos.', addSource: 'Agregar fuente', location: 'Ubicación', trust: 'Confianza', rights: 'Derechos', accessed: 'Revisada', conflict: 'Conflicto', resolve: 'Resolver', none: 'Ninguno',
    readinessTitle: 'Filtro de preparación de 20 ejes', readinessHelp: 'Ajusta una calificación sólo cuando exista evidencia. El promedio debe ser 8.5 o más y cada eje crítico debe ser mínimo 8.0.', overall: 'Calificación general', pass: 'APROBADO', fail: 'BLOQUEADO', critical: 'Crítico', saveScores: 'Guardar calificaciones',
    lockedTitle: 'Esta etapa sigue bloqueada', lockedBody: 'Primero completa la etapa anterior y resuelve los bloqueos indicados.', demoSaved: 'Guardado localmente. La aplicación de escritorio puede sincronizar el proyecto mediante el núcleo protegido.',
    sourceBlocked: 'Revisa las fuentes primarias y rectoras y resuelve los conflictos.', intakeBlocked: 'Completa objetivo, audiencia, acción y autoridad de aprobación.', readinessBlocked: 'Sube la preparación a 8.5 y resuelve cada brecha crítica.',
    stageIntake: 'Inicio', stageSources: 'Fuentes', stageReadiness: 'Preparación', stageStrategy: 'Estrategia', stageVoice: 'Voz', stageVisual: 'Sistema visual', stageBrandbook: 'Manual de marca', stageGuardian: 'Revisión Guardian', stageExport: 'Exportar',
    idea: 'Idea de negocio', url: 'Sitio en vivo', repo: 'Repositorio', files: 'Archivos y materiales', logo: 'Logo', image: 'Imagen', brief: 'Brief', primary: 'Primaria', governing: 'Rectora', reference: 'Referencia', inspiration: 'Inspiración', unknown: 'Desconocidos', owned: 'Propios', licensed: 'Con licencia', cleared: 'Autorizados', publicDomain: 'Dominio público'
  }
};

export const QUESTIONS = [
  { id: 'business_story', en: 'What is the shortest true story of why this business exists?', es: '¿Cuál es la historia verdadera más breve de por qué existe este negocio?', recEn: 'Use one concrete origin, need, or turning point.', recEs: 'Usa un origen, necesidad o momento de cambio concreto.' },
  { id: 'audience_pain', en: 'What problem is the primary audience already trying to solve?', es: '¿Qué problema ya está intentando resolver la audiencia principal?', recEn: 'Describe the problem in the customer’s own language.', recEs: 'Describe el problema con las palabras del cliente.' },
  { id: 'offer', en: 'What transformation does the main offer create?', es: '¿Qué transformación genera la oferta principal?', recEn: 'Name the before, the after, and the primary action.', recEs: 'Define el antes, el después y la acción principal.' },
  { id: 'differentiation', en: 'Why should someone choose this brand instead of the obvious alternative?', es: '¿Por qué alguien elegiría esta marca en lugar de la alternativa más obvia?', recEn: 'Use a defensible difference, not an adjective.', recEs: 'Usa una diferencia defendible, no un adjetivo.' },
  { id: 'values', en: 'Which values guide decisions, and what behavior is not acceptable?', es: '¿Qué valores guían las decisiones y qué comportamiento no es aceptable?', recEn: 'Pair each value with a visible behavior or boundary.', recEs: 'Relaciona cada valor con una conducta o límite visible.' },
  { id: 'voice', en: 'Which real phrases sound unmistakably like this brand?', es: '¿Qué frases reales suenan claramente como esta marca?', recEn: 'Use language already spoken by the founder, team, or customers.', recEs: 'Usa lenguaje que ya diga la persona fundadora, el equipo o los clientes.' },
  { id: 'proof', en: 'What proof can the brand use publicly and safely?', es: '¿Qué evidencia puede usar la marca de forma pública y segura?', recEn: 'List only verified results, credentials, testimonials, or artifacts.', recEs: 'Incluye sólo resultados, credenciales, testimonios o materiales verificados.' },
  { id: 'applications', en: 'Where must this brand system work first?', es: '¿Dónde debe funcionar primero este sistema de marca?', recEn: 'Prioritize the website, social, sales, presentation, packaging, or product surfaces that matter now.', recEs: 'Prioriza sitio, redes, ventas, presentaciones, empaque o producto que importen ahora.' },
  { id: 'accessibility', en: 'Which accessibility and inclusion requirements are mandatory?', es: '¿Qué requisitos de accesibilidad e inclusión son obligatorios?', recEn: 'Confirm contrast, keyboard, readability, language, captions, and representation needs.', recEs: 'Confirma contraste, teclado, legibilidad, idioma, subtítulos y representación.' },
  { id: 'governance', en: 'Who approves final work, and how should future changes be governed?', es: '¿Quién aprueba el trabajo final y cómo se deben gobernar los cambios futuros?', recEn: 'Name one accountable approver and a repeatable review process.', recEs: 'Define una persona responsable y un proceso de revisión repetible.' }
];

const STAGE_LABEL_KEYS = { intake: 'stageIntake', sources: 'stageSources', readiness: 'stageReadiness', strategy: 'stageStrategy', voice: 'stageVoice', visual: 'stageVisual', brandbook: 'stageBrandbook', guardian: 'stageGuardian', export: 'stageExport' };

export function currentLocale() { return document.documentElement.dataset.locale === 'es-MX' ? 'es-MX' : 'en'; }
export function copy(key) { return COPY[currentLocale()][key] ?? COPY.en[key] ?? key; }
export function stageLabel(stage) { return copy(STAGE_LABEL_KEYS[stage]); }
