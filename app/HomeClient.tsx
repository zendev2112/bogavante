'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ContentEntry } from '@/lib/supabase'

interface HomeClientProps {
  recetas: ContentEntry[]
  notasDeMar: ContentEntry[]
  salud: ContentEntry[]
}

type ContentWithType = ContentEntry & {
  type: 'recetas' | 'notas_de_mar' | 'salud'
  slug: string
}

export default function HomeClient({
  recetas,
  notasDeMar,
  salud,
}: HomeClientProps) {
  const [selectedSpecies, setSelectedSpecies] = useState<string>('all')
  const [selectedCookingMethod, setSelectedCookingMethod] =
    useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const cookingMethods = [
    { label: 'Horneado', value: 'horneado', emoji: '🔥' },
    { label: 'Al Vapor', value: 'vapor', emoji: '💨' },
    { label: 'Frito', value: 'frito', emoji: '🍳' },
    { label: 'Hervido', value: 'hervido', emoji: '🌊' },
    { label: 'A la Parrilla', value: 'parrilla', emoji: '🔥' },
    { label: 'Ahumado', value: 'ahumado', emoji: '🚬' },
    { label: 'Crudo', value: 'crudo', emoji: '🥢' },
    { label: 'Encurtido', value: 'encurtido', emoji: '🥒' },
    { label: 'Mixto', value: 'mixto', emoji: '🍲' },
  ]

  // Combine all entries with their type
  const allEntries: ContentWithType[] = [
    ...recetas.map((r) => ({ ...r, type: 'recetas' as const, slug: r.slug })),
    ...notasDeMar.map((n) => ({
      ...n,
      type: 'notas_de_mar' as const,
      slug: n.slug,
    })),
    ...salud.map((s) => ({ ...s, type: 'salud' as const, slug: s.slug })),
  ]

  // Get unique species from all entries
  const allSpecies = Array.from(
    new Set(
      allEntries.flatMap((entry) =>
        (entry.featured_species || []).map((s) =>
          typeof s === 'string' ? s : s.stockProduct,
        ),
      ),
    ),
  ).sort()

  // Filter by selected species and cooking method
  let filteredEntries = allEntries

  if (selectedSpecies !== 'all') {
    filteredEntries = filteredEntries.filter((entry) =>
      hasSpecies(entry, selectedSpecies),
    )
  }

  if (selectedCookingMethod !== 'all') {
    filteredEntries = filteredEntries.filter(
      (entry) =>
        entry.type === 'recetas' &&
        entry.cooking_method
          ?.toLowerCase()
          .includes(selectedCookingMethod.toLowerCase()),
    )
  }

  // Pagination
  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedEntries = filteredEntries.slice(
    startIndex,
    startIndex + itemsPerPage,
  )

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedSpecies, selectedCookingMethod])

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'recetas':
        return 'Receta'
      case 'notas_de_mar':
        return 'Nota de Mar'
      case 'salud':
        return 'Salud'
      default:
        return type
    }
  }

  const getTypeUrl = (type: string, slug: string) => {
    switch (type) {
      case 'recetas':
        return `/recetas/${slug}`
      case 'notas_de_mar':
        return `/notas-de-mar/${slug}`
      case 'salud':
        return `/salud/${slug}`
      default:
        return '/'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Cooking Method Filter */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          Filtrar por Método de Cocción
        </h2>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCookingMethod === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedCookingMethod('all')}
          >
            Todos
          </Button>
          {cookingMethods.map((method) => (
            <Button
              key={method.value}
              variant={
                selectedCookingMethod === method.value ? 'default' : 'outline'
              }
              onClick={() => setSelectedCookingMethod(method.value)}
            >
              {method.emoji} {method.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Species Filter */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Filtrar por Especie</h2>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedSpecies === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedSpecies('all')}
          >
            Todas
          </Button>
          {allSpecies.map((species) => (
            <Button
              key={species}
              variant={selectedSpecies === species ? 'default' : 'outline'}
              onClick={() => setSelectedSpecies(species)}
            >
              {species}
            </Button>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {paginatedEntries.map((entry) => (
          <Card key={`${entry.type}-${entry.id}`} className="overflow-hidden">
            <Link href={getTypeUrl(entry.type, entry.slug)}>
              {entry.image_url && (
                <div className="relative h-48 w-full">
                  <Image
                    src={entry.image_url}
                    alt={entry.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground mb-2">
                  {getTypeLabel(entry.type)}
                </div>
                <h3 className="text-xl font-semibold mb-2">{entry.title}</h3>
                {entry.resumen && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {entry.resumen}
                  </p>
                )}
                {entry.featured_species &&
                  entry.featured_species.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {entry.featured_species.map((species, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                        >
                          {typeof species === 'string'
                            ? species
                            : (species as any).stockProduct}
                        </span>
                      ))}
                    </div>
                  )}
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          <span className="text-sm">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

function hasSpecies(entry: ContentWithType, species: string): boolean {
  return (
    entry.featured_species?.some((s) => {
      const stockProduct = typeof s === 'string' ? s : s.stockProduct
      return stockProduct.toLowerCase() === species.toLowerCase()
    }) ?? false
  )
}
