const COPY = {
  en: {
    strategyTitle: 'Build the strategy from confirmed evidence',
    strategyHelp: 'Complete the positioning, message hierarchy, proof ledger, and three genuinely distinct creative territories. Saving a draft does not approve it.',
    positioning: 'Positioning statement', promise: 'Brand promise', reasons: 'Reasons to believe', values: 'Values and behavioral boundaries',
    messages: 'Message hierarchy', primaryMessage: 'Primary message', supportMessage: 'Supporting message', cta: 'Primary call to action',
    proofLedger: 'Proof ledger', proofHelp: 'Every public claim needs a source and a clear status.', claim: 'Claim', source: 'Evidence source', status: 'Status', confirmed: 'Confirmed', provisional: 'Provisional', blocked: 'Blocked', addClaim: 'Add claim', remove: 'Remove',
    territories: 'Three creative territories', territoriesHelp: 'Each direction must be meaningfully different, not the same design with new colors.', territory: 'Territory', territoryName: 'Name', concept: 'Strategic concept', mood: 'Mood and visual signals', avoid: 'What this direction must avoid',
    saveStrategy: 'Save strategy draft', strategyComplete: 'Strategy complete. Brand voice is now available.', strategyIncomplete: 'Complete all required strategy fields, three territories, and at least one sourced claim.',
    voiceTitle: 'Define a voice people can recognize and use', voiceHelp: 'Document real language, boundaries, channel behavior, localization rules, and examples. Do not invent quotes or stories.',
    voiceIdentity: 'Voice identity', audienceLanguage: 'Audience language and vocabulary', prohibited: 'Prohibited language and patterns', phrases: 'Real approved phrases', stories: 'True stories available for content', channels: 'Channel rules', localization: 'English and Mexican Spanish localization rules', examples: 'Approved voice examples',
    voiceAxes: 'Voice direction', direct: 'Direct ↔ Explanatory', warm: 'Warm ↔ Authoritative', playful: 'Playful ↔ Serious', concise: 'Concise ↔ Expansive',
    saveVoice: 'Save voice system', voiceComplete: 'Voice complete. The visual system is now available.', voiceIncomplete: 'Complete the required voice evidence, boundaries, channel rules, localization rules, and examples.',
    required: 'Required', saved: 'Draft saved', sourceHint: 'Use a filename, URL, interview answer, or approved artifact.'
  },
  'es-MX': {
    strategyTitle: 'Construye la estrategia con evidencia confirmada',
    strategyHelp: 'Completa posicionamiento, jerarquía de mensajes, registro de pruebas y tres territorios creativos realmente distintos. Guardar un borrador no significa aprobarlo.',
    positioning: 'Declaración de posicionamiento', promise: 'Promesa de marca', reasons: 'Razones para creer', values: 'Valores y límites de comportamiento',
    messages: 'Jerarquía de mensajes', primaryMessage: 'Mensaje principal', supportMessage: 'Mensaje de apoyo', cta: 'Llamado a la acción principal',
    proofLedger: 'Registro de pruebas', proofHelp: 'Cada afirmación pública necesita una fuente y un estado claro.', claim: 'Afirmación', source: 'Fuente de evidencia', status: 'Estado', confirmed: 'Confirmada', provisional: 'Provisional', blocked: 'Bloqueada', addClaim: 'Agregar afirmación', remove: 'Quitar',
    territories: 'Tres territorios creativos', territoriesHelp: 'Cada dirección debe ser realmente distinta, no el mismo diseño con otros colores.', territory: 'Territorio', territoryName: 'Nombre', concept: 'Concepto estratégico', mood: 'Ambiente y señales visuales', avoid: 'Lo que esta dirección debe evitar',
    saveStrategy: 'Guardar borrador de estrategia', strategyComplete: 'Estrategia completa. La voz de marca ya está disponible.', strategyIncomplete: 'Completa todos los campos obligatorios, tres territorios y al menos una afirmación con fuente.',
    voiceTitle: 'Define una voz reconocible y fácil de usar', voiceHelp: 'Documenta lenguaje real, límites, comportamiento por canal, reglas de localización y ejemplos. No inventes citas ni historias.',
    voiceIdentity: 'Identidad de voz', audienceLanguage: 'Lenguaje y vocabulario de la audiencia', prohibited: 'Lenguaje y patrones prohibidos', phrases: 'Frases reales aprobadas', stories: 'Historias verdaderas disponibles para contenido', channels: 'Reglas por canal', localization: 'Reglas de localización para inglés y español de México', examples: 'Ejemplos aprobados de voz',
    voiceAxes: 'Dirección de voz', direct: 'Directa ↔ Explicativa', warm: 'Cálida ↔ Autoritaria', playful: 'Juguetona ↔ Seria', concise: 'Concisa ↔ Amplia',
    saveVoice: 'Guardar sistema de voz', voiceComplete: 'Voz completa. El sistema visual ya está disponible.', voiceIncomplete: 'Completa evidencia de voz, límites, reglas por canal, localización y ejemplos.',
    required: 'Obligatorio', saved: 'Borrador guardado', sourceHint: 'Usa un archivo, URL, respuesta de entrevista o material aprobado.'
  }
};

export function strategyVoiceCopy(key, locale = document.documentElement.dataset.locale || 'en') {
  const selected = locale === 'es-MX' ? 'es-MX' : 'en';
  return COPY[selected][key] ?? COPY.en[key] ?? key;
}
