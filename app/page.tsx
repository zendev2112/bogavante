"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

const recipes = [
  {
    id: 1,
    title: "Salmón a la Plancha con Limón",
    fishType: "salmon",
    image: "/pan-seared-salmon-lemon.png",
    cookTime: "15 min",
    cookingMethod: "A la Plancha",
    description: "Salmón jugoso cocinado a la perfección con un toque de limón bien fresco",
  },
  {
    id: 2,
    title: "Lubina a la Parrilla",
    fishType: "lubina",
    image: "/grilled-sea-bass.png",
    cookTime: "20 min",
    cookingMethod: "A la Parrilla",
    description: "Lubina tiernita a la parrilla con hierbas mediterráneas",
  },
  {
    id: 3,
    title: "Langostinos Salteados",
    fishType: "langostinos",
    image: "/prawn-stir-fry.png",
    cookTime: "10 min",
    cookingMethod: "Salteado",
    description: "Langostinos fresquitos salteados con ajo y perejil",
  },
  {
    id: 4,
    title: "Bacalao al Horno con Tomate",
    fishType: "bacalao",
    image: "/baked-cod-tomatoes.png",
    cookTime: "25 min",
    cookingMethod: "Al Horno",
    description: "Bacalao horneado con tomates frescos y aceite de oliva bien rico",
  },
  {
    id: 5,
    title: "Atún a la Plancha",
    fishType: "atun",
    image: "/grilled-tuna-steak.png",
    cookTime: "12 min",
    cookingMethod: "A la Plancha",
    description: "Filete de atún sellado con costra de sésamo, una delicia",
  },
  {
    id: 6,
    title: "Merluza en Salsa Verde",
    fishType: "merluza",
    image: "/hake-green-sauce.png",
    cookTime: "18 min",
    cookingMethod: "Hervido",
    description: "Merluza fresca en salsa verde con arvejas, un plato de lujo",
  },
  {
    id: 7,
    title: "Corvina al Vapor con Jengibre",
    fishType: "corvina",
    image: "/steamed-corvina-ginger.png",
    cookTime: "20 min",
    cookingMethod: "Al Vapor",
    description: "Corvina al vapor con jengibre y cebollita de verdeo, súper saludable",
  },
  {
    id: 8,
    title: "Calamares Fritos",
    fishType: "calamares",
    image: "/fried-calamari.png",
    cookTime: "8 min",
    cookingMethod: "Frito",
    description: "Anillos de calamar fritos bien crocantes con limón",
  },
  {
    id: 9,
    title: "Lenguado Empanado",
    fishType: "lenguado",
    image: "/breaded-sole.png",
    cookTime: "15 min",
    cookingMethod: "Empanado",
    description: "Filete de lenguado empanado doradito, un clásico que no falla",
  },
  {
    id: 10,
    title: "Salmón Ahumado Casero",
    fishType: "salmon",
    image: "/placeholder-1ibpr.png",
    cookTime: "2 horas",
    cookingMethod: "Ahumado",
    description: "Salmón ahumado en casa con madera de manzano, de lujo",
  },
  {
    id: 11,
    title: "Ceviche de Corvina",
    fishType: "corvina",
    image: "/corvina-ceviche-lime.png",
    cookTime: "30 min",
    cookingMethod: "Crudo",
    description: "Corvina marinada en limón con cebolla morada y cilantro",
  },
  {
    id: 12,
    title: "Mejillones en Escabeche",
    fishType: "mejillones",
    image: "/mussels-escabeche.png",
    cookTime: "25 min",
    cookingMethod: "En Escabeche",
    description: "Mejillones frescos en escabeche con laurel y pimienta",
  },
]

const notasDeMarArticles = [
  {
    id: 1,
    title: "Cómo Elegir Pescado Fresco en la Pescadería",
    category: "Compras",
    image: "/fresh-fish-selection.png",
    readTime: "5 min",
    description: "Aprende a identificar las señales de frescura: ojos brillantes, agallas rojas y olor a mar.",
  },
  {
    id: 2,
    title: "Técnicas para Limpiar Pescado como un Profesional",
    category: "Preparación",
    image: "/cleaning-fish-technique.png",
    readTime: "8 min",
    description: "Paso a paso para limpiar y filetear pescado sin desperdiciar nada.",
  },
  {
    id: 3,
    title: "Los Secretos de la Cocción Perfecta",
    category: "Cocción",
    image: "/perfect-seafood-cooking.png",
    readTime: "6 min",
    description: "Temperaturas, tiempos y técnicas para que el pescado quede jugoso y sabroso.",
  },
  {
    id: 4,
    title: "Marinadas que Transforman el Sabor",
    category: "Sabores",
    image: "/fish-marinades.png",
    readTime: "4 min",
    description: "Recetas de marinadas que realzan el sabor natural del pescado y mariscos.",
  },
]

const saludArticles = [
  {
    id: 1,
    title: "Omega-3: El Tesoro Nutricional del Mar",
    category: "Nutrición",
    image: "/omega3-benefits.png",
    readTime: "7 min",
    description: "Todo sobre los ácidos grasos esenciales y por qué son fundamentales para tu salud.",
  },
  {
    id: 2,
    title: "Pescado vs Carne: Comparación Nutricional",
    category: "Comparación",
    image: "/fish-vs-meat-nutrition.png",
    readTime: "6 min",
    description: "Análisis completo de proteínas, grasas y micronutrientes entre pescado y carne roja.",
  },
  {
    id: 3,
    title: "Pescado en la Dieta Infantil: Guía Completa",
    category: "Familia",
    image: "/fish-for-children.png",
    readTime: "8 min",
    description: "Cuándo introducir pescado en la alimentación de los chicos y qué especies elegir.",
  },
  {
    id: 4,
    title: "Beneficios del Pescado para Deportistas",
    category: "Deporte",
    image: "/fish-sports-nutrition.png",
    readTime: "5 min",
    description: "Cómo el pescado puede mejorar tu rendimiento deportivo y recuperación muscular.",
  },
]

const pescados = [
  { value: "salmon", label: "Salmón" },
  { value: "merluza", label: "Merluza" },
  { value: "corvina", label: "Corvina" },
  { value: "lenguado", label: "Lenguado" },
  { value: "besugo", label: "Besugo" },
  { value: "abadejo", label: "Abadejo" },
  { value: "atun", label: "Atún" },
  { value: "lubina", label: "Lubina" },
  { value: "bacalao", label: "Bacalao" },
  { value: "pescadilla", label: "Pescadilla" },
  { value: "brótola", label: "Brótola" },
  { value: "anchoas", label: "Anchoas" },
  { value: "sardinas", label: "Sardinas" },
]

const mariscos = [
  { value: "langostinos", label: "Langostinos" },
  { value: "centolla", label: "Centolla" },
  { value: "mejillones", label: "Mejillones" },
  { value: "almejas", label: "Almejas" },
  { value: "calamares", label: "Calamares" },
  { value: "pulpo", label: "Pulpo" },
  { value: "vieiras", label: "Vieiras" },
  { value: "cangrejo", label: "Cangrejo" },
  { value: "ostras", label: "Ostras" },
  { value: "cholgas", label: "Cholgas" },
  { value: "rabas", label: "Rabas" },
]

const cookingMethods = [
  { value: "todos", label: "Todos los Métodos" },
  { value: "A la Plancha", label: "A la Plancha" },
  { value: "A la Parrilla", label: "A la Parrilla" },
  { value: "Al Horno", label: "Al Horno" },
  { value: "Al Vapor", label: "Al Vapor" },
  { value: "Salteado", label: "Salteado" },
  { value: "Hervido", label: "Hervido" },
  { value: "Frito", label: "Frito" },
  { value: "Empanado", label: "Empanado" },
  { value: "Ahumado", label: "Ahumado" },
  { value: "Crudo", label: "Crudo" },
  { value: "En Escabeche", label: "En Escabeche" },
]

export default function HomePage() {
  const [selectedFish, setSelectedFish] = useState<string>("todos")
  const [selectedCookingMethod, setSelectedCookingMethod] = useState<string>("todos")

  const filteredRecipes = recipes.filter((recipe) => {
    const fishMatch = selectedFish === "todos" || recipe.fishType === selectedFish
    const cookingMatch = selectedCookingMethod === "todos" || recipe.cookingMethod === selectedCookingMethod
    return fishMatch && cookingMatch
  })

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
              {/* Subtle glow effect behind logo */}
              <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-3xl -z-10 scale-110"></div>
            </div>

            <div className="text-left md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-slate-800 mb-4 leading-tight">
                Pescado y Mariscos
                <br />
                <span className="text-blue-600">Frescos</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-700 mb-6 max-w-2xl leading-relaxed">
                Descubrí la mejor selección de pescado y mariscos frescos. Del océano a tu mesa, te ofrecemos calidad
                que vas a poder saborear.
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

      <section id="recetas" className="py-16 bg-white">
        <div className="potluck-container">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 text-center mb-8">Recetas de Pescado</h2>
          <p className="text-slate-600 text-center mb-8 max-w-2xl mx-auto">
            Encontrá recetas sencillas y deliciosas para preparar pescado y mariscos frescos
          </p>

          {/* Cooking Method Filters Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-700 mb-3 text-center">Método de Cocción</h3>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {cookingMethods.map((method) => (
                <button
                  key={method.value}
                  onClick={() => setSelectedCookingMethod(method.value)}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCookingMethod === method.value
                      ? "bg-orange-600 text-white"
                      : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                  }`}
                >
                  {method.label}
                </button>
              ))}
            </div>
          </div>

          {/* Fish Type Filter Buttons */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Pescados Section */}
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-3 text-center">Pescados</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => setSelectedFish("todos")}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedFish === "todos"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Todos
                  </button>
                  {pescados.map((fish) => (
                    <button
                      key={fish.value}
                      onClick={() => setSelectedFish(fish.value)}
                      className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedFish === fish.value
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {fish.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mariscos Section */}
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-3 text-center">Mariscos</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {mariscos.map((seafood) => (
                    <button
                      key={seafood.value}
                      onClick={() => setSelectedFish(seafood.value)}
                      className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedFish === seafood.value
                          ? "bg-teal-600 text-white"
                          : "bg-teal-100 text-teal-700 hover:bg-teal-200"
                      }`}
                    >
                      {seafood.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recipe Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video relative">
                  <Image src={recipe.image || "/placeholder.svg"} alt={recipe.title} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-slate-800 mb-2">{recipe.title}</h3>
                  <p className="text-slate-600 text-sm mb-3">{recipe.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-medium text-sm">⏱️ {recipe.cookTime}</span>
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                      {recipe.cookingMethod}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredRecipes.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-500">No se encontraron recetas con estos filtros.</p>
              <div className="mt-2 space-x-4">
                <button onClick={() => setSelectedFish("todos")} className="text-blue-600 hover:underline">
                  Ver todos los pescados
                </button>
                <button onClick={() => setSelectedCookingMethod("todos")} className="text-orange-600 hover:underline">
                  Ver todos los métodos
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured Fish */}
      <section className="py-16 bg-white">
        <div className="potluck-container">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 text-center mb-12">Pescado Fresco de Hoy</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group">
              <div className="aspect-square relative overflow-hidden bg-gray-100 rounded-lg">
                <Image
                  src="/fresh-salmon-fillet.png"
                  alt="Salmón Fresco"
                  fill
                  className="object-cover transition-all duration-300 group-hover:scale-105"
                />
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-xl font-bold text-slate-800">Salmón Atlántico</h3>
                <p className="text-slate-700 mt-2">Rico en omega-3, perfecto para la parrilla o al horno</p>
              </div>
            </div>

            <div className="group">
              <div className="aspect-square relative overflow-hidden bg-gray-100 rounded-lg">
                <Image
                  src="/fresh-sea-bass.png"
                  alt="Lubina"
                  fill
                  className="object-cover transition-all duration-300 group-hover:scale-105"
                />
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-xl font-bold text-slate-800">Lubina</h3>
                <p className="text-slate-700 mt-2">Sabor delicado, ideal para cocinar a la plancha</p>
              </div>
            </div>

            <div className="group">
              <div className="aspect-square relative overflow-hidden bg-gray-100 rounded-lg">
                <Image
                  src="/fresh-prawns-shrimp.png"
                  alt="Langostinos Frescos"
                  fill
                  className="object-cover transition-all duration-300 group-hover:scale-105"
                />
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-xl font-bold text-slate-800">Langostinos Rojos</h3>
                <p className="text-slate-700 mt-2">Dulces y suculentos, perfectos para pasta o salteados</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notas de Mar Section */}
      <section id="notas-de-mar" className="py-16 bg-white">
        <div className="potluck-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Notas de Mar</h2>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Consejos y secretos para cocinar pescado y mariscos como un profesional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {notasDeMarArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="aspect-video relative">
                  <Image src={article.image || "/placeholder.svg"} alt={article.title} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {article.category}
                    </span>
                    <span className="text-slate-500 text-sm">{article.readTime}</span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-800 mb-2">{article.title}</h3>
                  <p className="text-slate-600 text-sm">{article.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/notas-de-mar"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-200"
            >
              Ver Todos los Consejos
            </Link>
          </div>
        </div>
      </section>

      {/* Salud Section */}
      <section id="salud" className="py-16 bg-white">
        <div className="potluck-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Pescado y Salud</h2>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Descubrí todos los beneficios que el pescado y los mariscos aportan a tu salud
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {saludArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="aspect-video relative">
                  <Image src={article.image || "/placeholder.svg"} alt={article.title} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      {article.category}
                    </span>
                    <span className="text-slate-500 text-sm">{article.readTime}</span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-800 mb-2">{article.title}</h3>
                  <p className="text-slate-600 text-sm">{article.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/salud"
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-200"
            >
              Ver Artículos de Salud
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="potluck-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">Fresco del Océano, Todos los Días</h2>
              <p className="text-slate-700 text-lg mb-6">
                Nuestra pescadería familiar lleva más de 30 años sirviendo a la comunidad. Nos abastecemos directamente
                de pescadores locales y proveedores de confianza para ofrecerte la pesca más fresca todos los días.
              </p>
              <Link href="/pages/about" className="inline-block text-blue-600 font-bold uppercase hover:underline">
                Conocé Nuestra Historia →
              </Link>
            </div>
            <div className="relative aspect-square">
              <Image
                src="/shop-interior-el-bogavante.png"
                alt="Interior de El Bogavante - Pescadería"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
