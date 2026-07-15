const COPY = {
  en: {
    title: 'Build the visual system from the approved strategy', help: 'Choose one approved creative territory, then define the identity rules that every application must follow. Protected artwork stays locked unless a redesign is explicitly approved.',
    territory: 'Approved creative territory', logo: 'Logo policy', preserve: 'Preserve supplied logo', refine: 'Refine production artwork', redesign: 'Approved redesign', logoNotes: 'Logo rules and notes',
    colors: 'Color system', primary: 'Primary', secondary: 'Secondary', accent: 'Accent', background: 'Background', text: 'Text',
    typography: 'Typography', display: 'Display typeface or category', body: 'Body typeface or category', scale: 'Type scale', balanced: 'Balanced', compact: 'Compact', expressive: 'Expressive', typeRules: 'Typography rules',
    imagery: 'Image direction', direction: 'Overall direction', lighting: 'Lighting', composition: 'Composition and framing', people: 'People and representation', forbidden: 'Forbidden image treatments',
    system: 'Supporting visual language', illustration: 'Illustration direction', icons: 'Icon family', patterns: 'Patterns and textures', layout: 'Layout and spacing rules', motion: 'Motion rules', accessibility: 'Accessibility and contrast notes',
    applications: 'Priority applications', website: 'Website', social: 'Social media', presentation: 'Presentation', print: 'Print collateral', packaging: 'Packaging', merch: 'Merchandise', product: 'Product UI', signage: 'Signage',
    save: 'Save visual system', complete: 'Visual system complete. Brand-book construction is now available.', incomplete: 'Select a territory and complete the required identity, accessibility, and application rules.', saved: 'Draft saved', required: 'Required'
  },
  'es-MX': {
    title: 'Construye el sistema visual desde la estrategia aprobada', help: 'Elige un territorio creativo aprobado y define las reglas de identidad que deben respetar todas las aplicaciones. El arte protegido permanece bloqueado salvo que exista aprobación explícita para rediseñarlo.',
    territory: 'Territorio creativo aprobado', logo: 'Política del logo', preserve: 'Conservar el logo entregado', refine: 'Refinar el arte de producción', redesign: 'Rediseño aprobado', logoNotes: 'Reglas y notas del logo',
    colors: 'Sistema de color', primary: 'Principal', secondary: 'Secundario', accent: 'Acento', background: 'Fondo', text: 'Texto',
    typography: 'Tipografía', display: 'Tipografía o categoría para títulos', body: 'Tipografía o categoría para texto', scale: 'Escala tipográfica', balanced: 'Equilibrada', compact: 'Compacta', expressive: 'Expresiva', typeRules: 'Reglas tipográficas',
    imagery: 'Dirección de imagen', direction: 'Dirección general', lighting: 'Iluminación', composition: 'Composición y encuadre', people: 'Personas y representación', forbidden: 'Tratamientos de imagen prohibidos',
    system: 'Lenguaje visual de apoyo', illustration: 'Dirección de ilustración', icons: 'Familia de iconos', patterns: 'Patrones y texturas', layout: 'Reglas de composición y espacio', motion: 'Reglas de movimiento', accessibility: 'Notas de accesibilidad y contraste',
    applications: 'Aplicaciones prioritarias', website: 'Sitio web', social: 'Redes sociales', presentation: 'Presentación', print: 'Material impreso', packaging: 'Empaque', merch: 'Mercancía', product: 'Interfaz de producto', signage: 'Señalización',
    save: 'Guardar sistema visual', complete: 'Sistema visual completo. Ya está disponible la construcción del manual de marca.', incomplete: 'Selecciona un territorio y completa las reglas obligatorias de identidad, accesibilidad y aplicaciones.', saved: 'Borrador guardado', required: 'Obligatorio'
  }
};

export function visualCopy(key, locale = document.documentElement.dataset.locale || 'en') {
  const selected = locale === 'es-MX' ? 'es-MX' : 'en';
  return COPY[selected][key] ?? COPY.en[key] ?? key;
}
