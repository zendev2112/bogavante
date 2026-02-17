import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  getBlogPostBySlug,
  getAllBlogPosts,
  getContentTypeLabel,
  getContentTypeColor,
} from '@/lib/blog-queries'
import { ContentType } from '@/lib/cms-queries'
import { ArrowLeft, Calendar, BookOpen, Award, Fish } from 'lucide-react'

export const revalidate = 3600

interface Props {
  params: Promise<{
    contentType: ContentType
    slug: string
  }>
}

export default async function BlogPostPage({ params }: Props) {
  const { contentType, slug } = await params
  const post = await getBlogPostBySlug(slug, contentType)

  if (!post) {
    notFound()
  }

  // Get related posts
  const relatedPosts = await getAllBlogPosts({ limit: 3, contentType })
  const filteredRelated = relatedPosts
    .filter((p) => p.id !== post.id)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Image */}
      <div className="relative h-96 bg-gradient-to-br from-blue-500 to-blue-700">
        {post.image_url ? (
          <Image
            src={post.image_url}
            alt={post.title}
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
          <Link href="/blog">
            <Button variant="secondary" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Blog
            </Button>
          </Link>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto max-w-4xl">
            <Badge
              className={`${getContentTypeColor(post.contentType)} text-white mb-4`}
            >
              {getContentTypeLabel(post.contentType)}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {post.title}
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
            {new Date(post.created_at).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Calidad: {post.quality_score}/100
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            {post.source_book}
          </div>
        </div>

        {/* Featured Species */}
        {post.featured_species && post.featured_species.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Especies Destacadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {post.featured_species.map((species, idx) => (
                  <div
                    key={idx}
                    className="border rounded-lg p-4 hover:border-blue-500 transition-colors"
                  >
                    <h3 className="font-semibold text-lg mb-2">
                      {species.stockProduct}
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <span className="font-medium">Categoría:</span>{' '}
                        {species.categoria}
                      </p>
                      <p>
                        <span className="font-medium">Subcategoría:</span>{' '}
                        {species.subcategoria}
                      </p>
                      {species.presentations &&
                        species.presentations.length > 0 && (
                          <div className="mt-2">
                            <p className="font-medium mb-1">Presentaciones:</p>
                            <div className="flex flex-wrap gap-1">
                              {species.presentations
                                .slice(0, 3)
                                .map((pres, i) => (
                                  <Badge
                                    key={i}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {pres}
                                  </Badge>
                                ))}
                              {species.presentations.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{species.presentations.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Separator className="my-8" />

        {/* Article Content */}
        <article className="prose prose-lg max-w-none">
          <div className="whitespace-pre-line text-gray-800 leading-relaxed">
            {post.content}
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
              <span className="font-medium">Libro:</span> {post.source_book}
            </p>
            {post.source_authors && post.source_authors.length > 0 && (
              <p>
                <span className="font-medium">Autores:</span>{' '}
                {post.source_authors.join(', ')}
              </p>
            )}
            <p>
              <span className="font-medium">Editorial:</span>{' '}
              {post.source_publisher}
            </p>
            <p>
              <span className="font-medium">Año:</span> {post.source_year}
            </p>
            {post.source_page && (
              <p>
                <span className="font-medium">Página:</span> {post.source_page}
              </p>
            )}
            <p>
              <span className="font-medium">Idioma:</span>{' '}
              {post.language === 'es' ? 'Español' : post.language}
            </p>
          </CardContent>
        </Card>

        {/* Related Posts */}
        {filteredRelated.length > 0 && (
          <>
            <Separator className="my-12" />
            <div>
              <h2 className="text-2xl font-bold mb-6">
                Artículos Relacionados
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredRelated.map((related) => (
                  <Link
                    key={related.id}
                    href={`/blog/${related.contentType}/${related.slug}`}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="relative h-32 bg-gradient-to-br from-blue-400 to-blue-600">
                        {related.image_url ? (
                          <Image
                            src={related.image_url}
                            alt={related.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Fish className="h-12 w-12 text-white/30" />
                          </div>
                        )}
                      </div>
                      <CardHeader>
                        <CardTitle className="text-base line-clamp-2">
                          {related.title}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
