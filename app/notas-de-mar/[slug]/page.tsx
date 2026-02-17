import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getContentBySlug } from '@/lib/cms-queries'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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
      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{nota.title}</h1>
          {nota.resumen && (
            <p className="text-xl text-muted-foreground mb-6">{nota.resumen}</p>
          )}

          {/* Featured Species */}
          {nota.featured_species && nota.featured_species.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {nota.featured_species.map((species, idx) => (
                <Badge key={idx} variant="secondary">
                  {typeof species === 'string' ? species : species.stockProduct}
                </Badge>
              ))}
            </div>
          )}

          {/* Featured Image */}
          {nota.image_url && (
            <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
              <Image
                src={nota.image_url}
                alt={nota.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        </div>

        {/* Content */}
        <Card className="mb-8">
          <CardContent className="prose prose-lg max-w-none pt-6">
            <div dangerouslySetInnerHTML={{ __html: nota.content }} />
          </CardContent>
        </Card>

        {/* Metadata */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Información</h2>
            <div className="space-y-2 text-sm">
              {nota.source_book && (
                <p>
                  <span className="font-medium">Fuente:</span>{' '}
                  {nota.source_book}
                </p>
              )}
              {nota.source_authors && (
                <p>
                  <span className="font-medium">Autores:</span>{' '}
                  {nota.source_authors}
                </p>
              )}
              <p>
                <span className="font-medium">Puntuación de calidad:</span>{' '}
                {nota.quality_score}/10
              </p>
            </div>
          </CardContent>
        </Card>
      </article>
    </div>
  )
}
