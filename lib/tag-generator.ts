/**
 * Tag generation rules by content type and subcategory.
 * Tags are extracted from text based on keyword matching.
 */

type ContentType = 'recetas' | 'salud' | 'notas_de_mar'

const TAG_RULES: Record<ContentType, Record<string, string[]>> = {
  recetas: {
    default: [
      'pescado',
      'mariscos',
      'mar',
      'cocina',
      'receta',
      'fácil',
      'rápido',
      'horno',
      'plancha',
      'vapor',
      'frito',
      'asado',
      'hervido',
      'crudo',
      'limón',
      'ajo',
      'aceite',
      'sal',
      'pimienta',
      'perejil',
      'cebolla',
      'tomate',
      'vino',
      'crema',
      'manteca',
      'queso',
      'entrada',
      'principal',
      'guarnición',
      'postre',
      'verano',
      'invierno',
      'festivo',
      'económico',
      'gourmet',
      'sin gluten',
      'saludable',
      'liviano',
      'proteína',
    ],
    desayunos: [
      'desayuno',
      'merienda',
      'tostada',
      'huevo',
      'rápido',
      'liviano',
    ],
    platos_principales: [
      'principal',
      'filetes',
      'entero',
      'porciones',
      'familiar',
    ],
    acompañamientos: [
      'guarnición',
      'ensalada',
      'verduras',
      'papas',
      'arroz',
      'pasta',
    ],
  },
  salud: {
    default: [
      'salud',
      'nutrición',
      'beneficios',
      'proteína',
      'omega-3',
      'vitaminas',
      'minerales',
      'calcio',
      'hierro',
      'zinc',
      'yodo',
      'cardiovascular',
      'cerebral',
      'muscular',
      'óseo',
      'inmune',
      'pescado',
      'mariscos',
      'dieta',
      'alimentación',
    ],
    beneficios: [
      'beneficios',
      'propiedades',
      'salud',
      'prevención',
      'protección',
      'mejora',
      'reduce',
      'aumenta',
      'fortalece',
      'bienestar',
    ],
    nutricion: [
      'nutrición',
      'calorías',
      'proteína',
      'grasa',
      'omega-3',
      'omega-6',
      'vitamina',
      'mineral',
      'calcio',
      'hierro',
      'zinc',
      'yodo',
      'fósforo',
      'colesterol',
      'sodio',
      'potasio',
      'selenio',
      'magnesio',
      'macro',
      'micro',
      'nutriente',
      'composición',
    ],
    dietas: [
      'dieta',
      'régimen',
      'adelgazar',
      'bajar de peso',
      'keto',
      'paleo',
      'mediterránea',
      'vegetariana',
      'vegana',
      'sin gluten',
      'sin lactosa',
      'bajo en calorías',
      'alto en proteína',
      'bajo en grasa',
    ],
    mitos: [
      'mito',
      'verdad',
      'falso',
      'cierto',
      'realidad',
      'desmitificar',
      'creencia',
      'popular',
      'científico',
      'evidencia',
      'estudio',
    ],
  },
  notas_de_mar: {
    default: [
      'mar',
      'océano',
      'pesca',
      'pescador',
      'especie',
      'hábitat',
      'Argentina',
      'Patagonia',
      'Atlántico',
      'río',
      'lago',
      'sostenibilidad',
      'temporada',
      'fresco',
      'conservación',
    ],
    productos: [
      'producto',
      'especie',
      'variedad',
      'presentación',
      'fresco',
      'congelado',
      'ahumado',
      'curado',
      'conserva',
      'filete',
      'entero',
      'trozo',
      'calidad',
      'origen',
      'trazabilidad',
    ],
    consejos: [
      'consejo',
      'tip',
      'truco',
      'técnica',
      'método',
      'cómo',
      'limpiar',
      'cortar',
      'conservar',
      'almacenar',
      'elegir',
      'comprar',
      'preparar',
      'cocinar',
      'descongelar',
      'marinar',
    ],
    origen: [
      'origen',
      'procedencia',
      'hábitat',
      'distribución',
      'migración',
      'pesca',
      'acuicultura',
      'captura',
      'zona',
      'región',
      'Argentina',
      'Patagonia',
      'Mar del Plata',
      'Atlántico Sur',
    ],
    curiosidades: [
      'curiosidad',
      'dato',
      'interesante',
      'sabías',
      'historia',
      'cultura',
      'tradición',
      'gastronomía',
      'record',
      'único',
    ],
  },
}

/**
 * Extract tags from text based on content type and category.
 * Matches keywords from the text (case-insensitive).
 */
export function generateTagsFromText(
  text: string,
  contentType: ContentType,
  category?: string | null,
  existingSpecies?: string[],
): string[] {
  const lowerText = text.toLowerCase()
  const tags = new Set<string>()

  // Add existing species tags
  if (existingSpecies) {
    existingSpecies.forEach((s) => tags.add(s.toLowerCase()))
  }

  const rules = TAG_RULES[contentType]
  if (!rules) return Array.from(tags)

  // Always apply default rules
  const defaultKeywords = rules['default'] || []
  for (const keyword of defaultKeywords) {
    if (lowerText.includes(keyword.toLowerCase())) {
      tags.add(keyword)
    }
  }

  // Apply category-specific rules if category exists
  if (category && rules[category]) {
    for (const keyword of rules[category]) {
      if (lowerText.includes(keyword.toLowerCase())) {
        tags.add(keyword)
      }
    }
  }

  // Limit to 15 tags max
  return Array.from(tags).slice(0, 15)
}
