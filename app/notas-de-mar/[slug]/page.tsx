import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
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

  const images: { url: string; caption?: string }[] = nota.images || []
  const sections = nota.content.split(/(?=^## )/m)

  return (
    <div className="bg-[#F8F9FB] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 pt-6">
        <Link
          href="/#notas-de-mar"
          className="inline-flex items-center gap-2 text-[#2B2E78] hover:text-[#4DA8DA] text-sm font-semibold transition-colors"
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
          Volver a notas de mar
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 md:py-10">
        {/* ── HEADER CARD ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#E5E7EB] overflow-hidden mb-8">
          {nota.image_url && (
            <div className="w-full bg-[#0d0f2e]">
              <Image
                src={nota.image_url}
                alt={nota.title}
                width={900}
                height={600}
                className="w-full h-auto object-contain"
                priority
                unoptimized
              />
            </div>
          )}

          <div className="p-6 md:p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {(nota as any).category && (
                <span className="bg-[#4DA8DA]/10 text-[#4DA8DA] text-xs font-bold px-3 py-1 rounded-full border border-[#4DA8DA]/20 uppercase tracking-wide">
                  {(nota as any).category}
                </span>
              )}
              {nota.featured_species?.slice(0, 2).map((s, idx) => (
                <span
                  key={idx}
                  className="bg-[#2B2E78]/10 text-[#2B2E78] text-xs font-bold px-3 py-1 rounded-full border border-[#2B2E78]/20"
                >
                  {s.stockProduct}
                </span>
              ))}
            </div>

            <h1 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold text-[#1F2937] leading-tight mb-4">
              {nota.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-[#6B7280]">
              {nota.quality_score && (
                <span className="flex items-center gap-1">
                  <span className="text-yellow-400">⭐</span>
                  <strong className="text-[#1F2937]">
                    {nota.quality_score}
                  </strong>
                  /10
                </span>
              )}
              {(nota as any).source_book && (
                <span className="flex items-center gap-1">
                  <span>📖</span>
                  <span className="italic">{(nota as any).source_book}</span>
                  {(nota as any).source_page && (
                    <span className="text-[#4DA8DA] font-semibold">
                      · p. {(nota as any).source_page}
                    </span>
                  )}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── RESUMEN ── */}
        {(nota as any).resumen && (
          <div className="border-l-4 border-[#4DA8DA] bg-white rounded-r-2xl p-5 mb-8 shadow-sm">
            <p className="text-[#374151] text-lg leading-relaxed font-playfair italic">
              {(nota as any).resumen}
            </p>
          </div>
        )}

        {/* ── MAIN CONTENT WITH INTERCALATED IMAGES ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#E5E7EB] p-6 md:p-10 mb-8">
          {sections.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
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
                    <strong className="font-bold text-[#1F2937]">
                      {children}
                    </strong>
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
                    <blockquote className="border-l-4 border-[#4DA8DA] pl-4 italic text-[#6B7280] my-4">
                      {children}
                    </blockquote>
                  ),
                  hr: () => <hr className="border-[#E5E7EB] my-6" />,
                  a: ({ href, children }) => (
                    <a href={href} className="text-[#4DA8DA] hover:underline">
                      {children}
                    </a>
                  ),
                }}
              >
                {section}
              </ReactMarkdown>

              {images[sectionIdx] && (
                <div className="my-6 rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-sm">
                  <div className="w-full bg-[#0d0f2e]">
                    <Image
                      src={images[sectionIdx].url}
                      alt={
                        images[sectionIdx].caption || `Imagen ${sectionIdx + 1}`
                      }
                      width={900}
                      height={600}
                      className="w-full h-auto object-contain"
                      unoptimized
                    />
                  </div>
                  {images[sectionIdx].caption && (
                    <p className="text-xs text-[#6B7280] p-3 bg-[#F8F9FB] italic text-center">
                      {images[sectionIdx].caption}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── TAGS ── */}
        {(nota as any).tags && (nota as any).tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {((nota as any).tags as string[]).map((tag) => (
              <span
                key={tag}
                className="bg-[#4DA8DA]/10 text-[#4DA8DA] text-xs font-semibold px-3 py-1 rounded-full border border-[#4DA8DA]/20 uppercase"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* ── FEATURED SPECIES ── */}
        {nota.featured_species && nota.featured_species.length > 0 && (
          <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 mb-8 shadow-sm">
            <h2 className="font-playfair text-lg font-bold text-[#2B2E78] mb-4">
              🌊 Especies mencionadas
            </h2>
            {nota.featured_species.map((s, idx) => (
              <span
                key={idx}
                className="bg-[#2B2E78]/10 text-[#2B2E78] text-xs font-bold px-3 py-1 rounded-full border border-[#2B2E78]/20"
              >
                {s.stockProduct}
              </span>
            ))}
          </div>
        )}

        {/* ── SOURCE ── */}
        {(nota as any).source_book && (
          <div className="bg-[#2B2E78]/5 rounded-2xl p-5 border border-[#2B2E78]/10 mb-8">
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

        {/* ── BACK CTA ── */}
        <div className="text-center pt-4">
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
