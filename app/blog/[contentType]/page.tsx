import { getAllBlogPosts } from '@/lib/blog-queries'
import { ContentType } from '@/lib/cms-queries'
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Fish, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const revalidate = 3600

interface Props {
  params: Promise<{
    contentType: ContentType
  }>
}

const categoryInfo: Record<
  ContentType,
  { title: string; description: string; emoji: string }
> = {
  recetas: {
    title: 'Recetas de Marisco',
    description: 'Deliciosas recetas con los mejores productos del mar',
    emoji: '🍽️',
  },
  salud: {
    title: 'Salud y Nutrición',
    description:
      'Beneficios nutricionales y consejos de salud sobre el marisco',
    emoji: '💚',
  },
  notas_de_mar: {
    title: 'Notas de Mar',
    description: 'Cultura marina, curiosidades y conocimiento sobre el mar',
    emoji: '🌊',
  },
}

export default async function CategoryPage({ params }: Props) {
  const { contentType } = await params
  const posts = await getAllBlogPosts({ contentType, limit: 50 })
  const info = categoryInfo[contentType]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <Link href="/blog">
            <Button variant="secondary" size="sm" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Blog
            </Button>
          </Link>
          <div className="max-w-3xl">
            <div className="text-6xl mb-4">{info.emoji}</div>
            <h1 className="text-4xl font-bold mb-4">{info.title}</h1>
            <p className="text-xl text-blue-100">{info.description}</p>
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <p className="text-gray-600">
            {posts.length} {posts.length === 1 ? 'artículo' : 'artículos'}{' '}
            encontrados
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No hay artículos en esta categoría todavía
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.contentType}/${post.slug}`}
              >
                <Card className="h-full hover:shadow-xl transition-shadow cursor-pointer group">
                  <div className="relative h-48 bg-gradient-to-br from-blue-400 to-blue-600 overflow-hidden">
                    {post.image_url ? (
                      <Image
                        src={post.image_url}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Fish className="h-16 w-16 text-white/30" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-white/90">
                        ⭐ {post.quality_score}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    {post.featured_species &&
                      post.featured_species.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {post.featured_species
                            .slice(0, 3)
                            .map((species, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs"
                              >
                                {species.stockProduct}
                              </Badge>
                            ))}
                          {post.featured_species.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{post.featured_species.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
