# Bogavante Platform - Complete Documentation

## 🎯 Overview

Bogavante is a comprehensive platform for managing and publishing seafood-related content with an integrated inventory management system.

## 📁 Project Structure

```
bogavante/
├── app/
│   ├── admin/
│   │   ├── dashboard/      # Admin home with links to all admin features
│   │   ├── content/        # CMS for managing articles
│   │   └── page.tsx        # Stock management (moved to /admin for consistency)
│   ├── blog/
│   │   ├── page.tsx                    # Main blog page
│   │   ├── [contentType]/
│   │   │   ├── page.tsx                # Category pages
│   │   │   └── [slug]/
│   │   │       └── page.tsx            # Individual article pages
│   ├── api/
│   │   └── cms/
│   │       ├── content/route.ts        # CMS API endpoints
│   │       └── stats/route.ts          # Statistics endpoint
│   └── ...
├── lib/
│   ├── supabase.ts         # Supabase client configuration
│   ├── cms-queries.ts      # CMS database queries
│   ├── blog-queries.ts     # Public blog queries
│   └── queries.ts          # General queries
├── supabase-schema.sql     # Database schema
└── CMS-README.md          # CMS-specific documentation

bogavante-content/
├── output/content/         # Parsed JSON content files
├── parse-content.ts        # Content parser script
└── export-to-supabase.ts   # Database export script
```

## 🚀 Quick Start

### 1. Setup Database

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Open SQL Editor
3. Copy and paste contents from `supabase-schema.sql`
4. Execute the SQL

This creates:

- Three content tables: `recetas`, `salud`, `notas_de_mar`
- Indexes for performance
- Full-text search
- Row Level Security

### 2. Configure Environment

Ensure `.env.local` has:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_role_key
```

### 3. Import Content

```bash
cd bogavante-content
npm run export
```

### 4. Run Development Server

```bash
cd bogavante
npm run dev
```

Visit:

- **Admin Dashboard**: http://localhost:3000/admin/dashboard
- **Content CMS**: http://localhost:3000/admin/content
- **Stock Management**: http://localhost:3000/admin
- **Public Blog**: http://localhost:3000/blog

## 🎨 Features

### Content Management System (CMS)

**Location**: `/admin/content`

Features:

- ✅ View all content from all categories
- ✅ Search and filter content
- ✅ Edit articles inline
- ✅ Update quality scores
- ✅ Manage images
- ✅ Delete content
- ✅ Real-time statistics

### Blog Frontend

**Locations**:

- Main: `/blog`
- Categories: `/blog/recetas`, `/blog/salud`, `/blog/notas-de-mar`
- Articles: `/blog/[contentType]/[slug]`

Features:

- ✅ Beautiful modern design
- ✅ Category filtering
- ✅ Featured species tags
- ✅ Quality score badges
- ✅ Related articles
- ✅ Source attribution
- ✅ Responsive layout

### Stock Management

**Location**: `/admin`

Features:

- ✅ Product inventory management
- ✅ Category filtering
- ✅ Price and availability tracking
- ✅ Multiple presentations per product

## 📊 Content Types

### 🍽️ Recetas (Recipes)

Seafood recipes and cooking instructions from various culinary sources.

### 💚 Salud (Health)

Nutritional information, health benefits, and scientific data about seafood.

### 🌊 Notas de Mar (Sea Notes)

Marine culture, curiosities, species information, and oceanic knowledge.

## 🔧 Technical Details

### Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **UI**: Radix UI + Tailwind CSS
- **Rendering**: Server Components + Client Components

### API Routes

#### CMS Content

- `GET /api/cms/content` - Fetch content with filters
- `PUT /api/cms/content` - Update content
- `DELETE /api/cms/content` - Delete content

#### CMS Stats

- `GET /api/cms/stats` - Get content statistics

### Database Schema

Each content table has:

- `id` (TEXT, Primary Key)
- `title` (TEXT)
- `slug` (TEXT, Unique)
- `content` (TEXT)
- `quality_score` (INTEGER)
- `image_url` (TEXT, nullable)
- `featured_species` (JSONB)
- `source_*` fields (book, authors, publisher, year, page)
- `language` (TEXT, default 'es')
- `published` (BOOLEAN, default true)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

## 🔒 Security

- **Row Level Security (RLS)**: Enabled on all tables
- **Public Access**: Read-only for published content
- **Admin Access**: Requires `SUPABASE_SERVICE_KEY`
- **Environment Variables**: Sensitive keys in `.env.local`

## 📝 Workflows

### Adding New Content

1. Add JSON files to `bogavante-content/output/content/[type]/`
2. Run `npm run export` in `bogavante-content`
3. Content appears automatically in CMS and blog

### Editing Content

1. Go to `/admin/content`
2. Find the article (search/filter)
3. Click edit button
4. Make changes
5. Save

### Publishing Flow

Currently, all content is auto-published. To add draft support:

1. Add `published` column check in queries
2. Add publish/unpublish button in CMS
3. Filter unpublished content in blog queries

## 🎯 Next Steps

### Immediate

- [ ] Add admin authentication
- [ ] Add image upload to Supabase Storage
- [ ] Add markdown editor for content
- [ ] Add draft/publish workflow

### Future Enhancements

- [ ] SEO metadata generation
- [ ] Social media sharing
- [ ] Analytics integration
- [ ] Comment system
- [ ] Newsletter integration
- [ ] Advanced search with filters
- [ ] Content tagging system
- [ ] Multi-language support

## 📖 Usage Guide

### For Content Editors

1. **Access the CMS**
   - Navigate to `/admin/dashboard`
   - Click "CMS de Contenido"

2. **Find Content**
   - Use search bar for keywords
   - Filter by type (Recetas/Salud/Notas de Mar)
   - Sort by quality score

3. **Edit Content**
   - Click edit button on any article
   - Modify title, content, quality score, or image URL
   - Click "Guardar Cambios"

4. **Delete Content**
   - Click delete button
   - Confirm deletion

### For Developers

1. **Add New Content Type**
   - Create table in Supabase
   - Add type to `ContentType` in `lib/cms-queries.ts`
   - Update queries to include new type
   - Add category info in blog pages

2. **Customize Blog Design**
   - Edit `app/blog/page.tsx` for main page
   - Edit `app/blog/[contentType]/[slug]/page.tsx` for article pages
   - Modify Tailwind classes for styling

3. **Add Features**
   - Create new API routes in `app/api/`
   - Add queries in `lib/`
   - Update UI components

## 🐛 Troubleshooting

### Content not appearing in blog

- Check if content exists in Supabase
- Verify `published` field is true
- Check console for errors
- Verify Supabase connection

### CMS not loading

- Check environment variables
- Verify `SUPABASE_SERVICE_KEY` is correct
- Check browser console for errors
- Verify API routes are accessible

### Export script failing

- Verify Supabase credentials in `bogavante-content/.env`
- Check JSON file format
- Verify internet connection
- Check Supabase logs

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/docs)

## 🤝 Support

For questions or issues, check:

1. This README
2. `CMS-README.md` for CMS-specific info
3. Supabase dashboard logs
4. Browser console errors
