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

const NAV_LINKS = [
  { href: '#nosotros', label: 'Quiénes Somos' },
  { href: '#ofertas', label: 'Ofertas' },
  { href: '#recetas', label: 'Recetas' },
  { href: '#notas-de-mar', label: 'Notas de Mar' },
  { href: '#salud', label: 'Salud' },
]

// 👇 Replace with your Cloudinary URL once you upload the video
const HERO_VIDEO_URL =
  'https://res.cloudinary.com/dwhu22onh/video/upload/v1771435910/Dise%C3%B1o_sin_t%C3%ADtulo_1_atum2o.mp4'
const HERO_FALLBACK_IMAGE = '/shop.jpg'

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

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={active ? 'filter-btn-active' : 'filter-btn'}
    >
      {children}
    </button>
  )
}

export default function HomeClient({
  recetas,
  notasDeMar,
  saludArticles,
  ofertas,
}: HomeClientProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedSpecies, setSelectedSpecies] = useState<string>('todos')
  const [selectedCookingMethod, setSelectedCookingMethod] =
    useState<string>('todos')
  const [selectedNotasCategory, setSelectedNotasCategory] =
    useState<string>('todos')
  const [selectedSaludCategory, setSelectedSaludCategory] =
    useState<string>('todos')

  // ── Filter logic (untouched) ──────────────────────────────────────────
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
  // ─────────────────────────────────────────────────────────────────────

  const whatsappNumber = '5491100000000'
  const whatsappMessage = encodeURIComponent(
    'Hola! Quiero consultar sobre sus productos 🐟',
  )

  return (
    <div className="bg-[#F8F9FB]">
      {/* ══════════════════════════════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════════════════════════════ */}
      <header className="bg-[#2B2E78] sticky top-0 z-50 shadow-lg">
        <div className="potluck-container flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/el_bogavante_logo_mejorado-removebg-preview-NfJrF1t6XnPsXcJj7ZlKfwyYScYxAe.png"
              alt="El Bogavante"
              width={36}
              height={36}
              className="drop-shadow"
            />
            <span className="font-playfair text-white text-lg font-bold tracking-wide">
              El Bogavante
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-white/80 hover:text-white text-sm font-medium transition-colors hover:text-[#00B3A4]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Abrir menú"
          >
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}
            />
          </button>
        </div>

        {/* Mobile menu dropdown */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-96 border-t border-white/10' : 'max-h-0'}`}
        >
          <nav className="potluck-container py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-white/80 hover:text-[#00B3A4] py-2.5 px-4 rounded-lg hover:bg-white/5 text-sm font-medium transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════
          HERO — Video background (falls back to image if no video)
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] bg-[#2B2E78] overflow-hidden flex items-center">
        {/* Video OR image background */}
        {HERO_VIDEO_URL ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          >
            <source src={HERO_VIDEO_URL} type="video/mp4" />
          </video>
        ) : (
          <div className="absolute inset-0">
            <Image
              src={HERO_FALLBACK_IMAGE}
              alt="El Bogavante"
              fill
              className="object-cover opacity-20"
              priority
            />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#2B2E78] via-[#2B2E78]/90 to-[#2B2E78]/50" />

        {/* Accent blobs */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#00B3A4]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-[#E23C4B]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="potluck-container relative z-10 w-full">
          <div className="max-w-2xl py-24 md:py-32">
            <span className="inline-block bg-[#00B3A4]/20 text-[#00B3A4] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6 border border-[#00B3A4]/30">
              Pescadería Artesanal · Desde 1994
            </span>
            <h1 className="font-playfair text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Del Mar
              <br />
              <span className="text-[#00B3A4]">a Tu Mesa</span>
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-lg">
              La mejor selección de pescado fresco y mariscos de temporada.
              Calidad que se siente en cada bocado.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#ofertas" className="btn-primary">
                Ver Ofertas
              </a>
              <a
                href="#nosotros"
                className="inline-flex items-center border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-6 py-3 rounded-full transition-all duration-200"
              >
                Quiénes Somos
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10 max-w-sm">
              {[
                { value: '30+', label: 'Años' },
                { value: '50+', label: 'Especies' },
                { value: '100%', label: 'Fresco' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-playfair text-3xl font-bold text-[#E23C4B]">
                    {stat.value}
                  </p>
                  <p className="text-white/50 text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 animate-bounce">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          QUIÉNES SOMOS
      ══════════════════════════════════════════════════════════════════ */}
      <section id="nosotros" className="py-20 bg-white">
        <div className="potluck-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full bg-[#00B3A4]/10 rounded-3xl" />
              <div className="relative h-80 md:h-[480px] rounded-3xl overflow-hidden shadow-2xl border border-[#E5E7EB]">
                <Image
                  src="/shop.jpg"
                  alt="El Bogavante - Nuestra Pescadería"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div>
              <span className="section-label">Nuestra Historia</span>
              <h2 className="section-title mt-3 mb-6">
                Más de 30 años
                <br />
                <span className="text-[#2B2E78]">
                  trayendo el mar a tu mesa
                </span>
              </h2>
              <p className="text-[#6B7280] text-lg leading-relaxed mb-8">
                En El Bogavante seleccionamos cada pieza con cuidado, trabajando
                directamente con pescadores locales para garantizar la frescura
                y calidad que merecés en cada visita.
              </p>
              <div className="grid grid-cols-1 gap-4">
                {[
                  {
                    icon: '🎣',
                    title: 'Origen Controlado',
                    desc: 'Trabajamos con pescadores artesanales de confianza',
                  },
                  {
                    icon: '❄️',
                    title: 'Cadena de Frío',
                    desc: 'Del barco a tu plato sin interrupciones',
                  },
                  {
                    icon: '🏆',
                    title: 'Calidad Garantizada',
                    desc: 'Más de 30 años avalando nuestra selección',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-[#F8F9FB] border border-[#E5E7EB]"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-[#1F2937]">
                        {item.title}
                      </p>
                      <p className="text-[#6B7280] text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          OFERTAS
      ══════════════════════════════════════════════════════════════════ */}
      {ofertas.length > 0 && (
        <section id="ofertas" className="py-20 bg-[#F8F9FB]">
          <div className="potluck-container">
            <div className="text-center mb-12">
              <span className="section-label">Promociones</span>
              <h2 className="section-title mt-3">Ofertas de la Semana</h2>
              <p className="text-[#6B7280] mt-3 max-w-xl mx-auto">
                Aprovechá nuestras promociones semanales con los mejores
                productos del mar
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ofertas.map((oferta) => (
                <div
                  key={oferta.id}
                  className="card group overflow-hidden relative"
                >
                  {oferta.original_price && oferta.price && (
                    <div className="absolute top-3 left-3 z-10 bg-[#E23C4B] text-white text-xs font-black px-3 py-1 rounded-full shadow">
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
                    <div className="relative h-52 overflow-hidden">
                      <Image
                        src={oferta.image_url}
                        alt={oferta.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>
                  ) : (
                    <div className="h-52 bg-gradient-to-br from-[#2B2E78]/10 to-[#00B3A4]/10 flex items-center justify-center text-6xl">
                      🐟
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-playfair font-bold text-lg text-[#1F2937] mb-2">
                      {oferta.title}
                    </h3>
                    {oferta.description && (
                      <p className="text-[#6B7280] text-sm mb-4 line-clamp-2">
                        {oferta.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mb-4">
                      {oferta.original_price && (
                        <span className="text-[#6B7280] line-through text-sm">
                          ${oferta.original_price.toLocaleString('es-AR')}
                        </span>
                      )}
                      {oferta.price && (
                        <span className="text-[#E23C4B] font-black text-2xl font-playfair">
                          ${oferta.price.toLocaleString('es-AR')}
                        </span>
                      )}
                    </div>
                    <a
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hola! Me interesa la oferta: ${oferta.title}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary w-full flex items-center justify-center gap-2 text-sm"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.882l6.198-1.448A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.5-5.207-1.378l-.374-.222-3.878.906.945-3.773-.244-.389A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                      </svg>
                      Consultar
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          RECETAS
      ══════════════════════════════════════════════════════════════════ */}
      <section id="recetas" className="py-20 bg-white">
        <div className="potluck-container">
          <div className="text-center mb-12">
            <span className="section-label">Cocina del Mar</span>
            <h2 className="section-title mt-3">Recetas de Pescado</h2>
            <p className="text-[#6B7280] mt-3 max-w-xl mx-auto">
              Inspirate con nuestras recetas cuidadosamente seleccionadas
            </p>
          </div>

          {/* Cooking Method Filter */}
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-[#6B7280] mb-3 text-center">
              Método de Cocción
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <FilterButton
                active={selectedCookingMethod === 'todos'}
                onClick={() => setSelectedCookingMethod('todos')}
              >
                ✨ Todos
              </FilterButton>
              {metodosCoccion.map((m) => (
                <FilterButton
                  key={m.value}
                  active={selectedCookingMethod === m.value}
                  onClick={() => setSelectedCookingMethod(m.value)}
                >
                  {m.label}
                </FilterButton>
              ))}
            </div>
          </div>

          {/* Species Filter */}
          <div className="mb-10 p-6 bg-[#F8F9FB] rounded-2xl border border-[#E5E7EB]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#2B2E78] mb-3 text-center">
                  Pescados Marinos
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <FilterButton
                    active={selectedSpecies === 'todos'}
                    onClick={() => setSelectedSpecies('todos')}
                  >
                    Todos
                  </FilterButton>
                  {pescados.map((f) => (
                    <FilterButton
                      key={f.value}
                      active={selectedSpecies === f.value}
                      onClick={() => setSelectedSpecies(f.value)}
                    >
                      {f.label}
                    </FilterButton>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#2B2E78] mb-3 text-center">
                  Pescados de Río
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {pescadosDeRio.map((f) => (
                    <FilterButton
                      key={f.value}
                      active={selectedSpecies === f.value}
                      onClick={() => setSelectedSpecies(f.value)}
                    >
                      {f.label}
                    </FilterButton>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#2B2E78] mb-3 text-center">
                  Mariscos
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {mariscos.map((s) => (
                    <FilterButton
                      key={s.value}
                      active={selectedSpecies === s.value}
                      onClick={() => setSelectedSpecies(s.value)}
                    >
                      {s.label}
                    </FilterButton>
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
                className="card group overflow-hidden"
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={receta.image_url || '/placeholder-seafood.jpg'}
                    alt={receta.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-[#2B2E78]">
                    ⭐ {receta.quality_score}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {receta.featured_species?.slice(0, 2).map((s, idx) => (
                      <span key={idx} className="tag-teal">
                        {s.stockProduct}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-playfair font-bold text-lg text-[#1F2937] mb-2 line-clamp-2">
                    {receta.title}
                  </h3>
                  <p className="text-[#6B7280] text-sm line-clamp-3">
                    {receta.resumen || receta.content.slice(0, 150) + '...'}
                  </p>
                  <div className="mt-4 flex items-center text-[#00B3A4] text-sm font-medium">
                    Ver receta
                    <svg
                      className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredRecetas.length === 0 && (
            <div className="text-center py-16">
              <p className="text-6xl mb-4">🔍</p>
              <p className="text-[#6B7280] text-lg mb-4">
                No se encontraron recetas con esos filtros.
              </p>
              <button
                onClick={() => {
                  setSelectedSpecies('todos')
                  setSelectedCookingMethod('todos')
                }}
                className="btn-secondary"
              >
                Ver todas las recetas
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          NOTAS DE MAR
      ══════════════════════════════════════════════════════════════════ */}
      <section id="notas-de-mar" className="py-20 bg-[#F8F9FB]">
        <div className="potluck-container">
          <div className="text-center mb-12">
            <span className="section-label">El Mundo del Mar</span>
            <h2 className="section-title mt-3">Notas de Mar</h2>
            <p className="text-[#6B7280] mt-3 max-w-xl mx-auto">
              Conocé más sobre los productos del mar, su origen y curiosidades
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <FilterButton
              active={selectedNotasCategory === 'todos'}
              onClick={() => setSelectedNotasCategory('todos')}
            >
              Todas
            </FilterButton>
            {NOTAS_CATEGORIES.map((cat) => (
              <FilterButton
                key={cat.value}
                active={selectedNotasCategory === cat.value}
                onClick={() => setSelectedNotasCategory(cat.value)}
              >
                {cat.label}
              </FilterButton>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotasDeMar.map((nota) => (
              <Link
                key={nota.id}
                href={`/notas-de-mar/${nota.slug}`}
                className="card group overflow-hidden"
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={nota.image_url || '/placeholder-notes.jpg'}
                    alt={nota.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {nota.featured_species?.slice(0, 2).map((s, idx) => (
                      <span key={idx} className="tag-navy">
                        {s.stockProduct}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-playfair font-bold text-lg text-[#1F2937] mb-2 line-clamp-2">
                    {nota.title}
                  </h3>
                  <p className="text-[#6B7280] text-sm line-clamp-3">
                    {nota.content.slice(0, 150)}...
                  </p>
                  <div className="mt-4 flex items-center text-[#4DA8DA] text-sm font-medium">
                    Leer más
                    <svg
                      className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {filteredNotasDeMar.length === 0 && (
            <div className="text-center py-16">
              <p className="text-6xl mb-4">🌊</p>
              <p className="text-[#6B7280] text-lg mb-4">
                No se encontraron notas.
              </p>
              <button
                onClick={() => setSelectedNotasCategory('todos')}
                className="btn-secondary"
              >
                Ver todas las notas
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SALUD
      ══════════════════════════════════════════════════════════════════ */}
      <section id="salud" className="py-20 bg-white">
        <div className="potluck-container">
          <div className="text-center mb-12">
            <span className="section-label">Bienestar</span>
            <h2 className="section-title mt-3">Salud y Nutrición</h2>
            <p className="text-[#6B7280] mt-3 max-w-xl mx-auto">
              Descubrí los beneficios de incorporar pescado a tu dieta
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <FilterButton
              active={selectedSaludCategory === 'todos'}
              onClick={() => setSelectedSaludCategory('todos')}
            >
              Todos
            </FilterButton>
            {SALUD_CATEGORIES.map((cat) => (
              <FilterButton
                key={cat.value}
                active={selectedSaludCategory === cat.value}
                onClick={() => setSelectedSaludCategory(cat.value)}
              >
                {cat.label}
              </FilterButton>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSaludArticles.map((articulo) => (
              <Link
                key={articulo.id}
                href={`/salud/${articulo.slug}`}
                className="card group overflow-hidden"
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={articulo.image_url || '/placeholder-health.jpg'}
                    alt={articulo.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {articulo.featured_species?.slice(0, 2).map((s, idx) => (
                      <span key={idx} className="tag-teal">
                        {s.stockProduct}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-playfair font-bold text-lg text-[#1F2937] mb-2 line-clamp-2">
                    {articulo.title}
                  </h3>
                  <p className="text-[#6B7280] text-sm line-clamp-3">
                    {articulo.content.slice(0, 150)}...
                  </p>
                  <div className="mt-4 flex items-center text-[#00B3A4] text-sm font-medium">
                    Leer más
                    <svg
                      className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {filteredSaludArticles.length === 0 && (
            <div className="text-center py-16">
              <p className="text-6xl mb-4">💚</p>
              <p className="text-[#6B7280] text-lg mb-4">
                No se encontraron artículos.
              </p>
              <button
                onClick={() => setSelectedSaludCategory('todos')}
                className="btn-secondary"
              >
                Ver todos los artículos
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════════════ */}
      <footer className="bg-[#2B2E78] text-white">
        <div className="potluck-container py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/el_bogavante_logo_mejorado-removebg-preview-NfJrF1t6XnPsXcJj7ZlKfwyYScYxAe.png"
                  alt="El Bogavante"
                  width={48}
                  height={48}
                />
                <span className="font-playfair text-2xl font-bold">
                  El Bogavante
                </span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                Pescadería artesanal con más de 30 años de experiencia. Calidad,
                frescura y pasión por el mar.
              </p>
            </div>
            <div>
              <h4 className="font-playfair font-bold text-lg mb-4">
                Navegación
              </h4>
              <ul className="space-y-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-white/60 hover:text-[#00B3A4] text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-playfair font-bold text-lg mb-4">Contacto</h4>
              <div className="space-y-3">
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/60 hover:text-[#00B3A4] text-sm transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.882l6.198-1.448A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.5-5.207-1.378l-.374-.222-3.878.906.945-3.773-.244-.389A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                  </svg>
                  WhatsApp
                </a>
                <p className="text-white/60 text-sm">Buenos Aires, Argentina</p>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="potluck-container py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-white/40 text-xs">
              © {new Date().getFullYear()} El Bogavante. Todos los derechos
              reservados.
            </p>
            <p className="text-white/40 text-xs">
              Hecho con ❤️ en Buenos Aires
            </p>
          </div>
        </div>
      </footer>

      {/* ══════════════════════════════════════════════════════════════════
          WHATSAPP FLOATING BUTTON
      ══════════════════════════════════════════════════════════════════ */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 flex items-center gap-2 group"
        aria-label="Contactar por WhatsApp"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.882l6.198-1.448A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.5-5.207-1.378l-.374-.222-3.878.906.945-3.773-.244-.389A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
        </svg>
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap text-sm font-semibold pr-1">
          Consultanos!
        </span>
      </a>
    </div>
  )
}
