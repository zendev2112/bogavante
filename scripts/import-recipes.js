const { createClient } = require('@supabase/supabase-js')
const recipesBook = require('../bogavante-stock/200 platos de pescado y marisco (200 Recetas) (Spanish -- Charman, Gee -- 1a ed_ en lengua española, Barcelona [Spain, 2011, ©2010 -- Blume.json')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// Helper: Create URL-friendly slug
function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Helper: Extract servings from text
function extractServings(text) {
  const match = text.match(/(\d+)\s*(racion|persona|comensa|porcion)/i)
  return match ? parseInt(match[1]) : 4
}

// Helper: Normalize difficulty
function normalizeDifficulty(diff) {
  if (!diff) return 'facil'
  const lower = diff.toLowerCase()
  if (lower.includes('medio') || lower.includes('intermedio')) return 'medio'
  if (lower.includes('avanzado') || lower.includes('dificil')) return 'avanzado'
  return 'facil'
}

// Helper: Find matching products in database
async function findMatchingProducts(ingredientText) {
  // Search products that match the ingredient text
  const { data, error } = await supabase
    .from('products')
    .select('id, producto, categoria, presentacion')
    .ilike('producto', `%${ingredientText}%`)
    .limit(5)

  if (error) {
    console.error('Error searching products:', error)
    return []
  }

  return data || []
}

async function importRecipes() {
  console.log(
    `\n📖 Starting import of ${recipesBook.recipes.length} recipes...`
  )

  let imported = 0
  let skipped = 0
  let ingredientsLinked = 0

  for (const recipe of recipesBook.recipes) {
    // Skip recipes with bad extraction
    if (
      recipe.title.length < 10 ||
      recipe.title.includes('Se puede') ||
      recipe.title.includes('Para preparar') ||
      recipe.title.includes('Ponga')
    ) {
      skipped++
      continue
    }

    try {
      const slug = slugify(recipe.title)

      // Check if recipe already exists
      const { data: existing } = await supabase
        .from('recipes')
        .select('id')
        .eq('slug', slug)
        .single()

      if (existing) {
        console.log(`⚠️  Recipe already exists: ${recipe.title}`)
        skipped++
        continue
      }

      // Insert recipe
      const { data: recipeData, error: recipeError } = await supabase
        .from('recipes')
        .insert({
          title: recipe.title.trim(),
          slug: slug,
          difficulty: normalizeDifficulty(recipe.difficulty),
          prep_time: recipe.prep_time || 'No especificado',
          servings: extractServings(recipe.full_text),
          source_book: '200 platos de pescado y marisco',
          source_page: recipe.page,
          full_text: recipe.full_text,
        })
        .select()
        .single()

      if (recipeError) {
        console.error(
          `❌ Error inserting recipe "${recipe.title}":`,
          recipeError.message
        )
        continue
      }

      // Link ingredients to products
      const ingredients = recipe.ingredients || []

      for (const ingredientText of ingredients) {
        if (!ingredientText || ingredientText.length < 5) continue

        // Try to find matching products
        const matchedProducts = await findMatchingProducts(
          ingredientText.trim()
        )

        const { error: ingredientError } = await supabase
          .from('recipe_ingredients')
          .insert({
            recipe_id: recipeData.id,
            ingredient_text: ingredientText.trim(),
            product_id:
              matchedProducts.length > 0 ? matchedProducts[0].id : null,
          })

        if (!ingredientError && matchedProducts.length > 0) {
          ingredientsLinked++
        }
      }

      imported++
      console.log(
        `✅ ${imported}: ${recipe.title} (${ingredients.length} ingredients)`
      )
    } catch (error) {
      console.error(
        `❌ Error processing recipe "${recipe.title}":`,
        error.message
      )
    }
  }

  console.log(`\n🎉 Recipe import complete!`)
  console.log(`✅ Successfully imported: ${imported} recipes`)
  console.log(`🔗 Ingredients linked to products: ${ingredientsLinked}`)
  console.log(`⚠️  Skipped: ${skipped} recipes`)
}

importRecipes().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
