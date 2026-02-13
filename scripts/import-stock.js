const { createClient } = require('@supabase/supabase-js')
const stockData = require('../bogavante-stock/stock.json')
const path = require('path')

// Load environment variables from .env.local
require('dotenv').config({ path: path.join(__dirname, '../.env.local') })

// Debug: Check if env vars are loaded
console.log('🔍 Checking environment variables...')
console.log(
  'SUPABASE_URL:',
  process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Loaded' : '❌ Missing'
)
console.log(
  'SERVICE_KEY:',
  process.env.SUPABASE_SERVICE_KEY ? '✅ Loaded' : '❌ Missing'
)

if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.SUPABASE_SERVICE_KEY
) {
  console.error('\n❌ Error: Environment variables not loaded!')
  console.error('Make sure .env.local exists in the root directory')
  process.exit(1)
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

async function importStock() {
  console.log(`\n📦 Starting import of ${stockData.length} products...`)

  // Supabase has a limit of 1000 rows per insert, so batch them
  const batchSize = 1000
  let imported = 0
  let errors = 0

  for (let i = 0; i < stockData.length; i += batchSize) {
    const batch = stockData.slice(i, i + batchSize)

    console.log(`\n🔄 Processing batch ${Math.floor(i / batchSize) + 1}...`)

    const { data, error } = await supabase
      .from('products')
      .insert(batch)
      .select()

    if (error) {
      console.error('❌ Error importing batch:', error.message)
      console.error('Error details:', error)
      errors++
      continue
    }

    imported += data.length
    console.log(`✅ Imported ${imported}/${stockData.length} products`)
  }

  console.log(`\n🎉 Import complete!`)
  console.log(`✅ Successfully imported: ${imported} products`)
  if (errors > 0) {
    console.log(`⚠️  Errors: ${errors} batches failed`)
  }
}

importStock().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
