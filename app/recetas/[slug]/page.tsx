import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getContentBySlug } from '@/lib/cms-queries'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, ChefHat } from 'lucide-react'

export default async function RecetaPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const receta = await getContentBySlug('recetas', slug)

  if (!receta) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{receta.title}</h1>
          {receta.resumen && (
            <p className="text-xl text-muted-foreground mb-6">
              {receta.resumen}
            </p>
          )}

          {/* Recipe Meta */}
          <div className="flex flex-wrap gap-4 mb-6">
            {receta.preparation_time && (
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{receta.preparation_time} min</span>
              </div>
            )}
            {receta.difficulty && (
              <div className="flex items-center gap-2">
                <ChefHat className="h-5 w-5" />
                <span>{receta.difficulty}</span>
              </div>
            )}
            {receta.cooking_method && (
              <Badge variant="outline">{receta.cooking_method}</Badge>
            )}
          </div>

          {/* Featured Species */}
          {receta.featured_species && receta.featured_species.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {receta.featured_species.map((species) => (
                <Badge key={species} variant="secondary">
                  {species}
                </Badge>
              ))}
            </div>
          )}

          {/* Featured Image */}
          {receta.image_url && (
            <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
              <Image
                src={receta.image_url}
                alt={receta.title}
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
            <div dangerouslySetInnerHTML={{ __html: receta.content }} />
          </CardContent>
        </Card>

        {/* Nutritional Info */}
        {receta.nutritional_info && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">
                Información Nutricional
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(receta.nutritional_info).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-2xl font-bold">{String(value)}</div>
                    <div className="text-sm text-muted-foreground">{key}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Metadata */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Información</h2>
            <div className="space-y-2 text-sm">
              {receta.source_book && (
                <p>
                  <span className="font-medium">Fuente:</span>{' '}
                  {receta.source_book}
                </p>
              )}
              {receta.source_authors && (
                <p>
                  <span className="font-medium">Autores:</span>{' '}
                  {receta.source_authors}
                </p>
              )}
              <p>
                <span className="font-medium">Puntuación de calidad:</span>{' '}
                {receta.quality_score}/10
              </p>
            </div>
          </CardContent>
        </Card>
      </article>
    </div>
  )
}
