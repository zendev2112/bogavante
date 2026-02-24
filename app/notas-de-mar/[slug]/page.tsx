import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
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

export default async function NotaDeMarPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const nota = await getContentBySlug('notas_de_mar', slug)

  if (!nota) notFound()

  return (
    <div className="bg-[#F8F9FB] min-h-screen">
      {/* ── HERO IMAGE ───────────────────────────────────────── */}
      <div className="relative w-full h-[55vw] max-h-[520px] min-h-[260px] bg-[#0d0f2e]">
        {nota.image_url ? (
          <Image
            src={nota.image_url}
            alt={nota.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#2B2E78] to-[#4DA8DA]/60 flex items-center justify-center text-8xl">
            🌊
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f2e] via-[#0d0f2e]/30 to-transparent" />

        {/* Back button */}
        <div className="absolute top-4 left-4 z-10">
          <Link
            href="/#notas-de-mar"
            className="inline-flex items-center gap-2 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full transition-all"
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
            Volver
          </Link>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-3">
              {(nota as any).category && (
                <span className="bg-[#4DA8DA]/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  {(nota as any).category}
                </span>
              )}
              {nota.featured_species?.slice(0, 2).map((s, idx) => (
                <span
                  key={idx}
                  className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full"
                >
                  {s.stockProduct}
                </span>
              ))}
            </div>
            <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight drop-shadow-lg">
              {nota.title}
            </h1>
          </div>
        </div>
      </div>

      {/* ── CONTENT ──────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        {/* Meta bar */}
        {((nota as any).source_book || nota.quality_score) && (
          <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-[#E5E7EB]">
            {nota.quality_score && (
              <div className="flex items-center gap-1.5 text-sm text-[#6B7280]">
                <span className="text-yellow-400">⭐</span>
                <span className="font-semibold text-[#1F2937]">
                  {nota.quality_score}
                </span>
                <span>/ 10</span>
              </div>
            )}
            {(nota as any).source_book && (
              <div className="flex items-center gap-1.5 text-sm text-[#6B7280]">
                <span>📖</span>
                <span className="italic">{(nota as any).source_book}</span>
                {(nota as any).source_page && (
                  <span className="text-[#4DA8DA] font-semibold">
                    · p. {(nota as any).source_page}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Resumen */}
        {(nota as any).resumen && (
          <div className="bg-white border-l-4 border-[#4DA8DA] rounded-r-2xl p-5 mb-8 shadow-sm">
            <p className="text-[#374151] text-lg leading-relaxed font-playfair italic">
              {(nota as any).resumen}
            </p>
          </div>
        )}

        {/* Main content */}
        <div
          className="prose prose-lg max-w-none
          prose-headings:font-playfair prose-headings:text-[#2B2E78]
          prose-p:text-[#374151] prose-p:leading-relaxed
          prose-strong:text-[#1F2937]
          prose-a:text-[#4DA8DA] prose-a:no-underline hover:prose-a:underline
          prose-li:text-[#374151]
          mb-10"
        >
          {nota.content}
        </div>

        {/* Featured species */}
        {nota.featured_species && nota.featured_species.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 mb-8 shadow-sm">
            <h2 className="font-playfair text-xl font-bold text-[#2B2E78] mb-4">
              🌊 Especies mencionadas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {nota.featured_species.map((species, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-[#F8F9FB] rounded-xl p-3 border border-[#E5E7EB]"
                >
                  <span className="w-2 h-2 rounded-full bg-[#4DA8DA] flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#1F2937] text-sm">
                      {species.stockProduct}
                    </p>
                    {species.categoria && (
                      <p className="text-xs text-[#6B7280]">
                        {species.categoria}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Source */}
        {(nota as any).source_book && (
          <div className="bg-[#2B2E78]/5 rounded-2xl p-5 border border-[#2B2E78]/10">
            <p className="text-xs font-bold uppercase tracking-widest text-[#2B2E78] mb-2">
              Fuente
            </p>
            <p className="text-[#374151] font-playfair italic">
              {(nota as any).source_book}
            </p>
            {(nota as any).source_authors && (
              <p className="text-sm text-[#6B7280] mt-1">
                {(nota as any).source_authors}
              </p>
            )}
            {(nota as any).source_page && (
              <p className="text-sm text-[#4DA8DA] font-semibold mt-1">
                Página {(nota as any).source_page}
              </p>
            )}
          </div>
        )}

        {/* Back CTA */}
        <div className="mt-12 pt-8 border-t border-[#E5E7EB] text-center">
          <Link
            href="/#notas-de-mar"
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
            Ver más notas
          </Link>
        </div>
      </div>
    </div>
  )
}
