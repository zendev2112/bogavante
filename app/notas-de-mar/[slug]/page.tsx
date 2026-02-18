import { notFound } from 'next/navigation'
import Image from 'next/image'
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

  if (error || !data) {
    return null
  }

  return data as ContentEntry
}

export default async function NotaDeMarPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const nota = await getContentBySlug('notas_de_mar', slug)

  if (!nota) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{nota.title}</h1>

        {nota.image_url && (
          <div className="relative w-full h-96 mb-8">
            <Image
              src={nota.image_url}
              alt={nota.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none mb-8">{nota.content}</div>

        {nota.featured_species && nota.featured_species.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Especies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nota.featured_species.map((species, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold">{species.stockProduct}</p>
                  <p className="text-sm text-gray-600">{species.categoria}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}
