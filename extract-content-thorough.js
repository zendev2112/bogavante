const fs = require('fs')
const path = require('path')

// Load metadata - THIS IS THE MASTER REFERENCE
const metadata = JSON.parse(fs.readFileSync('./metadata.json', 'utf8'))

// ============================================================================
// SPECIES DETECTION - Uses ALL aliases from metadata
// ============================================================================
function detectSpecies(text) {
  const lowerText = text.toLowerCase()
  const found = new Set()
  const details = []

  // Search through ALL pescados
  for (const fish of metadata.especies.pescados) {
    // Check nombre
    if (lowerText.includes(fish.nombre.toLowerCase())) {
      found.add(fish.id)
      details.push({
        id: fish.id,
        matched_by: 'nombre',
        matched_text: fish.nombre,
        confidence: 1.0,
      })
      continue
    }

    // Check ALL aliases
    for (const alias of fish.aliases) {
      const aliasLower = alias.toLowerCase()
      if (lowerText.includes(aliasLower)) {
        found.add(fish.id)
        details.push({
          id: fish.id,
          matched_by: 'alias',
          matched_text: alias,
          confidence: 0.9,
        })
        break
      }
    }

    // Check scientific name
    if (lowerText.includes(fish.nombre_cientifico.toLowerCase())) {
      found.add(fish.id)
      details.push({
        id: fish.id,
        matched_by: 'scientific',
        matched_text: fish.nombre_cientifico,
        confidence: 1.0,
      })
    }
  }

  // Search through ALL mariscos
  for (const seafood of metadata.especies.mariscos) {
    if (lowerText.includes(seafood.nombre.toLowerCase())) {
      found.add(seafood.id)
      details.push({
        id: seafood.id,
        matched_by: 'nombre',
        matched_text: seafood.nombre,
        confidence: 1.0,
      })
      continue
    }

    for (const alias of seafood.aliases) {
      if (lowerText.includes(alias.toLowerCase())) {
        found.add(seafood.id)
        details.push({
          id: seafood.id,
          matched_by: 'alias',
          matched_text: alias,
          confidence: 0.9,
        })
        break
      }
    }
  }

  return {
    especies: Array.from(found),
    details: details,
  }
}

// ============================================================================
// GET SPECIES FULL INFO from metadata
// ============================================================================
function getSpeciesInfo(especieId) {
  // Search pescados
  let species = metadata.especies.pescados.find((p) => p.id === especieId)
  if (species) return { ...species, tipo: 'pescado' }

  // Search mariscos
  species = metadata.especies.mariscos.find((m) => m.id === especieId)
  if (species) return { ...species, tipo: 'marisco' }

  return null
}

// ============================================================================
// COOKING METHOD DETECTION - Uses reglas_clasificacion
// ============================================================================
function detectCookingMethod(text) {
  const lowerText = text.toLowerCase()
  const found = []
  const details = []

  const keywordsByMethod =
    metadata.reglas_clasificacion.recetas.detectar_metodo.keywords_por_metodo

  for (const [method, keywords] of Object.entries(keywordsByMethod)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        if (!found.includes(method)) {
          found.push(method)
          details.push({
            method: method,
            matched_keyword: keyword,
            confidence: 0.9,
          })
        }
      }
    }
  }

  // Also check especies recommended methods
  return {
    methods: found.length > 0 ? found : ['general'],
    details: details,
  }
}

// ============================================================================
// DIFFICULTY DETECTION - Uses categorias_contenido rules
// ============================================================================
function detectDifficulty(text, stepsCount, timeMinutes) {
  const difficulties = metadata.categorias_contenido.recetas.dificultad

  // Parse time limits
  const facilTime = parseInt(difficulties[0].tiempo_max) // 30min
  const medioTime = parseInt(difficulties[1].tiempo_max) // 60min

  // Count steps
  if (stepsCount <= 5 && timeMinutes <= facilTime) {
    return {
      difficulty: 'Fácil',
      reason: `${stepsCount} steps, ${timeMinutes}min`,
      confidence: 0.95,
    }
  }

  if (stepsCount > 10 || timeMinutes > medioTime) {
    return {
      difficulty: 'Difícil',
      reason: `${stepsCount} steps, ${timeMinutes}min`,
      confidence: 0.9,
    }
  }

  // Check keywords
  const lowerText = text.toLowerCase()
  const easyWords = ['easy', 'simple', 'quick', 'fácil', 'simple', 'rápido']
  const hardWords = [
    'advanced',
    'complex',
    'difficult',
    'avanzado',
    'complejo',
    'difícil',
  ]

  if (hardWords.some((w) => lowerText.includes(w))) {
    return { difficulty: 'Difícil', reason: 'keyword match', confidence: 0.8 }
  }

  if (easyWords.some((w) => lowerText.includes(w))) {
    return { difficulty: 'Fácil', reason: 'keyword match', confidence: 0.8 }
  }

  return {
    difficulty: 'Medio',
    reason: 'default',
    confidence: 0.7,
  }
}

// ============================================================================
// CONTENT TYPE CLASSIFICATION - recetas vs salud vs notas_de_mar
// ============================================================================
function detectContentType(text, title) {
  const lowerText = text.toLowerCase()
  const lowerTitle = title.toLowerCase()

  // Check for SALUD keywords
  const saludCategories = metadata.categorias_contenido.salud.categorias
  let saludScore = 0

  for (const category of saludCategories) {
    for (const keyword of category.keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        saludScore += 2
      }
      if (lowerTitle.includes(keyword.toLowerCase())) {
        saludScore += 5
      }
    }
  }

  // Check for NOTAS DE MAR keywords
  const notasCategories = metadata.categorias_contenido.notas_de_mar.categorias
  let notasScore = 0

  for (const category of notasCategories) {
    for (const keyword of category.keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        notasScore += 2
      }
      if (lowerTitle.includes(keyword.toLowerCase())) {
        notasScore += 5
      }
    }
  }

  // Check for RECIPE indicators
  const recipeIndicators = [
    'ingredients',
    'instructions',
    'steps',
    'recipe',
    'ingredientes',
    'pasos',
    'receta',
  ]
  let recipeScore = 0

  for (const indicator of recipeIndicators) {
    if (lowerText.includes(indicator)) {
      recipeScore += 3
    }
  }

  // Determine content type
  if (saludScore > notasScore && saludScore > recipeScore) {
    return {
      type: 'salud',
      score: saludScore,
      confidence: 0.85,
    }
  }

  if (notasScore > recipeScore && notasScore > saludScore) {
    return {
      type: 'notas_de_mar',
      score: notasScore,
      confidence: 0.8,
    }
  }

  return {
    type: 'recetas',
    score: recipeScore,
    confidence: 0.9,
  }
}

// ============================================================================
// CATEGORY DETECTION within content type
// ============================================================================
function detectCategory(text, contentType, especies) {
  const lowerText = text.toLowerCase()

  if (contentType === 'salud') {
    const categories = metadata.categorias_contenido.salud.categorias

    for (const category of categories) {
      for (const keyword of category.keywords) {
        if (lowerText.includes(keyword.toLowerCase())) {
          return {
            category: category.id,
            matched_keyword: keyword,
            confidence: 0.85,
          }
        }
      }
    }
    return { category: 'nutricion', confidence: 0.5 }
  }

  if (contentType === 'notas_de_mar') {
    const categories = metadata.categorias_contenido.notas_de_mar.categorias

    for (const category of categories) {
      for (const keyword of category.keywords) {
        if (lowerText.includes(keyword.toLowerCase())) {
          return {
            category: category.id,
            matched_keyword: keyword,
            confidence: 0.85,
          }
        }
      }
    }
    return { category: 'preparacion', confidence: 0.5 }
  }

  // For recetas, return cooking method as category
  return { category: 'coccion', confidence: 0.7 }
}

// ============================================================================
// PRESENTATION DETECTION - which cut/presentation
// ============================================================================
function detectPresentation(text, especieId) {
  const speciesInfo = getSpeciesInfo(especieId)
  if (!speciesInfo || !speciesInfo.presentaciones) return null

  const lowerText = text.toLowerCase()

  for (const presentacion of speciesInfo.presentaciones) {
    if (lowerText.includes(presentacion.toLowerCase())) {
      return presentacion
    }
  }

  // Try common presentations
  if (lowerText.includes('filet') || lowerText.includes('fillet')) {
    return speciesInfo.presentaciones.find((p) => p.includes('Filet')) || null
  }

  if (lowerText.includes('whole') || lowerText.includes('entero')) {
    return speciesInfo.presentaciones.find((p) => p.includes('Entero')) || null
  }

  return null
}

// ============================================================================
// TAG GENERATION - comprehensive tags based on metadata
// ============================================================================
function generateTags(text, especies, methods, difficulty, contentType) {
  const tags = new Set();

  // Add especies
  especies.forEach(e => tags.add(e));

  // Add methods
  methods.forEach(m => tags.add(m));

  // Add difficulty
  tags.add(difficulty.toLowerCase());

  // Add health tags if applicable
  const lowerText = text.toLowerCase();
  
  const healthTags = ['omega-3', 'proteína', 'vitaminas', 'minerales', 'cardiovascular', 
                      'bajo-grasa', 'alto-proteína', 'cerebral'];
  
  healthTags.forEach(tag => {
    if (lowerText.includes(tag) || lowerText.includes(tag.replace('-', ' '))) {
      tags.add(tag);
    }
  });

  // Add species characteristics as tags - WITH SAFETY CHECKS
  for (const especieId of especies) {
    const info = getSpeciesInfo(especieId);
    if (info) {
      // Add category
      if (info.categoria) {
        tags.add(info.categoria.toLowerCase().replace(/\s+/g, '-'));
      }
      
      // Add characteristics - CHECK IF THEY EXIST
      if (info.caracteristicas) {
        if (info.caracteristicas.textura) {
          tags.add(info.caracteristicas.textura.toLowerCase());
        }
        if (info.caracteristicas.sabor) {
          tags.add(info.caracteristicas.sabor.toLowerCase());
        }
        if (info.caracteristicas.grasa) {
          tags.add(`grasa-${info.caracteristicas.grasa.toLowerCase()}`);
        }
      }
    }
  }

  // Add occasion tags
  if (lowerText.includes('quick') || lowerText.includes('rápido') || lowerText.includes('20 min')) {
    tags.add('rápido');
  }

  if (lowerText.includes('festiv') || lowerText.includes('holiday') || lowerText.includes('celebra')) {
    tags.add('festivo');
  }

  if (lowerText.includes('budget') || lowerText.includes('económico') || lowerText.includes('cheap')) {
    tags.add('económico');
  }

  return Array.from(tags);
}

// ============================================================================
// QUALITY SCORE - using filtros_extraccion rules
// ============================================================================
function calculateQualityScore(entry) {
  let score = 0
  const rules = metadata.filtros_extraccion.calidad_score

  // Has species identified
  if (entry.especies && entry.especies.length > 0) {
    score += rules.tiene_especie_identificada
  }

  // Has cooking method
  if (entry.metodo_coccion && entry.metodo_coccion.length > 0) {
    score += rules.tiene_metodo_coccion
  }

  // Has time
  if (entry.prep_time || entry.cook_time) {
    score += rules.tiene_tiempo_preparacion
  }

  // Has ingredients
  if (entry.ingredients && entry.ingredients.length >= 2) {
    score += rules.tiene_ingredientes_completos
  }

  // Has steps
  if (entry.steps && entry.steps.length >= 2) {
    score += rules.tiene_pasos_detallados
  }

  return score
}

// ============================================================================
// EXTRACT INGREDIENTS
// ============================================================================
function extractIngredients(text) {
  const ingredientSection = text.match(
    /ingredients?:?\s*([\s\S]*?)(?=instructions?:|directions?:|steps?:|preparation:|method:|$)/i
  )
  if (!ingredientSection) return []

  const lines = ingredientSection[1]
    .split('\n')
    .map((line) => line.trim())
    .filter(
      (line) =>
        line &&
        !line.match(/^(ingredients?|instructions?|directions?|steps?):?$/i)
    )
    .filter((line) => line.length > 2)

  return lines.map((line, index) => {
    // Parse quantity and unit
    const quantityMatch = line.match(
      /^(\d+(?:[\/\.]\d+)?)\s*([a-zA-Z]+)?\s+(.+)/
    )

    if (quantityMatch) {
      return {
        quantity: quantityMatch[1],
        unit: quantityMatch[2] || 'unidades',
        name: quantityMatch[3],
        name_original: line,
        order: index + 1,
      }
    }

    return {
      name: line.replace(/^[-•\d.)\s]+/, '').trim(),
      name_original: line,
      order: index + 1,
    }
  })
}

// ============================================================================
// EXTRACT STEPS
// ============================================================================
function extractSteps(text) {
  const stepsSection = text.match(
    /(?:instructions?:|directions?:|steps?:|preparation:|method:)\s*([\s\S]*?)$/i
  )
  if (!stepsSection) return []

  const lines = stepsSection[1]
    .split(/\n|\d+\.\s/)
    .map((line) => line.trim())
    .filter((line) => line && line.length > 10)

  return lines.map((step, index) => ({
    step_number: index + 1,
    instruction: step,
    instruction_original: step,
  }))
}

// ============================================================================
// EXTRACT TIME
// ============================================================================
function extractTime(text) {
  const prepMatch = text.match(
    /prep(?:aration)?\s*time:?\s*(\d+)\s*(?:minutes?|mins?)/i
  )
  const cookMatch = text.match(
    /cook(?:ing)?\s*time:?\s*(\d+)\s*(?:minutes?|mins?)/i
  )
  const totalMatch = text.match(/total\s*time:?\s*(\d+)\s*(?:minutes?|mins?)/i)

  return {
    prep_time: prepMatch ? parseInt(prepMatch[1]) : null,
    cook_time: cookMatch ? parseInt(cookMatch[1]) : null,
    total_time: totalMatch ? parseInt(totalMatch[1]) : null,
  }
}

// ============================================================================
// SLUGIFY
// ============================================================================
function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// ============================================================================
// PROCESS SINGLE ENTRY
// ============================================================================
function processEntry(entry, bookInfo) {
  const fullText = entry.full_text_original || entry.full_text || ''
  const title = entry.title || fullText.split('\n')[0].substring(0, 100)

  // Detect species with ALL details
  const speciesDetection = detectSpecies(fullText)

  // Detect cooking methods
  const methodsDetection = detectCookingMethod(fullText)

  // Extract ingredients and steps
  const ingredients = extractIngredients(fullText)
  const steps = extractSteps(fullText)

  // Extract time
  const timeInfo = extractTime(fullText)

  // Detect difficulty
  const difficultyInfo = detectDifficulty(
    fullText,
    steps.length,
    timeInfo.total_time || 30
  )

  // Detect content type
  const contentTypeInfo = detectContentType(fullText, title)

  // Detect category within content type
  const categoryInfo = detectCategory(
    fullText,
    contentTypeInfo.type,
    speciesDetection.especies
  )

  // Detect presentation for main species
  const mainSpecies = speciesDetection.especies[0]
  const presentation = mainSpecies
    ? detectPresentation(fullText, mainSpecies)
    : null

  // Generate comprehensive tags
  const tags = generateTags(
    fullText,
    speciesDetection.especies,
    methodsDetection.methods,
    difficultyInfo.difficulty,
    contentTypeInfo.type
  )

  // Build entry
  const processedEntry = {
    id: slugify(title),
    title: title,
    title_original: entry.title || title,
    slug: slugify(title),

    // Species info
    especies: speciesDetection.especies,
    especies_details: speciesDetection.details,
    especies_main: mainSpecies || null,
    presentacion_recomendada: presentation,

    // Get full species info
    especies_info: speciesDetection.especies.map((id) => getSpeciesInfo(id)),

    // Classification
    content_type: contentTypeInfo.type,
    category: categoryInfo.category,

    // Cooking info
    metodo_coccion: methodsDetection.methods,
    metodo_coccion_details: methodsDetection.details,
    difficulty: difficultyInfo.difficulty,
    difficulty_details: difficultyInfo,

    // Time
    prep_time: timeInfo.prep_time,
    cook_time: timeInfo.cook_time,
    total_time: timeInfo.total_time,

    // Content
    ingredients: ingredients,
    steps: steps,
    tags: tags,

    // Summary
    summary: fullText.substring(0, 300).trim() + '...',
    excerpt: fullText.split('\n').slice(0, 3).join(' ').substring(0, 200),

    // Full text - NEVER TRUNCATED
    full_text: fullText,

    // Metadata
    source_book: bookInfo.title,
    source_page: entry.page || entry.pages?.[0] || null,
    original_language: bookInfo.language || 'en',

    // Quality
    quality_score: 0, // Will calculate after
    confidence_score: Math.min(
      speciesDetection.details[0]?.confidence || 0.5,
      contentTypeInfo.confidence,
      difficultyInfo.confidence
    ),

    // Status
    status: 'draft',
    created_at: new Date().toISOString(),
  }

  // Calculate quality score
  processedEntry.quality_score = calculateQualityScore(processedEntry)

  return processedEntry
}

// ============================================================================
// MAIN EXTRACTION
// ============================================================================
function extractContent(jsonFilePath) {
  console.log(`\n${'='.repeat(80)}`)
  console.log(`Processing: ${path.basename(jsonFilePath)}`)
  console.log('='.repeat(80))

  // Load raw JSON
  const rawData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'))

  // Extract book info
  const bookInfo = {
    title: rawData.book_info?.title || rawData.book_title || 'Unknown',
    authors: rawData.book_info?.author?.split(';').map((a) => a.trim()) || [],
    year: rawData.book_info?.year ? parseInt(rawData.book_info.year) : null,
    publisher: rawData.book_info?.publisher || null,
    language: rawData.detected_language || 'en',
  }

  console.log(`\n📚 Book: ${bookInfo.title}`)
  console.log(`👤 Authors: ${bookInfo.authors.join(', ')}`)
  console.log(`📅 Year: ${bookInfo.year}`)
  console.log(`🏢 Publisher: ${bookInfo.publisher}\n`)

  // Process all entries
  const entries = (rawData.recipes || []).map((entry, index) => {
    console.log(`Processing entry ${index + 1}/${rawData.recipes.length}...`)
    return processEntry(entry, bookInfo)
  })

  // Statistics
  const stats = {
    total: entries.length,
    by_type: {},
    by_species: {},
    by_difficulty: {},
    avg_quality: 0,
  }

  entries.forEach((e) => {
    // Count by type
    stats.by_type[e.content_type] = (stats.by_type[e.content_type] || 0) + 1

    // Count by difficulty
    stats.by_difficulty[e.difficulty] =
      (stats.by_difficulty[e.difficulty] || 0) + 1

    // Count by species
    e.especies.forEach((sp) => {
      stats.by_species[sp] = (stats.by_species[sp] || 0) + 1
    })

    // Sum quality
    stats.avg_quality += e.quality_score
  })

  stats.avg_quality = (stats.avg_quality / entries.length).toFixed(2)

  // Build output
  const output = {
    source: bookInfo,
    language: rawData.detected_language || 'en',
    total_entries: entries.length,
    entries: entries,
    statistics: stats,
    extraction_metadata: {
      extracted_at: new Date().toISOString(),
      source_file: path.basename(jsonFilePath),
      metadata_version: metadata.metadata.version,
      total_species_detected: Object.keys(stats.by_species).length,
      extraction_method: 'thorough-script-v1',
    },
  }

  // Save output
  const outputPath = jsonFilePath.replace('.json', '.extracted.json')
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2))

  // Print statistics
  console.log(`\n${'='.repeat(80)}`)
  console.log('📊 EXTRACTION STATISTICS')
  console.log('='.repeat(80))
  console.log(`Total entries: ${stats.total}`)
  console.log(`Average quality score: ${stats.avg_quality}/100`)
  console.log(`\nBy content type:`)
  Object.entries(stats.by_type).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`)
  })
  console.log(`\nBy difficulty:`)
  Object.entries(stats.by_difficulty).forEach(([diff, count]) => {
    console.log(`  ${diff}: ${count}`)
  })
  console.log(`\nTop species detected:`)
  Object.entries(stats.by_species)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([species, count]) => {
      console.log(`  ${species}: ${count}`)
    })
  console.log(`\n✅ Saved to: ${outputPath}`)
  console.log('='.repeat(80))

  return output
}

// ============================================================================
// PROCESS ALL FILES
// ============================================================================
function processAllFiles() {
  const contentDir = './content-data'
  const files = fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith('.json') && !f.endsWith('.extracted.json'))

  console.log(`\n🔍 Found ${files.length} files to process\n`)

  const results = []

  files.forEach((file) => {
    try {
      const result = extractContent(path.join(contentDir, file))
      results.push(result)
    } catch (error) {
      console.error(`\n❌ Error processing ${file}:`, error.message)
      console.error(error.stack)
    }
  })

  console.log(`\n\n${'='.repeat(80)}`)
  console.log('🎉 ALL FILES PROCESSED')
  console.log('='.repeat(80))
  console.log(`Total files: ${results.length}`)
  console.log(
    `Total entries extracted: ${results.reduce(
      (sum, r) => sum + r.total_entries,
      0
    )}`
  )
  console.log('='.repeat(80))
}

// ============================================================================
// RUN
// ============================================================================
if (require.main === module) {
  const args = process.argv.slice(2)

  if (args.length > 0) {
    // Process single file
    extractContent(args[0])
  } else {
    // Process all files
    processAllFiles()
  }
}

module.exports = {
  extractContent,
  processEntry,
  detectSpecies,
  getSpeciesInfo,
  detectCookingMethod,
  detectDifficulty,
  generateTags,
}
