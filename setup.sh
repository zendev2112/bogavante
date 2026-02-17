#!/bin/bash

echo "🦞 Bogavante Platform Setup"
echo "============================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the bogavante directory"
    exit 1
fi

echo "📦 Step 1: Installing dependencies..."
npm install

echo ""
echo "📋 Step 2: Environment Check"
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found"
    echo "Creating .env.local template..."
    cat > .env.local << EOL
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here
EOL
    echo "✅ Created .env.local - Please fill in your Supabase credentials"
else
    echo "✅ .env.local exists"
fi

echo ""
echo "📚 Step 3: Database Setup"
echo "Please complete these steps manually:"
echo "1. Go to https://supabase.com/dashboard"
echo "2. Open SQL Editor"
echo "3. Copy and paste the contents of supabase-schema.sql"
echo "4. Execute the SQL"
echo ""
read -p "Press Enter when you've completed the database setup..."

echo ""
echo "📦 Step 4: Content Import (Optional)"
read -p "Do you want to import content now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    if [ -d "../bogavante-content" ]; then
        echo "Importing content..."
        cd ../bogavante-content
        npm install
        npm run export
        cd ../bogavante
        echo "✅ Content imported"
    else
        echo "⚠️  bogavante-content directory not found"
        echo "Please import content manually later with:"
        echo "  cd ../bogavante-content && npm run export"
    fi
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Next steps:"
echo "1. Verify your .env.local has the correct Supabase credentials"
echo "2. Run: npm run dev"
echo "3. Visit http://localhost:3000/admin/dashboard"
echo ""
echo "📖 For more information, see README.md"
