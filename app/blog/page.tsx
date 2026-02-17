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
import {
  getAllBlogPosts,
  getContentTypeLabel,
  getContentTypeColor,
} from '@/lib/blog-queries'
import { Search, Fish, Heart, Waves } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export const revalidate = 3600 // Revalidate every hour

export default async function BlogPage() {
  const posts = await getAllBlogPosts({ limit: 24 })

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Blog Bogavante</h1>
            <p className="text-xl text-blue-100 mb-8">
              Descubre el fascinante mundo del marisco, recetas deliciosas y
              consejos de salud
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Buscar artículos..."
                  className="pl-12 py-6 text-lg bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Link href="/blog/recetas">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-orange-500">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Fish className="h-8 w-8 text-orange-500" />
                  <div>
                    <CardTitle>Recetas</CardTitle>
                    <CardDescription>Platos de marisco</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/blog/salud">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-green-500">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Heart className="h-8 w-8 text-green-500" />
                  <div>
                    <CardTitle>Salud</CardTitle>
                    <CardDescription>Beneficios nutricionales</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/blog/notas-de-mar">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-500">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Waves className="h-8 w-8 text-blue-500" />
                  <div>
                    <CardTitle>Notas de Mar</CardTitle>
                    <CardDescription>Cultura marina</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Últimos Artículos</h2>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No hay artículos disponibles
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
                  {/* Image */}
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
                    <div className="absolute top-4 left-4">
                      <Badge
                        className={`${getContentTypeColor(post.contentType)} text-white`}
                      >
                        {getContentTypeLabel(post.contentType)}
                      </Badge>
                    </div>
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
                    {/* Featured Species */}
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
