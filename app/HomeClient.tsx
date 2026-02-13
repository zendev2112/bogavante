'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ContentEntry } from '@/lib/supabase'

// These come from stock.json - the source of truth
const pescados = [
  { value: 'Abadejo', label: 'Abadejo' },
  { value: 'Anchoa de banco', label: 'Anchoa' },
  { value: 'Anchoíta', label: 'Anchoíta' },
  { value: 'Besugo', label: 'Besugo' },
  { value: 'Bonito', label: 'Bonito' },
  { value: 'Brótola', label: 'Brótola' },
  { value: 'Caballa', label: 'Caballa' },
  { value: 'Castañeta', label: 'Castañeta' },
  { value: 'Cazón', label: 'Cazón' },
  { value: 'Chernia', label: 'Chernia' },
  { value: 'Congrio', label: 'Congrio' },
  { value: 'Corvina', label: 'Corvina' },
  { value: 'Gatuzo', label: 'Gatuzo' },
  { value: 'Lenguado', label: 'Lenguado' },
  { value: 'Merluza común', label: 'Merluza' },
  { value: 'Palometa', label: 'Palometa' },
  { value: 'Pejerrey de mar', label: 'Pejerrey de Mar' },
  { value: 'Pescadilla', label: 'Pescadilla' },
  { value: 'Pez ángel', label: 'Pez Ángel' },
  { value: 'Pez gallo', label: 'Pez Gallo' },
  { value: 'Pez palo', label: 'Pez Palo' },
  { value: 'Rayas', label: 'Rayas' },
  { value: 'Robalo', label: 'Robalo' },
  { value: 'Salmón blanco', label: 'Salmón Blanco' },
  { value: 'Salmonete', label: 'Salmonete' },
  { value: 'Saraca', label: 'Saraca' },
  { value: 'Savorín', label: 'Savorín' },
]

const pescadosDeRio = [
  { value: 'Armado', label: 'Armado' },
  { value: 'Bagre', label: 'Bagre' },
  { value: 'Boga', label: 'Boga' },
  { value: 'Carpa', label: 'Carpa' },
  { value: 'Pacú', label: 'Pacú' },
  { value: 'Patí', label: 'Patí' },
  { value: 'Pejerrey', label: 'Pejerrey' },
  { value: 'Sábalo', label: 'Sábalo' },
  { value: 'Surubí', label: 'Surubí' },
  { value: 'Tararira', label: 'Tararira' },
  { value: 'Trucha', label: 'Trucha' },
]

const mariscos = [
  { value: 'Almeja', label: 'Almeja' },
  { value: 'Berberecho', label: 'Berberecho' },
  { value: 'Calamar', label: 'Calamar' },
  { value: 'Caracoles de mar', label: 'Caracoles de Mar' },
  { value: 'Centolla', label: 'Centolla' },
  { value: 'Cholga', label: 'Cholga' },
  { value: 'Langostino', label: 'Langostino' },
  { value: 'Mejillón', label: 'Mejillón' },
  { value: 'Ostra', label: 'Ostra' },
  { value: 'Pulpo', label: 'Pulpo' },
  { value: 'Vieira', label: 'Vieira' },
]

interface HomeClientProps {
  recetas: ContentEntry[]
  notasDeMar: ContentEntry[]
  saludArticles: ContentEntry[]
}

// Helper: check if a content entry features a specific species
function hasSpecies(entry: ContentEntry, species: string): boolean {
  return (
    entry.featured_species?.some(
      (s) => s.stockProduct.toLowerCase() === species.toLowerCase(),
    ) ?? false
  )
}

// Helper: get primary species name from entry
function getPrimarySpecies(entry: ContentEntry): string {
  return entry.featured_species?.[0]?.stockProduct || 'Pescado'
}

// Helper: get categoria from entry
function getCategoria(entry: ContentEntry): string {
  return entry.featured_species?.[0]?.categoria || ''
}

export default function HomeClient({
  recetas,
  notasDeMar,
  saludArticles,
}: HomeClientProps) {
  const [selectedSpecies, setSelectedSpecies] = useState<string>('todos')

  const filteredRecetas =
    selectedSpecies === 'todos'
      ? recetas
      : recetas.filter((r) => hasSpecies(r, selectedSpecies))

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] bg-white flex items-center justify-center">
        <div className="potluck-container text-center">
          <div className="mb-12 flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="relative flex-shrink-0">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/el_bogavante_logo_mejorado-removebg-preview-NfJrF1t6XnPsXcJj7ZlKfwyYScYxAe.png"
                alt="El Bogavante - Frutos del Mar"
                width={200}
                height={200}
                className="drop-shadow-2xl hover:scale-105 transition-transform duration-300"
                priority
              />
              <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-3xl -z-10 scale-110"></div>
            </div>
            <div className="text-left md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-slate-800 mb-4 leading-tight">
                Pescado y Mariscos
                <br />
                <span className="text-blue-600">Frescos</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-700 mb-6 max-w-2xl leading-relaxed">
                Descubrí la mejor selección de pescado y mariscos frescos. Del
                océano a tu mesa, te ofrecemos calidad que vas a poder saborear.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="#recetas"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Ver Recetas
            </Link>
            <Link
              href="/pages/about"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-full font-semibold transition-all duration-200"
            >
              Conocé El Bogavante
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* RECETAS SECTION - WITH IMAGES */}
      {/* ================================================================ */}
      <section id="recetas" className="py-16 bg-white">
        <div className="potluck-container">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 text-center mb-8">
            Recetas de Pescado
          </h2>
          <p className="text-slate-600 text-center mb-8 max-w-2xl mx-auto">
            Encontrá recetas sencillas y deliciosas para preparar pescado y
            mariscos frescos
          </p>

          {/* Species Filters */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Pescados Marinos */}
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-3 text-center">
                  Pescados Marinos
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => setSelectedSpecies('todos')}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedSpecies === 'todos'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Todos
                  </button>
                  {pescados.map((fish) => (
                    <button
                      key={fish.value}
                      onClick={() => setSelectedSpecies(fish.value)}
                      className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedSpecies === fish.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {fish.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pescados de Río */}
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-3 text-center">
                  Pescados de Río
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {pescadosDeRio.map((fish) => (
                    <button
                      key={fish.value}
                      onClick={() => setSelectedSpecies(fish.value)}
                      className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedSpecies === fish.value
                          ? 'bg-cyan-600 text-white'
                          : 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200'
                      }`}
                    >
                      {fish.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mariscos */}
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-3 text-center">
                  Mariscos
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {mariscos.map((seafood) => (
                    <button
                      key={seafood.value}
                      onClick={() => setSelectedSpecies(seafood.value)}
                      className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedSpecies === seafood.value
                          ? 'bg-teal-600 text-white'
                          : 'bg-teal-100 text-teal-700 hover:bg-teal-200'
                      }`}
                    >
                      {seafood.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recipe Grid - WITH IMAGES */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecetas.map((receta) => (
              <Link
                key={receta.id}
                href={`/blogs/recipes/${receta.slug}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
              >
                {/* IMAGE */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={receta.image_url || '/placeholder-seafood.jpg'}
                    alt={receta.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold">
                    ⭐ {receta.quality_score}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {receta.featured_species?.map((s, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {s.stockProduct}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-2">
                    {receta.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-3 line-clamp-3">
                    {receta.content.slice(0, 150)}...
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{receta.featured_species?.[0]?.categoria}</span>
                    {receta.source_page && <span>p. {receta.source_page}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredRecetas.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-500">
                No se encontraron recetas para esta especie.
              </p>
              <button
                onClick={() => setSelectedSpecies('todos')}
                className="text-blue-600 hover:underline mt-2"
              >
                Ver todas las recetas
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ================================================================ */}
      {/* NOTAS DE MAR - WITH IMAGES */}
      {/* ================================================================ */}
      <section id="notas-de-mar" className="py-16 bg-slate-50">
        <div className="potluck-container">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 text-center mb-12">
            Notas de Mar
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notasDeMar.map((nota) => (
              <Link
                key={nota.id}
                href={`/notas-de-mar/${nota.slug}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={nota.image_url || '/placeholder-notes.jpg'}
                    alt={nota.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {nota.featured_species?.map((s, idx) => (
                      <span
                        key={idx}
                        className="bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {s.stockProduct}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-2">
                    {nota.title}
                  </h3>
                  <p className="text-slate-600 text-sm line-clamp-3">
                    {nota.content.slice(0, 150)}...
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SALUD - WITH IMAGES */}
      {/* ================================================================ */}
      <section id="salud" className="py-16 bg-white">
        <div className="potluck-container">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 text-center mb-12">
            Pescado y Salud
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {saludArticles.map((article) => (
              <Link
                key={article.id}
                href={`/salud/${article.slug}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={article.image_url || '/placeholder-health.jpg'}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {article.featured_species?.map((s, idx) => (
                      <span
                        key={idx}
                        className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {s.stockProduct}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-slate-600 text-sm line-clamp-3">
                    {article.content.slice(0, 150)}...
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
