import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { getNotaBySlug } from '@/lib/queries'
import { ArrowLeft, Calendar, BookOpen, Award, Fish } from 'lucide-react'

export const revalidate = 3600

interface Props {
  params: Promise<{
    slug: string
  }>
}

export default async function NotaPage({ params }: Props) {
  const { slug } = await params
  const nota = await getNotaBySlug(slug)

  if (!nota) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Image */}
      <div className="relative h-96 bg-gradient-to-br from-cyan-500 to-cyan-700">
        {nota.image_url ? (
          <Image
            src={nota.image_url}
            alt={nota.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Fish className="h-32 w-32 text-white/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-8 left-8">
          <Link href="/#notas-de-mar">
            <Button variant="secondary" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Notas de Mar
            </Button>
          </Link>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto max-w-4xl">
            <Badge className="bg-cyan-600 text-white mb-4">
              🌊 Nota de Mar
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {nota.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-4xl px-4 py-12">
        {/* Meta Information */}
        <div className="flex flex-wrap gap-6 mb-8 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {new Date(nota.created_at).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Calidad: {nota.quality_score}/100
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            {nota.source_book}
          </div>
        </div>

        {/* Featured Species */}
        {nota.featured_species && nota.featured_species.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Especies Mencionadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {nota.featured_species.map((species: any, idx: number) => (
                  <Badge key={idx} variant="secondary">
                    {species.stockProduct}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Separator className="my-8" />

        {/* Article Content */}
        <article className="prose prose-lg max-w-none">
          <div className="whitespace-pre-line text-gray-800 leading-relaxed">
            {nota.content}
          </div>
        </article>

        <Separator className="my-12" />

        {/* Source Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Fuente</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600 space-y-2">
            <p>
              <span className="font-medium">Libro:</span> {nota.source_book}
            </p>
            {nota.source_authors && nota.source_authors.length > 0 && (
              <p>
                <span className="font-medium">Autores:</span>{' '}
                {nota.source_authors.join(', ')}
              </p>
            )}
            <p>
              <span className="font-medium">Editorial:</span>{' '}
              {nota.source_publisher}
            </p>
            <p>
              <span className="font-medium">Año:</span> {nota.source_year}
            </p>
            {nota.source_page && (
              <p>
                <span className="font-medium">Página:</span> {nota.source_page}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
