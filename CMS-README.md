# Bogavante CMS - Content Management System

Complete CMS solution for managing and displaying blog content from seafood/marine content sources.

## Features

### 🎯 CMS Admin Interface

- **Content Management**: Edit, update, and delete articles across all content types
- **Search & Filter**: Find content by title, type, or search term
- **Real-time Stats**: View content counts across categories
- **Quality Scoring**: Track and manage content quality scores
- **Species Tracking**: View and manage featured seafood species
- **Inline Editing**: Edit content directly in the browser

### 📝 Blog Frontend

- **Modern Design**: Beautiful, responsive blog layout
- **Category Pages**: Separate pages for Recetas, Salud, and Notas de Mar
- **Article Pages**: Full article display with related content
- **Species Information**: Featured species with detailed information
- **Source Attribution**: Proper citation of source materials
- **SEO Optimized**: Proper metadata and structured content

## Setup Instructions

### 1. Database Setup

Run the SQL schema in your Supabase dashboard:

```bash
# The schema file is located at:
supabase-schema.sql
```

Go to your Supabase project → SQL Editor → paste the contents of `supabase-schema.sql` and run it.

This will create:

- Three tables: `recetas`, `salud`, `notas_de_mar`
- Indexes for better performance
- Full-text search capabilities
- Row Level Security policies
- Auto-updating timestamps

### 2. Environment Variables

Your `.env.local` should have:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_role_key
```

### 3. Import Content

From the `bogavante-content` folder, run:

```bash
cd ../bogavante-content
npm run export
```

This will import all JSON files from `output/content/` into Supabase.

### 4. Access the CMS

Navigate to:

```
http://localhost:3000/admin/content
```

### 5. View the Blog

Navigate to:

```
http://localhost:3000/blog
```

## CMS Features

### Content List View

- Paginated table with all content
- Filter by content type (Recetas, Salud, Notas de Mar)
- Search by title or content
- Quality score display
- Quick edit and delete actions

### Content Editor

- Edit title and content
- Update quality score
- Add/update image URLs
- View featured species
- Save changes with one click

### Statistics Dashboard

- Total content count
- Breakdown by category
- Real-time updates

## Blog Features

### Main Blog Page (`/blog`)

- Hero section with search
- Category cards
- Grid of latest articles
- Quality score badges
- Featured species tags

### Category Pages (`/blog/[contentType]`)

- Filtered by content type
- Category-specific styling
- List of all articles in category

### Article Pages (`/blog/[contentType]/[slug]`)

- Full article display
- Hero image support
- Featured species cards
- Source attribution
- Related articles

## API Routes

### CMS API

#### GET `/api/cms/content`

Fetch content with filters:

- `page`: Page number
- `pageSize`: Items per page
- `contentType`: Filter by type (recetas, salud, notas_de_mar, all)
- `searchTerm`: Search query

#### PUT `/api/cms/content`

Update content:

```json
{
  "id": "content-id",
  "contentType": "recetas",
  "updates": {
    "title": "New Title",
    "content": "Updated content...",
    "quality_score": 85,
    "image_url": "https://..."
  }
}
```

#### DELETE `/api/cms/content`

Delete content:

```json
{
  "id": "content-id",
  "contentType": "recetas"
}
```

#### GET `/api/cms/stats`

Get content statistics

## Content Types

### Recetas (Recipes)

🍽️ Seafood recipes and cooking instructions

### Salud (Health)

💚 Nutritional information and health benefits

### Notas de Mar (Sea Notes)

🌊 Marine culture, curiosities, and knowledge

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Database**: Supabase (PostgreSQL)
- **UI Components**: Radix UI + Tailwind CSS
- **TypeScript**: Full type safety
- **Server Components**: For optimal performance

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## File Structure

```
app/
├── admin/
│   └── content/
│       └── page.tsx          # CMS Admin Interface
├── api/
│   └── cms/
│       ├── content/
│       │   └── route.ts      # CMS API endpoints
│       └── stats/
│           └── route.ts      # Statistics endpoint
└── blog/
    ├── page.tsx              # Main blog page
    ├── [contentType]/
    │   ├── page.tsx          # Category page
    │   └── [slug]/
    │       └── page.tsx      # Article page

lib/
├── supabase.ts               # Supabase client setup
├── cms-queries.ts            # CMS database queries
└── blog-queries.ts           # Blog frontend queries
```

## Security

- **Row Level Security (RLS)**: Enabled on all tables
- **Public Read**: Only published content is readable
- **Admin Access**: Requires service role key for CMS operations
- **Environment Variables**: Sensitive keys stored securely

## Next Steps

1. **Authentication**: Add admin authentication (Supabase Auth)
2. **Image Upload**: Integrate image upload to Supabase Storage
3. **Rich Text Editor**: Replace textarea with markdown/rich text editor
4. **Preview Mode**: Add draft/preview functionality
5. **SEO**: Add metadata generation for blog posts
6. **Analytics**: Track views and popular content

## Support

For issues or questions, refer to:

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
