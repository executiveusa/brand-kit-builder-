const COPY = {
  en: {
    title: 'Build and approve the KAKU brand book', help: 'Review the 13 core pages in order, then confirm every required digital annex. Draft text is assembled only from the project’s confirmed strategy, voice, and visual rules.',
    core: 'Core sequence', annexes: 'Digital annexes', page: 'Page', annex: 'Annex', approved: 'Approved for the brand book', included: 'Include this annex', content: 'Page content', sources: 'Source references', sourceHint: 'Separate filenames, URLs, or interview answers with commas.',
    save: 'Save page', preview: 'Preview full brand book', closePreview: 'Close preview', previous: 'Previous', next: 'Next', complete: 'Brand book complete. Guardian review is now available.', incomplete: 'Approve all 13 core pages and include all 10 completed annexes.',
    approvedCount: 'approved pages', annexCount: 'included annexes', draftNotice: 'Draft assembled from confirmed project data. Human review is required before approval.', empty: 'This section needs confirmed content before it can be approved.', saved: 'Last saved', previewTitle: 'Local HTML brand-book preview'
  },
  'es-MX': {
    title: 'Construye y aprueba el manual de marca KAKU', help: 'Revisa las 13 páginas principales en orden y confirma cada anexo digital obligatorio. El borrador se arma únicamente con estrategia, voz y reglas visuales confirmadas del proyecto.',
    core: 'Secuencia principal', annexes: 'Anexos digitales', page: 'Página', annex: 'Anexo', approved: 'Aprobada para el manual de marca', included: 'Incluir este anexo', content: 'Contenido de la página', sources: 'Referencias de fuentes', sourceHint: 'Separa archivos, URL o respuestas de entrevista con comas.',
    save: 'Guardar página', preview: 'Vista previa del manual completo', closePreview: 'Cerrar vista previa', previous: 'Anterior', next: 'Siguiente', complete: 'Manual de marca completo. Ya está disponible la revisión Guardian.', incomplete: 'Aprueba las 13 páginas principales e incluye los 10 anexos completos.',
    approvedCount: 'páginas aprobadas', annexCount: 'anexos incluidos', draftNotice: 'Borrador armado con datos confirmados del proyecto. Requiere revisión humana antes de aprobarse.', empty: 'Esta sección necesita contenido confirmado antes de aprobarse.', saved: 'Último guardado', previewTitle: 'Vista previa local del manual en HTML'
  }
};

export function brandbookCopy(key, locale = document.documentElement.dataset.locale || 'en') {
  const selected = locale === 'es-MX' ? 'es-MX' : 'en';
  return COPY[selected][key] ?? COPY.en[key] ?? key;
}
