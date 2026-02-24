import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { supabase } from '@/lib/supabase'
import type { ContentEntry } from '@/lib/supabase'

async function getContentBySlug(
  table: string,
  slug: string,
): Promise<ContentEntry | null> {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error || !data) return null
  return data as ContentEntry
}

export default async function RecetaPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const receta = await getContentBySlug('recetas', slug)

  if (!receta) notFound()

  return (
    <div className="bg-[#F8F9FB] min-h-screen">
      {/* ── BACK BUTTON ── */}
      <div className="max-w-3xl mx-auto px-4 pt-6">
        <Link
          href="/#recetas"
          className="inline-flex items-center gap-2 text-[#2B2E78] hover:text-[#00B3A4] text-sm font-semibold transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Volver a recetas
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 md:py-10">
        {/* ── HEADER CARD ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#E5E7EB] overflow-hidden mb-8">
          {/* Image - fixed compact height */}
          {receta.image_url && (
            <div className="relative w-full h-48 sm:h-64 bg-[#0d0f2e]">
              <Image
                src={receta.image_url}
                alt={receta.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          )}

          {/* Title block */}
          <div className="p-6 md:p-8">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {(receta as any).cooking_method && (
                <span className="bg-[#E23C4B]/10 text-[#E23C4B] text-xs font-bold px-3 py-1 rounded-full border border-[#E23C4B]/20">
                  {(receta as any).cooking_method}
                </span>
              )}
              {receta.featured_species?.slice(0, 3).map((s, idx) => (
                <span
                  key={idx}
                  className="bg-[#00B3A4]/10 text-[#00B3A4] text-xs font-bold px-3 py-1 rounded-full border border-[#00B3A4]/20"
                >
                  {s.stockProduct}
                </span>
              ))}
            </div>

            <h1 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold text-[#1F2937] leading-tight mb-4">
              {receta.title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#6B7280]">
              {receta.quality_score && (
                <span className="flex items-center gap-1">
                  <span className="text-yellow-400">⭐</span>
                  <strong className="text-[#1F2937]">
                    {receta.quality_score}
                  </strong>
                  /10
                </span>
              )}
              {(receta as any).source_book && (
                <span className="flex items-center gap-1">
                  <span>📖</span>
                  <span className="italic">{(receta as any).source_book}</span>
                  {(receta as any).source_page && (
                    <span className="text-[#00B3A4] font-semibold">
                      · p. {(receta as any).source_page}
                    </span>
                  )}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── RESUMEN ── */}
        {(receta as any).resumen && (
          <div className="border-l-4 border-[#00B3A4] bg-white rounded-r-2xl p-5 mb-8 shadow-sm">
            <p className="text-[#374151] text-lg leading-relaxed font-playfair italic">
              {(receta as any).resumen}
            </p>
          </div>
        )}

        {/* ── MAIN CONTENT (Markdown) ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#E5E7EB] p-6 md:p-10 mb-8">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="font-playfair text-2xl font-bold text-[#2B2E78] mt-8 mb-4 first:mt-0">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="font-playfair text-xl font-bold text-[#2B2E78] mt-7 mb-3">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="font-playfair text-lg font-semibold text-[#2B2E78] mt-6 mb-2">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-[#374151] leading-relaxed mb-4">
                  {children}
                </p>
              ),
              strong: ({ children }) => (
                <strong className="font-bold text-[#1F2937]">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="italic text-[#4B5563]">{children}</em>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside space-y-1 mb-4 text-[#374151]">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside space-y-1 mb-4 text-[#374151]">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-[#374151] ml-2">{children}</li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-[#00B3A4] pl-4 italic text-[#6B7280] my-4">
                  {children}
                </blockquote>
              ),
              hr: () => <hr className="border-[#E5E7EB] my-6" />,
              a: ({ href, children }) => (
                <a href={href} className="text-[#00B3A4] hover:underline">
                  {children}
                </a>
              ),
            }}
          >
            {receta.content}
          </ReactMarkdown>
        </div>

        {/* ── FEATURED SPECIES ── */}
        {receta.featured_species && receta.featured_species.length > 0 && (
          <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 mb-8 shadow-sm">
            <h2 className="font-playfair text-lg font-bold text-[#2B2E78] mb-4">
              🐟 Especies en esta receta
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {receta.featured_species.map((species, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-[#F8F9FB] rounded-xl p-3 border border-[#E5E7EB]"
                >
                  <span className="w-2 h-2 rounded-full bg-[#00B3A4] flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#1F2937] text-xs">
                      {species.stockProduct}
                    </p>
                    {species.categoria && (
                      <p className="text-xs text-[#9CA3AF]">
                        {species.categoria}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SOURCE ── */}
        {(receta as any).source_book && (
          <div className="bg-[#2B2E78]/5 rounded-2xl p-5 border border-[#2B2E78]/10 mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-[#2B2E78] mb-2">
              Fuente
            </p>
            <p className="text-[#374151] font-playfair italic">
              {(receta as any).source_book}
            </p>
            {(receta as any).source_authors && (
              <p className="text-sm text-[#6B7280] mt-1">
                {(receta as any).source_authors}
              </p>
            )}
            {(receta as any).source_page && (
              <p className="text-sm text-[#00B3A4] font-semibold mt-1">
                Página {(receta as any).source_page}
              </p>
            )}
          </div>
        )}

        {/* ── BACK CTA ── */}
        <div className="text-center pt-4">
          <Link
            href="/#recetas"
            className="inline-flex items-center gap-2 bg-[#2B2E78] hover:bg-[#1e2160] text-white font-semibold px-8 py-3 rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Ver más recetas
          </Link>
        </div>
      </div>
    </div>
  )
}
