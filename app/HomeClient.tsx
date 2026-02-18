'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ContentEntry } from '@/lib/supabase'
import type { Oferta } from '@/lib/types'

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

const metodosCoccion = [
  { value: 'Horno', label: '🔥 Horno', icon: '🔥' },
  { value: 'Plancha', label: '🍳 Plancha', icon: '🍳' },
  { value: 'Parrilla', label: '🍖 Parrilla', icon: '🍖' },
  { value: 'Frito', label: '🍤 Frito', icon: '🍤' },
  { value: 'Vapor', label: '♨️ Vapor', icon: '♨️' },
  { value: 'Hervido', label: '🥘 Hervido', icon: '🥘' },
  { value: 'Escabeche', label: '🥗 Escabeche', icon: '🥗' },
  { value: 'Crudo', label: '🍣 Crudo', icon: '🍣' },
  { value: 'Guisado', label: '🍲 Guisado', icon: '🍲' },
]

const NOTAS_CATEGORIES = [
  { value: 'productos', label: 'Productos' },
  { value: 'consejos', label: 'Consejos' },
  { value: 'origen', label: 'Origen' },
  { value: 'curiosidades', label: 'Curiosidades' },
]

const SALUD_CATEGORIES = [
  { value: 'beneficios', label: 'Beneficios' },
  { value: 'nutricion', label: 'Nutrición' },
  { value: 'dietas', label: 'Dietas' },
  { value: 'mitos', label: 'Mitos y verdades' },
]

interface HomeClientProps {
  recetas: ContentEntry[]
  notasDeMar: ContentEntry[]
  saludArticles: ContentEntry[]
  ofertas: Oferta[]
}

function hasSpecies(entry: ContentEntry, species: string): boolean {
  return (
    entry.featured_species?.some(
      (s) => s.stockProduct.toLowerCase() === species.toLowerCase(),
    ) ?? false
  )
}

export default function HomeClient({
  recetas,
  notasDeMar,
  saludArticles,
  ofertas,
}: HomeClientProps) {
  const [selectedSpecies, setSelectedSpecies] = useState<string>('todos')
  const [selectedCookingMethod, setSelectedCookingMethod] =
    useState<string>('todos')
  const [selectedNotasCategory, setSelectedNotasCategory] =
    useState<string>('todos')
  const [selectedSaludCategory, setSelectedSaludCategory] =
    useState<string>('todos')

  let filteredRecetas =
    selectedSpecies === 'todos'
      ? recetas
      : recetas.filter((r) => hasSpecies(r, selectedSpecies))

  if (selectedCookingMethod !== 'todos') {
    filteredRecetas = filteredRecetas.filter((r) => {
      const textToSearch = (r.title + ' ' + r.content).toLowerCase()
      return textToSearch.includes(selectedCookingMethod.toLowerCase())
    })
  }

  const filteredNotasDeMar =
    selectedNotasCategory === 'todos'
      ? notasDeMar
      : notasDeMar.filter((n) => (n as any).category === selectedNotasCategory)

  const filteredSaludArticles =
    selectedSaludCategory === 'todos'
      ? saludArticles
      : saludArticles.filter(
          (s) => (s as any).category === selectedSaludCategory,
        )

  const whatsappNumber = '5491100000000' // Replace with actual number
  const whatsappMessage = encodeURIComponent(
    'Hola! Quiero consultar sobre sus productos 🐟',
  )

  return (
    <div>
      {/* ================================================================ */}
      {/* HERO */}
      {/* ================================================================ */}
      <section className="relative min-h-[70vh] bg-white flex items-center justify-center">
        <div className="potluck-container text-center">
          <div className="mb-12 flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="relative flex-shrink-0">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/el_bogavante_logo_mejorado-removebg-preview-NfJrF1t6XnPsXcJj7ZlKfwyYScYxAe.png"
                alt="El Bogavante"
                width={200}
                height={200}
                className="drop-shadow-2xl hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
            <div className="text-left">
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
              href="#ofertas"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-200 shadow-lg"
            >
              Ver Ofertas
            </Link>
            <Link
              href="#nosotros"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-full font-semibold transition-all duration-200"
            >
              Quiénes Somos
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* QUIÉNES SOMOS */}
      {/* ================================================================ */}
      <section id="nosotros" className="py-16 bg-slate-800 text-white">
        <div className="potluck-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/shop.jpg"
                alt="El Bogavante - Nuestra Pescadería"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-blue-900/20" />
            </div>
            <div>
              <span className="text-blue-400 font-semibold uppercase tracking-widest text-sm mb-3 block">
                Nuestra Historia
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Más de 30 años trayendo el mar a tu mesa
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-6">
                En El Bogavante seleccionamos cada pieza con cuidado, trabajando
                directamente con pescadores locales para garantizar la frescura
                y calidad que merecés.
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-slate-700 rounded-xl p-4">
                  <p className="text-3xl font-black text-blue-400">30+</p>
                  <p className="text-sm text-slate-400 mt-1">
                    Años de experiencia
                  </p>
                </div>
                <div className="bg-slate-700 rounded-xl p-4">
                  <p className="text-3xl font-black text-blue-400">50+</p>
                  <p className="text-sm text-slate-400 mt-1">
                    Especies disponibles
                  </p>
                </div>
                <div className="bg-slate-700 rounded-xl p-4">
                  <p className="text-3xl font-black text-blue-400">100%</p>
                  <p className="text-sm text-slate-400 mt-1">Fresco diario</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* OFERTAS */}
      {/* ================================================================ */}
      {ofertas.length > 0 && (
        <section id="ofertas" className="py-16 bg-orange-50">
          <div className="potluck-container">
            <div className="text-center mb-10">
              <span className="bg-orange-600 text-white text-sm font-bold px-4 py-1 rounded-full uppercase tracking-widest">
                Ofertas
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-4">
                🏷️ Promociones de la Semana
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ofertas.map((oferta) => (
                <div
                  key={oferta.id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow group relative"
                >
                  {/* Discount badge */}
                  {oferta.original_price && oferta.price && (
                    <div className="absolute top-3 left-3 z-10 bg-orange-600 text-white text-xs font-black px-3 py-1 rounded-full">
                      -
                      {Math.round(
                        ((oferta.original_price - oferta.price) /
                          oferta.original_price) *
                          100,
                      )}
                      % OFF
                    </div>
                  )}
                  {oferta.image_url ? (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={oferta.image_url}
                        alt={oferta.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-6xl">
                      🐟
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-slate-800 mb-2">
                      {oferta.title}
                    </h3>
                    {oferta.description && (
                      <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                        {oferta.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3">
                      {oferta.original_price && (
                        <span className="text-slate-400 line-through text-sm">
                          ${oferta.original_price.toLocaleString('es-AR')}
                        </span>
                      )}
                      {oferta.price && (
                        <span className="text-orange-600 font-black text-2xl">
                          ${oferta.price.toLocaleString('es-AR')}
                        </span>
                      )}
                    </div>
                    <a
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hola! Me interesa la oferta: ${oferta.title}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.882l6.198-1.448A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.5-5.207-1.378l-.374-.222-3.878.906.945-3.773-.244-.389A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                      </svg>
                      Consultar por WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================================================================ */}
      {/* RECETAS */}
      {/* ================================================================ */}
      <section id="recetas" className="py-16 bg-white">
        <div className="potluck-container">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 text-center mb-8">
            Recetas de Pescado
          </h2>

          {/* Cooking Methods */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-700 mb-3 text-center">
              Método de Cocción
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setSelectedCookingMethod('todos')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCookingMethod === 'todos'
                    ? 'bg-orange-600 text-white'
                    : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                }`}
              >
                ✨ Todos
              </button>
              {metodosCoccion.map((metodo) => (
                <button
                  key={metodo.value}
                  onClick={() => setSelectedCookingMethod(metodo.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCookingMethod === metodo.value
                      ? 'bg-orange-600 text-white'
                      : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                  }`}
                >
                  {metodo.label}
                </button>
              ))}
            </div>
          </div>

          {/* Species Filters */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecetas.map((receta) => (
              <Link
                key={receta.id}
                href={`/recetas/${receta.slug}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
              >
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
                  <p className="text-slate-600 text-sm line-clamp-3">
                    {receta.resumen || receta.content.slice(0, 150) + '...'}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {filteredRecetas.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-500">No se encontraron recetas.</p>
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
      {/* NOTAS DE MAR */}
      {/* ================================================================ */}
      <section id="notas-de-mar" className="py-16 bg-slate-50">
        <div className="potluck-container">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 text-center mb-8">
            🐟 Notas de Mar
          </h2>
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedNotasCategory('todos')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedNotasCategory === 'todos'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200'
              }`}
            >
              Todas
            </button>
            {NOTAS_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedNotasCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedNotasCategory === cat.value
                    ? 'bg-cyan-600 text-white'
                    : 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotasDeMar.map((nota) => (
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
          {filteredNotasDeMar.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-500">No se encontraron notas.</p>
              <button
                onClick={() => setSelectedNotasCategory('todos')}
                className="text-cyan-600 hover:underline mt-2"
              >
                Ver todas las notas
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ================================================================ */}
      {/* SALUD */}
      {/* ================================================================ */}
      <section id="salud" className="py-16 bg-white">
        <div className="potluck-container">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 text-center mb-8">
            💚 Salud y Nutrición
          </h2>
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedSaludCategory('todos')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedSaludCategory === 'todos'
                  ? 'bg-green-600 text-white'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              Todos
            </button>
            {SALUD_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedSaludCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedSaludCategory === cat.value
                    ? 'bg-green-600 text-white'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSaludArticles.map((articulo) => (
              <Link
                key={articulo.id}
                href={`/salud/${articulo.slug}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={articulo.image_url || '/placeholder-health.jpg'}
                    alt={articulo.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {articulo.featured_species?.map((s, idx) => (
                      <span
                        key={idx}
                        className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {s.stockProduct}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-2">
                    {articulo.title}
                  </h3>
                  <p className="text-slate-600 text-sm line-clamp-3">
                    {articulo.content.slice(0, 150)}...
                  </p>
                </div>
              </Link>
            ))}
          </div>
          {filteredSaludArticles.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-500">No se encontraron artículos.</p>
              <button
                onClick={() => setSelectedSaludCategory('todos')}
                className="text-green-600 hover:underline mt-2"
              >
                Ver todos los artículos
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ================================================================ */}
      {/* WHATSAPP FLOATING BUTTON */}
      {/* ================================================================ */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-2xl hover:shadow-green-500/50 transition-all duration-300 hover:scale-110 flex items-center gap-2 group"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.882l6.198-1.448A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.5-5.207-1.378l-.374-.222-3.878.906.945-3.773-.244-.389A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
        </svg>
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap text-sm font-semibold">
          Consultanos!
        </span>
      </a>
    </div>
  )
}
