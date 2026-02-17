import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getContentBySlug } from '@/lib/cms-queries'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function SaludPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const articulo = await getContentBySlug('salud', slug)

  if (!articulo) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{articulo.title}</h1>
          {articulo.resumen && (
            <p className="text-xl text-muted-foreground mb-6">
              {articulo.resumen}
            </p>
          )}

          {/* Featured Species */}
          {articulo.featured_species &&
            articulo.featured_species.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {articulo.featured_species.map((species) => (
                  <Badge key={species} variant="secondary">
                    {species}
                  </Badge>
                ))}
              </div>
            )}

          {/* Featured Image */}
          {articulo.image_url && (
            <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
              <Image
                src={articulo.image_url}
                alt={articulo.title}
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
            <div dangerouslySetInnerHTML={{ __html: articulo.content }} />
          </CardContent>
        </Card>

        {/* Metadata */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Información</h2>
            <div className="space-y-2 text-sm">
              {articulo.source_book && (
                <p>
                  <span className="font-medium">Fuente:</span>{' '}
                  {articulo.source_book}
                </p>
              )}
              {articulo.source_authors && (
                <p>
                  <span className="font-medium">Autores:</span>{' '}
                  {articulo.source_authors}
                </p>
              )}
              <p>
                <span className="font-medium">Puntuación de calidad:</span>{' '}
                {articulo.quality_score}/10
              </p>
            </div>
          </CardContent>
        </Card>
      </article>
    </div>
  )
}
